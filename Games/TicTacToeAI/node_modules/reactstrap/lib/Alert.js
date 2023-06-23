"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
var _Fade = _interopRequireDefault(require("./Fade"));
const _excluded = ["className", "closeClassName", "closeAriaLabel", "cssModule", "tag", "color", "isOpen", "toggle", "children", "transition", "fade", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Pass children so this component can wrap the child elements */
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Add custom class for close button */
  closeClassName: _propTypes.default.string,
  /** Aria label for close button */
  closeAriaLabel: _propTypes.default.string,
  /** Change color of alert */
  color: _propTypes.default.string,
  /** Change existing className with a new className */
  cssModule: _propTypes.default.object,
  /** Toggle fade animation */
  fade: _propTypes.default.bool,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func]),
  /** Control visibility state of Alert */
  isOpen: _propTypes.default.bool,
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  /** Function to toggle visibility */
  toggle: _propTypes.default.func,
  /** Props to be passed to `Fade` to modify transition */
  transition: _propTypes.default.shape(_Fade.default.propTypes)
};
function Alert(props) {
  const {
      className,
      closeClassName,
      closeAriaLabel = 'Close',
      cssModule,
      tag: Tag = 'div',
      color = 'success',
      isOpen = true,
      toggle,
      children,
      transition = _objectSpread(_objectSpread({}, _Fade.default.defaultProps), {}, {
        unmountOnExit: true
      }),
      fade = true,
      innerRef
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'alert', `alert-${color}`, {
    'alert-dismissible': toggle
  }), cssModule);
  const closeClasses = (0, _utils.mapToCssModules)((0, _classnames.default)('btn-close', closeClassName), cssModule);
  const alertTransition = _objectSpread(_objectSpread(_objectSpread({}, _Fade.default.defaultProps), transition), {}, {
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0
  });
  return /*#__PURE__*/_react.default.createElement(_Fade.default, _extends({}, attributes, alertTransition, {
    tag: Tag,
    className: classes,
    in: isOpen,
    role: "alert",
    innerRef: innerRef
  }), toggle ? /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: closeClasses,
    "aria-label": closeAriaLabel,
    onClick: toggle
  }) : null, children);
}
Alert.propTypes = propTypes;
var _default = Alert;
exports.default = _default;