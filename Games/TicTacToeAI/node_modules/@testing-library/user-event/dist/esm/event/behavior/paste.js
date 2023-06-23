import '../../utils/click/isClickableInput.js';
import '../../utils/dataTransfer/Clipboard.js';
import { isEditable } from '../../utils/edit/isEditable.js';
import '../../utils/edit/maxLength.js';
import '@testing-library/dom/dist/helpers.js';
import '../../utils/keyDef/readNextDescriptor.js';
import '../../utils/misc/level.js';
import '../../options.js';
import { input } from '../input.js';
import { behavior } from './registry.js';

behavior.paste = (event, target, instance)=>{
    if (isEditable(target)) {
        return ()=>{
            var ref;
            const insertData = (ref = event.clipboardData) === null || ref === void 0 ? void 0 : ref.getData('text');
            if (insertData) {
                input(instance, target, insertData, 'insertFromPaste');
            }
        };
    }
};
