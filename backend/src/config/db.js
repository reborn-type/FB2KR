const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../data_for_db.env') }); 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}

console.log("Попытка подключения к БД пользователем:", process.env.DB_USER);