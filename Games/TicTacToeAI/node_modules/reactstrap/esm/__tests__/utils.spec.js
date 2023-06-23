function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import * as Utils from '../utils';
describe('Utils', function () {
  describe('mapToCssModules', function () {
    describe('without css module', function () {
      it('should return a string', function () {
        expect(Utils.mapToCssModules('btn btn-primary')).toEqual(expect.any(String));
      });
      it('should return the classnames it was given, unchanged', function () {
        expect(Utils.mapToCssModules('btn btn-primary')).toBe('btn btn-primary');
      });
    });
    describe('with css module', function () {
      it('should return a string', function () {
        var cssModule = {
          btn: 'a1',
          'btn-success': 'b1',
          'btn-primary': 'c2'
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toEqual(expect.any(String));
      });
      it('should return the mapped classnames', function () {
        var cssModule = {
          btn: 'a1',
          'btn-success': 'b1',
          'btn-primary': 'c2'
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toBe('a1 c2');
      });
      it('should return the original classname when it is not in the map', function () {
        var cssModule = {
          btn: 'a1',
          'btn-success': 'b1'
        };
        expect(Utils.mapToCssModules('btn btn-primary', cssModule)).toBe('a1 btn-primary');
      });
    });
  });
  describe('omit', function () {
    it('should omit keys', function () {
      var input = {
        hello: 'world',
        speed: 'fast',
        size: 'small'
      };
      expect(Utils.omit(input, ['hello'])).toEqual({
        speed: 'fast',
        size: 'small'
      });
    });
    it('should not alter source object', function () {
      var input = {
        hello: 'world',
        speed: 'fast',
        size: 'small'
      };
      expect(Utils.omit(input, ['hello'])).toEqual({
        speed: 'fast',
        size: 'small'
      });
      expect(input).toEqual({
        hello: 'world',
        speed: 'fast',
        size: 'small'
      });
    });
    it('should ignore non-existing keys', function () {
      var input = {
        hello: 'world',
        speed: 'fast',
        size: 'small'
      };
      expect(Utils.omit(input, ['non-existing', 'hello'])).toEqual({
        speed: 'fast',
        size: 'small'
      });
    });
    it('should return a new object', function () {
      var input = {
        hello: 'world'
      };
      // toBe tests equality using `===` and so will test if it's not the same object.
      expect(Utils.omit(input, [])).not.toBe(input);
    });
  });
  describe('DOMElement', function () {
    it('should not return an error when the prop is an instance of an Element', function () {
      var props = {
        dom: document.createElement('div')
      };
      var propName = 'dom';
      var componentName = 'ComponentName';
      expect(Utils.DOMElement(props, propName, componentName)).toBeUndefined();
    });
    it('should return an error when the prop is NOT an instance of an Element', function () {
      var props = {
        dom: 'not an Element'
      };
      var propName = 'dom';
      var componentName = 'ComponentName';
      expect(Utils.DOMElement(props, propName, componentName)).toEqual(new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Expected prop to be an instance of Element. Validation failed.'));
    });
  });
  describe('getTarget', function () {
    it('should return the result of target if target is a function', function () {
      var data = {};
      var spy = jest.fn(function () {
        return data;
      });
      expect(Utils.getTarget(spy)).toEqual(data);
      expect(spy).toHaveBeenCalled();
    });
    it('should return all matching elements if allElement param is true', function () {
      var element = document.createElement('div');
      element.innerHTML = "<span class='example'>span 1</span>\n       <span class='example'>span 2</span>";
      document.body.appendChild(element);
      jest.spyOn(document, 'querySelectorAll');
      var elements = Utils.getTarget('.example', true);
      expect(elements.length).toEqual(2);
      expect(elements[1].textContent).toEqual('span 2');
      expect(document.querySelectorAll).toHaveBeenCalledWith('.example');
      document.querySelectorAll.mockRestore();
    });
    it('should return elements as array like object if allElement param is true', function () {
      var data = {};
      var spy = jest.fn(function () {
        return data;
      });
      var elements = Utils.getTarget(spy, true);
      expect(elements).toHaveProperty('length');
      expect(elements).toContain(data);
      expect(spy).toHaveBeenCalled();
    });
    it('should query the document for the target if the target is a string', function () {
      var element = document.createElement('div');
      element.className = 'thing';
      document.body.appendChild(element);
      jest.spyOn(document, 'querySelectorAll');
      expect(Utils.getTarget('.thing')).toEqual(element);
      expect(document.querySelectorAll).toHaveBeenCalledWith('.thing');
      document.querySelectorAll.mockRestore();
    });
    it('should query the document for the id target if the target is a string and could not be found normally', function () {
      var element = document.createElement('div');
      element.setAttribute('id', 'thing');
      document.body.appendChild(element);
      jest.spyOn(document, 'querySelectorAll');
      expect(Utils.getTarget('thing')).toEqual(element);
      expect(document.querySelectorAll).toHaveBeenCalledWith('#thing');
      document.querySelectorAll.mockRestore();
    });
    it('should return the input target if it is not a function nor a string', function () {
      var target = {};
      expect(Utils.getTarget(target)).toEqual(target);
    });
    it('should not return an error when the target could be identified', function () {
      var element = document.createElement('div');
      element.className = 'thing';
      document.body.appendChild(element);
      jest.spyOn(document, 'querySelector');
      expect(function () {
        Utils.getTarget('.thing');
      }).not.toThrow();
    });
    it('should return an error when the target could not be identified', function () {
      var target = 'not a target';
      expect(function () {
        Utils.getTarget(target);
      }).toThrow("The target '".concat(target, "' could not be identified in the dom, tip: check spelling"));
    });
    it('should return the value of the `current` object if it is a react Ref object', function () {
      var target = {
        current: {
          name: 'hello'
        }
      };
      expect(Utils.getTarget(target)).toEqual(target.current);
    });
    it('should return null if the `current` property of the target is null', function () {
      var target = {
        current: null
      };
      expect(Utils.getTarget(target)).toBeNull();
      expect(Utils.getTarget(target, true)).toStrictEqual([]);
    });
  });
  describe('setGlobalCssModule', function () {
    it('should return the mapped classnames', function () {
      var globalCssModule = {
        btn: 'a1',
        'btn-success': 'b1',
        'btn-primary': 'c2'
      };
      Utils.setGlobalCssModule(globalCssModule);
      expect(Utils.mapToCssModules('btn btn-primary')).toBe('a1 c2');
    });
  });
  describe('isFunction', function () {
    it('should return `true` for functions', function () {
      function test() {}
      expect(Utils.isFunction(test)).toBe(true);
      expect(Utils.isFunction(Array.prototype.slice)).toBe(true);
    });
    it('should return `true` for async functions', function () {
      function asyncFunc() {
        return _asyncFunc.apply(this, arguments);
      }
      function _asyncFunc() {
        _asyncFunc = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));
        return _asyncFunc.apply(this, arguments);
      }
      expect(Utils.isFunction(asyncFunc)).toEqual(typeof asyncFunc === 'function');
    });
    it('should return `true` for generator functions', function () {
      var _marked = /*#__PURE__*/_regeneratorRuntime().mark(genFunc);
      function genFunc() {
        return _regeneratorRuntime().wrap(function genFunc$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _marked);
      }
      expect(Utils.isFunction(genFunc)).toEqual(typeof genFunc === 'function');
    });
    it('should return `false` for non-functions', function () {
      function toArgs(array) {
        return function () {
          return arguments;
        }.apply(undefined, array);
      }
      expect(Utils.isFunction(toArgs([1, 2, 3]))).toBe(false);
      expect(Utils.isFunction([1, 2, 3])).toBe(false);
      expect(Utils.isFunction(true)).toBe(false);
      expect(Utils.isFunction(new Date())).toBe(false);
      expect(Utils.isFunction(new Error())).toBe(false);
      expect(Utils.isFunction({
        a: 1
      })).toBe(false);
      expect(Utils.isFunction(1)).toBe(false);
      expect(Utils.isFunction(/x/)).toBe(false);
      expect(Utils.isFunction('a')).toBe(false);
      expect(Utils.isFunction(Symbol('a'))).toBe(false);
      //
      if (document) {
        expect(Utils.isFunction(document.getElementsByTagName('body'))).toBe(false);
      }
    });
  });
  describe('isObject', function () {
    it('should return `true` for objects', function () {
      expect(Utils.isObject([1, 2, 3])).toBe(true);
      expect(Utils.isObject(Object(false))).toBe(true);
      expect(Utils.isObject(new Date())).toBe(true);
      expect(Utils.isObject(new Error())).toBe(true);
      expect(Utils.isObject({
        a: 1
      })).toBe(true);
      expect(Utils.isObject({
        a: 1
      })).toBe(true);
      expect(Utils.isObject(Object(0))).toBe(true);
      expect(Utils.isObject(/x/)).toBe(true);
      expect(Utils.isObject(Object('a'))).toBe(true);
      if (document) {
        expect(Utils.isObject(document.body)).toBe(true);
      }
    });
    it('should return `false` for non-objects', function () {
      expect(Utils.isObject(0)).toBe(false);
      expect(Utils.isObject(false)).toBe(false);
      expect(Utils.isObject(1)).toBe(false);
    });
  });
  describe('toNumber', function () {
    it('should return number', function () {
      expect(Utils.toNumber('5')).toEqual(5);
      expect(Utils.toNumber('5.0')).toEqual(5);
      expect(Utils.toNumber('1.1')).toEqual(1.1);
      expect(Utils.toNumber('-1.1')).toEqual(-1.1);
      expect(Utils.toNumber(0 / 0)).toEqual(NaN);
      expect(Utils.toNumber(0)).toEqual(0);
    });
  });

  // TODO
  // describe('getScrollbarWidth', () => {
  //   // jsdom workaround https://github.com/tmpvar/jsdom/issues/135#issuecomment-68191941
  //   Object.defineProperties(window.HTMLElement.prototype, {
  //     offsetLeft: {
  //       get: function () { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
  //     },
  //     offsetTop: {
  //       get: function () { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
  //     },
  //     offsetHeight: {
  //       get: function () { return parseFloat(window.getComputedStyle(this).height) || 0; }
  //     },
  //     offsetWidth: {
  //       get: function () { return parseFloat(window.getComputedStyle(this).width) || 0; }
  //     }
  //   });
  //
  //   it('should return scrollbarWidth', () => {
  //     expect(Utils.getScrollbarWidth()).toBe();
  //   });
  // });

  // TODO verify setScrollbarWidth is called with values when body overflows
  // it('should conditionallyUpdateScrollbar when isBodyOverflowing is true', () => {
  //   const stubbedSetScrollbarWidth = jest.fn().and.callThrough();
  //   const prevClientWidth = document.body.clientWidth;
  //   const prevWindowInnerWidth = window.innerWidth;
  //   document.body.clientWidth = 100;
  //   window.innerWidth = 500;
  //
  //   conditionallyUpdateScrollbar();
  //   expect(stubbedSetScrollbarWidth).toHaveBeenCalled();
  //
  //   document.body.clientWidth = prevClientWidth;
  //   window.innerWidth = prevWindowInnerWidth;
  // });
});