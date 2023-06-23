"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactPopper = require("react-popper");
var _utils = require("./utils");
var _Fade = _interopRequireDefault(require("./Fade"));
const _excluded = ["cssModule", "children", "isOpen", "flip", "target", "offset", "fallbackPlacements", "placementPrefix", "arrowClassName", "hideArrow", "popperClassName", "tag", "container", "modifiers", "strategy", "boundariesElement", "onClosed", "fade", "transition", "placement"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function noop() {}
const propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]).isRequired,
  popperClassName: _propTypes.default.string,
  placement: _propTypes.default.string,
  placementPrefix: _propTypes.default.string,
  arrowClassName: _propTypes.default.string,
  hideArrow: _propTypes.default.bool,
  tag: _utils.tagPropType,
  isOpen: _propTypes.default.bool,
  cssModule: _propTypes.default.object,
  offset: _propTypes.default.arrayOf(_propTypes.default.number),
  fallbackPlacements: _propTypes.default.array,
  flip: _propTypes.default.bool,
  container: _utils.targetPropType,
  target: _utils.targetPropType.isRequired,
  modifiers: _propTypes.default.array,
  strategy: _propTypes.default.string,
  boundariesElement: _propTypes.default.oneOfType([_propTypes.default.string, _utils.DOMElement]),
  onClosed: _propTypes.default.func,
  fade: _propTypes.default.bool,
  transition: _propTypes.default.shape(_Fade.default.propTypes)
};
const defaultProps = {
  boundariesElement: 'scrollParent',
  placement: 'auto',
  hideArrow: false,
  isOpen: false,
  offset: [0, 0],
  flip: true,
  container: 'body',
  modifiers: [],
  onClosed: noop,
  fade: true,
  transition: _objectSpread({}, _Fade.default.defaultProps)
};
class PopperContent extends _react.default.Component {
  constructor(props) {
    super(props);
    this.setTargetNode = this.setTargetNode.bind(this);
    this.getTargetNode = this.getTargetNode.bind(this);
    this.getRef = this.getRef.bind(this);
    this.onClosed = this.onClosed.bind(this);
    this.state = {
      isOpen: props.isOpen
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.isOpen && !state.isOpen) {
      return {
        isOpen: props.isOpen
      };
    }
    return null;
  }
  componentDidUpdate() {
    if (this._element && this._element.childNodes && this._element.childNodes[0] && this._element.childNodes[0].focus) {
      this._element.childNodes[0].focus();
    }
  }
  onClosed() {
    this.props.onClosed();
    this.setState({
      isOpen: false
    });
  }
  getTargetNode() {
    return this.targetNode;
  }
  getContainerNode() {
    return (0, _utils.getTarget)(this.props.container);
  }
  getRef(ref) {
    this._element = ref;
  }
  setTargetNode(node) {
    this.targetNode = typeof node === 'string' ? (0, _utils.getTarget)(node) : node;
  }
  renderChildren() {
    const _this$props = this.props,
      {
        cssModule,
        children,
        isOpen,
        flip,
        target,
        offset,
        fallbackPlacements,
        placementPrefix,
        arrowClassName: _arrowClassName,
        hideArrow,
        popperClassName: _popperClassName,
        tag,
        container,
        modifiers,
        strategy,
        boundariesElement,
        onClosed,
        fade,
        transition,
        placement
      } = _this$props,
      attrs = _objectWithoutProperties(_this$props, _excluded);
    const arrowClassName = (0, _utils.mapToCssModules)((0, _classnames.default)('arrow', _arrowClassName), cssModule);
    const popperClassName = (0, _utils.mapToCssModules)((0, _classnames.default)(_popperClassName, placementPrefix ? `${placementPrefix}-auto` : ''), this.props.cssModule);
    const modifierNames = modifiers.map(m => m.name);
    const baseModifiers = [{
      name: 'offset',
      options: {
        offset
      }
    }, {
      name: 'flip',
      enabled: flip,
      options: {
        fallbackPlacements
      }
    }, {
      name: 'preventOverflow',
      options: {
        boundary: boundariesElement
      }
    }].filter(m => !modifierNames.includes(m.name));
    const extendedModifiers = [...baseModifiers, ...modifiers];
    const popperTransition = _objectSpread(_objectSpread(_objectSpread({}, _Fade.default.defaultProps), transition), {}, {
      baseClass: fade ? transition.baseClass : '',
      timeout: fade ? transition.timeout : 0
    });
    return /*#__PURE__*/_react.default.createElement(_Fade.default, _extends({}, popperTransition, attrs, {
      in: isOpen,
      onExited: this.onClosed,
      tag: tag
    }), /*#__PURE__*/_react.default.createElement(_reactPopper.Popper, {
      referenceElement: this.targetNode,
      modifiers: extendedModifiers,
      placement: placement,
      strategy: strategy
    }, ({
      ref,
      style,
      placement: popperPlacement,
      isReferenceHidden,
      arrowProps,
      update
    }) => /*#__PURE__*/_react.default.createElement("div", {
      ref: ref,
      style: style,
      className: popperClassName,
      "data-popper-placement": popperPlacement,
      "data-popper-reference-hidden": isReferenceHidden ? 'true' : undefined
    }, typeof children === 'function' ? children({
      update
    }) : children, !hideArrow && /*#__PURE__*/_react.default.createElement("span", {
      ref: arrowProps.ref,
      className: arrowClassName,
      style: arrowProps.style
    }))));
  }
  render() {
    this.setTargetNode(this.props.target);
    if (this.state.isOpen) {
      return this.props.container === 'inline' ? this.renderChildren() : /*#__PURE__*/_reactDom.default.createPortal( /*#__PURE__*/_react.default.createElement("div", {
        ref: this.getRef
      }, this.renderChildren()), this.getContainerNode());
    }
    return null;
  }
}
PopperContent.propTypes = propTypes;
PopperContent.defaultProps = defaultProps;
var _default = PopperContent;
exports.default = _default;