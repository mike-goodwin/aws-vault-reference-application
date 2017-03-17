'use strict';

var validator = require('express-validator');

var validators = function (app) {
   
    app.use(validator());
    
};

module.exports = validators;