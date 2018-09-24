const _ = require('lodash');

module.exports = (whitelist = []) => (data = {}) => {
    const obj = {};
    _.forOwn(data, (value, key) => {
        if(whitelist.indexOf(key) !== -1)
            obj[key] = value;
    });
    return obj;
}