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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TabContext } from './TabContext';
import { mapToCssModules, omit, tagPropType } from './utils';
var propTypes = {
  tag: tagPropType,
  activeTab: PropTypes.any,
  className: PropTypes.string,
  cssModule: PropTypes.object
};
var TabContent = /*#__PURE__*/function (_Component) {
  _inherits(TabContent, _Component);
  var _super = _createSuper(TabContent);
  function TabContent(props) {
    var _this;
    _classCallCheck(this, TabContent);
    _this = _super.call(this, props);
    _this.state = {
      activeTab: _this.props.activeTab
    };
    return _this;
  }
  _createClass(TabContent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        className = _this$props.className,
        cssModule = _this$props.cssModule,
        _this$props$tag = _this$props.tag,
        Tag = _this$props$tag === void 0 ? 'div' : _this$props$tag;
      var attributes = omit(this.props, Object.keys(propTypes));
      var classes = mapToCssModules(classNames('tab-content', className), cssModule);
      return /*#__PURE__*/React.createElement(TabContext.Provider, {
        value: {
          activeTabId: this.state.activeTab
        }
      }, /*#__PURE__*/React.createElement(Tag, _extends({}, attributes, {
        className: classes
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.activeTab !== nextProps.activeTab) {
        return {
          activeTab: nextProps.activeTab
        };
      }
      return null;
    }
  }]);
  return TabContent;
}(Component);
export default TabContent;
TabContent.propTypes = propTypes;