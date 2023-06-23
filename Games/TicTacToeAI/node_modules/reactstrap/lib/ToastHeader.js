"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "children", "toggle", "tag", "wrapTag", "closeAriaLabel", "close", "tagClassName", "icon"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  tag: _utils.tagPropType,
  icon: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.node]),
  wrapTag: _utils.tagPropType,
  toggle: _propTypes.default.func,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  children: _propTypes.default.node,
  closeAriaLabel: _propTypes.default.string,
  charCode: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  close: _propTypes.default.object,
  tagClassName: _propTypes.default.string
};
function ToastHeader(props) {
  let closeButton;
  let icon;
  const {
      className,
      cssModule,
      children,
      toggle,
      tag: Tag = 'strong',
      wrapTag: WrapTag = 'div',
      closeAriaLabel = 'Close',
      close,
      tagClassName = 'me-auto',
      icon: iconProp
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'toast-header'), cssModule);
  if (!close && toggle) {
    closeButton = /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      onClick: toggle,
      className: (0, _utils.mapToCssModules)('btn-close', cssModule),
      "aria-label": closeAriaLabel
    });
  }
  if (typeof iconProp === 'string') {
    icon = /*#__PURE__*/_react.default.createElement("svg", {
      className: (0, _utils.mapToCssModules)(`rounded text-${iconProp}`),
      width: "20",
      height: "20",
      xmlns: "http://www.w3.org/2000/svg",
      preserveAspectRatio: "xMidYMid slice",
      focusable: "false",
      role: "img"
    }, /*#__PURE__*/_react.default.createElement("rect", {
      fill: "currentColor",
      width: "100%",
      height: "100%"
    }));
  } else if (iconProp) {
    icon = iconProp;
  }
  return /*#__PURE__*/_react.default.createElement(WrapTag, _extends({}, attributes, {
    className: classes
  }), icon, /*#__PURE__*/_react.default.createElement(Tag, {
    className: (0, _utils.mapToCssModules)((0, _classnames.default)(tagClassName, {
      'ms-2': icon != null
    }), cssModule)
  }, children), close || closeButton);
}
ToastHeader.propTypes = propTypes;
var _default = ToastHeader;
exports.default = _default;