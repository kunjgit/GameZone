import prop from "./prop";

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
    return prop(path, defaultValue)(props.theme);
  };
};

export default theme;