import React from 'react';
import { createEvent, fireEvent, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { DropdownToggle } from '..';
import { customDropdownRender } from '../testUtils';
describe('DropdownToggle', function () {
  var isOpen;
  var inNavbar;
  var toggle;
  var contextProps = {
    isOpen: false,
    direction: 'down',
    inNavbar: false,
    toggle: jest.fn()
  };
  beforeEach(function () {
    contextProps.isOpen = false;
    contextProps.direction = 'down';
    contextProps.inNavbar = false;
    contextProps.toggle.mockClear();
  });
  it('should wrap text', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toBeInTheDocument();
  });
  it('should add default visually-hidden content', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, null), contextProps);
    expect(screen.getByText(/toggle dropdown/i)).toHaveClass('visually-hidden');
  });
  it('should add default visually-hidden content', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
      "aria-label": "Dropup Toggle"
    }), contextProps);
    expect(screen.getByText(/dropup toggle/i)).toHaveClass('visually-hidden');
  });
  it('should render elements', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, null, "Click Me"), contextProps);
    expect(screen.getByText(/click me/i).tagName).toBe('BUTTON');
  });
  it('should render a caret', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
      caret: true
    }, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown-toggle');
  });
  describe('color', function () {
    it('should render the dropdown as a BUTTON element with default color secondary', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        "data-testid": "rick"
      }), contextProps);
      expect(screen.getByTestId(/rick/i)).toHaveClass('btn-secondary');
    });
    it('should render the dropdown as a BUTTON element with explicit color success', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        color: "success",
        "data-testid": "morty"
      }), contextProps);
      expect(screen.getByTestId(/morty/i)).toHaveClass('btn-success');
    });
    it('should render the dropdown as an A element with no color attribute', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        tag: "a",
        "data-testid": "pickle-rick"
      }), contextProps);
      expect(screen.getByTestId(/pickle-rick/i).tagName).toBe('A');
      expect(screen.getByTestId(/pickle-rick/i)).not.toHaveAttribute('color');
    });
    it('should render the dropdown as a DIV element with no color attribute', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        tag: "div",
        color: "success",
        "data-testid": "tiny-rick"
      }), contextProps);
      expect(screen.getByTestId(/tiny-rick/i).tagName).toBe('DIV');
      expect(screen.getByTestId(/tiny-rick/i)).not.toHaveAttribute('color');
    });
  });
  it('should render a split', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
      split: true
    }, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown-toggle-split');
  });
  describe('onClick', function () {
    it('should call props.onClick if it exists', function () {
      var onClick = jest.fn();
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        onClick: onClick
      }, "Ello world"), contextProps);
      user.click(screen.getByText(/ello world/i));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('should call context.toggle when present ', function () {
      contextProps.toggle = jest.fn();
      var _customDropdownRender = customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, null, "Ello world"), contextProps),
        container = _customDropdownRender.container;
      user.click(screen.getByText(/ello world/i));
      expect(contextProps.toggle).toHaveBeenCalledTimes(1);
    });
  });
  describe('disabled', function () {
    it('should not call onClick when disabled', function () {
      var onClick = jest.fn();
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        disabled: true,
        onClick: onClick
      }, "Ello world"), contextProps);
      user.click(screen.getByText(/ello world/i));
      expect(onClick).not.toBeCalled();
    });
  });
  describe('nav', function () {
    it('should add .nav-link class', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        nav: true
      }, "Ello world"), contextProps);
      expect(screen.getByText(/ello world/i)).toHaveClass('nav-link');
      expect(screen.getByText(/ello world/i).tagName).toBe('A');
    });
    it('should preventDefault', function () {
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownToggle, {
        nav: true
      }, "Ello world"), contextProps);
      var node = screen.getByText(/ello world/i);
      var click = createEvent.click(node);
      fireEvent(node, click);
      expect(click.defaultPrevented).toBeTruthy();
    });
  });
});