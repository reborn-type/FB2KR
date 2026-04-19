const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.get('/email/:email', userController.getUserWithEmail);
router.post('/', userController.postUser);
router.patch('/:id', userController.patchUserWithId);
router.delete('/:id', userController.deleteUserWithId);

module.exports = router;