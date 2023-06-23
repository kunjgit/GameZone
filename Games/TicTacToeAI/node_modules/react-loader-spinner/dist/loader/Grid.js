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
exports.Grid = void 0;
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var type_1 = require("../type");
var Grid = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.radius, radius = _d === void 0 ? 12.5 : _d, _e = _a.color, color = _e === void 0 ? type_1.DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'grid-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "data-testid": "grid-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, viewBox: "0 0 105 105", fill: color, "data-testid": "grid-svg" },
            react_1.default.createElement("circle", { cx: "12.5", cy: "12.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "0s", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "12.5", cy: "52.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "100ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "52.5", cy: "12.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "300ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "52.5", cy: "52.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "600ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "92.5", cy: "12.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "800ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "92.5", cy: "52.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "400ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "12.5", cy: "92.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "700ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "52.5", cy: "92.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "500ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("circle", { cx: "92.5", cy: "92.5", r: "".concat(radius) },
                react_1.default.createElement("animate", { attributeName: "fill-opacity", begin: "200ms", dur: "1s", values: "1;.2;1", calcMode: "linear", repeatCount: "indefinite" })))));
};
exports.Grid = Grid;
exports.default = exports.Grid;
