import React from 'react';
import { shallow } from 'enzyme';
import { PopoverBody } from '..';
describe('PopoverBody', function () {
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopoverBody, null, "Ello world"));
    expect(wrapper.text()).toBe('Ello world');
    expect(wrapper.hasClass('popover-body')).toBe(true);
  });
});