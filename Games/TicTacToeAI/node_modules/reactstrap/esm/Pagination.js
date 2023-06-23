var _excluded = ["className", "listClassName", "cssModule", "size", "tag", "listTag", "aria-label"];
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
  /** Add custom class for list */
  listClassName: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Make the Pagination bigger or smaller  */
  size: PropTypes.string,
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Set a custom element for list component */
  listTag: tagPropType,
  'aria-label': PropTypes.string
};
function Pagination(props) {
  var className = props.className,
    listClassName = props.listClassName,
    cssModule = props.cssModule,
    size = props.size,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'nav' : _props$tag,
    _props$listTag = props.listTag,
    ListTag = _props$listTag === void 0 ? 'ul' : _props$listTag,
    _props$ariaLabel = props['aria-label'],
    label = _props$ariaLabel === void 0 ? 'pagination' : _props$ariaLabel,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className), cssModule);
  var listClasses = mapToCssModules(classNames(listClassName, 'pagination', _defineProperty({}, "pagination-".concat(size), !!size)), cssModule);
  return /*#__PURE__*/React.createElement(Tag, {
    className: classes,
    "aria-label": label
  }, /*#__PURE__*/React.createElement(ListTag, _extends({}, attributes, {
    className: listClasses
  })));
}
Pagination.propTypes = propTypes;
export default Pagination;