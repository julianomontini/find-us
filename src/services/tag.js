const elastic = require('../db/elasticsearch');
const TagRepository = require('../repository/tag');
const _ = require('lodash');

class TagService{
    async criarSeNaoExistir(nome){
        const tag = await this.procurarTag(nome);
        if(tag) return tag;

        let newTag = await TagRepository.criarTag(nome, this.normalizarNome(nome));
        await elastic.create({
            index: 'tags',
            id: newTag.id,
            type: '_doc',
            body: {
                nome: newTag.nome,
                nome_simples: newTag.nome_simples
            }
        });
        return newTag;
    }

    async procurarTag(nome){
        return TagRepository.procuraTagPorNomeSimples(this.normalizarNome(nome));
    }

    async procurarSugestoes(nome){
        const result = await elastic.search({
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
        return _.map(result.hits.hits, h => {
            return{id: h._id, nome: h._source.nome, nome_simples: h._source.nome_simples}
        });
    }

    normalizarNome(nome = ''){
        let nomeNormalizado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        nomeNormalizado = nomeNormalizado.toLowerCase();
        return nomeNormalizado;
    }
}

module.exports = new TagService();