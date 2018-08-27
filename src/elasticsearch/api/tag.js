const elastic = require('../index');

module.exports = {
    findSugestoesByNome(nome){
        return elastic.search({
            index: 'tags',
            size: 5,
            body: {
                query: {
                    bool: {
                        should: [{
                                wildcard: {
                                    nome: {
                                        value: `${nome}*`
                                    }
                                }
                            },
                            {
                                match: {
                                    nome
                                }
                            }
                        ]
                    }
                }
            }
        })
    },
    criarTag(newTag){
        return elastic.index({
            index: 'tags',
            id: newTag.id,
            type: '_doc',
            body: {
                nome: newTag.nome,
                nome_simples: newTag.nome_simples
            }
        });
    }
}