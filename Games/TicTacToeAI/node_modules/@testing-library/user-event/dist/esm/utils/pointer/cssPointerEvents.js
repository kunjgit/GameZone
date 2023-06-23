import { PointerEventsCheckLevel } from '../../options.js';
import { getWindow } from '../misc/getWindow.js';
import { isElementType } from '../misc/isElementType.js';
import { ApiLevel, getLevelRef } from '../misc/level.js';

function hasPointerEvents(instance, element) {
    var ref;
    return ((ref = checkPointerEvents(instance, element)) === null || ref === void 0 ? void 0 : ref.pointerEvents) !== 'none';
}
function closestPointerEventsDeclaration(element) {
    const window = getWindow(element);
    for(let el = element, tree = []; el === null || el === void 0 ? void 0 : el.ownerDocument; el = el.parentElement){
        tree.push(el);
        const pointerEvents = window.getComputedStyle(el).pointerEvents;
        if (pointerEvents && ![
            'inherit',
            'unset'
        ].includes(pointerEvents)) {
            return {
                pointerEvents,
                tree
            };
        }
    }
    return undefined;
}
const PointerEventsCheck = Symbol('Last check for pointer-events');
function checkPointerEvents(instance, element) {
    const lastCheck = element[PointerEventsCheck];
    const needsCheck = instance.config.pointerEventsCheck !== PointerEventsCheckLevel.Never && (!lastCheck || hasBitFlag(instance.config.pointerEventsCheck, PointerEventsCheckLevel.EachApiCall) && lastCheck[ApiLevel.Call] !== getLevelRef(instance, ApiLevel.Call) || hasBitFlag(instance.config.pointerEventsCheck, PointerEventsCheckLevel.EachTrigger) && lastCheck[ApiLevel.Trigger] !== getLevelRef(instance, ApiLevel.Trigger));
    if (!needsCheck) {
        return lastCheck === null || lastCheck === void 0 ? void 0 : lastCheck.result;
    }
    const declaration = closestPointerEventsDeclaration(element);
    element[PointerEventsCheck] = {
        [ApiLevel.Call]: getLevelRef(instance, ApiLevel.Call),
        [ApiLevel.Trigger]: getLevelRef(instance, ApiLevel.Trigger),
        result: declaration
    };
    return declaration;
}
function assertPointerEvents(instance, element) {
    const declaration = checkPointerEvents(instance, element);
    if ((declaration === null || declaration === void 0 ? void 0 : declaration.pointerEvents) === 'none') {
        throw new Error([
            `Unable to perform pointer interaction as the element ${declaration.tree.length > 1 ? 'inherits' : 'has'} \`pointer-events: none\`:`,
            '',
            printTree(declaration.tree), 
        ].join('\n'));
    }
}
function printTree(tree) {
    return tree.reverse().map((el, i)=>[
            ''.padEnd(i),
            el.tagName,
            el.id && `#${el.id}`,
            el.hasAttribute('data-testid') && `(testId=${el.getAttribute('data-testid')})`,
            getLabelDescr(el),
            tree.length > 1 && i === 0 && '  <-- This element declared `pointer-events: none`',
            tree.length > 1 && i === tree.length - 1 && '  <-- Asserted pointer events here', 
        ].filter(Boolean).join('')).join('\n');
}
function getLabelDescr(element) {
    var ref;
    let label;
    if (element.hasAttribute('aria-label')) {
        label = element.getAttribute('aria-label');
    } else if (element.hasAttribute('aria-labelledby')) {
        var ref1, ref2;
        label = (ref1 = element.ownerDocument.getElementById(element.getAttribute('aria-labelledby'))) === null || ref1 === void 0 ? void 0 : (ref2 = ref1.textContent) === null || ref2 === void 0 ? void 0 : ref2.trim();
    } else if (isElementType(element, [
        'button',
        'input',
        'meter',
        'output',
        'progress',
        'select',
        'textarea', 
    ]) && ((ref = element.labels) === null || ref === void 0 ? void 0 : ref.length)) {
        label = Array.from(element.labels).map((el)=>{
            var ref;
            return (ref = el.textContent) === null || ref === void 0 ? void 0 : ref.trim();
        }).join('|');
    } else if (isElementType(element, 'button')) {
        var ref3;
        label = (ref3 = element.textContent) === null || ref3 === void 0 ? void 0 : ref3.trim();
    }
    label = label === null || label === void 0 ? void 0 : label.replace(/\n/g, '  ');
    if (Number(label === null || label === void 0 ? void 0 : label.length) > 30) {
        label = `${label === null || label === void 0 ? void 0 : label.substring(0, 29)}…`;
    }
    return label ? `(label=${label})` : '';
}
// With the eslint rule and prettier the bitwise operation isn't nice to read
function hasBitFlag(conf, flag) {
    // eslint-disable-next-line no-bitwise
    return (conf & flag) > 0;
}

export { assertPointerEvents, hasPointerEvents };
