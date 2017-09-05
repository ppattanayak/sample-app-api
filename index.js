'use strict';

const express = require('express');
const middleware = require('./src/middleware/index');
const modconfig = require('./src/modconfig/');
const router = require('./src/router/');

const config = modconfig.getConfig();

// Creating express server
const app = express();

// Initializing middlewares
middleware.init(app, {});

router.init(app).then((status) => {
    if (status) {
        app.listen(config && config.app && config.app.port, () => {
            console.log('Samaritan API started at port 3000');
        });
    }
});
