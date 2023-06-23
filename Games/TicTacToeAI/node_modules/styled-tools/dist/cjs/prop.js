"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Returns the value of `props[path]` or `defaultValue`
 * @example
 * import styled from "styled-components";
 * import { prop } from "styled-tools";
 *
 * const Button = styled.button`
 *   color: ${prop("color", "red")};
 * `;
 */
var prop = function prop(path, defaultValue) {
  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof props[path] !== "undefined") {
      return props[path];
    }

    if (path && path.indexOf(".") > 0) {
      var paths = path.split(".");
      var length = paths.length;
      var object = props[paths[0]];
      var index = 1;

      while (object != null && index < length) {
        object = object[paths[index]];
        index += 1;
      }

      if (typeof object !== "undefined") {
        return object;
      }
    }

    return defaultValue;
  };
};

var _default = prop;
exports.default = _default;