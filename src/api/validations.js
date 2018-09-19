const validate = require('validate.js');
const moment = require('moment');
const _ = require('lodash');

//VALIDATE.JS CONFIGURACAO DE DATA
(() => {
    validate.extend(validate.validators.datetime, {
        parse: (value, options) => moment(value).unix(),
        format: (value, options) => moment.unix(value)
    });
})();


exports.customer = {
    name: {
        presence: {
            allowEmpty: false
        },
        length: {
            minimum: 5,
            maximum: 50
        }
    },
    cpf: {
        presence: {
            allowEmpty: false
        },
        cpf: true
    },
    email: {
        presence: {
            allowEmpty: false
        },
        email: true
    },
    password: {
        presence: {
            allowEmpty: false
        },
        length: {
            minimum: 6,
            maximum: 20
        }
    },
    roles: {
        presence: {
            allowEmpty: false
        },
        isContainedIn: {
            list: ['Student', 'Teacher']
        }
    },
    phone: {
        presence: {
            allowEmpty: false
        },
        length: {
            minimum: 10,
            maximum: 11
        },
        numericality: true
    }
}

exports.lesson = {
    time: {
        datetime: {
            latest: moment.utc().add(1, 'years')
        }
    },
    title: {
        presence: {
            allowEmpty: false
        },
        length: {
            minimum: 5,
            maximum: 35
        }
    },
    description: {
        presence: {
            allowEmpty: false
        },
        length: {
            minimum: 30,
            maximum: 300
        }
    }
}

//---------Custom Validators-----------

//CPF Validator
const validateCpf = require('./cpf');
validate.validators.cpf = (value = "", { message }) => {
    return validateCpf(value) ? null : (message ? message : "Invalid");
};

//Is contained in validator
validate.validators.isContainedIn = (values = [], { list = [], message }) => {
    for(v of values){
        if(list.indexOf(v) === -1)
            return message ? message : `should be contained in [${list.toString()}]`;
    }
}