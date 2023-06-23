"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
var _CloseButton = _interopRequireDefault(require("./CloseButton"));
const _excluded = ["active", "aria-label", "block", "className", "close", "cssModule", "color", "outline", "size", "tag", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Manually set the visual state of the button to active */
  active: _propTypes.default.bool,
  /** Aria label */
  'aria-label': _propTypes.default.string,
  block: _propTypes.default.bool,
  /** Pass children so this component can wrap them */
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change existing className with a new className */
  cssModule: _propTypes.default.object,
  /** Use the button as a close button */
  close: _propTypes.default.bool,
  /** Change color of Button to one of the available colors */
  color: _propTypes.default.string,
  /** Disables the button */
  disabled: _propTypes.default.bool,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func, _propTypes.default.string]),
  /** Function to be triggered on click */
  onClick: _propTypes.default.func,
  /** Adds outline to the button */
  outline: _propTypes.default.bool,
  /** Make the button bigger or smaller */
  size: _propTypes.default.string,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
function Button(props) {
  const onClick = (0, _react.useCallback)(e => {
    if (props.disabled) {
      e.preventDefault();
      return;
    }
    if (props.onClick) {
      return props.onClick(e);
    }
  }, [props.onClick, props.disabled]);
  let {
      active,
      'aria-label': ariaLabel,
      block,
      className,
      close,
      cssModule,
      color = 'secondary',
      outline,
      size,
      tag: Tag = 'button',
      innerRef
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  if (close) {
    return /*#__PURE__*/_react.default.createElement(_CloseButton.default, attributes);
  }
  const btnOutlineColor = `btn${outline ? '-outline' : ''}-${color}`;
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'btn', btnOutlineColor, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    active,
    disabled: props.disabled
  }), cssModule);
  if (attributes.href && Tag === 'button') {
    Tag = 'a';
  }
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({
    type: Tag === 'button' && attributes.onClick ? 'button' : undefined
  }, attributes, {
    className: classes,
    ref: innerRef,
    onClick: onClick,
    "aria-label": ariaLabel
  }));
}
Button.propTypes = propTypes;
var _default = Button;
exports.default = _default;