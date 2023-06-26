"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTheme;
var _useTheme = _interopRequireDefault(require("@mui/private-theming/useTheme"));
function useTheme() {
  var _privateTheme$$$mater;
  const privateTheme = (0, _useTheme.default)();
  return (_privateTheme$$$mater = privateTheme == null ? void 0 : privateTheme.$$material) != null ? _privateTheme$$$mater : privateTheme;
}