import React from 'react';
import { mount } from 'enzyme';
import Tooltip from '../Tooltip';
describe('Tooltip', function () {
  it('should apply popperClassName to popper component', function () {
    var div = document.createElement('div');
    div.setAttribute('id', 'tooltip-target');
    document.body.appendChild(div);
    var wrapper = mount( /*#__PURE__*/React.createElement(Tooltip, {
      target: "tooltip-target",
      popperClassName: "boba-was-here"
    }, "Tooltip Content"));
    var tooltipPopoverWrapper = wrapper.find('TooltipPopoverWrapper');
    expect(tooltipPopoverWrapper.find({
      popperClassName: 'tooltip show boba-was-here'
    }).exists()).toBe(true);
  });
});