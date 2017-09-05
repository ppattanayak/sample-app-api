/*
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||  
||                                                          ||  
||  Author: Piyush Pattanayak                               ||
||  Test: Test middleware priority function                 ||    
||  eBay Inc                                                ||
||                                                          ||
||                                                          ||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

'use strict';

const rewire = require('rewire');
const Assert = require('Assert');
const middlewareIndex = rewire('../src/middleware/index');
const modconfig = require('../src/modconfig/');
const middleware = modconfig.getMiddlewareConfig();

const middlewareConfig = [
    {
        "name": "test1",
        "enabled": true,
        "priority": 99,
        "path": "three"
    },
    {
        "name": "test2",
        "enabled": true,
        "priority": 100,
        "path": "four"
    },
    {
        "name": "test3",
        "enabled": true,
        "priority": 50,
        "path": "two"
    },
    {
        "name": "test4",
        "enabled": false,
        "priority": 25,
        "path": "one"
    }
];

describe("Testing middleware functionalities", () => {
    const sortByProperty = middlewareIndex.__get__('sortByProperty');
    const getActiveMiddlewares = middlewareIndex.__get__('getActiveMiddlewares');

    it('should sort the middleware based on priority', (next) => {
        sortByProperty(middlewareConfig, 'priority').then((sorted) => {
            Assert.equal(typeof sorted, 'object');
            Assert.equal(sorted[0].name, 'test4');
            Assert.equal(sorted[1].name, 'test3');
            Assert.equal(sorted[2].name, 'test1');
            Assert.equal(sorted[3].name, 'test2');
            next();
        });
    });

    it('all middlwares should be valid', () => {
        for (let i = 0; i < middleware.length; i++) {
            const eachMiddleware = require(`../${middleware[i].path}`);
            Assert.equal(typeof eachMiddleware, 'function');
        }
    });

    it('should return middleware when number of middleware is one', (next) => {
        sortByProperty([{ "name": "test1", "priority": "1", "path": "one" }], 'priority').then((only) => {
            Assert.equal(only[0].path, "one");
            next();
        });
    });

    it('should remove all disabled middlewares', (next) => {
        getActiveMiddlewares(middlewareConfig).then((activeMiddleware) => {
            Assert.ok(activeMiddleware[0].enabled);
            Assert.ok(activeMiddleware[1].enabled);
            Assert.ok(activeMiddleware[2].enabled);
            next();
        });
    });
});
