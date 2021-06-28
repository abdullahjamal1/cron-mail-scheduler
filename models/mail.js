const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    }
});

/*
second	0-59
minute	0-59
hour	0-23
day of month	1-31
month	1-12 (or names)
day of week	0-7 (or names, 0 or 7 are sunday)
*/
const schedulerSchema = new mongoose.Schema({
    scheduled: {
        type: String,
        enum: ['recurring', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    second: {
        type: String,
        required: false,
    },
    minute: {
        type: String,
        required: false,
    },
    hour: {
        type: String,
        required: false,
    },
    monthDay: {
        type: String,
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    weekDay: {
        type: String,
        required: false,
    }
});

const mailSchema = new mongoose.Schema({

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
    }
});

const Mail = mongoose.model('Mails', mailSchema);

function validateMail(mail) {

    console.log(mail);
    const { data, schedule } = mail;
    const { to, cc, subject, body } = data;

    let { scheduled, second, time, monthDay, month, weekDay } = schedule;
    time = time.split(':');
    const hour = time[0];
    const minute = time[1];

    const flatMail = {
        to, cc, subject, body, scheduled,
        // second, minute, hour, monthDay, month, weekDay
    };

    const schema = {

        to: Joi.array().items(Joi.string().min(5).max(255).required().email()).required(),
        cc: Joi.array().items(Joi.string().min(5).max(255).email()),
        subject: Joi.string().required(),
        body: Joi.string().required(),
        scheduled: Joi.string().required(),
        // second: Joi.number().min(0).max(59),
        // minute: Joi.number().min(0).max(59),
        // hour: Joi.number().min(0).max(23),
        // monthDay: Joi.number().min(1).max(31),
        // month: Joi.number().min(1).max(12),
        // weekDay: Joi.number().min(0).max(7),
    };

    return Joi.validate(flatMail, schema);
}

module.exports = {
    Mail, validateMail, userSchema, schedulerSchema, mailSchema
};