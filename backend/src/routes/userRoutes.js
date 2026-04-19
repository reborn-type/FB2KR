const express = require('express');
const router = express.Router();

const userController = require('../controllers/usersControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const adminOnly = [authMiddleware, checkRole(['Администратор'])];

router.get('/', adminOnly, userController.getUsers);
router.get('/:id', adminOnly, userController.getUser);
router.get('/email/:email', adminOnly, userController.getUserWithEmail);
router.post('/', adminOnly, userController.postUser);
router.patch('/:id', adminOnly, userController.patchUserWithId);
router.delete('/:id', adminOnly, userController.deleteUserWithId);

module.exports = router;