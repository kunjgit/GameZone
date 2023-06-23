function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import classNames from 'classnames';
import TooltipPopoverWrapper, { propTypes } from './TooltipPopoverWrapper';
var defaultProps = {
  placement: 'right',
  placementPrefix: 'bs-popover',
  trigger: 'click',
  offset: [0, 8]
};
function Popover(props) {
  var popperClasses = classNames('popover', 'show', props.popperClassName);
  var classes = classNames('popover-inner', props.innerClassName);
  return /*#__PURE__*/React.createElement(TooltipPopoverWrapper, _extends({}, props, {
    arrowClassName: "popover-arrow",
    popperClassName: popperClasses,
    innerClassName: classes
  }));
}
Popover.propTypes = propTypes;
Popover.defaultProps = defaultProps;
export default Popover;