"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customDropdownRender = void 0;
exports.testForChildrenInComponent = testForChildrenInComponent;
exports.testForCustomAttribute = testForCustomAttribute;
exports.testForCustomClass = testForCustomClass;
exports.testForCustomTag = testForCustomTag;
exports.testForDefaultClass = testForDefaultClass;
exports.testForDefaultTag = testForDefaultTag;
var _react = require("@testing-library/react");
require("@testing-library/jest-dom");
var _react2 = _interopRequireDefault(require("react"));
var _DropdownContext = require("./DropdownContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function testForCustomClass(Component, props = {}) {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, _extends({}, props, {
    "data-testid": "test",
    className: "custom-class"
  })));
  const node = _react.screen.getByTestId('test');
  expect(node).toHaveClass('custom-class');
}
function testForCustomTag(Component, props = {}, tag = 'h1') {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, _extends({}, props, {
    tag: tag,
    "data-testid": "test"
  })));
  const node = _react.screen.getByTestId('test');
  expect(node.tagName.toLowerCase()).toMatch(tag);
}
function testForCustomAttribute(Component, props = {}) {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, _extends({}, props, {
    "data-testid": "test",
    "custom-attribute": "custom-value"
  })));
  const node = _react.screen.getByTestId('test');
  expect(node).toHaveAttribute('custom-attribute', 'custom-value');
}
function testForDefaultTag(Component, tag) {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, {
    "data-testid": "test"
  }));
  const node = _react.screen.getByTestId('test');
  expect(node.tagName.toLowerCase()).toMatch(tag);
}
function testForDefaultClass(Component, className) {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, {
    "data-testid": "test"
  }));
  const node = _react.screen.getByTestId('test');
  expect(node).toHaveClass(className);
}
function testForChildrenInComponent(Component) {
  (0, _react.render)( /*#__PURE__*/_react2.default.createElement(Component, null, "Yo!"));
  expect(_react.screen.getByText('Yo!')).toBeInTheDocument();
}

// Custom render for Dropdown with provider props
const customDropdownRender = (ui, providerProps) => {
  return (0, _react.render)( /*#__PURE__*/_react2.default.createElement(_DropdownContext.DropdownContext.Provider, {
    value: providerProps
  }, ui));
};
exports.customDropdownRender = customDropdownRender;