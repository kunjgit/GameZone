import useTheme from '../useTheme';
import propsToClassKey from '../propsToClassKey';
var useThemeVariants = function useThemeVariants(props, name) {
  var _props$classes = props.classes,
    classes = _props$classes === void 0 ? {} : _props$classes;
  var theme = useTheme();
  var variantsClasses = '';
  if (theme && theme.components && theme.components[name] && theme.components[name].variants) {
    var themeVariants = theme.components[name].variants;
    themeVariants.forEach(function (themeVariant) {
      var isMatch = true;
      Object.keys(themeVariant.props).forEach(function (key) {
        if (props[key] !== themeVariant.props[key]) {
          isMatch = false;
        }
      });
      if (isMatch) {
        variantsClasses = "".concat(variantsClasses).concat(classes[propsToClassKey(themeVariant.props)], " ");
      }
    });
  }
  return variantsClasses;
};
export default useThemeVariants;