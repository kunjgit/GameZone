import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getDisplayName } from '@mui/utils';
import useTheme from '../useTheme';
import { jsx as _jsx } from "react/jsx-runtime";
export function withThemeCreator(options = {}) {
  const {
    defaultTheme
  } = options;
  const withTheme = Component => {
    if (process.env.NODE_ENV !== 'production') {
      if (Component === undefined) {
        throw new Error(['You are calling withTheme(Component) with an undefined component.', 'You may have forgotten to import it.'].join('\n'));
      }
    }
    const WithTheme = /*#__PURE__*/React.forwardRef(function WithTheme(props, ref) {
      const theme = useTheme() || defaultTheme;
      return /*#__PURE__*/_jsx(Component, _extends({
        theme: theme,
        ref: ref
      }, props));
    });
    if (process.env.NODE_ENV !== 'production') {
      WithTheme.displayName = `WithTheme(${getDisplayName(Component)})`;
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
const withTheme = withThemeCreator();
export default withTheme;