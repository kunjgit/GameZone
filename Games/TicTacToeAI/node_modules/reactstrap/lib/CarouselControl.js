"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["direction", "onClickHandler", "cssModule", "directionText", "className"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function CarouselControl(props) {
  const {
      direction,
      onClickHandler,
      cssModule,
      directionText,
      className
    } = props,
    attributes = _objectWithoutProperties(props, _excluded);
  const anchorClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(className, `carousel-control-${direction}`), cssModule);
  const iconClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(`carousel-control-${direction}-icon`), cssModule);
  const screenReaderClasses = (0, _utils.mapToCssModules)((0, _classnames.default)('visually-hidden'), cssModule);
  return (
    /*#__PURE__*/
    // We need to disable this linting rule to use an `<a>` instead of
    // `<button>` because that's what the Bootstrap examples require:
    // https://getbootstrap.com/docs/4.5/components/carousel/#with-controls
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    _react.default.createElement("a", _extends({}, attributes, {
      className: anchorClasses,
      style: {
        cursor: 'pointer'
      },
      role: "button",
      tabIndex: "0",
      onClick: e => {
        e.preventDefault();
        onClickHandler();
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: iconClasses,
      "aria-hidden": "true"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: screenReaderClasses
    }, directionText || direction))
  );
}
CarouselControl.propTypes = {
  /** Set the direction of control button */
  direction: _propTypes.default.oneOf(['prev', 'next']).isRequired,
  /** Function to be triggered on click */
  onClickHandler: _propTypes.default.func.isRequired,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Screen reader text */
  directionText: _propTypes.default.string,
  /** Add custom class */
  className: _propTypes.default.string
};
var _default = CarouselControl;
exports.default = _default;