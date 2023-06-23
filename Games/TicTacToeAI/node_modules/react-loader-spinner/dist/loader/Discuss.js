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
function Discuss(_a) {
    var _b = _a.visible, visible = _b === void 0 ? true : _b, _c = _a.width, width = _c === void 0 ? '80' : _c, _d = _a.height, height = _d === void 0 ? '80' : _d, _e = _a.wrapperClass, wrapperClass = _e === void 0 ? '' : _e, _f = _a.wrapperStyle, wrapperStyle = _f === void 0 ? {} : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'discuss-loading' : _g, _h = _a.colors, colors = _h === void 0 ? ['#ff727d', '#ff727d'] : _h;
    return !visible ? null : (react_1.default.createElement("svg", __assign({ width: width, height: height, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid", className: wrapperClass, style: wrapperStyle, "aria-label": ariaLabel, "data-testid": 'discuss-svg' }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("path", { "ng-attr-d": "{{config.d}}", "ng-attr-stroke-width": "{{config.width}}", "ng-attr-stroke": "{{config.stroke}}", fill: "none", d: "M82 50A32 32 0 1 1 23.533421623214014 32.01333190873183 L21.71572875253809 21.7157287525381 L32.013331908731814 23.53342162321403 A32 32 0 0 1 82 50", strokeWidth: "5", stroke: colors[0] }),
        react_1.default.createElement("circle", { cx: "50", cy: "50", "ng-attr-r": "{{config.radius2}}", "ng-attr-stroke-width": "{{config.width}}", "ng-attr-stroke": "{{config.stroke}}", "ng-attr-stroke-dasharray": "{{config.dasharray}}", fill: "none", strokeLinecap: "round", r: "20", strokeWidth: "5", stroke: colors[1], strokeDasharray: "31.41592653589793 31.41592653589793", transform: "rotate(96 50 50)" },
            react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "linear", values: "0 50 50;360 50 50", keyTimes: "0;1", dur: "1s", begin: "0s", repeatCount: "indefinite" }))));
}
exports.default = Discuss;
