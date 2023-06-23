"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function now() {
    if (typeof window === 'undefined' || !('performance' in window)) {
        return Date.now();
    }
    return performance.now();
}
exports.default = now;
//# sourceMappingURL=now.js.map