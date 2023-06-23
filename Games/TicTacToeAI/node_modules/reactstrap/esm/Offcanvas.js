function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Portal from './Portal';
import Fade from './Fade';
import { TransitionTimeouts, conditionallyUpdateScrollbar, focusableElements, getOriginalBodyPadding, getTarget, keyCodes, mapToCssModules, omit, setScrollbarWidth, targetPropType } from './utils';
function noop() {}
var FadePropTypes = PropTypes.shape(Fade.propTypes);
var propTypes = {
  autoFocus: PropTypes.bool,
  backdrop: PropTypes.bool,
  backdropClassName: PropTypes.string,
  backdropTransition: FadePropTypes,
  children: PropTypes.node,
  className: PropTypes.string,
  container: targetPropType,
  cssModule: PropTypes.object,
  direction: PropTypes.oneOf(['start', 'end', 'bottom', 'top']),
  fade: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  isOpen: PropTypes.bool,
  keyboard: PropTypes.bool,
  labelledBy: PropTypes.string,
  offcanvasTransition: FadePropTypes,
  onClosed: PropTypes.func,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  style: PropTypes.object,
  onOpened: PropTypes.func,
  returnFocusAfterClose: PropTypes.bool,
  role: PropTypes.string,
  scrollable: PropTypes.bool,
  toggle: PropTypes.func,
  trapFocus: PropTypes.bool,
  unmountOnClose: PropTypes.bool,
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
var propsToOmit = Object.keys(propTypes);
var defaultProps = {
  isOpen: false,
  autoFocus: true,
  direction: 'start',
  scrollable: false,
  role: 'dialog',
  backdrop: true,
  keyboard: true,
  zIndex: 1050,
  fade: true,
  onOpened: noop,
  onClosed: noop,
  offcanvasTransition: {
    timeout: TransitionTimeouts.Offcanvas
  },
  backdropTransition: {
    mountOnEnter: true,
    timeout: TransitionTimeouts.Fade // uses standard fade transition
  },

  unmountOnClose: true,
  returnFocusAfterClose: true,
  container: 'body',
  trapFocus: false
};
var Offcanvas = /*#__PURE__*/function (_React$Component) {
  _inherits(Offcanvas, _React$Component);
  var _super = _createSuper(Offcanvas);
  function Offcanvas(props) {
    var _this;
    _classCallCheck(this, Offcanvas);
    _this = _super.call(this, props);
    _this._element = null;
    _this._originalBodyPadding = null;
    _this.getFocusableChildren = _this.getFocusableChildren.bind(_assertThisInitialized(_this));
    _this.handleBackdropClick = _this.handleBackdropClick.bind(_assertThisInitialized(_this));
    _this.handleBackdropMouseDown = _this.handleBackdropMouseDown.bind(_assertThisInitialized(_this));
    _this.handleEscape = _this.handleEscape.bind(_assertThisInitialized(_this));
    _this.handleTab = _this.handleTab.bind(_assertThisInitialized(_this));
    _this.onOpened = _this.onOpened.bind(_assertThisInitialized(_this));
    _this.onClosed = _this.onClosed.bind(_assertThisInitialized(_this));
    _this.manageFocusAfterClose = _this.manageFocusAfterClose.bind(_assertThisInitialized(_this));
    _this.clearBackdropAnimationTimeout = _this.clearBackdropAnimationTimeout.bind(_assertThisInitialized(_this));
    _this.trapFocus = _this.trapFocus.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: false
    };
    return _this;
  }
  _createClass(Offcanvas, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
        isOpen = _this$props.isOpen,
        autoFocus = _this$props.autoFocus,
        onEnter = _this$props.onEnter;
      if (isOpen) {
        this.init();
        this.setState({
          isOpen: true
        });
        if (autoFocus) {
          this.setFocus();
        }
      }
      if (onEnter) {
        onEnter();
      }

      // traps focus inside the Offcanvas, even if the browser address bar is focused
      document.addEventListener('focus', this.trapFocus, true);
      this._isMounted = true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.isOpen && !prevProps.isOpen) {
        this.init();
        this.setState({
          isOpen: true
        });
        return;
      }

      // now Offcanvas Dialog is rendered and we can refer this._element and this._dialog
      if (this.props.autoFocus && this.state.isOpen && !prevState.isOpen) {
        this.setFocus();
      }
      if (this._element && prevProps.zIndex !== this.props.zIndex) {
        this._element.style.zIndex = this.props.zIndex;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearBackdropAnimationTimeout();
      if (this.props.onExit) {
        this.props.onExit();
      }
      if (this._element) {
        this.destroy();
        if (this.props.isOpen || this.state.isOpen) {
          this.close();
        }
      }
      document.removeEventListener('focus', this.trapFocus, true);
      this._isMounted = false;
    }

    // not mouseUp because scrollbar fires it, shouldn't close when user scrolls
  }, {
    key: "handleBackdropClick",
    value: function handleBackdropClick(e) {
      if (e.target === this._mouseDownElement) {
        e.stopPropagation();
        var backdrop = this._backdrop;
        if (!this.props.isOpen || this.props.backdrop !== true) return;
        if (backdrop && e.target === backdrop && this.props.toggle) {
          this.props.toggle(e);
        }
      }
    }
  }, {
    key: "handleTab",
    value: function handleTab(e) {
      if (e.which !== 9) return;
      if (this.offcanvasIndex < Offcanvas.openCount - 1) return; // last opened offcanvas

      var focusableChildren = this.getFocusableChildren();
      var totalFocusable = focusableChildren.length;
      if (totalFocusable === 0) return;
      var currentFocus = this.getFocusedChild();
      var focusedIndex = 0;
      for (var i = 0; i < totalFocusable; i += 1) {
        if (focusableChildren[i] === currentFocus) {
          focusedIndex = i;
          break;
        }
      }
      if (e.shiftKey && focusedIndex === 0) {
        e.preventDefault();
        focusableChildren[totalFocusable - 1].focus();
      } else if (!e.shiftKey && focusedIndex === totalFocusable - 1) {
        e.preventDefault();
        focusableChildren[0].focus();
      }
    }
  }, {
    key: "handleBackdropMouseDown",
    value: function handleBackdropMouseDown(e) {
      this._mouseDownElement = e.target;
    }
  }, {
    key: "handleEscape",
    value: function handleEscape(e) {
      if (this.props.isOpen && e.keyCode === keyCodes.esc && this.props.toggle) {
        if (this.props.keyboard) {
          e.preventDefault();
          e.stopPropagation();
          this.props.toggle(e);
        }
      }
    }
  }, {
    key: "onOpened",
    value: function onOpened(node, isAppearing) {
      this.props.onOpened();
      (this.props.offcanvasTransition.onEntered || noop)(node, isAppearing);
    }
  }, {
    key: "onClosed",
    value: function onClosed(node) {
      var unmountOnClose = this.props.unmountOnClose;
      // so all methods get called before it is unmounted
      this.props.onClosed();
      (this.props.offcanvasTransition.onExited || noop)(node);
      if (unmountOnClose) {
        this.destroy();
      }
      this.close();
      if (this._isMounted) {
        this.setState({
          isOpen: false
        });
      }
    }
  }, {
    key: "setFocus",
    value: function setFocus() {
      if (this._dialog && typeof this._dialog.focus === 'function') {
        this._dialog.focus();
      }
    }
  }, {
    key: "getFocusableChildren",
    value: function getFocusableChildren() {
      return this._element.querySelectorAll(focusableElements.join(', '));
    }
  }, {
    key: "getFocusedChild",
    value: function getFocusedChild() {
      var currentFocus;
      var focusableChildren = this.getFocusableChildren();
      try {
        currentFocus = document.activeElement;
      } catch (err) {
        currentFocus = focusableChildren[0];
      }
      return currentFocus;
    }
  }, {
    key: "trapFocus",
    value: function trapFocus(ev) {
      if (!this.props.trapFocus) {
        return;
      }
      if (!this._element) {
        // element is not attached
        return;
      }
      if (this._dialog === ev.target) {
        // initial focus when the Offcanvas is opened
        return;
      }
      if (this.offcanvasIndex < Offcanvas.openCount - 1) {
        // last opened offcanvas
        return;
      }
      var children = this.getFocusableChildren();
      for (var i = 0; i < children.length; i += 1) {
        // focus is already inside the Offcanvas
        if (children[i] === ev.target) return;
      }
      if (children.length > 0) {
        // otherwise focus the first focusable element in the Offcanvas
        ev.preventDefault();
        ev.stopPropagation();
        children[0].focus();
      }
    }
  }, {
    key: "init",
    value: function init() {
      try {
        this._triggeringElement = document.activeElement;
      } catch (err) {
        this._triggeringElement = null;
      }
      if (!this._element) {
        this._element = document.createElement('div');
        this._element.setAttribute('tabindex', '-1');
        this._element.style.position = 'relative';
        this._element.style.zIndex = this.props.zIndex;
        this._mountContainer = getTarget(this.props.container);
        this._mountContainer.appendChild(this._element);
      }
      this._originalBodyPadding = getOriginalBodyPadding();
      conditionallyUpdateScrollbar();
      if (Offcanvas.openCount === 0 && this.props.backdrop && !this.props.scrollable) {
        document.body.style.overflow = 'hidden';
      }
      this.offcanvasIndex = Offcanvas.openCount;
      Offcanvas.openCount += 1;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this._element) {
        this._mountContainer.removeChild(this._element);
        this._element = null;
      }
      this.manageFocusAfterClose();
    }
  }, {
    key: "manageFocusAfterClose",
    value: function manageFocusAfterClose() {
      if (this._triggeringElement) {
        var returnFocusAfterClose = this.props.returnFocusAfterClose;
        if (this._triggeringElement.focus && returnFocusAfterClose) this._triggeringElement.focus();
        this._triggeringElement = null;
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.manageFocusAfterClose();
      Offcanvas.openCount = Math.max(0, Offcanvas.openCount - 1);
      document.body.style.overflow = null;
      setScrollbarWidth(this._originalBodyPadding);
    }
  }, {
    key: "clearBackdropAnimationTimeout",
    value: function clearBackdropAnimationTimeout() {
      if (this._backdropAnimationTimeout) {
        clearTimeout(this._backdropAnimationTimeout);
        this._backdropAnimationTimeout = undefined;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props2 = this.props,
        direction = _this$props2.direction,
        unmountOnClose = _this$props2.unmountOnClose;
      if (!!this._element && (this.state.isOpen || !unmountOnClose)) {
        var isOffcanvasHidden = !!this._element && !this.state.isOpen && !unmountOnClose;
        this._element.style.display = isOffcanvasHidden ? 'none' : 'block';
        var _this$props3 = this.props,
          className = _this$props3.className,
          backdropClassName = _this$props3.backdropClassName,
          cssModule = _this$props3.cssModule,
          isOpen = _this$props3.isOpen,
          backdrop = _this$props3.backdrop,
          role = _this$props3.role,
          labelledBy = _this$props3.labelledBy,
          style = _this$props3.style;
        var offcanvasAttributes = {
          onKeyUp: this.handleEscape,
          onKeyDown: this.handleTab,
          'aria-labelledby': labelledBy,
          role: role,
          tabIndex: '-1'
        };
        var hasTransition = this.props.fade;
        var offcanvasTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), this.props.offcanvasTransition), {}, {
          baseClass: hasTransition ? this.props.offcanvasTransition.baseClass : '',
          timeout: hasTransition ? this.props.offcanvasTransition.timeout : 0
        });
        var backdropTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), this.props.backdropTransition), {}, {
          baseClass: hasTransition ? this.props.backdropTransition.baseClass : '',
          timeout: hasTransition ? this.props.backdropTransition.timeout : 0
        });
        var Backdrop = backdrop && (hasTransition ? /*#__PURE__*/React.createElement(Fade, _extends({}, backdropTransition, {
          "in": isOpen && !!backdrop,
          innerRef: function innerRef(c) {
            _this2._backdrop = c;
          },
          cssModule: cssModule,
          className: mapToCssModules(classNames('offcanvas-backdrop', backdropClassName), cssModule),
          onClick: this.handleBackdropClick,
          onMouseDown: this.handleBackdropMouseDown
        })) : /*#__PURE__*/React.createElement("div", {
          className: mapToCssModules(classNames('offcanvas-backdrop', 'show', backdropClassName), cssModule),
          ref: function ref(c) {
            _this2._backdrop = c;
          },
          onClick: this.handleBackdropClick,
          onMouseDown: this.handleBackdropMouseDown
        }));
        var attributes = omit(this.props, propsToOmit);
        return /*#__PURE__*/React.createElement(Portal, {
          node: this._element
        }, /*#__PURE__*/React.createElement(Fade, _extends({}, attributes, offcanvasAttributes, offcanvasTransition, {
          "in": isOpen,
          onEntered: this.onOpened,
          onExited: this.onClosed,
          cssModule: cssModule,
          className: mapToCssModules(classNames('offcanvas', className, "offcanvas-".concat(direction)), cssModule),
          innerRef: function innerRef(c) {
            _this2._dialog = c;
          },
          style: _objectSpread(_objectSpread({}, style), {}, {
            visibility: isOpen ? 'visible' : 'hidden'
          })
        }), this.props.children), Backdrop);
      }
      return null;
    }
  }]);
  return Offcanvas;
}(React.Component);
Offcanvas.propTypes = propTypes;
Offcanvas.defaultProps = defaultProps;
Offcanvas.openCount = 0;
export default Offcanvas;