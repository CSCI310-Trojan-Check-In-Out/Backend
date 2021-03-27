const {databaseConfig} = require('../config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: databaseConfig.URI,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
    //ssl: { rejectUnauthorized: false }
});

module.exports = {pool};