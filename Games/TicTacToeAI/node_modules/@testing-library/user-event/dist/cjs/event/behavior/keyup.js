'use strict';

var isClickableInput = require('../../utils/click/isClickableInput.js');
require('../../utils/dataTransfer/Clipboard.js');
require('../../utils/edit/isEditable.js');
require('../../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
require('../../utils/keyDef/readNextDescriptor.js');
require('../../utils/misc/level.js');
require('../../options.js');
var registry = require('./registry.js');

registry.behavior.keyup = (event, target, instance)=>{
    var ref;
    return (ref = keyupBehavior[event.key]) === null || ref === void 0 ? void 0 : ref.call(keyupBehavior, event, target, instance);
};
const keyupBehavior = {
    ' ': (event, target, instance)=>{
        if (isClickableInput.isClickableInput(target)) {
            return ()=>instance.dispatchUIEvent(target, 'click');
        }
    }
};
