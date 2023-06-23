function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { DropdownItem } from '..';
import { testForChildrenInComponent, testForDefaultTag, customDropdownRender } from '../testUtils';
describe('DropdownItem', function () {
  it('should render a single child', function () {
    testForChildrenInComponent(DropdownItem);
  });
  it('should render type as "button" by default', function () {
    testForDefaultTag(DropdownItem, 'button');
  });
  it('should not render type when tag is "button" and toggle is false', function () {
    render( /*#__PURE__*/React.createElement(DropdownItem, {
      toggle: false
    }, "Home"));
    expect(screen.getByText('Home')).not.toHaveAttribute('type');
  });
  it('should render type as user defined when defined by the user', function () {
    render( /*#__PURE__*/React.createElement(DropdownItem, {
      type: "submit"
    }, "Home"));
    expect(screen.getByText('Home')).toHaveAttribute('type', 'submit');
  });
  it('should not render type by default when the type is not defined and the tag is not "button"', function () {
    render( /*#__PURE__*/React.createElement(DropdownItem, {
      tag: "a"
    }, "Home"));
    expect(screen.getByText('Home')).not.toHaveAttribute('type');
  });
  it('should render custom element', function () {
    function Link(props) {
      return /*#__PURE__*/React.createElement("a", _extends({
        href: "/home"
      }, props), props.children);
    }
    render( /*#__PURE__*/React.createElement(DropdownItem, {
      tag: Link
    }, "Home"));
    expect(screen.getByText('Home')).toHaveAttribute('href', '/home');
    expect(screen.getByText('Home').tagName.toLowerCase()).toMatch('a');
  });
  it('should render dropdown item text', function () {
    render( /*#__PURE__*/React.createElement(DropdownItem, {
      text: true
    }, "text"));
    expect(screen.getByText('text')).toHaveClass('dropdown-item-text');
    expect(screen.getByText('text').tagName.toLowerCase()).toMatch('span');
  });
  describe('header', function () {
    it('should render h6 tag heading', function () {
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        header: true
      }, "Heading"));
      expect(screen.getByText('Heading')).toHaveClass('dropdown-header');
      expect(screen.getByText('Heading').tagName.toLowerCase()).toMatch('h6');
    });
  });
  describe('active', function () {
    it('should render an active class', function () {
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        active: true,
        "data-testid": "divider"
      }));
      expect(screen.getByTestId('divider')).toHaveClass('active');
    });
  });
  describe('divider', function () {
    it('should render a divider element', function () {
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true,
        "data-testid": "divider"
      }));
      expect(screen.getByTestId('divider')).toHaveClass('dropdown-divider');
    });
  });
  describe('link (with href)', function () {
    it('should render an anchor tag', function () {
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        href: "#"
      }, "GO!"));
      expect(screen.getByText('GO!')).toHaveClass('dropdown-item');
      expect(screen.getByText('GO!').tagName.toLowerCase()).toMatch('a');
    });
  });
  describe('onClick', function () {
    it('should not be called when disabled', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true,
        onClick: onClick
      }, "Item"));
      user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });
    it('should not be called when divider is set', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true,
        onClick: onClick
      }, "Item"));
      user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });
    it('should not be called when header item', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(DropdownItem, {
        header: true,
        onClick: onClick
      }, "Item"));
      user.click(screen.getByText('Item'));
      expect(onClick).not.toHaveBeenCalled();
    });
    it('should be called when not disabled, heading, or divider', function () {
      var onClick = jest.fn();
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownItem, {
        onClick: onClick
      }, "Item"), {
        toggle: function toggle() {}
      });
      user.click(screen.getByText(/item/i));
      expect(onClick).toBeCalled();
    });
    it('should call toggle', function () {
      var toggle = jest.fn();
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownItem, {
        onClick: function onClick() {}
      }, "Item"), {
        toggle: toggle
      });
      user.click(screen.getByText(/item/i));
      expect(toggle).toHaveBeenCalled();
    });
  });
});