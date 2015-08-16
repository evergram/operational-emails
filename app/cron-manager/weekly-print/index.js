/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var common = require('evergram-common');
var printManager = common.print.manager;

function WeeklyPrint() {
}

/**
 *
 * @returns {*|promise}
 */
WeeklyPrint.prototype.run = function() {
    var deferred = q.defer();

    var start = getToday().utc();
    var end = start.
        clone().
        add(1, 'week');

    printManager.
        findAll({
            criteria: {
                endDate: {
                    $gte: new Date(start),
                    $lt: new Date(end)
                }
            }
        }).
        then(function(imageSets) {
            deferred.resolve(compileTemplateData(imageSets));
        });

    return deferred.promise;
};

/**
 * Compiles the data for the template.
 *
 * @param imageSets
 * @returns {{imageSets: Array}}
 */
function compileTemplateData(imageSets) {
    var data = {
        date: {
            to: getToday().add(6, 'days').format('DD-MM-YYYY'),
            from: getToday().format('DD-MM-YYYY')
        },
        total: 0,
        imageSets: populateImageSetDates()
    };

    _.forEach(imageSets, function(imageSet) {
        addToDataImageSets(data, imageSet);
    });

    return data;
}

/**
 * Adds user data to the image set in the correct date if it has images.
 *
 * @param imageSets
 * @param user
 */
function addToDataImageSets(data, imageSet) {
    var numberOfImages = imageSet.getNumberOfImages();

    if (numberOfImages > 0) {
        var user = {
            date: getPeriodDisplayDate(imageSet.endDate),
            firstName: imageSet.user.firstName,
            lastName: imageSet.user.lastName,
            username: imageSet.user.instagram.username,
            numberOfImages: numberOfImages
        };

        //iterate through the template data image sets
        _.forEach(data.imageSets, function(dataImageSet) {
            //add the user data to the correct day of the image set.
            if (user.date === dataImageSet.date) {
                //add to the image sets
                dataImageSet.users.push(user);

                //increment number of images and add it to the user properties
                data.total += numberOfImages;

                return;
            }
        });
    }
}

/**
 * Creates the dates/days for the next period.
 */
function populateImageSetDates() {
    var imageSets = [];

    var startDate = getToday();

    for (var i = 0; i < 7; i++) {
        imageSets.push({
            date: getPeriodDisplayDate(startDate.add(i === 0 ? 0 : 1, 'days')),
            users: []
        });
    }

    return imageSets;
}

/**
 * Gets the display date for the period.
 *
 * @param date
 * @returns {*}
 */
function getPeriodDisplayDate(date) {
    return moment(date).tz('Australia/Melbourne').format('dddd Do');
}

/**
 *
 * @returns {Date}
 */
function getToday() {
    return moment().
        tz('Australia/Melbourne').
        startOf('day');
}

module.exports = new WeeklyPrint();
