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
        select: false,
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
        type: String
    },
    interests:{
       type: [String],
        required: true,
        enum :  [
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music',
    'Photography', 'Writing', 'Volunteering', 'Entrepreneurship',
    'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness'
  ]
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
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