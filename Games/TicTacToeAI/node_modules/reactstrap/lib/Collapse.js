"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactTransitionGroup = require("react-transition-group");
var _utils = require("./utils");
const _excluded = ["tag", "horizontal", "isOpen", "className", "navbar", "cssModule", "children", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const propTypes = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.propTypes), {}, {
  /** Make content animation appear horizontally */
  horizontal: _propTypes.default.bool,
  /** Set if Collapse is open or closed */
  isOpen: _propTypes.default.bool,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  /** Add custom class */
  className: _propTypes.default.node,
  navbar: _propTypes.default.bool,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  innerRef: _propTypes.default.shape({
    current: _propTypes.default.object
  })
});
const defaultProps = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.defaultProps), {}, {
  horizontal: false,
  isOpen: false,
  appear: false,
  enter: true,
  exit: true,
  tag: 'div',
  timeout: _utils.TransitionTimeouts.Collapse
});
const transitionStatusToClassHash = {
  [_utils.TransitionStatuses.ENTERING]: 'collapsing',
  [_utils.TransitionStatuses.ENTERED]: 'collapse show',
  [_utils.TransitionStatuses.EXITING]: 'collapsing',
  [_utils.TransitionStatuses.EXITED]: 'collapse'
};
function getTransitionClass(status) {
  return transitionStatusToClassHash[status] || 'collapse';
}
class Collapse extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimension: null
    };
    this.nodeRef = props.innerRef || /*#__PURE__*/_react.default.createRef();
    ['onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  onEntering(_, isAppearing) {
    const node = this.getNode();
    this.setState({
      dimension: this.getDimension(node)
    });
    this.props.onEntering(node, isAppearing);
  }
  onEntered(_, isAppearing) {
    const node = this.getNode();
    this.setState({
      dimension: null
    });
    this.props.onEntered(node, isAppearing);
  }
  onExit() {
    const node = this.getNode();
    this.setState({
      dimension: this.getDimension(node)
    });
    this.props.onExit(node);
  }
  onExiting() {
    const node = this.getNode();
    // getting this variable triggers a reflow
    const _unused = this.getDimension(node); // eslint-disable-line no-unused-vars
    this.setState({
      dimension: 0
    });
    this.props.onExiting(node);
  }
  onExited() {
    const node = this.getNode();
    this.setState({
      dimension: null
    });
    this.props.onExited(node);
  }
  getNode() {
    return this.nodeRef.current;
  }
  getDimension(node) {
    return this.props.horizontal ? node.scrollWidth : node.scrollHeight;
  }
  render() {
    const _this$props = this.props,
      {
        tag: Tag,
        horizontal,
        isOpen,
        className,
        navbar,
        cssModule,
        children,
        innerRef
      } = _this$props,
      otherProps = _objectWithoutProperties(_this$props, _excluded);
    const {
      dimension
    } = this.state;
    const transitionProps = (0, _utils.pick)(otherProps, _utils.TransitionPropTypeKeys);
    const childProps = (0, _utils.omit)(otherProps, _utils.TransitionPropTypeKeys);
    return /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.Transition, _extends({}, transitionProps, {
      in: isOpen,
      nodeRef: this.nodeRef,
      onEntering: this.onEntering,
      onEntered: this.onEntered,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }), status => {
      let collapseClass = getTransitionClass(status);
      const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, horizontal && 'collapse-horizontal', collapseClass, navbar && 'navbar-collapse'), cssModule);
      const style = dimension === null ? null : {
        [horizontal ? 'width' : 'height']: dimension
      };
      return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, childProps, {
        style: _objectSpread(_objectSpread({}, childProps.style), style),
        className: classes,
        ref: this.nodeRef
      }), children);
    });
  }
}
Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;
var _default = Collapse;
exports.default = _default;