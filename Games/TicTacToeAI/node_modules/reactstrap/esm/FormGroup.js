var _excluded = ["className", "cssModule", "row", "disabled", "check", "inline", "floating", "tag", "switch"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  children: PropTypes.node,
  row: PropTypes.bool,
  check: PropTypes.bool,
  "switch": PropTypes.bool,
  inline: PropTypes.bool,
  floating: PropTypes.bool,
  disabled: PropTypes.bool,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object
};
function FormGroup(props) {
  var className = props.className,
    cssModule = props.cssModule,
    row = props.row,
    disabled = props.disabled,
    check = props.check,
    inline = props.inline,
    floating = props.floating,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    switchProp = props["switch"],
    attributes = _objectWithoutProperties(props, _excluded);
  var formCheck = check || switchProp;
  var classes = mapToCssModules(classNames(className, row ? 'row' : false, formCheck ? 'form-check' : 'mb-3', switchProp ? 'form-switch' : false, formCheck && inline ? 'form-check-inline' : false, formCheck && disabled ? 'disabled' : false, floating && 'form-floating'), cssModule);
  if (Tag === 'fieldset') {
    attributes.disabled = disabled;
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
FormGroup.propTypes = propTypes;
export default FormGroup;