import '../utils/click/isClickableInput.js';
import '../utils/dataTransfer/Clipboard.js';
import '../utils/edit/isEditable.js';
import '../utils/edit/maxLength.js';
import { getWindow } from '../utils/misc/getWindow.js';
import '../utils/keyDef/readNextDescriptor.js';
import '../utils/misc/level.js';
import '../options.js';
import { eventMap, eventMapKeys } from './eventMap.js';

const eventInitializer = {
    ClipboardEvent: [
        initClipboardEvent
    ],
    InputEvent: [
        initUIEvent,
        initInputEvent
    ],
    MouseEvent: [
        initUIEvent,
        initUIEventModififiers,
        initMouseEvent
    ],
    PointerEvent: [
        initUIEvent,
        initUIEventModififiers,
        initMouseEvent,
        initPointerEvent, 
    ],
    KeyboardEvent: [
        initUIEvent,
        initUIEventModififiers,
        initKeyboardEvent
    ]
};
function createEvent(type, target, init) {
    var ref;
    const window = getWindow(target);
    const { EventType , defaultInit  } = eventMap[eventMapKeys[type]];
    const event = new (getEventConstructors(window))[EventType](type, defaultInit);
    (ref = eventInitializer[EventType]) === null || ref === void 0 ? void 0 : ref.forEach((f)=>f(event, init !== null && init !== void 0 ? init : {}));
    return event;
}
/* istanbul ignore next */ function getEventConstructors(window) {
    var _Event;
    /* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-extraneous-class */ const Event = (_Event = window.Event) !== null && _Event !== void 0 ? _Event : class Event {
    };
    var _AnimationEvent;
    const AnimationEvent = (_AnimationEvent = window.AnimationEvent) !== null && _AnimationEvent !== void 0 ? _AnimationEvent : class AnimationEvent extends Event {
    };
    var _ClipboardEvent;
    const ClipboardEvent = (_ClipboardEvent = window.ClipboardEvent) !== null && _ClipboardEvent !== void 0 ? _ClipboardEvent : class ClipboardEvent extends Event {
    };
    var _PopStateEvent;
    const PopStateEvent = (_PopStateEvent = window.PopStateEvent) !== null && _PopStateEvent !== void 0 ? _PopStateEvent : class PopStateEvent extends Event {
    };
    var _ProgressEvent;
    const ProgressEvent = (_ProgressEvent = window.ProgressEvent) !== null && _ProgressEvent !== void 0 ? _ProgressEvent : class ProgressEvent extends Event {
    };
    var _TransitionEvent;
    const TransitionEvent = (_TransitionEvent = window.TransitionEvent) !== null && _TransitionEvent !== void 0 ? _TransitionEvent : class TransitionEvent extends Event {
    };
    var _UIEvent;
    const UIEvent = (_UIEvent = window.UIEvent) !== null && _UIEvent !== void 0 ? _UIEvent : class UIEvent extends Event {
    };
    var _CompositionEvent;
    const CompositionEvent = (_CompositionEvent = window.CompositionEvent) !== null && _CompositionEvent !== void 0 ? _CompositionEvent : class CompositionEvent extends UIEvent {
    };
    var _FocusEvent;
    const FocusEvent = (_FocusEvent = window.FocusEvent) !== null && _FocusEvent !== void 0 ? _FocusEvent : class FocusEvent extends UIEvent {
    };
    var _InputEvent;
    const InputEvent = (_InputEvent = window.InputEvent) !== null && _InputEvent !== void 0 ? _InputEvent : class InputEvent extends UIEvent {
    };
    var _KeyboardEvent;
    const KeyboardEvent = (_KeyboardEvent = window.KeyboardEvent) !== null && _KeyboardEvent !== void 0 ? _KeyboardEvent : class KeyboardEvent extends UIEvent {
    };
    var _MouseEvent;
    const MouseEvent = (_MouseEvent = window.MouseEvent) !== null && _MouseEvent !== void 0 ? _MouseEvent : class MouseEvent extends UIEvent {
    };
    var _DragEvent;
    const DragEvent = (_DragEvent = window.DragEvent) !== null && _DragEvent !== void 0 ? _DragEvent : class DragEvent extends MouseEvent {
    };
    var _PointerEvent;
    const PointerEvent = (_PointerEvent = window.PointerEvent) !== null && _PointerEvent !== void 0 ? _PointerEvent : class PointerEvent extends MouseEvent {
    };
    var _TouchEvent;
    const TouchEvent = (_TouchEvent = window.TouchEvent) !== null && _TouchEvent !== void 0 ? _TouchEvent : class TouchEvent extends UIEvent {
    };
    /* eslint-enable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-extraneous-class */ return {
        Event,
        AnimationEvent,
        ClipboardEvent,
        PopStateEvent,
        ProgressEvent,
        TransitionEvent,
        UIEvent,
        CompositionEvent,
        FocusEvent,
        InputEvent,
        KeyboardEvent,
        MouseEvent,
        DragEvent,
        PointerEvent,
        TouchEvent
    };
}
function assignProps(obj, props) {
    for (const [key, value] of Object.entries(props)){
        Object.defineProperty(obj, key, {
            get: ()=>value !== null && value !== void 0 ? value : null
        });
    }
}
function sanitizeNumber(n) {
    return Number(n !== null && n !== void 0 ? n : 0);
}
function initClipboardEvent(event, { clipboardData  }) {
    assignProps(event, {
        clipboardData
    });
}
function initInputEvent(event, { data , inputType , isComposing  }) {
    assignProps(event, {
        data,
        isComposing: Boolean(isComposing),
        inputType: String(inputType)
    });
}
function initUIEvent(event, { view , detail  }) {
    assignProps(event, {
        view,
        detail: sanitizeNumber(detail !== null && detail !== void 0 ? detail : 0)
    });
}
function initUIEventModififiers(event, { altKey , ctrlKey , metaKey , shiftKey , modifierAltGraph , modifierCapsLock , modifierFn , modifierFnLock , modifierNumLock , modifierScrollLock , modifierSymbol , modifierSymbolLock  }) {
    assignProps(event, {
        altKey: Boolean(altKey),
        ctrlKey: Boolean(ctrlKey),
        metaKey: Boolean(metaKey),
        shiftKey: Boolean(shiftKey),
        getModifierState (k) {
            return Boolean({
                Alt: altKey,
                AltGraph: modifierAltGraph,
                CapsLock: modifierCapsLock,
                Control: ctrlKey,
                Fn: modifierFn,
                FnLock: modifierFnLock,
                Meta: metaKey,
                NumLock: modifierNumLock,
                ScrollLock: modifierScrollLock,
                Shift: shiftKey,
                Symbol: modifierSymbol,
                SymbolLock: modifierSymbolLock
            }[k]);
        }
    });
}
function initKeyboardEvent(event, { key , code , location , repeat , isComposing , charCode  }) {
    assignProps(event, {
        key: String(key),
        code: String(code),
        location: sanitizeNumber(location),
        repeat: Boolean(repeat),
        isComposing: Boolean(isComposing),
        charCode
    });
}
function initMouseEvent(event, { x , y , screenX , screenY , clientX =x , clientY =y , button , buttons , relatedTarget  }) {
    assignProps(event, {
        screenX: sanitizeNumber(screenX),
        screenY: sanitizeNumber(screenY),
        clientX: sanitizeNumber(clientX),
        x: sanitizeNumber(clientX),
        clientY: sanitizeNumber(clientY),
        y: sanitizeNumber(clientY),
        button: sanitizeNumber(button),
        buttons: sanitizeNumber(buttons),
        relatedTarget
    });
}
function initPointerEvent(event, { pointerId , width , height , pressure , tangentialPressure , tiltX , tiltY , twist , pointerType , isPrimary  }) {
    assignProps(event, {
        pointerId: sanitizeNumber(pointerId),
        width: sanitizeNumber(width),
        height: sanitizeNumber(height),
        pressure: sanitizeNumber(pressure),
        tangentialPressure: sanitizeNumber(tangentialPressure),
        tiltX: sanitizeNumber(tiltX),
        tiltY: sanitizeNumber(tiltY),
        twist: sanitizeNumber(twist),
        pointerType: String(pointerType),
        isPrimary: Boolean(isPrimary)
    });
}

export { createEvent };
