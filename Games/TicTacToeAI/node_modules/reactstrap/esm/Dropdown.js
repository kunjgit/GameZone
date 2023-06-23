function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "cssModule", "direction", "isOpen", "group", "size", "nav", "setActiveFromChild", "active", "tag", "menuRole"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
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
/* eslint react/no-find-dom-node: 0 */
// https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md

import React from 'react';
import PropTypes from 'prop-types';
import { Manager } from 'react-popper';
import classNames from 'classnames';
import { DropdownContext } from './DropdownContext';
import { mapToCssModules, omit, keyCodes, tagPropType } from './utils';
import { InputGroupContext } from './InputGroupContext';
var propTypes = {
  a11y: PropTypes.bool,
  disabled: PropTypes.bool,
  direction: PropTypes.oneOf(['up', 'down', 'start', 'end', 'left', 'right']),
  group: PropTypes.bool,
  isOpen: PropTypes.bool,
  nav: PropTypes.bool,
  active: PropTypes.bool,
  size: PropTypes.string,
  tag: tagPropType,
  toggle: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  dropup: PropTypes.bool,
  inNavbar: PropTypes.bool,
  setActiveFromChild: PropTypes.bool,
  menuRole: PropTypes.oneOf(['listbox', 'menu'])
};
var defaultProps = {
  a11y: true,
  isOpen: false,
  direction: 'down',
  nav: false,
  active: false,
  inNavbar: false,
  setActiveFromChild: false
};
var preventDefaultKeys = [keyCodes.space, keyCodes.enter, keyCodes.up, keyCodes.down, keyCodes.end, keyCodes.home];
var Dropdown = /*#__PURE__*/function (_React$Component) {
  _inherits(Dropdown, _React$Component);
  var _super = _createSuper(Dropdown);
  function Dropdown(props) {
    var _this;
    _classCallCheck(this, Dropdown);
    _this = _super.call(this, props);
    _this.addEvents = _this.addEvents.bind(_assertThisInitialized(_this));
    _this.handleDocumentClick = _this.handleDocumentClick.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.removeEvents = _this.removeEvents.bind(_assertThisInitialized(_this));
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    _this.handleMenuRef = _this.handleMenuRef.bind(_assertThisInitialized(_this));
    _this.handleToggleRef = _this.handleToggleRef.bind(_assertThisInitialized(_this));
    _this.containerRef = /*#__PURE__*/React.createRef();
    _this.menuRef = /*#__PURE__*/React.createRef();
    _this.toggleRef = /*#__PURE__*/React.createRef();
    // ref for DropdownToggle
    return _this;
  }
  _createClass(Dropdown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleProps();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen) {
        this.handleProps();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeEvents();
    }
  }, {
    key: "handleMenuRef",
    value: function handleMenuRef(menuRef) {
      this.menuRef.current = menuRef;
    }
  }, {
    key: "handleToggleRef",
    value: function handleToggleRef(toggleRef) {
      this.toggleRef.current = toggleRef;
    }
  }, {
    key: "handleDocumentClick",
    value: function handleDocumentClick(e) {
      if (e && (e.which === 3 || e.type === 'keyup' && e.which !== keyCodes.tab)) return;
      var container = this.getContainer();
      var menu = this.getMenu();
      var toggle = this.getToggle();
      var targetIsToggle = toggle.contains(e.target);
      var clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
      var clickIsInInput = false;
      if (container) {
        // this is only for InputGroup with type dropdown
        clickIsInInput = container.classList.contains('input-group') && container.classList.contains('dropdown') && e.target.tagName === 'INPUT';
      }
      if ((targetIsToggle && !clickIsInInput || clickIsInMenu) && (e.type !== 'keyup' || e.which === keyCodes.tab)) {
        return;
      }
      this.toggle(e);
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      var _this2 = this;
      var isTargetMenuItem = e.target.getAttribute('role') === 'menuitem' || e.target.getAttribute('role') === 'option';
      var isTargetMenuCtrl = this.getMenuCtrl() === e.target;
      var isTab = keyCodes.tab === e.which;
      if (/input|textarea/i.test(e.target.tagName) || isTab && !this.props.a11y || isTab && !(isTargetMenuItem || isTargetMenuCtrl)) {
        return;
      }
      if (preventDefaultKeys.indexOf(e.which) !== -1 || e.which >= 48 && e.which <= 90) {
        e.preventDefault();
      }
      if (this.props.disabled) return;
      if (isTargetMenuCtrl) {
        if ([keyCodes.space, keyCodes.enter, keyCodes.up, keyCodes.down].indexOf(e.which) > -1) {
          // Open the menu (if not open) and focus the first menu item
          if (!this.props.isOpen) {
            this.toggle(e);
          }
          setTimeout(function () {
            var _this2$getMenuItems$;
            return (_this2$getMenuItems$ = _this2.getMenuItems()[0]) === null || _this2$getMenuItems$ === void 0 ? void 0 : _this2$getMenuItems$.focus();
          });
        } else if (this.props.isOpen && isTab) {
          var _this$getMenuItems$;
          // Focus the first menu item if tabbing from an open menu. We need this
          // for cases where the DropdownMenu sets a custom container, which may
          // not be the natural next item to tab to from the DropdownToggle.
          e.preventDefault();
          (_this$getMenuItems$ = this.getMenuItems()[0]) === null || _this$getMenuItems$ === void 0 ? void 0 : _this$getMenuItems$.focus();
        } else if (this.props.isOpen && e.which === keyCodes.esc) {
          this.toggle(e);
        }
      }
      if (this.props.isOpen && isTargetMenuItem) {
        if ([keyCodes.tab, keyCodes.esc].indexOf(e.which) > -1) {
          this.toggle(e);
          this.getMenuCtrl().focus();
        } else if ([keyCodes.space, keyCodes.enter].indexOf(e.which) > -1) {
          e.target.click();
          this.getMenuCtrl().focus();
        } else if ([keyCodes.down, keyCodes.up].indexOf(e.which) > -1 || [keyCodes.n, keyCodes.p].indexOf(e.which) > -1 && e.ctrlKey) {
          var $menuitems = this.getMenuItems();
          var index = $menuitems.indexOf(e.target);
          if (keyCodes.up === e.which || keyCodes.p === e.which && e.ctrlKey) {
            index = index !== 0 ? index - 1 : $menuitems.length - 1;
          } else if (keyCodes.down === e.which || keyCodes.n === e.which && e.ctrlKey) {
            index = index === $menuitems.length - 1 ? 0 : index + 1;
          }
          $menuitems[index].focus();
        } else if (keyCodes.end === e.which) {
          var _$menuitems = this.getMenuItems();
          _$menuitems[_$menuitems.length - 1].focus();
        } else if (keyCodes.home === e.which) {
          var _$menuitems2 = this.getMenuItems();
          _$menuitems2[0].focus();
        } else if (e.which >= 48 && e.which <= 90) {
          var _$menuitems3 = this.getMenuItems();
          var charPressed = String.fromCharCode(e.which).toLowerCase();
          for (var i = 0; i < _$menuitems3.length; i += 1) {
            var firstLetter = _$menuitems3[i].textContent && _$menuitems3[i].textContent[0].toLowerCase();
            if (firstLetter === charPressed) {
              _$menuitems3[i].focus();
              break;
            }
          }
        }
      }
    }
  }, {
    key: "handleProps",
    value: function handleProps() {
      if (this.props.isOpen) {
        this.addEvents();
      } else {
        this.removeEvents();
      }
    }
  }, {
    key: "getContextValue",
    value: function getContextValue() {
      return {
        toggle: this.toggle,
        isOpen: this.props.isOpen,
        direction: this.props.direction === 'down' && this.props.dropup ? 'up' : this.props.direction,
        inNavbar: this.props.inNavbar,
        disabled: this.props.disabled,
        // Callback that should be called by DropdownMenu to provide a ref to
        // a HTML tag that's used for the DropdownMenu
        onMenuRef: this.handleMenuRef,
        onToggleRef: this.handleToggleRef,
        menuRole: this.props.menuRole
      };
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this.containerRef.current;
    }
  }, {
    key: "getMenu",
    value: function getMenu() {
      return this.menuRef.current;
    }
  }, {
    key: "getToggle",
    value: function getToggle() {
      return this.toggleRef.current;
    }
  }, {
    key: "getMenuCtrl",
    value: function getMenuCtrl() {
      if (this._$menuCtrl) return this._$menuCtrl;
      this._$menuCtrl = this.getToggle();
      return this._$menuCtrl;
    }
  }, {
    key: "getItemType",
    value: function getItemType() {
      if (this.props.menuRole === 'listbox') {
        return 'option';
      }
      return 'menuitem';
    }
  }, {
    key: "getMenuItems",
    value: function getMenuItems() {
      // In a real menu with a child DropdownMenu, `this.getMenu()` should never
      // be null, but it is sometimes null in tests. To mitigate that, we just
      // use `this.getContainer()` as the fallback `menuContainer`.
      var menuContainer = this.getMenu() || this.getContainer();
      return [].slice.call(menuContainer.querySelectorAll("[role=\"".concat(this.getItemType(), "\"]")));
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this3 = this;
      ['click', 'touchstart', 'keyup'].forEach(function (event) {
        return document.addEventListener(event, _this3.handleDocumentClick, true);
      });
    }
  }, {
    key: "removeEvents",
    value: function removeEvents() {
      var _this4 = this;
      ['click', 'touchstart', 'keyup'].forEach(function (event) {
        return document.removeEventListener(event, _this4.handleDocumentClick, true);
      });
    }
  }, {
    key: "toggle",
    value: function toggle(e) {
      if (this.props.disabled) {
        return e && e.preventDefault();
      }
      return this.props.toggle(e);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
        _this5 = this;
      var _omit = omit(this.props, ['toggle', 'disabled', 'inNavbar', 'a11y']),
        className = _omit.className,
        cssModule = _omit.cssModule,
        direction = _omit.direction,
        isOpen = _omit.isOpen,
        group = _omit.group,
        size = _omit.size,
        nav = _omit.nav,
        setActiveFromChild = _omit.setActiveFromChild,
        active = _omit.active,
        tag = _omit.tag,
        menuRole = _omit.menuRole,
        attrs = _objectWithoutProperties(_omit, _excluded);
      var Tag = tag || (nav ? 'li' : 'div');
      var subItemIsActive = false;
      if (setActiveFromChild) {
        React.Children.map(this.props.children[1].props.children, function (dropdownItem) {
          if (dropdownItem && dropdownItem.props.active) subItemIsActive = true;
        });
      }
      var classes = mapToCssModules(classNames(className, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, (_classNames = {
        'btn-group': group
      }, _defineProperty(_classNames, "btn-group-".concat(size), !!size), _defineProperty(_classNames, "dropdown", !group), _defineProperty(_classNames, "dropup", direction === 'up'), _defineProperty(_classNames, "dropstart", direction === 'start' || direction === 'left'), _defineProperty(_classNames, "dropend", direction === 'end' || direction === 'right'), _defineProperty(_classNames, "show", isOpen), _defineProperty(_classNames, 'nav-item', nav), _classNames)), cssModule);
      if (this.context.insideInputGroup) {
        return /*#__PURE__*/React.createElement(DropdownContext.Provider, {
          value: this.getContextValue()
        }, /*#__PURE__*/React.createElement(Manager, null, React.Children.map(this.props.children, function (child) {
          return /*#__PURE__*/React.cloneElement(child, {
            onKeyDown: _this5.handleKeyDown
          });
        })));
      }
      return /*#__PURE__*/React.createElement(DropdownContext.Provider, {
        value: this.getContextValue()
      }, /*#__PURE__*/React.createElement(Manager, null, /*#__PURE__*/React.createElement(Tag, _extends({}, attrs, _defineProperty({}, typeof Tag === 'string' ? 'ref' : 'innerRef', this.containerRef), {
        onKeyDown: this.handleKeyDown,
        className: classes
      }))));
    }
  }]);
  return Dropdown;
}(React.Component);
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;
Dropdown.contextType = InputGroupContext;
export default Dropdown;