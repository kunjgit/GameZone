import React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from '..';
describe('NavLink', function () {
  it('should render .nav-link markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, null));
    expect(wrapper.html()).toBe('<a class="nav-link"></a>');
  });
  it('should render custom tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      tag: "div"
    }));
    expect(wrapper.html()).toBe('<div class="nav-link"></div>');
  });
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, null, "Children"));
    expect(wrapper.html()).toBe('<a class="nav-link">Children</a>');
  });
  it('should pass additional classNames', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      className: "extra"
    }));
    expect(wrapper.hasClass('extra')).toBe(true);
    expect(wrapper.hasClass('nav-link')).toBe(true);
  });
  it('should render active class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      active: true
    }));
    expect(wrapper.hasClass('active')).toBe(true);
  });
  it('should render disabled markup', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      disabled: true
    }));
    expect(wrapper.hasClass('disabled')).toBe(true);
  });
  it('handles onClick prop', function () {
    var onClick = jest.fn();
    var e = createSpyObj('e', ['preventDefault']);
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      onClick: onClick
    }));
    wrapper.find('a').simulate('click', e);
    expect(onClick).toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
  it('handles onClick events', function () {
    var e = createSpyObj('e', ['preventDefault']);
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, null));
    wrapper.find('a').simulate('click', e);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
  it('prevents link clicks via onClick for dropdown nav-items', function () {
    var e = createSpyObj('e', ['preventDefault']);
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      href: "#"
    }));
    wrapper.find('a').simulate('click', e);
    expect(e.preventDefault).toHaveBeenCalled();
  });
  it('is not called when disabled', function () {
    var onClick = jest.fn();
    var e = createSpyObj('e', ['preventDefault']);
    var wrapper = shallow( /*#__PURE__*/React.createElement(NavLink, {
      disabled: true,
      onClick: onClick
    }));
    wrapper.find('a').simulate('click', e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});