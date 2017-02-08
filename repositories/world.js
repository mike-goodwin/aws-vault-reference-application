'use  strict';

var worldRepository = {};

worldRepository.getCapital = function (country, cb) {
    cb({country: country, capital: 'Paris'});
};

module.exports = worldRepository;