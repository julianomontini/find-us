const router = require('express').Router();
const passport = require('passport');

const RatingService = require('../services/rating');

router.use(passport.authenticate('jwt'));

router.post('/:id/rate', (req,res,next) => {
    RatingService
        .rate(req.user.id, req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
})

router.get('/pending', (req,res,next) => {
    RatingService
        .getPending(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err));
});

router.get('/received', (req,res,next) => {
    RatingService
        .getReceived(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err));
});

router.get('/given', (req,res,next) => {
    RatingService
        .getGiven(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err));
})

module.exports = router;