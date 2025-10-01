const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const userController = require('../controllers/user.controller.js');
const userModel = require('../models/user.model.js');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min : 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('department').notEmpty().withMessage('Department is required'),
    body('academicYear').notEmpty().withMessage('Academic Year is required'),
    body('interests').isArray({ min: 1 }).withMessage('At least one interest is required')
],
    userController.registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

// Update profile fields (Protected)
router.put('/profile', authMiddleware.authUser, userController.updateProfile)

// Update avatar (Protected, uses existing /upload route via /app.js for image buffer upload)
router.put('/profile/avatar', authMiddleware.authUser, userController.updateAvatar) // Image upload itself is via /upload, then its URL sent here.

// NEW: Routes for user connections
router.post('/connections/send', authMiddleware.authUser, userController.sendConnectionRequest);
router.delete('/connections/remove/:targetUserId', authMiddleware.authUser, userController.removeConnection);


module.exports = router;