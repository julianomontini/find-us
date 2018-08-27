const moment = require('moment');

const temConflito = (horarioA, horarioB) => {
    let mA = formatDate(horarioA);
    let mB = formatDate(horarioB);

    if(mA.inicio >= (mB.inicio) && mA.inicio <= (mB.fim))
        return true;
    if(mA.inicio <= (mB.inicio) && mA.fim >= (mB.fim))
        return true;
    if(mA.fim >= (mB.inicio) && mA.fim <= (mB.fim))
        return true;
    return false;
}

const conflitaComQualquer = (horario, horarios = []) => {
    return horarios.some(h => temConflito(horario, h));
}

module.exports = {
    temConflito,
    conflitaComQualquer
}

const formatDate = ({inicio, fim, format = 'DD/MM/YYYY HH:mm'}) => {
    return {
        inicio: moment(inicio, format, true),
        fim: moment(fim, format, true)
    }
}