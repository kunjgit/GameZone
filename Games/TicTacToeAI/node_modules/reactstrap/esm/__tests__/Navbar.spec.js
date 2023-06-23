import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '..';
import { testForCustomTag } from '../testUtils';
describe('Navbar', function () {
  it('should render .navbar markup', function () {
    var _render = render( /*#__PURE__*/React.createElement(Navbar, null)),
      container = _render.container;
    expect(container).toContainHTML('<nav class="navbar" ><div class="container-fluid" /></nav>');
  });
  it('should render default .navbar-expand class', function () {
    render( /*#__PURE__*/React.createElement(Navbar, {
      "data-testid": "navBar",
      expand: true
    }));
    expect(screen.getByTestId('navBar')).toHaveClass('navbar-expand');
  });
  it('should render size based .navbar-expand-* classes', function () {
    render( /*#__PURE__*/React.createElement(Navbar, {
      "data-testid": "navBar",
      expand: "md"
    }));
    expect(screen.getByTestId('navBar')).toHaveClass('navbar-expand-md');
  });
  it('should render custom tag', function () {
    testForCustomTag(Navbar, {}, 'div');
  });
  it('should render role', function () {
    var _render2 = render( /*#__PURE__*/React.createElement(Navbar, {
        role: "navigation"
      })),
      container = _render2.container;
    expect(container).toContainHTML('<nav role="navigation" class="navbar"><div class="container-fluid"></div></nav>');
  });
  it('should support container options', function () {
    var _render3 = render( /*#__PURE__*/React.createElement(Navbar, {
        container: false
      })),
      rerender = _render3.rerender,
      container = _render3.container;
    expect(container).toContainHTML('<nav class="navbar"></nav>');
    rerender( /*#__PURE__*/React.createElement(Navbar, {
      container: true
    }));
    expect(container).toContainHTML('<nav class="navbar"><div class="container"></div></nav>');
    rerender( /*#__PURE__*/React.createElement(Navbar, {
      container: "xs"
    }));
    expect(container).toContainHTML('<nav class="navbar"><div class="container-xs"></div></nav>');
    rerender( /*#__PURE__*/React.createElement(Navbar, {
      container: "sm"
    }));
    expect(container).toContainHTML('<nav class="navbar"><div class="container-sm"></div></nav>');
    rerender( /*#__PURE__*/React.createElement(Navbar, {
      container: "md"
    }));
    expect(container).toContainHTML('<nav class="navbar"><div class="container-md"></div></nav>');
    rerender( /*#__PURE__*/React.createElement("div", {
      "data-testid": "navBarLg"
    }, /*#__PURE__*/React.createElement(Navbar, {
      container: "lg"
    })));
    expect(container).toContainHTML('<nav class="navbar"><div class="container-lg"></div></nav>');
    rerender( /*#__PURE__*/React.createElement(Navbar, {
      container: "xl"
    }));
    expect(container).toContainHTML('<nav class="navbar"><div class="container-xl"></div></nav>');
  });
  it('should render children', function () {
    var _render4 = render( /*#__PURE__*/React.createElement(Navbar, null, "Children")),
      container = _render4.container;
    expect(container).toContainHTML('<nav class="navbar"><div class="container-fluid">Children</div></nav>');
  });
  it('should pass additional classNames', function () {
    render( /*#__PURE__*/React.createElement(Navbar, {
      "data-testid": "navBar",
      className: "extra"
    }));
    expect(screen.getByTestId('navBar')).toHaveClass('extra navbar');
  });
  it('should render prop based classes', function () {
    render( /*#__PURE__*/React.createElement(Navbar, {
      "data-testid": "navBar",
      light: true,
      dark: true,
      expand: "sm",
      color: "success",
      sticky: "top",
      fixed: "top"
    }));
    var node = screen.getByTestId('navBar');
    expect(node).toHaveClass('bg-success');
    expect(node).toHaveClass('navbar');
    expect(node).toHaveClass('navbar-expand-sm');
    expect(node).toHaveClass('navbar-light');
    expect(node).toHaveClass('navbar-dark');
    expect(node).toHaveClass('fixed-top');
    expect(node).toHaveClass('sticky-top');
  });
});