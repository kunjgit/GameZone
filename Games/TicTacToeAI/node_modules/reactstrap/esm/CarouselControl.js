var _excluded = ["direction", "onClickHandler", "cssModule", "directionText", "className"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from './utils';
function CarouselControl(props) {
  var direction = props.direction,
    onClickHandler = props.onClickHandler,
    cssModule = props.cssModule,
    directionText = props.directionText,
    className = props.className,
    attributes = _objectWithoutProperties(props, _excluded);
  var anchorClasses = mapToCssModules(classNames(className, "carousel-control-".concat(direction)), cssModule);
  var iconClasses = mapToCssModules(classNames("carousel-control-".concat(direction, "-icon")), cssModule);
  var screenReaderClasses = mapToCssModules(classNames('visually-hidden'), cssModule);
  return (
    /*#__PURE__*/
    // We need to disable this linting rule to use an `<a>` instead of
    // `<button>` because that's what the Bootstrap examples require:
    // https://getbootstrap.com/docs/4.5/components/carousel/#with-controls
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    React.createElement("a", _extends({}, attributes, {
      className: anchorClasses,
      style: {
        cursor: 'pointer'
      },
      role: "button",
      tabIndex: "0",
      onClick: function onClick(e) {
        e.preventDefault();
        onClickHandler();
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: iconClasses,
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: screenReaderClasses
    }, directionText || direction))
  );
}
CarouselControl.propTypes = {
  /** Set the direction of control button */
  direction: PropTypes.oneOf(['prev', 'next']).isRequired,
  /** Function to be triggered on click */
  onClickHandler: PropTypes.func.isRequired,
  /** Change underlying component's CSS base class name */
  cssModule: PropTypes.object,
  /** Screen reader text */
  directionText: PropTypes.string,
  /** Add custom class */
  className: PropTypes.string
};
export default CarouselControl;