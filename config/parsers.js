'use strict';

var bodyParser = require('body-parser');

var parsers = function (app) {
   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
};

module.exports = parsers;