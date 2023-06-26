import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as React from 'react';
import PropTypes from 'prop-types';
import { exactProp } from '@mui/utils';
import { create } from 'jss';
import createGenerateClassName from '../createGenerateClassName';
import jssPreset from '../jssPreset';

// Default JSS instance.
import { jsx as _jsx } from "react/jsx-runtime";
var defaultJSS = create(jssPreset());

// Use a singleton or the provided one by the context.
//
// The counter-based approach doesn't tolerate any mistake.
// It's much safer to use the same counter everywhere.
var defaultGenerateClassName = createGenerateClassName();
var defaultSheetsManager = new Map();
// Exported for test purposes
export { defaultSheetsManager as sheetsManager };
var defaultOptions = {
  disableGeneration: false,
  generateClassName: defaultGenerateClassName,
  jss: defaultJSS,
  sheetsCache: null,
  sheetsManager: defaultSheetsManager,
  sheetsRegistry: null
};
export var StylesContext = /*#__PURE__*/React.createContext(defaultOptions);
if (process.env.NODE_ENV !== 'production') {
  StylesContext.displayName = 'StylesContext';
}
var injectFirstNode;
export default function StylesProvider(props) {
  var children = props.children,
    _props$injectFirst = props.injectFirst,
    injectFirst = _props$injectFirst === void 0 ? false : _props$injectFirst,
    _props$disableGenerat = props.disableGeneration,
    disableGeneration = _props$disableGenerat === void 0 ? false : _props$disableGenerat,
    localOptions = _objectWithoutProperties(props, ["children", "injectFirst", "disableGeneration"]);
  var outerOptions = React.useContext(StylesContext);
  var _outerOptions$localOp = _extends({}, outerOptions, localOptions),
    generateClassName = _outerOptions$localOp.generateClassName,
    jss = _outerOptions$localOp.jss,
    serverGenerateClassName = _outerOptions$localOp.serverGenerateClassName,
    sheetsCache = _outerOptions$localOp.sheetsCache,
    sheetsManager = _outerOptions$localOp.sheetsManager,
    sheetsRegistry = _outerOptions$localOp.sheetsRegistry;
  if (process.env.NODE_ENV !== 'production') {
    if (injectFirst && localOptions.jss) {
      console.error('MUI: You cannot use the jss and injectFirst props at the same time.');
    }
  }
  var value = React.useMemo(function () {
    var context = {
      disableGeneration: disableGeneration,
      generateClassName: generateClassName,
      jss: jss,
      serverGenerateClassName: serverGenerateClassName,
      sheetsCache: sheetsCache,
      sheetsManager: sheetsManager,
      sheetsRegistry: sheetsRegistry
    };
    if (process.env.NODE_ENV !== 'production') {
      if (typeof window === 'undefined' && !context.sheetsManager) {
        console.error('MUI: You need to use the ServerStyleSheets API when rendering on the server.');
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      if (context.jss.options.insertionPoint && injectFirst) {
        console.error('MUI: You cannot use a custom insertionPoint and <StylesContext injectFirst> at the same time.');
      }
    }
    if (!context.jss.options.insertionPoint && injectFirst && typeof window !== 'undefined') {
      if (!injectFirstNode) {
        var head = document.head;
        injectFirstNode = document.createComment('mui-inject-first');
        head.insertBefore(injectFirstNode, head.firstChild);
      }
      context.jss = create({
        plugins: jssPreset().plugins,
        insertionPoint: injectFirstNode
      });
    }
    return context;
  }, [injectFirst, disableGeneration, generateClassName, jss, serverGenerateClassName, sheetsCache, sheetsManager, sheetsRegistry]);
  return /*#__PURE__*/_jsx(StylesContext.Provider, {
    value: value,
    children: children
  });
}
process.env.NODE_ENV !== "production" ? StylesProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: PropTypes.node,
  /**
   * You can disable the generation of the styles with this option.
   * It can be useful when traversing the React tree outside of the HTML
   * rendering step on the server.
   * Let's say you are using react-apollo to extract all
   * the queries made by the interface server-side - you can significantly speed up the traversal with this prop.
   */
  disableGeneration: PropTypes.bool,
  /**
   * JSS's class name generator.
   */
  generateClassName: PropTypes.func,
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override MUI's styles, set this prop.
   */
  injectFirst: PropTypes.bool,
  /**
   * JSS's instance.
   */
  jss: PropTypes.object,
  /**
   * @ignore
   */
  serverGenerateClassName: PropTypes.func,
  /**
   * @ignore
   *
   * Beta feature.
   *
   * Cache for the sheets.
   */
  sheetsCache: PropTypes.object,
  /**
   * @ignore
   *
   * The sheetsManager is used to deduplicate style sheet injection in the page.
   * It's deduplicating using the (theme, styles) couple.
   * On the server, you should provide a new instance for each request.
   */
  sheetsManager: PropTypes.object,
  /**
   * @ignore
   *
   * Collect the sheets.
   */
  sheetsRegistry: PropTypes.object
} : void 0;
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV !== "production" ? StylesProvider.propTypes = exactProp(StylesProvider.propTypes) : void 0;
}