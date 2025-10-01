const Event = require('../models/event.model');
const { validationResult } = require('express-validator');
const emailService = require('../services/email.service'); // NEW: import email service

// Get all events
module.exports.getAllEvents = async (req, res, next) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        // NEW: Only approved and active events for general public view
        // Also include legacy events where isActive might be missing
        let query = { 
            status: 'approved', 
            $or: [ { isActive: true }, { isActive: { $exists: false } } ]
        };
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { location: { $regex: search, $options: 'i' } } // Search by location
            ];
        }
        
        const events = await Event.find(query)
            .populate('organizer', 'fullname email avatar') // Added avatar to organizer
            .sort({ date: 1 })
            .limit(parseInt(limit)) // Ensure limit is a number
            .skip((parseInt(page) - 1) * parseInt(limit));
            
        const total = await Event.countDocuments(query);
        
        res.status(200).json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Error fetching events:', error); // Log error
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get single event
module.exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'fullname email department academicYear avatar') // Populate more organizer details
            .populate('attendees', 'fullname email avatar'); // Populate attendees with avatar
            
        if (!event || !event.isActive) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // NEW: If event is pending/rejected, only organizer or admin can see it
        const isOrganizer = req.user && event.organizer._id.toString() === req.user._id.toString();
        const isAdmin = req.user && req.user.role === 'admin';

        if (event.status !== 'approved' && !isOrganizer && !isAdmin) {
             return res.status(404).json({ message: 'Event not found or not approved yet.' });
        }
        
        res.status(200).json({ event });
    } catch (error) {
        console.error('Error fetching single event:', error);
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Create new event
module.exports.createEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const eventData = {
            ...req.body,
            organizer: req.user._id,
            status: 'pending' // NEW: Default all new events to pending
        };
        
        const event = await Event.create(eventData);
        // Populate organizer for email service
        await event.populate('organizer', 'fullname email');
        
        // NEW: Send email to admin for approval
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail && event.organizer) {
            await emailService.sendEventApprovalEmail(
                adminEmail,
                event,
                event.organizer // Pass the populated user object
            );
        }
        
        res.status(201).json({ event, message: 'Event created successfully, awaiting admin approval.' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update event
module.exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event || !event.isActive) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Organizer can update their event. If event was approved, it goes back to pending for re-approval.
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }
        
        const updates = { ...req.body };
        // NEW: If an approved event is edited, set its status back to 'pending'
        if (event.status === 'approved') {
            updates.status = 'pending';
            updates.adminApprovalDate = null; // Clear approval date
            updates.adminApprovalMessage = 'Event edited by organizer, awaiting re-approval.';
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('organizer', 'fullname email');

        // NEW: Send approval email to admin if status changed to pending for re-approval
        if (event.status === 'approved' && updatedEvent.status === 'pending') {
             const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail && updatedEvent.organizer) {
                await emailService.sendEventApprovalEmail(adminEmail, updatedEvent, updatedEvent.organizer);
            }
        }
        
        res.status(200).json({ 
            event: updatedEvent, 
            message: (event.status === 'approved' && updatedEvent.status === 'pending') 
                ? 'Event updated and sent for re-approval.' 
                : 'Event updated successfully.' 
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete event (soft delete)
module.exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Only organizer or admin can delete
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
        
        await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        
        res.status(200).json({ message: 'Event deleted successfully (soft deleted).' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

// Join event (RSVP)
module.exports.joinEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
                                .populate('attendees', 'fullname email avatar'); // Populate attendees to check existing members, and organizer to get email
        
        if (!event || !event.isActive || event.status !== 'approved') { // NEW: Only approved events can be joined
            return res.status(404).json({ message: 'Event not found or not approved yet.' });
        }
        
        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already joined this event' });
        }
        
        if (event.currentAttendees >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }
        
        event.attendees.push(req.user._id);
        event.currentAttendees += 1;
        await event.save();
        
        // Populate attendee details for the email service
        const attendingUser = req.user; // Use req.user directly if available after auth middleware
        
        // NEW: Send RSVP confirmation email to user
        if (attendingUser && attendingUser.email) {
            await emailService.sendRsvpConfirmationEmail(attendingUser.email, event, `${attendingUser.fullname.firstname} ${attendingUser.fullname.lastname}`);
        }

        res.status(200).json({ message: 'Successfully joined event' });
    } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ message: 'Error joining event', error: error.message });
    }
};

// Leave event (Cancel RSVP)
module.exports.leaveEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
                                .populate('attendees', 'fullname email');
        
        if (!event || !event.isActive) { // Can leave regardless of approval status
            return res.status(404).json({ message: 'Event not found' });
        }
        
        if (!event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have not joined this event' });
        }
        
        event.attendees = event.attendees.filter(id => id.toString() !== req.user._id.toString());
        event.currentAttendees -= 1;
        await event.save();
        
        const leavingUser = req.user;

        // NEW: Send RSVP cancellation email to user
        if (leavingUser && leavingUser.email) {
            await emailService.sendRsvpCancelledEmail(leavingUser.email, event, `${leavingUser.fullname.firstname} ${leavingUser.fullname.lastname}`);
        }

        res.status(200).json({ message: 'Successfully left event' });
    } catch (error) {
        console.error('Error leaving event:', error);
        res.status(500).json({ message: 'Error leaving event', error: error.message });
    }
};

// Get user's events (created & attended, regardless of approval status for their own created events)
module.exports.getUserEvents = async (req, res, next) => {
    try {
        // Find events where user is organizer OR user is an attendee (and event is approved)
        const events = await Event.find({
            $or: [
                { organizer: req.user._id },
                { attendees: req.user._id, status: 'approved' } // Only count attended events if approved
            ],
            isActive: true
        })
        .populate('organizer', 'fullname email avatar')
        .populate('attendees', 'fullname email avatar')
        .sort({ date: 1 }); // Sort by date

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ message: 'Error fetching user events', error: error.message });
    }
};