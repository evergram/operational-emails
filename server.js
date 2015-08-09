/**
 * Module dependencies
 */

process.env.TZ = 'UTC';

require('newrelic');

var common = require('evergram-common');
var logger = common.utils.logger;
var http = require('http');
var port = process.env.PORT || 8088;

//Create a server so we can do health checks
var server = http.createServer(function(request, response) {
    response.end('Alive');
});

//Start the server and the app process
server.listen(port, function() {
    logger.info('Server up');
    require('./app');
});
