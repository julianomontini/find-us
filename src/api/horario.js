const moment = require('moment');

const confictsWith = (horarioA, horarioB) => {
    if(horarioA.inicio >= (horarioB.inicio) && horarioA.inicio <= (horarioB.fim))
        return true;
    if(horarioA.inicio <= (horarioB.inicio) && horarioA.fim >= (horarioB.fim))
        return true;
    if(horarioA.fim >= (horarioB.inicio) && horarioA.fim <= (horarioB.fim))
        return true;
    return false;
}

const confictsWithAny = (horario, horarios = []) => {
    return horarios.some(h => temConflito(horario, h));
}

module.exports = {
    confictsWith,
    confictsWithAny
}