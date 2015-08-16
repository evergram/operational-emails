'use strict';

/**
 * Expose
 */

module.exports = {
    jobs: {
        'daily-print': {
            to: [
                'hello@printwithpixy.com',
                process.env.EMAIL_DAILY_PRINT_TO
            ],
            from: 'hello@printwithpixy.com',
            subject: process.env.EMAIL_DAILY_PRINT_SUBJECT || 'Today\'s Pixy Print Summary',
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
                'hello@printwithpixy.com',
                process.env.EMAIL_WEEKLY_PRINT_TO
            ],
            from: 'hello@printwithpixy.com',
            subject: process.env.EMAIL_WEEKLY_PRINT_SUBJECT || 'This Weeks Pixy Print Summary',
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
