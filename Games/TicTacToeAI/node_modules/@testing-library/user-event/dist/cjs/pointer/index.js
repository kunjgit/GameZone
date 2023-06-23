'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../utils/click/isClickableInput.js');
require('../utils/dataTransfer/Clipboard.js');
require('../utils/edit/isEditable.js');
require('../utils/edit/maxLength.js');
require('@testing-library/dom/dist/helpers.js');
require('../utils/keyDef/readNextDescriptor.js');
var level = require('../utils/misc/level.js');
var wait = require('../utils/misc/wait.js');
require('../options.js');
var parseKeyDef = require('./parseKeyDef.js');

async function pointer(input) {
    const { pointerMap  } = this.config;
    const actions = [];
    (Array.isArray(input) ? input : [
        input
    ]).forEach((actionInput)=>{
        if (typeof actionInput === 'string') {
            actions.push(...parseKeyDef.parseKeyDef(pointerMap, actionInput));
        } else if ('keys' in actionInput) {
            actions.push(...parseKeyDef.parseKeyDef(pointerMap, actionInput.keys).map((i)=>({
                    ...actionInput,
                    ...i
                })));
        } else {
            actions.push(actionInput);
        }
    });
    for(let i = 0; i < actions.length; i++){
        await wait.wait(this.config);
        await pointerAction(this, actions[i]);
    }
    this.system.pointer.resetClickCount();
}
async function pointerAction(instance, action) {
    var ref, ref1;
    const pointerName = 'pointerName' in action && action.pointerName ? action.pointerName : 'keyDef' in action ? instance.system.pointer.getPointerName(action.keyDef) : 'mouse';
    const previousPosition = instance.system.pointer.getPreviousPosition(pointerName);
    var _target, _coords, _node, _offset;
    const position = {
        target: (_target = action.target) !== null && _target !== void 0 ? _target : getPrevTarget(instance, previousPosition),
        coords: (_coords = action.coords) !== null && _coords !== void 0 ? _coords : previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.coords,
        caret: {
            node: (_node = action.node) !== null && _node !== void 0 ? _node : hasCaretPosition(action) ? undefined : previousPosition === null || previousPosition === void 0 ? void 0 : (ref = previousPosition.caret) === null || ref === void 0 ? void 0 : ref.node,
            offset: (_offset = action.offset) !== null && _offset !== void 0 ? _offset : hasCaretPosition(action) ? undefined : previousPosition === null || previousPosition === void 0 ? void 0 : (ref1 = previousPosition.caret) === null || ref1 === void 0 ? void 0 : ref1.offset
        }
    };
    if ('keyDef' in action) {
        if (instance.system.pointer.isKeyPressed(action.keyDef)) {
            level.setLevelRef(instance, level.ApiLevel.Trigger);
            await instance.system.pointer.release(instance, action.keyDef, position);
        }
        if (!action.releasePrevious) {
            level.setLevelRef(instance, level.ApiLevel.Trigger);
            await instance.system.pointer.press(instance, action.keyDef, position);
            if (action.releaseSelf) {
                level.setLevelRef(instance, level.ApiLevel.Trigger);
                await instance.system.pointer.release(instance, action.keyDef, position);
            }
        }
    } else {
        level.setLevelRef(instance, level.ApiLevel.Trigger);
        await instance.system.pointer.move(instance, pointerName, position);
    }
}
function hasCaretPosition(action) {
    var _target, ref;
    return !!((ref = (_target = action.target) !== null && _target !== void 0 ? _target : action.node) !== null && ref !== void 0 ? ref : action.offset !== undefined);
}
function getPrevTarget(instance, position) {
    if (!position) {
        throw new Error('This pointer has no previous position. Provide a target property!');
    }
    var _target;
    return (_target = position.target) !== null && _target !== void 0 ? _target : instance.config.document.body;
}

exports.pointer = pointer;
