const TagRepository = require('../repository/tag');

class TagService{
    async criarSeNaoExistir(nome){
        const tag = await this.procurarTag(nome);
        if(tag) return tag;

       return TagRepository.criarTag(nome, this.normalizarNome(nome))
    }

    async procurarTag(nome){
        const result = await TagRepository.procuraTagPorNomeSimples(this.normalizarNome(nome));
        return result;
    }

    normalizarNome(nome){
        let nomeNormalizado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        nomeNormalizado = nomeNormalizado.toLowerCase();
        nomeNormalizado = nomeNormalizado.replace(' ', '_');
        return nomeNormalizado;
    }
}

module.exports = new TagService();