const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Club+Image' // Placeholder
    },
    organizer: { // The user who created/manages the club
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    events: [{ // Events hosted by this club (populated if needed)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],
    category: {
        type: String,
        enum: ['Academic', 'Social', 'Sports', 'Volunteer', 'Technology', 'Arts', 'Professional', 'Other'], // Expanded categories
        default: 'Other'
    },
    socialLinks: { // Club's social media/website
        website: { type: String, default: '' },
        instagram: { type: String, default: '' },
        discord: { type: String, default: '' },
        facebook: { type: String, default: '' } // Added more common social links
    },
    isActive: { // Soft delete
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

clubSchema.index({ name: 1, isActive: 1 });
clubSchema.index({ organizer: 1, isActive: 1 });
clubSchema.index({ members: 1, isActive: 1 });

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;