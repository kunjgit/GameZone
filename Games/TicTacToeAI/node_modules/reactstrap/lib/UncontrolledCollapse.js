"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Collapse = _interopRequireDefault(require("./Collapse"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const omitKeys = ['toggleEvents', 'defaultOpen'];
const propTypes = {
  /** set if Collapse is open by default */
  defaultOpen: _propTypes.default.bool,
  /** id of the element that should trigger toggle */
  toggler: _propTypes.default.string.isRequired,
  /** Events that should trigger the toggle */
  toggleEvents: _propTypes.default.arrayOf(_propTypes.default.string)
};
const defaultProps = {
  toggleEvents: _utils.defaultToggleEvents
};
class UncontrolledCollapse extends _react.Component {
  constructor(props) {
    super(props);
    this.togglers = null;
    this.removeEventListeners = null;
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: props.defaultOpen || false
    };
  }
  componentDidMount() {
    this.togglers = (0, _utils.findDOMElements)(this.props.toggler);
    if (this.togglers.length) {
      this.removeEventListeners = (0, _utils.addMultipleEventListeners)(this.togglers, this.toggle, this.props.toggleEvents);
    }
  }
  componentWillUnmount() {
    if (this.togglers.length && this.removeEventListeners) {
      this.removeEventListeners();
    }
  }
  toggle(e) {
    this.setState(({
      isOpen
    }) => ({
      isOpen: !isOpen
    }));
    e.preventDefault();
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_Collapse.default, _extends({
      isOpen: this.state.isOpen
    }, (0, _utils.omit)(this.props, omitKeys)));
  }
}
UncontrolledCollapse.propTypes = propTypes;
UncontrolledCollapse.defaultProps = defaultProps;
var _default = UncontrolledCollapse;
exports.default = _default;