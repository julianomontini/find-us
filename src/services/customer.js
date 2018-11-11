const validate = require('validate.js');
const _ = require('lodash');

const _v = require('../api/validations');
const errorBuilder = require('../api/errorBuilder');
const {Customer, Role, CustomerConfiguration,sequelize} = require('../../models');
const {hash} = require('../api/password')
const elasticApi = require('../elasticsearch/api');


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

        await elasticApi.customer.createOrUpdate(
            {
                id: newCustomer.id,
                roles: customer.roles,
            }
        )

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
                    attributes: ['location', 'tags']
                }
            ]
        }
    );
    customer = customer.get({plain: true});
    return customer;
}

customerService.updateProfile = async (customerId, data) => {
    let config = await CustomerConfiguration.findOne({where: {customerId}});

    if(data.tags)
        config.tags = data.tags;

    if(data.location)
        config.location = data.location;

    await config.save();

    await elasticApi.customer.createOrUpdate(
        {
            id: config.CustomerId,
            location: config.location,
            tags: config.tags
        }
    )

    return customerService.get(customerId);
}

customerService.statistics = async customerId => {
    let queries = [];
    queries.push(sequelize.query(`
        SELECT COUNT(1)
        FROM LESSONS
        WHERE STUDENTID = ?
    `, {replacements: [customerId]}));

    queries.push(sequelize.query(`
        SELECT COUNT(1)
        FROM LESSONS
        WHERE TEACHERID = ?
    `, {replacements: [customerId]}));

    queries.push(sequelize.query(`
        SELECT COUNT(1)
        FROM LESSONS L
        WHERE L.STUDENTID = ?
        AND L.TEACHERID IS NOT NULL
    `, {replacements: [customerId]}));

    queries.push(sequelize.query(`
        SELECT COUNT(1)
        FROM LESSONCANDIDATES
        WHERE TEACHERID = ?
    `, {replacements: [customerId]}));

    queries.push(sequelize.query(`
        SELECT AVG(value)
        FROM RATINGS R
        JOIN LESSONS L
        ON R.LESSONID = L.ID
        WHERE TOCUSTOMERID = ?
        AND R.STATUS = 'completed'
    `, {replacements: [customerId]}));

    queries.push(elasticApi.customer.getById(customerId))

    let result = await Promise.all(queries);
    return {
        studentLessons: result[0][0][0]['count'],
        teacherLessons: result[1][0][0]['count'],
        completedLessons: result[2][0][0]['count'],
        candidated: result[3][0][0]['count'],
        average: result[4][0][0]['avg'],
        tags: result[5].tags
    };
}

customerService.getTagsSuggestion = async term => {
    return elasticApi.customer.findTagsSuggestion(term)
        .then(result => {
            return result
                .hits
                .hits.map(h => h.inner_hits.tags.hits.hits.map(ih => ih._source.name))
        })
        .then(data => {
            return _.uniq(_.flatten(data))
        })
}

module.exports = customerService;