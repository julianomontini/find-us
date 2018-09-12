const elastic = require('elasticsearch');
const config = require('config').get('elastic');
module.exports = new elastic.Client({...config});