var _excluded = ["className", "cssModule", "tag", "type", "size"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import Dropdown from './Dropdown';
import { InputGroupContext } from './InputGroupContext';
var propTypes = {
  /** Add custom class */
  className: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Sets size of InputGroup */
  size: PropTypes.string,
  /** Set a custom element for this component */
  tag: tagPropType,
  type: PropTypes.string
};
function InputGroup(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    type = props.type,
    size = props.size,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'input-group', size ? "input-group-".concat(size) : null), cssModule);
  if (props.type === 'dropdown') {
    return /*#__PURE__*/React.createElement(Dropdown, _extends({}, attributes, {
      className: classes
    }));
  }
  return /*#__PURE__*/React.createElement(InputGroupContext.Provider, {
    value: {
      insideInputGroup: true
    }
  }, /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  })));
}
InputGroup.propTypes = propTypes;
export default InputGroup;