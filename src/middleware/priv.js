'use strict';
module.exports = function(req, res, next) {
    console.log('Inside auth middleware');
    next();
};
