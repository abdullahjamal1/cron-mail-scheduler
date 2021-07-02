require('jest');
const mongoose = require('mongoose');
const { schedule } = require('node-cron');
const { Mail } = require('../../../models/mail');
const { User } = require('../../../models/user');
const { newSchedule, updateSchedule, deleteSchedule, intializeScheduler } = require('../../../utils/scheduler');

describe('cron mail scheduler', () => {

    let recurring_mail;
    let user;
    let mail;

    beforeEach(async () => {
        // intializeScheduler();
        user = new User({ name: 'user9', email: 'user9@gmail.com' });
        // await User.collection.insertOne(user);
        recurring_mail = {
            from: user,
            to: ['user1@gmail.com'],
            cc: ['user2@gmail.com'],
            subject: 'new schedule test',
            body: 'body of test mail',
            schedule: {
                scheduled: 'recurring',
            }
        }
        mail = new Mail(recurring_mail);
        // await Mail.collection.insertOne(mail);
    });


    // describe('new schedule', async () => {

    //     afterEach(() => {
    //         setTimeout(() => {
    //             deleteSchedule(mail._id);
    //         }, 1100);
    //     });

    //     it('should be able to create new recurring schedule', () => {

    //         newSchedule(mail._id, mail.schedule, mail);
    //         const consoleSpy = jest.spyOn(console, 'log');

    //         setTimeout(() => {
    //             expect(consoleSpy).toHaveBeenCalledWith('send every sec');
    //         }, 1000);

    //     });
    // });
    describe('update schedule', () => {

        afterEach(() => {
            setTimeout(() => {
                console.log('deleted for update invoked');
                deleteSchedule(mail._id);
            }, 120000);
        });

        it('should be able to update an existing recurring schedule', () => {

            newSchedule(mail._id, mail.schedule, mail);
            const consoleSpy = jest.spyOn(console, 'log');

            setTimeout(() => {
                console.log('update invoked')
                expect(consoleSpy).toHaveBeenCalledWith('send every sec');
                mail.schedule.minute = '1';
                mail.schedule.scheduled = 'everyMinute';
                console.log(mail.schedule);
                updateSchedule(mail._id, mail.schedule, mail);
            }, 1000);

            setTimeout(() => {
                expect(consoleSpy).toHaveBeenCalledWith('send every minute');
            }, 100000);

        });
    });

});