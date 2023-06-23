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
 * Extend/shrink the selection like with Shift+Arrows or Shift+Mouse
 */ function modifySelection({ focusNode , focusOffset  }) {
    var ref, ref1;
    const typeAndSelection = getTargetTypeAndSelection.getTargetTypeAndSelection(focusNode);
    if (typeAndSelection.type === 'input') {
        return UI.setUISelection(focusNode, {
            anchorOffset: typeAndSelection.selection.anchorOffset,
            focusOffset
        }, 'modify');
    }
    (ref1 = (ref = focusNode.ownerDocument) === null || ref === void 0 ? void 0 : ref.getSelection()) === null || ref1 === void 0 ? void 0 : ref1.extend(focusNode, focusOffset);
}

exports.modifySelection = modifySelection;
