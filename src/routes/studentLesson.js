const router = require('express').Router();
const passport = require('passport');

const roleMiddleware = require('../middleware/role');
const lessonService = require('../services/lesson');

const extractor = require('../api/extractor');
const keyWhitelist = require('../consts/whitelist').lesson;

router.use(passport.authenticate('jwt'), roleMiddleware('Student'));

router.get('/', (req,res,next) => {
    lessonService
        .listByStudent(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err))
})

router.post('/', (req,res,next) => {
    lessonService
        .create(req.user.id, extractData(req.body))
        .then(data => res.send(data))
        .catch(err => next(err));
});

router.put('/:id', (req,res,next) => {
    lessonService
        .update(req.user.id, req.params.id, extractData(req.body))
        .then(data => res.send(data))
        .catch(err => next(err));
});

router.get('/:id', (req,res,next) => {
    lessonService
        .get(req.user.id, req.params.id)
        .then(data => res.send(data))
        .catch(e => next(e));
});

router.delete('/:id', (req,res,next) => {
    lessonService
        .delete(req.user.id, req.params.id)
        .then(() => res.send())
        .catch(err => next(err))
});

router.get('/:id/candidates', (req,res,next) => {
    lessonService
        .getCandidates(req.user.id, req.params.id)
        .then((data) => res.send(data))
        .catch(err => next(err))
})

router.post('/:id/candidates/:candidate_id', (req,res,next) => {
    lessonService
        .approveCandidate(req.user.id, req.params.id, req.params.candidate_id)
        .then(() => res.send())
        .catch(err => next(err))
})

router.delete('/:id/candidates/:candidate_id', (req,res,next) => {
    lessonService
        .rejectCandidate(req.user.id, req.params.id, req.params.candidate_id)
        .then(() => res.send())
        .catch(err => next(err))
})
const extractData = (data) => extractor(keyWhitelist)(data);

module.exports = router;