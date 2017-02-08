'use  strict';

var world = require('../repositories/world');
var homeController = {};

homeController.index = function (req, res) {
    res.render('index');
};

homeController.search = function (req, res) {
    world.getCapital(req.body.country, function (result, error) {

        if (error) {
            req.log.error(error);
        } else {
            res.render('search', { country: result.country, capital: result.capital });
        }
    });
};

module.exports = homeController;