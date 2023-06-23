'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/click/isClickableInput.js');
require('../../utils/dataTransfer/Clipboard.js');
var isContentEditable = require('../../utils/edit/isContentEditable.js');
require('../../utils/edit/isEditable.js');
require('../../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
var selection = require('../../utils/focus/selection.js');
require('../../utils/keyDef/readNextDescriptor.js');
require('../../utils/misc/level.js');
require('../../options.js');
var setSelection = require('./setSelection.js');

/**
 * Backward-compatible selection.
 *
 * Handles input elements and contenteditable if it only contains a single text node.
 */ function setSelectionRange(element, anchorOffset, focusOffset) {
    var ref;
    if (selection.hasOwnSelection(element)) {
        return setSelection.setSelection({
            focusNode: element,
            anchorOffset,
            focusOffset
        });
    }
    /* istanbul ignore else */ if (isContentEditable.isContentEditable(element) && ((ref = element.firstChild) === null || ref === void 0 ? void 0 : ref.nodeType) === 3) {
        return setSelection.setSelection({
            focusNode: element.firstChild,
            anchorOffset,
            focusOffset
        });
    }
    /* istanbul ignore next */ throw new Error('Not implemented. The result of this interaction is unreliable.');
}

exports.setSelectionRange = setSelectionRange;
