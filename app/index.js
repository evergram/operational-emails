'use strict';

/**
 * Module dependencies.
 */

var common = require('evergram-common');
var logger = common.utils.logger;
var emailCronManager = require('./email-cron-manager');

//watch for kill/shutdown
process.on('SIGINT', function() {
    emailCronManager.stop();
    logger.warning('Shutting down');
    process.exit(0);
});

//init db
common.db.connect();

//start the email scheduler
emailCronManager.start();
