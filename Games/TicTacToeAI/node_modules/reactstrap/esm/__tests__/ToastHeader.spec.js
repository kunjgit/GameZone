import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastHeader } from '..';
import { testForCustomClass, testForDefaultClass } from '../testUtils';
describe('ToastHeader', function () {
  it('should render with "toast-header" class', function () {
    testForDefaultClass(ToastHeader, 'toast-header');
  });
  it('should render additional classes', function () {
    testForCustomClass(ToastHeader);
  });
  it('should render close button', function () {
    render( /*#__PURE__*/React.createElement(ToastHeader, {
      toggle: function toggle() {}
    }, "Yo!"));
    expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
  });
  it('should render custom tag', function () {
    render( /*#__PURE__*/React.createElement(ToastHeader, {
      tag: "p"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i).tagName.toLowerCase()).toMatch('p');
  });
  it('should render custom wrapping tag', function () {
    render( /*#__PURE__*/React.createElement(ToastHeader, {
      wrapTag: "main"
    }, "Yo!"));
    expect(screen.getByText(/yo/i).parentElement.tagName).toMatch(/main/i);
  });
});