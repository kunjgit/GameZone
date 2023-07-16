$.CNV = {game: null, ui: null, crt: null}; // TODO: Remove for build
$.CTX = {game: null, ui: null, crt: null}; // TODO: Remove for build

$.G = -9.8 * 10 / 1.25;

$.SCALE = 1;

$.POINTER_DOWN = false;

$.canvases = ["game", "ui", "crt"];
$.canvasesToRedraw = ["game", "ui"];
$.init = function () {
  $.canvases.forEach(function (c) {
    $.CNV[c] = $.d.createElement("canvas");
    $.CNV[c].id = "cnv_" + c;
    $.CTX[c] = $.CNV[c].getContext('2d');

    $.CNV[c].mozImageSmoothingEnabled = false;
    $.CNV[c].webkitImageSmoothingEnabled = false;
    $.CNV[c].imageSmoothingEnabled = false;

    $.CNV[c].width = $.W;
    $.CNV[c].height = $.H;

    $.d.body.appendChild($.CNV[c]);
  });

  $.resize();

  $.w.addEventListener("resize", $.resize);

  $.d.body.addEventListener("touchstart", function() {
    $.POINTER_DOWN = true;

    if($.MOBILE && $.PLAYER.hasJumped()) $.SOUNDS.jump.audio.play();
  });

  $.d.body.addEventListener("touchend", function() {
    $.POINTER_DOWN = false;
  });

  $.d.body.addEventListener("touchleave", function() {
    $.POINTER_DOWN = false;
  });

  $.SOUND_MANAGER.init();

  $.KEYBOARD.init();

  $.CRT.init();

  $.unpackGFX(function () {
    $.loop();
  });
};

$.resize = function () {
  var width = innerWidth;
  var height = innerHeight;
  var scaleX = width / $.W;
  var scaleY = height / $.H;
  $.SCALE = Math.min(scaleX, scaleY);
  var translateX = (width - $.W * $.SCALE) / 2;
  var translateY = (height - $.H * $.SCALE) / 2;

  $.canvases.forEach(function (c) {
    $.CNV[c].style.position = "absolute";
    $.CNV[c].style.width = $.UTILS.px($.W);
    $.CNV[c].style.height = $.UTILS.px($.H);
    $.CNV[c].style.top = $.UTILS.px(translateY);
    $.CNV[c].style.left = $.UTILS.px(translateX);
    $.CNV[c].style.transformOrigin = "0 0";
    $.CNV[c].style.transform = "scale(" + $.SCALE + ", " + $.SCALE + ")";
    $.CNV[c].style.webkitTransform = "scale(" + $.SCALE + ", " + $.SCALE + ")";
  });
};

$.lsts = 0;

$.loop = function () {
  requestAnimFrame($.loop);

  var ts = Date.now();
  if (!$.lsts) $.lsts = ts;
  var dt = (ts - $.lsts) / 1e3;
  $.lsts = ts;

  $.update(dt);
  $.render();
};
$.update = function (dt) {
  if($.DEAD && $.UI.menuShowing && ($.KEYBOARD.KEYS[32] > $.KEYBOARD.STATE.UP || $.POINTER_DOWN)) {
    $.PLAYER.revive();
  }

  $.UI.update(dt);

  $.PLAYER.update(dt);

  $.SPEED.update(dt);
  $.BACKGROUND.update(dt);

  if(Math.random() < $.LEVELS.glitch_spawn_chance[$.LEVEL]) $.GLITCHES.add();
  if(Math.random() < $.LEVELS.sombrero_spawn_chance[$.LEVEL]) $.SOMBREROS.add();

  $.GLITCHES.update(dt);
  $.SOMBREROS.update(dt);
  $.PEYOTES.update(dt);
};
$.render = function () {

  $.canvasesToRedraw.forEach(function (c) {
    $.CTX[c].clearRect(0, 0, innerWidth, innerHeight);
  });

  $.BACKGROUND.render($.CTX.game);
  $.PEYOTES.render($.CTX.game);
  $.SOMBREROS.render($.CTX.game);
  $.PLAYER.render($.CTX.game);
  $.GLITCHES.render($.CTX.game);
  $.UI.render($.CTX.ui);
};

$.w.onload = $.init;