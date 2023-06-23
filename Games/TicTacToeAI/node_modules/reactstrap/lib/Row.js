"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "noGutters", "tag", "widths"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const rowColWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const rowColsPropType = _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]);
const propTypes = {
  tag: _utils.tagPropType,
  noGutters: (0, _utils.deprecated)(_propTypes.default.bool, 'Please use Bootstrap 5 gutter utility classes. https://getbootstrap.com/docs/5.0/layout/gutters/'),
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  xs: rowColsPropType,
  sm: rowColsPropType,
  md: rowColsPropType,
  lg: rowColsPropType,
  xl: rowColsPropType,
  xxl: rowColsPropType,
  widths: _propTypes.default.array
};
function Row(props) {
  const {
      className,
      cssModule,
      noGutters,
      tag: Tag = 'div',
      widths = rowColWidths
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const colClasses = [];
  widths.forEach((colWidth, i) => {
    let colSize = props[colWidth];
    delete attributes[colWidth];
    if (!colSize) {
      return;
    }
    const isXs = !i;
    colClasses.push(isXs ? `row-cols-${colSize}` : `row-cols-${colWidth}-${colSize}`);
  });
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, noGutters ? 'gx-0' : null, 'row', colClasses), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
Row.propTypes = propTypes;
var _default = Row;
exports.default = _default;