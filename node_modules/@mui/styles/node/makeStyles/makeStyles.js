"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeStyles;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _jss = require("jss");
var _mergeClasses = _interopRequireDefault(require("../mergeClasses"));
var _multiKeyStore = _interopRequireDefault(require("./multiKeyStore"));
var _useTheme = _interopRequireDefault(require("../useTheme"));
var _StylesProvider = require("../StylesProvider");
var _indexCounter = require("./indexCounter");
var _getStylesCreator = _interopRequireDefault(require("../getStylesCreator"));
var _noopTheme = _interopRequireDefault(require("../getStylesCreator/noopTheme"));
const _excluded = ["name", "classNamePrefix", "Component", "defaultTheme"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function getClasses({
  state,
  stylesOptions
}, classes, Component) {
  if (stylesOptions.disableGeneration) {
    return classes || {};
  }
  if (!state.cacheClasses) {
    state.cacheClasses = {
      // Cache for the finalized classes value.
      value: null,
      // Cache for the last used classes prop pointer.
      lastProp: null,
      // Cache for the last used rendered classes pointer.
      lastJSS: {}
    };
  }

  // Tracks if either the rendered classes or classes prop has changed,
  // requiring the generation of a new finalized classes object.
  let generate = false;
  if (state.classes !== state.cacheClasses.lastJSS) {
    state.cacheClasses.lastJSS = state.classes;
    generate = true;
  }
  if (classes !== state.cacheClasses.lastProp) {
    state.cacheClasses.lastProp = classes;
    generate = true;
  }
  if (generate) {
    state.cacheClasses.value = (0, _mergeClasses.default)({
      baseClasses: state.cacheClasses.lastJSS,
      newClasses: classes,
      Component
    });
  }
  return state.cacheClasses.value;
}
function attach({
  state,
  theme,
  stylesOptions,
  stylesCreator,
  name
}, props) {
  if (stylesOptions.disableGeneration) {
    return;
  }
  let sheetManager = _multiKeyStore.default.get(stylesOptions.sheetsManager, stylesCreator, theme);
  if (!sheetManager) {
    sheetManager = {
      refs: 0,
      staticSheet: null,
      dynamicStyles: null
    };
    _multiKeyStore.default.set(stylesOptions.sheetsManager, stylesCreator, theme, sheetManager);
  }
  const options = (0, _extends2.default)({}, stylesCreator.options, stylesOptions, {
    theme,
    flip: typeof stylesOptions.flip === 'boolean' ? stylesOptions.flip : theme.direction === 'rtl'
  });
  options.generateId = options.serverGenerateClassName || options.generateClassName;
  const sheetsRegistry = stylesOptions.sheetsRegistry;
  if (sheetManager.refs === 0) {
    let staticSheet;
    if (stylesOptions.sheetsCache) {
      staticSheet = _multiKeyStore.default.get(stylesOptions.sheetsCache, stylesCreator, theme);
    }
    const styles = stylesCreator.create(theme, name);
    if (!staticSheet) {
      staticSheet = stylesOptions.jss.createStyleSheet(styles, (0, _extends2.default)({
        link: false
      }, options));
      staticSheet.attach();
      if (stylesOptions.sheetsCache) {
        _multiKeyStore.default.set(stylesOptions.sheetsCache, stylesCreator, theme, staticSheet);
      }
    }
    if (sheetsRegistry) {
      sheetsRegistry.add(staticSheet);
    }
    sheetManager.staticSheet = staticSheet;
    sheetManager.dynamicStyles = (0, _jss.getDynamicStyles)(styles);
  }
  if (sheetManager.dynamicStyles) {
    const dynamicSheet = stylesOptions.jss.createStyleSheet(sheetManager.dynamicStyles, (0, _extends2.default)({
      link: true
    }, options));
    dynamicSheet.update(props);
    dynamicSheet.attach();
    state.dynamicSheet = dynamicSheet;
    state.classes = (0, _mergeClasses.default)({
      baseClasses: sheetManager.staticSheet.classes,
      newClasses: dynamicSheet.classes
    });
    if (sheetsRegistry) {
      sheetsRegistry.add(dynamicSheet);
    }
  } else {
    state.classes = sheetManager.staticSheet.classes;
  }
  sheetManager.refs += 1;
}
function update({
  state
}, props) {
  if (state.dynamicSheet) {
    state.dynamicSheet.update(props);
  }
}
function detach({
  state,
  theme,
  stylesOptions,
  stylesCreator
}) {
  if (stylesOptions.disableGeneration) {
    return;
  }
  const sheetManager = _multiKeyStore.default.get(stylesOptions.sheetsManager, stylesCreator, theme);
  sheetManager.refs -= 1;
  const sheetsRegistry = stylesOptions.sheetsRegistry;
  if (sheetManager.refs === 0) {
    _multiKeyStore.default.delete(stylesOptions.sheetsManager, stylesCreator, theme);
    stylesOptions.jss.removeStyleSheet(sheetManager.staticSheet);
    if (sheetsRegistry) {
      sheetsRegistry.remove(sheetManager.staticSheet);
    }
  }
  if (state.dynamicSheet) {
    stylesOptions.jss.removeStyleSheet(state.dynamicSheet);
    if (sheetsRegistry) {
      sheetsRegistry.remove(state.dynamicSheet);
    }
  }
}
function useSynchronousEffect(func, values) {
  const key = React.useRef([]);
  let output;

  // Store "generation" key. Just returns a new object every time
  const currentKey = React.useMemo(() => ({}), values); // eslint-disable-line react-hooks/exhaustive-deps

  // "the first render", or "memo dropped the value"
  if (key.current !== currentKey) {
    key.current = currentKey;
    output = func();
  }
  React.useEffect(() => () => {
    if (output) {
      output();
    }
  }, [currentKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
}

function makeStyles(stylesOrCreator, options = {}) {
  const {
      // alias for classNamePrefix, if provided will listen to theme (required for theme.components[name].styleOverrides)
      name,
      // Help with debuggability.
      classNamePrefix: classNamePrefixOption,
      Component,
      defaultTheme = _noopTheme.default
    } = options,
    stylesOptions2 = (0, _objectWithoutPropertiesLoose2.default)(options, _excluded);
  const stylesCreator = (0, _getStylesCreator.default)(stylesOrCreator);
  const classNamePrefix = name || classNamePrefixOption || 'makeStyles';
  stylesCreator.options = {
    index: (0, _indexCounter.increment)(),
    name,
    meta: classNamePrefix,
    classNamePrefix
  };
  const useStyles = (props = {}) => {
    const theme = (0, _useTheme.default)() || defaultTheme;
    const stylesOptions = (0, _extends2.default)({}, React.useContext(_StylesProvider.StylesContext), stylesOptions2);
    const instance = React.useRef();
    const shouldUpdate = React.useRef();
    useSynchronousEffect(() => {
      const current = {
        name,
        state: {},
        stylesCreator,
        stylesOptions,
        theme
      };
      attach(current, props);
      shouldUpdate.current = false;
      instance.current = current;
      return () => {
        detach(current);
      };
    }, [theme, stylesCreator]);
    React.useEffect(() => {
      if (shouldUpdate.current) {
        update(instance.current, props);
      }
      shouldUpdate.current = true;
    });
    const classes = getClasses(instance.current, props.classes, Component);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useDebugValue(classes);
    }
    if (process.env.NODE_ENV !== 'production') {
      const supportedComponents = ['MuiAvatar', 'MuiBadge', 'MuiButton', 'MuiButtonGroup', 'MuiChip', 'MuiDivider', 'MuiFab', 'MuiPaper', 'MuiToolbar', 'MuiTypography', 'MuiAlert', 'MuiPagination', 'MuiPaginationItem', 'MuiSkeleton', 'MuiTimelineDot'];
      if (name && supportedComponents.indexOf(name) >= 0 && props.variant && !classes[props.variant]) {
        console.error([`MUI: You are using a variant value \`${props.variant}\` for which you didn't define styles.`, `Please create a new variant matcher in your theme for this variant. To learn more about matchers visit https://mui.com/r/custom-component-variants.`].join('\n'));
      }
    }
    return classes;
  };
  return useStyles;
}