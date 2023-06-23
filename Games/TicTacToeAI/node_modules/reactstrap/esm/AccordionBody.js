var _excluded = ["className", "cssModule", "tag", "innerRef", "children", "accordionId"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import Collapse from './Collapse';
import { AccordionContext } from './AccordionContext';
var propTypes = {
  /** Unique key used to control item's collapse/expand */
  accordionId: PropTypes.string.isRequired,
  /** To add custom class */
  className: PropTypes.string,
  children: PropTypes.node,
  /** Change existing base class name with a new class name */
  cssModule: PropTypes.object,
  /** Pass ref to the component */
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  /** Set a custom element for this component */
  tag: tagPropType
};
function AccordionBody(props) {
  var className = props.className,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    innerRef = props.innerRef,
    children = props.children,
    accordionId = props.accordionId,
    attributes = _objectWithoutProperties(props, _excluded);
  var _useContext = useContext(AccordionContext),
    open = _useContext.open;
  var classes = mapToCssModules(classNames(className, 'accordion-collapse'), cssModule);
  return /*#__PURE__*/React.createElement(Collapse, _extends({}, attributes, {
    className: classes,
    ref: innerRef,
    isOpen: Array.isArray(open) ? open.includes(accordionId) : open === accordionId
  }), /*#__PURE__*/React.createElement(Tag, {
    className: "accordion-body"
  }, children));
}
AccordionBody.propTypes = propTypes;
export default AccordionBody;