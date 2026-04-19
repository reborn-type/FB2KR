const authController = require('../controllers/authController');
const express = require("express")
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', authController.registerUser);

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Авторизация пользователя
*     description: Проверяет логин и пароль пользователя
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - first_name
*               - last_name
*               - password
*             properties:
*               email:
*                 type: string
*                 example: chicken@mail.ru 
*               first_name:
*                 type: string
*                 example: Ivan
*               last_name:
*                 type: string
*                 example: Ivanov
*               password:
*                 type: string
*                 example: qwerty123
*     responses:
*       200:
*         description: Успешная авторизация
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 login:
*                   type: boolean
*                   example: true
*       400:
*         description: Отсутствуют обязательные поля
*       401:
*         description: Неверные учетные данные
*       404:
*         description: Пользователь не найден
*/
router.post('/login', authController.loginUser);

router.get('/me', authMiddleware, authController.authMeController)

router.post('/refresh', authController.updateRefreshToken)

module.exports = router;