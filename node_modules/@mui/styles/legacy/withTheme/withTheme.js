import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getDisplayName } from '@mui/utils';
import useTheme from '../useTheme';
import { jsx as _jsx } from "react/jsx-runtime";
export function withThemeCreator() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultTheme = options.defaultTheme;
  var withTheme = function withTheme(Component) {
    if (process.env.NODE_ENV !== 'production') {
      if (Component === undefined) {
        throw new Error(['You are calling withTheme(Component) with an undefined component.', 'You may have forgotten to import it.'].join('\n'));
      }
    }
    var WithTheme = /*#__PURE__*/React.forwardRef(function WithTheme(props, ref) {
      var theme = useTheme() || defaultTheme;
      return /*#__PURE__*/_jsx(Component, _extends({
        theme: theme,
        ref: ref
      }, props));
    });
    if (process.env.NODE_ENV !== 'production') {
      WithTheme.displayName = "WithTheme(".concat(getDisplayName(Component), ")");
    }
    hoistNonReactStatics(WithTheme, Component);
    if (process.env.NODE_ENV !== 'production') {
      // Exposed for test purposes.
      WithTheme.Naked = Component;
    }
    return WithTheme;
  };
  return withTheme;
}

// Provide the theme object as a prop to the input component.
// It's an alternative API to useTheme().
// We encourage the usage of useTheme() where possible.
var withTheme = withThemeCreator();
export default withTheme;