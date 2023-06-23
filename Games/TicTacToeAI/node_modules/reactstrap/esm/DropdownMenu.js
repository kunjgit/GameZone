function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "cssModule", "dark", "end", "right", "tag", "flip", "modifiers", "persist", "strategy", "container", "updateOnSelect"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Popper } from 'react-popper';
import { DropdownContext } from './DropdownContext';
import { mapToCssModules, tagPropType, targetPropType, getTarget, deprecated } from './utils';
var propTypes = {
  tag: tagPropType,
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool,
  end: PropTypes.bool,
  /** Flips the menu to the opposite side if there is not enough space to fit */
  flip: PropTypes.bool,
  modifiers: PropTypes.array,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  style: PropTypes.object,
  persist: PropTypes.bool,
  strategy: PropTypes.string,
  container: targetPropType,
  /** Update popper layout when a click event comes up. This leverages event bubbling. */
  updateOnSelect: PropTypes.bool,
  right: deprecated(PropTypes.bool, 'Please use "end" instead.')
};
var directionPositionMap = {
  up: 'top',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
  down: 'bottom'
};
var DropdownMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownMenu, _React$Component);
  var _super = _createSuper(DropdownMenu);
  function DropdownMenu() {
    _classCallCheck(this, DropdownMenu);
    return _super.apply(this, arguments);
  }
  _createClass(DropdownMenu, [{
    key: "getRole",
    value: function getRole() {
      if (this.context.menuRole === 'listbox') {
        return 'listbox';
      }
      return 'menu';
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props = this.props,
        className = _this$props.className,
        cssModule = _this$props.cssModule,
        dark = _this$props.dark,
        end = _this$props.end,
        right = _this$props.right,
        _this$props$tag = _this$props.tag,
        tag = _this$props$tag === void 0 ? 'div' : _this$props$tag,
        _this$props$flip = _this$props.flip,
        flip = _this$props$flip === void 0 ? true : _this$props$flip,
        _this$props$modifiers = _this$props.modifiers,
        modifiers = _this$props$modifiers === void 0 ? [] : _this$props$modifiers,
        persist = _this$props.persist,
        strategy = _this$props.strategy,
        container = _this$props.container,
        updateOnSelect = _this$props.updateOnSelect,
        attrs = _objectWithoutProperties(_this$props, _excluded);
      var classes = mapToCssModules(classNames(className, 'dropdown-menu', {
        'dropdown-menu-dark': dark,
        'dropdown-menu-end': end || right,
        show: this.context.isOpen
      }), cssModule);
      var Tag = tag;
      if (persist || this.context.isOpen && !this.context.inNavbar) {
        var position1 = directionPositionMap[this.context.direction] || 'bottom';
        var position2 = end || right ? 'end' : 'start';
        var poperPlacement = "".concat(position1, "-").concat(position2);
        var poperModifiers = [].concat(_toConsumableArray(modifiers), [{
          name: 'flip',
          enabled: !!flip
        }]);
        var popper = /*#__PURE__*/React.createElement(Popper, {
          placement: poperPlacement,
          modifiers: poperModifiers,
          strategy: strategy
        }, function (_ref) {
          var ref = _ref.ref,
            style = _ref.style,
            placement = _ref.placement,
            update = _ref.update;
          var combinedStyle = _objectSpread(_objectSpread({}, _this.props.style), style);
          var handleRef = function handleRef(tagRef) {
            // Send the ref to `react-popper`
            ref(tagRef);
            // Send the ref to the parent Dropdown so that clicks outside
            // it will cause it to close
            var onMenuRef = _this.context.onMenuRef;
            if (onMenuRef) onMenuRef(tagRef);
          };
          return /*#__PURE__*/React.createElement(Tag, _extends({
            tabIndex: "-1",
            role: _this.getRole(),
            ref: handleRef
          }, attrs, {
            style: combinedStyle,
            "aria-hidden": !_this.context.isOpen,
            className: classes,
            "data-popper-placement": placement,
            onClick: function onClick() {
              return updateOnSelect && update();
            }
          }));
        });
        if (container) {
          return /*#__PURE__*/ReactDOM.createPortal(popper, getTarget(container));
        }
        return popper;
      }
      var onMenuRef = this.context.onMenuRef;
      return /*#__PURE__*/React.createElement(Tag, _extends({
        tabIndex: "-1",
        role: this.getRole()
      }, attrs, {
        ref: onMenuRef,
        "aria-hidden": !this.context.isOpen,
        className: classes,
        "data-popper-placement": attrs.placement
      }));
    }
  }]);
  return DropdownMenu;
}(React.Component);
DropdownMenu.propTypes = propTypes;
DropdownMenu.contextType = DropdownContext;
export default DropdownMenu;