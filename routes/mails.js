const { newSchedule, updateSchedule, deleteSchedule, validateSchedule } = require('../utils/scheduler');
const { Mail, validateMail } = require('../models/mail');
const { User } = require('../models/user');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const mailOwner = require('../middleware/mailOwner');
const auth = require('../middleware/auth');
const mail = require('../services/mail');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

// TODO : implement transaction if required
Fawn.init(mongoose);

/*
    should show all scheduled mails
*/
router.get('/', [auth], async (req, res) => {

    const from = await User.findById(req.user._id);
    const mails = await Mail.find({ from });

    return res.send(mails);
});

router.get('/:id', [auth, validateObjectId, mailOwner], async (req, res) => {

    const mail = await Mail.findById(req.params.id);

    if (!mail) return res.status(404).send('mail with given id not found');

    return res.send(mail);
});

/*
    @body { data, schedule }
    data: {to, cc, subject, body}
    schedule: { scheduled, second, time, monthDay, month, weekDay }
*/
router.post('/', [auth, validate(validateMail)], async (req, res) => {

    // req.user._id added in middleware from jwt
    let { data, schedule } = req.body;
    const { to, cc, subject, body } = data;

    schedule = validateSchedule(schedule);
    if (!schedule) return res.status(400).send('schedule Date/time not supplied');
    
    const from = await User.findById(req.user._id);
    
    const newMail = { from, to, cc, subject, body, schedule };
    const mail = new Mail(newMail);
    
    await mail.save();
    
    newSchedule(mail._id, mail.schedule, newMail);

    return res.send(mail);
});

/*
    @body { data, schedule }
    data: {to, cc, subject, body}
    schedule: { scheduled, second, time, monthDay, month, weekDay }
*/
router.put('/:id', [auth, validateObjectId, mailOwner, validate(validateMail)], async (req, res) => {

    let { data, schedule } = req.body;
    const { to, cc, subject, body } = data;

    schedule = validateSchedule(schedule);
    if (!schedule) return res.status(400).send('schedule Date/time not supplied');

    const mail = await Mail.findByIdAndUpdate(req.params.id, {
        to, cc, subject, body, schedule
    }, { new: true });

    if (!mail) return res.status(404).send('mail not found');

    updateSchedule(mail._id, mail.schedule, mail);

    return res.send(mail);

});

router.delete('/:id', [auth, validateObjectId, mailOwner], async (req, res) => {

    const mail = await Mail.findByIdAndRemove(req.params.id);

    if (!mail) return res.status(404).send('mail not found');

    deleteSchedule(mail._id);

    return res.send('deleted successfully');
});

module.exports = router;
