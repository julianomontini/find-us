const bcrypt = require('bcrypt');

module.exports = {
    hash: async(plain) => {
        return bcrypt.hash(plain, 10);
    },
    compare: async(plain, hashed) => {
        return bcrypt.compare(plain, hashed);
    }
}