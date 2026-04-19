const db = require('../config/db');
const {nanoid} = require("nanoid")

async function getAllProducts() {
    const res = await db.query('SELECT * FROM products;');
    return res.rows;
};

async function getProductById(productId) {
    const qry = 'SELECT * FROM products WHERE product_id = $1;';
    const values = [productId];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
    }
};


async function createProduct(id, name, price, category, description, countInStock, imagePath) {
    console.log('Создание продукта с данными:', {id, name, price, category, description, countInStock, imagePath });
    const qry = `
        INSERT INTO products (product_id, product_name, price, category, description, count_in_stock, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING * 
    `;
    const values = [id, name, price, category, description, countInStock, imagePath];
    try {
        const res = await db.query(qry, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Критическая ошибка при создании продукта:', err.message);
        throw err;
    }
};

async function patchProductById(id, name, price, category, description, countInStock, imagePath) {
    const qry = `
        UPDATE products
        SET name = $1, price = $2, category = $3, description = $4, count_in_stock = $5, image_url = $6
        WHERE product_id = $7
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
    const qry = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
    const values = [productId];
    try {
        const res = await db.query(qry, values);
        if (res.rows.length > 0) {
            console.log('Вещь удалена:', res.rows[0]);
            return res.rows[0];
        } else {
            console.log('Попытка удаления: Товар с таким ID не найден в базе.');
            return null;
        }
    } catch (err) {
        console.error('Ошибка при выполнении запроса: ', err.stack);
        throw err; 
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