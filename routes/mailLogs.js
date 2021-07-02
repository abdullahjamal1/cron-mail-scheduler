const { MailLog } = require('../models/mailLog');
const { User } = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const mailOwner = require('../middleware/mailOwner');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {

    const from = await User.findById(req.user._id);
    const mailLogs = await MailLog.find({ from });

    return res.send(mailLogs);
});

router.get('/:id', [auth, validateObjectId], async (req, res) => {

    const mailLog = await MailLog.findById(req.params.id);

    if (!mailLog) return res.status(404).send('mail history not found');

    if (mailLog.from._id.toHexString() !== req.user._id)
        return res.status(403).send('Access denied');

    return res.send(mailLog);
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {

    const log = await MailLog.findById(req.params.id);
    console.log(log);
    const mailLog = await MailLog.findByIdAndRemove(req.params.id);

    if (!mailLog) return res.status(404).send('mail history not found');

    if (mailLog.from._id.toHexString() !== req.user._id)
        return res.status(403).send('Access denied');

    return res.send('deleted successfully');
});

module.exports = router;
