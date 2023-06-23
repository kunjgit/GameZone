'use strict';

require('../../utils/click/isClickableInput.js');
require('../../utils/dataTransfer/Clipboard.js');
var isEditable = require('../../utils/edit/isEditable.js');
require('../../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
require('../../utils/keyDef/readNextDescriptor.js');
require('../../utils/misc/level.js');
require('../../options.js');
var input = require('../input.js');
var registry = require('./registry.js');

registry.behavior.paste = (event, target, instance)=>{
    if (isEditable.isEditable(target)) {
        return ()=>{
            var ref;
            const insertData = (ref = event.clipboardData) === null || ref === void 0 ? void 0 : ref.getData('text');
            if (insertData) {
                input.input(instance, target, insertData, 'insertFromPaste');
            }
        };
    }
};
