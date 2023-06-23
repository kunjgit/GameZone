function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["defaultActiveIndex", "autoPlay", "indicators", "controls", "items", "goToIndex"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from './Carousel';
import CarouselItem from './CarouselItem';
import CarouselControl from './CarouselControl';
import CarouselIndicators from './CarouselIndicators';
import CarouselCaption from './CarouselCaption';
var propTypes = {
  items: PropTypes.array.isRequired,
  indicators: PropTypes.bool,
  controls: PropTypes.bool,
  autoPlay: PropTypes.bool,
  defaultActiveIndex: PropTypes.number,
  activeIndex: PropTypes.number,
  next: PropTypes.func,
  previous: PropTypes.func,
  goToIndex: PropTypes.func
};
var UncontrolledCarousel = /*#__PURE__*/function (_Component) {
  _inherits(UncontrolledCarousel, _Component);
  var _super = _createSuper(UncontrolledCarousel);
  function UncontrolledCarousel(props) {
    var _this;
    _classCallCheck(this, UncontrolledCarousel);
    _this = _super.call(this, props);
    _this.animating = false;
    _this.state = {
      activeIndex: props.defaultActiveIndex || 0
    };
    _this.next = _this.next.bind(_assertThisInitialized(_this));
    _this.previous = _this.previous.bind(_assertThisInitialized(_this));
    _this.goToIndex = _this.goToIndex.bind(_assertThisInitialized(_this));
    _this.onExiting = _this.onExiting.bind(_assertThisInitialized(_this));
    _this.onExited = _this.onExited.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(UncontrolledCarousel, [{
    key: "onExiting",
    value: function onExiting() {
      this.animating = true;
    }
  }, {
    key: "onExited",
    value: function onExited() {
      this.animating = false;
    }
  }, {
    key: "next",
    value: function next() {
      var _this2 = this;
      if (this.animating) return;
      this.setState(function (prevState) {
        var nextIndex = prevState.activeIndex === _this2.props.items.length - 1 ? 0 : prevState.activeIndex + 1;
        return {
          activeIndex: nextIndex
        };
      });
    }
  }, {
    key: "previous",
    value: function previous() {
      var _this3 = this;
      if (this.animating) return;
      this.setState(function (prevState) {
        var nextIndex = prevState.activeIndex === 0 ? _this3.props.items.length - 1 : prevState.activeIndex - 1;
        return {
          activeIndex: nextIndex
        };
      });
    }
  }, {
    key: "goToIndex",
    value: function goToIndex(newIndex) {
      if (this.animating) return;
      this.setState({
        activeIndex: newIndex
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props = this.props,
        defaultActiveIndex = _this$props.defaultActiveIndex,
        _this$props$autoPlay = _this$props.autoPlay,
        autoPlay = _this$props$autoPlay === void 0 ? true : _this$props$autoPlay,
        _this$props$indicator = _this$props.indicators,
        indicators = _this$props$indicator === void 0 ? true : _this$props$indicator,
        _this$props$controls = _this$props.controls,
        controls = _this$props$controls === void 0 ? true : _this$props$controls,
        items = _this$props.items,
        goToIndex = _this$props.goToIndex,
        props = _objectWithoutProperties(_this$props, _excluded);
      var activeIndex = this.state.activeIndex;
      var slides = items.map(function (item) {
        var key = item.key || item.src;
        return /*#__PURE__*/React.createElement(CarouselItem, {
          onExiting: _this4.onExiting,
          onExited: _this4.onExited,
          key: key
        }, /*#__PURE__*/React.createElement("img", {
          className: "d-block w-100",
          src: item.src,
          alt: item.altText
        }), /*#__PURE__*/React.createElement(CarouselCaption, {
          captionText: item.caption,
          captionHeader: item.header || item.caption
        }));
      });
      return /*#__PURE__*/React.createElement(Carousel, _extends({
        activeIndex: activeIndex,
        next: this.next,
        previous: this.previous,
        ride: autoPlay ? 'carousel' : undefined
      }, props), indicators && /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        activeIndex: props.activeIndex || activeIndex,
        onClickHandler: goToIndex || this.goToIndex
      }), slides, controls && /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        directionText: "Previous",
        onClickHandler: props.previous || this.previous
      }), controls && /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        directionText: "Next",
        onClickHandler: props.next || this.next
      }));
    }
  }]);
  return UncontrolledCarousel;
}(Component);
UncontrolledCarousel.propTypes = propTypes;
export default UncontrolledCarousel;