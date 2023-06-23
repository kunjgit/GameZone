"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["items", "activeIndex", "cssModule", "onClickHandler", "className"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function CarouselIndicators(props) {
  const {
      items,
      activeIndex,
      cssModule,
      onClickHandler,
      className
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const listClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'carousel-indicators'), cssModule);
  const indicators = items.map((item, idx) => {
    const indicatorClasses = (0, _utils.mapToCssModules)((0, _classnames.default)({
      active: activeIndex === idx
    }), cssModule);
    return /*#__PURE__*/_react.default.createElement("button", {
      "aria-label": item.caption,
      "data-bs-target": true,
      type: "button",
      key: `${item.key || Object.values(item).join('')}`,
      onClick: e => {
        e.preventDefault();
        onClickHandler(idx);
      },
      className: indicatorClasses
    });
  });
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: listClasses
  }, attributes), indicators);
}
CarouselIndicators.propTypes = {
  /** The current active index */
  activeIndex: _propTypes.default.number.isRequired,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Array of items to show */
  items: _propTypes.default.array.isRequired,
  /** Function to be triggered on click */
  onClickHandler: _propTypes.default.func.isRequired
};
var _default = CarouselIndicators;
exports.default = _default;