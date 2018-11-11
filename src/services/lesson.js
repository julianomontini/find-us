const validate = require('validate.js');
const moment = require('moment');
const _ = require('lodash');

const _v = require('../api/validations');
const errorBuilder = require('../api/errorBuilder');
const { Lesson, LessonCandidate, Sequelize: { Op }, sequelize, Rating, Customer } = require('../../models');
const elasticApi = require('../elasticsearch/api');
const sms = require('../aws/sms');


const lessonService = {};

const updateElastic = async lesson => {
    let elasticLesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        price: lesson.price,
        location: lesson.location
    }
    return elasticApi.lesson.createOrUpdate(elasticLesson);
}

lessonService.listByStudent = async studentId => {
    return Lesson.findAll(
        {
            where: {
                studentId
            },
            attributes: ['id', 'title', 'description'],
            include: [
                {
                    model: Customer,
                    as: 'Teacher',
                    attributes: ['id', 'name', 'phone']
                }
            ]
        }
    )
}

lessonService.create = async (studentId, data) => {
    let validations = {..._v.lesson};
    let validationResult = validate(data, validations);
    if(validationResult)
        return Promise.reject(errorBuilder(400, validationResult));

    if(!isValidDuration(data.startTime, data.endTime))
        return Promise.reject(errorBuilder(400, 'Start time must be after End time'))

    let lesson = await Lesson
        .create({
            title: data.title,
            description: data.description,
            startTime: data.startTime,
            endTime: data.endTime,
            price: data.price,
            studentId,
            location: data.location
        });

    await updateElastic(lesson);

    let candidates = (await elasticApi.customer.findSuggestionsForLesson(lesson.title, lesson.description)).hits.hits;
    candidates = candidates.map(c => c._id).filter(id => id !== studentId);

    candidates = await Customer.findAll({
        where: {
            id: candidates
        }
    });

    let smss = [];

    candidates.forEach(c => {
        let message = `Oba! Achamos que a aula "${lesson.title}" vai lhe interessar. Entre na plataforma e procure pelo id ${lesson.id}`
        smss.push(sms(message, c.phone))
    })

    await Promise.all(smss);

    return lessonService.get(studentId, lesson.id);
}

lessonService.update = async(studentId, lessonId, data) => {
    let lesson = await Lesson.findById(lessonId);
        if(!lesson)
            return Promise.reject(errorBuilder(404));
        if(lesson.StudentId != studentId)
            return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));
        
        lesson = _.merge(lesson, data);

        if(data.location)
            lesson.location = data.location;

        let validationResult = validate(lesson, _v.lesson);
        if(validationResult)
            return Promise.reject(errorBuilder(400, validationResult));

        if(!isValidDuration(lesson.startTime, lesson.endTime))
            return Promise.reject(errorBuilder(400, 'Start time must be after End time'));

        await lesson.save();

        await updateElastic(lesson);

        return lessonService.get(studentId, lesson.id);
}

lessonService.getCandidates = async(studentId, lessonId) => {
    let lesson = await Lesson.findById(lessonId);
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));

    const query = `
        SELECT 
            C.ID,
            C.NAME,
            (
                SELECT AVG(VALUE)
                FROM RATINGS r
                WHERE r.TOCUSTOMERID = C.ID
                AND r.ROLE = 'Teacher'
                AND r.STATUS = 'completed'
            ) as RATING
        FROM CUSTOMERS C
        JOIN LESSONCANDIDATES LC
        ON C.ID = LC.TEACHERID
        AND LC.STATUS = 'pending'
        WHERE LC.LESSONID = ?
    `;

    return sequelize.query(query, {replacements: [lessonId], type: sequelize.QueryTypes.SELECT})
}

