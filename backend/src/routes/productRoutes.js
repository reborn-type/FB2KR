const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const allAuth = [authMiddleware, checkRole(['Пользователь', 'Продавец', 'Администратор'])];
const staffOnly = [authMiddleware, checkRole(['Продавец', 'Администратор'])];
const adminOnly = [authMiddleware, checkRole(['Администратор'])];

/**
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           required:
*               - name
*               - price
*               - category
*               - description
*               - countInStock
*           properties:
*               id:
*                   type: string
*                   description: Автоматически сгенерированный уникальный ID товара длиной в 6 символов
*               name:
*                   type: string
*                   description: Название вещи
*               price:
*                   type: integer
*                   description: Стоимость вещи
*               category:
*                   type: string
*                   description: Категория вещи 
*               desrciption:
*                   type: string
*                   description: Описание вещи 
*               countInStock:
*                   type: integet
*                   description: Кол-во вещей доступных на сайте
*               example:
*                   id: "abc123"
*                   name: Guess Hoodie
*                   price: 16232
*                   category: верхняя одежда
*                   description: Черное кожанное худи
*                   countInStock: 121
*/


/**
* @swagger
* /api/products:
*   get:
*       summary: Возвращает список всех товаров
*       tags: [Products]
*       responses:
*           200:
*               description: Список товаров
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Product'
*/
router.get('/', allAuth, productController.getProducts);

/**
* @swagger
* /api/products/{id}:
*   get:
*       summary: Получает товара по ID
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           200:
*               description: Данные товара
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Товар не найден
*/
router.get('/:id', allAuth, productController.getProduct);

router.get('/category/:type', allAuth, productController.getProductsByCat);
/**
* @swagger
* /api/products:
*   post:
*     summary: Создает новый товар
*     tags: [Products]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*               - price          
*               - category
*               - description
*               - countInStock
*             properties:
*               name:
*                 type: string
*               price:
*                 type: integer
*               category:
*                 type: string
*               description:
*                 type: string
*               countInStock:
*                 type: integer
*     responses:
*       201:
*         description: Товар успешно создан
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Product'
*       400:
*         description: Ошибка в теле запроса
*/
router.post('/', staffOnly, productController.postProduct);

/**
* @swagger
* /api/products/{id}:
*   patch:
*       summary: Обновляет данные товара
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           name:
*                               type: string
*                           price:
*                               type: integer
*                           category:
*                               type: string
*                           description:
*                               type: string
*                           countInStock:
*                               type: string
*       responses:
*           200:
*               description: Обновленный товар
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           400:
*               description: Нет данных для обновления
*           404:
*               description: Товар не найден
*/
router.patch('/:id', staffOnly, productController.patchProduct);

/**
* @swagger
* /api/products/{id}:
*   delete:
*       summary: Удаляет товар
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           204:
*               description: Товар успешно удален (нет тела ответа)
*           404:
*               description: Товар не найден
*/
router.delete('/:id', adminOnly, productController.deleteProduct);

module.exports = router;