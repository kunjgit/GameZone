function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["cssModule", "children", "isOpen", "flip", "target", "offset", "fallbackPlacements", "placementPrefix", "arrowClassName", "hideArrow", "popperClassName", "tag", "container", "modifiers", "strategy", "boundariesElement", "onClosed", "fade", "transition", "placement"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Popper as ReactPopper } from 'react-popper';
import { getTarget, targetPropType, mapToCssModules, DOMElement, tagPropType } from './utils';
import Fade from './Fade';
function noop() {}
var propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  popperClassName: PropTypes.string,
  placement: PropTypes.string,
  placementPrefix: PropTypes.string,
  arrowClassName: PropTypes.string,
  hideArrow: PropTypes.bool,
  tag: tagPropType,
  isOpen: PropTypes.bool,
  cssModule: PropTypes.object,
  offset: PropTypes.arrayOf(PropTypes.number),
  fallbackPlacements: PropTypes.array,
  flip: PropTypes.bool,
  container: targetPropType,
  target: targetPropType.isRequired,
  modifiers: PropTypes.array,
  strategy: PropTypes.string,
  boundariesElement: PropTypes.oneOfType([PropTypes.string, DOMElement]),
  onClosed: PropTypes.func,
  fade: PropTypes.bool,
  transition: PropTypes.shape(Fade.propTypes)
};
var defaultProps = {
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
  transition: _objectSpread({}, Fade.defaultProps)
};
var PopperContent = /*#__PURE__*/function (_React$Component) {
  _inherits(PopperContent, _React$Component);
  var _super = _createSuper(PopperContent);
  function PopperContent(props) {
    var _this;
    _classCallCheck(this, PopperContent);
    _this = _super.call(this, props);
    _this.setTargetNode = _this.setTargetNode.bind(_assertThisInitialized(_this));
    _this.getTargetNode = _this.getTargetNode.bind(_assertThisInitialized(_this));
    _this.getRef = _this.getRef.bind(_assertThisInitialized(_this));
    _this.onClosed = _this.onClosed.bind(_assertThisInitialized(_this));
    _this.state = {
      isOpen: props.isOpen
    };
    return _this;
  }
  _createClass(PopperContent, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this._element && this._element.childNodes && this._element.childNodes[0] && this._element.childNodes[0].focus) {
        this._element.childNodes[0].focus();
      }
    }
  }, {
    key: "onClosed",
    value: function onClosed() {
      this.props.onClosed();
      this.setState({
        isOpen: false
      });
    }
  }, {
    key: "getTargetNode",
    value: function getTargetNode() {
      return this.targetNode;
    }
  }, {
    key: "getContainerNode",
    value: function getContainerNode() {
      return getTarget(this.props.container);
    }
  }, {
    key: "getRef",
    value: function getRef(ref) {
      this._element = ref;
    }
  }, {
    key: "setTargetNode",
    value: function setTargetNode(node) {
      this.targetNode = typeof node === 'string' ? getTarget(node) : node;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this$props = this.props,
        cssModule = _this$props.cssModule,
        children = _this$props.children,
        isOpen = _this$props.isOpen,
        flip = _this$props.flip,
        target = _this$props.target,
        offset = _this$props.offset,
        fallbackPlacements = _this$props.fallbackPlacements,
        placementPrefix = _this$props.placementPrefix,
        _arrowClassName = _this$props.arrowClassName,
        hideArrow = _this$props.hideArrow,
        _popperClassName = _this$props.popperClassName,
        tag = _this$props.tag,
        container = _this$props.container,
        modifiers = _this$props.modifiers,
        strategy = _this$props.strategy,
        boundariesElement = _this$props.boundariesElement,
        onClosed = _this$props.onClosed,
        fade = _this$props.fade,
        transition = _this$props.transition,
        placement = _this$props.placement,
        attrs = _objectWithoutProperties(_this$props, _excluded);
      var arrowClassName = mapToCssModules(classNames('arrow', _arrowClassName), cssModule);
      var popperClassName = mapToCssModules(classNames(_popperClassName, placementPrefix ? "".concat(placementPrefix, "-auto") : ''), this.props.cssModule);
      var modifierNames = modifiers.map(function (m) {
        return m.name;
      });
      var baseModifiers = [{
        name: 'offset',
        options: {
          offset: offset
        }
      }, {
        name: 'flip',
        enabled: flip,
        options: {
          fallbackPlacements: fallbackPlacements
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: boundariesElement
        }
      }].filter(function (m) {
        return !modifierNames.includes(m.name);
      });
      var extendedModifiers = [].concat(_toConsumableArray(baseModifiers), _toConsumableArray(modifiers));
      var popperTransition = _objectSpread(_objectSpread(_objectSpread({}, Fade.defaultProps), transition), {}, {
        baseClass: fade ? transition.baseClass : '',
        timeout: fade ? transition.timeout : 0
      });
      return /*#__PURE__*/React.createElement(Fade, _extends({}, popperTransition, attrs, {
        "in": isOpen,
        onExited: this.onClosed,
        tag: tag
      }), /*#__PURE__*/React.createElement(ReactPopper, {
        referenceElement: this.targetNode,
        modifiers: extendedModifiers,
        placement: placement,
        strategy: strategy
      }, function (_ref) {
        var ref = _ref.ref,
          style = _ref.style,
          popperPlacement = _ref.placement,
          isReferenceHidden = _ref.isReferenceHidden,
          arrowProps = _ref.arrowProps,
          update = _ref.update;
        return /*#__PURE__*/React.createElement("div", {
          ref: ref,
          style: style,
          className: popperClassName,
          "data-popper-placement": popperPlacement,
          "data-popper-reference-hidden": isReferenceHidden ? 'true' : undefined
        }, typeof children === 'function' ? children({
          update: update
        }) : children, !hideArrow && /*#__PURE__*/React.createElement("span", {
          ref: arrowProps.ref,
          className: arrowClassName,
          style: arrowProps.style
        }));
      }));
    }
  }, {
    key: "render",
    value: function render() {
      this.setTargetNode(this.props.target);
      if (this.state.isOpen) {
        return this.props.container === 'inline' ? this.renderChildren() : /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React.createElement("div", {
          ref: this.getRef
        }, this.renderChildren()), this.getContainerNode());
      }
      return null;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.isOpen && !state.isOpen) {
        return {
          isOpen: props.isOpen
        };
      }
      return null;
    }
  }]);
  return PopperContent;
}(React.Component);
PopperContent.propTypes = propTypes;
PopperContent.defaultProps = defaultProps;
export default PopperContent;