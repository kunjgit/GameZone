Element.prototype.on = Element.prototype.addEventListener;
Element.prototype.off = Element.prototype.removeEventListener;
Element.prototype.index = function (child) {
  for(var i=0; i<this.children.length; i++) {
    if (child==this.children[i]) return i;
  }
  return 0;
};
EventTarget.prototype.trigger = EventTarget.prototype.dispatchEvent;
window.$ = function (q) {
  var items = document.querySelectorAll(q);
  return items.length === 1 ? items[0] : items;
};
window.toInt = window.parseInt;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame;
window.Matrix = window.WebKitCSSMatrix || window.MSCSSMatrix || window.CSSMatrix;
window.PI = Math.PI;
window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
window.body = document.body;

window.save = function (key,val) {
  window.localStorage.setItem(key,val);
};
window.retreive = function(key) {
  return window.localStorage.getItem(key);
};
window.el = function (tag) {
  return document.createElement(tag);
};
window.linearGradient = function (topColor,botColor) {
  return 'linear-gradient(180deg, ' + topColor + ' 0%, ' + botColor + ' 100%)';
};
window.delay = function (callback, time, context) {
  context = !context ? this : context;
  return setTimeout((callback).bind(context),time);
};
window.time = function() {
  return new Date().getTime();
};
window.rand = function (min,max) {
  return Math.random() * (max - min) + min;
};
