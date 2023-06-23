"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColumnClasses = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "widths", "tag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const colWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const stringOrNumberProp = _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]);
const columnProps = _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.number, _propTypes.default.string, _propTypes.default.shape({
  size: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.number, _propTypes.default.string]),
  order: stringOrNumberProp,
  offset: stringOrNumberProp
})]);
const propTypes = {
  tag: _utils.tagPropType,
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  xxl: columnProps,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  widths: _propTypes.default.array
};
const getColumnSizeClass = (isXs, colWidth, colSize) => {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  }
  if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
};
const getColumnClasses = (attributes, cssModule, widths = colWidths) => {
  const modifiedAttributes = attributes;
  const colClasses = [];
  widths.forEach((colWidth, i) => {
    let columnProp = modifiedAttributes[colWidth];
    delete modifiedAttributes[colWidth];
    if (!columnProp && columnProp !== '') {
      return;
    }
    const isXs = !i;
    if ((0, _utils.isObject)(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push((0, _utils.mapToCssModules)((0, _classnames.default)({
        [colClass]: columnProp.size || columnProp.size === '',
        [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
        [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
      }), cssModule));
    } else {
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  return {
    colClasses,
    modifiedAttributes
  };
};
exports.getColumnClasses = getColumnClasses;
function Col(props) {
  const {
      className,
      cssModule,
      widths = colWidths,
      tag: Tag = 'div'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  let {
    modifiedAttributes,
    colClasses
  } = getColumnClasses(attributes, cssModule, widths);
  if (!colClasses.length) {
    colClasses.push('col');
  }
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, colClasses), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, modifiedAttributes, {
    className: classes
  }));
}
Col.propTypes = propTypes;
var _default = Col;
exports.default = _default;