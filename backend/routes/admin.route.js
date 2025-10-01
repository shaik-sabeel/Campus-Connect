const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

// All admin routes must be authenticated and checked for admin role
router.use(authMiddleware.authUser);
router.use(adminMiddleware.isAdmin);

// Admin dashboard stats
router.get('/stats', adminController.getAdminStats);

// Admin: Get all events (including pending) for moderation
router.get('/events', adminController.getAllEventsAdmin);

// Admin: Approve a specific event
router.patch('/events/:id/approve', adminController.approveEvent);

// Admin: Reject a specific event
router.patch('/events/:id/reject', [
    body('reason').isLength({ min: 10 }).withMessage('Rejection reason must be at least 10 characters long.')
], adminController.rejectEvent);

// Admin: Users management
router.get('/users', adminController.getAllUsersAdmin);
router.put('/users/:id/role', [
    body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin')
], adminController.updateUserRoleAdmin);


module.exports = router;    