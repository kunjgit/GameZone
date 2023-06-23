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
var RADIUS = 20;
var getPath = function (radius) {
    return ['M' + radius + ' 0c0-9.94-8.06', radius, radius, radius].join('-');
};
var getViewBoxSize = function (strokeWidth, secondaryStrokeWidth, radius) {
    var maxStrokeWidth = Math.max(strokeWidth, secondaryStrokeWidth);
    var startingPoint = -radius - maxStrokeWidth / 2 + 1;
    var endpoint = radius * 2 + maxStrokeWidth;
    return [startingPoint, startingPoint, endpoint, endpoint].join(' ');
};
var Oval = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.color, color = _d === void 0 ? type_1.DEFAULT_COLOR : _d, _e = _a.secondaryColor, secondaryColor = _e === void 0 ? type_1.DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'oval-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g, _h = _a.strokeWidth, strokeWidth = _h === void 0 ? 2 : _h, strokeWidthSecondary = _a.strokeWidthSecondary;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), { padding: 3 }), className: wrapperClass, "data-testid": "oval-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, viewBox: getViewBoxSize(Number(strokeWidth), Number(strokeWidthSecondary || strokeWidth), RADIUS), xmlns: "http://www.w3.org/2000/svg", stroke: color, "data-testid": "oval-svg" },
            react_1.default.createElement("g", { fill: "none", fillRule: "evenodd" },
                react_1.default.createElement("g", { transform: "translate(1 1)", strokeWidth: Number(strokeWidthSecondary || strokeWidth), "data-testid": "oval-secondary-group" },
                    react_1.default.createElement("circle", { strokeOpacity: ".5", cx: "0", cy: "0", r: RADIUS, stroke: secondaryColor, strokeWidth: strokeWidth }),
                    react_1.default.createElement("path", { d: getPath(RADIUS) },
                        react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 0 0", to: "360 0 0", dur: "1s", repeatCount: "indefinite" })))))));
};
exports.default = Oval;
