'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isDisabled = require('../misc/isDisabled.js');

function getActiveElement(document) {
    const activeElement = document.activeElement;
    if (activeElement === null || activeElement === void 0 ? void 0 : activeElement.shadowRoot) {
        return getActiveElement(activeElement.shadowRoot);
    } else {
        // Browser does not yield disabled elements as document.activeElement - jsdom does
        if (isDisabled.isDisabled(activeElement)) {
            return document.ownerDocument ? /* istanbul ignore next */ document.ownerDocument.body : document.body;
        }
        return activeElement;
    }
}
function getActiveElementOrBody(document) {
    var ref;
    return (ref = getActiveElement(document)) !== null && ref !== void 0 ? ref : /* istanbul ignore next */ document.body;
}

exports.getActiveElement = getActiveElement;
exports.getActiveElementOrBody = getActiveElementOrBody;
