const { Rating, Lesson, Customer } = require('../../models');
const errorBuilder = require('../api/errorBuilder');

const ratingService = {};

ratingService.getPending = async customerId => {
    return Rating.findAll(
        {
            attributes: ['id', 'role'],
            where: {
                fromCustomerId: customerId,
                status: 'pending'
            },
            include: [
                {
                    model: Lesson,
                    attributes: ['title']
                }, 
                {
                    model: Customer,
                    as: 'ToCustomer',
                    attributes: ['name']
                }
            ]
        }
    )
}

ratingService.getReceived = async customerId => {
    return Rating.findAll(
        {
            attributes: ['id', 'role', 'value', 'comment'],
            where: {
                toCustomerId: customerId,
                status: 'completed'
            },
            include: [
                {
                    model: Lesson,
                    attributes: ['title']
                },
                {
                    model: Customer,
                    as: 'FromCustomer',
                    attributes: ['name']
                }
            ]
        }
    )
}

ratingService.getGiven = async customerId => {
    return Rating.findAll(
        {
            attributes: ['id', 'role'],
            where: {
                fromCustomerId: customerId,
                status: 'completed'
            },
            include: [
                {
                    model: Lesson,
                    attributes: ['title']
                }
            ]
        }
    )
}

ratingService.rate = async (customerId, ratingId, data) => {
    let rating = await Rating.findOne({where: {id: ratingId, fromCustomerId: customerId, status: 'pending'}});
    if(!rating)
        return Promise.reject(errorBuilder(404));
    
    rating.value = data.value;
    rating.comment = data.comment;
    rating.status = 'completed';
    await rating.save();
}
module.exports = ratingService;