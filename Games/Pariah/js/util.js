var abs = Math.abs,
    cos = Math.cos,
    sin = Math.sin,
    ceil = Math.ceil,
    floor = Math.floor,
    max = Math.max,
    pow = Math.pow,
    sqrt = Math.sqrt,
    round = Math.round,
    rand = Math.random;

$.n = Date.now;
$.u = {
  'fading': [],
  'instID': null,
};

// Check that v is between ll and lu
$.u.range = function(v, ll, lu) {
  if (v < ll) return ll;
  if (v > lu) return lu;
  return v;
};

$.u.fadeOut = function(i, cb) {
  $.u.fading[i] = setInterval($.u._fade, 50, i, cb);
};

// Fade out step
$.u._fade = function(i, cb) {
  var e = $.u.byId(i);
  e.style.opacity -= 0.03;
  if (e.style.opacity <= 0) {
    clearInterval($.u.fading[i]);
    $.u.fading.splice($.u.fading.indexOf(i), 1);
    if (cb !== undefined) cb();
  }
};

// Shows a DOM object putting its opacity in one
$.u.show = function(i) {
  $.u.byId(i).style.opacity = 1.0;
};

// Hides a DOM object putting its opacity in zero
$.u.hide = function(i) {
  $.u.byId(i).style.opacity = 0.0;
};

// Makes a DOM object visible or invisible
$.u.v = function(i, v) {
  $.u.byId(i).style.visibility = (v) ? 'visible' : 'hidden';
};

/* Generate random integer in a (min, max) range */
$.u.rand = function(a, b) {
  return floor(Math.random() * (b - a)) + a;
};

// Returns true if there is chance to miss one attack
// Receives p (number between 0 and 1) representing the probability of success
$.u.canMiss = function(p) {
  var x = $.u.rand(1, 100);
  return (x <= floor(p * 100));
};

$.u.byId = function(i) {
  return document.getElementById(i);
};

// Show instructions on screen
$.u.i = function(t, d) {
  var dx = d || 3000;
  if ($.u.instID) {
    clearTimeout($.u.instID);
    clearInterval($.u.fading.m1);
  }
  $.u.byId('m1').innerHTML = t;
  $.u.show('m1');
  $.u.instID = setTimeout(function() { $.u.fadeOut('m1', $.cleanMsg); }, dx);
};

$.u.ts = function() {
  return $.u.byId('ts');
};

// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

window.setTimeout = function (vCb, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCb instanceof Function ? function () {
    vCb.apply(oThis, aArgs);
  } : vCb, nDelay);
};

window.setInterval = function (vCb, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCb instanceof Function ? function () {
    vCb.apply(oThis, aArgs);
  } : vCb, nDelay);
};

window.raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(a){ window.setTimeout(a,1E3/60); };

window.caf = window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame;
