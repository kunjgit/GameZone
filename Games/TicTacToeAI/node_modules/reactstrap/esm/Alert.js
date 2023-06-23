var _excluded = ["className", "closeClassName", "closeAriaLabel", "cssModule", "tag", "color", "isOpen", "toggle", "children", "transition", "fade", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import Fade from './Fade';
var propTypes = {
  /** Pass children so this component can wrap the child elements */
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Add custom class for close button */
  closeClassName: PropTypes.string,
  /** Aria label for close button */
  closeAriaLabel: PropTypes.string,
  /** Change color of alert */
  color: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  /** Toggle fade animation */
  fade: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  /** Control visibility state of Alert */
  isOpen: PropTypes.bool,
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Function to toggle visibility */
  toggle: PropTypes.func,
  /** Props to be passed to `Fade` to modify transition */
  transition: PropTypes.shape(Fade.propTypes)
};
function Alert(props) {
  var className = props.className,
    closeClassName = props.closeClassName,
    _props$closeAriaLabel = props.closeAriaLabel,
    closeAriaLabel = _props$closeAriaLabel === void 0 ? 'Close' : _props$closeAriaLabel,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    _props$color = props.color,
    color = _props$color === void 0 ? 'success' : _props$color,
    _props$isOpen = props.isOpen,
    isOpen = _props$isOpen === void 0 ? true : _props$isOpen,
    toggle = props.toggle,
    children = props.children,
    _props$transition = props.transition,
    transition = _props$transition === void 0 ? _objectSpread(_objectSpread({}, Fade.defaultProps), {}, {
      unmountOnExit: true
    }) : _props$transition,
    _props$fade = props.fade,
    fade = _props$fade === void 0 ? true : _props$fade,
    innerRef = props.innerRef,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'alert', "alert-".concat(color), {
    'alert-dismissible': toggle
  }), cssModule);
  var closeClasses = mapToCssModules(classNames('btn-close', closeClassName), cssModule);
  var alertTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), transition), {}, {
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0
  });
  return /*#__PURE__*/React.createElement(Fade, _extends({}, attributes, alertTransition, {
    tag: Tag,
    className: classes,
    "in": isOpen,
    role: "alert",
    innerRef: innerRef
  }), toggle ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: closeClasses,
    "aria-label": closeAriaLabel,
    onClick: toggle
  }) : null, children);
}
Alert.propTypes = propTypes;
export default Alert;