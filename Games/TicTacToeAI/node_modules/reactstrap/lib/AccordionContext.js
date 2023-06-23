"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccordionContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * AccordionContext
 * {
 *  toggle: PropTypes.func.isRequired,
 *  openId: PropTypes.string,
 * }
 */
const AccordionContext = /*#__PURE__*/_react.default.createContext({});
exports.AccordionContext = AccordionContext;