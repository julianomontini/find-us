const validate = require('validate.js');
const _ = require('lodash');

const _v = require('../api/validations');
const errorBuilder = require('../api/errorBuilder');
const {Customer, Role, CustomerConfiguration,sequelize} = require('../../models');
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

    let newCustomer = await sequelize.transaction(async tr => {
        let newCustomer = await Customer.create(customer, {transaction: tr})

        let roles = await Role.findAll({where: {name: customer.roles}})
        await newCustomer.setRoles(roles, {transaction: tr});
        await newCustomer.createConfiguration({}, {transaction: tr})
        return newCustomer;
    })

    return customerService.get(newCustomer.id);
}

customerService.get = async customerId => {
    let customer = await Customer.findById(customerId, 
        {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Role, 
                    as: 'Roles',
                    attributes: ['id', 'name'],
                    through: {
                        where: {
                            status: 'active'
                        },
                        attributes: []
                    }
                },
                {
                    model: CustomerConfiguration, 
                    as: 'Configuration',
                    attributes: ['location']
                }
            ]
        }
    );
    customer = customer.get({plain: true});
    return customer;
}

module.exports = customerService;