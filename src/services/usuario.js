const validate = require('validate.js');
const bcrypt = require('bcrypt');

const _v = require('../api/validations');
const UsuarioRepository = require('../repository/usuario');

class UsuarioService{
    async criarUsuario({nome, email, senha, cpf, celular, perfil}){

        const validation = validate({nome, email, senha, cpf, perfil, celular}, {
            nome: _v.nomeUsuario, 
            email: _v.email, 
            senha: _v.senha, 
            cpf: _v.cpf, 
            perfil: _v.perfilPublico,
            celular: _v.celular
        });

        if(validation)
            return Promise.reject(JSON.stringify(validation));

        if(await this.emailExistente(email)){
            return Promise.reject(JSON.stringify({email: "Email Já cadastrado"}));
        }

        if(await this.cpfExistente(cpf)){
            return Promise.reject(JSON.stringify({cpf: "CPF Já cadastrado"}))
        }

        senha = await bcrypt.hash(senha, 10);

        const createResult = await UsuarioRepository.criaUsuario({
            nome, email, senha, cpf, celular, perfis: perfil
        })
        
        return Promise.resolve(createResult);
    }
    async emailExistente(email){
        const usuario = await UsuarioRepository.findUsuarioByEmail(email);
        return usuario != null;
    }
    async cpfExistente(cpf){
        const usuario = await UsuarioRepository.findUsuarioByCpf(cpf);
        return usuario != null;
    }
}

module.exports = new UsuarioService();