"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "hidden", "widths", "tag", "check", "size", "for"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const colWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const stringOrNumberProp = _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]);
const columnProps = _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string, _propTypes.default.number, _propTypes.default.shape({
  size: stringOrNumberProp,
  order: stringOrNumberProp,
  offset: stringOrNumberProp
})]);
const propTypes = {
  children: _propTypes.default.node,
  hidden: _propTypes.default.bool,
  check: _propTypes.default.bool,
  size: _propTypes.default.string,
  for: _propTypes.default.string,
  tag: _utils.tagPropType,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  xxl: columnProps,
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
function Label(props) {
  const {
      className,
      cssModule,
      hidden,
      widths = colWidths,
      tag: Tag = 'label',
      check,
      size,
      for: htmlFor
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const colClasses = [];
  widths.forEach((colWidth, i) => {
    let columnProp = props[colWidth];
    delete attributes[colWidth];
    if (!columnProp && columnProp !== '') {
      return;
    }
    const isXs = !i;
    let colClass;
    if ((0, _utils.isObject)(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push((0, _utils.mapToCssModules)((0, _classnames.default)({
        [colClass]: columnProp.size || columnProp.size === '',
        [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
        [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
      })), cssModule);
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  const colFormLabel = size || colClasses.length;
  const formLabel = !(check || colFormLabel);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, hidden ? 'visually-hidden' : false, check ? 'form-check-label' : false, size ? `col-form-label-${size}` : false, colClasses, colFormLabel ? 'col-form-label' : false, formLabel ? 'form-label' : false), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({
    htmlFor: htmlFor
  }, attributes, {
    className: classes
  }));
}
Label.propTypes = propTypes;
var _default = Label;
exports.default = _default;