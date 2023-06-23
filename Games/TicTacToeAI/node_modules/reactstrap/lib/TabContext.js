"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * TabContext
 * {
 *  activeTabId: PropTypes.any
 * }
 */
const TabContext = /*#__PURE__*/_react.default.createContext({});
exports.TabContext = TabContext;