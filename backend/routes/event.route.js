const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all events (Publicly accessible to see titles/descriptions of approved events)
// But to access user-specific features like RSVP status, login is needed.
// This route now uses getAllEvents controller which filters for 'approved'.
router.get('/', eventController.getAllEvents);

// Get single event (Publicly accessible if approved, protected for organizers/admins for pending)
router.get('/:id', authMiddleware.authUser, eventController.getEventById); // Modified to be protected for enhanced logic in controller


// --- Routes requiring Authentication (User MUST be logged in for these) ---

// Create event
router.post('/', [
    authMiddleware.authUser,
    body('title').isLength({ min: 3 }).withMessage('Event title must be at least 3 characters long'),
    body('description').isLength({ min: 10 }).withMessage('Event description must be at least 10 characters long'),
    body('date').isISO8601().withMessage('Valid date (YYYY-MM-DD) is required'),
    body('time').notEmpty().withMessage('Event time is required'),
    body('location').notEmpty().withMessage('Event location is required'),
    body('category').notEmpty().isIn(['Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music', 'Photography', 'Writing', 'Volunteering', 'Entrepreneurship', 'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness', 'Networking', 'Career', 'Academic', 'Social', 'Workshop', 'Conference', 'Seminar', 'Meetup', 'Competition', 'Exhibition', 'Other']).withMessage('Invalid event category'),
    body('maxAttendees').isInt({ min: 1 }).withMessage('Maximum attendees must be at least 1')
], eventController.createEvent);

// Update event
router.put('/:id', [
    authMiddleware.authUser,
    body('title').optional().isLength({ min: 3 }).withMessage('Event title must be at least 3 characters long'),
    body('description').optional().isLength({ min: 10 }).withMessage('Event description must be at least 10 characters long'),
    body('date').optional().isISO8601().withMessage('Valid date (YYYY-MM-DD) is required'),
    body('maxAttendees').optional().isInt({ min: 1 }).withMessage('Maximum attendees must be at least 1')
], eventController.updateEvent);

// Delete event (soft delete, organizer/admin only)
router.delete('/:id', authMiddleware.authUser, eventController.deleteEvent);

// Join event (RSVP)
router.post('/:id/join', authMiddleware.authUser, eventController.joinEvent);

// Leave event (Cancel RSVP)
router.post('/:id/leave', authMiddleware.authUser, eventController.leaveEvent);

// Get user's created/attended events
router.get('/user/events', authMiddleware.authUser, eventController.getUserEvents);


module.exports = router;