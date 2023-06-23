"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const propTypes = {
  children: _propTypes.default.node.isRequired,
  node: _propTypes.default.any
};
class Portal extends _react.default.Component {
  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }
  render() {
    if (!_utils.canUseDOM) {
      return null;
    }
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return /*#__PURE__*/_reactDom.default.createPortal(this.props.children, this.props.node || this.defaultNode);
  }
}
Portal.propTypes = propTypes;
var _default = Portal;
exports.default = _default;