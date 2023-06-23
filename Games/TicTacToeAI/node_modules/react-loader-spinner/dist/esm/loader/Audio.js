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
var Audio = function (_a) {
    var _b = _a.height, height = _b === void 0 ? '100' : _b, _c = _a.width, width = _c === void 0 ? '100' : _c, _d = _a.color, color = _d === void 0 ? DEFAULT_COLOR : _d, _e = _a.ariaLabel, ariaLabel = _e === void 0 ? 'audio-loading' : _e, _f = _a.wrapperStyle, wrapperStyle = _f === void 0 ? {} : _f, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "audio-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { height: "".concat(height), width: "".concat(width), fill: color, viewBox: "0 0 55 80", xmlns: "http://www.w3.org/2000/svg", "data-testid": "audio-svg" },
            React.createElement("g", { transform: "matrix(1 0 0 -1 0 80)" },
                React.createElement("rect", { width: "10", height: "20", rx: "3" },
                    React.createElement("animate", { attributeName: "height", begin: "0s", dur: "4.3s", values: "20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20", calcMode: "linear", repeatCount: "indefinite" })),
                React.createElement("rect", { x: "15", width: "10", height: "80", rx: "3" },
                    React.createElement("animate", { attributeName: "height", begin: "0s", dur: "2s", values: "80;55;33;5;75;23;73;33;12;14;60;80", calcMode: "linear", repeatCount: "indefinite" })),
                React.createElement("rect", { x: "30", width: "10", height: "50", rx: "3" },
                    React.createElement("animate", { attributeName: "height", begin: "0s", dur: "1.4s", values: "50;34;78;23;56;23;34;76;80;54;21;50", calcMode: "linear", repeatCount: "indefinite" })),
                React.createElement("rect", { x: "45", width: "10", height: "30", rx: "3" },
                    React.createElement("animate", { attributeName: "height", begin: "0s", dur: "2s", values: "30;45;13;80;56;72;45;76;34;23;67;30", calcMode: "linear", repeatCount: "indefinite" }))))));
};
export default Audio;
