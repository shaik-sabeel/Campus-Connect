const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    console.log('Auth middleware - Token present:', !!token);
    console.log('Auth middleware - Cookies:', req.cookies);

    if (!token) {
        console.log('Auth middleware - No token found');
        return res.status(401).json({ message: 'Unauthorized' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        console.log('Auth middleware - Verifying token');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded:', decoded);
        const user = await userModel.findById(decoded._id)
        console.log('Auth middleware - User found:', user?.email);

        req.user = user;

        return next();

    } catch (err) {
        console.log('Auth middleware - Token verification failed:', err.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}