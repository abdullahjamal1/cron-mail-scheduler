const cron = require('node-cron');
const { sendCustomMail } = require('../services/mail');
const { Mail, schedulerSchema } = require('../models/mail');
const { saveMailLog } = require('../models/mailLog');

// TODO: implement cron validate

/*
second	0-59
minute	0-59
hour	0-23
day of month	1-31
month	1-12 (or names)
day of week	0-7 (or names, 0 or 7 are sunday)
*/
function setSchedule({ scheduled, second, minute, hour, monthDay, month, weekDay }, mailOptions) {

    console.log(`${second} ${minute} ${hour} ${monthDay} ${month} ${weekDay}`);

    if (!cron.validate(`${second} ${minute} ${hour} ${monthDay} ${month} ${weekDay}`)) {
        console.log("wrong schedule supplied");
    }
    // TODO: decide order
    const trigger =
        cron.schedule(`${second} ${minute} ${hour} ${monthDay} ${month} ${weekDay}`, () => {

            sendCustomMail(mailOptions);
            saveMailLog(mailOptions);

        }, {
            scheduled: false
        });
    return trigger;
}


function newSchedule(_id, schedule, mailOptions) {

    let trigger = setSchedule(schedule, mailOptions);
    trigger._id = _id;
    trigger.start();
    // console.log("cron", cron.getTasks());
}

function deleteSchedule(_id) {

    let tasks = cron.getTasks();
    // console.log(tasks);
    // console.log(_id);
    const trigger = tasks.filter(t => t._id.toHexString() === _id.toHexString())[0];
    // console.log(trigger);
    trigger.stop();
    const index = tasks.indexOf(trigger);
    cron.getTasks().splice(index, 1);

}
function updateSchedule(_id, schedule, mailOptions) {

    deleteSchedule(_id);
    newSchedule(_id, schedule, mailOptions);
}

// on startUp
async function intializeScheduler() {

    const mails = await Mail.findAll();
    mails.forEach(mail => {
        newSchedule(mail._id, mail.schedule, mail);
    });
}
function validateSchedule(schedule) {

    let { scheduled, second, time, monthDay, month, weekDay } = schedule;
    time = time.split(':');
    let hour = time[0];
    let minute = time[1];

    if (scheduled === "recurring") {

        second = '*/20';
        month = '*';
        hour = '*';
        monthDay = '*';
        month = '*';
        weekDay = '*';
    }
    else if (scheduled === "weekly") {

        if (!weekDay || !minute || !hour)
            return null;

        month = '*';
        monthDay = '*';
        second = '';

    }
    else if (scheduled === "monthly") {

        if (!monthDay, !minute, !hour)
            return null;

        month = '*';
        weekDay = '*';
        second = '';

    }
    else if (scheduled === "yearly") {

        if (!month || !monthDay || !minute || !hour)
            return null;

        weekDay = '*';
        second = '';

    }
    schedule = { scheduled, month, monthDay, minute, hour, second, weekDay };
    console.log(schedule);

    return schedule;
}

// TODO: implement ,
/*
    kills all running processes
    first stops them
    then deletes them
*/
function killScheduler() {

}

module.exports = {
    newSchedule, updateSchedule, deleteSchedule, intializeScheduler, validateSchedule
}