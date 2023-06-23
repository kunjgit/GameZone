var _excluded = ["cssModule", "className", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import Button from './Button';
import { getColumnClasses } from './Col';
var propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  className: PropTypes.string,
  tag: tagPropType,
  cssModule: PropTypes.object
};
function PlaceholderButton(props) {
  var cssModule = props.cssModule,
    className = props.className,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? Button : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var _getColumnClasses = getColumnClasses(_objectSpread({
      color: 'primary'
    }, attributes), cssModule),
    modifiedAttributes = _getColumnClasses.attributes,
    colClasses = _getColumnClasses.colClasses;
  var classes = mapToCssModules(classNames('placeholder', className, colClasses), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, modifiedAttributes, {
    className: classes,
    disabled: true
  }));
}
PlaceholderButton.propTypes = propTypes;
export default PlaceholderButton;