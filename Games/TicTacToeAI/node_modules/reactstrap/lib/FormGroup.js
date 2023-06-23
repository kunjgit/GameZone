"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "row", "disabled", "check", "inline", "floating", "tag", "switch"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  children: _propTypes.default.node,
  row: _propTypes.default.bool,
  check: _propTypes.default.bool,
  switch: _propTypes.default.bool,
  inline: _propTypes.default.bool,
  floating: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  tag: _utils.tagPropType,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object
};
function FormGroup(props) {
  const {
      className,
      cssModule,
      row,
      disabled,
      check,
      inline,
      floating,
      tag: Tag = 'div',
      switch: switchProp
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const formCheck = check || switchProp;
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, row ? 'row' : false, formCheck ? 'form-check' : 'mb-3', switchProp ? 'form-switch' : false, formCheck && inline ? 'form-check-inline' : false, formCheck && disabled ? 'disabled' : false, floating && 'form-floating'), cssModule);
  if (Tag === 'fieldset') {
    attributes.disabled = disabled;
  }
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
FormGroup.propTypes = propTypes;
var _default = FormGroup;
exports.default = _default;