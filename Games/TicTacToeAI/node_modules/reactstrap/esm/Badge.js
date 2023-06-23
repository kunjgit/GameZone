var _excluded = ["className", "cssModule", "color", "innerRef", "pill", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Pass children so this component can wrap the child elements */
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Change background color of Badge */
  color: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  /** Add rounded corners to the Badge */
  pill: PropTypes.bool,
  /** Set a custom element for this component */
  tag: tagPropType
};
function Badge(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$color = props.color,
    color = _props$color === void 0 ? 'secondary' : _props$color,
    innerRef = props.innerRef,
    _props$pill = props.pill,
    pill = _props$pill === void 0 ? false : _props$pill,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'span' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'badge', 'bg-' + color, pill ? 'rounded-pill' : false), cssModule);
  if (attributes.href && Tag === 'span') {
    Tag = 'a';
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes,
    ref: innerRef
  }));
}
Badge.propTypes = propTypes;
export default Badge;