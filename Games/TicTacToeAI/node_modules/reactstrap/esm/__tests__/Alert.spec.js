import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { testForCustomClass, testForCustomTag } from '../testUtils';
import { Alert } from '..';
describe('Alert', function () {
  beforeEach(function () {
    jest.resetModules();
    jest.useFakeTimers();
  });
  it('should render children', function () {
    render( /*#__PURE__*/React.createElement(Alert, null, "Yo!"));
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });
  it('should render additional classes', function () {
    testForCustomClass(Alert);
  });
  it('should render custom tag', function () {
    testForCustomTag(Alert);
  });
  it('should pass close className down', function () {
    var noop = function noop() {};
    render( /*#__PURE__*/React.createElement(Alert, {
      toggle: noop,
      closeClassName: "test-class-name"
    }, "Yo!"));
    expect(screen.getByLabelText('Close')).toHaveClass('test-class-name');
  });
  it('should pass other props down', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      "data-testprop": "testvalue"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveAttribute('data-testprop', 'testvalue');
  });
  it('should have "success" as default color', function () {
    render( /*#__PURE__*/React.createElement(Alert, null, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('alert-success');
  });
  it('should accept color prop', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      color: "warning"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('alert-warning');
  });
  it('should use a div tag by default', function () {
    render( /*#__PURE__*/React.createElement(Alert, null, "Yo!"));
    expect(screen.getByText('Yo!').tagName.toLowerCase()).toEqual('div');
  });
  it('should be non dismissible by default', function () {
    render( /*#__PURE__*/React.createElement(Alert, null, "Yo!"));
    expect(screen.queryByLabelText('Close')).toBe(null);
    expect(screen.getByText('Yo!')).not.toHaveClass('alert-dismissible');
  });
  it('should show dismiss button if passed toggle', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      color: "danger",
      toggle: function toggle() {}
    }, "Yo!"));
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByText('Yo!')).toHaveClass('alert-dismissible');
  });
  it('should be empty if not isOpen', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      isOpen: false
    }, "Yo!"));
    expect(screen.queryByText('Yo!')).toBe(null);
  });
  it('should be dismissible', function () {
    var mockFn = jest.fn();
    render( /*#__PURE__*/React.createElement(Alert, {
      color: "danger",
      toggle: mockFn
    }, "Yo!"));
    screen.getByText('Yo!');
    user.click(screen.getByLabelText('Close'));
    expect(mockFn).toHaveBeenCalled();
  });
  it('should render close button with custom aria-label', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      toggle: function toggle() {},
      closeAriaLabel: "oseclay"
    }, "Yo!"));
    expect(screen.getByLabelText('oseclay')).toBeInTheDocument();
  });
  it('should have default transitionTimeouts', function () {
    render( /*#__PURE__*/React.createElement(Alert, null, "Hello"));
    expect(screen.getByText(/hello/i)).not.toHaveClass('show');
    jest.advanceTimersByTime(150);
    expect(screen.getByText(/hello/i)).toHaveClass('show');
  });
  it('should have support configurable transitionTimeouts', function () {
    render( /*#__PURE__*/React.createElement(Alert, {
      transition: {
        timeout: 0,
        appear: false,
        enter: false,
        exit: false
      }
    }, "Hello"));
    expect(screen.getByText(/hello/i)).toHaveClass('show');
  });
  it('works with strict mode', function () {
    var spy = jest.spyOn(console, 'error');
    render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(Alert, null, "Hello")));
    expect(spy).not.toHaveBeenCalled();
  });
});