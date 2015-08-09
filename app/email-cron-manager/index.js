'use strict';

/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var _ = require('lodash');
var q = require('q');
var CronJob = require('cron').CronJob;
var config = require('../config');
var common = require('evergram-common');
var logger = common.utils.logger;
var emailManager = common.email.manager;
var handlebars = require('handlebars');
var fs = require('fs');

/**
 * A consumer manager that handles all of the consumers
 *
 * @constructor
 */
function EmailCronManager() {
    this.started = false;
    this.emails = this.getAllEmails();
}

/**
 * Parses all email cronjobs from config and instantiates the {@link CronJob}.
 *
 * @returns {{CronJob}}
 */
EmailCronManager.prototype.getAllEmails = function() {
    var jobs = {};
    _.forEach(config.emails, function(emailConfig, emailName) {
        if (!!emailConfig.active) {
            try {
                emailConfig.schedule.onTick = getEmailCronFunction(emailName, emailConfig);
                jobs[emailName] = new CronJob(emailConfig.schedule);
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
EmailCronManager.prototype.start = function() {
    if (!this.started) {
        _.forEach(this.emails, function(email, emailName) {
            logger.info('Starting email ' + emailName + ' with ' + email.cronTime);
            email.start();
        });

        this.started = true;
    }
};

/**
 * Stops all email {@link CronJob}s.
 */
EmailCronManager.prototype.stop = function() {
    if (this.started) {
        _.forEach(this.emails, function(email, emailName) {
            logger.info('Stopping email ' + emailName);
            email.stop();
        });

        this.started = false;
    }
};

/**
 * Returns the {@link Function} to execute for the {@link CronJob}.
 *
 * @param emailName
 * @param emailConfig
 * @returns {Function}
 */
function getEmailCronFunction(emailName, emailConfig) {
    return function() {
        var emailData = require('./' + emailName);

        emailData().then(function(data) {
            return getMessageBody(data, emailName + '/' + emailConfig.template);
        }).then(function(messageBody) {
            return emailManager.send(emailConfig.to, emailConfig.from, emailConfig.subject, messageBody);
        }).then(function() {
            logger.info('Sent email ' + emailName);
        }).fail(function(err) {
            logger.error('Failed to send email', err);
        });
    };
}

/**
 * Creates the body from a handlebars template.
 *
 * @param data
 * @param templateSrc
 * @returns {*|promise}
 */
function getMessageBody(data, templateSrc) {
    var deferred = q.defer();

    fs.readFile(__dirname + '/' + templateSrc, 'utf-8', function(err, source) {
        if (err) {
            deferred.reject(err);
        } else {
            var template = handlebars.compile(source);
            var html = template(data);
            deferred.resolve(html);
        }
    });

    return deferred.promise;
}

/**
 * Expose
 * @type {ConsumerService}
 */
module.exports = new EmailCronManager();
