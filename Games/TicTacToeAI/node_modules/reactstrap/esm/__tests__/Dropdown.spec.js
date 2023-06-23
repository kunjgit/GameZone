function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Popper, Reference } from 'react-popper';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '..';
import { keyCodes } from '../utils';
import { testForChildrenInComponent } from '../testUtils';
describe('Dropdown', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.restoreAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  function imitateDropdownFocus(toggle) {
    // this is needed to make the focus on the correct element
    // by following the default user behaviour
    // needed in particular for keyboard based tests
    // setting focus on the toggle element with code
    // is causing tab to cycle through elements.
    var _render = render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle,
        "data-testid": "drpdwn"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "First item"), /*#__PURE__*/React.createElement(DropdownItem, null, "Second item"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      })))),
      rerender = _render.rerender;
    user.click(screen.getByText('Toggle'));
    toggle.mockClear();
    rerender( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true,
      toggle: toggle,
      "data-testid": "drpdwn"
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "First item"), /*#__PURE__*/React.createElement(DropdownItem, null, "Second item"), /*#__PURE__*/React.createElement(DropdownItem, {
      id: "divider",
      divider: true
    }))));
    return {
      rerender: rerender
    };
  }
  it('should render a single child', function () {
    render( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true
    }, "Ello world"));
    expect(screen.getByText(/ello world/i)).toHaveClass('dropdown');
  });
  it('should render menu when isOpen is true', function () {
    render( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    expect(screen.getByText(/toggle/i)).toHaveClass('btn');
    expect(screen.getByText(/test/i)).toHaveClass('dropdown-item');
  });
  it('should not call props.toggle when disabled ', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true,
      toggle: toggle,
      disabled: true
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    user.click(screen.getByText(/toggle/i));
    expect(toggle).not.toHaveBeenCalled();
  });
  it('should call toggle when DropdownToggle is clicked ', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    user.click(screen.getByText(/toggle/i));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
  it('should call toggle when DropdownToggle with non string children is clicked ', function () {
    var toggle = jest.fn();
    render( /*#__PURE__*/React.createElement(Dropdown, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, /*#__PURE__*/React.createElement("div", null, "Toggle")), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    user.click(screen.getByText(/toggle/i));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
  describe('handleProps', function () {
    it('should not pass custom props to html attrs', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        a11y: true,
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      var dropdown = document.getElementsByClassName('dropdown')[0];
      expect(dropdown).not.toHaveAttribute('inNavbar');
      expect(dropdown).not.toHaveAttribute('toggle');
      expect(dropdown).not.toHaveAttribute('a11y');
      expect(dropdown).not.toHaveAttribute('isOpen');
    });
    it('should add event listeners when isOpen changed to true', function () {
      var addEventListener = jest.spyOn(document, 'addEventListener');
      var _render2 = render( /*#__PURE__*/React.createElement(Dropdown, {
          isOpen: false
        }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test")))),
        rerender = _render2.rerender;
      expect(addEventListener).not.toHaveBeenCalled();
      rerender( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));

      // called three times because we have click, touchstart and keyup
      expect(addEventListener).toHaveBeenCalledTimes(3);
    });
    it('should not be called on componentDidUpdate when isOpen did not change', function () {
      var addEventListener = jest.spyOn(document, 'addEventListener');
      var _render3 = render( /*#__PURE__*/React.createElement(Dropdown, {
          isOpen: true
        }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test")))),
        rerender = _render3.rerender;
      expect(addEventListener).toHaveBeenCalled();
      addEventListener.mockClear();
      rerender( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        size: "lg"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      expect(addEventListener).not.toHaveBeenCalled();
    });
  });
  describe('removeEvents', function () {
    it('should remove event listeners on componentWillUnmount', function () {
      var removeEventListener = jest.spyOn(document, 'removeEventListener');
      var _render4 = render( /*#__PURE__*/React.createElement(Dropdown, {
          isOpen: true
        }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test")))),
        unmount = _render4.unmount;
      unmount();
      expect(removeEventListener).toHaveBeenCalled();
    });
  });
  describe('handleDocumentClick', function () {
    it('should call toggle on document click', function () {
      var toggle = jest.fn(function () {});
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      user.click(document.body);
      expect(toggle).toHaveBeenCalled();
    });
    it('should call toggle on container click', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle,
        "data-testid": "dropdown"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      user.click(screen.getByTestId('dropdown'));
      expect(toggle).toHaveBeenCalled();
    });
    it('should call toggle on container click', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle,
        "data-testid": "dropdown"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, /*#__PURE__*/React.createElement("div", null, "Toggle")), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      user.click(screen.getByTestId('dropdown'));
      expect(toggle).toHaveBeenCalled();
    });
    it('should not call toggle on inner container click', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      user.click(document.getElementById('divider'));
      expect(toggle).not.toHaveBeenCalled();
    });
    it('should not call toggle when right-clicked', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle,
        "data-testid": "dropdown"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      user.click(screen.getByTestId('dropdown'), {
        button: 2
      });
      expect(toggle).not.toHaveBeenCalled();
    });
    it('should go through first dropdown item and close when tab is pressed multiple times', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var toggle;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              toggle = jest.fn();
              imitateDropdownFocus(toggle);
              user.tab();
              expect(screen.getByText(/first item/i)).toHaveFocus();
              user.tab();
              expect(toggle).toHaveBeenCalledTimes(1);
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
  describe('keyboard events', function () {
    it('should call toggle on ESC keydown when it isOpen is true', function () {
      var toggle = jest.fn();
      imitateDropdownFocus(toggle);
      user.keyboard('{esc}');
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should call toggle on down arrow keydown when it isOpen is false', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should call toggle on up arrow keydown when it isOpen is false', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      user.keyboard('{arrowup}');
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should focus the first menuitem when toggle is triggered by enter keydown', function () {
      var toggle = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        header: true
      }, "Header"), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true
      }, "Disabled"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, null, "Another Test"))));
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      user.keyboard('{enter}');
      expect(toggle).toHaveBeenCalled();
      jest.runAllTimers();
      expect(focus).toHaveBeenCalled();
    });
    it('should focus the first menuitem when toggle is triggered by up arrow keydown', function () {
      var toggle = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        header: true
      }, "Header"), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true
      }, "Disabled"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, null, "Another Test"))));
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      user.keyboard('{arrowdown}');
      expect(toggle).toHaveBeenCalled();
      jest.runAllTimers();
      expect(focus).toHaveBeenCalled();
    });
    it('should focus the first menuitem when toggle is triggered by down arrow keydown', function () {
      var toggle = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        header: true
      }, "Header"), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true
      }, "Disabled"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, null, "Another Test"))));
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      user.keyboard('{arrowup}');
      expect(toggle).toHaveBeenCalled();
      jest.runAllTimers();
      expect(focus).toHaveBeenCalled();
      expect(screen.getByText('Test')).toHaveFocus();
    });
    it('should focus the next menuitem on down arrow keydown when isOpen is true', function () {
      var toggle = jest.fn();
      var focus = jest.fn();
      var focus2 = jest.fn();
      var _render5 = render( /*#__PURE__*/React.createElement(Dropdown, {
          isOpen: false,
          toggle: toggle
        }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
          header: true
        }, "Header"), /*#__PURE__*/React.createElement(DropdownItem, {
          disabled: true
        }, "Disabled"), /*#__PURE__*/React.createElement(DropdownItem, {
          onFocus: focus
        }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, null, "i am focused"), /*#__PURE__*/React.createElement(DropdownItem, {
          divider: true
        }), /*#__PURE__*/React.createElement(DropdownItem, null, "Another Test")))),
        rerender = _render5.rerender;
      user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      user.keyboard('{arrowup}');
      expect(toggle).toHaveBeenCalled();
      rerender( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        header: true
      }, "Header"), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true
      }, "Disabled"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "i am focused"), /*#__PURE__*/React.createElement(DropdownItem, {
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, null, "Another Test"))));
      jest.runAllTimers();
      expect(focus).toHaveBeenCalled();
      expect(screen.getByText('Test')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(focus2).toHaveBeenCalled();
      expect(screen.getByText('i am focused')).toHaveFocus();
    });
    it('should focus the next menuitem on ctrl + n keydown when isOpen is true', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      screen.getByText('Test1').focus();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{ctrl>}N');
      expect(screen.getByText('Test2')).toHaveFocus();
    });
    it('should focus the first menu item matching the character pressed when isOpen is true', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var focus3 = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Reactstrap"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "4"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus3
      }, " Lyfe"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Reactstrap')).toHaveFocus();
      focus1.mockClear();
      user.keyboard('4');
      expect(screen.getByText('4')).toHaveFocus();
      expect(focus1.mock.calls.length).toBe(0);
      expect(focus2.mock.calls.length).toBe(1);
      expect(focus3.mock.calls.length).toBe(0);
    });
    it('should skip non-menu items focus the next menu item on down arrow keydown when it isOpen is true and anther item is focused', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(screen.getByText('Test2')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
    });
    it('should focus the previous menu item on up arrow keydown when isOpen is true and another item is focused', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(screen.getByText('Test2')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
      user.keyboard('{arrowup}');
      expect(screen.getByText('Test1')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(2);
    });
    it('should focus the previous menuitem on ctrl + p keydown when isOpen is true and another item is focused', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      screen.getByText('Test1').focus();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
      expect(screen.getByText('Test2')).toHaveFocus();
      user.keyboard('{ctrl>}P');
      expect(screen.getByText('Test1')).toHaveFocus();
    });
    it('should wrap focus with down arrow keydown', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowdown}');
      expect(screen.getByText('Test2')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
      user.keyboard('{arrowdown}');
      expect(screen.getByText('Test1')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(2);
    });
    it('should wrap focus with up arrow keydown', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowup}');
      expect(screen.getByText('Test2')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
    });
    it('should focus the 1st item on home key keyDown', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var focus3 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus3
      }, "Test3"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{arrowdown}');
      user.keyboard('{arrowdown}');
      expect(screen.getByText('Test3')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(1);
      expect(focus3).toBeCalledTimes(1);
      user.keyboard('{home}');
      expect(screen.getByText('Test1')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(2);
    });
    it('should focus the last item on end key keyDown', function () {
      var focus1 = jest.fn();
      var focus2 = jest.fn();
      var focus3 = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onFocus: focus1
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus2
      }, "Test2"), /*#__PURE__*/React.createElement(DropdownItem, {
        onFocus: focus3
      }, "Test3"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{end}');
      expect(screen.getByText('Test3')).toHaveFocus();
      expect(toggle).not.toHaveBeenCalled();
      expect(focus1).toBeCalledTimes(1);
      expect(focus2).toBeCalledTimes(0);
      expect(focus3).toBeCalledTimes(1);
    });
    it('should trigger a click on links when an item is focused and space[bar] it pressed', function () {
      var click = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        end: true
      }, /*#__PURE__*/React.createElement(DropdownItem, {
        href: "#",
        id: "first",
        onClick: click
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "third"
      }, "Test"))));
      user.tab();
      user.tab();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{space}');
      expect(click).toHaveBeenCalled();
    });
    it('should trigger a click on buttons when an item is focused and space[bar] it pressed (override browser defaults for focus management)', function () {
      var toggle = jest.fn();
      var click = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first",
        onClick: click
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "third"
      }, "Test"))));
      screen.getByText('Test1').focus();
      expect(toggle).not.toHaveBeenCalled();
      expect(screen.getByText('Test1')).toHaveFocus();
      user.keyboard('{space}');
      expect(toggle).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
    });
    it('should not trigger anything when within an input', function () {
      var click = jest.fn();
      var focus = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        tag: "div",
        id: "first",
        onClick: click,
        onFocus: focus
      }, /*#__PURE__*/React.createElement("input", {
        id: "input",
        placeholder: "name"
      })), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "third"
      }, "Test"))));
      screen.getByPlaceholderText('name').focus();
      expect(screen.getByPlaceholderText(/name/i)).toHaveFocus();
      focus.mockClear();
      click.mockClear();
      user.keyboard('{arrowdown}');
      user.keyboard('{arrowup}');
      user.keyboard('{space}');
      expect(toggle).not.toHaveBeenCalled();
      expect(screen.getByPlaceholderText(/name/i)).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      expect(click).not.toHaveBeenCalled();
    });
    it('should not trigger anything when within a textarea', function () {
      var click = jest.fn();
      var focus = jest.fn();
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        tag: "div",
        id: "first",
        onClick: click,
        onFocus: focus
      }, /*#__PURE__*/React.createElement("textarea", {
        id: "input",
        placeholder: "placeholder"
      })), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "third"
      }, "Test"))));
      screen.getByPlaceholderText(/placeholder/i).focus();
      expect(screen.getByPlaceholderText(/placeholder/i)).toHaveFocus();
      focus.mockClear();
      click.mockClear();
      user.keyboard('{arrowdown}');
      user.keyboard('{arrowup}');
      user.keyboard('{space}');
      expect(toggle).not.toHaveBeenCalled();
      expect(screen.getByPlaceholderText(/placeholder/i)).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
      expect(click).not.toHaveBeenCalled();
    });
    it('should toggle when isOpen is true and tab keyDown on menuitem', function () {
      var toggle = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        id: "first"
      }, "First"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second",
        onFocus: focus
      }, "Second"))));
      screen.getByText(/first/i).focus();
      user.tab();
      expect(toggle).toHaveBeenCalledTimes(1);
    });
    it('should not trigger anything when disabled', function () {
      var toggle = jest.fn();
      var click = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle,
        disabled: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        tag: "div",
        id: "first",
        onClick: click,
        onFocus: focus
      }, "Test1"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "third"
      }, "Test"))));
      screen.getByText(/test1/i).focus();
      focus.mockClear();
      user.keyboard('{arrowdown}');
      user.keyboard('{arrowup}');
      user.keyboard('{space}');
      expect(toggle).not.toHaveBeenCalled();
      expect(click).not.toHaveBeenCalled();
      expect(focus).not.toHaveBeenCalled();
    });
    it('should not focus anything when all items disabled', function () {
      var toggle = jest.fn();
      var click = jest.fn();
      var focus = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true,
        tag: "div",
        id: "first",
        onClick: click,
        onFocus: focus
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true,
        id: "second"
      }, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }), /*#__PURE__*/React.createElement(DropdownItem, {
        disabled: true,
        id: "third"
      }, "Test"))));
      screen.getByText(/toggle/i).focus();
      user.keyboard('{arrowdown}');
      user.keyboard('{arrowup}');
      user.keyboard('{space}');
      expect(toggle).not.toHaveBeenCalled();
      expect(click).not.toHaveBeenCalled();
      expect(focus).not.toHaveBeenCalled();
    });
    it('should not call preventDefault when dropdown has focus and f5 key is pressed', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      expect(toggle).not.toHaveBeenCalled();
      var button = screen.getByText(/toggle/i);
      var keyEvent1 = createEvent.keyDown(button, {
        keyCode: 116
      });
      fireEvent(button, keyEvent1);
      expect(keyEvent1.defaultPrevented).toBe(false);
      var keyEvent2 = createEvent.keyDown(button, {
        keyCode: 16
      });
      fireEvent(button, keyEvent2);
      expect(keyEvent2.defaultPrevented).toBe(false);
    });
    it('should call preventDefault when dropdown has focus and any key(up, down, esc, enter, home, end or any alphanumeric key) is pressed', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(Dropdown, {
        isOpen: false,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      expect(toggle).not.toHaveBeenCalled();
      var button = screen.getByText(/toggle/i);
      [keyCodes.down, keyCodes.up, keyCodes.end, keyCodes.home, keyCodes.enter, 90,
      // for 'a'
      65 // for 'A'
      ].forEach(function (keyCode) {
        var keyEvent = createEvent.keyDown(button, {
          keyCode: keyCode
        });
        fireEvent(button, keyEvent);
        expect(keyEvent.defaultPrevented).toBe(true);
      });
    });
  });
  it('should render different size classes', function () {
    var _render6 = render( /*#__PURE__*/React.createElement(Dropdown, {
        group: true,
        isOpen: true,
        size: "sm"
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test")))),
      rerender = _render6.rerender;
    expect(screen.getByText(/toggle/i).parentElement).toHaveClass('btn-group-sm');
    rerender( /*#__PURE__*/React.createElement(Dropdown, {
      group: true,
      isOpen: true,
      size: "lg"
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    expect(screen.getByText(/toggle/i).parentElement).toHaveClass('btn-group-lg');
  });
  describe('Dropdown with nav', function () {
    it('should render a single child', function () {
      testForChildrenInComponent(Dropdown);
    });
    it('should render multiple children when isOpen', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        nav: true,
        isOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      expect(screen.getByText(/test/i)).toBeInTheDocument();
      expect(screen.getByText(/toggle/i)).toBeInTheDocument();
    });
  });
  describe('Dropdown in navbar', function () {
    it('should open without popper with inNavbar prop', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        nav: true,
        inNavbar: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        caret: true,
        nav: true
      }, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
      expect(screen.getByText(/toggle/i).tagName).toBe('A');
      expect(screen.getByText(/test/i).parentElement.tagName).toBe('DIV');
    });
  });
  describe('active', function () {
    it('should render an active class', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        active: true,
        nav: true
      }));
      expect(screen.getByRole('listitem')).toHaveClass('active');
    });
    it('should render an active class when a child DropdownItem is active IF setActiveFromChild is true', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        nav: true,
        inNavbar: true,
        setActiveFromChild: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        nav: true,
        caret: true
      }, "Options"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        active: true
      }, "Test"))));
      expect(screen.getByRole('listitem')).toHaveClass('active');
    });
  });
  it('should render with correct class when direction is set', function () {
    var _render7 = render( /*#__PURE__*/React.createElement(Dropdown, {
        direction: "up",
        nav: true
      })),
      rerender = _render7.rerender;
    expect(screen.getByRole('listitem')).toHaveClass('dropup');
    rerender( /*#__PURE__*/React.createElement(Dropdown, {
      direction: "start",
      nav: true
    }));
    expect(screen.getByRole('listitem')).toHaveClass('dropstart');
    rerender( /*#__PURE__*/React.createElement(Dropdown, {
      direction: "end",
      nav: true
    }));
    expect(screen.getByRole('listitem')).toHaveClass('dropend');
  });
  describe('menuRole prop', function () {
    it('should set correct roles for children when menuRole is menu', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        menuRole: "menu",
        isOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        nav: true,
        caret: true
      }, "Options"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        active: true
      }, "Test"))));
      expect(screen.getByText(/options/i)).toHaveAttribute('aria-haspopup', 'menu');
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
    it('should set correct roles for children when menuRole is menu', function () {
      render( /*#__PURE__*/React.createElement(Dropdown, {
        menuRole: "listbox",
        isOpen: true
      }, /*#__PURE__*/React.createElement(DropdownToggle, {
        nav: true,
        caret: true
      }, "Options"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, {
        active: true
      }, "Test"))));
      expect(screen.getByText(/options/i)).toHaveAttribute('aria-haspopup', 'listbox');
      expect(screen.getByRole('option')).toBeInTheDocument();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});