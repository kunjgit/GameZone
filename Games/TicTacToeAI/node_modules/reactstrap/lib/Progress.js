"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["children", "className", "barClassName", "cssModule", "value", "min", "max", "animated", "striped", "color", "bar", "multi", "tag", "style", "barStyle", "barAriaValueText", "barAriaLabelledBy"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Enable animation to bar */
  animated: _propTypes.default.bool,
  bar: _propTypes.default.bool,
  barAriaLabelledBy: _propTypes.default.string,
  barAriaValueText: _propTypes.default.string,
  barClassName: _propTypes.default.string,
  barStyle: _propTypes.default.object,
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Add custom color to the placeholder */
  color: _propTypes.default.string,
  /** Maximum value of progress */
  max: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  /** Minimum value of progress, defaults to zero */
  min: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  multi: _propTypes.default.bool,
  /** Add stripes to progress bar */
  striped: _propTypes.default.bool,
  style: _propTypes.default.object,
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  /** Current value of progress */
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
function Progress(props) {
  const {
      children,
      className,
      barClassName,
      cssModule,
      value = 0,
      min = 0,
      max = 100,
      animated,
      striped,
      color,
      bar,
      multi,
      tag: Tag = 'div',
      style = {},
      barStyle = {},
      barAriaValueText,
      barAriaLabelledBy
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const percent = (0, _utils.toNumber)(value) / (0, _utils.toNumber)(max) * 100;
  const progressClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'progress'), cssModule);
  const progressBarClasses = (0, _utils.mapToCssModules)((0, _classnames.default)('progress-bar', bar ? className || barClassName : barClassName, animated ? 'progress-bar-animated' : null, color ? `bg-${color}` : null, striped || animated ? 'progress-bar-striped' : null), cssModule);
  const progressBarProps = {
    className: progressBarClasses,
    style: _objectSpread(_objectSpread(_objectSpread({}, bar ? style : {}), barStyle), {}, {
      width: `${percent}%`
    }),
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuetext': barAriaValueText,
    'aria-labelledby': barAriaLabelledBy,
    children: children
  };
  if (bar) {
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, progressBarProps));
  }
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    style: style,
    className: progressClasses
  }), multi ? children : /*#__PURE__*/_react.default.createElement("div", progressBarProps));
}
Progress.propTypes = propTypes;
var _default = Progress;
exports.default = _default;