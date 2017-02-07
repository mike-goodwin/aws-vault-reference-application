'use  strict';

var homeController = {};

homeController.index = function (req, res) {
    res.render('index');
};

homeController.search = function (req, res) {
    res.render('search', {country: req.country});
};

module.exports = homeController;