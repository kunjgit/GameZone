"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "active", "tag", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Add active class to NavLink */
  active: _propTypes.default.bool,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Disable the link */
  disabled: _propTypes.default.bool,
  href: _propTypes.default.any,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func, _propTypes.default.string]),
  /** Function to be triggered on click */
  onClick: _propTypes.default.func,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
class NavLink extends _react.default.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.href === '#') {
      e.preventDefault();
    }
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    let _this$props = this.props,
      {
        className,
        cssModule,
        active,
        tag: Tag = 'a',
        innerRef
      } = _this$props,
      attributes = _objectWithoutProperties(_this$props, _excluded);
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'nav-link', {
      disabled: attributes.disabled,
      active: active
    }), cssModule);
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
      ref: innerRef,
      onClick: this.onClick,
      className: classes
    }));
  }
}
NavLink.propTypes = propTypes;
var _default = NavLink;
exports.default = _default;