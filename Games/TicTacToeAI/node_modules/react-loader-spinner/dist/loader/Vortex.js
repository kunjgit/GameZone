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
var Vortex = function (_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.height, height = _c === void 0 ? '80' : _c, _d = _a.width, width = _d === void 0 ? '80' : _d, _e = _a.ariaLabel, ariaLabel = _e === void 0 ? 'vortex-loading' : _e, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _f = _a.colors, colors = _f === void 0 ? ['#1B5299', '#EF8354', '#DB5461', '#1B5299', '#EF8354', '#DB5461'] : _f;
    return !visible ? null : (react_1.default.createElement("svg", __assign({ height: height, width: width, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", "data-testid": "vortex-svg", "aria-label": ariaLabel, style: wrapperStyle, className: wrapperClass }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("g", { transform: "translate(50,50)" },
            react_1.default.createElement("g", { transform: "scale(0.7)" },
                react_1.default.createElement("g", { transform: "translate(-50,-50)" },
                    react_1.default.createElement("g", { transform: "rotate(137.831 50 50)" },
                        react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", repeatCount: "indefinite", values: "360 50 50;0 50 50", keyTimes: "0;1", dur: "1", keySplines: "0.5 0.5 0.5 0.5", calcMode: "spline" }),
                        react_1.default.createElement("path", { fill: colors[0], d: "M30.4,9.7c-7.4,10.9-11.8,23.8-12.3,37.9c0.2,1,0.5,1.9,0.7,2.8c1.4-5.2,3.4-10.3,6.2-15.1 c2.6-4.4,5.6-8.4,9-12c0.7-0.7,1.4-1.4,2.1-2.1c7.4-7,16.4-12,26-14.6C51.5,3.6,40.2,4.9,30.4,9.7z" }),
                        react_1.default.createElement("path", { fill: colors[1], d: "M24.8,64.2c-2.6-4.4-4.5-9.1-5.9-13.8c-0.3-0.9-0.5-1.9-0.7-2.8c-2.4-9.9-2.2-20.2,0.4-29.8 C10.6,25.5,6,36,5.3,46.8C11,58.6,20,68.9,31.9,76.3c0.9,0.3,1.9,0.5,2.8,0.8C31,73.3,27.6,69,24.8,64.2z" }),
                        react_1.default.createElement("path", { fill: colors[2], d: "M49.6,78.9c-5.1,0-10.1-0.6-14.9-1.8c-1-0.2-1.9-0.5-2.8-0.8c-9.8-2.9-18.5-8.2-25.6-15.2 c2.8,10.8,9.5,20,18.5,26c13.1,0.9,26.6-1.7,38.9-8.3c0.7-0.7,1.4-1.4,2.1-2.1C60.7,78.2,55.3,78.9,49.6,78.9z" }),
                        react_1.default.createElement("path", { fill: colors[3], d: "M81.1,49.6c-1.4,5.2-3.4,10.3-6.2,15.1c-2.6,4.4-5.6,8.4-9,12c-0.7,0.7-1.4,1.4-2.1,2.1 c-7.4,7-16.4,12-26,14.6c10.7,3,22.1,1.7,31.8-3.1c7.4-10.9,11.8-23.8,12.3-37.9C81.6,51.5,81.4,50.6,81.1,49.6z" }),
                        react_1.default.createElement("path", { fill: colors[4], d: "M75.2,12.9c-13.1-0.9-26.6,1.7-38.9,8.3c-0.7,0.7-1.4,1.4-2.1,2.1c5.2-1.4,10.6-2.2,16.2-2.2 c5.1,0,10.1,0.6,14.9,1.8c1,0.2,1.9,0.5,2.8,0.8c9.8,2.9,18.5,8.2,25.6,15.2C90.9,28.1,84.2,18.9,75.2,12.9z" }),
                        react_1.default.createElement("path", { fill: colors[5], d: "M94.7,53.2C89,41.4,80,31.1,68.1,23.7c-0.9-0.3-1.9-0.5-2.8-0.8c3.8,3.8,7.2,8.1,10,13 c2.6,4.4,4.5,9.1,5.9,13.8c0.3,0.9,0.5,1.9,0.7,2.8c2.4,9.9,2.2,20.2-0.4,29.8C89.4,74.5,94,64,94.7,53.2z" })))))));
};
exports.default = Vortex;
