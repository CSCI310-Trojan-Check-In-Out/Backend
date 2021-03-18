const config = require('../config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: config.URI
});

module.exports = {pool};