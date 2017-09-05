"use strict";

const colors = require("colors");
const customError = require('custom-error');
const pathToRoot = '../../';
const modconfig = require('../modconfig/index');
const middlewareConfig = modconfig.getMiddlewareConfig();

function apply(app, options, middlewares) {
    try {
        if (app) {
            if (middlewares.constructor === Array) {
                for (let i = 0; i < middlewares.length; i++) {
                    const middleware = require(pathToRoot + middlewares[i].path);
                    app.use(middleware);
                }
            }
        } else {
            console.log(colors.red("Error: app not found or is null"));
        }
    } catch (e) {
        console.log(e);
    }
}

async function getActiveMiddlewares(middlewares) {
    const activeMiddlewares = [];
    for (let i = 0; i < middlewares.length; i++) {
        if (middlewares[i].enabled === true) {
            activeMiddlewares.push(middlewares[i]);
        }
    }
    return activeMiddlewares;
}

async function sortByProperty(objArray, prop, direction) {
    if (!Array.isArray(objArray)) {
        throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    }
    const clone = objArray.slice(0);
    const direct = direction === -1 ? direction : 1; // Default to ascending
    const propPath = (prop.constructor === Array) ? prop : prop.split(".");
    clone.sort((a, b) => {
        for (const p in propPath) {
            if (a[propPath[p]] && b[propPath[p]]) {
                a = a[propPath[p]];
                b = b[propPath[p]];
            }
        }
        // return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
        if (a < b) {
            return (-1 * direct);
        } else if (a > b) {
            return (1 * direct);
        }
        return 0;
    });
    return clone;
}

module.exports = {
    init: function(app, options) {
        try {
            if (app) {
                (async() => {
                    if (middlewareConfig && middlewareConfig instanceof Array) {
                        const activeMiddlewares = await getActiveMiddlewares(middlewareConfig);
                        const middlewarePriority = await sortByProperty(activeMiddlewares, 'priority');
                        apply(app, options, middlewarePriority);
                    } else {
                        const invalidMiddlwareError = customError('InvalidMiddleware');
                        throw invalidMiddlwareError('middleware.json is invalid or not found');
                    }
                })();
            }
        } catch (e) {
            console.log(colors.red("Exception Occured : ", e));
        }
    }
};
