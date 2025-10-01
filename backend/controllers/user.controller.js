const userModel = require('../models/user.model.js');
const userService = require('../services/user.service.js'); // Assuming this service exists and createUser
const { validationResult } = require('express-validator');
const blackListTokenModel = require("../models/blacklistToken.model.js")
const cloudinary = require('cloudinary').v2


//Register User
module.exports.registerUser = async (req, res, next) => {
    console.log('Registration request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ message: errors.array()[0].msg || 'Validation failed' }); // Send single error message
    }

    const { fullname, email, password, department, academicYear, studentID, interests } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist with this email' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    // Call user service for clean logic
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        department,
        academicYear,   
        studentID, // NEW: Include studentID
        interests
    });

    const token = user.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log('User registered successfully:', user.email);
    res.status(201).json({ token, user, message: 'Registration successful!' });
}

//Login User
module.exports.loginUser = async (req, res, next) => {
    console.log('Login request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Login validation errors:', errors.array());
        return res.status(400).json({ message: errors.array()[0].msg || 'Validation failed' });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password'); // Ensure password is selected

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log('User logged in successfully:', user.email);
    // Return user without password (use `.toObject()` or map)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).json({ token, user: userWithoutPassword, message: 'Login successful!' });
}

//to get user profile
module.exports.getUserProfile = async (req, res, next) => {
    // req.user is populated by authMiddleware. Just ensure `userModel.findById` doesn't `select: false` by default for the token `_id` lookup if it's explicitly set.
    // The `_id` field is selected by default in mongoose.
    res.status(200).json({ user: req.user }); // req.user already has `fullname.firstname` etc.
}

//Logout User
module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
        await blackListTokenModel.create({ token });
    }
    
    res.clearCookie('token', { // Clear cookie with same options it was set with
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

// Update user profile (bio, socialLinks, department/year)
module.exports.updateProfile = async (req, res, next) => {
    try {
        const updates = {}
        const allowedFields = [
            'bio', 'contactInfo', 'department', 'academicYear', 'studentID', // Added studentID and contactInfo
            'socialLinks.linkedin', 'socialLinks.github', 'socialLinks.twitter'
        ];
        
        // Dynamically build updates object, including nested fields
        for (const key of Object.keys(req.body || {})) {
            if (allowedFields.includes(key)) {
                if (key.includes('.')) { // Handle nested paths like socialLinks.linkedin
                    const [parent, child] = key.split('.');
                    if (!updates[parent]) {
                        updates[parent] = {};
                    }
                    updates[parent][child] = req.body[key];
                } else {
                    updates[key] = req.body[key];
                }
            } else if (key === 'firstname') { // Special handling for fullname sub-fields
                updates['fullname.firstname'] = req.body[key];
            } else if (key === 'lastname') { // Special handling for fullname sub-fields
                updates['fullname.lastname'] = req.body[key];
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true })
        
        // To update interests (could be a separate patch request if desired, or handle here)
        if (req.body.interests && Array.isArray(req.body.interests)) {
            updatedUser.interests = req.body.interests;
            await updatedUser.save();
        }

        return res.status(200).json({ user: updatedUser, message: 'Profile updated successfully!' })
    } catch (e) {
        console.error('Error updating profile:', e);
        return res.status(400).json({ message: 'Failed to update profile', error: e.message })
    }
}

// Update avatar using a provided URL (client uploads to /upload first)
module.exports.updateAvatar = async (req, res, next) => {
    try {
        const { url } = req.body
        if (!url) {
            return res.status(400).json({ message: 'Image URL is required' })
        }
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { $set: { avatar: url } }, { new: true })
        return res.status(200).json({ user: updatedUser, message: 'Avatar updated successfully!' })
    } catch (e) {
        console.error('Error updating avatar:', e);
        return res.status(400).json({ message: 'Failed to update avatar', error: e.message })
    }
}

// NEW: Connect/Disconnect users for dashboard
module.exports.sendConnectionRequest = async (req, res, next) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) {
            return res.status(400).json({ message: 'Target user ID is required' });
        }
        if (req.user._id.toString() === targetUserId) {
            return res.status(400).json({ message: 'Cannot send connection request to yourself.' });
        }

        const currentUser = await userModel.findById(req.user._id);
        const targetUser = await userModel.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }
        
        if (currentUser.connections.includes(targetUserId)) {
            return res.status(400).json({ message: 'Already connected with this user.' });
        }

        currentUser.connections.push(targetUserId);
        targetUser.connections.push(req.user._id); // Make it a mutual connection for simplicity
        
        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'Connection established successfully!' });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Error establishing connection', error: error.message });
    }
};

module.exports.removeConnection = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        if (req.user._id.toString() === targetUserId) {
            return res.status(400).json({ message: 'Cannot remove yourself as a connection.' });
        }

        const currentUser = await userModel.findById(req.user._id);
        const targetUser = await userModel.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }
        
        if (!currentUser.connections.includes(targetUserId)) {
            return res.status(400).json({ message: 'Not connected with this user.' });
        }

        currentUser.connections = currentUser.connections.filter(id => id.toString() !== targetUserId);
        targetUser.connections = targetUser.connections.filter(id => id.toString() !== req.user._id.toString());
        
        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'Connection removed successfully!' });
    } catch (error) {
        console.error('Error removing connection:', error);
        res.status(500).json({ message: 'Error removing connection', error: error.message });
    }
};