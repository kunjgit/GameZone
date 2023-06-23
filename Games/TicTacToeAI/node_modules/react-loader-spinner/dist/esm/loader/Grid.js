var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { getDefaultStyle } from '../helpers';
import { DEFAULT_COLOR, DEFAULT_WAI_ARIA_ATTRIBUTE } from '../type';
export var Grid = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 12.5 : _d, _e = _a.color, color = _e === void 0 ? DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'grid-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "grid-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { width: width, height: height, viewBox: "0 0 105 105", fill: color, "data-testid": "grid-svg" },
            React.createElement("circle", { cx: "12.5", cy: "12.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "0s", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "12.5", cy: "52.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "100ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "52.5", cy: "12.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "300ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "52.5", cy: "52.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "600ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "92.5", cy: "12.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "800ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "92.5", cy: "52.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "400ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "12.5", cy: "92.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "700ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "52.5", cy: "92.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "500ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "92.5", cy: "92.5", r: "".concat(radius) },
                React.createElement("animate", { attributeName: "fill-opacity", begin: "200ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })))));
};
export default Grid;
