'use strict';

var helmet = require('helmet');

var securityHeaders = function (app, forceSecure) {
    
    app.set('x-powered-by', false);
    var ninetyDaysInMilliseconds = 7776000000;
    app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds, force: forceSecure }));
    app.use(helmet.frameguard('deny'));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            styleSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com'],
            imgSrc: ["'self'"],
            fontSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com'],
            formAction: ["'self'"],
        }
    }));
};

module.exports = securityHeaders;