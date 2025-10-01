const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// --- Routes requiring Authentication (User MUST be logged in for these) ---
router.use(authMiddleware.authUser);

// Create a new club
router.post('/', [
    body('name').isLength({ min: 3 }).withMessage('Club name must be at least 3 characters long'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('category').notEmpty().isIn(['Academic', 'Social', 'Sports', 'Volunteer', 'Technology', 'Arts', 'Professional', 'Other']).withMessage('Invalid club category')
], clubController.createClub);

// Get all clubs
router.get('/', clubController.getAllClubs);
// Get a single club by ID
router.get('/:id', clubController.getClubById);

// Update a club (organizer only)
router.put('/:id', clubController.updateClub);

// Delete a club (soft delete, organizer only)
router.delete('/:id', clubController.deleteClub);

// Join a club
router.post('/:id/join', clubController.joinClub);

// Leave a club
router.post('/:id/leave', clubController.leaveClub);

// Get clubs associated with a specific user (either organizer or member)
router.get('/user/:userId', clubController.getUserClubs);


module.exports = router;