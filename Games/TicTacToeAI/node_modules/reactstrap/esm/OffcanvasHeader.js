var _excluded = ["children", "className", "close", "closeAriaLabel", "cssModule", "tag", "toggle", "wrapTag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  close: PropTypes.object,
  closeAriaLabel: PropTypes.string,
  cssModule: PropTypes.object,
  tag: tagPropType,
  toggle: PropTypes.func,
  wrapTag: tagPropType
};
function OffcanvasHeader(props) {
  var closeButton;
  var children = props.children,
    className = props.className,
    close = props.close,
    _props$closeAriaLabel = props.closeAriaLabel,
    closeAriaLabel = _props$closeAriaLabel === void 0 ? 'Close' : _props$closeAriaLabel,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'h5' : _props$tag,
    toggle = props.toggle,
    _props$wrapTag = props.wrapTag,
    WrapTag = _props$wrapTag === void 0 ? 'div' : _props$wrapTag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'offcanvas-header'), cssModule);
  if (!close && toggle) {
    closeButton = /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: toggle,
      className: mapToCssModules('btn-close', cssModule),
      "aria-label": closeAriaLabel
    });
  }
  return /*#__PURE__*/React.createElement(WrapTag, _extends({}, attributes, {
    className: classes
  }), /*#__PURE__*/React.createElement(Tag, {
    className: mapToCssModules('offcanvas-title', cssModule)
  }, children), close || closeButton);
}
OffcanvasHeader.propTypes = propTypes;
export default OffcanvasHeader;