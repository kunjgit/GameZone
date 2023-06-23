import { getWindowFromNode } from '@testing-library/dom/dist/helpers.js';

function getWindow(node) {
    return getWindowFromNode(node);
}

export { getWindow };
