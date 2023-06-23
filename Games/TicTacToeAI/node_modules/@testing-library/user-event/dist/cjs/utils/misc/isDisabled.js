'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isElementType = require('./isElementType.js');

// This should probably just rely on the :disabled pseudo-class, but JSDOM doesn't implement it properly.
function isDisabled(element) {
    for(let el = element; el; el = el.parentElement){
        if (isElementType.isElementType(el, [
            'button',
            'input',
            'select',
            'textarea',
            'optgroup',
            'option', 
        ])) {
            if (el.hasAttribute('disabled')) {
                return true;
            }
        } else if (isElementType.isElementType(el, 'fieldset')) {
            var ref;
            if (el.hasAttribute('disabled') && !((ref = el.querySelector(':scope > legend')) === null || ref === void 0 ? void 0 : ref.contains(element))) {
                return true;
            }
        } else if (el.tagName.includes('-')) {
            if (el.constructor.formAssociated && el.hasAttribute('disabled')) {
                return true;
            }
        }
    }
    return false;
}

exports.isDisabled = isDisabled;
