var sinon = require('sinon');
var should = require('should');
var q = require('q');
var moment = require('moment');
var common = require('evergram-common');
var printManager = common.print.manager;

//local dependencies
var weeklyPrint = require('../../app/cron-manager/weekly-print');

describe('Weekly Print Job', function() {
    it('should return the correct weekly print data', function(done) {
        var printManagerStub = sinon.stub(printManager, 'findAll');
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
                    endDate: getStartOfDay().add(3, 'days'),
                    user: {
                        firstName: 'Sergey',
                        lastName: 'Brin',
                        instagram: {
                            username: 'google'
                        }
                    },
                    getNumberOfImages: function() {
                        return 1;
                    }
                },
                {
                    endDate: getStartOfDay().add(3, 'days'),
                    user: {
                        firstName: 'Larry',
                        lastName: 'Page',
                        instagram: {
                            username: 'google'
                        }
                    },
                    getNumberOfImages: function() {
                        return 2;
                    }
                },
                {
                    endDate: getStartOfDay().add(6, 'days'),
                    user: {
                        firstName: 'Richard',
                        lastName: 'Dawkins',
                        instagram: {
                            username: 'richard_dawkins_foundation'
                        }
                    },
                    getNumberOfImages: function() {
                        return 2;
                    }
                },
                {
                    endDate: getStartOfDay().add(7, 'days'),
                    user: {
                        firstName: 'Lawrence',
                        lastName: 'Krauss',
                        instagram: {
                            username: 'lkrauss1'
                        }
                    },
                    getNumberOfImages: function() {
                        return 2;
                    }
                }
            ];
        }));

        weeklyPrint.run().
            then(function(data) {
                //ensure the basic data is present in the correct format
                data.date.from.should.be.equal(getStartOfDay().format('DD-MM-YYYY'));
                data.date.to.should.be.equal(getStartOfDay().add(6, 'days').format('DD-MM-YYYY'));
                data.total.should.be.equal(6);

                //an entry for every day of the week
                data.imageSets.should.have.lengthOf(7);

                //ensure the image sets are in order of date and have the correct allocation.
                data.imageSets[0].date.should.be.equal(getStartOfDay().format('dddd Do'));
                data.imageSets[6].date.should.be.equal(getStartOfDay().add(6, 'days').format('dddd Do'));
                data.imageSets[0].users[0].firstName.should.be.equal('Elon');
                data.imageSets[0].users[0].numberOfImages.should.be.equal(1);
                data.imageSets[1].users.should.have.lengthOf(0);
                data.imageSets[3].users.should.have.lengthOf(2);
                data.imageSets[6].users[0].firstName.should.be.equal('Richard');
                data.imageSets[6].users[0].numberOfImages.should.be.equal(2);

                done();
            });

    });

    function getStartOfDay() {
        return moment().
            tz('Australia/Melbourne').
            startOf('day');
    }
});
