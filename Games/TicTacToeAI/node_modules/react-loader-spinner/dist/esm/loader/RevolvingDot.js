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
var RevolvingDot = function (_a) {
    var _b = _a.radius, radius = _b === void 0 ? 45 : _b, _c = _a.strokeWidth, strokeWidth = _c === void 0 ? 5 : _c, _d = _a.color, color = _d === void 0 ? DEFAULT_COLOR : _d, secondaryColor = _a.secondaryColor, _e = _a.ariaLabel, ariaLabel = _e === void 0 ? 'revolving-dot-loading' : _e, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _f = _a.visible, visible = _f === void 0 ? true : _f;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "aria-label": ariaLabel, "data-testid": "revolving-dot-loading" }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { version: "1.1", width: "calc(".concat(radius, " * 2.5)"), height: "calc(".concat(radius, " * 2.5)"), xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", "data-testid": "revolving-dot-svg" },
            React.createElement("circle", { fill: "none", stroke: secondaryColor || color, strokeWidth: strokeWidth, cx: "calc(".concat(radius, " * 1.28)"), cy: "calc(".concat(radius, " * 1.28)"), r: radius, style: { opacity: 0.5 } }),
            React.createElement("circle", { fill: color, stroke: color, strokeWidth: "3", cx: "calc(".concat(radius, " * 1.28)"), cy: "calc(".concat(radius, " / 3.5)"), r: "calc(".concat(radius, " / 5)"), style: { transformOrigin: '50% 50%' } },
                React.createElement("animateTransform", { attributeName: "transform", dur: "2s", type: "rotate", from: "0", to: "360", repeatCount: "indefinite" })))));
};
export default RevolvingDot;
