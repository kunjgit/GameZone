"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "size", "bordered", "borderless", "striped", "dark", "hover", "responsive", "tag", "responsiveTag", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Adds border to all sides of table */
  bordered: _propTypes.default.bool,
  /** Removes all borders */
  borderless: _propTypes.default.bool,
  /** Adds custom class name to component */
  className: _propTypes.default.string,
  /**  */
  cssModule: _propTypes.default.object,
  /** Makes the table dark */
  dark: _propTypes.default.bool,
  /** Enables a hover state on the rows within `<tbody>` */
  hover: _propTypes.default.bool,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string, _propTypes.default.object]),
  /** Responsive tables allow tables to be scrolled horizontally with ease */
  responsive: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string]),
  responsiveTag: _utils.tagPropType,
  /** Make tables more compact by cutting cell padding in half when setting size as sm. */
  size: _propTypes.default.string,
  /** Adds zebra-striping to any table row within the `<tbody>` */
  striped: _propTypes.default.bool,
  /** Add custom tag to the component */
  tag: _utils.tagPropType
};
function Table(props) {
  const {
      className,
      cssModule,
      size,
      bordered,
      borderless,
      striped,
      dark,
      hover,
      responsive,
      tag: Tag = 'table',
      responsiveTag: ResponsiveTag = 'div',
      innerRef
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false), cssModule);
  const table = /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    ref: innerRef,
    className: classes
  }));
  if (responsive) {
    const responsiveClassName = (0, _utils.mapToCssModules)(responsive === true ? 'table-responsive' : `table-responsive-${responsive}`, cssModule);
    return /*#__PURE__*/_react.default.createElement(ResponsiveTag, {
      className: responsiveClassName
    }, table);
  }
  return table;
}
Table.propTypes = propTypes;
var _default = Table;
exports.default = _default;