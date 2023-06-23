var _excluded = ["className", "cssModule", "tag", "active", "disabled", "action", "color"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Add action prop to give effects while hovering over element */
  action: PropTypes.bool,
  /** Add active prop to make the current selection active */
  active: PropTypes.bool,
  /** Add custom class */
  className: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Add background colour to the list item */
  color: PropTypes.string,
  /** Make the list item appear disabled */
  disabled: PropTypes.bool,
  /** Set a custom element for this component */
  tag: tagPropType
};
var handleDisabledOnClick = function handleDisabledOnClick(e) {
  e.preventDefault();
};
function ListGroupItem(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'li' : _props$tag,
    active = props.active,
    disabled = props.disabled,
    action = props.action,
    color = props.color,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, active ? 'active' : false, disabled ? 'disabled' : false, action ? 'list-group-item-action' : false, color ? "list-group-item-".concat(color) : false, 'list-group-item'), cssModule);

  // Prevent click event when disabled.
  if (disabled) {
    attributes.onClick = handleDisabledOnClick;
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
ListGroupItem.propTypes = propTypes;
export default ListGroupItem;