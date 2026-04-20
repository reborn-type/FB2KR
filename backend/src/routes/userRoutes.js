const express = require('express');
const router = express.Router();

const userController = require('../controllers/usersControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const adminOnly = [authMiddleware, checkRole(['Администратор'])];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями (Только для Администраторов)
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей успешно получен
 *       403:
 *         description: Доступ запрещен (недостаточно прав)
 */
router.get('/', adminOnly, userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя получены
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', adminOnly, userController.getUser);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Найти пользователя по Email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email пользователя
 *     responses:
 *       200:
 *         description: Пользователь найден
 */
router.get('/email/:email', adminOnly, userController.getUserWithEmail);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Пользователь, Продавец, Администратор]
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
router.post('/', adminOnly, userController.postUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновить данные пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Данные обновлены
 */
router.patch('/:id', adminOnly, userController.patchUserWithId);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить/Заблокировать пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 */
router.delete('/:id', adminOnly, userController.deleteUserWithId);

module.exports = router;