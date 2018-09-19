const Customer = require('../../models').Customer;
const errorBuilder = require('../api/errorBuilder');

module.exports = roleName => async (req, res, next) => {
    Customer
        .findById(req.user.id, {include: ['Roles']})
        .then(user => {
            let roles = user.Roles || [];
            let requiredRole = roles.find(role => role.name === roleName)
            if(requiredRole)
                next();
            else
                next(errorBuilder(403, 'Access Denied'));
        });
}