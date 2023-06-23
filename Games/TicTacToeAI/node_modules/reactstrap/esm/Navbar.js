var _excluded = ["expand", "className", "cssModule", "light", "dark", "fixed", "sticky", "color", "container", "tag", "children"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Theme the navbar by adding a background color  */
  color: PropTypes.string,
  /** Use any of the responsive containers to change how wide the content in your navbar is presented. */
  container: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** This prop is passed if the background is dark, to make the text lighter */
  dark: PropTypes.bool,
  /** Determine if to show toggler button */
  expand: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Make the navbar fixed at the top */
  fixed: PropTypes.string,
  /** Add `.navbar-light` class */
  light: PropTypes.bool,
  role: PropTypes.string,
  /** Use `position: sticky` which isn't fully supported in every browser */
  sticky: PropTypes.string,
  /** Set a custom element for this component */
  tag: tagPropType
};
var getExpandClass = function getExpandClass(expand) {
  if (expand === false) {
    return false;
  }
  if (expand === true || expand === 'xs') {
    return 'navbar-expand';
  }
  return "navbar-expand-".concat(expand);
};
function Navbar(props) {
  var _classNames;
  var _props$expand = props.expand,
    expand = _props$expand === void 0 ? false : _props$expand,
    className = props.className,
    cssModule = props.cssModule,
    light = props.light,
    dark = props.dark,
    fixed = props.fixed,
    sticky = props.sticky,
    color = props.color,
    _props$container = props.container,
    container = _props$container === void 0 ? 'fluid' : _props$container,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'nav' : _props$tag,
    children = props.children,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'navbar', getExpandClass(expand), (_classNames = {
    'navbar-light': light,
    'navbar-dark': dark
  }, _defineProperty(_classNames, "bg-".concat(color), color), _defineProperty(_classNames, "fixed-".concat(fixed), fixed), _defineProperty(_classNames, "sticky-".concat(sticky), sticky), _classNames)), cssModule);
  var containerClass = container && container === true ? 'container' : "container-".concat(container);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }), container ? /*#__PURE__*/React.createElement("div", {
    className: containerClass
  }, children) : children);
}
Navbar.propTypes = propTypes;
export default Navbar;