const db = require('../config/db');

async function getAllProducts() {
    const res = await db.query('SELECT * FROM products;');
    return res.rows;
};

async function getProductById(productId) {
    const qry = 'SELECT * FROM products WHERE id = $1;';
    const values = [productId];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};


async function createProduct(name, price, category, description, countInStock, imagePath) {
     const qry = `
        INSERT INTO products (name, price, category, description, count_in_stock, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [name, price, category, description, countInStock, imagePath];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

async function patchProductById(id, name, price, category, description, countInStock, imagePath) {
    const qry = `
        UPDATE products
        SET name = $1, price = $2, category = $3, description = $4, count_in_stock = $5, image_url = $6
        WHERE id = $7
        RETURNING *;
    `;
    const values = [name, price, category, description, countInStock, imagePath, id];
    try {
        const res = await db.query(qry, values);
        if (res.rows[0].length > 0) {
            alert('Вещь изменена.');
            console.log('Вещь изменена:', res.rows[0]);
            return res.rows[0];
        } else {
            console.log('Вещь не найдена!');
        }
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

async function deleteProductById(productId) {
    const qry = 'DELETE FROM products WHERE id = $1 RETURNING *;';
    const values = [productId]; 
    try {
        const res = await db.query(qry, values);
        if (res.rows.length > 0) {
            alert('Вещь удалена.');
            console.log('Вещь удалена:', res.rows[0]);
            return res.rows[0];
        } else {
            console.log('Вещь не найдена!');
        }
    } catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

async function getProductsByCategory(category) {
    const qry = 'SELECT * FROM products WHERE category = $1;';
    const values = [category];
    try {
        const res = await db.query(qry, values);
        if (res.rows.length > 0) {
            console.log(`Вещи в категории "${category}":`, res.rows);
            return res.rows;
        } else {
            console.log(`Вещи в категории "${category}" не найдены.`);
        }
    } catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    patchProductById,
    deleteProductById,
    getProductsByCategory
};