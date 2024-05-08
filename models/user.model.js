
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    username: { type: String, required: true , get(v) { return v.toUpperCase() } },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: [6, 'password length < 6'] },
    adress: { type: String, required: false},
    role: { type: String, default: 'user', enum: ['admin', 'user', 'guest'] }
})




//joi validations

module.exports.userValidators = {
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(18),
    })
}

// ensure strong password: minimum 6 characters including both uppercase and lowercase letters
const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

module.exports.validPassword = Joi.object({
  password: Joi.string().pattern(new RegExp(pattern))
});

module.exports.validEmail = Joi.object({
  email: Joi.string().pattern(new RegExp(pattern))
});




//bycrpt for secret password in the database

userSchema.pre('save', function (next) {
    const salt = +process.env.BCRYPT_SALT | 7;
    bcrypt.hash(this.password, salt, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);

        this.password = hashPass;
        next()
    })
});




//token

module.exports.generateToken = (user) => {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; 
    const data = { role: user.role, user_id: user._id }; 
    const token = jwt.sign(data, privateKey, { expiresIn: '24h' });
    return token;
}

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('users', userSchema);
