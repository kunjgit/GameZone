"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _DropdownContext = require("./DropdownContext");
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "divider", "tag", "header", "active", "text"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  children: _propTypes.default.node,
  active: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  divider: _propTypes.default.bool,
  tag: _utils.tagPropType,
  header: _propTypes.default.bool,
  onClick: _propTypes.default.func,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  toggle: _propTypes.default.bool,
  text: _propTypes.default.bool
};
class DropdownItem extends _react.default.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.getTabIndex = this.getTabIndex.bind(this);
  }
  onClick(e) {
    const {
      disabled,
      header,
      divider,
      text
    } = this.props;
    if (disabled || header || divider || text) {
      e.preventDefault();
      return;
    }
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    if (this.props.toggle ?? true) {
      this.context.toggle(e);
    }
  }
  getRole() {
    if (this.context.menuRole === 'listbox') {
      return 'option';
    }
    return 'menuitem';
  }
  getTabIndex() {
    const {
      disabled,
      header,
      divider,
      text
    } = this.props;
    if (disabled || header || divider || text) {
      return '-1';
    }
    return '0';
  }
  render() {
    const tabIndex = this.getTabIndex();
    const role = tabIndex > -1 ? this.getRole() : undefined;
    let _omit = (0, _utils.omit)(this.props, ['toggle']),
      {
        className,
        cssModule,
        divider,
        tag: Tag = 'button',
        header,
        active,
        text
      } = _omit,
      props = _objectWithoutProperties(_omit, _excluded);
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, {
      disabled: props.disabled,
      'dropdown-item': !divider && !header && !text,
      active: active,
      'dropdown-header': header,
      'dropdown-divider': divider,
      'dropdown-item-text': text
    }), cssModule);
    if (Tag === 'button') {
      if (header) {
        Tag = 'h6';
      } else if (divider) {
        Tag = 'div';
      } else if (props.href) {
        Tag = 'a';
      } else if (text) {
        Tag = 'span';
      }
    }
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({
      type: Tag === 'button' && (props.onClick || this.props.toggle) ? 'button' : undefined
    }, props, {
      tabIndex: tabIndex,
      role: role,
      className: classes,
      onClick: this.onClick
    }));
  }
}
DropdownItem.propTypes = propTypes;
DropdownItem.contextType = _DropdownContext.DropdownContext;
var _default = DropdownItem;
exports.default = _default;