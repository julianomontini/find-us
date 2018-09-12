const validate = require('validate.js');
const moment = require('moment');
const _v = require('../api/validations');
const _ = require('lodash');

const elasticApi = require('../elasticsearch/api');

const PerfilRepository = require('../repository/perfil');
const ReqAulaRepository = require('../repository/reqAula');
const TagService = require('../services/tag');

const errorBuilder = require('../api/errorBuilder');

const isValidHorario = (inicio, fim) => {
    const format = moment.ISO_8601;
    const mInicio = moment(inicio, format, true);
    const mFim = moment(fim, format, true);
    return (!mInicio.isValid() ||
            !mFim.isValid() ||
            mInicio.isAfter(mFim) ||
            mInicio.isBefore(moment().subtract(1, 'minute')))
}

class ReqAulaService{
    async inscreverProfessor(idAula, idProfessor){
        const aula = await ReqAulaRepository.getAulaById(idAula);
        if(!aula)
            return Promise.reject(errorBuilder({}, 404));
        if(aula.id_professor)
            return Promise.reject(errorBuilder({mensagem: 'Aula já tem professor'}, 400));
        if(idProfessor == aula.id_aluno)
            return Promise.reject(errorBuilder({mensagem: 'Aluno tem mesmo código que professor'}, 400));
        await ReqAulaRepository.inserirProfessorAula(idAula, idProfessor);
        return;
    }
    async criar({titulo, descricao, inicio, fim, idUsuario, tags, localizacao, preco}){
            const isAluno = await PerfilRepository.usuarioTemPerfil(idUsuario, 'Aluno');
        if(!isAluno) return Promise.reject(errorBuilder('Acesso negado', 403));

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
            return Promise.reject(errorBuilder(validationResult));
        
        if(isValidHorario(inicio, fim)){
            return Promise.reject(errorBuilder({horario: ['Horário Inválido']}))
        }

        const capitalizedTags = [];
        for(let tag of tags){
            let cpTag = await elasticApi.tag.criarTagSeNaoExistir(tag);
            capitalizedTags.push(cpTag);
        }

        const novaAula = await ReqAulaRepository.criar({titulo, descricao, inicio, fim, idAluno: idUsuario, localizacao, preco});
        novaAula.tags = capitalizedTags;
        const novaAulaElastic = {...novaAula, localizacao};
        await elasticApi.aula.criarAula(novaAulaElastic);
        return novaAula;

    }
    async getReqAulaAluno(idAluno){
        return ReqAulaRepository.getReqAulaAluno(idAluno);
    }

    async getDetalheAula(idAula){
        return ReqAulaRepository.getAulaById(idAula);
    }

    async atualizarAula(idAluno, idAula, {titulo, descricao, inicio, fim, tags = []}){
        let aula = await ReqAulaRepository.getAulaById(idAula);

        if(aula.id_aluno != idAluno)
            return Promise.reject(errorBuilder({mensagem: 'Acesso negado'}, 403));

        const capitalizedTags = [];
        for(let tag of tags){
            let cpTag = await elasticApi.tag.criarTagSeNaoExistir(tag);
            capitalizedTags.push(cpTag);
        }

        titulo = titulo || aula.titulo;
        descricao = descricao || aula.descricao;
        inicio = inicio || aula.inicio;
        fim = fim || aula.fim;

        const validationResult = validate(
            {titulo, descricao, inicio, fim, tags},
            {
                titulo: _v.aula.titulo,
                descricao: _v.aula.descricao,
                inicio: _v.aula.horario,
                fim: _v.aula.horario,
                tags: (tags.length > 0 ? _v.aula.tag : null)
            }
        )
        if(validationResult)
            return Promise.reject(errorBuilder(validationResult));

        const aulaAtualizada =  await ReqAulaRepository.atualizarAula(idAula, {titulo, descricao, inicio, fim});
        aulaAtualizada.tags = capitalizedTags;
        await elasticApi.aula.criarAula(aulaAtualizada);
        return aulaAtualizada;
    }
}
module.exports = new ReqAulaService();