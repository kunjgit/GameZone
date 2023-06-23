/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from '..';
describe('Modal', function () {
  var toggle = function toggle() {};
  beforeEach(function () {
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
    // rtl doesn't clear attributes added to body, so manually clearing them
    document.body.removeAttribute('style');
    document.body.removeAttribute('class');
  });
  it('should render modal portal into DOM', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toBeInTheDocument();
  });
  it('should render with the class "modal-dialog"', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(screen.getByText(/yo/i).parentElement).toHaveClass('modal-dialog');
  });
  it('should render external content when present', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      external: /*#__PURE__*/React.createElement("button", {
        className: "cool-close-button"
      }, "crazy button")
    }, "Yo!"));
    expect(screen.getByText(/crazy button/i)).toBeInTheDocument();
    expect(screen.getByText(/crazy button/i).nextElementSibling.className.split(' ').indexOf('modal-dialog') > -1).toBe(true);
  });
  it('should render with the backdrop with the class "modal-backdrop" by default', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(1);
  });
  it('should render with the backdrop with the class "modal-backdrop" when backdrop is "static"', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static"
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(1);
  });
  it('should not render with the backdrop with the class "modal-backdrop" when backdrop is "false"', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: false
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(0);
  });
  it('should render with the class "modal-dialog-scrollable" when scrollable is "true"', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      scrollable: true
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog-scrollable').length).toBe(1);
  });
  it('should render with class "modal-dialog" and have custom class name if provided', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      className: "my-custom-modal"
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('my-custom-modal').length).toBe(1);
  });
  it('should render with class "modal-dialog" w/o centered class if not provided', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('modal-dialog-centered').length).toBe(0);
  });
  it('should render with class "modal-dialog" and centered class if provided', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      centered: true
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('modal-dialog-centered').length).toBe(1);
  });
  describe('fullscreen', function () {
    it('should render non fullscreen by default', function () {
      render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle
      }, "Yo!"));
      expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
      expect(document.getElementsByClassName('modal-fullscreen').length).toBe(0);
    });
    it('should always render fullscreen if true', function () {
      render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        fullscreen: true
      }, "Yo!"));
      expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
      expect(document.getElementsByClassName('modal-fullscreen').length).toBe(1);
    });
    it('should render fullscreen below breakpoint if breakpoint is provided', function () {
      render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        fullscreen: "lg"
      }, "Yo!"));
      expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
      expect(document.getElementsByClassName('modal-fullscreen').length).toBe(0);
      expect(document.getElementsByClassName('modal-fullscreen-lg-down').length).toBe(1);
    });
  });
  it('should render with additional props if provided', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      style: {
        maxWidth: '95%'
      }
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('modal-dialog')[0].style.maxWidth).toBe('95%');
  });
  it('should render without fade transition if provided with fade={false}', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      fade: false,
      modalClassName: "fadeless-modal"
    }, "Howdy!"));
    var matchedModals = document.getElementsByClassName('fadeless-modal');
    var matchedModal = matchedModals[0];
    expect(matchedModals.length).toBe(1);
    // Modal should not have the 'fade' class
    expect(matchedModal.className.split(' ').indexOf('fade') < 0).toBe(true);
  });
  it('should render when expected when passed modalTransition and backdropTransition props', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      modalTransition: {
        timeout: 2
      },
      backdropTransition: {
        timeout: 10
      },
      modalClassName: "custom-timeout-modal"
    }, "Hello, world!"));
    expect(document.getElementsByClassName('custom-timeout-modal').length).toBe(1);
  });
  it('should render with class "modal" and have custom class name if provided with modalClassName', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      modalClassName: "my-custom-modal"
    }, "Yo!"));
    expect(document.querySelectorAll('.modal.my-custom-modal').length).toBe(1);
  });
  it('should render with custom class name if provided with wrapClassName', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      wrapClassName: "my-custom-modal"
    }, "Yo!"));
    expect(document.getElementsByClassName('my-custom-modal').length).toBe(1);
  });
  it('should render with class "modal-content" and have custom class name if provided with contentClassName', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      contentClassName: "my-custom-modal"
    }, "Yo!"));
    expect(document.querySelectorAll('.modal-content.my-custom-modal').length).toBe(1);
  });
  it('should render with class "modal-backdrop" and have custom class name if provided with backdropClassName', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdropClassName: "my-custom-modal"
    }, "Yo!"));
    expect(document.querySelectorAll('.modal-backdrop.my-custom-modal').length).toBe(1);
  });
  it('should render with the class "modal-${size}" when size is passed', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      size: "crazy"
    }, "Yo!"));
    expect(document.getElementsByClassName('modal-dialog').length).toBe(1);
    expect(document.getElementsByClassName('modal-crazy').length).toBe(1);
  });
  it('should render modal when isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('modal').length).toBe(1);
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(1);
  });
  it('should render modal with default role of "dialog"', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('modal')[0].getAttribute('role')).toBe('dialog');
  });
  it('should render modal with provided role', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      role: "alert"
    }, "Yo!"));
    expect(document.getElementsByClassName('modal')[0].getAttribute('role')).toBe('alert');
  });
  it('should render modal with aria-labelledby provided labelledBy', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      labelledBy: "myModalTitle"
    }, "Yo!"));
    expect(document.getElementsByClassName('modal')[0].getAttribute('aria-labelledby')).toBe('myModalTitle');
  });
  it('should not render modal when isOpen is false', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('modal').length).toBe(0);
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(0);
  });
  it('should toggle modal', function () {
    var _render = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        toggle: toggle
      }, "Yo!")),
      rerender = _render.rerender;
    expect(document.getElementsByClassName('modal').length).toBe(0);
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(0);
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.getElementsByClassName('modal').length).toBe(1);
    expect(document.getElementsByClassName('modal-backdrop').length).toBe(1);
  });
  it('should call onClosed & onOpened', function () {
    var onOpened = jest.fn();
    var onClosed = jest.fn();
    var _render2 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        onOpened: onOpened,
        onClosed: onClosed,
        toggle: toggle
      }, "Yo!")),
      rerender = _render2.rerender;
    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onOpened).toHaveBeenCalledTimes(1);
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).toHaveBeenCalledTimes(1);
  });
  it('should call onClosed & onOpened when fade={false}', function () {
    var onOpened = jest.fn();
    var onClosed = jest.fn();
    var _render3 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        onOpened: onOpened,
        onClosed: onClosed,
        toggle: toggle,
        fade: false
      }, "Yo!")),
      rerender = _render3.rerender;
    expect(onOpened).not.toHaveBeenCalled();
    expect(onClosed).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle,
      fade: false
    }, "Yo!"));
    jest.advanceTimersByTime(1);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClosed).not.toHaveBeenCalled();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      onOpened: onOpened,
      onClosed: onClosed,
      toggle: toggle,
      fade: false
    }, "Yo!"));
    jest.advanceTimersByTime(1);
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(onOpened).toHaveBeenCalledTimes(1);
  });
  it('should call toggle when escape key pressed and not for enter key', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    user.keyboard('{enter}');
    expect(toggle).not.toHaveBeenCalled();
    user.keyboard('{esc}');
    expect(toggle).toHaveBeenCalled();
  });
  it('should not call toggle when escape key pressed when keyboard is false', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      keyboard: false
    }, "Yo!"));
    user.keyboard('{esc}');
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should call toggle when clicking backdrop', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(screen.getByText(/does nothing/i));
    expect(toggle).not.toHaveBeenCalled();
    user.click(document.body.getElementsByClassName('modal')[0]);
    expect(toggle).toHaveBeenCalled();
  });
  it('should not call toggle when clicking backdrop and backdrop is "static"', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(document.getElementsByClassName('modal-backdrop')[0]);
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should not call toggle when escape key pressed and backdrop is "static" and keyboard=false', function () {
    var toggle = jest.fn();
    var _render4 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        backdrop: "static",
        keyboard: false
      }, "Yo!")),
      debug = _render4.debug;
    user.keyboard('{esc}');
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should call toggle when escape key pressed and backdrop is "static" and keyboard=true', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static",
      keyboard: true
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.keyboard('{esc}');
    expect(toggle).toHaveBeenCalled();
  });
  it('should animate when backdrop is "static" and escape key pressed and keyboard=false', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static",
      keyboard: false,
      "data-testid": "mandalorian"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.keyboard('{esc}');
    expect(screen.getByTestId('mandalorian').parentElement).toHaveClass('modal-static');
    jest.advanceTimersByTime(300);
    expect(screen.getByTestId('mandalorian').parentElement).not.toHaveClass('modal-static');
  });
  it('should animate when backdrop is "static" and backdrop is clicked', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static",
      "data-testid": "mandalorian"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(document.getElementsByClassName('modal')[0]);
    expect(screen.getByTestId('mandalorian').parentElement).toHaveClass('modal-static');
    jest.advanceTimersByTime(300);
    expect(screen.getByTestId('mandalorian').parentElement).not.toHaveClass('modal-static');
  });
  it('should not animate when backdrop is "static" and modal is clicked', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle,
      backdrop: "static",
      "data-testid": "mandalorian"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    user.click(document.getElementsByClassName('modal-dialog')[0]);
    expect(screen.getByTestId('mandalorian').parentElement).not.toHaveClass('modal-static');
  });
  it('should destroy this._element', function () {
    var _render5 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        wrapClassName: "weird-class"
      }, /*#__PURE__*/React.createElement("button", {
        id: "clicker"
      }, "Does Nothing"))),
      rerender = _render5.rerender,
      debug = _render5.debug;
    var element = document.getElementsByClassName('weird-class')[0].parentElement;
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      toggle: toggle,
      wrapClassName: "weird-class"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    jest.advanceTimersByTime(300);
    expect(element).not.toBeInTheDocument();
  });
  it('should destroy this._element when unmountOnClose prop set to true', function () {
    var _render6 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        unmountOnClose: true,
        wrapClassName: "weird-class"
      }, /*#__PURE__*/React.createElement("button", {
        id: "clicker"
      }, "Does Nothing"))),
      rerender = _render6.rerender,
      debug = _render6.debug;
    var element = document.getElementsByClassName('weird-class')[0].parentElement;
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      toggle: toggle,
      unmountOnClose: true,
      wrapClassName: "weird-class"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    jest.advanceTimersByTime(300);
    expect(element).not.toBeInTheDocument();
  });
  it('should not destroy this._element when unmountOnClose prop set to false', function () {
    var _render7 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        unmountOnClose: false,
        wrapClassName: "weird-class"
      }, /*#__PURE__*/React.createElement("button", {
        id: "clicker"
      }, "Does Nothing"))),
      rerender = _render7.rerender;
    var element = document.getElementsByClassName('weird-class')[0].parentElement;
    expect(element).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      toggle: toggle,
      unmountOnClose: false,
      wrapClassName: "weird-class"
    }, /*#__PURE__*/React.createElement("button", {
      id: "clicker"
    }, "Does Nothing")));
    expect(element).toBeInTheDocument();
  });
  it('should destroy this._element on unmount', function () {
    var _render8 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle,
        wrapClassName: "weird-class"
      }, /*#__PURE__*/React.createElement("button", {
        id: "clicker"
      }, "Does Nothing"))),
      unmount = _render8.unmount;
    unmount();
    jest.advanceTimersByTime(300);
    expect(document.getElementsByClassName('modal').length).toBe(0);
  });
  it('should render nested modals', function () {
    var _render9 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        toggle: function toggle() {}
      }, "Yo!")))),
      unmount = _render9.unmount;
    expect(document.getElementsByClassName('modal-dialog').length).toBe(2);
    expect(document.body.className).toBe('modal-open');
    unmount();
    expect(document.getElementsByClassName('modal-dialog').length).toBe(0);
  });
  it('should remove exactly modal-open class from body', function () {
    // set a body class which includes modal-open
    document.body.className = 'my-modal-opened';
    var _render10 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        toggle: toggle
      }, "Yo!")),
      rerender = _render10.rerender;
    expect(document.body.className).toBe('my-modal-opened');
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, "Yo!"));
    expect(document.body.className).toBe('my-modal-opened modal-open');

    // using this to test if replace will leave a space when removing modal-open
    document.body.className += ' modal-opened';
    expect(document.body.className).toBe('my-modal-opened modal-open modal-opened');
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      toggle: toggle
    }, "Yo!"));
    jest.advanceTimersByTime(300);
    expect(document.body.className).toBe('my-modal-opened modal-opened');
  });
  it('should call onEnter & onExit props if provided', function () {
    var onEnter = jest.fn();
    var onExit = jest.fn();
    var _render11 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        onEnter: onEnter,
        onExit: onExit,
        toggle: toggle
      }, "Yo!")),
      rerender = _render11.rerender,
      unmount = _render11.unmount;
    expect(onEnter).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    onEnter.mockReset();
    onExit.mockReset();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      onEnter: onEnter,
      onExit: onExit,
      toggle: toggle
    }, "Yo!"));
    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    onEnter.mockReset();
    onExit.mockReset();
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: false,
      onEnter: onEnter,
      onExit: onExit,
      toggle: toggle
    }, "Yo!"));
    unmount();
    expect(onEnter).not.toHaveBeenCalled();
    expect(onExit).toHaveBeenCalled();
  });
  it('should update element z index when prop changes', function () {
    var _render12 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true,
        zIndex: 0,
        wrapClassName: "sandman"
      }, "Yo!")),
      debug = _render12.debug,
      rerender = _render12.rerender;
    expect(document.getElementsByClassName('sandman')[0].parentElement.style.zIndex).toBe('0');
    rerender( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      zIndex: 1,
      wrapClassName: "sandman"
    }, "Yo!"));
    expect(document.getElementsByClassName('sandman')[0].parentElement.style.zIndex).toBe('1');
  });
  it('should allow focus on only focusable elements and tab through them', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(ModalHeader, {
      toggle: toggle
    }, "Modal title"), /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement("a", {
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
    }, "test tab index")), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Button, {
      disabled: true,
      color: "primary",
      onClick: toggle
    }, "Do Something"), ' ', /*#__PURE__*/React.createElement(Button, {
      color: "secondary",
      onClick: toggle
    }, "Cancel"))));
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
    expect(screen.getByText(/cancel/i)).toHaveFocus();
    user.tab();
    expect(screen.getByLabelText(/close/i)).toHaveFocus();
  });
  it('should return the focus to the last focused element before the modal has opened', function () {
    var _render13 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
        isOpen: false
      }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever")))),
      rerender = _render13.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      isOpen: true
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      isOpen: false
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });
  it('should not return the focus to the last focused element before the modal has opened when "returnFocusAfterClose" is false', function () {
    var _render14 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
        returnFocusAfterClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever")))),
      rerender = _render14.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      returnFocusAfterClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      returnFocusAfterClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });
  it('should return the focus to the last focused element before the modal has opened when "unmountOnClose" is false', function () {
    var _render15 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
        unmountOnClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever")))),
      rerender = _render15.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      unmountOnClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      unmountOnClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).toHaveFocus();
  });
  it('should not return the focus to the last focused element before the modal has opened when "returnFocusAfterClose" is false and "unmountOnClose" is false', function () {
    var _render16 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "focus"
      }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
        unmountOnClose: false,
        returnFocusAfterClose: false,
        isOpen: false
      }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever")))),
      rerender = _render16.rerender;
    user.tab();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      unmountOnClose: false,
      returnFocusAfterClose: false,
      isOpen: true
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "focus"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      unmountOnClose: false,
      returnFocusAfterClose: false,
      isOpen: false
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Whatever"))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
  });
  it('should attach/detach trapFocus for dialogs', function () {
    var addEventListener = jest.spyOn(document, 'addEventListener');
    var removeEventListener = jest.spyOn(document, 'removeEventListener');
    var _render17 = render( /*#__PURE__*/React.createElement(Modal, {
        isOpen: true
      }, /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement(Button, {
        className: "focus"
      }, "focusable element")))),
      unmount = _render17.unmount;
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith('focus', expect.any(Function), true);
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith('focus', expect.any(Function), true);
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });
  it('should trap focus inside the open dialog', function () {
    var _render18 = render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        className: "first"
      }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
        isOpen: false,
        trapFocus: true
      }, /*#__PURE__*/React.createElement(ModalBody, null, "Something else to see", /*#__PURE__*/React.createElement(Button, {
        className: "focus"
      }, "focusable element"))))),
      rerender = _render18.rerender;
    screen.getByText(/focused/i).focus();
    expect(screen.getByText(/focused/i)).toHaveFocus();
    rerender( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      className: "first"
    }, "Focused"), /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      trapFocus: true,
      "data-testid": "modal"
    }, /*#__PURE__*/React.createElement(ModalBody, null, "Something else to see", /*#__PURE__*/React.createElement(Button, {
      className: "focus"
    }, "focusable element")))));
    jest.runAllTimers();
    expect(screen.getByText(/focused/i)).not.toHaveFocus();
    expect(screen.getByTestId('modal').parentElement).toHaveFocus();
    // pressing tab shouldn't move focus outside the modal
    user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();
    user.tab();
    expect(screen.getByText(/focusable element/i)).toHaveFocus();
  });
  it('tab should focus on inside modal children for nested modal', function () {
    render( /*#__PURE__*/React.createElement(Modal, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement(Button, {
      className: "b0",
      onClick: toggle
    }, "Cancel"), /*#__PURE__*/React.createElement(Modal, {
      isOpen: true
    }, /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement(Button, {
      className: "b1"
    }, "Click 1"))))));
    user.tab();
    expect(screen.getByText(/click 1/i)).toHaveFocus();
    // pressing tab doesn't take focus out of inside modal
    user.tab();
    expect(screen.getByText(/click 1/i)).toHaveFocus();
  });
  it('works with strict mode', function () {
    var spy = jest.spyOn(console, 'error');
    render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(Modal, {
      isOpen: true
    }, "Hello")));
    expect(spy).not.toHaveBeenCalled();
  });
});