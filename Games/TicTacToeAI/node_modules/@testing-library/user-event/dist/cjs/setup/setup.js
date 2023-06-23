'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var prepareDocument = require('../document/prepareDocument.js');
var dispatchEvent = require('../event/dispatchEvent.js');
require('../utils/click/isClickableInput.js');
var Clipboard = require('../utils/dataTransfer/Clipboard.js');
require('../utils/edit/isEditable.js');
require('../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
require('../utils/keyDef/readNextDescriptor.js');
var getDocumentFromNode = require('../utils/misc/getDocumentFromNode.js');
var level = require('../utils/misc/level.js');
var wait = require('../utils/misc/wait.js');
var options = require('../options.js');
require('@testing-library/dom');
var keyMap = require('../keyboard/keyMap.js');
var keyMap$1 = require('../pointer/keyMap.js');
var index = require('../system/index.js');
var api = require('./api.js');
var wrapAsync = require('./wrapAsync.js');

/**
 * Default options applied when API is called per `userEvent.anyApi()`
 */ const defaultOptionsDirect = {
    applyAccept: true,
    autoModify: true,
    delay: 0,
    document: globalThis.document,
    keyboardMap: keyMap.defaultKeyMap,
    pointerMap: keyMap$1.defaultKeyMap,
    pointerEventsCheck: options.PointerEventsCheckLevel.EachApiCall,
    skipAutoClose: false,
    skipClick: false,
    skipHover: false,
    writeToClipboard: false,
    advanceTimers: ()=>Promise.resolve()
};
/**
 * Default options applied when API is called per `userEvent().anyApi()`
 */ const defaultOptionsSetup = {
    ...defaultOptionsDirect,
    writeToClipboard: true
};
function createConfig(options = {}, defaults = defaultOptionsSetup, node) {
    const document = getDocument(options, node, defaults);
    return {
        ...defaults,
        ...options,
        document
    };
}
/**
 * Start a "session" with userEvent.
 * All APIs returned by this function share an input device state and a default configuration.
 */ function setupMain(options = {}) {
    const config = createConfig(options);
    prepareDocument.prepareDocument(config.document);
    var _defaultView;
    const view = (_defaultView = config.document.defaultView) !== null && _defaultView !== void 0 ? _defaultView : /* istanbul ignore next */ globalThis.window;
    Clipboard.attachClipboardStubToView(view);
    return createInstance(config).api;
}
/**
 * Setup in direct call per `userEvent.anyApi()`
 */ function setupDirect({ keyboardState , pointerState , ...options } = {}, node) {
    const config = createConfig(options, defaultOptionsDirect, node);
    prepareDocument.prepareDocument(config.document);
    var ref;
    const system = (ref = pointerState !== null && pointerState !== void 0 ? pointerState : keyboardState) !== null && ref !== void 0 ? ref : new index.System();
    return {
        api: createInstance(config, system).api,
        system
    };
}
/**
 * Create a set of callbacks with different default settings but the same state.
 */ function setupSub(options) {
    return createInstance({
        ...this.config,
        ...options
    }, this.system).api;
}
function wrapAndBindImpl(instance, impl) {
    function method(...args) {
        level.setLevelRef(instance, level.ApiLevel.Call);
        return wrapAsync.wrapAsync(()=>impl.apply(instance, args).then(async (ret)=>{
                await wait.wait(instance.config);
                return ret;
            }));
    }
    Object.defineProperty(method, 'name', {
        get: ()=>impl.name
    });
    return method;
}
function createInstance(config, system = new index.System()) {
    const instance = {};
    Object.assign(instance, {
        config,
        dispatchEvent: dispatchEvent.dispatchEvent.bind(instance),
        dispatchUIEvent: dispatchEvent.dispatchUIEvent.bind(instance),
        system,
        levelRefs: {},
        ...api
    });
    return {
        instance,
        api: {
            ...Object.fromEntries(Object.entries(api).map(([name, api])=>[
                    name,
                    wrapAndBindImpl(instance, api), 
                ])),
            setup: setupSub.bind(instance)
        }
    };
}
function getDocument(options, node, defaults) {
    var _document, ref;
    return (ref = (_document = options.document) !== null && _document !== void 0 ? _document : node && getDocumentFromNode.getDocumentFromNode(node)) !== null && ref !== void 0 ? ref : defaults.document;
}

exports.createConfig = createConfig;
exports.createInstance = createInstance;
exports.setupDirect = setupDirect;
exports.setupMain = setupMain;
exports.setupSub = setupSub;
