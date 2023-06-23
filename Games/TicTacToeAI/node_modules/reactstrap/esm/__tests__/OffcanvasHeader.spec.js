import React from 'react';
import { render, screen } from '@testing-library/react';
import { OffcanvasHeader } from '..';
import { testForCustomClass, testForDefaultClass } from '../testUtils';
describe('OffcanvasHeader', function () {
  it('should render with "offcanvas-header" class', function () {
    testForDefaultClass(OffcanvasHeader, 'offcanvas-header');
  });
  it('should render additional classes', function () {
    testForCustomClass(OffcanvasHeader);
  });
  it('should render close button', function () {
    render( /*#__PURE__*/React.createElement(OffcanvasHeader, {
      toggle: function toggle() {},
      "data-testid": "test",
      className: "other"
    }, "Yo!"));
    var node = screen.getByTestId('test').querySelector('button');
    expect(node.tagName.toLowerCase()).toBe('button');
    expect(node).toHaveClass('btn-close');
  });
  it('should render custom tag', function () {
    render( /*#__PURE__*/React.createElement(OffcanvasHeader, {
      tag: "h1"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i).tagName.toLowerCase()).toMatch('h1');
  });
  it('should render custom wrapping tag', function () {
    render( /*#__PURE__*/React.createElement(OffcanvasHeader, {
      wrapTag: "main"
    }, "Yo!"));
    expect(screen.getByText(/yo/i).parentElement.tagName).toMatch(/main/i);
  });
});