function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
import { getOriginalBodyPadding, conditionallyUpdateScrollbar, setScrollbarWidth, mapToCssModules, omit, focusableElements, TransitionTimeouts, keyCodes, targetPropType, getTarget } from './utils';
function noop() {}
var FadePropTypes = PropTypes.shape(Fade.propTypes);
var propTypes = {
  /** */
  autoFocus: PropTypes.bool,
  /** Add backdrop to modal */
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['static'])]),
  /** add custom classname to backdrop */
  backdropClassName: PropTypes.string,
  backdropTransition: FadePropTypes,
  /** Vertically center the modal */
  centered: PropTypes.bool,
  /** Add children for the modal to wrap */
  children: PropTypes.node,
  /** Add custom className for modal content */
  contentClassName: PropTypes.string,
  className: PropTypes.string,
  container: targetPropType,
  cssModule: PropTypes.object,
  external: PropTypes.node,
  /** Enable/Disable animation */
  fade: PropTypes.bool,
  /** Make the modal fullscreen */
  fullscreen: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])]),
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  /** The status of the modal, either open or close */
  isOpen: PropTypes.bool,
  /** Allow modal to be closed with escape key. */
  keyboard: PropTypes.bool,
  /** Identifies the element (or elements) that labels the current element. */
  labelledBy: PropTypes.string,
  modalClassName: PropTypes.string,
  modalTransition: FadePropTypes,
  /** Function to be triggered on close */
  onClosed: PropTypes.func,
  /** Function to be triggered on enter */
  onEnter: PropTypes.func,
  /** Function to be triggered on exit */
  onExit: PropTypes.func,
  /** Function to be triggered on open */
  onOpened: PropTypes.func,
  /** Returns focus to the element that triggered opening of the modal */
  returnFocusAfterClose: PropTypes.bool,
  /** Accessibility role */
  role: PropTypes.string,
  /** Make the modal scrollable */
  scrollable: PropTypes.bool,
  /** Two optional sizes `lg` and `sm` */
  size: PropTypes.string,
  /** Function to toggle modal visibility */
  toggle: PropTypes.func,
  trapFocus: PropTypes.bool,
  /** Unmounts the modal when modal is closed */
  unmountOnClose: PropTypes.bool,
  wrapClassName: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
