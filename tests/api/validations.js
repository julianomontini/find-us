const validate = require('validate.js');
const expect = require('chai').expect;

require('../../src/api/validations');

describe('Custom ValidateJs validations', () => {
    describe('CPF', () => {
        it('Módulo deve estar injetado', () => {
            expect(validate.validators.cpf).to.not.be.undefined;
        })
        it('Deve retornar mensagem quando cpf for inválido', () => {
            const message = "Cpf Inválido";
            const validation = validate({CPF: '123'}, {CPF: {cpf: {}}})
            expect(validation.CPF[0]).to.equal(message)
        })
        it('Deve retornar vazio quando CPF for válido', () => {
            const validation = validate({CPF: '39363197824'}, {CPF: {cpf: {}}})
            expect(validation).to.be.undefined;
        })
        it('Deve retornar mensagem alternativa', () => {
            const message = "Não Válido";
            const validation = validate({CPF: '123'}, {CPF: {cpf: {message}}})
            expect(validation.CPF[0]).to.equal("Cpf " + message)
        })
    })
    describe('isContainedIn', () => {
        it('Módulo deve estar injetado', () => {
            expect(validate.validators.isContainedIn).to.not.be.undefined;
        })
        it('Deve retornar vazio se nenhum valor for passado', () => {
            const values = [];
            const list = [];
            const validation = validate({values}, {values: {isContainedIn: {list}}});
            expect(validation).to.be.undefined;
        })
        it('Deve retornar vazio se nenhum valor for passado', () => {
            const values = [];
            const list = [];
            const validation = validate({values}, {values: {isContainedIn: {list}}});
            expect(validation).to.be.undefined;
        })
        it('Deve retornar vazio se existir na list mas não nos parametros', () => {
            const values = [];
            const list = ['a'];
            const validation = validate({values}, {values: {isContainedIn: {list}}});
            expect(validation).to.be.undefined;
        })
        it('Deve retornar vazio se todos os valores passados estiverem contidos', () => {
            const values = ['b', 'a'];
            const list = ['a', 'b'];
            const validation = validate({values}, {values: {isContainedIn: {list}}});
            expect(validation).to.be.undefined;
        })
        it('Deve retornar mensagem se nenhum valor não existir na lista', () => {
            const message = "Values Não está condido na lista";
            const values = ['a'];
            const list = [];
            const validation = validate({values}, {values: {isContainedIn: {list}}});
            expect(validation.values[0]).to.equal(message);
        })
    })
})