'use  strict';

var worldRepository = {};
var database = require('../helpers/database');


worldRepository.getCapital = function (country, cb) {

    database.getConnection(function (error, connection) {
        if (error) {
            cb(null, 'error connecting to database: ' + error.stack);
        }

        connection.query('select country.name as country, city.name as capital from city join country on city.ID = country.Capital where country.name = ? limit 1', [country], function (error, results, fields) {
            if (error) {
                cb(null, error);
            }

            cb({ country: results[0].country, capital: results[0].capital });
        });
    });
};

module.exports = worldRepository;