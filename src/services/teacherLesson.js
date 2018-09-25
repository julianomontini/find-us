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
                    attributes: ['title']
                }
            ]
        }
    )
}

module.exports = teacherLesson;