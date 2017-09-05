/*
    key (format) : 'key1:key2:key3'
    key cannot be null or empty
    override default is true 
*/

'use strict';

const config = require('../../config/config.json');
const errorConfig = require('../../config/error.json');
const middlewareConfig = require('../../config/middleware.json');
const cache = require('../cache/');
const customError = require('custom-error');
const colors = require('colors');

cache.set('config', config);
cache.set('errorConfig', errorConfig);

function validKey(key) {
    if (key && key !== null && key !== '') {
        return true;
    }
    return false;
}

function workOnJSON(ljson, key, value, override, isLastKey) {
    const localJSON = ljson;
    if ((override && isLastKey) || (!localJSON.hasOwnProperty(key) && isLastKey)) {
        localJSON[key] = value;
    } else if (!isLastKey) {
        if (!localJSON.hasOwnProperty(key)) {
            localJSON[key] = {};
        }
    }
    return localJSON;
}

module.exports = {

    getConfig: () => {
        if (!cache.get('config')) {
            cache.set('config', config);
        }
        return cache.get('config');
    },

    getErrorConfig: () => {
        if (!cache.get('errorConfig')) {
            cache.set('errorConfig', errorConfig);
        }
        return cache.get('errorConfig');
    },

    getMiddlewareConfig: () => {
        if (!cache.get('middlewareConfig')) {
            cache.set('middlewareConfig', middlewareConfig);
        }
        return cache.get('middlewareConfig');
    },

    updateConfig: (key, value, override) => { // Nested key can be separated by colon. Ex details:username
        try {
            const overrideStatus = override !== false ? true : false;
            const keysplit = key.split(':');
            const json = cache.get('config');
            if (keysplit.length === 1) {
                if (validKey(keysplit[0])) {
                    if (overrideStatus || !json.hasOwnProperty(keysplit[0])) {
                        json[keysplit[0]] = value;
                    } else {
                        // console.log('Cannot Update. Override not allowed');
                        const updateError = customError('ConfigUpdateError');
                        throw updateError('{"type": 100, "msg": "Cannot Update, override not allowed"}');
                    }
                } else {
                    const updateError = customError('ConfigUpdateError');
                    throw updateError('{"type": 101, "msg": "Cannot Update, invalid Key."}');
                }
            } else if (keysplit.length > 1) {
                let localJSON = json;
                for (let i = 0; i < keysplit.length; i++) {
                    if (validKey(keysplit[i])) {
                        if (i === keysplit.length - 1) {
                            localJSON = workOnJSON(localJSON, keysplit[i], value, overrideStatus, true);
                        } else {
                            localJSON = workOnJSON(localJSON, keysplit[i], value, overrideStatus, false);
                            localJSON = localJSON[keysplit[i]];
                        }
                    } else {
                        const updateError = customError('ConfigUpdateError');
                        throw updateError('{"type": 101, "msg": "Cannot Update, invalid Key."}');
                    }
                }
            }
            cache.set('config', json);
        } catch (e) {
            console.log(colors.red(e));
        }
    },

    getCache: () => cache
};
