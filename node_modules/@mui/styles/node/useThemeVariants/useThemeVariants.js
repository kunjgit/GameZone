"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _useTheme = _interopRequireDefault(require("../useTheme"));
var _propsToClassKey = _interopRequireDefault(require("../propsToClassKey"));
const useThemeVariants = (props, name) => {
  const {
    classes = {}
  } = props;
  const theme = (0, _useTheme.default)();
  let variantsClasses = '';
  if (theme && theme.components && theme.components[name] && theme.components[name].variants) {
    const themeVariants = theme.components[name].variants;
    themeVariants.forEach(themeVariant => {
      let isMatch = true;
      Object.keys(themeVariant.props).forEach(key => {
        if (props[key] !== themeVariant.props[key]) {
          isMatch = false;
        }
      });
      if (isMatch) {
        variantsClasses = `${variantsClasses}${classes[(0, _propsToClassKey.default)(themeVariant.props)]} `;
      }
    });
  }
  return variantsClasses;
};
var _default = useThemeVariants;
exports.default = _default;