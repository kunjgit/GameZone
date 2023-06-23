"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _CarouselItem = _interopRequireDefault(require("./CarouselItem"));
var _CarouselContext = require("./CarouselContext");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SWIPE_THRESHOLD = 40;
const propTypes = {
  /** the current active slide of the carousel */
  activeIndex: _propTypes.default.number,
  /** a function which should advance the carousel to the next slide (via activeIndex) */
  next: _propTypes.default.func.isRequired,
  /** a function which should advance the carousel to the previous slide (via activeIndex) */
  previous: _propTypes.default.func.isRequired,
  /** controls if the left and right arrow keys should control the carousel */
  keyboard: _propTypes.default.bool,
  /** If set to "hover", pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on
   * mouseleave. If set to false, hovering over the carousel won't pause it.
   */
  pause: _propTypes.default.oneOf(['hover', false]),
  /** Autoplays the carousel after the user manually cycles the first item. If "carousel", autoplays the carousel on load. */
  ride: _propTypes.default.oneOf(['carousel']),
  /** the interval at which the carousel automatically cycles */
  interval: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.bool]),
  children: _propTypes.default.array,
  /** called when the mouse enters the Carousel */
  mouseEnter: _propTypes.default.func,
  /** called when the mouse exits the Carousel */
  mouseLeave: _propTypes.default.func,
  /** controls whether the slide animation on the Carousel works or not */
  slide: _propTypes.default.bool,
  /** make the controls, indicators and captions dark on the Carousel */
  dark: _propTypes.default.bool,
  fade: _propTypes.default.bool,
  /** Change underlying component's CSS base class name */
  cssModule: _propTypes.default.object,
  /** Add custom class */
  className: _propTypes.default.string,
  /** Enable touch support */
  enableTouch: _propTypes.default.bool
};
const propsToOmit = Object.keys(propTypes);
const defaultProps = {
  interval: 5000,
  pause: 'hover',
  keyboard: true,
  slide: true,
  enableTouch: true,
  fade: false
};
class Carousel extends _react.default.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.hoverStart = this.hoverStart.bind(this);
    this.hoverEnd = this.hoverEnd.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.state = {
      activeIndex: this.props.activeIndex,
      direction: 'end',
      indicatorClicked: false
    };
  }
  componentDidMount() {
    // Set up the cycle
    if (this.props.ride === 'carousel') {
      this.setInterval();
    }

    // TODO: move this to the specific carousel like bootstrap. Currently it will trigger ALL carousels on the page.
    document.addEventListener('keyup', this.handleKeyPress);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;
    let {
      activeIndex,
      direction,
      indicatorClicked
    } = prevState;
    if (nextProps.activeIndex !== activeIndex) {
      // Calculate the direction to turn
      if (nextProps.activeIndex === activeIndex + 1) {
        direction = 'end';
      } else if (nextProps.activeIndex === activeIndex - 1) {
        direction = 'start';
      } else if (nextProps.activeIndex < activeIndex) {
        direction = indicatorClicked ? 'start' : 'end';
      } else if (nextProps.activeIndex !== activeIndex) {
        direction = indicatorClicked ? 'end' : 'start';
      }
      newState = {
        activeIndex: nextProps.activeIndex,
        direction,
        indicatorClicked: false
      };
    }
    return newState;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeIndex === this.state.activeIndex) return;
    this.setInterval();
  }
  componentWillUnmount() {
    this.clearInterval();
    document.removeEventListener('keyup', this.handleKeyPress);
  }
  handleKeyPress(evt) {
    if (this.props.keyboard) {
      if (evt.keyCode === 37) {
        this.props.previous();
      } else if (evt.keyCode === 39) {
        this.props.next();
      }
    }
  }
  handleTouchStart(e) {
    if (!this.props.enableTouch) {
      return;
    }
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }
  handleTouchEnd(e) {
    if (!this.props.enableTouch) {
      return;
    }
    const currentX = e.changedTouches[0].screenX;
    const currentY = e.changedTouches[0].screenY;
    const diffX = Math.abs(this.touchStartX - currentX);
    const diffY = Math.abs(this.touchStartY - currentY);

    // Don't swipe if Y-movement is bigger than X-movement
    if (diffX < diffY) {
      return;
    }
    if (diffX < SWIPE_THRESHOLD) {
      return;
    }
    if (currentX < this.touchStartX) {
      this.props.next();
    } else {
      this.props.previous();
    }
  }
  getContextValue() {
    return {
      direction: this.state.direction
    };
  }
  setInterval() {
    // make sure not to have multiple intervals going...
    this.clearInterval();
    if (this.props.interval) {
      this.cycleInterval = setInterval(() => {
        this.props.next();
      }, parseInt(this.props.interval, 10));
    }
  }
  clearInterval() {
    clearInterval(this.cycleInterval);
  }
  hoverStart(...args) {
    if (this.props.pause === 'hover') {
      this.clearInterval();
    }
    if (this.props.mouseEnter) {
      this.props.mouseEnter(...args);
    }
  }
  hoverEnd(...args) {
    if (this.props.pause === 'hover') {
      this.setInterval();
    }
    if (this.props.mouseLeave) {
      this.props.mouseLeave(...args);
    }
  }
  renderItems(carouselItems, className) {
    const {
      slide
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: className
    }, carouselItems.map((item, index) => {
      const isIn = index === this.state.activeIndex;
      return /*#__PURE__*/_react.default.cloneElement(item, {
        in: isIn,
        slide: slide
      });
    }));
  }
  render() {
    const {
      cssModule,
      slide,
      className,
      dark,
      fade
    } = this.props;
    const attributes = (0, _utils.omit)(this.props, propsToOmit);
    const outerClasses = (0, _utils.mapToCssModules)((0, _classnames.default)(className, 'carousel', fade && 'carousel-fade', slide && 'slide', dark && 'carousel-dark'), cssModule);
    const innerClasses = (0, _utils.mapToCssModules)((0, _classnames.default)('carousel-inner'), cssModule);

    // filter out booleans, null, or undefined
    const children = this.props.children.filter(child => child !== null && child !== undefined && typeof child !== 'boolean');
    const slidesOnly = children.every(child => child.type === _CarouselItem.default);

    // Rendering only slides
    if (slidesOnly) {
      return /*#__PURE__*/_react.default.createElement("div", _extends({}, attributes, {
        className: outerClasses,
        onMouseEnter: this.hoverStart,
        onMouseLeave: this.hoverEnd
      }), /*#__PURE__*/_react.default.createElement(_CarouselContext.CarouselContext.Provider, {
        value: this.getContextValue()
      }, this.renderItems(children, innerClasses)));
    }

    // Rendering slides and controls
    if (children[0] instanceof Array) {
      const carouselItems = children[0];
      const controlLeft = children[1];
      const controlRight = children[2];
      return /*#__PURE__*/_react.default.createElement("div", _extends({}, attributes, {
        className: outerClasses,
        onMouseEnter: this.hoverStart,
        onMouseLeave: this.hoverEnd
      }), /*#__PURE__*/_react.default.createElement(_CarouselContext.CarouselContext.Provider, {
        value: this.getContextValue()
      }, this.renderItems(carouselItems, innerClasses), controlLeft, controlRight));
    }

    // Rendering indicators, slides and controls
    const indicators = children[0];
    const wrappedOnClick = e => {
      if (typeof indicators.props.onClickHandler === 'function') {
        this.setState({
          indicatorClicked: true
        }, () => indicators.props.onClickHandler(e));
      }
    };
    const wrappedIndicators = /*#__PURE__*/_react.default.cloneElement(indicators, {
      onClickHandler: wrappedOnClick
    });
    const carouselItems = children[1];
    const controlLeft = children[2];
    const controlRight = children[3];
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, attributes, {
      className: outerClasses,
      onMouseEnter: this.hoverStart,
      onMouseLeave: this.hoverEnd,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd
    }), /*#__PURE__*/_react.default.createElement(_CarouselContext.CarouselContext.Provider, {
      value: this.getContextValue()
    }, wrappedIndicators, this.renderItems(carouselItems, innerClasses), controlLeft, controlRight));
  }
}
Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;
var _default = Carousel;
exports.default = _default;