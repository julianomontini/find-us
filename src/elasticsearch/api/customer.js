const elastic = require('../index');

const customerApi = {};

customerApi.createOrUpdate = customer => {
    return elastic.index({
        index: 'customer',
        id: customer.id,
        type: '_doc',
        body: customer
    })
}

customerApi.getById = id => {
    return elastic.get({
        index: 'customer',
        id,
        type: '_doc'
    }).then(data => data._source)
}

customerApi.findSuggestionsForLesson = (title, description) => {
    return elastic.search({
        index: 'customer',
        type: '_doc',
        size: 3,
        body: {
            "query": {
                "nested": {
                    "path": "tags",
                    "query": {
                        "bool": {
                            "should": [{
                                    "match": {
                                        "tags.name": {
                                            "analyzer": "brazilian",
                                            "query": title
                                        }
                                    }
                                },
                                {
                                    "match": {
                                        "tags.name": {
                                            "analyzer": "brazilian",
                                            "query": description
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    })
}

customerApi.findTagsSuggestion = term => {
    return elastic.search({
        index: 'customer',
        type: '_doc',
        _source: false,
        body: {
            "query": {
                "nested": {
                    "path": "tags",
                    "inner_hits": {},
                    "query": {
                        "match": {
                            "tags.name": {
                                "query": term,
                                "analyzer": "standard",
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                }
            }
        }
    })
}

module.exports = customerApi;