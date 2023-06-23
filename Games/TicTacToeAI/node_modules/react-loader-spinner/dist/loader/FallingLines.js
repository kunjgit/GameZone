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
var FallingLines = function (_a) {
    var _b = _a.color, color = _b === void 0 ? type_1.DEFAULT_COLOR : _b, _c = _a.width, width = _c === void 0 ? '100' : _c, _d = _a.visible, visible = _d === void 0 ? true : _d;
    return visible ? (react_1.default.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: width, height: width, viewBox: "0 0 100 100", "data-testid": "falling-lines" }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("rect", { y: "25", width: "10", height: "50", rx: "4", ry: "4", fill: color, "data-testid": "falling-lines-rect-1" },
            react_1.default.createElement("animate", { attributeName: "x", values: "10;100", dur: "1.2s", repeatCount: "indefinite" }),
            react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 10 70", to: "-60 100 70", dur: "1.2s", repeatCount: "indefinite" }),
            react_1.default.createElement("animate", { attributeName: "opacity", values: "0;1;0", dur: "1.2s", repeatCount: "indefinite" })),
        react_1.default.createElement("rect", { y: "25", width: "10", height: "50", rx: "4", ry: "4", fill: color },
            react_1.default.createElement("animate", { attributeName: "x", values: "10;100", dur: "1.2s", begin: "0.4s", repeatCount: "indefinite" }),
            react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 10 70", to: "-60 100 70", dur: "1.2s", begin: "0.4s", repeatCount: "indefinite" }),
            react_1.default.createElement("animate", { attributeName: "opacity", values: "0;1;0", dur: "1.2s", begin: "0.4s", repeatCount: "indefinite" })),
        react_1.default.createElement("rect", { y: "25", width: "10", height: "50", rx: "4", ry: "4", fill: color, "data-testid": "falling-lines-rect-2" },
            react_1.default.createElement("animate", { attributeName: "x", values: "10;100", dur: "1.2s", begin: "0.8s", repeatCount: "indefinite" }),
            react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 10 70", to: "-60 100 70", dur: "1.2s", begin: "0.8s", repeatCount: "indefinite" }),
            react_1.default.createElement("animate", { attributeName: "opacity", values: "0;1;0", dur: "1.2s", begin: "0.8s", repeatCount: "indefinite" })))) : null;
};
exports.default = FallingLines;
