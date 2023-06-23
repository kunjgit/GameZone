function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["tag", "horizontal", "isOpen", "className", "navbar", "cssModule", "children", "innerRef"];
var _transitionStatusToCl;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { mapToCssModules, omit, pick, TransitionTimeouts, TransitionPropTypeKeys, TransitionStatuses, tagPropType } from './utils';
var propTypes = _objectSpread(_objectSpread({}, Transition.propTypes), {}, {
  /** Make content animation appear horizontally */
  horizontal: PropTypes.bool,
  /** Set if Collapse is open or closed */
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Add custom class */
  className: PropTypes.node,
  navbar: PropTypes.bool,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  innerRef: PropTypes.shape({
    current: PropTypes.object
  })
});
var defaultProps = _objectSpread(_objectSpread({}, Transition.defaultProps), {}, {
  horizontal: false,
  isOpen: false,
  appear: false,
  enter: true,
  exit: true,
  tag: 'div',
  timeout: TransitionTimeouts.Collapse
});
var transitionStatusToClassHash = (_transitionStatusToCl = {}, _defineProperty(_transitionStatusToCl, TransitionStatuses.ENTERING, 'collapsing'), _defineProperty(_transitionStatusToCl, TransitionStatuses.ENTERED, 'collapse show'), _defineProperty(_transitionStatusToCl, TransitionStatuses.EXITING, 'collapsing'), _defineProperty(_transitionStatusToCl, TransitionStatuses.EXITED, 'collapse'), _transitionStatusToCl);
function getTransitionClass(status) {
  return transitionStatusToClassHash[status] || 'collapse';
}
var Collapse = /*#__PURE__*/function (_Component) {
  _inherits(Collapse, _Component);
  var _super = _createSuper(Collapse);
  function Collapse(props) {
    var _this;
    _classCallCheck(this, Collapse);
    _this = _super.call(this, props);
    _this.state = {
      dimension: null
    };
    _this.nodeRef = props.innerRef || /*#__PURE__*/React.createRef();
    ['onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'].forEach(function (name) {
      _this[name] = _this[name].bind(_assertThisInitialized(_this));
    });
    return _this;
  }
  _createClass(Collapse, [{
    key: "onEntering",
    value: function onEntering(_, isAppearing) {
      var node = this.getNode();
      this.setState({
        dimension: this.getDimension(node)
      });
      this.props.onEntering(node, isAppearing);
    }
  }, {
    key: "onEntered",
    value: function onEntered(_, isAppearing) {
      var node = this.getNode();
      this.setState({
        dimension: null
      });
      this.props.onEntered(node, isAppearing);
    }
  }, {
    key: "onExit",
    value: function onExit() {
      var node = this.getNode();
      this.setState({
        dimension: this.getDimension(node)
      });
      this.props.onExit(node);
    }
  }, {
    key: "onExiting",
    value: function onExiting() {
      var node = this.getNode();
      // getting this variable triggers a reflow
      var _unused = this.getDimension(node); // eslint-disable-line no-unused-vars
      this.setState({
        dimension: 0
      });
      this.props.onExiting(node);
    }
  }, {
    key: "onExited",
    value: function onExited() {
      var node = this.getNode();
      this.setState({
        dimension: null
      });
      this.props.onExited(node);
    }
  }, {
    key: "getNode",
    value: function getNode() {
      return this.nodeRef.current;
    }
  }, {
    key: "getDimension",
    value: function getDimension(node) {
      return this.props.horizontal ? node.scrollWidth : node.scrollHeight;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        Tag = _this$props.tag,
        horizontal = _this$props.horizontal,
        isOpen = _this$props.isOpen,
        className = _this$props.className,
        navbar = _this$props.navbar,
        cssModule = _this$props.cssModule,
        children = _this$props.children,
        innerRef = _this$props.innerRef,
        otherProps = _objectWithoutProperties(_this$props, _excluded);
      var dimension = this.state.dimension;
      var transitionProps = pick(otherProps, TransitionPropTypeKeys);
      var childProps = omit(otherProps, TransitionPropTypeKeys);
      return /*#__PURE__*/React.createElement(Transition, _extends({}, transitionProps, {
        "in": isOpen,
        nodeRef: this.nodeRef,
        onEntering: this.onEntering,
        onEntered: this.onEntered,
        onExit: this.onExit,
        onExiting: this.onExiting,
        onExited: this.onExited
      }), function (status) {
        var collapseClass = getTransitionClass(status);
        var classes = mapToCssModules(classNames(className, horizontal && 'collapse-horizontal', collapseClass, navbar && 'navbar-collapse'), cssModule);
        var style = dimension === null ? null : _defineProperty({}, horizontal ? 'width' : 'height', dimension);
        return /*#__PURE__*/React.createElement(Tag, _extends({}, childProps, {
          style: _objectSpread(_objectSpread({}, childProps.style), style),
          className: classes,
          ref: _this2.nodeRef
        }), children);
      });
    }
  }]);
  return Collapse;
}(Component);
Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;
export default Collapse;