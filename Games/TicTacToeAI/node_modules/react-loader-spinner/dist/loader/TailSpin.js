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
exports.TailSpin = void 0;
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var type_1 = require("../type");
var TailSpin = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 1 : _d, _e = _a.color, color = _e === void 0 ? type_1.DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'tail-spin-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "data-testid": "tail-spin-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, viewBox: "0 0 38 38", xmlns: "http://www.w3.org/2000/svg", "data-testid": "tail-spin-svg" },
            react_1.default.createElement("defs", null,
                react_1.default.createElement("linearGradient", { x1: "8.042%", y1: "0%", x2: "65.682%", y2: "23.865%", id: "a" },
                    react_1.default.createElement("stop", { stopColor: color, stopOpacity: "0", offset: "0%" }),
                    react_1.default.createElement("stop", { stopColor: color, stopOpacity: ".631", offset: "63.146%" }),
                    react_1.default.createElement("stop", { stopColor: color, offset: "100%" }))),
            react_1.default.createElement("g", { fill: "none", fillRule: "evenodd" },
                react_1.default.createElement("g", { transform: "translate(1 1)" },
                    react_1.default.createElement("path", { d: "M36 18c0-9.94-8.06-18-18-18", id: "Oval-2", stroke: color, strokeWidth: "2" },
                        react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 18 18", to: "360 18 18", dur: "0.9s", repeatCount: "indefinite" })),
                    react_1.default.createElement("circle", { fill: "#fff", cx: "36", cy: "18", r: radius },
                        react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 18 18", to: "360 18 18", dur: "0.9s", repeatCount: "indefinite" })))))));
};
exports.TailSpin = TailSpin;
exports.default = exports.TailSpin;
