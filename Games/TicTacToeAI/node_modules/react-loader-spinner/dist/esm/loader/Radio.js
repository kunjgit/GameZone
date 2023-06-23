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
import { DEFAULT_COLOR, DEFAULT_WAI_ARIA_ATTRIBUTE } from '../type';
export default function Radio(_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.height, height = _c === void 0 ? '80' : _c, _d = _a.width, width = _d === void 0 ? '80' : _d, _e = _a.wrapperClass, wrapperClass = _e === void 0 ? '' : _e, _f = _a.wrapperStyle, wrapperStyle = _f === void 0 ? {} : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'radio-loading' : _g, _h = _a.colors, colors = _h === void 0 ? [DEFAULT_COLOR, DEFAULT_COLOR, DEFAULT_COLOR] : _h;
    return !visible ? null : (React.createElement("svg", __assign({ width: width, height: height, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", className: wrapperClass, style: wrapperStyle, "aria-label": ariaLabel, "data-testid": "radio-bar-svg" }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("circle", { cx: "28", cy: "75", r: "11", "ng-attr-fill": "{{config.c1}}", fill: colors[0] },
            React.createElement("animate", { attributeName: "fill-opacity", calcMode: "linear", values: "0;1;1", keyTimes: "0;0.2;1", dur: "1", begin: "0s", repeatCount: "indefinite" })),
        React.createElement("path", { d: "M28 47A28 28 0 0 1 56 75", fill: "none", "ng-attr-stroke": "{{config.c2}}", strokeWidth: "10", stroke: colors[1] },
            React.createElement("animate", { attributeName: "stroke-opacity", calcMode: "linear", values: "0;1;1", keyTimes: "0;0.2;1", dur: "1", begin: "0.1s", repeatCount: "indefinite" })),
        React.createElement("path", { d: "M28 25A50 50 0 0 1 78 75", fill: "none", "ng-attr-stroke": "{{config.c3}}", strokeWidth: "10", stroke: colors[2] },
            React.createElement("animate", { attributeName: "stroke-opacity", calcMode: "linear", values: "0;1;1", keyTimes: "0;0.2;1", dur: "1", begin: "0.2s", repeatCount: "indefinite" }))));
}
