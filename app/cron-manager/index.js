'use strict';

/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var _ = require('lodash');
var config = require('../config');
var common = require('evergram-common');
var logger = common.utils.logger;
var CronJob = require('./cron-job');

/**
 * A consumer manager that handles all of the consumers
 *
 * @constructor
 */
function CronManager() {
    this.started = false;
    this.jobs = this.getJobs();
}

/**
 * Parses all jobs from config and instantiates the {@link CronJob}.
 *
 * @returns {{CronJob}}
 */
CronManager.prototype.getJobs = function() {
    var jobs = {};

    _.forEach(config.jobs, function(emailConfig, emailName) {
        if (!!emailConfig.active) {
            try {
                jobs[emailName] = new CronJob(emailName, emailConfig);
            } catch (err) {
                logger.error('Failed to add email job ' + emailName, err);
            }
        }
    });

    return jobs;
};

/**
 * Starts all email {@link CronJob}s.
 */
CronManager.prototype.start = function() {
    if (!this.started) {
        _.forEach(this.jobs, function(email, emailName) {
            logger.info('Starting email ' + emailName + ' with ' + email.cronTime);
            email.start();
        });

        this.started = true;
    }
};

/**
 * Stops all email {@link CronJob}s.
 */
CronManager.prototype.stop = function() {
    if (this.started) {
        _.forEach(this.jobs, function(email, emailName) {
            logger.info('Stopping email ' + emailName);
            email.stop();
        });

        this.started = false;
    }
};

/**
 * Expose
 * @type {CronManager}
 */
module.exports = CronManager;
