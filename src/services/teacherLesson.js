const sms = require('../aws/sms');

const { Customer, Lesson, LessonCandidate } = require('../../models');
const errorBuilder = require('../api/errorBuilder');

const teacherLesson = {};

teacherLesson.subscribe = async (teacherId, lessonId) => {
    let lesson = await Lesson.findById(lessonId);

    if(!lesson)
        return Promise.reject(errorBuilder(404));

    let subscription = await LessonCandidate.find(
        {
            where: {
                teacherId,
                lessonId
            }
        }
    );

    if(subscription){
        if(subscription.status == 'approved')
            return;

        if(subscription.status == 'rejected')
            return Promise.reject(errorBuilder(400, "Can't change status of rejected subscription"));
    
        if(subscription.status == 'canceled'){
            subscription.status = 'pending';
            await subscription.save();
        }
    }else{
        await LessonCandidate.create(
            {
                teacherId,
                lessonId
            }
        )
    }

    let student = await lesson.getStudent();
    let message = `Um novo professor se candidatou para a sua aula "${lesson.title}". Acesse a plataforma para mais detalhes.`;

    await sms(message, student.phone);

}

teacherLesson.unsubscribe = async (teacherId, lessonId) => {
    let subscription = await LessonCandidate.find(
        {
            where: {
                teacherId,
                lessonId
            }
        }
    )

    if(!subscription)
        return Promise.reject(errorBuilder(404));

    if(subscription.status === 'approved')
        return Promise.reject(errorBuilder(400, 'Cannot unsubscribe of approved lessons'));

    subscription.status = 'canceled';
    await subscription.save();
}

teacherLesson.getSubscriptions = async teacherId => {
    return LessonCandidate.findAll(
        {
            where: {
                teacherId
            },
            attributes: ['id', 'status'],
            include: [
                {
                    model: Lesson,
                    attributes: ['title', 'starttime', 'endtime', 'price', 'teacherId'],
                    include: [
                        {
                            model: Customer,
                            attributes: ['name', 'phone'],
                            as: 'Student'
                        }
                    ]
                }
            ]
        }
    ).map(lesson => {
        if(lesson.Lesson.teacherId != teacherId){
            lesson.Lesson.Student.phone = null;
        }
        return lesson;
    })
}

module.exports = teacherLesson;