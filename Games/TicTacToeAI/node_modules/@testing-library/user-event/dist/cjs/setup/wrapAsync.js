'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dom = require('@testing-library/dom');

/**
 * Wrap an internal Promise
 */ function wrapAsync(implementation) {
    return dom.getConfig().asyncWrapper(implementation);
}

exports.wrapAsync = wrapAsync;
