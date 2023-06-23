import React from 'react';
import { shallow } from 'enzyme';
import { NavbarBrand } from '..';
describe('NavbarBrand', function () {
  it('should render .navbar-brand markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarBrand, null));
    expect(wrapper.html()).toBe('<a class="navbar-brand"></a>');
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarBrand, {
      tag: "div"
    }));
    expect(wrapper.html()).toBe('<div class="navbar-brand"></div>');
  });
  it('sholid render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarBrand, null, "Children"));
    expect(wrapper.html()).toBe('<a class="navbar-brand">Children</a>');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarBrand, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
    expect(wrapper.hasClass('navbar-brand')).toBe(true);
  });
});