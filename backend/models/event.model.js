const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [3, 'Event title must be at least 3 characters long']
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'Event description must be at least 10 characters long']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // Stored as HH:MM string for flexibility
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music', 'Photography', 'Writing', 'Volunteering', 'Entrepreneurship', 'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness', 'Networking', 'Career', 'Academic', 'Social', 'Workshop', 'Conference', 'Seminar', 'Meetup', 'Competition', 'Exhibition', 'Other'] // Expanded categories
    },
    maxAttendees: {
        type: Number,
        required: true,
        min: [1, 'Maximum attendees must be at least 1']
    },
    currentAttendees: {
        type: Number,
        default: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    image: {
        type: String,
        default: ''
    },
    // Active flag used across queries; default true so new/legacy events are visible
    isActive: {
        type: Boolean,
        default: true
    },
    // NEW: Fields for admin approval workflow
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' // Events start as pending
    },
    adminApprovalDate: {
        type: Date
    },
    adminApprovalMessage: { // Reason for rejection or admin notes
        type: String,
        default: ''
    },
    // NEW: Fields for richer event details from CreateEventPage
    requirements: [{ // e.g. "Bring laptop"
        type: String
    }],
    contactInfo: { // e.g. event-specific email or phone
        type: String
    },
    isOnline: { // If it's an online event
        type: Boolean,
        default: false
    },
    // NEW: For Club-specific events
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        default: null // An event might not belong to a club directly
    }

}, {
    timestamps: true
});

// Index for better query performance
eventSchema.index({ date: 1, isActive: 1, status: 1 });
eventSchema.index({ category: 1, isActive: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ attendees: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;