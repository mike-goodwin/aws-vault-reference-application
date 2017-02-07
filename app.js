var express = require('express');
var path = require('path');
var bunyan = require('bunyan');

try {
    var app = express();

    app.set('views', './views');
    app.set('view engine', 'pug');

    //static content
    app.use('/public', express.static(path.join(__dirname, 'public')));

    //security headers
    require('./config/securityheaders')(app);

    //logging
    require('./config/loggers').config(app);

    //parsers
    require('./config/parsers')(app);

    //routes
    require('./config/routes')(app);

    bunyan.createLogger({ name: 'aws-vault-reference-application', level: 'info' }).info('application started up');  
}
catch (e) {
    var errorLogger = bunyan.createLogger({ name: 'aws-vault-reference-application' });
    errorLogger.error('application failed to start up');
    errorLogger.error(e.message);
}

module.exports = app;