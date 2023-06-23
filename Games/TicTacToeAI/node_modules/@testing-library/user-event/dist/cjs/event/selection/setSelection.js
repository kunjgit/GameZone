'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var UI = require('../../document/UI.js');
require('../../utils/click/isClickableInput.js');
require('../../utils/dataTransfer/Clipboard.js');
require('../../utils/edit/isEditable.js');
require('../../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
require('../../utils/keyDef/readNextDescriptor.js');
require('../../utils/misc/level.js');
require('../../options.js');
var getTargetTypeAndSelection = require('./getTargetTypeAndSelection.js');

/**
 * Set the selection
 */ function setSelection({ focusNode , focusOffset , anchorNode =focusNode , anchorOffset =focusOffset  }) {
    var ref, ref1;
    const typeAndSelection = getTargetTypeAndSelection.getTargetTypeAndSelection(focusNode);
    if (typeAndSelection.type === 'input') {
        return UI.setUISelection(focusNode, {
            anchorOffset,
            focusOffset
        });
    }
    (ref1 = (ref = anchorNode.ownerDocument) === null || ref === void 0 ? void 0 : ref.getSelection()) === null || ref1 === void 0 ? void 0 : ref1.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
}

exports.setSelection = setSelection;
