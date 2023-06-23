var _excluded = ["className", "cssModule", "hidden", "widths", "tag", "check", "size", "for"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType, isObject } from './utils';
var colWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
var stringOrNumberProp = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
var columnProps = PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number, PropTypes.shape({
  size: stringOrNumberProp,
  order: stringOrNumberProp,
  offset: stringOrNumberProp
})]);
var propTypes = {
  children: PropTypes.node,
  hidden: PropTypes.bool,
  check: PropTypes.bool,
  size: PropTypes.string,
  "for": PropTypes.string,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  xxl: columnProps,
  widths: PropTypes.array
};
var getColumnSizeClass = function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : "col-".concat(colWidth);
  }
  if (colSize === 'auto') {
    return isXs ? 'col-auto' : "col-".concat(colWidth, "-auto");
  }
  return isXs ? "col-".concat(colSize) : "col-".concat(colWidth, "-").concat(colSize);
};
function Label(props) {
  var className = props.className,
    cssModule = props.cssModule,
    hidden = props.hidden,
    _props$widths = props.widths,
    widths = _props$widths === void 0 ? colWidths : _props$widths,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'label' : _props$tag,
    check = props.check,
    size = props.size,
    htmlFor = props["for"],
    attributes = _objectWithoutProperties(props, _excluded);
  var colClasses = [];
  widths.forEach(function (colWidth, i) {
    var columnProp = props[colWidth];
    delete attributes[colWidth];
    if (!columnProp && columnProp !== '') {
      return;
    }
    var isXs = !i;
    var colClass;
    if (isObject(columnProp)) {
      var _classNames;
      var colSizeInterfix = isXs ? '-' : "-".concat(colWidth, "-");
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push(mapToCssModules(classNames((_classNames = {}, _defineProperty(_classNames, colClass, columnProp.size || columnProp.size === ''), _defineProperty(_classNames, "order".concat(colSizeInterfix).concat(columnProp.order), columnProp.order || columnProp.order === 0), _defineProperty(_classNames, "offset".concat(colSizeInterfix).concat(columnProp.offset), columnProp.offset || columnProp.offset === 0), _classNames))), cssModule);
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  var colFormLabel = size || colClasses.length;
  var formLabel = !(check || colFormLabel);
  var classes = mapToCssModules(classNames(className, hidden ? 'visually-hidden' : false, check ? 'form-check-label' : false, size ? "col-form-label-".concat(size) : false, colClasses, colFormLabel ? 'col-form-label' : false, formLabel ? 'form-label' : false), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({
    htmlFor: htmlFor
  }, attributes, {
    className: classes
  }));
}
Label.propTypes = propTypes;
export default Label;