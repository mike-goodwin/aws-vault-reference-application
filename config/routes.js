'use strict';

var express = require('express');
var csrf = require('csurf');
var home = require('../controllers/homecontroller');
var router = express.Router();

module.exports = function(app) {
    
    //anti csrf
    var csrfProtection = csrf();
    
    //main application entry point
    router.get('/', home.index);

    //search for a capital
    router.post('/search', home.search);
    
    app.use('/', router);
};