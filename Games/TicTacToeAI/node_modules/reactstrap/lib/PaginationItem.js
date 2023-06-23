"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["active", "className", "cssModule", "disabled", "tag"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  /** Set item as active */
  active: _propTypes.default.bool,
  children: _propTypes.default.node,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Set item as disabled */
  disabled: _propTypes.default.bool,
  /** Set a custom element for this component */
  tag: _utils.tagPropType
};
function PaginationItem(props) {
  const {
      active,
      className,
      cssModule,
      disabled,
      tag: Tag = 'li'
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'page-item', {
    active,
    disabled
  }), cssModule);
  return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
    className: classes
  }));
}
PaginationItem.propTypes = propTypes;
var _default = PaginationItem;
exports.default = _default;