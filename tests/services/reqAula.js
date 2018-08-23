const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const _ = require('lodash');
const moment = require('moment');

chai.use(chaiAsPromised);
const expect = chai.expect;

const PerfilRepository = require('../../src/repository/perfil');
const ReqAulaRepository = require('../../src/repository/reqAula');

const TagService = require('../../src/services/tag');
const ReqAulService = require('../../src/services/reqAula');

describe('Serviço Requisição de aula', () => {
    describe('Criar Requisicao', () => {
        describe('Validação de acesso', () => {
            it('Deve retornar acesso negado caso usuário não seja aluno', async () => {
                sinon.stub(PerfilRepository, 'usuarioTemPerfil').returns(false);
                return expect(ReqAulService.criar({}))
                    .to.eventually
                    .rejectedWith('Acesso negado')
                    .then(() => PerfilRepository.usuarioTemPerfil.restore());
            })
        })
        describe('Validação de campos', () => {
            const base = {
                titulo: 'Teste',
                descricao: 'Essa descricao tem que ter entre 30 e 300 caracteres',
                tags: ['tag 1', 'tag 2'],
                inicio: moment().format('DD/MM/YYYY HH:mm'),
                fim: moment().add(1, 'hour').format('DD/MM/YYYY HH:mm')
            }
            let stubs;
            beforeEach(() => {
                stubs = {
                    PerfilRepository: {
                        usuarioTemPerfil: sinon.stub(PerfilRepository, 'usuarioTemPerfil').returns(true)
                    },
                    ReqAulaRepository: {
                        criar: sinon.stub(ReqAulaRepository, 'criar').returns({...base, id: 1})
                    },
                    TagService: {
                        criarSeNaoExistir: sinon
                        .stub(TagService, 'criarSeNaoExistir')
                        .returns(base.tags.map((nome, i) => {
                            return {id: i+1, nome}
                        }))
                    }
                }
            })
            afterEach(() => {
                _.forOwn(stubs, cl => {
                    _.forOwn(cl, mt => mt.restore());
                })
            })
            it('Deve retornar erro se titulo não estiver presente', () => {
              let payload = _.clone(base);
              delete payload.titulo;
              return expect(ReqAulService.criar(payload)).to.be.eventually
                .rejected
                .and.has.property('titulo')
            })
            it('Deve retornar erro se titulo tiver menos que 5 caracteres', () => {
                let payload = _.clone(base);
                payload.titulo = 'ab';
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('titulo')
            })
            it('Deve retornar erro se descricao não estiver presente', () => {
                let payload = _.clone(base);
                delete payload.descricao;
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('descricao')
            })
            it('Deve retornar erro se descricao tiver menos que caracteres', () => {
                let payload = _.clone(base);
                payload.descricao = 'abc';
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('descricao')
            })
            it('Deve retornar erro se descricao tiver mais que 300 caracteres', () => {
                let payload = _.clone(base);
                payload.descricao = '';
                for(let i = 0; i <= 301; i++)
                    payload.descricao += 'a';
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('descricao')
            })
            it('Deve retornar erro se tag não estiver presente', () => {
                let payload = _.clone(base);
                delete payload.tags;
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('tags')
            })
            it('Deve retornar erro se tag não estiver preechido', () => {
                let payload = _.clone(base);
                payload.tags = [];
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('tags')
            })
            it('Deve retornar erro se data inicio tiver formato inválido', () => {
                let payload = _.clone(base);
                payload.inicio = '111/12/2012 09:00'
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('horario')
            })
            it('Deve retornar erro se data fim tiver formato inválido', () => {
                let payload = _.clone(base);
                payload.fim = '111/12/2012 09:00'
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('horario')
            })
            it('Deve retornar erro se inicio for depois de fim', () => {
                let payload = _.clone(base);
                payload.inicio = '11/12/2012 12:00'
                payload.fim = '11/12/2012 09:00'
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('horario')
            })
            it('Deve retornar erro se inicio for antes de agora', () => {
                let payload = _.clone(base);
                payload.inicio = moment().subtract(1, 'hour')
                payload.fim = moment();
                return expect(ReqAulService.criar(payload)).to.be.eventually
                  .rejected
                  .and.has.property('horario')
            })
            it('Deve criar requisicao de aula com sucesso', async () => {
                try{

                    await expect(ReqAulService.criar(base))
                        .to.eventually.be.eql({...base, id: 1});
                
                    expect(stubs.TagService.criarSeNaoExistir.callCount).to.be.eq(2);
                }catch(e){
                    throw e;
                }
            })
        })
    })
})