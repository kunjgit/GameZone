import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Nav } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('Nav', function () {
  it('should render .nav markup', function () {
    testForDefaultClass(Nav, 'nav');
  });
  it('should render custom tag', function () {
    testForCustomTag(Nav);
  });
  it('should render children', function () {
    testForChildrenInComponent(Nav);
  });
  it('should handle justified prop', function () {
    var _render = render( /*#__PURE__*/React.createElement(Nav, {
        justified: true
      })),
      container = _render.container;
    expect(container).toContainHTML('<ul class="nav nav-justified"></ul>');
  });
  it('should handle fill prop', function () {
    var _render2 = render( /*#__PURE__*/React.createElement(Nav, {
        fill: true
      })),
      container = _render2.container;
    expect(container).toContainHTML('<ul class="nav nav-fill"></ul>');
  });
  it('should handle pills prop', function () {
    var _render3 = render( /*#__PURE__*/React.createElement(Nav, {
        pills: true
      })),
      container = _render3.container;
    expect(container).toContainHTML('<ul class="nav nav-pills"></ul>');
  });
  it('should handle pills prop with card prop', function () {
    var _render4 = render( /*#__PURE__*/React.createElement(Nav, {
        pills: true,
        card: true
      })),
      container = _render4.container;
    expect(container).toContainHTML('<ul class="nav nav-pills card-header-pills"></ul>');
  });
  it('should handle tabs prop', function () {
    var _render5 = render( /*#__PURE__*/React.createElement(Nav, {
        tabs: true
      })),
      container = _render5.container;
    expect(container).toContainHTML('<ul class="nav nav-tabs"></ul>');
  });
  it('should handle tabs prop with card prop', function () {
    var _render6 = render( /*#__PURE__*/React.createElement(Nav, {
        tabs: true,
        card: true
      })),
      container = _render6.container;
    expect(container).toContainHTML('<ul class="nav nav-tabs card-header-tabs"></ul>');
  });
  it('should handle vertical prop', function () {
    var _render7 = render( /*#__PURE__*/React.createElement(Nav, {
        vertical: true
      })),
      container = _render7.container;
    expect(container).toContainHTML('<ul class="nav flex-column"></ul>');
  });
  it('should handle vertical prop with string', function () {
    var _render8 = render( /*#__PURE__*/React.createElement(Nav, {
        vertical: "sm"
      })),
      container = _render8.container;
    expect(container).toContainHTML('<ul class="nav flex-sm-column"></ul>');
  });
  it('should handle horizontal prop with string', function () {
    var _render9 = render( /*#__PURE__*/React.createElement(Nav, {
        horizontal: "end"
      })),
      container = _render9.container;
    expect(container).toContainHTML('<ul class="nav justify-content-end"></ul>');
  });
  it('should pass additional classNames', function () {
    testForCustomClass(Nav);
  });
  it('should render .navbar-nav class only', function () {
    var _render10 = render( /*#__PURE__*/React.createElement(Nav, {
        navbar: true
      }, "Children")),
      container = _render10.container;
    expect(container).toContainHTML('<ul class="navbar-nav">Children</ul>');
  });
});