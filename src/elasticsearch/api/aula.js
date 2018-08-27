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
    findSugestoesAulaByTermo(term){
        return elastic.search({
            index: 'requisicao_aula',
            body: {
                query: {
                    bool: {
                        must: [{
                            multi_match: {
                                query: term,
                                fields: [
                                    'titulo',
                                    'descricao',
                                    'tags'
                                ]
                            }
                        }],
                        should: [{
                                match_phrase: {
                                    titulo: {
                                        query: term,
                                        slop: 3,
                                        boost: 5
                                    }
                                }
                            },
                            {
                                match_phrase: {
                                    descricao: {
                                        query: term,
                                        slop: 5,
                                        boost: 2
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });
    }
}