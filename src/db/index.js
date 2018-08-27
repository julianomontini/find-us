const { Client } = require('pg');

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'find-us',
    password: 'postgres',
    port: 5432
  })
db.connect();
module.exports = db;