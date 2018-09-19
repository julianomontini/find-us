const validate = require('validate.js');

const _v = require('../api/validations');
const errorBuilder = require('../api/errorBuilder');
const {Customer, Role} = require('../../models');
const {hash} = require('../api/password')
const customerService = {};

customerService.create = async customer => {
    let validationResult = validate(customer, _v.customer);
    if(validationResult)
    return Promise.reject(errorBuilder(422, validationResult));
    
    customer.email = customer.email.toLowerCase();
    customer.password = await hash(customer.password);
    
    let emailIsTaken = await Customer.findOne({where: {email: customer.email}});
    if(emailIsTaken)
        return Promise.reject(errorBuilder(422, 'Email already registered'));

    let cpfIsTaken = await Customer.findOne({where: {cpf: customer.cpf}});
    if(cpfIsTaken)
        return Promise.reject(errorBuilder(422, 'Cpf already registered'));

    let newCustomer = await Customer.create(customer)
    let roles = await Role.findAll({where: {name: customer.roles}})
    newCustomer.setRoles(roles);
    return {
        id: newCustomer.id, 
        name: newCustomer.name, 
        cpf: newCustomer.cpf, 
        email: newCustomer.email, 
        phone: newCustomer.phone
    }
}

module.exports = customerService;