lessonService.approveCandidate = async(studentId, lessonId, teacherId) => {
    let lesson = await Lesson.findById(lessonId, {
        include: [
            {
                model: Customer,
                as: 'Student'
            }
        ]
    });
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));
    if(lesson.TeacherId)
        return Promise.reject(errorBuilder(403, "Lesson already have an approved teacher"));

    let subscription = await LessonCandidate.findOne(
        {
            where: {
                lessonId,
                teacherId,
                status: 'pending'
            }
        }
    )

    if(!subscription)
        return Promise.reject(errorBuilder(404));

    let teacher = await subscription.getTeacher();
    let student = lesson.Student;

    let message = `O aluno ${student.name} aceitou a sua proposta para a aula ${lesson.title}!`
    await sms(message, teacher.phone);

    return sequelize.transaction(async tr => {
        await Rating.create(
            {
                fromCustomerId: studentId,
                toCustomerId: teacherId,
                lessonId,
                role: 'Teacher'
            }
        )
        await Rating.create(
            {
                toCustomerId: studentId,
                fromCustomerId: teacherId,
                lessonId,
                role: 'Student'
            }
        )
        await LessonCandidate
            .update(
                {
                    status: 'rejected'
                },
                {
                    where: {
                        teacherID : { [Op.ne]: teacherId },
                        lessonId
                    },
                    transaction: tr
                }
            )

        await LessonCandidate
            .update(
                {
                    status: 'approved'
                },
                {
                    where: {
                        teacherId,
                        lessonId
                    },
                    transaction: tr
                }
            )

        await Lesson
            .update(
                {
                    teacherId
                },
                {
                    where: {
                        id: lessonId
                    },
                    transaction: tr
                }
            )
        return Promise.resolve();
    });
}

lessonService.rejectCandidate = async (studentId, lessonId, teacherId) => {
    let lesson = await Lesson.findById(lessonId);
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));

    let candidateExists = 
        await LessonCandidate
            .findOne({where: {teacherId, lessonId, status: 'pending'}})
    if(!candidateExists)
        return Promise.reject(errorBuilder(404)); 

    await LessonCandidate
        .update(
            {
                status: 'rejected'
            },
            {
                where: {
                    lessonId,
                    teacherId,
                    status: 'pending'
                }
            }
        )
}

lessonService.get = async (studentId, lessonId) => {
    let lesson = await Lesson.findById(
        lessonId,
        {
            attributes: ['id', 'title', 'description', 'startTime', 'endTime', 'price', 'location', 'StudentId'],
            include: [
                {
                    model: Customer,
                    as: 'Teacher',
                    attributes: ['id', 'name', 'phone']
                }
            ]
        }, 
    );
    lesson = lesson.get({plain: true})
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));    
    return lesson;
}

lessonService.delete = async(studentId, lessonId) => {
    let lesson = await Lesson.findById(lessonId);
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));

    await elasticApi.lesson.delete(lessonId);

    await lesson.destroy();
}

lessonService.search = async (userId, {term, coords, price}) => {
    let result = await elasticApi.lesson.findLesson({term, coords, price});
    let ids = result.hits.hits.map(h => h._id);
    if(!ids || ids.length == 0)
        return [];
    const query = `
        SELECT 
            l.id,
            l.title, 
            l.description, 
            l.starttime, 
            l.endtime, 
            l.price,
            std.name,
            (
                SELECT avg(value)
                FROM ratings r
                WHERE tocustomerid = std.id
                AND r.role = 'Student'
                AND r.status = 'completed'
            ) as rating
        FROM lessons l
        JOIN customers std
        ON l.studentid = std.id
        WHERE l.id in (?)
        AND l.id NOT IN (
            SELECT il.id
            FROM lessons il
            JOIN lessoncandidates ilc
            ON il.id = ilc.lessonid
            AND ilc.teacherid = ?
        )
    `
    return sequelize.query(query, {replacements: [[...ids], userId], type: sequelize.QueryTypes.SELECT})

}

const isValidDuration = (start, end) => {
    return moment(start, moment.ISO_8601).isBefore(end, moment.ISO_8601);
}

module.exports = lessonService;