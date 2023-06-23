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
var BallTriangle = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 100 : _b, _c = _a.width, width = _c === void 0 ? 100 : _c, _d = _a.radius, radius = _d === void 0 ? 5 : _d, _e = _a.color, color = _e === void 0 ? DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'ball-triangle-loading' : _f, wrapperClass = _a.wrapperClass, wrapperStyle = _a.wrapperStyle, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "ball-triangle-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { height: height, width: width, stroke: color, viewBox: "0 0 57 57", xmlns: "http://www.w3.org/2000/svg", "data-testid": "ball-triangle-svg" },
            React.createElement("g", { fill: "none", fillRule: "evenodd" },
                React.createElement("g", { transform: "translate(1 1)", strokeWidth: "2" },
                    React.createElement("circle", { cx: "5", cy: "50", r: radius },
                        React.createElement("animate", { attributeName: "cy", begin: "0s", dur: "2.2s", values: "50;5;50;50", calcMode: "linear", repeatCount: "indefinite" }),
                        React.createElement("animate", { attributeName: "cx", begin: "0s", dur: "2.2s", values: "5;27;49;5", calcMode: "linear", repeatCount: "indefinite" })),
                    React.createElement("circle", { cx: "27", cy: "5", r: radius },
                        React.createElement("animate", { attributeName: "cy", begin: "0s", dur: "2.2s", from: "5", to: "5", values: "5;50;50;5", calcMode: "linear", repeatCount: "indefinite" }),
                        React.createElement("animate", { attributeName: "cx", begin: "0s", dur: "2.2s", from: "27", to: "27", values: "27;49;5;27", calcMode: "linear", repeatCount: "indefinite" })),
                    React.createElement("circle", { cx: "49", cy: "50", r: radius },
                        React.createElement("animate", { attributeName: "cy", begin: "0s", dur: "2.2s", values: "50;50;5;50", calcMode: "linear", repeatCount: "indefinite" }),
                        React.createElement("animate", { attributeName: "cx", from: "49", to: "49", begin: "0s", dur: "2.2s", values: "49;5;27;49", calcMode: "linear", repeatCount: "indefinite" })))))));
};
export default BallTriangle;
