import { isClickableInput } from '../../utils/click/isClickableInput.js';
import '../../utils/dataTransfer/Clipboard.js';
import '../../utils/edit/isEditable.js';
import '../../utils/edit/maxLength.js';
import '@testing-library/dom/dist/helpers.js';
import '../../utils/keyDef/readNextDescriptor.js';
import '../../utils/misc/level.js';
import '../../options.js';
import { behavior } from './registry.js';

behavior.keyup = (event, target, instance)=>{
    var ref;
    return (ref = keyupBehavior[event.key]) === null || ref === void 0 ? void 0 : ref.call(keyupBehavior, event, target, instance);
};
const keyupBehavior = {
    ' ': (event, target, instance)=>{
        if (isClickableInput(target)) {
            return ()=>instance.dispatchUIEvent(target, 'click');
        }
    }
};
