/*
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||  
||                                                          ||  
||  Author: Piyush Pattanayak                               ||
||  Test: Test modconfig function                           ||    
||  eBay Inc                                                ||
||                                                          ||
||                                                          ||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

'use strict';

const rewire = require('rewire');
const Assert = require('Assert');
const modconfig = rewire('../src/modconfig/');
const cache = require('../src/cache/');

const config = {
    "type": "JSON",
    "details": {
        "company": "eBay",
        "organization": "Information Security",
        "subgroup": {
            "name": "Application Security",
            "member": 10
        }
    }
};

const errorConfig = {
    "error": {
        "code": 11000,
        "message": "This is demo error"
    }
};

const middlewareConfig = [
    {
        "name": "samaritan-test",
        "priority": 100,
        "enabled": true,
        "path": "./src/middleware/auth"
    }
];

cache.set('config', config);
cache.set('errorConfig', errorConfig);
cache.set('middlewareConfig', middlewareConfig);

describe('should get the right config', () => {
    it('should return the default config', () => {
        Assert.equal(modconfig.getConfig().type, "JSON");
    });

    it('should update the config type = Javascript and keep rest the same', () => {
        modconfig.updateConfig('type', 'Javascript', true);
        Assert.equal(modconfig.getConfig().details.company, "eBay");
        Assert.equal(modconfig.getConfig().details.organization, "Information Security");
        Assert.equal(modconfig.getConfig().details.subgroup.name, "Application Security");
        Assert.equal(modconfig.getConfig().details.subgroup.member, 10);
    });

    it('should update the config details.organization = Global Information Security and keep rest the same', () => {
        modconfig.updateConfig('details:organization', 'Global Information Security', true);
        Assert.equal(modconfig.getConfig().details.company, "eBay");
        Assert.equal(modconfig.getConfig().details.organization, "Global Information Security");
        Assert.equal(modconfig.getConfig().details.subgroup.name, "Application Security");
        Assert.equal(modconfig.getConfig().details.subgroup.member, 10);
    });

    it('should not update the config details.organization = Information Security and keep rest the same', () => {
        modconfig.updateConfig('details:organization', 'Information Security', false);
        Assert.equal(modconfig.getConfig().details.company, "eBay");
        Assert.equal(modconfig.getConfig().details.organization, "Global Information Security");
        Assert.equal(modconfig.getConfig().details.subgroup.name, "Application Security");
        Assert.equal(modconfig.getConfig().details.subgroup.member, 10);
    });

    it('should add new config key details.subgroup.size = 8 and keep rest the same', () => {
        modconfig.updateConfig('details:subgroup:size', '8');
        Assert.equal(modconfig.getConfig().details.company, "eBay");
        Assert.equal(modconfig.getConfig().details.organization, "Global Information Security");
        Assert.equal(modconfig.getConfig().details.subgroup.name, "Application Security");
        Assert.equal(modconfig.getConfig().details.subgroup.member, 10);
        Assert.equal(modconfig.getConfig().details.subgroup.size, 8);
    });

    it('should not update details to Hello World', () => {
        modconfig.updateConfig('details', 'Hello World', false);
        Assert.equal(modconfig.getConfig().details.company, "eBay");
        Assert.equal(modconfig.getConfig().details.organization, "Global Information Security");
        Assert.equal(modconfig.getConfig().details.subgroup.name, "Application Security");
        Assert.equal(modconfig.getConfig().details.subgroup.member, 10);
        Assert.equal(modconfig.getConfig().details.subgroup.size, 8);
    });

    it('should update details to Hello World', () => {
        modconfig.updateConfig('details', 'Hello World', true);
        Assert.equal(modconfig.getConfig().details, "Hello World");
    });

    it('should not update details to Hello World 2 due to invalid key', () => {
        modconfig.updateConfig('details:', 'Hello World 2', true);
        Assert.equal(modconfig.getConfig().details, "Hello World");
    });

    it('should return the error config', () => {
        Assert.equal(modconfig.getErrorConfig().error.code, 11000);
    });

    it('should return the middleware config', () => {
        Assert.equal(modconfig.getMiddlewareConfig()[0].name, 'samaritan-test');
        Assert.equal(modconfig.getMiddlewareConfig()[0].priority, 100);
        Assert.equal(modconfig.getMiddlewareConfig()[0].enabled, true);
        Assert.equal(modconfig.getMiddlewareConfig()[0].path, './src/middleware/auth');
    });
});
