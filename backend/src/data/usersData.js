const db = require('../config/db');

async function getAllUsers() {
    const res = await db.query('SELECT * FROM users;');
    return res.rows;
};

async function getUserById(userId) {
    const qry = 'SELECT * FROM users WHERE id = $1;';
    const values = [userId];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

async function createUser(name, email, passwordHash) {
     const qry = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, passwordHash];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

async function patchUserById(id, name, email, passwordHash) {
    const qry = `
        UPDATE users
        SET name = $1, email = $2, password_hash = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [name, email, passwordHash, id];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
}

async function deleteUserById(userId) {
    const qry = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const values = [userId];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser, 
    patchUserById,
    deleteUserById,
};