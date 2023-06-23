"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _Portal = _interopRequireDefault(require("./Portal"));
var _Fade = _interopRequireDefault(require("./Fade"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function noop() {}
const FadePropTypes = _propTypes.default.shape(_Fade.default.propTypes);
const propTypes = {
  /** */
  autoFocus: _propTypes.default.bool,
  /** Add backdrop to modal */
  backdrop: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.oneOf(['static'])]),
  /** add custom classname to backdrop */
  backdropClassName: _propTypes.default.string,
  backdropTransition: FadePropTypes,
  /** Vertically center the modal */
  centered: _propTypes.default.bool,
  /** Add children for the modal to wrap */
  children: _propTypes.default.node,
  /** Add custom className for modal content */
  contentClassName: _propTypes.default.string,
  className: _propTypes.default.string,
  container: _utils.targetPropType,
  cssModule: _propTypes.default.object,
  external: _propTypes.default.node,
  /** Enable/Disable animation */
  fade: _propTypes.default.bool,
  /** Make the modal fullscreen */
  fullscreen: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.oneOf(['sm', 'md', 'lg', 'xl'])]),
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func]),
  /** The status of the modal, either open or close */
  isOpen: _propTypes.default.bool,
  /** Allow modal to be closed with escape key. */
  keyboard: _propTypes.default.bool,
  /** Identifies the element (or elements) that labels the current element. */
  labelledBy: _propTypes.default.string,
  modalClassName: _propTypes.default.string,
  modalTransition: FadePropTypes,
  /** Function to be triggered on close */
  onClosed: _propTypes.default.func,
  /** Function to be triggered on enter */
  onEnter: _propTypes.default.func,
  /** Function to be triggered on exit */
  onExit: _propTypes.default.func,
  /** Function to be triggered on open */
  onOpened: _propTypes.default.func,
  /** Returns focus to the element that triggered opening of the modal */
  returnFocusAfterClose: _propTypes.default.bool,
  /** Accessibility role */
  role: _propTypes.default.string,
  /** Make the modal scrollable */
  scrollable: _propTypes.default.bool,
  /** Two optional sizes `lg` and `sm` */
  size: _propTypes.default.string,
  /** Function to toggle modal visibility */
  toggle: _propTypes.default.func,
  trapFocus: _propTypes.default.bool,
  /** Unmounts the modal when modal is closed */
  unmountOnClose: _propTypes.default.bool,
  wrapClassName: _propTypes.default.string,
  zIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
};
const propsToOmit = Object.keys(propTypes);
const defaultProps = {
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
    timeout: _utils.TransitionTimeouts.Modal
  },
  backdropTransition: {
    mountOnEnter: true,
    timeout: _utils.TransitionTimeouts.Fade // uses standard fade transition
  },

  unmountOnClose: true,
  returnFocusAfterClose: true,
  container: 'body',
  trapFocus: false
};
class Modal extends _react.default.Component {
  constructor(props) {
    super(props);
    this._element = null;
    this._originalBodyPadding = null;
    this.getFocusableChildren = this.getFocusableChildren.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleBackdropMouseDown = this.handleBackdropMouseDown.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.handleStaticBackdropAnimation = this.handleStaticBackdropAnimation.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onClosed = this.onClosed.bind(this);
    this.manageFocusAfterClose = this.manageFocusAfterClose.bind(this);
    this.clearBackdropAnimationTimeout = this.clearBackdropAnimationTimeout.bind(this);
    this.trapFocus = this.trapFocus.bind(this);
    this.state = {
      isOpen: false,
      showStaticBackdropAnimation: false
    };
  }
  componentDidMount() {
    const {
      isOpen,
      autoFocus,
      onEnter
    } = this.props;
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
  componentDidUpdate(prevProps, prevState) {
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
  componentWillUnmount() {
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
  handleBackdropClick(e) {
    if (e.target === this._mouseDownElement) {
      e.stopPropagation();
      const backdrop = this._dialog ? this._dialog.parentNode : null;
      if (backdrop && e.target === backdrop && this.props.backdrop === 'static') {
        this.handleStaticBackdropAnimation();
      }
      if (!this.props.isOpen || this.props.backdrop !== true) return;
      if (backdrop && e.target === backdrop && this.props.toggle) {
        this.props.toggle(e);
      }
    }
  }
  handleTab(e) {
    if (e.which !== 9) return;
    if (this.modalIndex < Modal.openCount - 1) return; // last opened modal

    const focusableChildren = this.getFocusableChildren();
    const totalFocusable = focusableChildren.length;
    if (totalFocusable === 0) return;
    const currentFocus = this.getFocusedChild();
    let focusedIndex = 0;
    for (let i = 0; i < totalFocusable; i += 1) {
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
  handleBackdropMouseDown(e) {
    this._mouseDownElement = e.target;
  }
  handleEscape(e) {
    if (this.props.isOpen && e.keyCode === _utils.keyCodes.esc && this.props.toggle) {
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
  handleStaticBackdropAnimation() {
    this.clearBackdropAnimationTimeout();
    this.setState({
      showStaticBackdropAnimation: true
    });
    this._backdropAnimationTimeout = setTimeout(() => {
      this.setState({
        showStaticBackdropAnimation: false
      });
    }, 100);
  }
  onOpened(node, isAppearing) {
    this.props.onOpened();
    (this.props.modalTransition.onEntered || noop)(node, isAppearing);
  }
  onClosed(node) {
    const {
      unmountOnClose
    } = this.props;
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
  setFocus() {
    if (this._dialog && this._dialog.parentNode && typeof this._dialog.parentNode.focus === 'function') {
      this._dialog.parentNode.focus();
    }
  }
  getFocusableChildren() {
    return this._element.querySelectorAll(_utils.focusableElements.join(', '));
  }
  getFocusedChild() {
    let currentFocus;
    const focusableChildren = this.getFocusableChildren();
    try {
      currentFocus = document.activeElement;
    } catch (err) {
      currentFocus = focusableChildren[0];
    }
    return currentFocus;
  }
  trapFocus(ev) {
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
    const children = this.getFocusableChildren();
    for (let i = 0; i < children.length; i += 1) {
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
  init() {
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
      this._mountContainer = (0, _utils.getTarget)(this.props.container);
      this._mountContainer.appendChild(this._element);
    }
    this._originalBodyPadding = (0, _utils.getOriginalBodyPadding)();
    if (Modal.openCount < 1) {
      Modal.originalBodyOverflow = window.getComputedStyle(document.body).overflow;
    }
    (0, _utils.conditionallyUpdateScrollbar)();
    if (Modal.openCount === 0) {
      document.body.className = (0, _classnames.default)(document.body.className, (0, _utils.mapToCssModules)('modal-open', this.props.cssModule));
      document.body.style.overflow = 'hidden';
    }
    this.modalIndex = Modal.openCount;
    Modal.openCount += 1;
  }
  destroy() {
    if (this._element) {
      this._mountContainer.removeChild(this._element);
      this._element = null;
    }
    this.manageFocusAfterClose();
  }
  manageFocusAfterClose() {
    if (this._triggeringElement) {
      const {
        returnFocusAfterClose
      } = this.props;
      if (this._triggeringElement.focus && returnFocusAfterClose) this._triggeringElement.focus();
      this._triggeringElement = null;
    }
  }
  close() {
    if (Modal.openCount <= 1) {
      const modalOpenClassName = (0, _utils.mapToCssModules)('modal-open', this.props.cssModule);
      // Use regex to prevent matching `modal-open` as part of a different class, e.g. `my-modal-opened`
      const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
      document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
      document.body.style.overflow = Modal.originalBodyOverflow;
    }
    this.manageFocusAfterClose();
    Modal.openCount = Math.max(0, Modal.openCount - 1);
    (0, _utils.setScrollbarWidth)(this._originalBodyPadding);
  }
  clearBackdropAnimationTimeout() {
    if (this._backdropAnimationTimeout) {
      clearTimeout(this._backdropAnimationTimeout);
      this._backdropAnimationTimeout = undefined;
    }
  }
  renderModalDialog() {
    const attributes = (0, _utils.omit)(this.props, propsToOmit);
    const dialogBaseClass = 'modal-dialog';
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, attributes, {
      className: (0, _utils.mapToCssModules)((0, _classnames.default)(dialogBaseClass, this.props.className, {
        [`modal-${this.props.size}`]: this.props.size,
        [`${dialogBaseClass}-centered`]: this.props.centered,
        [`${dialogBaseClass}-scrollable`]: this.props.scrollable,
        'modal-fullscreen': this.props.fullscreen === true,
        [`modal-fullscreen-${this.props.fullscreen}-down`]: typeof this.props.fullscreen === 'string'
      }), this.props.cssModule),
      role: "document",
      ref: c => {
        this._dialog = c;
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _utils.mapToCssModules)((0, _classnames.default)('modal-content', this.props.contentClassName), this.props.cssModule)
    }, this.props.children));
  }
  render() {
    const {
      unmountOnClose
    } = this.props;
    if (!!this._element && (this.state.isOpen || !unmountOnClose)) {
      const isModalHidden = !!this._element && !this.state.isOpen && !unmountOnClose;
      this._element.style.display = isModalHidden ? 'none' : 'block';
      const {
        wrapClassName,
        modalClassName,
        backdropClassName,
        cssModule,
        isOpen,
        backdrop,
        role,
        labelledBy,
        external,
        innerRef
      } = this.props;
      const modalAttributes = {
        onClick: this.handleBackdropClick,
        onMouseDown: this.handleBackdropMouseDown,
        onKeyUp: this.handleEscape,
        onKeyDown: this.handleTab,
        style: {
          display: 'block'
        },
        'aria-labelledby': labelledBy,
        'aria-modal': true,
        role,
        tabIndex: '-1'
      };
      const hasTransition = this.props.fade;
      const modalTransition = _objectSpread(_objectSpread(_objectSpread({}, _Fade.default.defaultProps), this.props.modalTransition), {}, {
        baseClass: hasTransition ? this.props.modalTransition.baseClass : '',
        timeout: hasTransition ? this.props.modalTransition.timeout : 0
      });
      const backdropTransition = _objectSpread(_objectSpread(_objectSpread({}, _Fade.default.defaultProps), this.props.backdropTransition), {}, {
        baseClass: hasTransition ? this.props.backdropTransition.baseClass : '',
        timeout: hasTransition ? this.props.backdropTransition.timeout : 0
      });
      const Backdrop = backdrop && (hasTransition ? /*#__PURE__*/_react.default.createElement(_Fade.default, _extends({}, backdropTransition, {
        in: isOpen && !!backdrop,
        cssModule: cssModule,
        className: (0, _utils.mapToCssModules)((0, _classnames.default)('modal-backdrop', backdropClassName), cssModule)
      })) : /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _utils.mapToCssModules)((0, _classnames.default)('modal-backdrop', 'show', backdropClassName), cssModule)
      }));
      return /*#__PURE__*/_react.default.createElement(_Portal.default, {
        node: this._element
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _utils.mapToCssModules)(wrapClassName)
      }, /*#__PURE__*/_react.default.createElement(_Fade.default, _extends({}, modalAttributes, modalTransition, {
        in: isOpen,
        onEntered: this.onOpened,
        onExited: this.onClosed,
        cssModule: cssModule,
        className: (0, _utils.mapToCssModules)((0, _classnames.default)('modal', modalClassName, this.state.showStaticBackdropAnimation && 'modal-static'), cssModule),
        innerRef: innerRef
      }), external, this.renderModalDialog()), Backdrop));
    }
    return null;
  }
}
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
Modal.openCount = 0;
Modal.originalBodyOverflow = null;
var _default = Modal;
exports.default = _default;