const config = require('../config');

const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.URI,
    ssl: !!process.env.DATABASE_URL
});

module.exports = {pool};