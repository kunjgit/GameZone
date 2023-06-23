"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactPopper = require("react-popper");
var _DropdownContext = require("./DropdownContext");
var _utils = require("./utils");
var _Button = _interopRequireDefault(require("./Button"));
const _excluded = ["className", "color", "cssModule", "caret", "split", "nav", "tag", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  caret: _propTypes.default.bool,
  color: _propTypes.default.string,
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  disabled: _propTypes.default.bool,
  onClick: _propTypes.default.func,
  'aria-haspopup': _propTypes.default.bool,
  split: _propTypes.default.bool,
  tag: _utils.tagPropType,
  nav: _propTypes.default.bool,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func])
};
const defaultProps = {
  color: 'secondary',
  'aria-haspopup': true
};
class DropdownToggle extends _react.default.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
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
  getRole() {
    return this.context.menuRole || this.props['aria-haspopup'];
  }
  render() {
    const _this$props = this.props,
      {
        className,
        color,
        cssModule,
        caret,
        split,
        nav,
        tag,
        innerRef
      } = _this$props,
      props = _objectWithoutProperties(_this$props, _excluded);
    const ariaLabel = props['aria-label'] || 'Toggle Dropdown';
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, {
      'dropdown-toggle': caret || split,
      'dropdown-toggle-split': split,
      'nav-link': nav
    }), cssModule);
    const children = typeof props.children !== 'undefined' ? props.children : /*#__PURE__*/_react.default.createElement("span", {
      className: "visually-hidden"
    }, ariaLabel);
    let Tag;
    if (nav && !tag) {
      Tag = 'a';
      props.href = '#';
    } else if (!tag) {
      Tag = _Button.default;
      props.color = color;
      props.cssModule = cssModule;
    } else {
      Tag = tag;
    }
    if (this.context.inNavbar) {
      return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, props, {
        className: classes,
        onClick: this.onClick,
        ref: this.context.onToggleRef,
        "aria-expanded": this.context.isOpen,
        "aria-haspopup": this.getRole(),
        children: children
      }));
    }
    return /*#__PURE__*/_react.default.createElement(_reactPopper.Reference, {
      innerRef: innerRef
    }, ({
      ref
    }) => {
      const handleRef = tagRef => {
        ref(tagRef);
        const {
          onToggleRef
        } = this.context;
        if (onToggleRef) onToggleRef(tagRef);
      };
      return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, props, {
        [typeof Tag === 'string' ? 'ref' : 'innerRef']: handleRef,
        className: classes,
        onClick: this.onClick,
        "aria-expanded": this.context.isOpen,
        "aria-haspopup": this.getRole(),
        children: children
      }));
    });
  }
}
DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;
DropdownToggle.contextType = _DropdownContext.DropdownContext;
var _default = DropdownToggle;
exports.default = _default;