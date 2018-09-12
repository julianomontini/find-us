const { Client } = require('pg');
const config = require('config').get('db');

const db = new Client(config);
db.connect();
module.exports = db;