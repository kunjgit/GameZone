import React from 'react';
import { Popper } from 'react-popper';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TooltipPopoverWrapper from '../TooltipPopoverWrapper';
describe('Tooltip', function () {
  var element;
  var container;
  beforeEach(function () {
    element = document.createElement('div');
    container = document.createElement('div');
    element.innerHTML = '<p id="target">This is the Tooltip <span id="innerTarget">target</span>.</p>';
    element.setAttribute('id', 'testContainer');
    container.setAttribute('id', 'container');
    container.setAttribute('data-testid', 'container');
    element.appendChild(container);
    document.body.appendChild(element);
    jest.useFakeTimers();
    jest.resetModules();
    Popper.mockClear();
  });
  afterEach(function () {
    jest.clearAllTimers();
    document.body.removeChild(element);
    element = null;
    container = null;
  });
  it('should render arrow by default', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true
    }, "Tooltip Content"));
    expect(document.querySelector('.arrow')).toBeInTheDocument();
  });
  it('should render not render arrow if hiderArrow is true', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true,
      hideArrow: true
    }, "Tooltip Content"));
    expect(document.querySelector('.arrow')).not.toBeInTheDocument();
  });
  it('should not render children if isOpen is false', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: false
    }, "Tooltip Content"));
    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
  });
  it('should render if isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true,
      className: "tooltip show",
      trigger: "hover"
    }, "Tooltip Content"));
    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();
    expect(document.querySelector('.tooltip.show')).toBeInTheDocument();
  });
  it('should render with target object', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: document.getElementById('target'),
      isOpen: true,
      className: "tooltip show"
    }, "Tooltip Content"));
    expect(document.getElementsByClassName('tooltip show')).toHaveLength(1);
    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();
  });
  it('should toggle isOpen', function () {
    var _render = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: false,
        className: "tooltip show"
      }, "Tooltip Content")),
      rerender = _render.rerender;
    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true,
      className: "tooltip show"
    }, "Tooltip Content"));
    expect(screen.queryByText(/tooltip content/i)).toBeInTheDocument();
    rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: false,
      className: "tooltip show"
    }, "Tooltip Content"));
    jest.advanceTimersByTime(150);
    expect(screen.queryByText(/tooltip content/i)).not.toBeInTheDocument();
  });
  it('should handle target clicks', function () {
    var toggle = jest.fn();
    var _render2 = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: false,
        toggle: toggle
      }, "Tooltip Content")),
      rerender = _render2.rerender;
    user.click(screen.getByText(/this is the Tooltip/i));
    jest.advanceTimersByTime(150);
    expect(toggle).toBeCalled();
    toggle.mockClear();
    rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true,
      toggle: toggle
    }, "Tooltip Content"));
    user.click(screen.getByText(/this is the Tooltip/i));
    jest.advanceTimersByTime(150);
    expect(toggle).toBeCalled();
  });
  it('should handle inner target clicks', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: false,
      toggle: toggle
    }, "Tooltip Content"));
    user.click(screen.getByText(/target/i));
    jest.advanceTimersByTime(150);
    expect(toggle).toBeCalled();
  });
  it('should not do anything when document click outside of target', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: false,
      toggle: toggle
    }, "Tooltip Content"));
    user.click(screen.getByTestId('container'));
    expect(toggle).not.toBeCalled();
  });
  it('should open after receiving single touchstart and single click', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: false,
      toggle: toggle,
      trigger: "click"
    }, "Tooltip Content"));
    user.click(screen.getByText(/target/i));
    jest.advanceTimersByTime(200);
    expect(toggle).toHaveBeenCalled();

    // TODO: RTL currently doesn't support touch events
  });

  it('should close after receiving single touchstart and single click', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      isOpen: true,
      toggle: toggle,
      trigger: "click"
    }, "Tooltip Content"));
    user.click(screen.getByText(/target/i));
    jest.advanceTimersByTime(200);
    expect(toggle).toHaveBeenCalled();

    // TODO: RTL currently doesn't support touch events
  });

  it('should pass down custom modifiers', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      isOpen: true,
      target: "target",
      modifiers: [{
        name: 'offset',
        options: {
          offset: [2, 2]
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: 'viewport'
        }
      }]
    }, "Tooltip Content"));
    expect(Popper.mock.calls[0][0].modifiers).toEqual(expect.arrayContaining([expect.objectContaining({
      name: 'offset',
      options: {
        offset: [2, 2]
      }
    })]));
    expect(Popper.mock.calls[0][0].modifiers).toEqual(expect.arrayContaining([expect.objectContaining({
      name: 'preventOverflow',
      options: {
        boundary: 'viewport'
      }
    })]));
  });
  describe('PopperContent', function () {
    beforeEach(function () {
      jest.doMock('../PopperContent', function () {
        return jest.fn(function (props) {
          return props.children({
            update: function update() {},
            ref: function ref() {},
            style: {},
            placement: props.placement,
            arrowProps: {
              ref: function ref() {},
              style: {}
            },
            isReferenceHidden: false
          });
        });
      });
    });
    it('should pass down cssModule', function () {
      // eslint-disable-next-line global-require
      var PopperContent = require('../PopperContent');
      // eslint-disable-next-line global-require
      var TooltipPopoverWrapper = require('../TooltipPopoverWrapper')["default"];
      var cssModule = {
        a: 'b'
      };
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        isOpen: true,
        target: "target",
        cssModule: cssModule
      }, "Tooltip Content"));
      expect(PopperContent).toBeCalledTimes(1);
      expect(PopperContent.mock.calls[0][0]).toEqual(expect.objectContaining({
        cssModule: expect.objectContaining({
          a: 'b'
        })
      }));
    });
    it('should pass down offset', function () {
      // eslint-disable-next-line global-require
      var PopperContent = require('../PopperContent');
      // eslint-disable-next-line global-require
      var TooltipPopoverWrapper = require('../TooltipPopoverWrapper')["default"];
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        isOpen: true,
        target: "target",
        offset: [0, 12]
      }, "Tooltip content"));
      expect(PopperContent).toBeCalledTimes(1);
      expect(PopperContent.mock.calls[0][0].offset).toEqual(expect.arrayContaining([0, 12]));
    });
    it('should pass down flip', function () {
      // eslint-disable-next-line global-require
      var PopperContent = require('../PopperContent');
      // eslint-disable-next-line global-require
      var TooltipPopoverWrapper = require('../TooltipPopoverWrapper')["default"];
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        isOpen: true,
        target: "target",
        flip: false
      }, "Tooltip Content"));
      expect(PopperContent).toBeCalledTimes(1);
      expect(PopperContent.mock.calls[0][0].flip).toBe(false);
    });
    it('should handle inner target click and correct placement', function () {
      var toggle = jest.fn();
      // eslint-disable-next-line global-require
      var PopperContent = require('../PopperContent');
      // eslint-disable-next-line global-require
      var TooltipPopoverWrapper = require('../TooltipPopoverWrapper')["default"];
      var _render3 = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
          target: "target",
          isOpen: false,
          toggle: toggle
        }, "Tooltip Content")),
        rerender = _render3.rerender;
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toBeCalled();
      rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle
      }, "Tooltip Content"));
      expect(PopperContent.mock.calls[0][0].target.id).toBe('target');
    });
  });
  it('should not call props.toggle when disabled ', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      disabled: true,
      isOpen: true,
      toggle: toggle
    }, "Tooltip Content"));
    user.click(screen.getByText(/target/i));
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should not throw when props.toggle is not provided ', function () {
    render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
      target: "target",
      disabled: true,
      isOpen: true
    }, "Tooltip Content"));
    user.click(screen.getByText(/target/i));
  });
  it('should not throw when passed a ref object as the target', function () {
    var targetObj = /*#__PURE__*/React.createRef();
    targetObj.current = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    var _render4 = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        isOpen: false,
        target: targetObj
      }, "Yo!")),
      unmount = _render4.unmount;
    unmount();
    expect(targetObj.current.addEventListener).toHaveBeenCalled();
    expect(targetObj.current.removeEventListener).toHaveBeenCalled();
  });
  describe('multi target', function () {
    var targets;
    var targetContainer;
    beforeEach(function () {
      targetContainer = document.createElement('div');
      targetContainer.innerHTML = "<span class='example first'>Target 1</span><span class='example second'>Target 2<span class='inner_example'>Inner target</span></span>";
      element.appendChild(targetContainer);
      targets = targetContainer.querySelectorAll('.example');
    });
    afterEach(function () {
      element.removeChild(targetContainer);
      targets = null;
    });
    it('should attach tooltip on multiple target when a target selector matches multiple elements', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: ".example",
        isOpen: false,
        toggle: toggle,
        delay: 0
      }, "Yo!"));
      user.click(targets[0]);
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalledTimes(1);
      user.click(targets[1]);
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalledTimes(2);
    });
    it('should attach tooltip on second target with correct placement, when inner element is clicked', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: ".example",
        isOpen: false,
        toggle: toggle,
        delay: 0
      }, "Yo!"));
      user.click(targets[0]);
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalledTimes(1);
    });
  });
  describe('delay', function () {
    it('should accept a number', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle,
        delay: 200
      }, "Tooltip Content"));
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(100);
      expect(toggle).not.toBeCalled();
      jest.advanceTimersByTime(100);
      expect(toggle).toBeCalled();
    });
    it('should accept an object', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle,
        delay: {
          show: 400,
          hide: 400
        }
      }, "Tooltip Content"));
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).not.toBeCalled();
      jest.advanceTimersByTime(200);
      expect(toggle).toBeCalled();
    });
    it('should use default value if value is missing from object', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle,
        delay: {
          show: 0
        }
      }, "Tooltip Content"));
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(10);
      expect(toggle).not.toBeCalled();
      jest.advanceTimersByTime(40); // default hide value is 50
      expect(toggle).toBeCalled();
    });
  });
  describe('hide', function () {
    it('should call toggle when isOpen', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle
      }, "Tooltip Content"));
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalled();
    });
  });
  describe('show', function () {
    it('should call toggle when isOpen', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: false,
        toggle: toggle
      }, "Tooltip Content"));
      user.click(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalled();
    });
  });
  describe('onMouseOverTooltip', function () {
    it('should clear timeout if it exists on target click', function () {
      var toggle = jest.fn();
      var _render5 = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
          target: "target",
          isOpen: false,
          toggle: toggle,
          delay: 200,
          trigger: "hover"
        }, "Tooltip Content")),
        rerender = _render5.rerender;
      user.hover(screen.getByText(/target/i));
      rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle,
        delay: 200,
        trigger: "hover"
      }, "Tooltip Content"));
      user.unhover(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should not call .toggle if isOpen', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        toggle: toggle,
        delay: 200,
        trigger: "hover"
      }, "Tooltip Content"));
      user.hover(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).not.toHaveBeenCalled();
    });
  });
  describe('onMouseLeaveTooltip', function () {
    it('should clear timeout if it exists on target click', function () {
      var toggle = jest.fn();
      var _render6 = render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
          target: "target",
          isOpen: true,
          toggle: toggle,
          delay: 200,
          trigger: "hover"
        }, "Tooltip Content")),
        rerender = _render6.rerender;
      user.unhover(screen.getByText(/target/i));
      rerender( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: false,
        toggle: toggle,
        delay: 200,
        trigger: "hover"
      }, "Tooltip Content"));
      user.hover(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should not call .toggle if isOpen is false', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: false,
        toggle: toggle,
        delay: 200,
        trigger: "hover"
      }, "Tooltip Content"));
      user.unhover(screen.getByText(/target/i));
      jest.advanceTimersByTime(200);
      expect(toggle).not.toHaveBeenCalled();
    });
  });
  describe('autohide', function () {
    it('should keep Tooltip around when false and onmouseleave from Tooltip content', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        trigger: "hover",
        target: "target",
        autohide: false,
        isOpen: true,
        toggle: toggle,
        delay: 200
      }, "Tooltip Content"));
      user.hover(screen.getByText(/tooltip content/i));
      jest.advanceTimersByTime(200);
      expect(toggle).not.toHaveBeenCalled();
      user.unhover(screen.getByText(/tooltip content/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalled();
    });
    it('clears showTimeout and hideTimeout in onMouseLeaveTooltipContent', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        trigger: "hover",
        target: "target",
        autohide: false,
        isOpen: true,
        toggle: toggle,
        delay: 200
      }, "Tooltip Content"));
      user.unhover(screen.getByText(/tooltip content/i));
      user.hover(screen.getByText(/tooltip content/i));
      user.unhover(screen.getByText(/tooltip content/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toBeCalledTimes(1);
    });
    it('should not keep Tooltip around when autohide is true and Tooltip content is hovered over', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        autohide: true,
        isOpen: true,
        toggle: toggle,
        delay: 200,
        trigger: "click hover focus"
      }, "Tooltip Content"));
      user.unhover(screen.getByText(/target/i));
      user.hover(screen.getByText(/tooltip content/i));
      jest.advanceTimersByTime(200);
      expect(toggle).toHaveBeenCalled();
    });
    it('should allow a function to be used as children', function () {
      var renderChildren = jest.fn();
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true
      }, renderChildren));
      expect(renderChildren).toHaveBeenCalled();
    });
    it('should render children properly when children is a function', function () {
      render( /*#__PURE__*/React.createElement(TooltipPopoverWrapper, {
        target: "target",
        isOpen: true,
        className: "tooltip show",
        trigger: "hover"
      }, function () {
        return 'Tooltip Content';
      }));
      expect(screen.getByText(/tooltip content/i)).toBeInTheDocument();
    });
  });
});