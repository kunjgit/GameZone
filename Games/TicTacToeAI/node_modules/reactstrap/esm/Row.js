var _excluded = ["className", "cssModule", "noGutters", "tag", "widths"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType, deprecated } from './utils';
var rowColWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
var rowColsPropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
var propTypes = {
  tag: tagPropType,
  noGutters: deprecated(PropTypes.bool, 'Please use Bootstrap 5 gutter utility classes. https://getbootstrap.com/docs/5.0/layout/gutters/'),
  className: PropTypes.string,
  cssModule: PropTypes.object,
  xs: rowColsPropType,
  sm: rowColsPropType,
  md: rowColsPropType,
  lg: rowColsPropType,
  xl: rowColsPropType,
  xxl: rowColsPropType,
  widths: PropTypes.array
};
function Row(props) {
  var className = props.className,
    cssModule = props.cssModule,
    noGutters = props.noGutters,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    _props$widths = props.widths,
    widths = _props$widths === void 0 ? rowColWidths : _props$widths,
    attributes = _objectWithoutProperties(props, _excluded);
  var colClasses = [];
  widths.forEach(function (colWidth, i) {
    var colSize = props[colWidth];
    delete attributes[colWidth];
    if (!colSize) {
      return;
    }
    var isXs = !i;
    colClasses.push(isXs ? "row-cols-".concat(colSize) : "row-cols-".concat(colWidth, "-").concat(colSize));
  });
  var classes = mapToCssModules(classNames(className, noGutters ? 'gx-0' : null, 'row', colClasses), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
Row.propTypes = propTypes;
export default Row;