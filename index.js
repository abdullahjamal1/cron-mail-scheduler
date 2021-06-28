require('express-async-errors');
const logger = require('./startup/logger');
const express = require('express');
const app = express();

require('./utils/oauth-google')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// production dependency
// require('./startup/prod')(app);

// const port = process.env.PORT || 3000;
const port = 4000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;