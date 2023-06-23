var _excluded = ["tag", "baseClass", "baseClassActive", "className", "cssModule", "children", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { mapToCssModules, omit, pick, TransitionPropTypeKeys, TransitionTimeouts, tagPropType } from './utils';
var propTypes = _objectSpread(_objectSpread({}, Transition.propTypes), {}, {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  tag: tagPropType,
  baseClass: PropTypes.string,
  baseClassActive: PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
});
var defaultProps = _objectSpread(_objectSpread({}, Transition.defaultProps), {}, {
  timeout: TransitionTimeouts.Fade,
  appear: true,
  enter: true,
  exit: true,
  "in": true
});
function Fade(props) {
  var ref = useRef(null);
  var _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    _props$baseClass = props.baseClass,
    baseClass = _props$baseClass === void 0 ? 'fade' : _props$baseClass,
    _props$baseClassActiv = props.baseClassActive,
    baseClassActive = _props$baseClassActiv === void 0 ? 'show' : _props$baseClassActiv,
    className = props.className,
    cssModule = props.cssModule,
    children = props.children,
    _props$innerRef = props.innerRef,
    innerRef = _props$innerRef === void 0 ? ref : _props$innerRef,
    otherProps = _objectWithoutProperties(props, _excluded);
  var transitionProps = pick(_objectSpread({
    defaultProps: defaultProps
  }, otherProps), TransitionPropTypeKeys);
  var childProps = omit(otherProps, TransitionPropTypeKeys);
  return /*#__PURE__*/React.createElement(Transition, _extends({
    nodeRef: innerRef
  }, transitionProps), function (status) {
    var isActive = status === 'entered';
    var classes = mapToCssModules(classNames(className, baseClass, isActive && baseClassActive), cssModule);
    return /*#__PURE__*/React.createElement(Tag, _extends({
      className: classes
    }, childProps, {
      ref: innerRef
    }), children);
  });
}
Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;
export default Fade;