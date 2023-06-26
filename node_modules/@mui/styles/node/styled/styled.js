"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = styled;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));
var _makeStyles = _interopRequireDefault(require("../makeStyles"));
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["name"],
  _excluded2 = ["children", "className", "clone", "component"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function omit(input, fields) {
  const output = {};
  Object.keys(input).forEach(prop => {
    if (fields.indexOf(prop) === -1) {
      output[prop] = input[prop];
    }
  });
  return output;
}

// styled-components's API removes the mapping between components and styles.
// Using components as a low-level styling construct can be simpler.
function styled(Component) {
  const componentCreator = (style, options = {}) => {
    const {
        name
      } = options,
      stylesOptions = (0, _objectWithoutPropertiesLoose2.default)(options, _excluded);
    if (process.env.NODE_ENV !== 'production' && Component === undefined) {
      throw new Error(['You are calling styled(Component)(style) with an undefined component.', 'You may have forgotten to import it.'].join('\n'));
    }
    let classNamePrefix = name;
    if (process.env.NODE_ENV !== 'production') {
      if (!name) {
        // Provide a better DX outside production.
        const displayName = (0, _utils.getDisplayName)(Component);
        if (displayName !== undefined) {
          classNamePrefix = displayName;
        }
      }
    }
    const stylesOrCreator = typeof style === 'function' ? theme => ({
      root: props => style((0, _extends2.default)({
        theme
      }, props))
    }) : {
      root: style
    };
    const useStyles = (0, _makeStyles.default)(stylesOrCreator, (0, _extends2.default)({
      Component,
      name: name || Component.displayName,
      classNamePrefix
    }, stylesOptions));
    let filterProps;
    let propTypes = {};
    if (style.filterProps) {
      filterProps = style.filterProps;
      delete style.filterProps;
    }

    /* eslint-disable react/forbid-foreign-prop-types */
    if (style.propTypes) {
      propTypes = style.propTypes;
      delete style.propTypes;
    }
    /* eslint-enable react/forbid-foreign-prop-types */

    const StyledComponent = /*#__PURE__*/React.forwardRef(function StyledComponent(props, ref) {
      const {
          children,
          className: classNameProp,
          clone,
          component: ComponentProp
        } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded2);
      const classes = useStyles(props);
      const className = (0, _clsx.default)(classes.root, classNameProp);
      let spread = other;
      if (filterProps) {
        spread = omit(spread, filterProps);
      }
      if (clone) {
        return /*#__PURE__*/React.cloneElement(children, (0, _extends2.default)({
          className: (0, _clsx.default)(children.props.className, className)
        }, spread));
      }
      if (typeof children === 'function') {
        return children((0, _extends2.default)({
          className
        }, spread));
      }
      const FinalComponent = ComponentProp || Component;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(FinalComponent, (0, _extends2.default)({
        ref: ref,
        className: className
      }, spread, {
        children: children
      }));
    });
    process.env.NODE_ENV !== "production" ? StyledComponent.propTypes = (0, _extends2.default)({
      /**
       * A render function or node.
       */
      children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
      /**
       * @ignore
       */
      className: _propTypes.default.string,
      /**
       * If `true`, the component will recycle it's children HTML element.
       * It's using `React.cloneElement` internally.
       *
       * This prop will be deprecated and removed in v5
       */
      clone: (0, _utils.chainPropTypes)(_propTypes.default.bool, props => {
        if (props.clone && props.component) {
          return new Error('You can not use the clone and component prop at the same time.');
        }
        return null;
      }),
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: _propTypes.default /* @typescript-to-proptypes-ignore */.elementType
    }, propTypes) : void 0;
    if (process.env.NODE_ENV !== 'production') {
      StyledComponent.displayName = `Styled(${classNamePrefix})`;
    }
    (0, _hoistNonReactStatics.default)(StyledComponent, Component);
    return StyledComponent;
  };
  return componentCreator;
}