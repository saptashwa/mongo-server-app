const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
// const adminMiddleware = require('../middlewares/adminMiddleware');

// API endpoint for user registration
router.post('/register', userController.signup);

// API endpoint for user login
router.post('/login', userController.login);

// API endpoint for fetching all users (only accessible by admin users)
router.get('', authMiddleware, userController.getAllUsers);

// API endpoint for fetching a single user by id
router.get('/:id', userController.getUserById);

// API endpoint for updating user details (only accessible by authenticated users)
// router.patch('/update', authMiddleware, userController.updateUserDetails);

// API endpoint for deleting user by id (only accessible by admin users)
// router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUserById);

module.exports = router;
