'use  strict';

var world = require('../repositories/world');
var homeController = {};

homeController.index = function (req, res) {
    res.render('index');
};

homeController.search = function (req, res) {

    var country = req.body.country;

    world.getCapital(country, function (result, error) {

        if (error) {
            req.log.error(error);
        } else {
            if (result) {
                res.render('search', { country: result.country, capital: result.capital });
            } else {
                res.render('notfound', { country: country });
            }
        }
    });
};

module.exports = homeController;