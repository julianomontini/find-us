const expect = require('chai').expect;
const horario = require('../../src/api/horario');

const horarioA = {
    inicio: '21/12/2012 09:00',
    fim: '21/12/2012 11:00'
}

describe('API Conflito de horário', () => {
    describe('Comparação de um horario com outro', () => {
        it('Deve retornar conflito se B conflita com começo de A', () => {
            const horarioB = {
                inicio: '21/12/2012 08:00',
                fim: '21/12/2012 10:00'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.true;
        });
        it('Deve retornar conflito se B esta contido em A', () => {
            const horarioB = {
                inicio: '21/12/2012 09:30',
                fim: '21/12/2012 10:30'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.true;
        })
        it('Deve retornar conflito se B conflita com fim de A', () => {
            const horarioB = {
                inicio: '21/12/2012 10:00',
                fim: '21/12/2012 12:00'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.true;
        });
        it('Deve retornar conflito se B tem mesmo horário de A', () => {
            const horarioB = {
                inicio: '21/12/2012 09:00',
                fim: '21/12/2012 11:00'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.true;
        });
        it('Não deve retornar conflito se B terminar antes de A começar', () => {
            const horarioB = {
                inicio: '21/12/2012 07:00',
                fim: '21/12/2012 08:00'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.false;
        })
        it('Não deve retornar conflito se B começar depois de A terminar', () => {
            const horarioB = {
                inicio: '21/12/2012 12:00',
                fim: '21/12/2012 13:00'
            }
            expect(horario.temConflito(horarioA, horarioB)).to.be.false;
        })
        describe('Comparação de um horário com varios', () => {
            it('Deve retornar falso se nenhum horario conflitar', () => {
                const horarios = [
                    {
                        inicio: '21/12/2012 07:00',
                        fim: '21/12/2012 08:00'
                    },
                    {
                        inicio: '21/12/2012 12:00',
                        fim: '21/12/2012 13:00'
                    }
                ];
                expect(horario.conflitaComQualquer(horarioA, horarios)).to.be.false;
            })
            it('Deve retornar verdadeiro se todos horarios conflitarem', () => {
                const horarios = [
                    {
                        inicio: '21/12/2012 09:30',
                        fim: '21/12/2012 10:30'
                    },
                    {
                        inicio: '21/12/2012 10:00',
                        fim: '21/12/2012 12:00'
                    }
                ];
                expect(horario.conflitaComQualquer(horarioA, horarios)).to.be.true;
            })
            it('Deve retornar verdadeiro se qualquer horario conflitar', () => {
                const horarios = [
                    {
                        inicio: '21/12/2012 09:30',
                        fim: '21/12/2012 10:30'
                    },
                    {
                        inicio: '21/12/2012 07:00',
                        fim: '21/12/2012 08:00'
                    },
                    {
                        inicio: '21/12/2012 12:00',
                        fim: '21/12/2012 13:00'
                    }
                ];
                expect(horario.conflitaComQualquer(horarioA, horarios)).to.be.true;
            })
        })
    })
})

/* 
            09:00              11:00

            A |-----------------|
        |---------|
                |-----------|
                        |----------|
            |----------------------|
*/