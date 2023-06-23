import React from 'react';
import { shallow } from 'enzyme';
import { NavItem } from '..';
describe('NavItem', function () {
  it('should render .nav-item markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavItem, null));
    expect(wrapper.html()).toBe('<li class="nav-item"></li>');
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavItem, {
      tag: "div"
    }));
    expect(wrapper.html()).toBe('<div class="nav-item"></div>');
  });
  it('sholid render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavItem, null, "Children"));
    expect(wrapper.html()).toBe('<li class="nav-item">Children</li>');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavItem, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
    expect(wrapper.hasClass('nav-item')).toBe(true);
  });
  it('should render active class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavItem, {
      active: true
    }));
    expect(wrapper.hasClass('active')).toBe(true);
  });
});