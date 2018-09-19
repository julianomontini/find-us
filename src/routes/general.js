const router = require('express').Router();

const CustomerService = require('../services/customer');

router.post('/signup', (req,res,next) => {
    const { name, cpf, email, password, phone, roles } = req.body || {};
    const newUser = {name, cpf, email, password, phone, roles};

    CustomerService
        .create(newUser)
        .then(user => res.send(user))
        .catch(err => next(err));
})

module.exports = router;