"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactTransitionGroup = require("react-transition-group");
var _CarouselContext = require("./CarouselContext");
var _utils = require("./utils");
const _excluded = ["in", "children", "cssModule", "slide", "tag", "className"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
class CarouselItem extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      startAnimation: false
    };
    this.onEnter = this.onEnter.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }
  onEnter(node, isAppearing) {
    this.setState({
      startAnimation: false
    });
    this.props.onEnter(node, isAppearing);
  }
  onEntering(node, isAppearing) {
    // getting this variable triggers a reflow
    const {
      offsetHeight
    } = node;
    this.setState({
      startAnimation: true
    });
    this.props.onEntering(node, isAppearing);
    return offsetHeight;
  }
  onExit(node) {
    this.setState({
      startAnimation: false
    });
    this.props.onExit(node);
  }
  onExiting(node) {
    this.setState({
      startAnimation: true
    });
    node.dispatchEvent(new CustomEvent('slide.bs.carousel'));
    this.props.onExiting(node);
  }
  onExited(node) {
    node.dispatchEvent(new CustomEvent('slid.bs.carousel'));
    this.props.onExited(node);
  }
  render() {
    const _this$props = this.props,
      {
        in: isIn,
        children,
        cssModule,
        slide = true,
        tag: Tag = 'div',
        className
      } = _this$props,
      transitionProps = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.Transition, _extends({}, transitionProps, {
      enter: slide,
      exit: slide,
      in: isIn,
      onEnter: this.onEnter,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }), status => {
      const {
        direction
      } = this.context;
      const isActive = status === _utils.TransitionStatuses.ENTERED || status === _utils.TransitionStatuses.EXITING;
      const directionClassName = (status === _utils.TransitionStatuses.ENTERING || status === _utils.TransitionStatuses.EXITING) && this.state.startAnimation && (direction === 'end' ? 'carousel-item-start' : 'carousel-item-end');
      const orderClassName = status === _utils.TransitionStatuses.ENTERING && (direction === 'end' ? 'carousel-item-next' : 'carousel-item-prev');
      const itemClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'carousel-item', isActive && 'active', directionClassName, orderClassName), cssModule);
      return /*#__PURE__*/_react.default.createElement(Tag, {
        className: itemClasses
      }, children);
    });
  }
}
CarouselItem.propTypes = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.propTypes), {}, {
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  in: _propTypes.default.bool,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  children: _propTypes.default.node,
  /** Enable/disable animation */
  slide: _propTypes.default.bool,
  /** Add custom class */
  className: _propTypes.default.string
});
CarouselItem.defaultProps = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.defaultProps), {}, {
  timeout: _utils.TransitionTimeouts.Carousel
});
CarouselItem.contextType = _CarouselContext.CarouselContext;
var _default = CarouselItem;
exports.default = _default;