const Club = require('../models/club.model');
const Event = require('../models/event.model'); // If we want to link events to clubs
const emailService = require('../services/email.service');
const { validationResult } = require('express-validator');

// Create a new club
exports.createClub = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const clubData = {
            ...req.body,
            organizer: req.user._id,
            members: [req.user._id] // Creator is the first member
        };
        const club = await Club.create(clubData);
        res.status(201).json({ message: 'Club created successfully', club });
    } catch (error) {
        console.error('Error creating club:', error);
        res.status(500).json({ message: 'Error creating club', error: error.message });
    }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        let query = { isActive: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'all') {
            query.category = category;
        }

        const clubs = await Club.find(query)
            .populate('organizer', 'fullname email avatar')
            .populate('members', 'fullname email avatar') // To show member avatars on club cards
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Club.countDocuments(query);

        res.status(200).json({ clubs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ message: 'Error fetching clubs', error: error.message });
    }
};

// Get a single club by ID
exports.getClubById = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)
            .populate('organizer', 'fullname email avatar')
            .populate('members', 'fullname email avatar')
            .populate({
                path: 'events',
                match: { status: 'approved', isActive: true }, // Only show approved and active events
                select: 'title description date time location image category'
            });

        if (!club || !club.isActive) {
            return res.status(404).json({ message: 'Club not found or is inactive' });
        }
        res.status(200).json({ club });
    } catch (error) {
        console.error('Error fetching club:', error);
        res.status(500).json({ message: 'Error fetching club', error: error.message });
    }
};

// Update a club (only by organizer)
exports.updateClub = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const club = await Club.findById(req.params.id);
        if (!club || !club.isActive) {
            return res.status(404).json({ message: 'Club not found or is inactive' });
        }
        if (club.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this club' });
        }

        const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ message: 'Club updated successfully', club: updatedClub });
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ message: 'Error updating club', error: error.message });
    }
};

// Delete a club (soft delete - only by organizer)
exports.deleteClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (club.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this club' });
        }

        // Also handle removing club from associated events if desired
        await Club.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        res.status(200).json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ message: 'Error deleting club', error: error.message });
    }
};

// Join a club
exports.joinClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id).populate('organizer', 'fullname email');
        if (!club || !club.isActive) {
            return res.status(404).json({ message: 'Club not found or is inactive' });
        }
        if (club.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already a member of this club' });
        }

        club.members.push(req.user._id);
        await club.save();

        // NEW: Send email notification to club organizer
        if (club.organizer?.email) {
            await emailService.sendClubJoinedEmail(
                club.organizer.email,
                club.name,
                `${req.user.fullname.firstname} ${req.user.fullname.lastname}`
            );
        }

        res.status(200).json({ message: 'Successfully joined club' });
    } catch (error) {
        console.error('Error joining club:', error);
        res.status(500).json({ message: 'Error joining club', error: error.message });
    }
};

// Leave a club
exports.leaveClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (!club.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Not a member of this club' });
        }

        club.members = club.members.filter(memberId => memberId.toString() !== req.user._id.toString());
        await club.save();
        res.status(200).json({ message: 'Successfully left club' });
    } catch (error) {
        console.error('Error leaving club:', error);
        res.status(500).json({ message: 'Error leaving club', error: error.message });
    }
};

// Get clubs a user has organized or is a member of
exports.getUserClubs = async (req, res) => {
    try {
        const { userId } = req.params;
        const clubs = await Club.find({
            $or: [{ organizer: userId }, { members: userId }],
            isActive: true
        })
        .populate('organizer', 'fullname email avatar')
        .populate('members', 'fullname avatar')
        .populate({
            path: 'events',
            match: { status: 'approved', isActive: true },
            select: 'title date time'
        })
        .sort({ createdAt: -1 });

        res.status(200).json({ clubs });
    } catch (error) {
        console.error('Error fetching user clubs:', error);
        res.status(500).json({ message: 'Error fetching user clubs', error: error.message });
    }
};