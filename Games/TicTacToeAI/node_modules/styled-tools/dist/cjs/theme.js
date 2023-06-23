"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prop = _interopRequireDefault(require("./prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Same as `prop`, except that it returns `props.theme[path]` instead of
 * `props[path]`.
 * @example
 * import styled from "styled-components";
 * import { theme } from "styled-tools";
 *
 * const Button = styled.button`
 *  color: ${theme("button.color", "red")};
 * `;
 */
var theme = function theme(path, defaultValue) {
  return function (props) {
    return (0, _prop.default)(path, defaultValue)(props.theme);
  };
};

var _default = theme;
exports.default = _default;