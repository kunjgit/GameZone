function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { DropdownContext } from './DropdownContext';
export function testForCustomClass(Component) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  render( /*#__PURE__*/React.createElement(Component, _extends({}, props, {
    "data-testid": "test",
    className: "custom-class"
  })));
  var node = screen.getByTestId('test');
  expect(node).toHaveClass('custom-class');
}
export function testForCustomTag(Component) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'h1';
  render( /*#__PURE__*/React.createElement(Component, _extends({}, props, {
    tag: tag,
    "data-testid": "test"
  })));
  var node = screen.getByTestId('test');
  expect(node.tagName.toLowerCase()).toMatch(tag);
}
export function testForCustomAttribute(Component) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  render( /*#__PURE__*/React.createElement(Component, _extends({}, props, {
    "data-testid": "test",
    "custom-attribute": "custom-value"
  })));
  var node = screen.getByTestId('test');
  expect(node).toHaveAttribute('custom-attribute', 'custom-value');
}
export function testForDefaultTag(Component, tag) {
  render( /*#__PURE__*/React.createElement(Component, {
    "data-testid": "test"
  }));
  var node = screen.getByTestId('test');
  expect(node.tagName.toLowerCase()).toMatch(tag);
}
export function testForDefaultClass(Component, className) {
  render( /*#__PURE__*/React.createElement(Component, {
    "data-testid": "test"
  }));
  var node = screen.getByTestId('test');
  expect(node).toHaveClass(className);
}
export function testForChildrenInComponent(Component) {
  render( /*#__PURE__*/React.createElement(Component, null, "Yo!"));
  expect(screen.getByText('Yo!')).toBeInTheDocument();
}

// Custom render for Dropdown with provider props
export var customDropdownRender = function customDropdownRender(ui, providerProps) {
  return render( /*#__PURE__*/React.createElement(DropdownContext.Provider, {
    value: providerProps
  }, ui));
};