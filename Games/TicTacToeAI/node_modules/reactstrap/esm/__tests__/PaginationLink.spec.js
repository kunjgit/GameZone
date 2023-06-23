import React from 'react';
import { shallow, mount } from 'enzyme';
import { PaginationLink } from '..';
describe('PaginationLink', function () {
  it('should render default `a` tag when `href` is present', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PaginationLink, {
      href: "#"
    }));
    expect(wrapper.find('a').hostNodes().length).toBe(1);
  });
  it('should render default `button` tag when no `href` is present', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PaginationLink, null));
    expect(wrapper.find('button').hostNodes().length).toBe(1);
  });
  it('should render custom tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PaginationLink, {
      tag: "span"
    }));
    expect(wrapper.find('span').hostNodes().length).toBe(1);
  });
  it('should render with "page-link" class', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, null));
    expect(wrapper.hasClass('page-link')).toBe(true);
  });
  it('should render previous', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      previous: true
    }));
    expect(wrapper.prop('aria-label')).toBe('Previous');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\u2039");
    expect(wrapper.find('.visually-hidden').text()).toBe('Previous');
  });
  it('should render next', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      next: true
    }));
    expect(wrapper.prop('aria-label')).toBe('Next');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\u203A");
    expect(wrapper.find('.visually-hidden').text()).toBe('Next');
  });
  it('should render default previous caret with children as an empty array', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      previous: true,
      children: []
    }));
    expect(wrapper.prop('aria-label')).toBe('Previous');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\u2039");
    expect(wrapper.find('.visually-hidden').text()).toBe('Previous');
  });
  it('should render default next caret with children as an empty array', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      next: true,
      children: []
    }));
    expect(wrapper.prop('aria-label')).toBe('Next');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\u203A");
    expect(wrapper.find('.visually-hidden').text()).toBe('Next');
  });
  it('should render custom aria label', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      next: true,
      "aria-label": "Yo"
    }));
    expect(wrapper.prop('aria-label')).toBe('Yo');
    expect(wrapper.find('.visually-hidden').text()).toBe('Yo');
  });
  it('should render custom caret specified as a string', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      next: true
    }, "Yo"));
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe('Yo');
  });
  it('should render custom caret specified as a component', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      next: true
    }, /*#__PURE__*/React.createElement("span", null, "Yo")));
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe('Yo');
  });
  it('should render first', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      first: true
    }));
    expect(wrapper.prop('aria-label')).toBe('First');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\xAB");
    expect(wrapper.find('.visually-hidden').text()).toBe('First');
  });
  it('should render last', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      last: true
    }));
    expect(wrapper.prop('aria-label')).toBe('Last');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\xBB");
    expect(wrapper.find('.visually-hidden').text()).toBe('Last');
  });
  it('should render default first caret with children as an empty array', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      first: true,
      children: []
    }));
    expect(wrapper.prop('aria-label')).toBe('First');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\xAB");
    expect(wrapper.find('.visually-hidden').text()).toBe('First');
  });
  it('should render default last caret with children as an empty array', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PaginationLink, {
      last: true,
      children: []
    }));
    expect(wrapper.prop('aria-label')).toBe('Last');
    expect(wrapper.find({
      'aria-hidden': 'true'
    }).text()).toBe("\xBB");
    expect(wrapper.find('.visually-hidden').text()).toBe('Last');
  });
});