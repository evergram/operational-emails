/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var common = require('evergram-common');
var printManager = common.print.manager;

/**
 *
 * @returns {*|promise}
 */
module.exports = function() {
    var deferred = q.defer();
    var currentDate = getToday().utc();

    var start = currentDate.clone();
    start.subtract(1, 'hour');

    var end = currentDate.clone();
    end.add(1, 'hour');

    printManager.
        findAll({
            criteria: {
                endDate: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                isPrinted: true
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
        date: getToday().format('DD-MM-YYYY'),
        imageSets: [],
        total: 0
    };

    _.forEach(imageSets, function(imageSet) {
        var numberOfImages = imageSet.getNumberOfImages();
        if (numberOfImages > 0) {
            data.imageSets.push({
                username: imageSet.user.instagram.username,
                numberOfImages: numberOfImages
            });
            data.total += numberOfImages;
        }
    });

    return data;
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