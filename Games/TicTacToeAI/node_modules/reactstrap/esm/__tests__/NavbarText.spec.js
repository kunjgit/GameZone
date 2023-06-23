import React from 'react';
import { shallow } from 'enzyme';
import { NavbarText } from '..';
describe('NavbarText', function () {
  it('should render .navbar-text markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarText, null));
    expect(wrapper.html()).toBe('<span class="navbar-text"></span>');
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarText, {
      tag: "div"
    }));
    expect(wrapper.html()).toBe('<div class="navbar-text"></div>');
  });
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarText, null, "Children"));
    expect(wrapper.html()).toBe('<span class="navbar-text">Children</span>');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarText, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
    expect(wrapper.hasClass('navbar-text')).toBe(true);
  });
});