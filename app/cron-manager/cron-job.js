'use strict';

/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var q = require('q');
var cron = require('cron');
var common = require('evergram-common');
var logger = common.utils.logger;
var emailManager = common.email.manager;
var handlebars = require('handlebars');
var fs = require('fs');

function CronJob(name, config) {
    if (typeof name !== 'string') {
        throw new Error('Missing a valid job name');
    }

    if (typeof config !== 'object') {
        throw new Error('Missing a valid job config');
    }

    config.schedule.onTick = createCronJobFunction(name, config);
    return new cron.CronJob(config.schedule);
}

/**
 * Creates the {@link Function} to execute for the {@link CronJob}.
 *
 * @param name
 * @param config
 * @returns {Function}
 */
function createCronJobFunction(name, config) {
    return function() {
        var job = require(__dirname + '/' + name);

        return job.run().
            then(function(data) {
                return getMessageBody(data, name + '/' + config.template);
            }).
            then(function(messageBody) {
                return emailManager.send(config.to, config.from, config.subject, messageBody);
            }).
            then(function() {
                logger.info('Sent email ' + name);
            }).
            fail(function(err) {
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
    if (typeof data !== 'object') {
        data = {};
    }

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
 * @type {CronJob}
 */
module.exports = CronJob;
