import { createFileList } from './FileList.js';

// DataTransfer is not implemented in jsdom.
// DataTransfer with FileList is being created by the browser on certain events.
class DataTransferItemStub {
    getAsFile() {
        return this.file;
    }
    getAsString(callback) {
        if (typeof this.data === 'string') {
            callback(this.data);
        }
    }
    /* istanbul ignore next */ webkitGetAsEntry() {
        throw new Error('not implemented');
    }
    constructor(dataOrFile, type){
        this.file = null;
        this.data = undefined;
        if (typeof dataOrFile === 'string') {
            this.kind = 'string';
            this.type = String(type);
            this.data = dataOrFile;
        } else {
            this.kind = 'file';
            this.type = dataOrFile.type;
            this.file = dataOrFile;
        }
    }
}
class DataTransferItemListStub extends Array {
    add(...args) {
        const item = new DataTransferItemStub(args[0], args[1]);
        this.push(item);
        return item;
    }
    clear() {
        this.splice(0, this.length);
    }
    remove(index) {
        this.splice(index, 1);
    }
}
function getTypeMatcher(type, exact) {
    const [group, sub] = type.split('/');
    const isGroup = !sub || sub === '*';
    return (item)=>{
        return exact ? item.type === (isGroup ? group : type) : isGroup ? item.type.startsWith(`${group}/`) : item.type === group;
    };
}
function createDataTransferStub(window) {
    return new class DataTransferStub {
        getData(format) {
            var ref;
            const match = (ref = this.items.find(getTypeMatcher(format, true))) !== null && ref !== void 0 ? ref : this.items.find(getTypeMatcher(format, false));
            let text = '';
            match === null || match === void 0 ? void 0 : match.getAsString((t)=>{
                text = t;
            });
            return text;
        }
        setData(format, data) {
            const matchIndex = this.items.findIndex(getTypeMatcher(format, true));
            const item = new DataTransferItemStub(data, format);
            if (matchIndex >= 0) {
                this.items.splice(matchIndex, 1, item);
            } else {
                this.items.push(item);
            }
        }
        clearData(format) {
            if (format) {
                const matchIndex = this.items.findIndex(getTypeMatcher(format, true));
                if (matchIndex >= 0) {
                    this.items.remove(matchIndex);
                }
            } else {
                this.items.clear();
            }
        }
        get types() {
            const t = [];
            if (this.files.length) {
                t.push('Files');
            }
            this.items.forEach((i)=>t.push(i.type));
            Object.freeze(t);
            return t;
        }
        /* istanbul ignore next */ setDragImage() {}
        constructor(){
            this.dropEffect = 'none';
            this.effectAllowed = 'uninitialized';
            this.items = new DataTransferItemListStub();
            this.files = createFileList(window, []);
        }
    }();
}
function createDataTransfer(window, files = []) {
    // Use real DataTransfer if available
    const dt = typeof window.DataTransfer === 'undefined' ? createDataTransferStub(window) : /* istanbul ignore next */ new window.DataTransfer();
    Object.defineProperty(dt, 'files', {
        get: ()=>createFileList(window, files)
    });
    return dt;
}
function getBlobFromDataTransferItem(window, item) {
    if (item.kind === 'file') {
        return item.getAsFile();
    }
    let data = '';
    item.getAsString((s)=>{
        data = s;
    });
    return new window.Blob([
        data
    ], {
        type: item.type
    });
}

export { createDataTransfer, getBlobFromDataTransferItem };
