const mail = require('../startup/mail');
const config = require('config');

async function sendCustomMail({ to, cc, subject, body }) {

    const mailOptions = {
        to,
        cc,
        subject,
        text: 'mail',
        html: body
    }
    await mail.send(mailOptions);
}

async function sendAuthMail(user) {

    const url = `${config.get('app-url')}/api/users/activate?token=${user.generateMailVerificationToken()}`;

    const mailOptions = {
        to: user.email,
        subject: "Verify your Email Address",
        text: `Visit this ${url}`,
        html: '<a href="' + url + '"><H2>Click here verify Email</H2></a>'
    }
    await mail.send(mailOptions);
}

async function sendResetPaswordMail(user) {

    const url = `${config.get('frontend-url')}reset-password-change?token=${user.generateMailVerificationToken()}`;

    const mailOptions = {
        to: user.email,
        subject: "Reset Password",
        text: "Visit this",
        html: '<a href="' + url + '"><H2>Click here to Reset Password</H2></a>'
    }
    await mail.send(mailOptions);
}

module.exports = {
    sendAuthMail,
    sendResetPaswordMail,
    sendCustomMail
}