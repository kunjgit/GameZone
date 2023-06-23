"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _utils = require("./utils");
const _excluded = ["className", "cssModule", "type", "bsSize", "valid", "invalid", "tag", "addon", "plaintext", "innerRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const propTypes = {
  children: _propTypes.default.node,
  type: _propTypes.default.string,
  size: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  bsSize: _propTypes.default.string,
  valid: _propTypes.default.bool,
  invalid: _propTypes.default.bool,
  tag: _utils.tagPropType,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func, _propTypes.default.string]),
  plaintext: _propTypes.default.bool,
  addon: _propTypes.default.bool,
  className: _propTypes.default.string,
  cssModule: _propTypes.default.object
};
class Input extends _react.default.Component {
  constructor(props) {
    super(props);
    this.getRef = this.getRef.bind(this);
    this.focus = this.focus.bind(this);
  }
  getRef(ref) {
    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
    this.ref = ref;
  }
  focus() {
    if (this.ref) {
      this.ref.focus();
    }
  }
  render() {
    let _this$props = this.props,
      {
        className,
        cssModule,
        type = 'text',
        bsSize,
        valid,
        invalid,
        tag,
        addon,
        plaintext,
        innerRef
      } = _this$props,
      attributes = _objectWithoutProperties(_this$props, _excluded);
    const checkInput = ['switch', 'radio', 'checkbox'].indexOf(type) > -1;
    const isNotaNumber = /\D/g;
    const textareaInput = type === 'textarea';
    const selectInput = type === 'select';
    const rangeInput = type === 'range';
    let Tag = tag || (selectInput || textareaInput ? type : 'input');
    let formControlClass = 'form-control';
    if (plaintext) {
      formControlClass = `${formControlClass}-plaintext`;
      Tag = tag || 'input';
    } else if (rangeInput) {
      formControlClass = 'form-range';
    } else if (selectInput) {
      formControlClass = 'form-select';
    } else if (checkInput) {
      if (addon) {
        formControlClass = null;
      } else {
        formControlClass = 'form-check-input';
      }
    }
    if (attributes.size && isNotaNumber.test(attributes.size)) {
      (0, _utils.warnOnce)('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
      bsSize = attributes.size;
      delete attributes.size;
    }
    const classes = (0, _utils.mapToCssModules)((0, _classnames.default)(className, invalid && 'is-invalid', valid && 'is-valid', bsSize ? selectInput ? `form-select-${bsSize}` : `form-control-${bsSize}` : false, formControlClass), cssModule);
    if (Tag === 'input' || tag && typeof tag === 'function') {
      attributes.type = type === 'switch' ? 'checkbox' : type;
    }
    if (attributes.children && !(plaintext || type === 'select' || typeof Tag !== 'string' || Tag === 'select')) {
      (0, _utils.warnOnce)(`Input with a type of "${type}" cannot have children. Please use "value"/"defaultValue" instead.`);
      delete attributes.children;
    }
    return /*#__PURE__*/_react.default.createElement(Tag, _extends({}, attributes, {
      ref: innerRef,
      className: classes,
      "aria-invalid": invalid
    }));
  }
}
Input.propTypes = propTypes;
var _default = Input;
exports.default = _default;