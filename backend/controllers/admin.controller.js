const Event = require('../models/event.model');
const User = require('../models/user.model');
const Club = require('../models/club.model');
const emailService = require('../services/email.service');
const { validationResult } = require('express-validator');

// Admin: Get all events (including pending, approved, rejected, inactive)
exports.getAllEventsAdmin = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        let query = {}; // No initial filter by status for admin

        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
             query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        const events = await Event.find(query)
            .populate('organizer', 'fullname email avatar')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Event.countDocuments(query);
        
        res.status(200).json({ events, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        console.error('Error fetching events for admin:', error);
        res.status(500).json({ message: 'Error fetching events for admin', error: error.message });
    }
};

// Admin: Approve event
exports.approveEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Also ensure a reason can be passed (optional here)
        const event = await Event.findById(id).populate('organizer', 'fullname email');

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.status === 'approved') return res.status(400).json({ message: 'Event is already approved.' });

        event.status = 'approved';
        event.adminApprovalDate = Date.now();
        event.adminApprovalMessage = 'Approved by admin.';
        await event.save();

        if (event.organizer?.email) {
            await emailService.sendEventStatusUpdateEmail(event.organizer.email, event, 'approved');
        }
        
        res.status(200).json({ message: 'Event approved successfully', event });
    } catch (error) {
        console.error('Error approving event:', error);
        res.status(500).json({ message: 'Error approving event', error: error.message });
    }
};

// Admin: Reject event
exports.rejectEvent = async (req, res, next) => {
    const errors = validationResult(req); // Assuming you might have validation for reason
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const { reason } = req.body; // Expect a reason from the admin via body

        const event = await Event.findById(id).populate('organizer', 'fullname email');

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.status === 'rejected') return res.status(400).json({ message: 'Event is already rejected.' });

        event.status = 'rejected';
        event.adminApprovalDate = Date.now();
        event.adminApprovalMessage = reason || 'Rejected by admin, no specific reason provided.';
        await event.save();

        if (event.organizer?.email) {
            await emailService.sendEventStatusUpdateEmail(event.organizer.email, event, 'rejected', event.adminApprovalMessage);
        }

        res.status(200).json({ message: 'Event rejected successfully', event });
    } catch (error) {
        console.error('Error rejecting event:', error);
        res.status(500).json({ message: 'Error rejecting event', error: error.message });
    }
};

// Admin: Get Dashboard Stats
exports.getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const pendingEvents = await Event.countDocuments({ status: 'pending' });
        const approvedEvents = await Event.countDocuments({ status: 'approved' });
        const rejectedEvents = await Event.countDocuments({ status: 'rejected' });
        const totalClubs = await Club.countDocuments({isActive: true}); // assuming Clubs are active

        res.status(200).json({
            totalUsers,
            totalEvents,
            pendingEvents,
            approvedEvents,
            rejectedEvents,
            totalClubs,
            eventsByStatus: {
                totalEvents, pendingEvents, approvedEvents, rejectedEvents
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
    }
};

// Admin: Get all users (with optional search/pagination)
exports.getAllUsersAdmin = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20, role } = req.query;
        const query = {};

        if (role && role !== 'all') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { 'fullname.firstname': { $regex: search, $options: 'i' } },
                { 'fullname.lastname': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await User.countDocuments(query);
        res.status(200).json({ users, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ message: 'Error fetching users for admin', error: error.message });
    }
};

// Admin: Update a user's role
exports.updateUserRoleAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Use "user" or "admin".' });
        }

        // Prevent removing own admin via this endpoint for safety
        if (req.user && req.user._id.toString() === id && role !== 'admin') {
            return res.status(400).json({ message: 'You cannot change your own role via this endpoint.' });
        }

        const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user: updated });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};