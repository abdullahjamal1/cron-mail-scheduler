const logger = require("../startup/logger");

module.exports = function (err, req, res, next) {

    console.log(err.message);
    logger.log('info', err.message, err);

    // standard logging levels
    //error
    //warn
    //info
    //verbose
    //debug
    //silly

    //  log the exception
    res.status(500).send('Something Failed');
}