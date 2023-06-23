var _excluded = ["className", "cssModule", "color", "innerRef", "tag", "animation", "size", "widths"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import Col, { getColumnClasses } from './Col';
var propTypes = _objectSpread(_objectSpread({}, Col.propTypes), {}, {
  /** Add custom color to the placeholder */
  color: PropTypes.string,
  /** Add custom tag. */
  tag: tagPropType,
  /** Apply either `glow` or `wave` animation. */
  animation: PropTypes.oneOf(['glow', 'wave']),
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  /** Make the size larger */
  size: PropTypes.oneOf(['lg', 'sm', 'xs'])
});
function Placeholder(props) {
  var className = props.className,
    cssModule = props.cssModule,
    color = props.color,
    innerRef = props.innerRef,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'span' : _props$tag,
    animation = props.animation,
    size = props.size,
    widths = props.widths,
    attributes = _objectWithoutProperties(props, _excluded);
  var _getColumnClasses = getColumnClasses(attributes, cssModule, widths),
    modifiedAttributes = _getColumnClasses.modifiedAttributes,
    colClasses = _getColumnClasses.colClasses;
  var classes = mapToCssModules(classNames(className, colClasses, 'placeholder' + (animation ? '-' + animation : ''), size ? 'placeholder-' + size : false, color ? 'bg-' + color : false), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, modifiedAttributes, {
    className: classes,
    ref: innerRef
  }));
}
Placeholder.propTypes = propTypes;
export default Placeholder;