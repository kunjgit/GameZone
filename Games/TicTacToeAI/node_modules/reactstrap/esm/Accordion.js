var _excluded = ["flush", "open", "toggle", "className", "cssModule", "tag", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
import { AccordionContext } from './AccordionContext';
var propTypes = {
  children: PropTypes.node,
  /** Add custom class */
  className: PropTypes.string,
  /** Change existing className with a new className */
  cssModule: PropTypes.object,
  /** Render accordions edge-to-edge with their parent container */
  flush: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  /** The current active key that corresponds to the currently expanded card */
  open: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Function that's triggered on clicking `AccordionHeader` */
  toggle: PropTypes.func.isRequired
};
function Accordion(props) {
  var flush = props.flush,
    open = props.open,
    toggle = props.toggle,
    className = props.className,
    cssModule = props.cssModule,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'div' : _props$tag,
    innerRef = props.innerRef,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, 'accordion', {
    'accordion-flush': flush
  }), cssModule);
  var accordionContext = useMemo(function () {
    return {
      open: open,
      toggle: toggle
    };
  });
  return /*#__PURE__*/React.createElement(AccordionContext.Provider, {
    value: accordionContext
  }, /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes,
    ref: innerRef
  })));
}
Accordion.propTypes = propTypes;
export default Accordion;