const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});

// const Pool = require('pg').Pool;
// const pool = new Pool({
    // user: 'postgres',
    // password: 'oyV9&GbL',
    // host: '62.217.177.183',
    // port: 5432,
    // database: 'postgres'
// });

// const { Client } = require('pg'); 

// const client = new Client({
//     user: 'gen_user',
//     host: '81.200.152.205',
//     database: 'default_db',
//     password: 'dg2l9fk4x9',
//     port: 5432,
// });

// client.connect();

 module.exports = pool;
// module.exports = client;