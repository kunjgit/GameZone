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
var _DropdownContext = require("./DropdownContext");
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "dark", "end", "right", "tag", "flip", "modifiers", "persist", "strategy", "container", "updateOnSelect"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  tag: _utils.tagPropType,
  children: _propTypes.default.node.isRequired,
  dark: _propTypes.default.bool,
  end: _propTypes.default.bool,
  /** Flips the menu to the opposite side if there is not enough space to fit */
  flip: _propTypes.default.bool,
  modifiers: _propTypes.default.array,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  style: _propTypes.default.object,
  persist: _propTypes.default.bool,
  strategy: _propTypes.default.string,
  container: _utils.targetPropType,
  /** Update popper layout when a click event comes up. This leverages event bubbling. */
  updateOnSelect: _propTypes.default.bool,
  right: (0, _utils.deprecated)(_propTypes.default.bool, 'Please use "end" instead.')
};
const directionPositionMap = {
  up: 'top',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
  down: 'bottom'
};
class DropdownMenu extends _react.default.Component {
  getRole() {
    if (this.context.menuRole === 'listbox') {
      return 'listbox';
    }
    return 'menu';
  }
  render() {
    const _this$props = this.props,
      {
        className,
        cssModule,
        dark,
        end,
        right,
        tag = 'div',
        flip = true,
        modifiers = [],
        persist,
        strategy,
        container,
        updateOnSelect
      } = _this$props,
      attrs = _objectWithoutProperties(_this$props, _excluded);
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'dropdown-menu', {
      'dropdown-menu-dark': dark,
      'dropdown-menu-end': end || right,
      show: this.context.isOpen
    }), cssModule);
    const Tag = tag;
    if (persist || this.context.isOpen && !this.context.inNavbar) {
      const position1 = directionPositionMap[this.context.direction] || 'bottom';
      const position2 = end || right ? 'end' : 'start';
      const poperPlacement = `${position1}-${position2}`;
      const poperModifiers = [...modifiers, {
        name: 'flip',
        enabled: !!flip
      }];
      const popper = /*#__PURE__*/_react.default.createElement(_reactPopper.Popper, {
        placement: poperPlacement,
        modifiers: poperModifiers,
        strategy: strategy
      }, ({
        ref,
        style,
        placement,
        update
      }) => {
        let combinedStyle = _objectSpread(_objectSpread({}, this.props.style), style);
        const handleRef = tagRef => {
          // Send the ref to `react-popper`
          ref(tagRef);
          // Send the ref to the parent Dropdown so that clicks outside
          // it will cause it to close
          const {
            onMenuRef
          } = this.context;
          if (onMenuRef) onMenuRef(tagRef);
        };
        return /*#__PURE__*/_react.default.createElement(Tag, _extends({
          tabIndex: "-1",
          role: this.getRole(),
          ref: handleRef
        }, attrs, {
          style: combinedStyle,
          "aria-hidden": !this.context.isOpen,
          className: classes,
          "data-popper-placement": placement,
          onClick: () => updateOnSelect && update()
        }));
      });
      if (container) {
        return /*#__PURE__*/_reactDom.default.createPortal(popper, (0, _utils.getTarget)(container));
      }
      return popper;
    }
    const {
      onMenuRef
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({
      tabIndex: "-1",
      role: this.getRole()
    }, attrs, {
      ref: onMenuRef,
      "aria-hidden": !this.context.isOpen,
      className: classes,
      "data-popper-placement": attrs.placement
    }));
  }
}
DropdownMenu.propTypes = propTypes;
DropdownMenu.contextType = _DropdownContext.DropdownContext;
var _default = DropdownMenu;
exports.default = _default;