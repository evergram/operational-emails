'use strict';

/**
 * Expose
 */

module.exports = {
    jobs: {
        'daily-print': {
            to: [
                'josh-test@printwithpixy.com'
            ],
            from: 'hello-test@printwithpixy.com',
            subject: 'Today\'s Pixy Print Summary',
            template: 'daily-print.hbs',
            schedule: {
                cronTime: '* * * * * *',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: true
        },
        'weekly-print': {
            to: [
                'josh-test@printwithpixy.com'
            ],
            from: 'hello-test@printwithpixy.com',
            subject: 'This Weeks Pixy Print Summary',
            template: 'weekly-print.hbs',
            schedule: {
                cronTime: '* * * * * *',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: true
        }
    }
};
