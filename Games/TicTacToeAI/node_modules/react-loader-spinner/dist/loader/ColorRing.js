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
function ColorRing(_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.width, width = _c === void 0 ? '80' : _c, _d = _a.height, height = _d === void 0 ? '80' : _d, _e = _a.colors, colors = _e === void 0 ? ['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87'] : _e, _f = _a.wrapperClass, wrapperClass = _f === void 0 ? '' : _f, _g = _a.wrapperStyle, wrapperStyle = _g === void 0 ? {} : _g, _h = _a.ariaLabel, ariaLabel = _h === void 0 ? 'color-ring-loading' : _h;
    return !visible ? null : (react_1.default.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", width: width, height: height, viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", className: wrapperClass, style: wrapperStyle, "aria-label": ariaLabel, "data-testid": "color-ring-svg" }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("defs", null,
            react_1.default.createElement("mask", { id: "ldio-4offds5dlws-mask" },
                react_1.default.createElement("circle", { cx: "50", cy: "50", r: "26", stroke: "#fff", strokeLinecap: "round", strokeDasharray: "122.52211349000194 40.840704496667314", strokeWidth: "9", transform: "rotate(198.018 50 50)" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", values: "0 50 50;360 50 50", keyTimes: "0;1", dur: "1s", repeatCount: "indefinite" })))),
        react_1.default.createElement("g", { mask: "url(#ldio-4offds5dlws-mask)" },
            react_1.default.createElement("rect", { x: "14.5", y: "0", width: "15", height: "100", fill: colors[0] },
                react_1.default.createElement("animate", { attributeName: "fill", values: colors.join(';').toString(), keyTimes: "0;0.25;0.5;0.75;1", dur: "1s", repeatCount: "indefinite", begin: "-0.8s" })),
            react_1.default.createElement("rect", { x: "28.5", y: "0", width: "15", height: "100", fill: colors[1] },
                react_1.default.createElement("animate", { attributeName: "fill", values: colors.join(';').toString(), keyTimes: "0;0.25;0.5;0.75;1", dur: "1s", repeatCount: "indefinite", begin: "-0.6s" })),
            react_1.default.createElement("rect", { x: "42.5", y: "0", width: "15", height: "100", fill: colors[2] },
                react_1.default.createElement("animate", { attributeName: "fill", values: colors.join(';').toString(), keyTimes: "0;0.25;0.5;0.75;1", dur: "1s", repeatCount: "indefinite", begin: "-0.4s" })),
            react_1.default.createElement("rect", { x: "56.5", y: "0", width: "15", height: "100", fill: colors[3] },
                react_1.default.createElement("animate", { attributeName: "fill", values: colors.join(';').toString(), keyTimes: "0;0.25;0.5;0.75;1", dur: "1s", repeatCount: "indefinite", begin: "-0.2s" })),
            react_1.default.createElement("rect", { x: "70.5", y: "0", width: "15", height: "100", fill: colors[4] },
                react_1.default.createElement("animate", { attributeName: "fill", values: colors.join(';').toString(), keyTimes: "0;0.25;0.5;0.75;1", dur: "1s", repeatCount: "indefinite", begin: "0s" })))));
}
exports.default = ColorRing;
