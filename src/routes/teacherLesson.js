const router = require('express').Router();
const passport = require('passport');

const roleMiddleware = require('../middleware/role');
const TeacherLessonService = require('../services/teacherLesson');
const LessonService = require('../services/lesson');

router.use(passport.authenticate('jwt'), roleMiddleware('Teacher'));

router.get('/', (req,res,next) => {
    return TeacherLessonService
        .getSubscriptions(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err));
})

router.post('/:id/subscribe', (req,res,next) => {
    return TeacherLessonService
        .subscribe(req.user.id, req.params.id)
        .then(() => res.send())
        .catch(err => next(err));
})

router.delete('/:id/unsubscribe', (req,res,next) => {
    return TeacherLessonService
        .unsubscribe(req.user.id, req.params.id)
        .then(() => res.send())
        .catch(err => next(err));
})

router.post('/search', (req, res, next) => {
    if(!req.body.term)
        return res.status(404).send();
    return LessonService
        .search(req.user.id, req.body)
        .then(data => res.send(data))
        .catch(err => next(err))
})

module.exports = router;