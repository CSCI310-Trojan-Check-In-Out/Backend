const {databaseConfig} = require('../config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: databaseConfig.URI
});

module.exports = {pool};