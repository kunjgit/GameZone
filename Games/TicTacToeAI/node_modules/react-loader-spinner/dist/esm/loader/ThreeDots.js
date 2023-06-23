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
var ThreeDots = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 9 : _d, _e = _a.color, color = _e === void 0 ? DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'three-dots-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "three-dots-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { width: width, height: height, viewBox: "0 0 120 30", xmlns: "http://www.w3.org/2000/svg", fill: color, "data-testid": "three-dots-svg" },
            React.createElement("circle", { cx: "15", cy: "15", r: Number(radius) + 6 },
                React.createElement("animate", { attributeName: "r", from: "15", to: "15", begin: "0s", dur: "0.8s", values: "15;9;15", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "fill-opacity", from: "1", to: "1", begin: "0s", dur: "0.8s", values: "1;.5;1", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "60", cy: "15", r: radius, attributeName: "fill-opacity", from: "1", to: "0.3" },
                React.createElement("animate", { attributeName: "r", from: "9", to: "9", begin: "0s", dur: "0.8s", values: "9;15;9", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "fill-opacity", from: "0.5", to: "0.5", begin: "0s", dur: "0.8s", values: ".5;1;.5", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("circle", { cx: "105", cy: "15", r: Number(radius) + 6 },
                React.createElement("animate", { attributeName: "r", from: "15", to: "15", begin: "0s", dur: "0.8s", values: "15;9;15", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "fill-opacity", from: "1", to: "1", begin: "0s", dur: "0.8s", values: "1;.5;1", calcMode: "linear", repeatCount: "indefinite" })))));
};
export default ThreeDots;
