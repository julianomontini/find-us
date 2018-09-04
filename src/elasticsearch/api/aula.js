const elastic = require('../index');

module.exports = {
    criarAula(novaAulaElastic){
        const body = novaAulaElastic;
        delete body.id_aluno;
        return elastic.index({
            index: 'requisicao_aula',
            id: body.id,
            type: '_doc',
            body: body
        });
    },
    findSugestoesAulaByTermo(params){
        const body = {
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: params.term,
                                fields: [
                                    'titulo',
                                    'descricao',
                                    'tags'
                                ]
                            }
                        }
                    ],
                    should: [{
                            match_phrase: {
                                titulo: {
                                    query: params.term,
                                    slop: 3,
                                    boost: 5
                                }
                            }
                        },
                        {
                            match_phrase: {
                                descricao: {
                                    query: params.term,
                                    slop: 5,
                                    boost: 2
                                }
                            }
                        }
                    ],
                    filter: [
                        {
                            range: {
                                inicio: {
                                    gt: 'now'
                                }
                            }
                        }
                    ]
                }
            }
        }
        if(params.coords){
            const query = {
                distance: `${params.coords.distance}km`,
                localizacao: {
                    lat: params.coords.lat,
                    lon: params.coords.lon
                }
            }
            body.query.bool.filter.push({
                geo_distance: query
            });
        }
        if(params.price){
            const query = {
                range: {
                    preco: {
                        gte: params.price
                    }
                }
            }
            body.query.bool.must.push(query);
        }
        return elastic.search({
            index: 'requisicao_aula',
            body
        });
    }
}