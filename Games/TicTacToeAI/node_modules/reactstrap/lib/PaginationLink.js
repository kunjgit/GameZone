"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "next", "previous", "first", "last", "tag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  'aria-label': _propTypes.default.string,
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Add to next button to add default aria label and icon */
  next: _propTypes.default.bool,
  /** Add to previous button to add default aria label and icon */
  previous: _propTypes.default.bool,
  /** Add to first button to add default aria label and icon */
  first: _propTypes.default.bool,
  /** Add to last button to add default aria label and icon */
  last: _propTypes.default.bool,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
function PaginationLink(props) {
  let {
      className,
      cssModule,
      next,
      previous,
      first,
      last,
      tag: Tag = 'a'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'page-link'), cssModule);
  let defaultAriaLabel;
  if (previous) {
    defaultAriaLabel = 'Previous';
  } else if (next) {
    defaultAriaLabel = 'Next';
  } else if (first) {
    defaultAriaLabel = 'First';
  } else if (last) {
    defaultAriaLabel = 'Last';
  }
  const ariaLabel = props['aria-label'] || defaultAriaLabel;
  let defaultCaret;
  if (previous) {
    defaultCaret = '\u2039';
  } else if (next) {
    defaultCaret = '\u203A';
  } else if (first) {
    defaultCaret = '\u00ab';
  } else if (last) {
    defaultCaret = '\u00bb';
  }
  let {
    children
  } = props;
  if (children && Array.isArray(children) && children.length === 0) {
    children = null;
  }
  if (!attributes.href && Tag === 'a') {
    Tag = 'button';
  }
  if (previous || next || first || last) {
    children = [/*#__PURE__*/_react.default.createElement("span", {
      "aria-hidden": "true",
      key: "caret"
    }, children || defaultCaret), /*#__PURE__*/_react.default.createElement("span", {
      className: "visually-hidden",
      key: "ariaLabel"
    }, ariaLabel)];
  }
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes,
    "aria-label": ariaLabel
  }), children);
}
PaginationLink.propTypes = propTypes;
var _default = PaginationLink;
exports.default = _default;