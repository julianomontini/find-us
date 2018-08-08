const validate = require('validate.js');
const moment = require('moment');
const _v = require('../api/validations');

const PerfilRepository = require('../repository/perfil');
const ReqAulaRepository = require('../repository/reqAula');

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
        if(!inicio || !fim || moment(inicio, format, true).isAfter(moment(fim, format, true))){
            return Promise.reject({horario: ['Horário Inválido']});
        }

        return ReqAulaRepository.criar({titulo, descricao, inicio, fim, idAluno: idUsuario, tags});
    }
    async getReqAulaAluno(idAluno){
        const isAluno = await PerfilRepository.usuarioTemPerfil(idAluno, 'Aluno');
        if(!isAluno) return Promise.reject('Acesso negado');

        return ReqAulaRepository.getReqAulaAluno(idAluno);
    }
}
module.exports = new ReqAulaService();