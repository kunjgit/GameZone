'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helpers_js = require('@testing-library/dom/dist/helpers.js');

function getWindow(node) {
    return helpers_js.getWindowFromNode(node);
}

exports.getWindow = getWindow;
