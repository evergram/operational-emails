var should = require('should');
var common = require('evergram-common');
var cron = require('cron');

//local dependencies
var config = require('../../app/config');
var CronManager = require('../../app/cron-manager');

describe('Cron Manager', function() {
    it('should add all cron jobs to the manager', function(done) {
        var cronManager = new CronManager();
        cronManager.jobs.should.be.instanceof(Object);
        cronManager.jobs.should.have.property('daily-print');
        cronManager.jobs.should.have.property('weekly-print');
        cronManager.started.should.be.false;

        done();
    });

    it('should only add active jobs', function(done) {
        config.jobs['daily-print'].active = false;

        var cronManager = new CronManager();
        cronManager.jobs.should.be.instanceof(Object);
        cronManager.jobs.should.not.have.property('daily-print');
        cronManager.jobs.should.have.property('weekly-print');
        cronManager.started.should.be.false;

        done();
    });

    it('should start all cron jobs', function(done) {
        var cronManager = new CronManager();
        cronManager.started.should.be.false;
        cronManager.start();
        cronManager.started.should.be.true;

        done();
    });

    it('should stop all cron jobs', function(done) {
        var cronManager = new CronManager();
        cronManager.started.should.be.false;
        cronManager.start();
        cronManager.started.should.be.true;
        cronManager.stop();
        cronManager.started.should.be.false;

        done();
    });
});
