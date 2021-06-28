const nodemailer = require('nodemailer');
const config = require('config');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    ssl: true,
    auth: {
        user: config.get('email'),
        pass: config.get('password'),
    },
});

async function send(mailOptions) {

    if (config.get('isEmailMock')) {
        console.log(mailOptions);
        return null;
    }

    const { to, subject, text, html } = mailOptions;

    // for testing purpose just login the email in console
    return await transporter.sendMail({
        from: config.get('email'), // sender address
        to, // comma separated list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(info.response);
        }
    });
};
// send mail with defined transport object

module.exports = {
    send
};