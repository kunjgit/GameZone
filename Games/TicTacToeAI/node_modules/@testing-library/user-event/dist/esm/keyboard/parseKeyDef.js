import '../utils/click/isClickableInput.js';
import '../utils/dataTransfer/Clipboard.js';
import '../utils/edit/isEditable.js';
import '../utils/edit/maxLength.js';
import '@testing-library/dom/dist/helpers.js';
import { readNextDescriptor } from '../utils/keyDef/readNextDescriptor.js';
import '../utils/misc/level.js';
import '../options.js';

/**
 * Parse key defintions per `keyboardMap`
 *
 * Keys can be referenced by `{key}` or `{special}` as well as physical locations per `[code]`.
 * Everything else will be interpreted as a typed character - e.g. `a`.
 * Brackets `{` and `[` can be escaped by doubling - e.g. `foo[[bar` translates to `foo[bar`.
 * Keeping the key pressed can be written as `{key>}`.
 * When keeping the key pressed you can choose how long (how many keydown and keypress) the key is pressed `{key>3}`.
 * You can then release the key per `{key>3/}` or keep it pressed and continue with the next key.
 */ function parseKeyDef(keyboardMap, text) {
    const defs = [];
    do {
        const { type , descriptor , consumedLength , releasePrevious , releaseSelf =true , repeat ,  } = readNextDescriptor(text, 'keyboard');
        var ref;
        const keyDef = (ref = keyboardMap.find((def)=>{
            if (type === '[') {
                var ref;
                return ((ref = def.code) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === descriptor.toLowerCase();
            } else if (type === '{') {
                var ref1;
                return ((ref1 = def.key) === null || ref1 === void 0 ? void 0 : ref1.toLowerCase()) === descriptor.toLowerCase();
            }
            return def.key === descriptor;
        })) !== null && ref !== void 0 ? ref : {
            key: 'Unknown',
            code: 'Unknown',
            [type === '[' ? 'code' : 'key']: descriptor
        };
        defs.push({
            keyDef,
            releasePrevious,
            releaseSelf,
            repeat
        });
        text = text.slice(consumedLength);
    }while (text)
    return defs;
}

export { parseKeyDef };
