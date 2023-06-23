"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function PopperTargetHelper(props, context) {
  context.popperManager.setTargetNode((0, _utils.getTarget)(props.target));
  return null;
}
PopperTargetHelper.contextTypes = {
  popperManager: _propTypes.default.object.isRequired
};
PopperTargetHelper.propTypes = {
  target: _utils.targetPropType.isRequired
};
var _default = PopperTargetHelper;
exports.default = _default;