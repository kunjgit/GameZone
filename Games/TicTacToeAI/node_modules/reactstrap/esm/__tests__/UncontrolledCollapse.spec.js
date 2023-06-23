import React from 'react';
import { mount, shallow } from 'enzyme';
import { Collapse, UncontrolledCollapse } from '..';
describe('UncontrolledCollapse', function () {
  var toggler;
  var togglers;
  beforeEach(function () {
    document.body.innerHTML = "\n      <div>\n        <button id=\"toggler\">Click Me</button>\n        <button class=\"toggler\">Toggler 1</button>\n        <button class=\"toggler\">Toggler 2</button>\n      </div>";
    toggler = document.getElementById('toggler');
    togglers = document.getElementsByClassName('toggler');
  });
  afterEach(function () {
    if (jest.isMockFunction(UncontrolledCollapse.prototype.toggle)) {
      UncontrolledCollapse.prototype.toggle.mockRestore();
    }
    document.body.innerHTML = '';
    toggler = null;
    togglers = null;
  });
  it('should be a Collapse', function () {
    var collapse = shallow( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: "#toggler"
    }, "Yo!"));
    expect(collapse.type()).toBe(Collapse);
  });
  it('should have isOpen default to false', function () {
    var collapse = shallow( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: "#toggler"
    }, "Yo!"));
    expect(collapse.prop('isOpen')).toBe(false);
  });
  it('should toggle isOpen when toggle is called', function () {
    var collapse = shallow( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: "#toggler"
    }, "Yo!"));
    toggler.click();
    collapse.update();
    expect(collapse.prop('isOpen')).toBe(true);
  });
  it('should call toggle when toggler is clicked', function () {
    jest.spyOn(UncontrolledCollapse.prototype, 'toggle');
    mount( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: "#toggler"
    }, "Yo!"));
    expect(UncontrolledCollapse.prototype.toggle.mock.calls.length).toBe(0);
    toggler.click();
    expect(UncontrolledCollapse.prototype.toggle.mock.calls.length).toBe(1);
  });
  it('should toggle for multiple togglers', function () {
    var collapse = shallow( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: ".toggler"
    }, "Yo!"));
    expect(collapse.prop('isOpen')).toBe(false);
    togglers[0].click();
    collapse.update();
    expect(collapse.prop('isOpen')).toBe(true);
    togglers[1].click();
    collapse.update();
    expect(collapse.prop('isOpen')).toBe(false);
  });
  it('should remove eventListeners when unmounted', function () {
    jest.spyOn(UncontrolledCollapse.prototype, 'componentWillUnmount');
    jest.spyOn(UncontrolledCollapse.prototype, 'toggle');
    var wrapper = mount( /*#__PURE__*/React.createElement(UncontrolledCollapse, {
      toggler: "#toggler"
    }, "Yo!"));
    expect(UncontrolledCollapse.prototype.toggle.mock.calls.length).toBe(0);
    expect(UncontrolledCollapse.prototype.componentWillUnmount.mock.calls.length).toBe(0);
    toggler.click();
    expect(UncontrolledCollapse.prototype.toggle.mock.calls.length).toBe(1);
    wrapper.unmount();
    expect(UncontrolledCollapse.prototype.componentWillUnmount.mock.calls.length).toBe(1);
    toggler.click();
    expect(UncontrolledCollapse.prototype.toggle.mock.calls.length).toBe(1);
  });
});