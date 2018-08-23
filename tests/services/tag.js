const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const _ = require('lodash');

chai.use(chaiAsPromised);
const expect = chai.expect;

const TagService = require('../../src/services/tag');
const TagRepository = require('../../src/repository/tag');

describe('Serviço Tag', () => {
    describe('Normalizar nome', () => {
        it('Deve retornar vazio se string nula for passada', () => {
            expect(TagService.normalizarNome()).to.be.eq('');
        })
        it('Deve remover todos os caracteres nao ascii', () => {
            expect(TagService.normalizarNome('áàâ')).to.be.eq('aaa');
        })
        it('Deve transformar texto para lowercase', () => {
            expect(TagService.normalizarNome('ABC')).to.be.eq('abc');
        })
    })
    describe('criarSeNaoExistir', () => {
        let stubs = {};
        beforeEach(() => {
            stubs.TagRepository = {
                criarTag: sinon.stub(TagRepository, 'criarTag'),
                procurarTag: sinon.stub(TagRepository, 'procuraTagPorNomeSimples')
            }
        });
        afterEach(() => {
            _.forOwn(stubs, cl => {
                _.forOwn(cl, mt => mt.restore());
            })
        })
        it('Não deve criar tag se já for existente', async () => {
            const tag = {id: 1, nome: 'Teste', nome_simples: 'teste'};
            stubs.TagRepository.procurarTag.returns(tag);

            let result = await TagService.criarSeNaoExistir('teste');
            expect(result).to.be.eqls(tag);
            expect(stubs.TagRepository.criarTag.callCount).to.be.eq(0);
        })

        it('Deve criar tag se já for existente', async () => {
            const tag = {id: 2, nome: 'Teste', nome_simples: 'teste'};
            stubs.TagRepository.procurarTag.returns(null);
            stubs.TagRepository.criarTag.returns(tag);

            let result = await TagService.criarSeNaoExistir('teste');
            expect(result).to.be.eqls(tag);
            expect(stubs.TagRepository.criarTag.callCount).to.be.eq(1);
        })
    })
})