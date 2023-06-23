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
var Bars = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.color, color = _d === void 0 ? DEFAULT_COLOR : _d, _e = _a.ariaLabel, ariaLabel = _e === void 0 ? 'bars-loading' : _e, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _f = _a.visible, visible = _f === void 0 ? true : _f;
    return (React.createElement("div", __assign({ style: __assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), className: wrapperClass, "data-testid": "bars-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { width: width, height: height, fill: color, viewBox: "0 0 135 140", xmlns: "http://www.w3.org/2000/svg", "data-testid": "bars-svg" },
            React.createElement("rect", { y: "10", width: "15", height: "120", rx: "6" },
                React.createElement("animate", { attributeName: "height", begin: "0.5s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", begin: "0.5s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "30", y: "10", width: "15", height: "120", rx: "6" },
                React.createElement("animate", { attributeName: "height", begin: "0.25s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", begin: "0.25s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "60", width: "15", height: "140", rx: "6" },
                React.createElement("animate", { attributeName: "height", begin: "0s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", begin: "0s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "90", y: "10", width: "15", height: "120", rx: "6" },
                React.createElement("animate", { attributeName: "height", begin: "0.25s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", begin: "0.25s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            React.createElement("rect", { x: "120", y: "10", width: "15", height: "120", rx: "6" },
                React.createElement("animate", { attributeName: "height", begin: "0.5s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                React.createElement("animate", { attributeName: "y", begin: "0.5s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })))));
};
export default Bars;
