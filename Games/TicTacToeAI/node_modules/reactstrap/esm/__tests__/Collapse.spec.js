function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Collapse } from '..';
describe('Collapse', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
  });
  it('should render children', function () {
    render( /*#__PURE__*/React.createElement(Collapse, null, "Hello"));
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
  it('works with strict mode', function () {
    var spy = jest.spyOn(console, 'error');
    render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(Collapse, null)));
    expect(spy).not.toHaveBeenCalled();
  });
  it('should have default isOpen value as false', function () {
    render( /*#__PURE__*/React.createElement(Collapse, null, "Hello"));
    expect(screen.getByText(/hello/i)).not.toHaveClass('show');
  });
  it('should render with class "collapse"', function () {
    render( /*#__PURE__*/React.createElement(Collapse, null, "Hello"));
    expect(screen.getByText(/hello/i)).toHaveClass('collapse');
  });
  it('should render with class "collapse-horizontal" if it has prop horizontal', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      horizontal: true
    }, "Hello"));
    expect(screen.getByText(/hello/i)).toHaveClass('collapse-horizontal');
  });
  it('should render with class "navbar-collapse" if it has prop navbar', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      navbar: true
    }, "Hello"));
    expect(screen.getByText(/hello/i)).toHaveClass('navbar-collapse');
  });
  it('should render with class "show" when isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: true
    }, "Hello"));
    expect(screen.getByText(/hello/i)).toHaveClass('show');
  });
  it('should set height to null when isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: true,
      "data-testid": "collapse"
    }));
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });
  it('should not set height when isOpen is false', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: false,
      "data-testid": "collapse"
    }));
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });
  it('should forward all styles', function () {
    render( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: false,
      "data-testid": "collapse",
      style: {
        backgroundColor: 'black'
      }
    }));
    expect(screen.getByTestId('collapse').style.backgroundColor).toBe('black');
  });
  it('should forward all callbacks', function () {
    var callbacks = {
      onEnter: jest.fn(),
      onEntering: jest.fn(),
      onEntered: jest.fn(),
      onExit: jest.fn(),
      onExiting: jest.fn(),
      onExited: jest.fn()
    };
    var _render = render( /*#__PURE__*/React.createElement(Collapse, _extends({
        isOpen: false
      }, callbacks))),
      rerender = _render.rerender;
    rerender( /*#__PURE__*/React.createElement(Collapse, _extends({
      isOpen: true
    }, callbacks)));
    expect(callbacks.onEnter).toHaveBeenCalled();
    expect(callbacks.onEntering).toHaveBeenCalled();
    expect(callbacks.onEntered).not.toHaveBeenCalled();
    jest.advanceTimersByTime(350);
    expect(callbacks.onEntered).toHaveBeenCalled();
    expect(callbacks.onExit).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Collapse, _extends({
      isOpen: false
    }, callbacks)));
    expect(callbacks.onExit).toHaveBeenCalled();
    expect(callbacks.onExiting).toHaveBeenCalled();
    expect(callbacks.onExited).not.toHaveBeenCalled();
    jest.advanceTimersByTime(350);
    expect(callbacks.onExiting).toHaveBeenCalled();
    expect(callbacks.onExited).toHaveBeenCalled();
  });
  it('should apply correct bootstrap classes', function () {
    var _render2 = render( /*#__PURE__*/React.createElement(Collapse, {
        isOpen: false,
        "data-testid": "collapse"
      })),
      rerender = _render2.rerender;
    rerender( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: true,
      "data-testid": "collapse"
    }));
    expect(screen.getByTestId('collapse')).toHaveClass('collapsing');
    jest.advanceTimersByTime(350);
    expect(screen.getByTestId('collapse')).toHaveClass('collapse show');
    rerender( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: false,
      "data-testid": "collapse"
    }));
    expect(screen.getByTestId('collapse')).toHaveClass('collapsing');
    jest.advanceTimersByTime(350);
    expect(screen.getByTestId('collapse')).toHaveClass('collapse');
  });
  it('should set inline style to 0 when isOpen change to false and remove after transition', function () {
    var _render3 = render( /*#__PURE__*/React.createElement(Collapse, {
        isOpen: true,
        "data-testid": "collapse"
      })),
      rerender = _render3.rerender;
    rerender( /*#__PURE__*/React.createElement(Collapse, {
      isOpen: false,
      "data-testid": "collapse"
    }));
    expect(screen.getByTestId('collapse').style.height).toBe('0px');
    jest.advanceTimersByTime(380);
    expect(screen.getByTestId('collapse').style.height).toBe('');
  });
});