/*
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||  
||                                                          ||  
||  Author: Piyush Pattanayak                               ||
||  Test: Test router function                              ||    
||                                                          ||
||                                                          ||
||                                                          ||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

'use strict';

const rewire = require('rewire');
const router = rewire('../src/router');
const http = require('http');
const Assert = require('Assert');

const routes = [{
    "method": "GET",
    "name": "index",
    "route": "/",
    "enabled": true,
    "path": "/test/fixtures/app/"
}];

router.__set__("routes", routes);

describe('Testing the router code', () => {
    let app;
    let server;

    before((next) => {
        const express = require('express');
        app = express();
        router.init(app).then((status) => {
            if (status) {
                server = app.listen(3005, () => {
                    console.log('Server started');
                    next();
                });
            }
        });
    });

    after(() => {
        server.close();
    });

    it('should register the routes', (next) => {
        http.get({
            hostname: 'localhost',
            port: 3005,
            path: '/',
            agent: false
        }, (res) => {
            Assert.equal(res.statusCode, 200);
            next();
        });
    });
});

