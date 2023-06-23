var _excluded = ["className", "cssModule", "size", "bordered", "borderless", "striped", "dark", "hover", "responsive", "tag", "responsiveTag", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Adds border to all sides of table */
  bordered: PropTypes.bool,
  /** Removes all borders */
  borderless: PropTypes.bool,
  /** Adds custom class name to component */
  className: PropTypes.string,
  /**  */
  cssModule: PropTypes.object,
  /** Makes the table dark */
  dark: PropTypes.bool,
  /** Enables a hover state on the rows within `<tbody>` */
  hover: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
  /** Responsive tables allow tables to be scrolled horizontally with ease */
  responsive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  responsiveTag: tagPropType,
  /** Make tables more compact by cutting cell padding in half when setting size as sm. */
  size: PropTypes.string,
  /** Adds zebra-striping to any table row within the `<tbody>` */
  striped: PropTypes.bool,
  /** Add custom tag to the component */
  tag: tagPropType
};
function Table(props) {
  var className = props.className,
    cssModule = props.cssModule,
    size = props.size,
    bordered = props.bordered,
    borderless = props.borderless,
    striped = props.striped,
    dark = props.dark,
    hover = props.hover,
    responsive = props.responsive,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'table' : _props$tag,
    _props$responsiveTag = props.responsiveTag,
    ResponsiveTag = _props$responsiveTag === void 0 ? 'div' : _props$responsiveTag,
    innerRef = props.innerRef,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false), cssModule);
  var table = /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    ref: innerRef,
    className: classes
  }));
  if (responsive) {
    var responsiveClassName = mapToCssModules(responsive === true ? 'table-responsive' : "table-responsive-".concat(responsive), cssModule);
    return /*#__PURE__*/React.createElement(ResponsiveTag, {
      className: responsiveClassName
    }, table);
  }
  return table;
}
Table.propTypes = propTypes;
export default Table;