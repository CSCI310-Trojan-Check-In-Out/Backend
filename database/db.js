const config = require('../config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.URI
});

module.exports = {pool};