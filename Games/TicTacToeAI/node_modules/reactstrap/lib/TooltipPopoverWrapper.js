"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _PopperContent = _interopRequireDefault(require("./PopperContent"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
  placement: _propTypes.default.oneOf(_utils.PopperPlacements),
  target: _utils.targetPropType.isRequired,
  container: _utils.targetPropType,
  isOpen: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  hideArrow: _propTypes.default.bool,
  boundariesElement: _propTypes.default.oneOfType([_propTypes.default.string, _utils.DOMElement]),
  className: _propTypes.default.string,
  innerClassName: _propTypes.default.string,
  arrowClassName: _propTypes.default.string,
  popperClassName: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  toggle: _propTypes.default.func,
  autohide: _propTypes.default.bool,
  placementPrefix: _propTypes.default.string,
  delay: _propTypes.default.oneOfType([_propTypes.default.shape({
    show: _propTypes.default.number,
    hide: _propTypes.default.number
  }), _propTypes.default.number]),
  modifiers: _propTypes.default.array,
  strategy: _propTypes.default.string,
  offset: _propTypes.default.arrayOf(_propTypes.default.number),
  innerRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string, _propTypes.default.object]),
  trigger: _propTypes.default.string,
  fade: _propTypes.default.bool,
  flip: _propTypes.default.bool
};
exports.propTypes = propTypes;
const DEFAULT_DELAYS = {
  show: 0,
  hide: 50
};
const defaultProps = {
  isOpen: false,
  hideArrow: false,
  autohide: false,
  delay: DEFAULT_DELAYS,
  toggle: function () {},
  trigger: 'click',
  fade: true
};
function isInDOMSubtree(element, subtreeRoot) {
  return subtreeRoot && (element === subtreeRoot || subtreeRoot.contains(element));
}
function isInDOMSubtrees(element, subtreeRoots = []) {
  return subtreeRoots && subtreeRoots.length && subtreeRoots.filter(subTreeRoot => isInDOMSubtree(element, subTreeRoot))[0];
}
class TooltipPopoverWrapper extends _react.default.Component {
  constructor(props) {
    super(props);
    this._targets = [];
    this.currentTargetElement = null;
    this.addTargetEvents = this.addTargetEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.removeTargetEvents = this.removeTargetEvents.bind(this);
    this.toggle = this.toggle.bind(this);
    this.showWithDelay = this.showWithDelay.bind(this);
    this.hideWithDelay = this.hideWithDelay.bind(this);
    this.onMouseOverTooltipContent = this.onMouseOverTooltipContent.bind(this);
    this.onMouseLeaveTooltipContent = this.onMouseLeaveTooltipContent.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onEscKeyDown = this.onEscKeyDown.bind(this);
    this.getRef = this.getRef.bind(this);
    this.state = {
      isOpen: props.isOpen
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.updateTarget();
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.removeTargetEvents();
    this._targets = null;
    this.clearShowTimeout();
    this.clearHideTimeout();
  }
  static getDerivedStateFromProps(props, state) {
    if (props.isOpen && !state.isOpen) {
      return {
        isOpen: props.isOpen
      };
    }
    return null;
  }
  handleDocumentClick(e) {
    const triggers = this.props.trigger.split(' ');
    if (triggers.indexOf('legacy') > -1 && (this.props.isOpen || isInDOMSubtrees(e.target, this._targets))) {
      if (this._hideTimeout) {
        this.clearHideTimeout();
      }
      if (this.props.isOpen && !isInDOMSubtree(e.target, this._popover)) {
        this.hideWithDelay(e);
      } else if (!this.props.isOpen) {
        this.showWithDelay(e);
      }
    } else if (triggers.indexOf('click') > -1 && isInDOMSubtrees(e.target, this._targets)) {
      if (this._hideTimeout) {
        this.clearHideTimeout();
      }
      if (!this.props.isOpen) {
        this.showWithDelay(e);
      } else {
        this.hideWithDelay(e);
      }
    }
  }
  onMouseOverTooltipContent() {
    if (this.props.trigger.indexOf('hover') > -1 && !this.props.autohide) {
      if (this._hideTimeout) {
        this.clearHideTimeout();
      }
      if (this.state.isOpen && !this.props.isOpen) {
        this.toggle();
      }
    }
  }
  onMouseLeaveTooltipContent(e) {
    if (this.props.trigger.indexOf('hover') > -1 && !this.props.autohide) {
      if (this._showTimeout) {
        this.clearShowTimeout();
      }
      e.persist();
      this._hideTimeout = setTimeout(this.hide.bind(this, e), this.getDelay('hide'));
    }
  }
  onEscKeyDown(e) {
    if (e.key === 'Escape') {
      this.hide(e);
    }
  }
  getRef(ref) {
    const {
      innerRef
    } = this.props;
    if (innerRef) {
      if (typeof innerRef === 'function') {
        innerRef(ref);
      } else if (typeof innerRef === 'object') {
        innerRef.current = ref;
      }
    }
    this._popover = ref;
  }
  getDelay(key) {
    const {
      delay
    } = this.props;
    if (typeof delay === 'object') {
      return isNaN(delay[key]) ? DEFAULT_DELAYS[key] : delay[key];
    }
    return delay;
  }
  getCurrentTarget(target) {
    if (!target) return null;
    const index = this._targets.indexOf(target);
    if (index >= 0) return this._targets[index];
    return this.getCurrentTarget(target.parentElement);
  }
  show(e) {
    if (!this.props.isOpen) {
      this.clearShowTimeout();
      this.currentTargetElement = e ? e.currentTarget || this.getCurrentTarget(e.target) : null;
      if (e && e.composedPath && typeof e.composedPath === 'function') {
        const path = e.composedPath();
        this.currentTargetElement = path && path[0] || this.currentTargetElement;
      }
      this.toggle(e);
    }
  }
  showWithDelay(e) {
    if (this._hideTimeout) {
      this.clearHideTimeout();
    }
    this._showTimeout = setTimeout(this.show.bind(this, e), this.getDelay('show'));
  }
  hide(e) {
    if (this.props.isOpen) {
      this.clearHideTimeout();
      this.currentTargetElement = null;
      this.toggle(e);
    }
  }
  hideWithDelay(e) {
    if (this._showTimeout) {
      this.clearShowTimeout();
    }
    this._hideTimeout = setTimeout(this.hide.bind(this, e), this.getDelay('hide'));
  }
  clearShowTimeout() {
    clearTimeout(this._showTimeout);
    this._showTimeout = undefined;
  }
  clearHideTimeout() {
    clearTimeout(this._hideTimeout);
    this._hideTimeout = undefined;
  }
  addEventOnTargets(type, handler, isBubble) {
    this._targets.forEach(target => {
      target.addEventListener(type, handler, isBubble);
    });
  }
  removeEventOnTargets(type, handler, isBubble) {
    this._targets.forEach(target => {
      target.removeEventListener(type, handler, isBubble);
    });
  }
  addTargetEvents() {
    if (this.props.trigger) {
      let triggers = this.props.trigger.split(' ');
      if (triggers.indexOf('manual') === -1) {
        if (triggers.indexOf('click') > -1 || triggers.indexOf('legacy') > -1) {
          document.addEventListener('click', this.handleDocumentClick, true);
        }
        if (this._targets && this._targets.length) {
          if (triggers.indexOf('hover') > -1) {
            this.addEventOnTargets('mouseover', this.showWithDelay, true);
            this.addEventOnTargets('mouseout', this.hideWithDelay, true);
          }
          if (triggers.indexOf('focus') > -1) {
            this.addEventOnTargets('focusin', this.show, true);
            this.addEventOnTargets('focusout', this.hide, true);
          }
          this.addEventOnTargets('keydown', this.onEscKeyDown, true);
        }
      }
    }
  }
  removeTargetEvents() {
    if (this._targets) {
      this.removeEventOnTargets('mouseover', this.showWithDelay, true);
      this.removeEventOnTargets('mouseout', this.hideWithDelay, true);
      this.removeEventOnTargets('keydown', this.onEscKeyDown, true);
      this.removeEventOnTargets('focusin', this.show, true);
      this.removeEventOnTargets('focusout', this.hide, true);
    }
    document.removeEventListener('click', this.handleDocumentClick, true);
  }
  updateTarget() {
    const newTarget = (0, _utils.getTarget)(this.props.target, true);
    if (newTarget !== this._targets) {
      this.removeTargetEvents();
      this._targets = newTarget ? Array.from(newTarget) : [];
      this.currentTargetElement = this.currentTargetElement || this._targets[0];
      this.addTargetEvents();
    }
  }
  toggle(e) {
    if (this.props.disabled || !this._isMounted) {
      return e && e.preventDefault();
    }
    return this.props.toggle(e);
  }
  render() {
    if (this.props.isOpen) {
      this.updateTarget();
    }
    const target = this.currentTargetElement || this._targets[0];
    if (!target) {
      return null;
    }
    const {
      className,
      cssModule,
      innerClassName,
      isOpen,
      hideArrow,
      boundariesElement,
      placement,
      placementPrefix,
      arrowClassName,
      popperClassName,
      container,
      modifiers,
      strategy,
      offset,
      fade,
      flip,
      children
    } = this.props;
    const attributes = (0, _utils.omit)(this.props, Object.keys(propTypes));
    const popperClasses = (0, _utils.mapToCssModules)(popperClassName, cssModule);
    const classes = (0, _utils.mapToCssModules)(innerClassName, cssModule);
    return /*#__PURE__*/_react.default.createElement(_PopperContent.default, {
      className: className,
      target: target,
      isOpen: isOpen,
      hideArrow: hideArrow,
      boundariesElement: boundariesElement,
      placement: placement,
      placementPrefix: placementPrefix,
      arrowClassName: arrowClassName,
      popperClassName: popperClasses,
      container: container,
      modifiers: modifiers,
      strategy: strategy,
      offset: offset,
      cssModule: cssModule,
      fade: fade,
      flip: flip
    }, ({
      update
    }) => /*#__PURE__*/_react.default.createElement("div", _extends({}, attributes, {
      ref: this.getRef,
      className: classes,
      role: "tooltip",
      onMouseOver: this.onMouseOverTooltipContent,
      onMouseLeave: this.onMouseLeaveTooltipContent,
      onKeyDown: this.onEscKeyDown
    }), typeof children === 'function' ? children({
      update
    }) : children));
  }
}
TooltipPopoverWrapper.propTypes = propTypes;
TooltipPopoverWrapper.defaultProps = defaultProps;
var _default = TooltipPopoverWrapper;
exports.default = _default;