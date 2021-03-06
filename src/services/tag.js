const elasticApi = require('../elasticsearch/api');
const TagRepository = require('../repository/tag');
const _ = require('lodash');

class TagService{
    async criarSeNaoExistir(nome){
        const tag = await this.procurarTag(nome);
        if(tag) return tag;

        let newTag = await TagRepository.criarTag(nome, this.normalizarNome(nome));
        await elasticApi.tag.criarTag(newTag);
        return newTag;
    }

    async procurarTag(nome){
        return TagRepository.procuraTagPorNomeSimples(this.normalizarNome(nome));
    }

    async procurarSugestoes(nome){
        const result = await elasticApi.tag.findSugestoesByNome(nome);
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