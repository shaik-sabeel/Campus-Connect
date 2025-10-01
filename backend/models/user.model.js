const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            required: true,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false, // Don't return password by default
    },
    department: {
        type: String,
        required : true,
        enum : ['Computer Science', 'Business Administration', 'Engineering','Medicine', 'Arts & Humanities', 'Social Sciences', 'Natural Sciences', 'Education', 'Law', 'Other']
    },
    academicYear: {
        type: String,
        required: true,
        enum : ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD']
    },
    studentID: {
        type: String,
        default: '' // Can be optional during registration
    },
    interests:{
       type: [String],
        required: true,
        enum :  [ // Expanded interests list
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music', 'Photography', 'Writing', 'Volunteering', 'Entrepreneurship', 'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness', 'Networking', 'Career', 'Academic', 'Social', 'Workshop', 'Conference', 'Seminar', 'Meetup', 'Competition', 'Exhibition'
  ]
    },
    avatar: {
        type: String,
        default: '' // Default profile image
    },
    bio: {
        type: String,
        default: ''
    },
    contactInfo: { // NEW: Contact info to display on profile
        type: String,
        default: ''
    },
    socialLinks: { // Allows users to share their LinkedIn, GitHub etc.
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    achievements: [{ // List of achievements, can be populated by system
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Award' }, // e.g., Lucide icon name
        earnedDate: { type: Date, default: Date.now },
        color: { type: String, default: 'from-purple-600 to-blue-600' } // Tailwind gradient classes
    }],
    // NEW: Role for admin access
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // NEW: For social connections / networking features
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Include role in token
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;