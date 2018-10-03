const router = require('express').Router();
var passport = require('passport');
const jwt = require('jwt-simple');

var AuthService = require('../services/authentication');
const CustomerService = require('../services/customer');
const Customer = require('../../models').Customer;

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, AuthService.jwtOptions.secretOrKey);
}

router.post('/signup', (req,res,next) => {
    const { name, cpf, email, password, phone, roles } = req.body || {};
    const newUser = {name, cpf, email, password, phone, roles};

    CustomerService
        .create(newUser)
        .then(user => res.send(user))
        .catch(err => next(err));
});

router.post('/login', passport.authenticate('local'), async (req,res) => {
    try{
        let customer = await CustomerService.get(req.user.id);
        res.send({token: tokenForUser(customer), ...customer});
    }catch(e){
        res.status(400).send();
    }
});

module.exports = router;