'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getTargetTypeAndSelection = require('./getTargetTypeAndSelection.js');

/**
 * Get the range that would be overwritten by input.
 */ function getInputRange(focusNode) {
    const typeAndSelection = getTargetTypeAndSelection.getTargetTypeAndSelection(focusNode);
    if (typeAndSelection.type === 'input') {
        return typeAndSelection.selection;
    } else if (typeAndSelection.type === 'contenteditable') {
        var ref;
        // Multi-range on contenteditable edits the first selection instead of the last
        return (ref = typeAndSelection.selection) === null || ref === void 0 ? void 0 : ref.getRangeAt(0);
    }
}

exports.getInputRange = getInputRange;
