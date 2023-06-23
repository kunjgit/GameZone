"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Carousel = _interopRequireDefault(require("./Carousel"));
var _CarouselItem = _interopRequireDefault(require("./CarouselItem"));
var _CarouselControl = _interopRequireDefault(require("./CarouselControl"));
var _CarouselIndicators = _interopRequireDefault(require("./CarouselIndicators"));
var _CarouselCaption = _interopRequireDefault(require("./CarouselCaption"));
const _excluded = ["defaultActiveIndex", "autoPlay", "indicators", "controls", "items", "goToIndex"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  items: _propTypes.default.array.isRequired,
  indicators: _propTypes.default.bool,
  controls: _propTypes.default.bool,
  autoPlay: _propTypes.default.bool,
  defaultActiveIndex: _propTypes.default.number,
  activeIndex: _propTypes.default.number,
  next: _propTypes.default.func,
  previous: _propTypes.default.func,
  goToIndex: _propTypes.default.func
};
class UncontrolledCarousel extends _react.Component {
  constructor(props) {
    super(props);
    this.animating = false;
    this.state = {
      activeIndex: props.defaultActiveIndex || 0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }
  onExiting() {
    this.animating = true;
  }
  onExited() {
    this.animating = false;
  }
  next() {
    if (this.animating) return;
    this.setState(prevState => {
      const nextIndex = prevState.activeIndex === this.props.items.length - 1 ? 0 : prevState.activeIndex + 1;
      return {
        activeIndex: nextIndex
      };
    });
  }
  previous() {
    if (this.animating) return;
    this.setState(prevState => {
      const nextIndex = prevState.activeIndex === 0 ? this.props.items.length - 1 : prevState.activeIndex - 1;
      return {
        activeIndex: nextIndex
      };
    });
  }
  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({
      activeIndex: newIndex
    });
  }
  render() {
    const _this$props = this.props,
      {
        defaultActiveIndex,
        autoPlay = true,
        indicators = true,
        controls = true,
        items,
        goToIndex
      } = _this$props,
      props = _objectWithoutProperties(_this$props, _excluded);
    const {
      activeIndex
    } = this.state;
    const slides = items.map(item => {
      const key = item.key || item.src;
      return /*#__PURE__*/_react.default.createElement(_CarouselItem.default, {
        onExiting: this.onExiting,
        onExited: this.onExited,
        key: key
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "d-block w-100",
        src: item.src,
        alt: item.altText
      }), /*#__PURE__*/_react.default.createElement(_CarouselCaption.default, {
        captionText: item.caption,
        captionHeader: item.header || item.caption
      }));
    });
    return /*#__PURE__*/_react.default.createElement(_Carousel.default, _extends({
      activeIndex: activeIndex,
      next: this.next,
      previous: this.previous,
      ride: autoPlay ? 'carousel' : undefined
    }, props), indicators && /*#__PURE__*/_react.default.createElement(_CarouselIndicators.default, {
      items: items,
      activeIndex: props.activeIndex || activeIndex,
      onClickHandler: goToIndex || this.goToIndex
    }), slides, controls && /*#__PURE__*/_react.default.createElement(_CarouselControl.default, {
      direction: "prev",
      directionText: "Previous",
      onClickHandler: props.previous || this.previous
    }), controls && /*#__PURE__*/_react.default.createElement(_CarouselControl.default, {
      direction: "next",
      directionText: "Next",
      onClickHandler: props.next || this.next
    }));
  }
}
UncontrolledCarousel.propTypes = propTypes;
var _default = UncontrolledCarousel;
exports.default = _default;