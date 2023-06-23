function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { TransitionGroup } from 'react-transition-group';
import { Fade } from '..';
import { testForCustomTag } from '../testUtils';
var Helper = /*#__PURE__*/function (_React$Component) {
  _inherits(Helper, _React$Component);
  var _super = _createSuper(Helper);
  function Helper(props) {
    var _this;
    _classCallCheck(this, Helper);
    _this = _super.call(this, props);
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    _this.state = {
      showItem: props.showItem
    };
    return _this;
  }
  _createClass(Helper, [{
    key: "toggle",
    value: function toggle() {
      this.setState(function (prevState) {
        return {
          showItem: !prevState.showItem
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "trigger",
        onClick: this.toggle
      }, "Toggle"), /*#__PURE__*/React.createElement(TransitionGroup, {
        component: "div"
      }, this.state.showItem ? this.props.children : null));
    }
  }]);
  return Helper;
}(React.Component);
describe('Fade', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
  });
  it('should transition classes from "fade" to "fade show" on appear', function () {
    render( /*#__PURE__*/React.createElement(Helper, {
      showItem: true
    }, /*#__PURE__*/React.createElement(Fade, null, "Yo!"), /*#__PURE__*/React.createElement(Fade, {
      appear: false
    }, "Yo 2!")));
    expect(screen.getByText('Yo!')).toHaveClass('fade');
    expect(screen.getByText('Yo!')).not.toHaveClass('show');
    expect(screen.getByText('Yo 2!')).toHaveClass('fade');
    expect(screen.getByText('Yo 2!')).toHaveClass('show');
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Yo!')).toHaveClass('fade');
    expect(screen.getByText('Yo!')).toHaveClass('show');
    expect(screen.getByText('Yo 2!')).toHaveClass('fade');
    expect(screen.getByText('Yo 2!')).toHaveClass('show');
    user.click(document.getElementsByClassName('trigger')[0]);
    expect(screen.getByText('Yo!')).toHaveClass('fade');
    expect(screen.getByText('Yo!')).not.toHaveClass('show');
    expect(screen.getByText('Yo 2!')).toHaveClass('fade');
    expect(screen.getByText('Yo 2!')).not.toHaveClass('show');
  });
  it('should transition classes from "fade" to "fade show" on enter', function () {
    var onEnter = jest.fn();
    var onExit = jest.fn();
    render( /*#__PURE__*/React.createElement(Helper, {
      showItem: false
    }, /*#__PURE__*/React.createElement(Fade, {
      onEnter: onEnter,
      onExit: onExit,
      key: Math.random()
    }, "Yo 3!"), /*#__PURE__*/React.createElement(Fade, {
      appear: false,
      enter: false,
      exit: false,
      key: Math.random()
    }, "Yo 4!")));
    expect(document.getElementsByClassName('fade').length).toBe(0);
    expect(document.getElementsByClassName('fade show').length).toBe(0);
    user.click(document.getElementsByClassName('trigger')[0]);
    expect(onEnter).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(document.getElementsByClassName('fade').length).toBe(2);
    expect(document.getElementsByClassName('fade show').length).toBe(1);
    jest.advanceTimersByTime(300);
    expect(onEnter).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(document.getElementsByClassName('fade show').length).toBe(2);
    user.click(document.getElementsByClassName('trigger')[0]);
    expect(onExit).toHaveBeenCalled();
    expect(document.getElementsByClassName('fade show').length).toBe(0);
  });
  it('should pass className down', function () {
    render( /*#__PURE__*/React.createElement(Fade, {
      className: "test-class-name"
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('test-class-name');
  });
  it('should pass other props down', function () {
    render( /*#__PURE__*/React.createElement(Fade, {
      "data-testprop": "testvalue"
    }, "Yo"));
    expect(screen.getByText(/yo/i)).toHaveAttribute('data-testprop', 'testvalue');
  });
  it('should support custom tag', function () {
    testForCustomTag(Fade);
  });
});