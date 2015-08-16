'use strict';

/**
 * Module dependencies.
 */

var common = require('evergram-common');
var logger = common.utils.logger;
var cronManager = new (require('./cron-manager'))();

//watch for kill/shutdown
process.on('SIGINT', function() {
    cronManager.stop();
    logger.warning('Shutting down');
    process.exit(0);
});

//init db
common.db.connect();

//start the cron manager
cronManager.start();
