"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["children", "className", "close", "closeAriaLabel", "cssModule", "tag", "toggle", "wrapTag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  close: _propTypes.default.object,
  closeAriaLabel: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  tag: _utils.tagPropType,
  toggle: _propTypes.default.func,
  wrapTag: _utils.tagPropType
};
function OffcanvasHeader(props) {
  let closeButton;
  const {
      children,
      className,
      close,
      closeAriaLabel = 'Close',
      cssModule,
      tag: Tag = 'h5',
      toggle,
      wrapTag: WrapTag = 'div'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'offcanvas-header'), cssModule);
  if (!close && toggle) {
    closeButton = /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      onClick: toggle,
      className: (0, _utils.mapToCssModules)('btn-close', cssModule),
      "aria-label": closeAriaLabel
    });
  }
  return /*#__PURE__*/_react.default.createElement(WrapTag, _extends({}, attributes, {
    className: classes
  }), /*#__PURE__*/_react.default.createElement(Tag, {
    className: (0, _utils.mapToCssModules)('offcanvas-title', cssModule)
  }, children), close || closeButton);
}
OffcanvasHeader.propTypes = propTypes;
var _default = OffcanvasHeader;
exports.default = _default;