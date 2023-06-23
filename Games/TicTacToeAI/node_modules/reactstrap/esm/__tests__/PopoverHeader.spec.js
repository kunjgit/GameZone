import React from 'react';
import { shallow } from 'enzyme';
import { PopoverHeader } from '..';
describe('PopoverHeader', function () {
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopoverHeader, null, "Ello world"));
    expect(wrapper.text()).toBe('Ello world');
    expect(wrapper.hasClass('popover-header')).toBe(true);
  });
});