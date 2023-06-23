"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarouselContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * CarouselContext
 * {
 *  direction: PropTypes.oneOf(['start', 'end']).isRequired,
 * }
 */
const CarouselContext = /*#__PURE__*/_react.default.createContext({});
exports.CarouselContext = CarouselContext;