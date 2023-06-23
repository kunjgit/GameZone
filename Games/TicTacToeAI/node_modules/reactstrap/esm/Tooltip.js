function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, { propTypes } from './TooltipPopoverWrapper';
var defaultProps = {
  placement: 'top',
  autohide: true,
  placementPrefix: 'bs-tooltip',
  trigger: 'hover focus'
};
function Tooltip(props) {
  var popperClasses = classNames('tooltip', 'show', props.popperClassName);
  var classes = classNames('tooltip-inner', props.innerClassName);
  return /*#__PURE__*/React.createElement(TooltipPopoverWrapper, _extends({}, props, {
    arrowClassName: "tooltip-arrow",
    popperClassName: popperClasses,
    innerClassName: classes
  }));
}
Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;
export default Tooltip;