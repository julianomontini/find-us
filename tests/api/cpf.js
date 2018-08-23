const CPF = require('../../src/api/cpf');
const expect = require('chai').expect;

describe('Validador CPF', function(){
    it('Deve retornar falso se CPF for nulo', () => {
        expect(CPF()).to.eq(false);
    })
    it('Deve retornar inválido quando CPF for vazio', () => {
        expect(CPF('')).to.eq(false)
    })
    it('Deve retornar inválido quando CPF tiver menos que 11 digitos', () => {
        expect(CPF('3936319782')).to.equal(false);
    })
    it('Deve retornar falso se CPF tiver mais que 11 digitos', () => {
        expect(CPF('393631978244')).to.equal(false);
    })
    it('Deve retornar falso quando todos os numeros do cpf forem iguais', () => {
        expect(CPF('55555555555')).to.equal(false)
    })
    it('Deve retornar verdadeiro quando CPF for válido', () => {
        expect(CPF('39363197824')).to.equal(true);
    })
})