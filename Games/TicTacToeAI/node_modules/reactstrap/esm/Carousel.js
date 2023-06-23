function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CarouselItem from './CarouselItem';
import { CarouselContext } from './CarouselContext';
import { mapToCssModules, omit } from './utils';
var SWIPE_THRESHOLD = 40;
var propTypes = {
  /** the current active slide of the carousel */
  activeIndex: PropTypes.number,
  /** a function which should advance the carousel to the next slide (via activeIndex) */
  next: PropTypes.func.isRequired,
  /** a function which should advance the carousel to the previous slide (via activeIndex) */
  previous: PropTypes.func.isRequired,
  /** controls if the left and right arrow keys should control the carousel */
  keyboard: PropTypes.bool,
  /** If set to "hover", pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on
   * mouseleave. If set to false, hovering over the carousel won't pause it.
   */
  pause: PropTypes.oneOf(['hover', false]),
  /** Autoplays the carousel after the user manually cycles the first item. If "carousel", autoplays the carousel on load. */
  ride: PropTypes.oneOf(['carousel']),
  /** the interval at which the carousel automatically cycles */
  interval: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  children: PropTypes.array,
  /** called when the mouse enters the Carousel */
  mouseEnter: PropTypes.func,
  /** called when the mouse exits the Carousel */
  mouseLeave: PropTypes.func,
  /** controls whether the slide animation on the Carousel works or not */
  slide: PropTypes.bool,
  /** make the controls, indicators and captions dark on the Carousel */
  dark: PropTypes.bool,
  fade: PropTypes.bool,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Add custom class */
  className: PropTypes.string,
  /** Enable touch support */
  enableTouch: PropTypes.bool
};
var propsToOmit = Object.keys(propTypes);
var defaultProps = {
  interval: 5000,
  pause: 'hover',
  keyboard: true,
  slide: true,
  enableTouch: true,
  fade: false
};
var Carousel = /*#__PURE__*/function (_React$Component) {
  _inherits(Carousel, _React$Component);
  var _super = _createSuper(Carousel);
  function Carousel(props) {
    var _this;
    _classCallCheck(this, Carousel);
    _this = _super.call(this, props);
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.renderItems = _this.renderItems.bind(_assertThisInitialized(_this));
    _this.hoverStart = _this.hoverStart.bind(_assertThisInitialized(_this));
    _this.hoverEnd = _this.hoverEnd.bind(_assertThisInitialized(_this));
    _this.handleTouchStart = _this.handleTouchStart.bind(_assertThisInitialized(_this));
    _this.handleTouchEnd = _this.handleTouchEnd.bind(_assertThisInitialized(_this));
    _this.touchStartX = 0;
    _this.touchStartY = 0;
    _this.state = {
      activeIndex: _this.props.activeIndex,
      direction: 'end',
      indicatorClicked: false
    };
    return _this;
  }
  _createClass(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set up the cycle
      if (this.props.ride === 'carousel') {
        this.setInterval();
      }

      // TODO: move this to the specific carousel like bootstrap. Currently it will trigger ALL carousels on the page.
      document.addEventListener('keyup', this.handleKeyPress);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.activeIndex === this.state.activeIndex) return;
      this.setInterval();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearInterval();
      document.removeEventListener('keyup', this.handleKeyPress);
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(evt) {
      if (this.props.keyboard) {
        if (evt.keyCode === 37) {
          this.props.previous();
        } else if (evt.keyCode === 39) {
          this.props.next();
        }
      }
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(e) {
      if (!this.props.enableTouch) {
        return;
      }
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd(e) {
      if (!this.props.enableTouch) {
        return;
      }
      var currentX = e.changedTouches[0].screenX;
      var currentY = e.changedTouches[0].screenY;
      var diffX = Math.abs(this.touchStartX - currentX);
      var diffY = Math.abs(this.touchStartY - currentY);

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
  }, {
    key: "getContextValue",
    value: function getContextValue() {
      return {
        direction: this.state.direction
      };
    }
  }, {
    key: "setInterval",
    value: function (_setInterval) {
      function setInterval() {
        return _setInterval.apply(this, arguments);
      }
      setInterval.toString = function () {
        return _setInterval.toString();
      };
      return setInterval;
    }(function () {
      var _this2 = this;
      // make sure not to have multiple intervals going...
      this.clearInterval();
      if (this.props.interval) {
        this.cycleInterval = setInterval(function () {
          _this2.props.next();
        }, parseInt(this.props.interval, 10));
      }
    })
  }, {
    key: "clearInterval",
    value: function (_clearInterval) {
      function clearInterval() {
        return _clearInterval.apply(this, arguments);
      }
      clearInterval.toString = function () {
        return _clearInterval.toString();
      };
      return clearInterval;
    }(function () {
      clearInterval(this.cycleInterval);
    })
  }, {
    key: "hoverStart",
    value: function hoverStart() {
      if (this.props.pause === 'hover') {
        this.clearInterval();
      }
      if (this.props.mouseEnter) {
        var _this$props;
        (_this$props = this.props).mouseEnter.apply(_this$props, arguments);
      }
    }
  }, {
    key: "hoverEnd",
    value: function hoverEnd() {
      if (this.props.pause === 'hover') {
        this.setInterval();
      }
      if (this.props.mouseLeave) {
        var _this$props2;
        (_this$props2 = this.props).mouseLeave.apply(_this$props2, arguments);
      }
    }
  }, {
    key: "renderItems",
    value: function renderItems(carouselItems, className) {
      var _this3 = this;
      var slide = this.props.slide;
      return /*#__PURE__*/React.createElement("div", {
        className: className
      }, carouselItems.map(function (item, index) {
        var isIn = index === _this3.state.activeIndex;
        return /*#__PURE__*/React.cloneElement(item, {
          "in": isIn,
          slide: slide
        });
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props3 = this.props,
        cssModule = _this$props3.cssModule,
        slide = _this$props3.slide,
        className = _this$props3.className,
        dark = _this$props3.dark,
        fade = _this$props3.fade;
      var attributes = omit(this.props, propsToOmit);
      var outerClasses = mapToCssModules(classNames(className, 'carousel', fade && 'carousel-fade', slide && 'slide', dark && 'carousel-dark'), cssModule);
      var innerClasses = mapToCssModules(classNames('carousel-inner'), cssModule);

      // filter out booleans, null, or undefined
      var children = this.props.children.filter(function (child) {
        return child !== null && child !== undefined && typeof child !== 'boolean';
      });
      var slidesOnly = children.every(function (child) {
        return child.type === CarouselItem;
      });

      // Rendering only slides
      if (slidesOnly) {
        return /*#__PURE__*/React.createElement("div", _extends({}, attributes, {
          className: outerClasses,
          onMouseEnter: this.hoverStart,
          onMouseLeave: this.hoverEnd
        }), /*#__PURE__*/React.createElement(CarouselContext.Provider, {
          value: this.getContextValue()
        }, this.renderItems(children, innerClasses)));
      }

      // Rendering slides and controls
      if (children[0] instanceof Array) {
        var _carouselItems = children[0];
        var _controlLeft = children[1];
        var _controlRight = children[2];
        return /*#__PURE__*/React.createElement("div", _extends({}, attributes, {
          className: outerClasses,
          onMouseEnter: this.hoverStart,
          onMouseLeave: this.hoverEnd
        }), /*#__PURE__*/React.createElement(CarouselContext.Provider, {
          value: this.getContextValue()
        }, this.renderItems(_carouselItems, innerClasses), _controlLeft, _controlRight));
      }

      // Rendering indicators, slides and controls
      var indicators = children[0];
      var wrappedOnClick = function wrappedOnClick(e) {
        if (typeof indicators.props.onClickHandler === 'function') {
          _this4.setState({
            indicatorClicked: true
          }, function () {
            return indicators.props.onClickHandler(e);
          });
        }
      };
      var wrappedIndicators = /*#__PURE__*/React.cloneElement(indicators, {
        onClickHandler: wrappedOnClick
      });
      var carouselItems = children[1];
      var controlLeft = children[2];
      var controlRight = children[3];
      return /*#__PURE__*/React.createElement("div", _extends({}, attributes, {
        className: outerClasses,
        onMouseEnter: this.hoverStart,
        onMouseLeave: this.hoverEnd,
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleTouchEnd
      }), /*#__PURE__*/React.createElement(CarouselContext.Provider, {
        value: this.getContextValue()
      }, wrappedIndicators, this.renderItems(carouselItems, innerClasses), controlLeft, controlRight));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var newState = null;
      var activeIndex = prevState.activeIndex,
        direction = prevState.direction,
        indicatorClicked = prevState.indicatorClicked;
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
          direction: direction,
          indicatorClicked: false
        };
      }
      return newState;
    }
  }]);
  return Carousel;
}(React.Component);
Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;
export default Carousel;