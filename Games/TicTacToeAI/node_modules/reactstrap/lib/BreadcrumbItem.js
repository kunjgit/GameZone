"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "active", "tag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Adds a visual "active" state to a Breadcrumb Item */
  active: _propTypes.default.bool,
  /** Add custom class to the element */
  className: _propTypes.default.string,
  /** Change existing className with a new className */
  cssModule: _propTypes.default.object,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
function BreadcrumbItem(props) {
  const {
      className,
      cssModule,
      active,
      tag: Tag = 'li'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, active ? 'active' : false, 'breadcrumb-item'), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes,
    "aria-current": active ? 'page' : undefined
  }));
}
BreadcrumbItem.propTypes = propTypes;
var _default = BreadcrumbItem;
exports.default = _default;