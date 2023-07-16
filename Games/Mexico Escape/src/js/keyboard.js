$.KEYBOARD = {};

$.KEYBOARD.STATE = {};
$.KEYBOARD.STATE.UP = 0;
$.KEYBOARD.STATE.PRESSED = 1;
$.KEYBOARD.STATE.DOWN = 2;

$.KEYBOARD.KEYS = {};

$.KEYBOARD._keydown = function(evt) {
  var key = evt.which;

  if(!$.KEYBOARD.KEYS[key] && $.KEYBOARD.KEYS[key] != $.KEYBOARD.STATE.UP) $.KEYBOARD.KEYS[key] = $.KEYBOARD.STATE.UP;
  if($.KEYBOARD.KEYS[key] == $.KEYBOARD.STATE.PRESSED) $.KEYBOARD.KEYS[key] = $.KEYBOARD.STATE.DOWN;
  if($.KEYBOARD.KEYS[key] == $.KEYBOARD.STATE.UP) $.KEYBOARD.KEYS[key] = $.KEYBOARD.STATE.PRESSED;
};

$.KEYBOARD._keyup = function(evt) {
  var key = evt.which;
  $.KEYBOARD.KEYS[key] = $.KEYBOARD.STATE.UP;
};

$.KEYBOARD.init = function() {
  document.body.addEventListener("keydown", $.KEYBOARD._keydown);
  document.body.addEventListener("keyup", $.KEYBOARD._keyup);
};