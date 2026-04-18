const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.post('/users', userController.postUser);
router.patch('/users/:id', userController.patchUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;