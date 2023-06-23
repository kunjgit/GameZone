function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function () {
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || typeof window.CustomEvent === 'function') return;
  var CustomEvent = function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  window.CustomEvent = CustomEvent;
})();
(function () {
  if (typeof Object.values === 'function') return;
  var values = function values(O) {
    return Object.keys(O).map(function (key) {
      return O[key];
    });
  };
  Object.values = values;
})();