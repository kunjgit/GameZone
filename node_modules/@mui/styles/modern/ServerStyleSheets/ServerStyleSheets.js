import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { SheetsRegistry } from 'jss';
import StylesProvider from '../StylesProvider';
import createGenerateClassName from '../createGenerateClassName';
import { jsx as _jsx } from "react/jsx-runtime";
export default class ServerStyleSheets {
  constructor(options = {}) {
    this.options = options;
  }
  collect(children) {
    // This is needed in order to deduplicate the injection of CSS in the page.
    const sheetsManager = new Map();
    // This is needed in order to inject the critical CSS.
    this.sheetsRegistry = new SheetsRegistry();
    // A new class name generator
    const generateClassName = createGenerateClassName();
    return /*#__PURE__*/_jsx(StylesProvider, _extends({
      sheetsManager: sheetsManager,
      serverGenerateClassName: generateClassName,
      sheetsRegistry: this.sheetsRegistry
    }, this.options, {
      children: children
    }));
  }
  toString() {
    return this.sheetsRegistry ? this.sheetsRegistry.toString() : '';
  }
  getStyleElement(props) {
    return /*#__PURE__*/React.createElement('style', _extends({
      id: 'jss-server-side',
      key: 'jss-server-side',
      dangerouslySetInnerHTML: {
        __html: this.toString()
      }
    }, props));
  }
}