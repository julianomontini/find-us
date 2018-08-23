const validate = require('validate.js');
const moment = require('moment');
const _v = require('../api/validations');
const _ = require('lodash');

const elastic = require('../db/elasticsearch');

const PerfilRepository = require('../repository/perfil');
const ReqAulaRepository = require('../repository/reqAula');
const TagService = require('../services/tag');

class ReqAulaService{
    async criar({titulo, descricao, inicio, fim, idUsuario, tags}){
            const isAluno = await PerfilRepository.usuarioTemPerfil(idUsuario, 'Aluno');
        if(!isAluno) return Promise.reject('Acesso negado');

        const validationResult = validate(
            {titulo, descricao, inicio, fim, tags},
            {
                titulo: _v.aula.titulo,
                descricao: _v.aula.descricao,
                inicio: _v.aula.horario,
                fim: _v.aula.horario,
                tags: _v.aula.tag
            }
        )
        if(validationResult)
            return Promise.reject(validationResult);

        const format = 'DD/MM/YYYY HH:mm';
        const mInicio = moment(inicio, format, true);
        const mFim = moment(fim, format, true);
        
        if(
            !mInicio.isValid() ||
            !mFim.isValid() ||
            mInicio.isAfter(mFim) ||
            mInicio.isBefore(moment().subtract(1, 'minute'))
        ){
            return Promise.reject({horario: ['Horário Inválido']});
        }

        const normalizedTags = [];
        for(let tag of tags){
            let dbTag = await TagService.criarSeNaoExistir(tag);
            normalizedTags.push(dbTag);
        }

        const novaAula = await ReqAulaRepository.criar({titulo, descricao, inicio, fim, idAluno: idUsuario, tags: normalizedTags});
        novaAula.tags = normalizedTags;
        const novaAulaElastic = {...novaAula, tags: _.map(novaAula.tags, t => t.nome)};
        await elastic.create({
            index: 'requisicao_aula',
            id: novaAula.id,
            type: '_doc',
            body: novaAulaElastic
        });
        return novaAula;

    }
    async getReqAulaAluno(idAluno){
        return ReqAulaRepository.getReqAulaAluno(idAluno);
    }

    async getDetalheAula(idAula){
        return ReqAulaRepository.getAulaFull(idAula);
    }
}
module.exports = new ReqAulaService();