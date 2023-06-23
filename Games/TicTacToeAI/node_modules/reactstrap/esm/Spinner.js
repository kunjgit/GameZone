var _excluded = ["className", "cssModule", "type", "size", "color", "children", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Change animation of spinner */
  type: PropTypes.oneOf(['border', 'grow']),
  /** Change size of spinner */
  size: PropTypes.oneOf(['sm']),
  /** Change color of spinner */
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  /** Add custom class */
  className: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  /** Pass children so this component can wrap the child elements */
  children: PropTypes.string
};
function Spinner(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$type = props.type,
    type = _props$type === void 0 ? 'border' : _props$type,
    size = props.size,
    color = props.color,
    _props$children = props.children,
    children = _props$children === void 0 ? 'Loading...' : _props$children,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, size ? "spinner-".concat(type, "-").concat(size) : false, "spinner-".concat(type), color ? "text-".concat(color) : false), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({
    role: "status"
  }, attributes, {
    className: classes
  }), children && /*#__PURE__*/React.createElement("span", {
    className: mapToCssModules('visually-hidden', cssModule)
  }, children));
}
Spinner.propTypes = propTypes;
export default Spinner;