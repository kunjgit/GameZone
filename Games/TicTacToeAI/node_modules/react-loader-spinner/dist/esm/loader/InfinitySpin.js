var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { DEFAULT_COLOR } from '../type';
var len = 242.776657104492;
var time = 1.6;
var anim = keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  12.5% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n  43.75% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n  100% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n"], ["\n  12.5% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n  43.75% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n  100% {\n    stroke-dasharray: ", "px, ", "px;\n    stroke-dashoffset: -", "px;\n  }\n"])), len * 0.14, len, len * 0.11, len * 0.35, len, len * 0.35, len * 0.01, len, len * 0.99);
var Path = styled.path(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  stroke-dasharray: ", "px, ", ";\n  stroke-dashoffset: 0;\n  animation: ", " ", "s linear infinite;\n"], ["\n  stroke-dasharray: ", "px, ", ";\n  stroke-dashoffset: 0;\n  animation: ", " ", "s linear infinite;\n"])), len * 0.01, len, anim, time);
var InfinitySpin = function (_a) {
    var _b = _a.color, color = _b === void 0 ? DEFAULT_COLOR : _b, _c = _a.width, width = _c === void 0 ? '200' : _c;
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "".concat(width), height: "".concat(Number(width) * 0.5), viewBox: "0 0 ".concat(width, " ").concat(Number(200 * 0.5)), "data-testid": "infinity-spin" },
        React.createElement(Path, { "data-testid": "infinity-spin-path-1", stroke: color, fill: "none", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", d: "M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" }),
        React.createElement("path", { "data-testid": "infinity-spin-path-2", opacity: "0.07", fill: "none", stroke: color, strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round", strokeMiterlimit: "10", d: "M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" })));
};
export default InfinitySpin;
var templateObject_1, templateObject_2;
