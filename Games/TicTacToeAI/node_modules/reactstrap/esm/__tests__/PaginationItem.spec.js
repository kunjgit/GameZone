import React from 'react';
import { shallow, mount } from 'enzyme';
import { PaginationItem } from '..';
describe('PaginationItem', function () {
  it('should render default tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PaginationItem, null));
    expect(wrapper.find('li').hostNodes().length).toBe(1);
  });
  it('should render custom tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PaginationItem, {
      tag: "main"
    }));
    expect(wrapper.find('main').hostNodes().length).toBe(1);
  });
  it('should render with "page-item" class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationItem, null));
    expect(wrapper.hasClass('page-item')).toBe(true);
  });
  it('should render active state', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationItem, {
      active: true
    }));
    expect(wrapper.hasClass('active')).toBe(true);
  });
  it('should render disabled state', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationItem, {
      disabled: true
    }));
    expect(wrapper.hasClass('disabled')).toBe(true);
  });
});