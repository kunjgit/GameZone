import React from 'react';
import { shallow } from 'enzyme';
import { NavbarToggler } from '..';
describe('NavbarToggler', function () {
  it('should render .navbar-toggler markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarToggler, null));
    expect(wrapper.prop('aria-label')).toBe('Toggle navigation');
    expect(wrapper.html()).toBe('<button aria-label="Toggle navigation" type="button" class="navbar-toggler"><span class="navbar-toggler-icon"></span></button>');
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarToggler, {
      tag: "div"
    }));
    expect(wrapper.html()).toBe('<div aria-label="Toggle navigation" type="button" class="navbar-toggler"><span class="navbar-toggler-icon"></span></div>');
  });
  it('should render children instead of navbar-toggler-icon ', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarToggler, null, "Children"));
    expect(wrapper.html()).toBe('<button aria-label="Toggle navigation" type="button" class="navbar-toggler">Children</button>');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavbarToggler, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
    expect(wrapper.hasClass('navbar-toggler')).toBe(true);
  });
});