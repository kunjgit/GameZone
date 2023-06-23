"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prop = _interopRequireDefault(require("./prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Switches on a given prop. Returns the value or function for a given prop value. Third parameter is default value.
 * @example
 * import styled, { css } from "styled-components";
 * import { switchProp, prop } from "styled-tools";
 *
 * const Button = styled.button`
 *   font-size: ${switchProp(prop("size", "medium"), {
 *     small: prop("theme.sizes.sm", "12px"),
 *     medium: prop("theme.sizes.md", "16px"),
 *     large: prop("theme.sizes.lg", "20px")
 *   }, prop("theme.sizes.md", "16px"))};
 *   ${switchProp("theme.kind", {
 *     light: css`
 *       color: LightBlue;
 *     `,
 *     dark: css`
 *       color: DarkBlue;
 *     `
 *   }, css`color: black;`)}
 * `;
 *
 * <Button size="large" theme={{ kind: "light" }} />
 */
var switchProp = function switchProp(needle, cases, defaultCase) {
  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var value = typeof needle === "function" ? needle(props) : (0, _prop.default)(needle)(props);
    var finalCases = typeof cases === "function" ? cases(props) : cases;

    if (value in finalCases) {
      return finalCases[value];
    }

    return defaultCase;
  };
};

var _default = switchProp;
exports.default = _default;