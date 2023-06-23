"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ifProp = _interopRequireDefault(require("./ifProp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns `pass` if prop is falsy. Otherwise returns `fail`
 * @example
 * import styled from "styled-components";
 * import { ifNotProp } from "styled-tools";
 *
 * const Button = styled.button`
 *   font-size: ${ifNotProp("large", "20px", "30px")};
 * `;
 */
var ifNotProp = function ifNotProp(test, pass, fail) {
  return (0, _ifProp.default)(test, fail, pass);
};

var _default = ifNotProp;
exports.default = _default;