var _excluded = ["items", "activeIndex", "cssModule", "onClickHandler", "className"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from './utils';
function CarouselIndicators(props) {
  var items = props.items,
    activeIndex = props.activeIndex,
    cssModule = props.cssModule,
    onClickHandler = props.onClickHandler,
    className = props.className,
    attributes = _objectWithoutProperties(props, _excluded);
  var listClasses = mapToCssModules(classNames(className, 'carousel-indicators'), cssModule);
  var indicators = items.map(function (item, idx) {
    var indicatorClasses = mapToCssModules(classNames({
      active: activeIndex === idx
    }), cssModule);
    return /*#__PURE__*/React.createElement("button", {
      "aria-label": item.caption,
      "data-bs-target": true,
      type: "button",
      key: "".concat(item.key || Object.values(item).join('')),
      onClick: function onClick(e) {
        e.preventDefault();
        onClickHandler(idx);
      },
      className: indicatorClasses
    });
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    className: listClasses
  }, attributes), indicators);
}
CarouselIndicators.propTypes = {
  /** The current active index */
  activeIndex: PropTypes.number.isRequired,
  /** Add custom class */
  className: PropTypes.string,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Array of items to show */
  items: PropTypes.array.isRequired,
  /** Function to be triggered on click */
  onClickHandler: PropTypes.func.isRequired
};
export default CarouselIndicators;