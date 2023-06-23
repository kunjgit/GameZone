import ifProp from "./ifProp";

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
  return ifProp(test, fail, pass);
};

export default ifNotProp;