const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        maxlength: [6, 'Password cannot exceed 6 characters'], // Correct usage of maxlength
        select:false
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

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function(enteredPassword){
   return  await bcrypt.compare(enteredPassword, this.password);

}

const User = mongoose.model('User', userSchema);
module.exports = User;