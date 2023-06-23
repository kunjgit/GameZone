"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function CarouselCaption(props) {
  const {
    captionHeader,
    captionText,
    cssModule,
    className
  } = props;
  const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'carousel-caption', 'd-none', 'd-md-block'), cssModule);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes
  }, /*#__PURE__*/_react.default.createElement("h3", null, captionHeader), /*#__PURE__*/_react.default.createElement("p", null, captionText));
}
CarouselCaption.propTypes = {
  /** Heading for the caption */
  captionHeader: _propTypes.default.node,
  /** Text for caption */
  captionText: _propTypes.default.node.isRequired,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object
};
var _default = CarouselCaption;
exports.default = _default;