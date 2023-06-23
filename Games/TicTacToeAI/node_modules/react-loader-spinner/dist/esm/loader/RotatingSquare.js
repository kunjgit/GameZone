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
var RotatingSquare = function (_a) {
    var _b = _a.wrapperClass, wrapperClass = _b === void 0 ? '' : _b, _c = _a.color, color = _c === void 0 ? DEFAULT_COLOR : _c, _d = _a.height, height = _d === void 0 ? 100 : _d, _e = _a.width, width = _e === void 0 ? 100 : _e, _f = _a.strokeWidth, strokeWidth = _f === void 0 ? 4 : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'rotating-square-loading' : _g, _h = _a.wrapperStyle, wrapperStyle = _h === void 0 ? {} : _h, _j = _a.visible, visible = _j === void 0 ? true : _j;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "rotating-square-wrapper", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 100 100", enableBackground: "new 0 0 100 100", height: "".concat(height), width: "".concat(width), "data-testid": "rotating-square-svg", xmlSpace: "preserve" },
            React.createElement("rect", { fill: "none", stroke: color, strokeWidth: strokeWidth, x: "25", y: "25", width: "50", height: "50" },
                React.createElement("animateTransform", { attributeName: "transform", dur: "0.5s", from: "0 50 50", to: "180 50 50", type: "rotate", id: "strokeBox", attributeType: "XML", begin: "rectBox.end" })),
            React.createElement("rect", { x: "27", y: "27", fill: color, width: "46", height: "50" },
                React.createElement("animate", { attributeName: "height", dur: "1.3s", attributeType: "XML", from: "50", to: "0", id: "rectBox", fill: "freeze", begin: "0s;strokeBox.end" })))));
};
export default RotatingSquare;
