const userModel = require('../models/user.model.js');


module.exports.createUser = async ({
    firstname, lastname, email, password, department, academicYear, interests
}) => {
    if (!firstname || !email || !password || !department || !academicYear || !interests ) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        department,
        academicYear,   
        interests
    })

    return user;
}