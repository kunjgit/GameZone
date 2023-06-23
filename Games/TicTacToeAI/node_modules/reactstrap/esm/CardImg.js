var _excluded = ["className", "cssModule", "top", "bottom", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Add `bottom` prop if image is at bottom of card */
  bottom: PropTypes.bool,
  /** Add custom class */
  className: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Add `top` prop if image is at top of card */
  top: PropTypes.bool
};
function CardImg(props) {
  var className = props.className,
    cssModule = props.cssModule,
    top = props.top,
    bottom = props.bottom,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'img' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var cardImgClassName = 'card-img';
  if (top) {
    cardImgClassName = 'card-img-top';
  }
  if (bottom) {
    cardImgClassName = 'card-img-bottom';
  }
  var classes = mapToCssModules(classNames(className, cardImgClassName), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
CardImg.propTypes = propTypes;
export default CardImg;