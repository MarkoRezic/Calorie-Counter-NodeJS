require('dotenv').config();
var mysql = require('mysql');

const { DB_USER,
    DB_HOST,
    DB_PASSWORD,
    DB_DATABASE, } = process.env;


const db = mysql.createPool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
});

module.exports = db;