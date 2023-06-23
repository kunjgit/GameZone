"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactTransitionGroup = require("react-transition-group");
var _utils = require("./utils");
const _excluded = ["tag", "baseClass", "baseClassActive", "className", "cssModule", "children", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const propTypes = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.propTypes), {}, {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
  tag: _utils.tagPropType,
  baseClass: _propTypes.default.string,
  baseClassActive: _propTypes.default.string,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func])
});
const defaultProps = _objectSpread(_objectSpread({}, _reactTransitionGroup.Transition.defaultProps), {}, {
  timeout: _utils.TransitionTimeouts.Fade,
  appear: true,
  enter: true,
  exit: true,
  in: true
});
function Fade(props) {
  const ref = (0, _react.useRef)(null);
  const {
      tag: Tag = 'div',
      baseClass = 'fade',
      baseClassActive = 'show',
      className,
      cssModule,
      children,
      innerRef = ref
    } = props,
    otherProps = _objectWithoutProperties(props, _excluded);
  const transitionProps = (0, _utils.pick)(_objectSpread({
    defaultProps
  }, otherProps), _utils.TransitionPropTypeKeys);
  const childProps = (0, _utils.omit)(otherProps, _utils.TransitionPropTypeKeys);
  return /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.Transition, _extends({
    nodeRef: innerRef
  }, transitionProps), status => {
    const isActive = status === 'entered';
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, baseClass, isActive && baseClassActive), cssModule);
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({
      className: classes
    }, childProps, {
      ref: innerRef
    }), children);
  });
}
Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;
var _default = Fade;
exports.default = _default;