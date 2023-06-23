"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var type_1 = require("../type");
function ProgressBar(_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.height, height = _c === void 0 ? '80' : _c, _d = _a.width, width = _d === void 0 ? '80' : _d, _e = _a.wrapperClass, wrapperClass = _e === void 0 ? '' : _e, _f = _a.wrapperStyle, wrapperStyle = _f === void 0 ? {} : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'progress-bar-loading' : _g, _h = _a.borderColor, borderColor = _h === void 0 ? '#F4442E' : _h, _j = _a.barColor, barColor = _j === void 0 ? '#51E5FF' : _j;
    return !visible ? null : (react_1.default.createElement("svg", __assign({ width: width, height: height, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", className: wrapperClass, style: wrapperStyle, "aria-label": ariaLabel, "data-testid": 'progress-bar-svg' }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("defs", null,
            react_1.default.createElement("clipPath", { "ng-attr-id": "{{config.cpid}}", x: "0", y: "0", width: "100", height: "100", id: "lds-progress-cpid-5009611b8a418" },
                react_1.default.createElement("rect", { x: "0", y: "0", width: "66.6667", height: "100" },
                    react_1.default.createElement("animate", { attributeName: "width", calcMode: "linear", values: "0;100;100", keyTimes: "0;0.5;1", dur: "1", begin: "0s", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "x", calcMode: "linear", values: "0;0;100", keyTimes: "0;0.5;1", dur: "1", begin: "0s", repeatCount: "indefinite" })))),
        react_1.default.createElement("path", { fill: "none", "ng-attr-stroke": "{{config.c1}}", strokeWidth: "2.7928", d: "M82,63H18c-7.2,0-13-5.8-13-13v0c0-7.2,5.8-13,13-13h64c7.2,0,13,5.8,13,13v0C95,57.2,89.2,63,82,63z", stroke: borderColor }),
        react_1.default.createElement("path", { "ng-attr-fill": "{{config.c2}}", "ng-attr-clip-path": "url(#{{config.cpid}})", d: "M81.3,58.7H18.7c-4.8,0-8.7-3.9-8.7-8.7v0c0-4.8,3.9-8.7,8.7-8.7h62.7c4.8,0,8.7,3.9,8.7,8.7v0C90,54.8,86.1,58.7,81.3,58.7z", fill: barColor, clipPath: "url(#lds-progress-cpid-5009611b8a418)" })));
}
exports.default = ProgressBar;
