'use strict';

/**
 * Expose
 */

module.exports = {
    emails: {
        'daily-print': {
            to: [
                'josh@printwithpixy.com'
            ],
            from: 'hello@printwithpixy.com',
            subject: 'Today\'s Pixy Print Summary',
            template: 'daily-print.hbs',
            schedule: {
                cronTime: '00 00 07 * * *',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: true
        },
        'weekly-print': {
            to: [
                'josh@printwithpixy.com'
            ],
            from: 'hello@printwithpixy.com',
            subject: 'This Weeks Pixy Print Summary',
            template: 'weekly-print.hbs',
            schedule: {
                cronTime: '00 00 07 * * 1',
                start: false,
                timeZone: 'Australia/Melbourne'
            },
            active: true
        }
    }
};
