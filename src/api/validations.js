const validate = require('validate.js');
const moment = require('moment');
const _ = require('lodash');

//VALIDATE.JS CONFIGURACAO DE DATA
(() => {
    validate.extend(validate.validators.datetime, {
        parse: (value, options) => moment(value, 'DD/MM/YYYY HH:mm').unix(),
        format: (value, options) => moment.unix(value).format("DD/MM/YYYY HH:mm")
    });
})();

exports.nomeUsuario = {
    presence: {
        allowEmpty: false,
        message: "Obrigatório"
    },
    length: {
        minimum: 5,
        maximum: 100,
        message: "Deve ter entre 5 e 50 caractéres"
    }
}
exports.cpf = {
    presence: {
        allowEmpty: false,
        message: "Obrigatório"
    },
    length: {
        is: 11,
        message: "Deve ter exatamente 11 dígitos"
    },
    cpf: true
}
exports.email = {
    presence: {
        allowEmpty: false,
        message: "Obrigatório"
    },
    email: {
        message: "Inválido"
    }
}
exports.senha = {
    presence: {
        allowEmpty: false,
        message: "Obrigatória"
    },
    length: {
        minimum: 6,
        maximum: 20,
        message: "Deve ter entre 6 e 20 caractéres"
    }
}
exports.perfilPublico = {
    presence: {
        allowEmpty: false,
        message: "Deve ser selecionado"
    },
    isContainedIn: {
        list: ['Aluno', 'Professor']
    }
}
exports.celular = {
    presence: {
        allowEmpty: false,
        message: "Obrigatório"
    },
    length: {
        minimum: 10,
        maximum: 11,
        message: "Deve ter entre 10 e 11 dígitos"
    },
    numericality: {
        message: "Inválido"
    }
}

exports.aula = {
    horario: {
        datetime: {
            latest: moment.utc().add(1, 'years'),
            message: "Inválido"
        }
    },
    titulo: {
        presence: {
            allowEmpty: false,
            message: "Obrigatório"
        },
        length: {
            minimum: 5,
            maximum: 35,
            message: "Deve ter entre 5 e 35 caractéres"
        }
    },
    descricao: {
        presence: {
            allowEmpty: false,
            message: "Obrigatório"
        },
        length: {
            minimum: 30,
            maximum: 300,
            message: "Deve ter entre 5 e 35 caractéres"
        }
    },
    tag: {
        presence: {
            allowEmpty: false,
            message: "Deve ser selecionada"
        }
    }
}

//Validadores custom

//VALIDAÇÃO DE CPF
const validateCpf = require('./cpf');
validate.validators.cpf = (value, { message }) => {
    return validateCpf(value) ? null : (message ? message : "Inválido");
};
validate.validators.isContainedIn = (values = [], { list = [], message }) => {
    for(v of values){
        if(list.indexOf(v) === -1)
            return message ? message : "Não está condido na lista";
    }
}