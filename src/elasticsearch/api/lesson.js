const elastic = require('../index');

const lessonApi = {};

lessonApi.createOrUpdate = lesson => {
    return elastic.index(
        {
            index: 'lesson',
            id: lesson.id,
            type: '_doc',
            body: lesson
        }
    )
}

lessonApi.delete = id => {
    return elastic.delete({index: 'lesson',id, type: '_doc'})
}

lessonApi.findLesson = ({term, coords, price}) => {
    const request = {
        query: {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: term,
                            fields: ['title', 'description']
                        }
                    }
                ],
                should: [
                    {
                        match_phrase: {
                            title: {
                                query: term,
                                slop: 3,
                                boost: 5
                            }
                        }
                    },
                    {
                        match_phrase: {
                            title: {
                                query: term,
                                slop: 5,
                                boost: 2
                            }
                        }
                    }
                ],
                filter: [
                    {
                        range: {
                            startTime: {
                                gt: 'now'
                            }
                        }
                    }
                ]
            }
        }
    }
    if(coords){
        const query = {
            geo_distance: {
                distance: `${coords.distance}km`,
                location: {
                    lat: coords.lat,
                    lon: coords.lon
                }
            }
        };
        request.query.bool.filter.push(query);
    }
    if(price){
        const query = {
            range: {
                price: {
                    gte: price
                }
            }
        }
        request.query.bool.must.push(query);
    }
    return elastic.search(
        {
            index: 'lesson',
            body: request
        }
    )
}

module.exports = lessonApi;