var sinon = require('sinon');
var should = require('should');
var q = require('q');
var moment = require('moment');
var common = require('evergram-common');
var cron = require('cron');
var emailManager = common.email.manager;

//local dependencies
var config = require('../../app/config');
var CronJob = require('../../app/cron-manager/cron-job');
var dailyPrint = require('../../app/cron-manager/daily-print');

describe('Cron Job', function() {
    var emailManagerSpy = sinon.spy(emailManager, 'send');

    it('should thrown an error when missing job name', function(done) {
        (function() {
            new CronJob();
        }).should.throw('Missing a valid job name');
        done();
    });

    it('should thrown an error when missing job config', function(done) {
        (function() {
            new CronJob('job-name');
        }).should.throw('Missing a valid job config');
        done();
    });

    it('should create a valid cron job successfully', function(done) {
        var jobName = 'daily-print';
        var cronjob = new CronJob(jobName, config.jobs[jobName]);

        cronjob.should.be.instanceof(Object);
        cronjob.should.have.property('_callbacks');
        cronjob._callbacks.should.be.instanceof(Array).and.have.lengthOf(1);

        done();
    });

    it('should execute a cron job and send an email', function(done) {
        var dailyPrintStub = sinon.stub(dailyPrint, 'run');
        dailyPrintStub.returns(q.fcall(function() {
            return {
                date: moment().format('DD-MM-YYYY'),
                imageSets: [],
                total: 0
            };
        }));

        var jobName = 'daily-print';
        var cronjob = new CronJob(jobName, config.jobs[jobName]);
        var cronjobFunc = cronjob._callbacks[0];
        cronjobFunc().then(function() {
            //assert email was sent
            should(emailManager.send.calledOnce).be.true;
            should(emailManagerSpy.args[0][0]).be.equal(config.jobs[jobName].to);
            should(emailManagerSpy.args[0][1]).be.equal(config.jobs[jobName].from);
            should(emailManagerSpy.args[0][2]).be.equal(config.jobs[jobName].subject);

            done();
        }).fail(function(err) {
            console.log(err);
        });
    });

    xit('should fail to send email', function(done) {

    });

    xit('should fail to execute cron job due to missing template', function(done) {

    });
});
