import React from 'react';
import { screen } from '@testing-library/react';
import { Popper } from 'react-popper';
import '@testing-library/jest-dom';
import { DropdownMenu } from '..';
import { customDropdownRender } from '../testUtils';
describe('DropdownMenu', function () {
  var contextProps = {
    isOpen: false,
    direction: 'down',
    inNavbar: false
  };
  beforeEach(function () {
    contextProps.isOpen = false;
    contextProps.direction = 'down';
    contextProps.inNavbar = false;
    Popper.mockClear();
  });
  it('should render children', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Content"), contextProps);
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });
  it('should not have the class "show" when isOpen context is false', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Content"), contextProps);
    expect(screen.getByText(/content/i)).not.toHaveClass('show');
  });
  it('should have the class "show" when isOpen context is true', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Content"), contextProps);
    expect(screen.getByText(/content/i)).toHaveClass('show');
  });
  it('should render left aligned menus by default', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).not.toHaveClass('dropdown-menu-end');
  });
  it('should render right aligned menus', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      end: true
    }, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown-menu-end');
  });
  it('should render down when direction is unknown on the context', function () {
    contextProps.isOpen = true;
    contextProps.direction = 'unknown';
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute('data-popper-placement', 'bottom-start');
  });
  it('should render down when direction is "down" on the context', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute('data-popper-placement', 'bottom-start');
  });
  it('should render up when direction is "up" on the context', function () {
    contextProps.isOpen = true;
    contextProps.direction = 'up';
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute('data-popper-placement', 'top-start');
    // expect(wrapper.find(Popper).prop('placement')).toBe('top-start');
  });

  it('should render left when direction is "start" on the context', function () {
    contextProps.isOpen = true;
    contextProps.direction = 'start';
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute('data-popper-placement', 'left-start');
    // expect(wrapper.find(Popper).prop('placement')).toBe('left-start');
  });

  it('should render right when direction is "end" on the context', function () {
    contextProps.isOpen = true;
    contextProps.direction = 'end';
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(screen.getByText(/ello world/i)).toHaveAttribute('data-popper-placement', 'right-start');
    // expect(wrapper.find(Popper).prop('placement')).toBe('right-start');
  });

  it('should not disable flip modifier by default', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Ello world"), contextProps);
    expect(Popper.mock.calls[0][0].modifiers[0]).toMatchObject({
      name: 'flip',
      enabled: true
    });
  });
  it('should disable flip modifier when flip is false', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      flip: false
    }, "Ello world"), contextProps);
    expect(Popper.mock.calls.length).toBe(1);
    expect(Popper.mock.calls[0][0].modifiers[0]).toMatchObject({
      name: 'flip',
      enabled: false
    });
  });
  it('should position using fixed mode', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      strategy: "fixed"
    }, "Ello world"), contextProps);
    expect(Popper.mock.calls[0][0].strategy).toBe('fixed');
  });
  it('should not render Popper when isOpen is false', function () {
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      end: true
    }, "Ello world"), contextProps);
    expect(Popper).not.toBeCalled();
  });
  it('should render custom tag', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      tag: "main"
    }, "Yo!"), contextProps);
    expect(screen.getByText(/yo/i).tagName).toBe('MAIN');
  });
  describe('using container', function () {
    var element;
    beforeEach(function () {
      element = document.createElement('div');
      document.body.appendChild(element);
    });
    afterEach(function () {
      document.body.removeChild(element);
      element = null;
    });
    it('should render inside container', function () {
      contextProps.isOpen = true;
      element.innerHTML = '<div id="anotherContainer"></div>';
      customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
        container: "#anotherContainer"
      }, "My body"), contextProps);
      expect(document.getElementById('anotherContainer').innerHTML).toContain('My body');
    });
  });
  it('should not have the class "dropdown-menu-dark" by default', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, null, "Keep it light"), contextProps);
    expect(screen.getByText(/keep it light/i)).not.toHaveClass('dropdown-menu-dark');
  });
  it('should have the class "dropdown-menu-dark" when dark is true', function () {
    contextProps.isOpen = true;
    customDropdownRender( /*#__PURE__*/React.createElement(DropdownMenu, {
      dark: true,
      "data-testid": "dark-menu"
    }, "Let's go dark"), contextProps);
    expect(screen.getByTestId('dark-menu')).toHaveClass('dropdown-menu-dark');
  });
});