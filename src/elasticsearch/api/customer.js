const elastic = require('../index');

const customerApi = {};

customerApi.createOrUpdate = customer => {
    return elastic.index(
        {
            index: 'customer',
            id: customer.id,
            type: '_doc',
            body: customer
        }
    )
}

module.exports = customerApi;