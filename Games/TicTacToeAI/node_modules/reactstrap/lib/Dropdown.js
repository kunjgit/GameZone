"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactPopper = require("react-popper");
var _classnames = _interopRequireDefault(require("classnames"));
var _DropdownContext = require("./DropdownContext");
var _utils = require("./utils");
var _InputGroupContext = require("./InputGroupContext");
const _excluded = ["className", "cssModule", "direction", "isOpen", "group", "size", "nav", "setActiveFromChild", "active", "tag", "menuRole"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  a11y: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  direction: _propTypes.default.oneOf(['up', 'down', 'start', 'end', 'left', 'right']),
  group: _propTypes.default.bool,
  isOpen: _propTypes.default.bool,
  nav: _propTypes.default.bool,
  active: _propTypes.default.bool,
  size: _propTypes.default.string,
  tag: _utils.tagPropType,
  toggle: _propTypes.default.func,
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  dropup: _propTypes.default.bool,
  inNavbar: _propTypes.default.bool,
  setActiveFromChild: _propTypes.default.bool,
  menuRole: _propTypes.default.oneOf(['listbox', 'menu'])
};
const defaultProps = {
  a11y: true,
  isOpen: false,
  direction: 'down',
  nav: false,
  active: false,
  inNavbar: false,
  setActiveFromChild: false
};
const preventDefaultKeys = [_utils.keyCodes.space, _utils.keyCodes.enter, _utils.keyCodes.up, _utils.keyCodes.down, _utils.keyCodes.end, _utils.keyCodes.home];
class Dropdown extends _react.default.Component {
  constructor(props) {
    super(props);
    this.addEvents = this.addEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleToggleRef = this.handleToggleRef.bind(this);
    this.containerRef = /*#__PURE__*/_react.default.createRef();
    this.menuRef = /*#__PURE__*/_react.default.createRef();
    this.toggleRef = /*#__PURE__*/_react.default.createRef();
    // ref for DropdownToggle
  }

