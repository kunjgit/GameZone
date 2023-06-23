"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boundMethod = boundMethod;
exports.boundClass = boundClass;
exports.default = autobind;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
function boundMethod(target, key, descriptor) {
  var fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new TypeError("@boundMethod decorator can only be applied to methods not: ".concat(_typeof(fn)));
  } // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.


  var definingProperty = false;
  return {
    configurable: true,
    get: function get() {
      // eslint-disable-next-line no-prototype-builtins
      if (definingProperty || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') {
        return fn;
      }

      var boundFn = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get: function get() {
          return boundFn;
        },
        set: function set(value) {
          fn = value;
          delete this[key];
        }
      });
      definingProperty = false;
      return boundFn;
    },
    set: function set(value) {
      fn = value;
    }
  };
}
/**
 * Use boundMethod to bind all methods on the target.prototype
 */


function boundClass(target) {
  // (Using reflect to get all keys including symbols)
  var keys; // Use Reflect if exists

  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype); // Use symbols if support is provided

    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach(function (key) {
    // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key); // Only methods need binding

    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

function autobind() {
  if (arguments.length === 1) {
    return boundClass.apply(void 0, arguments);
  }

  return boundMethod.apply(void 0, arguments);
}