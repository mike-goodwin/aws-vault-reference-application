'use  strict';

validator = require('express-validator');

function countryValidator(req, res, next) {

    req.checkBody('country', 'Invalid Country').isAlpha().isByteLength({ min: 2, max: 32 });

    req.getValidationResult().then(function (result) {

        if (!result.isEmpty()) {
            res.send('Invalid country', 400);
        }
        else {
            next();
        }

    });
}

module.exports = countryValidator;