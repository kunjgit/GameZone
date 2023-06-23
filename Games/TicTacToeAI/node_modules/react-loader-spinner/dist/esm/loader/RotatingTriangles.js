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
import { DEFAULT_WAI_ARIA_ATTRIBUTE } from '../type';
export default function RotatingTriangles(_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.height, height = _c === void 0 ? '80' : _c, _d = _a.width, width = _d === void 0 ? '80' : _d, _e = _a.wrapperClass, wrapperClass = _e === void 0 ? '' : _e, _f = _a.wrapperStyle, wrapperStyle = _f === void 0 ? {} : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'rotating-triangle-loading' : _g, _h = _a.colors, colors = _h === void 0 ? ['#1B5299', '#EF8354', '#DB5461'] : _h;
    return !visible ? null : (React.createElement("svg", __assign({ width: width, height: height, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", className: wrapperClass, style: wrapperStyle, "aria-label": ariaLabel, "data-testid": 'rotating-triangle-svg' }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("g", { transform: "translate(50,42)" },
            React.createElement("g", { transform: "scale(0.8)" },
                React.createElement("g", { transform: "translate(-50,-50)" },
                    React.createElement("polygon", { "ng-attr-fill": "{{config.c1}}", points: "72.5,50 50,11 27.5,50 50,50", fill: colors[0], transform: "rotate(186 50 38.5)" },
                        React.createElement("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "linear", values: "0 50 38.5;360 50 38.5", keyTimes: "0;1", dur: "1s", begin: "0s", repeatCount: "indefinite" })),
                    React.createElement("polygon", { "ng-attr-fill": "{{config.c2}}", points: "5,89 50,89 27.5,50", fill: colors[1], transform: "rotate(186 27.5 77.5)" },
                        React.createElement("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "linear", values: "0 27.5 77.5;360 27.5 77.5", keyTimes: "0;1", dur: "1s", begin: "0s", repeatCount: "indefinite" })),
                    React.createElement("polygon", { "ng-attr-fill": "{{config.c3}}", points: "72.5,50 50,89 95,89", fill: colors[2], transform: "rotate(186 72.2417 77.5)" },
                        React.createElement("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "linear", values: "0 72.5 77.5;360 72 77.5", keyTimes: "0;1", dur: "1s", begin: "0s", repeatCount: "indefinite" })))))));
}
