const authController = require('../controllers/authController');
const express = require("express")
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', authController.registerUser);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Управление аутентификацией
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     required:         
 *       - email
 *       - password
 *     properties:       
 *       email:
 *         type: string
 *         example: chicken@mail.ru
 *       password:
 *         type: string
 *         example: qwerty123
 */
router.post('/register', authController.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.ru
 *               password:
 *                 type: string
 *                 example: password123
 */
router.post('/login', authController.loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные профиля получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Не авторизован (отсутствует или неверный токен)
 */
router.get('/me', authMiddleware, authController.authMeController)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление пары токенов
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *       401:
 *         description: Refresh токен недействителен или истек
 */
router.post('/refresh', authController.updateRefreshToken)

module.exports = router;