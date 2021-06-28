const { Mail } = require('../models/mail');
/*
    Description: middleware for resources which only owner
    of mail can access
*/
module.exports = async function (req, res, next) {

    let id = req.params.id;

    const mail = await Mail.findById(id);

    if (!mail) return res.status(404).send('resourse not found');


    if (mail.from._id.toHexString() !== req.user._id)
        return res.status(403).send('Access denied');

    next();
}