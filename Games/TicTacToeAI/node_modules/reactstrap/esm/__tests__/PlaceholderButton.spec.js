import React from 'react';
import { shallow } from 'enzyme';
import { PlaceholderButton } from '..';
describe('PlaceholderButton', function () {
  it('should render a placeholder', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PlaceholderButton, null));
    expect(wrapper.hasClass('placeholder')).toBe(true);
  });
  it('should render size', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PlaceholderButton, {
      xs: 6
    }));
    expect(wrapper.hasClass('col-6')).toBe(true);
  });
});