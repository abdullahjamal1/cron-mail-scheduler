const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema, schedulerSchema } = require('./mail.js');

const mailLogSchema = new mongoose.Schema({

    from: {
        type: userSchema,
        required: true
    },
    to: {
        type: [String],
        required: true
    },
    cc: {
        type: [String],
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    schedule: {
        type: schedulerSchema,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

async function saveMailLog(mail) {

    console.log("maillog", mail);
    const mailLog = new MailLog(mail);
    await mailLog.save(mail);
}

const MailLog = mongoose.model('MailLogs', mailLogSchema);

module.exports = {
    MailLog, saveMailLog
};