  componentDidMount() {
    this.handleProps();
  }
  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.handleProps();
    }
  }
  componentWillUnmount() {
    this.removeEvents();
  }
  handleMenuRef(menuRef) {
    this.menuRef.current = menuRef;
  }
  handleToggleRef(toggleRef) {
    this.toggleRef.current = toggleRef;
  }
  handleDocumentClick(e) {
    if (e && (e.which === 3 || e.type === 'keyup' && e.which !== _utils.keyCodes.tab)) return;
    const container = this.getContainer();
    const menu = this.getMenu();
    const toggle = this.getToggle();
    const targetIsToggle = toggle.contains(e.target);
    const clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
    let clickIsInInput = false;
    if (container) {
      // this is only for InputGroup with type dropdown
      clickIsInInput = container.classList.contains('input-group') && container.classList.contains('dropdown') && e.target.tagName === 'INPUT';
    }
    if ((targetIsToggle && !clickIsInInput || clickIsInMenu) && (e.type !== 'keyup' || e.which === _utils.keyCodes.tab)) {
      return;
    }
    this.toggle(e);
  }
  handleKeyDown(e) {
    const isTargetMenuItem = e.target.getAttribute('role') === 'menuitem' || e.target.getAttribute('role') === 'option';
    const isTargetMenuCtrl = this.getMenuCtrl() === e.target;
    const isTab = _utils.keyCodes.tab === e.which;
    if (/input|textarea/i.test(e.target.tagName) || isTab && !this.props.a11y || isTab && !(isTargetMenuItem || isTargetMenuCtrl)) {
      return;
    }
    if (preventDefaultKeys.indexOf(e.which) !== -1 || e.which >= 48 && e.which <= 90) {
      e.preventDefault();
    }
    if (this.props.disabled) return;
    if (isTargetMenuCtrl) {
      if ([_utils.keyCodes.space, _utils.keyCodes.enter, _utils.keyCodes.up, _utils.keyCodes.down].indexOf(e.which) > -1) {
        // Open the menu (if not open) and focus the first menu item
        if (!this.props.isOpen) {
          this.toggle(e);
        }
        setTimeout(() => this.getMenuItems()[0]?.focus());
      } else if (this.props.isOpen && isTab) {
        // Focus the first menu item if tabbing from an open menu. We need this
        // for cases where the DropdownMenu sets a custom container, which may
        // not be the natural next item to tab to from the DropdownToggle.
        e.preventDefault();
        this.getMenuItems()[0]?.focus();
      } else if (this.props.isOpen && e.which === _utils.keyCodes.esc) {
        this.toggle(e);
      }
    }
    if (this.props.isOpen && isTargetMenuItem) {
      if ([_utils.keyCodes.tab, _utils.keyCodes.esc].indexOf(e.which) > -1) {
        this.toggle(e);
        this.getMenuCtrl().focus();
      } else if ([_utils.keyCodes.space, _utils.keyCodes.enter].indexOf(e.which) > -1) {
        e.target.click();
        this.getMenuCtrl().focus();
      } else if ([_utils.keyCodes.down, _utils.keyCodes.up].indexOf(e.which) > -1 || [_utils.keyCodes.n, _utils.keyCodes.p].indexOf(e.which) > -1 && e.ctrlKey) {
        const $menuitems = this.getMenuItems();
        let index = $menuitems.indexOf(e.target);
        if (_utils.keyCodes.up === e.which || _utils.keyCodes.p === e.which && e.ctrlKey) {
          index = index !== 0 ? index - 1 : $menuitems.length - 1;
        } else if (_utils.keyCodes.down === e.which || _utils.keyCodes.n === e.which && e.ctrlKey) {
          index = index === $menuitems.length - 1 ? 0 : index + 1;
        }
        $menuitems[index].focus();
      } else if (_utils.keyCodes.end === e.which) {
        const $menuitems = this.getMenuItems();
        $menuitems[$menuitems.length - 1].focus();
      } else if (_utils.keyCodes.home === e.which) {
        const $menuitems = this.getMenuItems();
        $menuitems[0].focus();
      } else if (e.which >= 48 && e.which <= 90) {
        const $menuitems = this.getMenuItems();
        const charPressed = String.fromCharCode(e.which).toLowerCase();
        for (let i = 0; i < $menuitems.length; i += 1) {
          const firstLetter = $menuitems[i].textContent && $menuitems[i].textContent[0].toLowerCase();
          if (firstLetter === charPressed) {
            $menuitems[i].focus();
            break;
          }
        }
      }
    }
  }
  handleProps() {
    if (this.props.isOpen) {
      this.addEvents();
    } else {
      this.removeEvents();
    }
  }
  getContextValue() {
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
  getContainer() {
    return this.containerRef.current;
  }
  getMenu() {
    return this.menuRef.current;
  }
  getToggle() {
    return this.toggleRef.current;
  }
  getMenuCtrl() {
    if (this._$menuCtrl) return this._$menuCtrl;
    this._$menuCtrl = this.getToggle();
    return this._$menuCtrl;
  }
  getItemType() {
    if (this.props.menuRole === 'listbox') {
      return 'option';
    }
    return 'menuitem';
  }
  getMenuItems() {
    // In a real menu with a child DropdownMenu, `this.getMenu()` should never
    // be null, but it is sometimes null in tests. To mitigate that, we just
    // use `this.getContainer()` as the fallback `menuContainer`.
    const menuContainer = this.getMenu() || this.getContainer();
    return [].slice.call(menuContainer.querySelectorAll(`[role="${this.getItemType()}"]`));
  }
  addEvents() {
    ['click', 'touchstart', 'keyup'].forEach(event => document.addEventListener(event, this.handleDocumentClick, true));
  }
  removeEvents() {
    ['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, this.handleDocumentClick, true));
  }
  toggle(e) {
    if (this.props.disabled) {
      return e && e.preventDefault();
    }
    return this.props.toggle(e);
  }
  render() {
    const _omit = (0, _utils.omit)(this.props, ['toggle', 'disabled', 'inNavbar', 'a11y']),
      {
        className,
        cssModule,
        direction,
        isOpen,
        group,
        size,
        nav,
        setActiveFromChild,
        active,
        tag,
        menuRole
      } = _omit,
      attrs = _objectWithoutProperties(_omit, _excluded);
    const Tag = tag || (nav ? 'li' : 'div');
    let subItemIsActive = false;
    if (setActiveFromChild) {
      _react.default.Children.map(this.props.children[1].props.children, dropdownItem => {
        if (dropdownItem && dropdownItem.props.active) subItemIsActive = true;
      });
    }
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, {
      'btn-group': group,
      [`btn-group-${size}`]: !!size,
      dropdown: !group,
      dropup: direction === 'up',
      dropstart: direction === 'start' || direction === 'left',
      dropend: direction === 'end' || direction === 'right',
      show: isOpen,
      'nav-item': nav
    }), cssModule);
    if (this.context.insideInputGroup) {
      return /*#__PURE__*/_react.default.createElement(_DropdownContext.DropdownContext.Provider, {
        value: this.getContextValue()
      }, /*#__PURE__*/_react.default.createElement(_reactPopper.Manager, null, _react.default.Children.map(this.props.children, child => /*#__PURE__*/_react.default.cloneElement(child, {
        onKeyDown: this.handleKeyDown
      }))));
    }
    return /*#__PURE__*/_react.default.createElement(_DropdownContext.DropdownContext.Provider, {
      value: this.getContextValue()
    }, /*#__PURE__*/_react.default.createElement(_reactPopper.Manager, null, /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attrs, {
      [typeof Tag === 'string' ? 'ref' : 'innerRef']: this.containerRef,
      onKeyDown: this.handleKeyDown,
      className: classes
    }))));
  }
}
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;
Dropdown.contextType = _InputGroupContext.InputGroupContext;
var _default = Dropdown;
exports.default = _default;