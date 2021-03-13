const config = require('../config');

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.URI,
    ssl: process.env.DATABASE_URL ? true : false
});

// pool.query('SELECT * FROM account;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   pool.end();
// });

pool.connect();