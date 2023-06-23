import '../utils/click/isClickableInput.js';
import { createDataTransfer } from '../utils/dataTransfer/DataTransfer.js';
import { readDataTransferFromClipboard } from '../utils/dataTransfer/Clipboard.js';
import '../utils/edit/isEditable.js';
import '../utils/edit/maxLength.js';
import { getWindow } from '../utils/misc/getWindow.js';
import '../utils/keyDef/readNextDescriptor.js';
import '../utils/misc/level.js';
import '../options.js';

async function paste(clipboardData) {
    const doc = this.config.document;
    var _activeElement;
    const target = (_activeElement = doc.activeElement) !== null && _activeElement !== void 0 ? _activeElement : /* istanbul ignore next */ doc.body;
    var ref;
    const dataTransfer = (ref = typeof clipboardData === 'string' ? getClipboardDataFromString(doc, clipboardData) : clipboardData) !== null && ref !== void 0 ? ref : await readDataTransferFromClipboard(doc).catch(()=>{
        throw new Error('`userEvent.paste()` without `clipboardData` requires the `ClipboardAPI` to be available.');
    });
    this.dispatchUIEvent(target, 'paste', {
        clipboardData: dataTransfer
    });
}
function getClipboardDataFromString(doc, text) {
    const dt = createDataTransfer(getWindow(doc));
    dt.setData('text', text);
    return dt;
}

export { paste };
