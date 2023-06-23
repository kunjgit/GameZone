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
import React from 'react';
import { getDefaultStyle } from '../helpers';
import { DEFAULT_COLOR, DEFAULT_WAI_ARIA_ATTRIBUTE } from '../type';
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
    var _b = _a.height, height = _b === void 0 ? 80 : _b, _c = _a.width, width = _c === void 0 ? 80 : _c, _d = _a.color, color = _d === void 0 ? DEFAULT_COLOR : _d, _e = _a.secondaryColor, secondaryColor = _e === void 0 ? DEFAULT_COLOR : _e, _f = _a.ariaLabel, ariaLabel = _f === void 0 ? 'oval-loading' : _f, wrapperStyle = _a.wrapperStyle, wrapperClass = _a.wrapperClass, _g = _a.visible, visible = _g === void 0 ? true : _g, _h = _a.strokeWidth, strokeWidth = _h === void 0 ? 2 : _h, strokeWidthSecondary = _a.strokeWidthSecondary;
    return (React.createElement("div", __assign({ style: __assign(__assign(__assign({}, getDefaultStyle(visible)), wrapperStyle), { padding: 3 }), className: wrapperClass, "data-testid": "oval-loading", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE),
        React.createElement("svg", { width: width, height: height, viewBox: getViewBoxSize(Number(strokeWidth), Number(strokeWidthSecondary || strokeWidth), RADIUS), xmlns: "http://www.w3.org/2000/svg", stroke: color, "data-testid": "oval-svg" },
            React.createElement("g", { fill: "none", fillRule: "evenodd" },
                React.createElement("g", { transform: "translate(1 1)", strokeWidth: Number(strokeWidthSecondary || strokeWidth), "data-testid": "oval-secondary-group" },
                    React.createElement("circle", { strokeOpacity: ".5", cx: "0", cy: "0", r: RADIUS, stroke: secondaryColor, strokeWidth: strokeWidth }),
                    React.createElement("path", { d: getPath(RADIUS) },
                        React.createElement("animateTransform", { attributeName: "transform", type: "rotate", from: "0 0 0", to: "360 0 0", dur: "1s", repeatCount: "indefinite" })))))));
};
export default Oval;
