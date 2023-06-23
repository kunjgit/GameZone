var _excluded = ["className", "cssModule", "next", "previous", "first", "last", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  'aria-label': PropTypes.string,
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Add to next button to add default aria label and icon */
  next: PropTypes.bool,
  /** Add to previous button to add default aria label and icon */
  previous: PropTypes.bool,
  /** Add to first button to add default aria label and icon */
  first: PropTypes.bool,
  /** Add to last button to add default aria label and icon */
  last: PropTypes.bool,
  /** Set a custom element for this component */
  tag: tagPropType
};
function PaginationLink(props) {
  var className = props.className,
    cssModule = props.cssModule,
    next = props.next,
    previous = props.previous,
    first = props.first,
    last = props.last,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'a' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'page-link'), cssModule);
  var defaultAriaLabel;
  if (previous) {
    defaultAriaLabel = 'Previous';
  } else if (next) {
    defaultAriaLabel = 'Next';
  } else if (first) {
    defaultAriaLabel = 'First';
  } else if (last) {
    defaultAriaLabel = 'Last';
  }
  var ariaLabel = props['aria-label'] || defaultAriaLabel;
  var defaultCaret;
  if (previous) {
    defaultCaret = "\u2039";
  } else if (next) {
    defaultCaret = "\u203A";
  } else if (first) {
    defaultCaret = "\xAB";
  } else if (last) {
    defaultCaret = "\xBB";
  }
  var children = props.children;
  if (children && Array.isArray(children) && children.length === 0) {
    children = null;
  }
  if (!attributes.href && Tag === 'a') {
    Tag = 'button';
  }
  if (previous || next || first || last) {
    children = [/*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      key: "caret"
    }, children || defaultCaret), /*#__PURE__*/React.createElement("span", {
      className: "visually-hidden",
      key: "ariaLabel"
    }, ariaLabel)];
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes,
    "aria-label": ariaLabel
  }), children);
}
PaginationLink.propTypes = propTypes;
export default PaginationLink;