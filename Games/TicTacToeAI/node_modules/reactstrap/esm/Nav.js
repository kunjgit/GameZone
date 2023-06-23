var _excluded = ["className", "cssModule", "tabs", "pills", "vertical", "horizontal", "justified", "fill", "navbar", "card", "tag"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';
var propTypes = {
  /** Adding card prop adds `.card-header-tabs` or `.card-header-pills` class */
  card: PropTypes.bool,
  /** Add custom class */
  className: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** fills the nav to extend to full available width */
  fill: PropTypes.bool,
  /** Change the horizontal alignment of your nav */
  horizontal: PropTypes.oneOf(['center', 'end']),
  /**  All horizontal space will be occupied by nav links, but unlike the `fill` above, every nav item will be the same width. */
  justified: PropTypes.bool,
  /** Add navbar for a full-height and lightweight navigation */
  navbar: PropTypes.bool,
  /** Make NavItems look like pills */
  pills: PropTypes.bool,
  /** Make NavItems look like tabs */
  tabs: PropTypes.bool,
  /** Set a custom element for this component */
  tag: tagPropType,
  /** Stack your navigation by changing the flex item direction */
  vertical: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};
var getVerticalClass = function getVerticalClass(vertical) {
  if (vertical === false) {
    return false;
  }
  if (vertical === true || vertical === 'xs') {
    return 'flex-column';
  }
  return "flex-".concat(vertical, "-column");
};
function Nav(props) {
  var className = props.className,
    cssModule = props.cssModule,
    tabs = props.tabs,
    pills = props.pills,
    _props$vertical = props.vertical,
    vertical = _props$vertical === void 0 ? false : _props$vertical,
    horizontal = props.horizontal,
    justified = props.justified,
    fill = props.fill,
    navbar = props.navbar,
    card = props.card,
    _props$tag = props.tag,
    Tag = _props$tag === void 0 ? 'ul' : _props$tag,
    attributes = _objectWithoutProperties(props, _excluded);
  var classes = mapToCssModules(classNames(className, navbar ? 'navbar-nav' : 'nav', horizontal ? "justify-content-".concat(horizontal) : false, getVerticalClass(vertical), {
    'nav-tabs': tabs,
    'card-header-tabs': card && tabs,
    'nav-pills': pills,
    'card-header-pills': card && pills,
    'nav-justified': justified,
    'nav-fill': fill
  }), cssModule);
  return /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
Nav.propTypes = propTypes;
export default Nav;