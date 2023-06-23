var _excluded = ["active", "aria-label", "block", "className", "close", "cssModule", "color", "outline", "size", "tag", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import CloseButton from './CloseButton';
var propTypes = {
  /** Manually set the visual state of the button to active */
  active: PropTypes.bool,
  /** Aria label */
  'aria-label': PropTypes.string,
  block: PropTypes.bool,
  /** Pass children so this component can wrap them */
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  /** Use the button as a close button */
  close: PropTypes.bool,
  /** Change color of Button to one of the available colors */
  color: PropTypes.string,
  /** Disables the button */
  disabled: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  /** Function to be triggered on click */
  onClick: PropTypes.func,
  /** Adds outline to the button */
  outline: PropTypes.bool,
  /** Make the button bigger or smaller */
  size: PropTypes.string,
  /** Set a custom element for this component */
  tag: tagPropType
};
function Button(props) {
  var onClick = useCallback(function (e) {
    if (props.disabled) {
      e.preventDefault();
      return;
    }
    if (props.onClick) {
      return props.onClick(e);
    }
  }, [props.onClick, props.disabled]);
  var active = props.active,
    ariaLabel = props['aria-label'],
    block = props.block,
    className = props.className,
    close = props.close,
    cssModule = props.cssModule,
    _props$color = props.color,
    color = _props$color === void 0 ? 'secondary' : _props$color,
    outline = props.outline,
    size = props.size,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'button' : _props$tag,
    innerRef = props.innerRef,
    attributes = _objectWithoutProperties(props, _excluded);
  if (close) {
    return /*#__PURE__*/React.createElement(CloseButton, attributes);
  }
  var btnOutlineColor = "btn".concat(outline ? '-outline' : '', "-").concat(color);
  var classes = mapToCssModules(classNames(className, 'btn', btnOutlineColor, size ? "btn-".concat(size) : false, block ? 'd-block w-100' : false, {
    active: active,
    disabled: props.disabled
  }), cssModule);
  if (attributes.href && Tag === 'button') {
    Tag = 'a';
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: Tag === 'button' && attributes.onClick ? 'button' : undefined
  }, attributes, {
    className: classes,
    ref: innerRef,
    onClick: onClick,
    "aria-label": ariaLabel
  }));
}
Button.propTypes = propTypes;
export default Button;