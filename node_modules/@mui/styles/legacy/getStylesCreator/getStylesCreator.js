import _extends from "@babel/runtime/helpers/esm/extends";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import { deepmerge } from '@mui/utils';
import propsToClassKey from '../propsToClassKey';
import noopTheme from './noopTheme';
export default function getStylesCreator(stylesOrCreator) {
  var themingEnabled = typeof stylesOrCreator === 'function';
  if (process.env.NODE_ENV !== 'production') {
    if (_typeof(stylesOrCreator) !== 'object' && !themingEnabled) {
      console.error(['MUI: The `styles` argument provided is invalid.', 'You need to provide a function generating the styles or a styles object.'].join('\n'));
    }
  }
  return {
    create: function create(theme, name) {
      var styles;
      try {
        styles = themingEnabled ? stylesOrCreator(theme) : stylesOrCreator;
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          if (themingEnabled === true && theme === noopTheme) {
            // TODO: prepend error message/name instead
            console.error(['MUI: The `styles` argument provided is invalid.', 'You are providing a function without a theme in the context.', 'One of the parent elements needs to use a ThemeProvider.'].join('\n'));
          }
        }
        throw err;
      }
      if (!name || !theme.components || !theme.components[name] || !theme.components[name].styleOverrides && !theme.components[name].variants) {
        return styles;
      }
      var overrides = theme.components[name].styleOverrides || {};
      var variants = theme.components[name].variants || [];
      var stylesWithOverrides = _extends({}, styles);
      Object.keys(overrides).forEach(function (key) {
        if (process.env.NODE_ENV !== 'production') {
          if (!stylesWithOverrides[key]) {
            console.warn(['MUI: You are trying to override a style that does not exist.', "Fix the `".concat(key, "` key of `theme.components.").concat(name, ".styleOverrides`."), '', "If you intentionally wanted to add a new key, please use the theme.components[".concat(name, "].variants option.")].join('\n'));
          }
        }
        stylesWithOverrides[key] = deepmerge(stylesWithOverrides[key] || {}, overrides[key]);
      });
      variants.forEach(function (definition) {
        var classKey = propsToClassKey(definition.props);
        stylesWithOverrides[classKey] = deepmerge(stylesWithOverrides[classKey] || {}, definition.style);
      });
      return stylesWithOverrides;
    },
    options: {}
  };
}