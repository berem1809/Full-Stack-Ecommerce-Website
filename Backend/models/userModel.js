const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Name']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email'],
        unique: true,
        validate: [validator.isEmail, 'Please Enter Valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        maxlength: [6, 'Password cannot exceed 6 characters'] // Correct usage of maxlength
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpired: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre('save',async function (next){
    this.password  = await bcrypt.hash(this.password, 10);
})
const User = mongoose.model('User', userSchema);
module.exports = User;