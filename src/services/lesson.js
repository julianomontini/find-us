const validate = require('validate.js');
const moment = require('moment');
const _ = require('lodash');

const _v = require('../api/validations');
const errorBuilder = require('../api/errorBuilder');
const { Lesson, LessonCandidate, Sequelize: { Op }, sequelize } = require('../../models');
const extractor = require('../api/extractor');
const keyWhilelist = require('../consts/whitelist').lesson;


const lessonService = {};

lessonService.create = async (studentId, data) => {
    let validations = {..._v.lesson, ..._v.tags};
    let validationResult = validate(data, validations);
    if(validationResult)
        return Promise.reject(errorBuilder(400, validationResult));

    if(isValidDuration(data.startTime, data.endTime))
        return Promise.reject(errorBuilder(400, 'Start time must be after End time'))

    let lesson = await Lesson
        .create({
            title: data.title,
            description: data.description,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
            price: data.price,
            studentId
        });
    return lessonService.get(studentId, lesson.id);
}

lessonService.update = async(studentId, lessonId, data) => {
    let lesson = await Lesson.findById(lessonId);
        if(!lesson)
            return Promise.reject(errorBuilder(404));
        if(lesson.StudentId != studentId)
            return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));
        
        lesson = _.merge(lesson, data);

        let validationResult = validate(lesson, _v.lesson);
        if(validationResult)
            return Promise.reject(errorBuilder(400, validationResult));

        if(isValidDuration(lesson.startTime, lesson.endTime))
            return Promise.reject(errorBuilder(400, 'Start time must be after End time'));

        await lesson.save();

        return lessonService.get(studentId, lesson.id);
}

lessonService.getCandidates = async(studentId, lessonId) => {
    let lesson = await Lesson.findById(lessonId);
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));
    return lesson.getCandidates({attributes: ['id', 'name']});
}

lessonService.approveCandidate = async(studentId, lessonId, teacherId) => {
    let lesson = await Lesson.findById(lessonId);
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

    return sequelize.transaction(async tr => {

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
    let whitelist = _.clone(keyWhilelist);
    whitelist.push('id');


    let lesson = await Lesson.findById(lessonId);
    lesson = lesson.get({plain: true});

    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));

    return extractor(whitelist)(lesson);    
}

lessonService.delete = async(studentId, lessonId) => {
    let lesson = await Lesson.findById(lessonId);
    if(!lesson)
        return Promise.reject(errorBuilder(404));
    if(lesson.StudentId != studentId)
        return Promise.reject(errorBuilder(403, "Customer is not lesson's owner"));

    await lesson.destroy();
}

const isValidDuration = (start, end) => {
    return moment(start).isBefore(end);
}

module.exports = lessonService;