'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dom = require('@testing-library/dom');

function wrapEvent(cb, _element) {
    return dom.getConfig().eventWrapper(cb);
}

exports.wrapEvent = wrapEvent;
