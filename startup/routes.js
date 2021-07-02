const express = require('express');
const mails = require('../routes/mails');
const mailLogs = require('../routes/mailLogs');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const passport = require('passport');
const cors = require('cors');

module.exports = function (app) {

    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());
    app.use('/api/history', mailLogs);
    app.use('/api/mails', mails);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);

}