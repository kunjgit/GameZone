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
var Bars = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.color, color = _d === void 0 ? type_1.DEFAULT_COLOR : _d, _e = _a.ariaLabel, ariaLabel = _e === void 0 ? 'bars-loading' : _e, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _f = _a.visible, visible = _f === void 0 ? true : _f;
    return (react_1.default.createElement("div", __assign({ style: __assign(__assign({}, (0, helpers_1.getDefaultStyle)(visible)), wrapperStyle), className: wrapperClass, "data-testid": "bars-loading", "aria-label": ariaLabel }, type_1.DEFAULT_WAI_ARIA_ATTRIBUTE),
        react_1.default.createElement("svg", { width: width, height: height, fill: color, viewBox: "0 0 135 140", xmlns: "http://www.w3.org/2000/svg", "data-testid": "bars-svg" },
            react_1.default.createElement("rect", { y: "10", width: "15", height: "120", rx: "6" },
                react_1.default.createElement("animate", { attributeName: "height", begin: "0.5s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                react_1.default.createElement("animate", { attributeName: "y", begin: "0.5s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("rect", { x: "30", y: "10", width: "15", height: "120", rx: "6" },
                react_1.default.createElement("animate", { attributeName: "height", begin: "0.25s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                react_1.default.createElement("animate", { attributeName: "y", begin: "0.25s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("rect", { x: "60", width: "15", height: "140", rx: "6" },
                react_1.default.createElement("animate", { attributeName: "height", begin: "0s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                react_1.default.createElement("animate", { attributeName: "y", begin: "0s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("rect", { x: "90", y: "10", width: "15", height: "120", rx: "6" },
                react_1.default.createElement("animate", { attributeName: "height", begin: "0.25s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                react_1.default.createElement("animate", { attributeName: "y", begin: "0.25s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })),
            react_1.default.createElement("rect", { x: "120", y: "10", width: "15", height: "120", rx: "6" },
                react_1.default.createElement("animate", { attributeName: "height", begin: "0.5s", dur: "1s", values: "120;110;100;90;80;70;60;50;40;140;120", calcMode: "linear", repeatCount: "indefinite" }),
                react_1.default.createElement("animate", { attributeName: "y", begin: "0.5s", dur: "1s", values: "10;15;20;25;30;35;40;45;50;0;10", calcMode: "linear", repeatCount: "indefinite" })))));
};
exports.default = Bars;
