const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
chai.use(chaiAsPromised);
const expect = chai.expect;
const _ = require('lodash');

let UsuarioRepository = require('../../src/repository/usuario');
let UsuarioService = require('../../src/services/usuario');
describe('Serviço Usuário', () => {
    const base = {
        nome: 'Juliano Montini',
        email: 'julianomontini@gmail.com',
        cpf: '39363197824',
        perfil: ['Aluno'],
        celular: '19996884395',
        senha: '123456'
    }
    describe('Validação Campos', () => {
        it('Deve retornar erro se nome for vazio', () => {
            let payload = _.clone(base);
            delete payload.nome;
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('nome')
        })
        it('Deve retornar erro se nome tiver menos que 5 caracteres', () => {
            let payload = _.clone(base);
            payload.nome = 'ab';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('nome')
        })
        it('Deve retornar erro se nome tiver mais que 50 caracteres', () => {
            let payload = _.clone(base);
            payload.nome = '';
            for(let i = 0; i <=51; i++)
                payload.nome += 'a';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('nome');
        })
        it('Deve retornar erro se cpf for vazio', () => {
            let payload = _.clone(base);
            delete payload.cpf;
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('cpf')
        })
        it('Deve retornar erro se cpf for invalido', () => {
            let payload = _.clone(base);
            payload.cpf = '123456';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('cpf')
        })
        it('Deve retornar erro se email for vazio', () => {
            let payload = _.clone(base);
            delete payload.email;
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('email')
        })
        it('Deve retornar erro se email for inválido', () => {
            let payload = _.clone(base);
            payload.email = 'teste123';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('email')
        })
        it('Deve retornar erro se senha for vazia', () => {
            let payload = _.clone(base);
            delete payload.senha;
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('senha')
        })
        it('Deve retornar erro se senha tiver menos que 6 digitos', () => {
            let payload = _.clone(base);
            payload.senha = '123';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('senha')
        })
        it('Deve retornar erro se senha tiver mais que 20 digitos', () => {
            let payload = _.clone(base);
            payload.senha = '';
            for(let i = 0; i <= 21; i++)
                payload.senha += 'a';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('senha')
        })
        it('Deve retornar erro se perfil tiver vazio', () => {
            let payload = _.clone(base);
            delete payload.perfil;
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('perfil')
        })
        it('Deve retornar erro se perfil tiver valor inválido', () => {
            let payload = _.clone(base);
            payload.perfil = ['abc'];
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('perfil')
        })
        it('Deve retornar erro se celular tiver tamanho invalido', () => {
            let payload = _.clone(base);
            payload.celular = '19234512';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('celular')
        })
        it('Deve retornar erro se celular tiver item nao numérico', () => {
            let payload = _.clone(base);
            payload.celular = '1999688439a';
            return expect(UsuarioService.criarUsuario(payload))
                .to.be.eventually.rejected.and.has.property('celular')
        })
        it('Deve criar usuario com sucesso', async () => {
            let stubs = {
                emailExistente: sinon.stub(UsuarioRepository, 'findUsuarioByEmail'),
                cpfExistente: sinon.stub(UsuarioRepository, 'findUsuarioByCpf'),
                criarUsuario: sinon.stub(UsuarioRepository, 'criaUsuario')
            }
            stubs.emailExistente.returns(null);
            stubs.cpfExistente.returns(null);
            stubs.criarUsuario.returns({...base, id: 1});
            
            const response = await UsuarioService.criarUsuario(base);
            expect(response).to.be.eql({...base, id: 1});

            _.forOwn(stubs, s => s.restore())
        })
    }),
    describe('Validação de consistência', () => {
        beforeEach(() => {
            sinon.stub(UsuarioRepository, 'criaUsuario').returns(base);
        })
        afterEach(() => {
            if(UsuarioRepository.criaUsuario.restore)
                UsuarioRepository.criaUsuario.restore();
        })
        it('Deve retornar erro se email já for cadastrado', async () => {
            sinon.stub(UsuarioRepository, 'findUsuarioByEmail').returns(base);
            try{
                await expect(UsuarioService.criarUsuario(base))
                .to.eventually.be.rejected
                .and.has.property('email');
                UsuarioRepository.findUsuarioByEmail.restore()
            }catch(e){
                throw e;
            }
        })
        it('Deve retornar erro se cpf já for cadastrado', async () => {
            sinon.stub(UsuarioRepository, 'findUsuarioByEmail').returns(null);
            sinon.stub(UsuarioRepository, 'findUsuarioByCpf').returns(base);
            try{
                await expect(UsuarioService.criarUsuario(base))
                .to.eventually.be.rejected
                .and.has.property('cpf');
                UsuarioRepository.findUsuarioByCpf.restore();
            }catch(e){
                throw e;
            }
        })
    })
})