var propsToOmit = Object.keys(propTypes);
var defaultProps = {
  isOpen: false,
  autoFocus: true,
  centered: false,
  scrollable: false,
  role: 'dialog',
  backdrop: true,
  keyboard: true,
  zIndex: 1050,
  fade: true,
  onOpened: noop,
  onClosed: noop,
  modalTransition: {
    timeout: TransitionTimeouts.Modal
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
var Modal = /*#__PURE__*/function (_React$Component) {
  _inherits(Modal, _React$Component);
  var _super = _createSuper(Modal);
  function Modal(props) {
    var _this;
    _classCallCheck(this, Modal);
    _this = _super.call(this, props);
    _this._element = null;
    _this._originalBodyPadding = null;
    _this.getFocusableChildren = _this.getFocusableChildren.bind(_assertThisInitialized(_this));
    _this.handleBackdropClick = _this.handleBackdropClick.bind(_assertThisInitialized(_this));
    _this.handleBackdropMouseDown = _this.handleBackdropMouseDown.bind(_assertThisInitialized(_this));
    _this.handleEscape = _this.handleEscape.bind(_assertThisInitialized(_this));
    _this.handleStaticBackdropAnimation = _this.handleStaticBackdropAnimation.bind(_assertThisInitialized(_this));
    _this.handleTab = _this.handleTab.bind(_assertThisInitialized(_this));
    _this.onOpened = _this.onOpened.bind(_assertThisInitialized(_this));
    _this.onClosed = _this.onClosed.bind(_assertThisInitialized(_this));
    _this.manageFocusAfterClose = _this.manageFocusAfterClose.bind(_assertThisInitialized(_this));
    _this.clearBackdropAnimationTimeout = _this.clearBackdropAnimationTimeout.bind(_assertThisInitialized(_this));
    _this.trapFocus = _this.trapFocus.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: false,
      showStaticBackdropAnimation: false
    };
    return _this;
  }
  _createClass(Modal, [{
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

      // traps focus inside the Modal, even if the browser address bar is focused
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
        // let render() renders Modal Dialog first
        return;
      }

      // now Modal Dialog is rendered and we can refer this._element and this._dialog
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
        var backdrop = this._dialog ? this._dialog.parentNode : null;
        if (backdrop && e.target === backdrop && this.props.backdrop === 'static') {
          this.handleStaticBackdropAnimation();
        }
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
      if (this.modalIndex < Modal.openCount - 1) return; // last opened modal

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
        } else if (this.props.backdrop === 'static') {
          e.preventDefault();
          e.stopPropagation();
          this.handleStaticBackdropAnimation();
        }
      }
    }
  }, {
    key: "handleStaticBackdropAnimation",
    value: function handleStaticBackdropAnimation() {
      var _this2 = this;
      this.clearBackdropAnimationTimeout();
      this.setState({
        showStaticBackdropAnimation: true
      });
      this._backdropAnimationTimeout = setTimeout(function () {
        _this2.setState({
          showStaticBackdropAnimation: false
        });
      }, 100);
    }
  }, {
    key: "onOpened",
    value: function onOpened(node, isAppearing) {
      this.props.onOpened();
      (this.props.modalTransition.onEntered || noop)(node, isAppearing);
    }
  }, {
    key: "onClosed",
    value: function onClosed(node) {
      var unmountOnClose = this.props.unmountOnClose;
      // so all methods get called before it is unmounted
      this.props.onClosed();
      (this.props.modalTransition.onExited || noop)(node);
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
      if (this._dialog && this._dialog.parentNode && typeof this._dialog.parentNode.focus === 'function') {
        this._dialog.parentNode.focus();
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
      if (this._dialog && this._dialog.parentNode === ev.target) {
        // initial focus when the Modal is opened
        return;
      }
      if (this.modalIndex < Modal.openCount - 1) {
        // last opened modal
        return;
      }
      var children = this.getFocusableChildren();
      for (var i = 0; i < children.length; i += 1) {
        // focus is already inside the Modal
        if (children[i] === ev.target) return;
      }
      if (children.length > 0) {
        // otherwise focus the first focusable element in the Modal
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
      if (Modal.openCount < 1) {
        Modal.originalBodyOverflow = window.getComputedStyle(document.body).overflow;
      }
      conditionallyUpdateScrollbar();
      if (Modal.openCount === 0) {
        document.body.className = classNames(document.body.className, mapToCssModules('modal-open', this.props.cssModule));
        document.body.style.overflow = 'hidden';
      }
      this.modalIndex = Modal.openCount;
      Modal.openCount += 1;
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
      if (Modal.openCount <= 1) {
        var modalOpenClassName = mapToCssModules('modal-open', this.props.cssModule);
        // Use regex to prevent matching `modal-open` as part of a different class, e.g. `my-modal-opened`
        var modalOpenClassNameRegex = new RegExp("(^| )".concat(modalOpenClassName, "( |$)"));
        document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
        document.body.style.overflow = Modal.originalBodyOverflow;
      }
      this.manageFocusAfterClose();
      Modal.openCount = Math.max(0, Modal.openCount - 1);
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
    key: "renderModalDialog",
    value: function renderModalDialog() {
      var _classNames,
        _this3 = this;
      var attributes = omit(this.props, propsToOmit);
      var dialogBaseClass = 'modal-dialog';
      return /*#__PURE__*/React.createElement("div", _extends({}, attributes, {
        className: mapToCssModules(classNames(dialogBaseClass, this.props.className, (_classNames = {}, _defineProperty(_classNames, "modal-".concat(this.props.size), this.props.size), _defineProperty(_classNames, "".concat(dialogBaseClass, "-centered"), this.props.centered), _defineProperty(_classNames, "".concat(dialogBaseClass, "-scrollable"), this.props.scrollable), _defineProperty(_classNames, 'modal-fullscreen', this.props.fullscreen === true), _defineProperty(_classNames, "modal-fullscreen-".concat(this.props.fullscreen, "-down"), typeof this.props.fullscreen === 'string'), _classNames)), this.props.cssModule),
        role: "document",
        ref: function ref(c) {
          _this3._dialog = c;
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: mapToCssModules(classNames('modal-content', this.props.contentClassName), this.props.cssModule)
      }, this.props.children));
    }
  }, {
    key: "render",
    value: function render() {
      var unmountOnClose = this.props.unmountOnClose;
      if (!!this._element && (this.state.isOpen || !unmountOnClose)) {
        var isModalHidden = !!this._element && !this.state.isOpen && !unmountOnClose;
        this._element.style.display = isModalHidden ? 'none' : 'block';
        var _this$props2 = this.props,
          wrapClassName = _this$props2.wrapClassName,
          modalClassName = _this$props2.modalClassName,
          backdropClassName = _this$props2.backdropClassName,
          cssModule = _this$props2.cssModule,
          isOpen = _this$props2.isOpen,
          backdrop = _this$props2.backdrop,
          role = _this$props2.role,
          labelledBy = _this$props2.labelledBy,
          external = _this$props2.external,
          innerRef = _this$props2.innerRef;
        var modalAttributes = {
          onClick: this.handleBackdropClick,
          onMouseDown: this.handleBackdropMouseDown,
          onKeyUp: this.handleEscape,
          onKeyDown: this.handleTab,
          style: {
            display: 'block'
          },
          'aria-labelledby': labelledBy,
          'aria-modal': true,
          role: role,
          tabIndex: '-1'
        };
        var hasTransition = this.props.fade;
        var modalTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), this.props.modalTransition), {}, {
          baseClass: hasTransition ? this.props.modalTransition.baseClass : '',
          timeout: hasTransition ? this.props.modalTransition.timeout : 0
        });
        var backdropTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), this.props.backdropTransition), {}, {
          baseClass: hasTransition ? this.props.backdropTransition.baseClass : '',
          timeout: hasTransition ? this.props.backdropTransition.timeout : 0
        });
        var Backdrop = backdrop && (hasTransition ? /*#__PURE__*/React.createElement(Fade, _extends({}, backdropTransition, {
          "in": isOpen && !!backdrop,
          cssModule: cssModule,
          className: mapToCssModules(classNames('modal-backdrop', backdropClassName), cssModule)
        })) : /*#__PURE__*/React.createElement("div", {
          className: mapToCssModules(classNames('modal-backdrop', 'show', backdropClassName), cssModule)
        }));
        return /*#__PURE__*/React.createElement(Portal, {
          node: this._element
        }, /*#__PURE__*/React.createElement("div", {
          className: mapToCssModules(wrapClassName)
        }, /*#__PURE__*/React.createElement(Fade, _extends({}, modalAttributes, modalTransition, {
          "in": isOpen,
          onEntered: this.onOpened,
          onExited: this.onClosed,
          cssModule: cssModule,
          className: mapToCssModules(classNames('modal', modalClassName, this.state.showStaticBackdropAnimation && 'modal-static'), cssModule),
          innerRef: innerRef
        }), external, this.renderModalDialog()), Backdrop));
      }
      return null;
    }
  }]);
  return Modal;
}(React.Component);
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
Modal.openCount = 0;
Modal.originalBodyOverflow = null;
export default Modal;