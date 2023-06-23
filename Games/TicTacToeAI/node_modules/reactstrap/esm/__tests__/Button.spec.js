function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Button } from '..';
import { testForChildrenInComponent, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('Button', function () {
  it('should render children', function () {
    testForChildrenInComponent(Button);
  });
  it('should render custom element', function () {
    function Link(props) {
      return /*#__PURE__*/React.createElement("a", _extends({
        href: "/home"
      }, props), props.children);
    }
    render( /*#__PURE__*/React.createElement(Button, {
      tag: Link
    }, "Home"));
    expect(screen.getByText(/home/i).tagName.toLowerCase()).toBe('a');
  });
  it('should render a button by default', function () {
    testForDefaultTag(Button, 'button');
  });
  it('should render an anchor element if href exists', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      href: "/home"
    }, "Home"));
    expect(screen.getByText(/home/i).tagName.toLowerCase()).toBe('a');
  });
  it('should render type as undefined by default when tag is "button"', function () {
    render( /*#__PURE__*/React.createElement(Button, null, "Home"));
    expect(screen.getByText(/home/i)).not.toHaveAttribute('type');
  });
  it('should render type as "button" by default when tag is "button" and onClick is provided', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      onClick: function onClick() {}
    }, "Home"));
    expect(screen.getByText(/home/i)).toHaveAttribute('type', 'button');
  });
  it('should render type as user defined when defined by the user', function () {
    var TYPE = 'submit';
    render( /*#__PURE__*/React.createElement(Button, {
      type: TYPE
    }, "Home"));
    expect(screen.getByText(/home/i)).toHaveAttribute('type', TYPE);
  });
  it('should not render type by default when the type is not defined and the tag is not "button"', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      tag: "a"
    }, "Home"));
    expect(screen.getByText(/home/i)).not.toHaveAttribute('type');
  });
  it('should not render type by default when the type is not defined and the href is defined', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      href: "#"
    }, "Home"));
    expect(screen.getByText(/home/i)).not.toHaveAttribute('type');
  });
  it('should render buttons with default color', function () {
    testForDefaultClass(Button, 'btn-secondary');
  });
  it('should render buttons with other colors', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      color: "danger"
    }, "Home"));
    expect(screen.getByText(/home/i)).toHaveClass('btn-danger');
  });
  it('should render buttons with outline variant', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      outline: true
    }, "Home"));
    expect(screen.getByText(/home/i)).toHaveClass('btn-outline-secondary');
  });
  it('should render buttons with outline variant with different colors', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      outline: true,
      color: "info"
    }, "Home"));
    expect(screen.getByText(/home/i)).toHaveClass('btn-outline-info');
  });
  it('should render buttons at different sizes', function () {
    render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "Small Button"), /*#__PURE__*/React.createElement(Button, {
      size: "lg"
    }, "Large Button")));
    expect(screen.getByText(/small/i)).toHaveClass('btn-sm');
    expect(screen.getByText(/large/i)).toHaveClass('btn-lg');
  });
  it('should render block level buttons', function () {
    render( /*#__PURE__*/React.createElement(Button, {
      block: true
    }, "Block Level Button"));
    expect(screen.getByText(/block/i)).toHaveClass('d-block w-100');
  });
  it('should render close icon with custom child and props', function () {
    var testChild = 'close this thing';
    render( /*#__PURE__*/React.createElement(Button, {
      close: true
    }, testChild));
    expect(screen.getByText(testChild)).toHaveClass('btn-close');
  });
  describe('onClick', function () {
    it('calls props.onClick if it exists', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(Button, {
        onClick: onClick
      }, "Testing Click"));
      user.click(screen.getByText(/testing click/i));
      expect(onClick).toHaveBeenCalled();
    });
    it('is not called when disabled', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(Button, {
        onClick: onClick,
        disabled: true
      }, "Testing Click"));
      user.click(screen.getByText(/testing click/i));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});