import React from 'react';
import { shallow, mount } from 'enzyme';
import { Pagination } from '..';
describe('Pagination', function () {
  it('should render "nav" tag by default', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Pagination, null));
    expect(wrapper.find('nav').hostNodes().length).toBe(1);
  });
  it('should render default list tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Pagination, null));
    expect(wrapper.children().find('ul').hostNodes().length).toBe(1);
  });
  it('should render custom tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(Pagination, {
      tag: "main"
    }));
    expect(wrapper.find('main').hostNodes().length).toBe(1);
  });
  it('should render with "pagination" class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Pagination, null));
    expect(wrapper.children().hasClass('pagination')).toBe(true);
  });
  it('should render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(Pagination, null, "Ello world"));
    expect(wrapper.text()).toBe('Ello world');
  });
  it('should render pagination at different sizes', function () {
    var small = shallow( /*#__PURE__*/React.createElement(Pagination, {
      size: "sm"
    }));
    var large = shallow( /*#__PURE__*/React.createElement(Pagination, {
      size: "lg"
    }));
    expect(small.children().hasClass('pagination-sm')).toBe(true);
    expect(large.children().hasClass('pagination-lg')).toBe(true);
  });
});