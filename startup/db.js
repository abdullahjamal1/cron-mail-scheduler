
const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('config');

module.exports = function () {

    const db = config.get('db');
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then(() => logger.info(`connected to ${db}..`));

}