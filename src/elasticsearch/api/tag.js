const elastic = require('../index');
const capitalize = require('../../api/text').capitalizeText;

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
    async criarTagSeNaoExistir(tag){
        let result = await elastic.search({
            index: 'tags',
            body: {
                _source: "nome", 
                query: {
                    match_phrase: {
                        nome: tag
                    }
                }
            }
        });
        let hit = result.hits.hits[0];
        if(hit)
            return hit._source.nome;

        let capitalizedTag = capitalize(tag);
        await elastic.index({
            index: 'tags',
            type: '_doc',
            body: {
                nome: capitalizedTag
            }
        });

        return capitalizedTag;
    }
}