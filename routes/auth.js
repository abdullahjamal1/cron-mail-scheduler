const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateLogin } = require('../models/user');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('config');

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google',
        {
            failureRedirect: '/api/auth/google',
            failureFlash: 'Invalid Google credentials.',
            session: false
        }),
    function (req, res) {

        // set authorization header
        // then send redirect
        const token = req.user.generateAuthToken();

        res.header('x-auth-token', token);
        res.redirect(`${config.get('frontend-url')}callback?token=${token}`);
    });


router.post('/login', validate(validateLogin), async (req, res) => {

    // validating email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    // validating password
    // deny if password is not set ( as in oauth)
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword || !user.password) return res.status(400).send('Invalid email or password');

    // check if email is verified
    if (!user.isVerified) {
        return res.status(400).send('Email not verified');
    }

    const token = user.generateAuthToken();

    res.send(token);
});

module.exports = router;