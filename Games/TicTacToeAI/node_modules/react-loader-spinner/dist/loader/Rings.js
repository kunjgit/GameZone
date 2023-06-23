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
exports.Rings = void 0;
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var type_1 = require("../type");
var Rings = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 6 : _d, _e = _a.color, color = _e === void 0 ? type_1.DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'rings-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "data-testid": "rings-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, viewBox: "0 0 45 45", xmlns: "http://www.w3.org/2000/svg", stroke: color, "data-testid": "rings-svg" },
            react_1.default.createElement("g", { fill: "none", fillRule: "evenodd", transform: "translate(1 1)", strokeWidth: "2" },
                react_1.default.createElement("circle", { cx: "22", cy: "22", r: radius, strokeOpacity: "0" },
                    react_1.default.createElement("animate", { attributeName: "r", begin: "1.5s", dur: "3s", values: "6;22", calcMode: "linear", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "stroke-opacity", begin: "1.5s", dur: "3s", values: "1;0", calcMode: "linear", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "stroke-width", begin: "1.5s", dur: "3s", values: "2;0", calcMode: "linear", repeatCount: "indefinite" })),
                react_1.default.createElement("circle", { cx: "22", cy: "22", r: radius, strokeOpacity: "0" },
                    react_1.default.createElement("animate", { attributeName: "r", begin: "3s", dur: "3s", values: "6;22", calcMode: "linear", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "strokeOpacity", begin: "3s", dur: "3s", values: "1;0", calcMode: "linear", repeatCount: "indefinite" }),
                    react_1.default.createElement("animate", { attributeName: "strokeWidth", begin: "3s", dur: "3s", values: "2;0", calcMode: "linear", repeatCount: "indefinite" })),
                react_1.default.createElement("circle", { cx: "22", cy: "22", r: Number(radius) + 2 },
                    react_1.default.createElement("animate", { attributeName: "r", begin: "0s", dur: "1.5s", values: "6;1;2;3;4;5;6", calcMode: "linear", repeatCount: "indefinite" }))))));
};
exports.Rings = Rings;
exports.default = exports.Rings;
