import React from 'react';
import { shallow, mount } from 'enzyme';
import { Popper } from 'react-popper';
import { PopperContent } from '..';
describe('PopperContent', function () {
  var element;
  var container;
  beforeEach(function () {
    element = document.createElement('div');
    container = document.createElement('div');
    element.innerHTML = '<p id="outerTarget">This is the popover <span id="target">target</span>.</p>';
    container.setAttribute('id', 'container');
    element.appendChild(container);
    document.body.appendChild(element);
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
    document.body.removeChild(element);
    element = null;
  });
  it('should render a null by default', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target"
    }, "Yo!"));
    expect(wrapper.type()).toBe(null);
  });
  it('should NOT render children when isOpen is false', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target"
    }, "Yo!"));
    expect(wrapper.type()).toBe(null);
  });
  it('should render children when isOpen is true and container is inline', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.text()).toBe('Yo!');
  });
  it('should render children when isOpen is true and container is inline and DOM node passed directly for target', function () {
    var targetElement = element.querySelector('#target');
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: targetElement,
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(targetElement).toBeDefined();
    expect(wrapper.text()).toBe('Yo!');
  });
  it('should render an Arrow in the Popper when isOpen is true and container is inline', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true,
      container: "inline",
      arrowClassName: "custom-arrow"
    }, "Yo!"));
    expect(wrapper.containsMatchingElement( /*#__PURE__*/React.createElement("span", {
      className: "arrow custom-arrow"
    }))).toBe(true);
  });
  it('should NOT render an Arrow in the Popper when "hideArrow" is truthy', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true,
      container: "inline",
      arrowClassName: "custom-arrow",
      hideArrow: true
    }, "Yo!"));
    expect(wrapper.containsMatchingElement( /*#__PURE__*/React.createElement("span", {
      className: "arrow custom-arrow"
    }))).toBe(false);
  });
  it('should render with "hideArrow" false by default', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target"
    }, "Yo!"));
    expect(wrapper.prop('hideArrow')).toBe(false);
  });
  it('should render with "hideArrow" true when "hideArrow" prop is truthy', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      hideArrow: true
    }, "Yo!"));
    expect(wrapper.prop('hideArrow')).toBe(true);
  });
  it('should not render children', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target"
    }, "Yo!"));
    expect(wrapper.type()).toBe(null);
  });
  it('should pass additional classNames to the popper', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(PopperContent, {
      className: "extra",
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.hasClass('extra')).toBe(true);
  });
  it('should allow custom modifiers and even allow overriding of default modifiers', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      className: "extra",
      target: "target",
      isOpen: true,
      container: "inline",
      modifiers: [{
        name: 'offset',
        options: {
          offset: [2, 2]
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: 'viewport'
        }
      }]
    }, "Yo!"));
    expect(wrapper.find(Popper).props().modifiers).toContainEqual({
      name: 'offset',
      options: {
        offset: [2, 2]
      }
    });
    expect(wrapper.find(Popper).props().modifiers).toContainEqual({
      name: 'flip',
      enabled: true,
      options: {
        fallbackPlacements: undefined
      }
    });
    expect(wrapper.find(Popper).props().modifiers).toContainEqual({
      name: 'preventOverflow',
      options: {
        boundary: 'viewport'
      }
    });
    wrapper.unmount();
  });
  it('should have data-popper-placement of auto by default', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.find('div[data-popper-placement="auto"]').exists()).toBe(true);
  });
  it('should override data-popper-placement', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      placement: "top",
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.find('div[data-popper-placement="auto"]').exists()).toBe(false);
    expect(wrapper.find('div[data-popper-placement="top"]').exists()).toBe(true);
  });
  it('should allow for a placement prefix', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      placementPrefix: "dropdown",
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.find('.dropdown-auto').exists()).toBe(true);
  });
  it('should allow for a placement prefix with custom placement', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      placementPrefix: "dropdown",
      placement: "top",
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.find('.dropdown-auto').exists()).toBe(true);
    expect(wrapper.find('div[data-popper-placement="top"]').exists()).toBe(true);
  });
  it('should render custom tag for the popper', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      tag: "main",
      target: "target",
      isOpen: true,
      container: "inline"
    }, "Yo!"));
    expect(wrapper.getDOMNode().tagName.toLowerCase()).toBe('main');
  });
  it('should allow a function to be used as children', function () {
    var renderChildren = jest.fn();
    mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true
    }, renderChildren));
    expect(renderChildren).toHaveBeenCalled();
  });
  it('should render children properly when children is a function', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(PopperContent, {
      target: "target",
      isOpen: true
    }, function () {
      return 'Yo!';
    }));
    expect(wrapper.text()).toBe('Yo!');
  });
});