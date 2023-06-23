/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Offcanvas, OffcanvasBody, OffcanvasHeader, Button } from '..';
import { testForCustomClass } from '../testUtils';
describe('Offcanvas', function () {
  var toggle;
  beforeEach(function () {
    toggle = function toggle() {};
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
    document.body.removeAttribute('style');
  });
  it('should render offcanvas portal into DOM', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(screen.getByText(/yo/i)).toBeInTheDocument();
  });
  it('should render with the class "offcanvas"', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas');
  });
  it('should render with the backdrop with the class "offcanvas-backdrop" by default', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('offcanvas-backdrop')).toHaveLength(1);
  });
  it('should not render with the backdrop with the class "offcanvas-backdrop" when backdrop is "false"', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      backdrop: false
    }, "Yo!"));
    expect(document.getElementsByClassName('offcanvas').length).toBe(1);
    expect(document.getElementsByClassName('offcanvas-backdrop').length).toBe(0);
  });
  it('should have custom class name if provided', function () {
    testForCustomClass(Offcanvas, {
      isOpen: true,
      toggle: toggle
    });
  });
  it('should render with additional props if provided', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      style: {
        maxWidth: '95%'
      }
    }, "Yo!"));
    expect(document.getElementsByClassName('offcanvas')[0].style.maxWidth).toBe('95%');
  });
  it('should render without fade transition if provided with fade={false}', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      fade: false,
      className: "fadeless-offcanvas"
    }, "Howdy!"));
    expect(document.getElementsByClassName('fadeless-offcanvas')[0]).not.toHaveClass('fade');
  });
  it('should render when expected when passed offcanvasTransition and backdropTransition props', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      offcanvasTransition: {
        timeout: 2
      },
      backdropTransition: {
        timeout: 10
      },
      className: "custom-timeout-offcanvas"
    }, "Hello, world!"));
    expect(document.getElementsByClassName('custom-timeout-offcanvas')[0]).toHaveClass('fade');
    expect(document.getElementsByClassName('custom-timeout-offcanvas')[0]).not.toHaveClass('show');
    expect(document.getElementsByClassName('offcanvas-backdrop')[0]).not.toHaveClass('show');
    jest.advanceTimersByTime(20);
    expect(document.getElementsByClassName('custom-timeout-offcanvas')[0]).toHaveClass('show');
    expect(document.getElementsByClassName('offcanvas-backdrop')[0]).toHaveClass('show');
  });
  it('should render with class "offcanvas-backdrop" and have custom class name if provided with backdropClassName', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      backdropClassName: "my-custom-offcanvas"
    }, "Yo!"));
    expect(document.getElementsByClassName('offcanvas-backdrop my-custom-offcanvas')[0]).toBeInTheDocument();
  });
  it('should render with the class "offcanvas-${direction}" when direction is passed', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      direction: "top"
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas-top');
  });
  it('should render offcanvas when isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('offcanvas');
    expect(document.getElementsByClassName('offcanvas-backdrop').length).toBe(1);
  });
  it('should render offcanvas with default role of "dialog"', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.getByText(/yo/i).getAttribute('role')).toBe('dialog');
  });
  it('should render offcanvas with provided role', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      role: "alert"
    }, "Yo!"));
    expect(screen.getByText(/yo/i).getAttribute('role')).toBe('alert');
  });
  it('should render offcanvas with aria-labelledby provided labelledBy', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      labelledBy: "myOffcanvasTitle"
    }, "Yo!"));
    expect(screen.getByText(/yo/i).getAttribute('aria-labelledby')).toBe('myOffcanvasTitle');
  });
  it('should not render offcanvas when isOpen is false', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      toggle: toggle
    }, "Yo!"));
    expect(screen.queryByText(/yo/i)).not.toBeInTheDocument();
  });
  it('should toggle offcanvas', function () {
    var _render = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false,
        toggle: toggle
      }, "Yo!")),
      rerender = _render.rerender;
    expect(screen.queryByText(/yo/i)).not.toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.queryByText(/yo/i)).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.queryByText(/yo/i)).toBeInTheDocument();
  });
  it('should call onClosed & onOpened', function () {
    var onOpened = jest.fn();
    var onClosed = jest.fn();
    var _render2 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false,
        onOpened: onOpened,
        onClosed: onClosed,
        toggle: toggle
      }, "Yo!")),
      rerender = _render2.rerender;
    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).not.toHaveBeenCalled();
    onOpened.mockClear();
    onClosed.mockClear();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(onOpened).not.toHaveBeenCalled();
  });
  it('should call onClosed & onOpened when fade={false}', function () {
    var onOpened = jest.fn();
    var onClosed = jest.fn();
    var _render3 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false,
        onOpened: onOpened,
        onClosed: onClosed,
        toggle: toggle,
        fade: false
      }, "Yo!")),
      rerender = _render3.rerender;
    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle,
      fade: false
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).not.toHaveBeenCalled();
    onOpened.mockClear();
    onClosed.mockClear();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle,
      fade: false
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(onOpened).not.toHaveBeenCalled();
  });
  it('should call toggle when escape key pressed', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    user.keyboard('{esc}');
    expect(toggle).toHaveBeenCalled();
  });
  it('should not call toggle when escape key pressed when keyboard is false', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      keyboard: false
    }, "Yo!"));
    user.keyboard('{esc}');
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should call toggle when clicking backdrop', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(screen.getByText(/does nothing/i));
    expect(toggle).not.toHaveBeenCalled();
    user.click(document.getElementsByClassName('offcanvas-backdrop')[0]);
    expect(toggle).toHaveBeenCalled();
  });
  it('should call toggle when clicking backdrop when fade is false', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle,
      fade: false
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(screen.getByText(/does nothing/i));
    expect(toggle).not.toHaveBeenCalled();
    user.click(document.getElementsByClassName('offcanvas-backdrop')[0]);
    expect(toggle).toHaveBeenCalled();
  });
  it('should destroy this._element', function () {
    var _render4 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        toggle: toggle
      }, "thor and dr.johns")),
      rerender = _render4.rerender;
    var element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      toggle: toggle
    }, "thor and dr.johns"));
    jest.advanceTimersByTime(300);
    expect(element).not.toBeInTheDocument();
  });
  it('should destroy this._element when unmountOnClose prop set to true', function () {
    var _render5 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        toggle: toggle,
        unmountOnClose: true
      }, "thor and dr.johns")),
      rerender = _render5.rerender;
    var element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      toggle: toggle,
      unmountOnClose: true
    }, "thor and dr.johns"));
    jest.advanceTimersByTime(300);
    expect(element).not.toBeInTheDocument();
  });
  it('should not destroy this._element when unmountOnClose prop set to false', function () {
    var _render6 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        toggle: toggle,
        unmountOnClose: false
      }, "thor and dr.johns")),
      rerender = _render6.rerender;
    var element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      toggle: toggle,
      unmountOnClose: false
    }, "thor and dr.johns"));
    jest.advanceTimersByTime(300);
    expect(element).toBeInTheDocument();
  });
  it('should destroy this._element on unmount', function () {
    var _render7 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        toggle: toggle
      }, "thor and dr.johns")),
      unmount = _render7.unmount;
    var element = screen.getByText(/thor and dr.johns/i);
    expect(element).toBeInTheDocument();
    unmount();
    jest.advanceTimersByTime(300);
    expect(element).not.toBeInTheDocument();
  });
  it('should remove exactly visibility styles from body', function () {
    // set a body class which includes offcanvas-open
    document.body.style.background = 'blue';
    var _render8 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false,
        toggle: toggle
      }, "Yo!")),
      rerender = _render8.rerender;

    // assert that the offcanvas is closed and the body class is what was set initially
    jest.advanceTimersByTime(300);
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.overflow).toBe('');
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));

    // assert that the offcanvas is open and the body class is what was set initially + offcanvas-open
    jest.advanceTimersByTime(300);
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.overflow).toBe('hidden');

    // append another body class which includes offcanvas-open
    // using this to test if replace will leave a space when removing offcanvas-open
    document.body.style.color = 'red';
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.color).toBe('red');
    expect(document.body.style.overflow).toBe('hidden');
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false,
      toggle: toggle
    }, "Yo!"));

    // assert that the offcanvas is closed and the body class is what was set initially
    jest.advanceTimersByTime(301);
    expect(document.body.style.background).toBe('blue');
    expect(document.body.style.color).toBe('red');
    expect(document.body.style.overflow).toBe('');
  });
  it('should call onEnter & onExit props if provided', function () {
    var onEnter = jest.fn();
    var onExit = jest.fn();
    var _render9 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false,
        onEnter: onEnter,
        onExit: onExit,
        toggle: toggle
      }, "Yo!")),
      rerender = _render9.rerender,
      unmount = _render9.unmount;
    expect(onEnter).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    onEnter.mockReset();
    onExit.mockReset();
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      onEnter: onEnter,
      onExit: onExit,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    onEnter.mockReset();
    onExit.mockReset();
    unmount();
    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).toHaveBeenCalled();
  });
  it('should update element z index when prop changes', function () {
    var _render10 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        zIndex: 0
      }, "Yo!")),
      rerender = _render10.rerender;
    expect(screen.getByText(/yo/i).parentElement).toHaveStyle('z-index: 0');
    rerender( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      zIndex: 1
    }, "Yo!"));
    expect(screen.getByText(/yo/i).parentElement).toHaveStyle('z-index: 1');
  });
  it('should allow focus on only focusable elements', function () {
    render( /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(OffcanvasHeader, {
      toggle: toggle
    }, "Offcanvas title"), /*#__PURE__*/React.createElement(OffcanvasBody, null, /*#__PURE__*/React.createElement("a", {
      alt: "test",
      href: "/"
    }, "First Test"), /*#__PURE__*/React.createElement("map", {
      name: "test"
    }, /*#__PURE__*/React.createElement("area", {
      alt: "test",
      href: "/",
      coords: "200,5,200,30"
    })), /*#__PURE__*/React.createElement("input", {
      type: "text",
      "aria-label": "test text input"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      disabled: true,
      value: "Test"
    }), /*#__PURE__*/React.createElement("select", {
      name: "test",
      id: "select_test"
    }, /*#__PURE__*/React.createElement("option", null, "Second item")), /*#__PURE__*/React.createElement("select", {
      name: "test",
      id: "select_test_disabled",
      disabled: true
    }, /*#__PURE__*/React.createElement("option", null, "Third item")), /*#__PURE__*/React.createElement("textarea", {
      name: "textarea_test",
      id: "textarea_test",
      cols: "30",
      rows: "10",
      "aria-label": "test text area"
    }), /*#__PURE__*/React.createElement("textarea", {
      name: "textarea_test_disabled",
      id: "textarea_test_disabled",
      cols: "30",
      rows: "10",
      disabled: true
    }), /*#__PURE__*/React.createElement("object", null, "Test"), /*#__PURE__*/React.createElement("span", {
      tabIndex: "0"
    }, "test tab index"))));
    user.tab();
    expect(screen.getByLabelText(/close/i)).toHaveFocus();
    user.tab();
    expect(screen.getByText(/first test/i)).toHaveFocus();
    user.tab();
    expect(screen.getByLabelText(/test text input/i)).toHaveFocus();
    user.tab();
    expect(screen.getByText(/second item/i).parentElement).toHaveFocus();
    user.tab();
    expect(screen.getByLabelText(/test text area/i)).toHaveFocus();
    user.tab();
    expect(screen.getByText(/test tab index/i)).toHaveFocus();
    user.tab();
    expect(screen.getByLabelText(/close/i)).toHaveFocus();
  });
  it('should return the focus to the last focused element before the offcanvas has opened', function () {
    var _render11 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: false
      }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever")))),
      rerender = _render11.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: false
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });
  it('should not return the focus to the last focused element before the offcanvas has opened when "returnFocusAfterClose" is false', function () {
    var _render12 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
        returnFocusAfterClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever")))),
      rerender = _render12.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      returnFocusAfterClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      returnFocusAfterClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });
  it('should return the focus to the last focused element before the offcanvas has opened when "unmountOnClose" is false', function () {
    var _render13 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
        unmountOnClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever")))),
      rerender = _render13.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      unmountOnClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      unmountOnClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });
  it('should not return the focus to the last focused element before the offcanvas has opened when "returnFocusAfterClose" is false and "unmountOnClose" is false', function () {
    var _render14 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
        returnFocusAfterClose: false,
        unmountOnClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever")))),
      rerender = _render14.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      returnFocusAfterClose: false,
      unmountOnClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      returnFocusAfterClose: false,
      unmountOnClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });
  it('should attach/detach trapFocus for dialogs', function () {
    var addEventListener = jest.spyOn(document, 'addEventListener');
    var removeEventListener = jest.spyOn(document, 'removeEventListener');
    var _render15 = render( /*#__PURE__*/React.createElement(Offcanvas, {
        isOpen: true,
        toggle: toggle
      }, "Yo!")),
      unmount = _render15.unmount;
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith('focus', expect.any(Function), true);
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith('focus', expect.any(Function), true);
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });
  it('should trap focus inside the open dialog', function () {
    render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      className: "first"
    }, "Focused"), /*#__PURE__*/React.createElement(Offcanvas, {
      isOpen: true,
      trapFocus: true
    }, /*#__PURE__*/React.createElement(OffcanvasBody, null, "Something else to see", /*#__PURE__*/React.createElement(Button, {
      className: "focus"
    }, "focusable element")))));
    user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();
    user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();
  });
});