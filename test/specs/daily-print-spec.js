var sinon = require('sinon');
var should = require('should');
var q = require('q');
var moment = require('moment');
var common = require('evergram-common');
var printManager = common.print.manager;

//local dependencies
var dailyPrint = require('../../app/cron-manager/daily-print');
var sandbox;

describe('Daily Print Job', function() {
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should return the correct daily print data', function(done) {
        var printManagerStub = sandbox.stub(printManager, 'findAll');
        printManagerStub.returns(q.fcall(function() {
            return [
                {
                    endDate: getStartOfDay(),
                    user: {
                        firstName: 'Elon',
                        lastName: 'Musk',
                        instagram: {
                            username: 'teslamotors'
                        }
                    },
                    getNumberOfImages: function() {
                        return 1;
                    }
                },
                {
                    endDate: getStartOfDay(),
                    user: {
                        firstName: 'Sergey',
                        lastName: 'Brin',
                        instagram: {
                            username: 'google'
                        }
                    },
                    getNumberOfImages: function() {
                        return 2;
                    }
                },
                {
                    endDate: getStartOfDay(),
                    user: {
                        firstName: 'Larry',
                        lastName: 'Page',
                        instagram: {
                            username: 'google'
                        }
                    },
                    getNumberOfImages: function() {
                        return 0;
                    }
                }
            ];
        }));

        dailyPrint.run().
            then(function(data) {

                //ensure the basic data is present in the correct format
                data.date.should.be.equal(getStartOfDay().format('DD-MM-YYYY'));
                data.total.should.be.equal(3);

                data.imageSets.should.have.lengthOf(2);

                data.imageSets[0].firstName.should.be.equal('Elon');
                data.imageSets[0].lastName.should.be.equal('Musk');
                data.imageSets[0].username.should.be.equal('teslamotors');
                data.imageSets[0].numberOfImages.should.be.equal(1);
                data.imageSets[1].firstName.should.be.equal('Sergey');
                data.imageSets[1].lastName.should.be.equal('Brin');
                data.imageSets[1].username.should.be.equal('google');
                data.imageSets[1].numberOfImages.should.be.equal(2);
                done();

            });
    });

    it('should reject the daily job if no user image sets end today', function(done) {
        var printManagerStub = sandbox.stub(printManager, 'findAll');
        printManagerStub.returns(q.fcall(function() {
            return [];
        }));

        dailyPrint.run().
            fail(function(err) {
                err.should.be.equal('No image sets today');
                done();
            });
    });

    it('should reject the daily job if there are user image sets but no images to print', function(done) {
        var printManagerStub = sandbox.stub(printManager, 'findAll');
        printManagerStub.returns(q.fcall(function() {
            return [
                {
                    endDate: getStartOfDay(),
                    user: {
                        firstName: 'Larry',
                        lastName: 'Page',
                        instagram: {
                            username: 'google'
                        }
                    },
                    getNumberOfImages: function() {
                        return 0;
                    }
                }
            ];
        }));

        dailyPrint.run().
            fail(function(err) {
                err.should.be.equal('No image sets today');
                done();
            });
    });

    function getStartOfDay() {
        return moment().
            tz('Australia/Melbourne').
            startOf('day');
    }
});
