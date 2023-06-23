"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "tag", "active", "disabled", "action", "color"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Add action prop to give effects while hovering over element */
  action: _propTypes.default.bool,
  /** Add active prop to make the current selection active */
  active: _propTypes.default.bool,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Add background colour to the list item */
  color: _propTypes.default.string,
  /** Make the list item appear disabled */
  disabled: _propTypes.default.bool,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
const handleDisabledOnClick = e => {
  e.preventDefault();
};
function ListGroupItem(props) {
  const {
      className,
      cssModule,
      tag: Tag = 'li',
      active,
      disabled,
      action,
      color
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, active ? 'active' : false, disabled ? 'disabled' : false, action ? 'list-group-item-action' : false, color ? `list-group-item-${color}` : false, 'list-group-item'), cssModule);

  // Prevent click event when disabled.
  if (disabled) {
    attributes.onClick = handleDisabledOnClick;
  }
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
ListGroupItem.propTypes = propTypes;
var _default = ListGroupItem;
exports.default = _default;