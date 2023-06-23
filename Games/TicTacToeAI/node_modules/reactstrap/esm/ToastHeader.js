var _excluded = ["className", "cssModule", "children", "toggle", "tag", "wrapTag", "closeAriaLabel", "close", "tagClassName", "icon"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  tag: tagPropType,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  wrapTag: tagPropType,
  toggle: PropTypes.func,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.node,
  closeAriaLabel: PropTypes.string,
  charCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  close: PropTypes.object,
  tagClassName: PropTypes.string
};
function ToastHeader(props) {
  var closeButton;
  var icon;
  var className = props.className,
    cssModule = props.cssModule,
    children = props.children,
    toggle = props.toggle,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'strong' : _props$tag,
    _props$wrapTag = props.wrapTag,
    WrapTag = _props$wrapTag === void 0 ? 'div' : _props$wrapTag,
    _props$closeAriaLabel = props.closeAriaLabel,
    closeAriaLabel = _props$closeAriaLabel === void 0 ? 'Close' : _props$closeAriaLabel,
    close = props.close,
    _props$tagClassName = props.tagClassName,
    tagClassName = _props$tagClassName === void 0 ? 'me-auto' : _props$tagClassName,
    iconProp = props.icon,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'toast-header'), cssModule);
  if (!close && toggle) {
    closeButton = /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: toggle,
      className: mapToCssModules('btn-close', cssModule),
      "aria-label": closeAriaLabel
    });
  }
  if (typeof iconProp === 'string') {
    icon = /*#__PURE__*/React.createElement("svg", {
      className: mapToCssModules("rounded text-".concat(iconProp)),
      width: "20",
      height: "20",
      xmlns: "http://www.w3.org/2000/svg",
      preserveAspectRatio: "xMidYMid slice",
      focusable: "false",
      role: "img"
    }, /*#__PURE__*/React.createElement("rect", {
      fill: "currentColor",
      width: "100%",
      height: "100%"
    }));
  } else if (iconProp) {
    icon = iconProp;
  }
  return /*#__PURE__*/React.createElement(WrapTag, _extends({}, attributes, {
    className: classes
  }), icon, /*#__PURE__*/React.createElement(Tag, {
    className: mapToCssModules(classNames(tagClassName, {
      'ms-2': icon != null
    }), cssModule)
  }, children), close || closeButton);
}
ToastHeader.propTypes = propTypes;
export default ToastHeader;