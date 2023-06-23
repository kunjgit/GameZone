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
exports.Puff = void 0;
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var type_1 = require("../type");
var Puff = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 1 : _d, _e = _a.color, color = _e === void 0 ? type_1.DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'puff-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "data-testid": "puff-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, viewBox: "0 0 44 44", xmlns: "http://www.w3.org/2000/svg", stroke: color, "data-testid": "puff-svg" },
            react_1.default.createElement("g", { fill: "none", fillRule: "evenodd", strokeWidth: "2" },
                react_1.default.createElement("circle", { cx: "22", cy: "22", r: radius },
                    react_1.default.createElement("animate", { attributeName: "r", begin: "0s", dur: "1.8s", values: "1; 20", calcMode: "spline", keyTimes: "0; 1", keySplines: "0.165, 0.84, 0.44, 1", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "strokeOpacity", begin: "0s", dur: "1.8s", values: "1; 0", calcMode: "spline", keyTimes: "0; 1", keySplines: "0.3, 0.61, 0.355, 1", repeatCount: "indefinite" })),
                react_1.default.createElement("circle", { cx: "22", cy: "22", r: radius },
                    react_1.default.createElement("animate", { attributeName: "r", begin: "-0.9s", dur: "1.8s", values: "1; 20", calcMode: "spline", keyTimes: "0; 1", keySplines: "0.165, 0.84, 0.44, 1", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "strokeOpacity", begin: "-0.9s", dur: "1.8s", values: "1; 0", calcMode: "spline", keyTimes: "0; 1", keySplines: "0.3, 0.61, 0.355, 1", repeatCount: "indefinite" }))))));
};
exports.Puff = Puff;
exports.default = exports.Puff;
