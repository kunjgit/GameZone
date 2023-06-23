"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "tabs", "pills", "vertical", "horizontal", "justified", "fill", "navbar", "card", "tag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Adding card prop adds `.card-header-tabs` or `.card-header-pills` class */
  card: _propTypes.default.bool,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** fills the nav to extend to full available width */
  fill: _propTypes.default.bool,
  /** Change the horizontal alignment of your nav */
  horizontal: _propTypes.default.oneOf(['center', 'end']),
  /**  All horizontal space will be occupied by nav links, but unlike the `fill` above, every nav item will be the same width. */
  justified: _propTypes.default.bool,
  /** Add navbar for a full-height and lightweight navigation */
  navbar: _propTypes.default.bool,
  /** Make NavItems look like pills */
  pills: _propTypes.default.bool,
  /** Make NavItems look like tabs */
  tabs: _propTypes.default.bool,
  /** Set a custom element for this component */
  tag: _utils.tagPropType,
  /** Stack your navigation by changing the flex item direction */
  vertical: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string])
};
const getVerticalClass = vertical => {
  if (vertical === false) {
    return false;
  }
  if (vertical === true || vertical === 'xs') {
    return 'flex-column';
  }
  return `flex-${vertical}-column`;
};
function Nav(props) {
  const {
      className,
      cssModule,
      tabs,
      pills,
      vertical = false,
      horizontal,
      justified,
      fill,
      navbar,
      card,
      tag: Tag = 'ul'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, navbar ? 'navbar-nav' : 'nav', horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    'nav-tabs': tabs,
    'card-header-tabs': card && tabs,
    'nav-pills': pills,
    'card-header-pills': card && pills,
    'nav-justified': justified,
    'nav-fill': fill
  }), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
Nav.propTypes = propTypes;
var _default = Nav;
exports.default = _default;