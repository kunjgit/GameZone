"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * DropdownContext
 * {
 *  toggle: PropTypes.func.isRequired,
 *  isOpen: PropTypes.bool.isRequired,
 *  direction: PropTypes.oneOf(['up', 'down', 'start', 'end']).isRequired,
 *  inNavbar: PropTypes.bool.isRequired,
 *  disabled: PropTypes.bool
 * }
 */
const DropdownContext = /*#__PURE__*/_react.default.createContext({});
exports.DropdownContext = DropdownContext;