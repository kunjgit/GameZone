var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { prop } from 'styled-tools';
import { DEFAULT_COLOR, DEFAULT_WAI_ARIA_ATTRIBUTE } from '../type';
var spin = keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n to {\n    transform: rotate(360deg);\n  }\n"], ["\n to {\n    transform: rotate(360deg);\n  }\n"])));
var POINTS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
var Svg = styled.svg(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  animation: ", " 0.75s steps(12, end) infinite;\n  animation-duration: ", "s;\n"], ["\n  animation: ", " 0.75s steps(12, end) infinite;\n  animation-duration: ", "s;\n"])), spin, prop('speed', '0.75'));
var Polyline = styled.polyline(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  stroke-width: ", "px;\n  stroke-linecap: round;\n\n  &:nth-child(12n + 0) {\n    stroke-opacity: 0.08;\n  }\n\n  &:nth-child(12n + 1) {\n    stroke-opacity: 0.17;\n  }\n\n  &:nth-child(12n + 2) {\n    stroke-opacity: 0.25;\n  }\n\n  &:nth-child(12n + 3) {\n    stroke-opacity: 0.33;\n  }\n\n  &:nth-child(12n + 4) {\n    stroke-opacity: 0.42;\n  }\n\n  &:nth-child(12n + 5) {\n    stroke-opacity: 0.5;\n  }\n\n  &:nth-child(12n + 6) {\n    stroke-opacity: 0.58;\n  }\n\n  &:nth-child(12n + 7) {\n    stroke-opacity: 0.66;\n  }\n\n  &:nth-child(12n + 8) {\n    stroke-opacity: 0.75;\n  }\n\n  &:nth-child(12n + 9) {\n    stroke-opacity: 0.83;\n  }\n\n  &:nth-child(12n + 11) {\n    stroke-opacity: 0.92;\n  }\n"], ["\n  stroke-width: ", "px;\n  stroke-linecap: round;\n\n  &:nth-child(12n + 0) {\n    stroke-opacity: 0.08;\n  }\n\n  &:nth-child(12n + 1) {\n    stroke-opacity: 0.17;\n  }\n\n  &:nth-child(12n + 2) {\n    stroke-opacity: 0.25;\n  }\n\n  &:nth-child(12n + 3) {\n    stroke-opacity: 0.33;\n  }\n\n  &:nth-child(12n + 4) {\n    stroke-opacity: 0.42;\n  }\n\n  &:nth-child(12n + 5) {\n    stroke-opacity: 0.5;\n  }\n\n  &:nth-child(12n + 6) {\n    stroke-opacity: 0.58;\n  }\n\n  &:nth-child(12n + 7) {\n    stroke-opacity: 0.66;\n  }\n\n  &:nth-child(12n + 8) {\n    stroke-opacity: 0.75;\n  }\n\n  &:nth-child(12n + 9) {\n    stroke-opacity: 0.83;\n  }\n\n  &:nth-child(12n + 11) {\n    stroke-opacity: 0.92;\n  }\n"])), function (props) { return props.width; });
export default function RotatingLines(_a) {
    var _b = _a.strokeColor, strokeColor = _b === void 0 ? DEFAULT_COLOR : _b, _c = _a.strokeWidth, strokeWidth = _c === void 0 ? '5' : _c, _d = _a.animationDuration, animationDuration = _d === void 0 ? '0.75' : _d, _e = _a.width, width = _e === void 0 ? '96' : _e, _f = _a.visible, visible = _f === void 0 ? true : _f, _g = _a.ariaLabel, ariaLabel = _g === void 0 ? 'rotating-lines-loading' : _g;
    var lines = useCallback(function () {
        return POINTS.map(function (point) { return (React.createElement(Polyline, { key: point, points: "24,12 24,4", width: strokeWidth, transform: "rotate(".concat(point, ", 24, 24)") })); });
    }, [strokeWidth]);
    return !visible ? null : (React.createElement(Svg, __assign({ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 48 48", width: width, stroke: strokeColor, speed: animationDuration, "data-testid": "rotating-lines-svg", "aria-label": ariaLabel }, DEFAULT_WAI_ARIA_ATTRIBUTE), lines()));
}
var templateObject_1, templateObject_2, templateObject_3;
