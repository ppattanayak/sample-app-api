'use strict';

let routes = require('../../routes.json');
const customError = require('custom-error');
const colors = require('colors');

function isValidRoute(route) {
    if (typeof route === 'function') {
        return true;
    }
    return false;
}

async function init(app) {
    debugger;
    try {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].enabled === true) {
                const routerPath = process.cwd() + (routes[i] && routes[i].path);
                const router = require(routerPath);
                if (isValidRoute(router)) {
                    if (routes[i].method === 'GET' || routes[i].method === 'get') {
                        app.get(routes[i].route, router);
                    } else if (routes[i].method === 'POST' || routes[i].method === 'post') {
                        app.post(routes[i].route, router);
                    } else if (routes[i].method === 'PUT' || routes[i].method === 'put') {
                        app.put(routes[i].route, router);
                    }
                    console.log(colors.green('Registering Route: ', routes[i].route));
                } else {
                    const invalidRoute = customError('InvalidRoute');
                    throw invalidRoute('{"code: 100", "msg": "Invalid Route"}');
                }
            }
            if (i === routes.length - 1) {
                return true;
            }
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

module.exports.init = init;
