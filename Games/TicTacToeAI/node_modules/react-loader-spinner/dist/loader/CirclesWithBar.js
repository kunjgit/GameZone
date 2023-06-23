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
var helpers_1 = require("../helpers");
var type_1 = require("../type");
var CirclesWithBar = function (_a) {
    var _b = _a.wrapperStyle, wrapperStyle = _b === void 0 ? {} : _b, _c = _a.visible, visible = _c === void 0 ? true : _c, _d = _a.wrapperClass, wrapperClass = _d === void 0 ? '' : _d, _e = _a.height, height = _e === void 0 ? 100 : _e, _f = _a.width, width = _f === void 0 ? 100 : _f, _g = _a.color, color = _g === void 0 ? type_1.DEFAULT_COLOR : _g, outerCircleColor = _a.outerCircleColor, innerCircleColor = _a.innerCircleColor, barColor = _a.barColor, _h = _a.ariaLabel, ariaLabel = _h === void 0 ? 'circles-with-bar-loading' : _h;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE, { "data-testid": "circles-with-bar-wrapper" }),
        react_1.default.createElement("svg", { version: "1.1", id: "L1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", height: "".concat(height), width: "".concat(width), viewBox: "0 0 100 100", enableBackground: "new 0 0 100 100", xmlSpace: "preserve", "data-testid": "circles-with-bar-svg" },
            react_1.default.createElement("circle", { fill: "none", stroke: "".concat(outerCircleColor || color), strokeWidth: "6", strokeMiterlimit: "15", strokeDasharray: "14.2472,14.2472", cx: "50", cy: "50", r: "47" },
                react_1.default.createElement("animateTransform", { attributeName: "transform", attributeType: "XML", type: "rotate", dur: "5s", from: "0 50 50", to: "360 50 50", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { fill: "none", stroke: "".concat(innerCircleColor || color), strokeWidth: "1", strokeMiterlimit: "10", strokeDasharray: "10,10", cx: "50", cy: "50", r: "39" },
                react_1.default.createElement("animateTransform", { attributeName: "transform", attributeType: "XML", type: "rotate", dur: "5s", from: "0 50 50", to: "-360 50 50", repeatCount: "indefinite" })),
            react_1.default.createElement("g", { fill: "".concat(barColor || color), "data-testid": "circles-with-bar-svg-bar" },
                react_1.default.createElement("rect", { x: "30", y: "35", width: "5", height: "30" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", dur: "1s", type: "translate", values: "0 5 ; 0 -5; 0 5", repeatCount: "indefinite", begin: "0.1" })),
                react_1.default.createElement("rect", { x: "40", y: "35", width: "5", height: "30" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", dur: "1s", type: "translate", values: "0 5 ; 0 -5; 0 5", repeatCount: "indefinite", begin: "0.2" })),
                react_1.default.createElement("rect", { x: "50", y: "35", width: "5", height: "30" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", dur: "1s", type: "translate", values: "0 5 ; 0 -5; 0 5", repeatCount: "indefinite", begin: "0.3" })),
                react_1.default.createElement("rect", { x: "60", y: "35", width: "5", height: "30" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", dur: "1s", type: "translate", values: "0 5 ; 0 -5; 0 5", repeatCount: "indefinite", begin: "0.4" })),
                react_1.default.createElement("rect", { x: "70", y: "35", width: "5", height: "30" },
                    react_1.default.createElement("animateTransform", { attributeName: "transform", dur: "1s", type: "translate", values: "0 5 ; 0 -5; 0 5", repeatCount: "indefinite", begin: "0.5" }))))));
};
exports.default = CirclesWithBar;
