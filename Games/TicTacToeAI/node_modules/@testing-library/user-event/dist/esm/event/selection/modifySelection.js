import { setUISelection } from '../../document/UI.js';
import '../../utils/click/isClickableInput.js';
import '../../utils/dataTransfer/Clipboard.js';
import '../../utils/edit/isEditable.js';
import '../../utils/edit/maxLength.js';
import '@testing-library/dom/dist/helpers.js';
import '../../utils/keyDef/readNextDescriptor.js';
import '../../utils/misc/level.js';
import '../../options.js';
import { getTargetTypeAndSelection } from './getTargetTypeAndSelection.js';

/**
 * Extend/shrink the selection like with Shift+Arrows or Shift+Mouse
 */ function modifySelection({ focusNode , focusOffset  }) {
    var ref, ref1;
    const typeAndSelection = getTargetTypeAndSelection(focusNode);
    if (typeAndSelection.type === 'input') {
        return setUISelection(focusNode, {
            anchorOffset: typeAndSelection.selection.anchorOffset,
            focusOffset
        }, 'modify');
    }
    (ref1 = (ref = focusNode.ownerDocument) === null || ref === void 0 ? void 0 : ref.getSelection()) === null || ref1 === void 0 ? void 0 : ref1.extend(focusNode, focusOffset);
}

export { modifySelection };
