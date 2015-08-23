'use strict';

/**
 * Expose
 */

module.exports = {
    jobs: {
        'daily-print': {
            to: [
                'josh@printwithpixy.com'
            ],
            from: 'hello@printwithpixy.com',
            subject: 'Today\'s Pixy Print Summary',
            template: 'daily-print.hbs',
            schedule: {
                cronTime: '*/5 * * * * *',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: false
        },
        'weekly-print': {
            to: [
                'josh@printwithpixy.com'
            ],
            from: 'hello@printwithpixy.com',
            subject: 'This Weeks Pixy Print Summary',
            template: 'weekly-print.hbs',
            schedule: {
                cronTime: '*/5 * * * * *',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: false
        }
    }
};
