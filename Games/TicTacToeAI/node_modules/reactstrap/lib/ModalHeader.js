"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "children", "toggle", "tag", "wrapTag", "closeAriaLabel", "close"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Custom close button */
  close: _propTypes.default.object,
  closeAriaLabel: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  /** Function to be triggered when close button is clicked */
  toggle: _propTypes.default.func,
  wrapTag: _utils.tagPropType
};
function ModalHeader(props) {
  let closeButton;
  const {
      className,
      cssModule,
      children,
      toggle,
      tag: Tag = 'h5',
      wrapTag: WrapTag = 'div',
      closeAriaLabel = 'Close',
      close
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'modal-header'), cssModule);
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
    className: (0, _utils.mapToCssModules)('modal-title', cssModule)
  }, children), close || closeButton);
}
ModalHeader.propTypes = propTypes;
var _default = ModalHeader;
exports.default = _default;