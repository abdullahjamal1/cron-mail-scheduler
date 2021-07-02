const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: false, // no password for oauth strategy
        minLength: 5,
        maxLength: 1024
    },
    avatar_url: {
        type: String,
        required: false,
        minLength: 5,
        maxLength: 1024
    },
    isVerified: Boolean,
    isAdmin: Boolean,

    // roles: [],
    // operations: []
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

userSchema.methods.generateMailVerificationToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwt-mail-verification-key'), { expiresIn: '1h' });
    return token;
}

const User = mongoose.model('User', userSchema);

// TODO : take common schema properties out

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}
function validateLogin(req) {

    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}

function validateEmail(email) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email()
    };
    return Joi.validate(email, schema);
}

function validatePassword(password) {
    const schema = {
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(password, schema);
}

module.exports = {
    User, validateUser, validateEmail, validatePassword, validateLogin
}