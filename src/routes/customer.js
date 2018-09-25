const router = require('express').Router();
const passport = require('passport');

const CustomerService = require('../services/customer');

router.use(passport.authenticate('jwt'));

router.get('/', (req,res,next) => {
    return CustomerService
        .get(req.user.id)
        .then(data => res.send(data))
        .catch(err => next(err))
});

router.post('/configuration', (req,res,next) => {
    return CustomerService
        .updateProfile(req.user.id, req.body)
        .then(user => res.send(user))
        .catch(err => next(err))
})

module.exports = router;