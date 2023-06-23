"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _Button = _interopRequireDefault(require("./Button"));
var _utils = require("./utils");
const _excluded = ["className"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  onClick: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  defaultValue: _propTypes.default.bool,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object
};
function ButtonToggle(props) {
  const [toggled, setToggled] = (0, _react.useState)(props.defaultValue ?? false);
  const [focus, setFocus] = (0, _react.useState)(false);
  const onBlur = (0, _react.useCallback)(e => {
    if (props.onBlur) {
      props.onBlur(e);
    }
    setFocus(false);
  }, [props.onBlur]);
  const onFocus = (0, _react.useCallback)(e => {
    if (props.onFocus) {
      props.onFocus(e);
    }
    setFocus(true);
  }, [props.onFocus]);
  const onClick = (0, _react.useCallback)(e => {
    if (props.onClick) {
      props.onClick(e);
    }
    setToggled(!toggled);
  }, [props.onClick]);
  const {
      className
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, {
    focus: focus
  }), props.cssModule);
  return /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    active: toggled,
    onBlur: onBlur,
    onFocus: onFocus,
    onClick: onClick,
    className: classes
  }, attributes));
}
ButtonToggle.propTypes = propTypes;
var _default = ButtonToggle;
exports.default = _default;