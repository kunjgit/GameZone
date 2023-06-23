function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "color", "cssModule", "caret", "split", "nav", "tag", "innerRef"];
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Reference } from 'react-popper';
import { DropdownContext } from './DropdownContext';
import { mapToCssModules, tagPropType } from './utils';
import Button from './Button';
var propTypes = {
  caret: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  'aria-haspopup': PropTypes.bool,
  split: PropTypes.bool,
  tag: tagPropType,
  nav: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])
};
var defaultProps = {
  color: 'secondary',
  'aria-haspopup': true
};
var DropdownToggle = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownToggle, _React$Component);
  var _super = _createSuper(DropdownToggle);
  function DropdownToggle(props) {
    var _this;
    _classCallCheck(this, DropdownToggle);
    _this = _super.call(this, props);
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(DropdownToggle, [{
    key: "onClick",
    value: function onClick(e) {
      if (this.props.disabled || this.context.disabled) {
        e.preventDefault();
        return;
      }
      if (this.props.nav && !this.props.tag) {
        e.preventDefault();
      }
      if (this.props.onClick) {
        this.props.onClick(e);
      }
      this.context.toggle(e);
    }
  }, {
    key: "getRole",
    value: function getRole() {
      return this.context.menuRole || this.props['aria-haspopup'];
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        className = _this$props.className,
        color = _this$props.color,
        cssModule = _this$props.cssModule,
        caret = _this$props.caret,
        split = _this$props.split,
        nav = _this$props.nav,
        tag = _this$props.tag,
        innerRef = _this$props.innerRef,
        props = _objectWithoutProperties(_this$props, _excluded);
      var ariaLabel = props['aria-label'] || 'Toggle Dropdown';
      var classes = mapToCssModules(classNames(className, {
        'dropdown-toggle': caret || split,
        'dropdown-toggle-split': split,
        'nav-link': nav
      }), cssModule);
      var children = typeof props.children !== 'undefined' ? props.children : /*#__PURE__*/React.createElement("span", {
        className: "visually-hidden"
      }, ariaLabel);
      var Tag;
      if (nav && !tag) {
        Tag = 'a';
        props.href = '#';
      } else if (!tag) {
        Tag = Button;
        props.color = color;
        props.cssModule = cssModule;
      } else {
        Tag = tag;
      }
      if (this.context.inNavbar) {
        return /*#__PURE__*/React.createElement(Tag, _extends({}, props, {
          className: classes,
          onClick: this.onClick,
          ref: this.context.onToggleRef,
          "aria-expanded": this.context.isOpen,
          "aria-haspopup": this.getRole(),
          children: children
        }));
      }
      return /*#__PURE__*/React.createElement(Reference, {
        innerRef: innerRef
      }, function (_ref) {
        var ref = _ref.ref;
        var handleRef = function handleRef(tagRef) {
          ref(tagRef);
          var onToggleRef = _this2.context.onToggleRef;
          if (onToggleRef) onToggleRef(tagRef);
        };
        return /*#__PURE__*/React.createElement(Tag, _extends({}, props, _defineProperty({}, typeof Tag === 'string' ? 'ref' : 'innerRef', handleRef), {
          className: classes,
          onClick: _this2.onClick,
          "aria-expanded": _this2.context.isOpen,
          "aria-haspopup": _this2.getRole(),
          children: children
        }));
      });
    }
  }]);
  return DropdownToggle;
}(React.Component);
DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;
DropdownToggle.contextType = DropdownContext;
export default DropdownToggle;