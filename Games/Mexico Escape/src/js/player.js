$.PLAYER = {
  score: 0,
  baseX: 150,
  x: -$.GFX.player.w,
  y: 0,
  velY: 0,
  jumpVel: -25,
  jumpVelMax: -25,
  yOffset: 0,
  yOffsetSpeed: 10,
  yOffsetDir: 1,
  yOffsetMax: 10,
  inAir: false,
  collisionBox: new $.RECT(100, 0, $.GFX.player.w - 7, $.GFX.player.h - 10)
};

$.PLAYER.getScreenY = function() {
  return $.PLAYER.y - $.PLAYER.yOffset + $.H - $.GFX.player.h - 10;
};

$.PLAYER.hasJumped = function() {
  return !$.DEAD && ($.KEYBOARD.KEYS[32] > $.KEYBOARD.STATE.UP || $.POINTER_DOWN) && $.PLAYER.jumpVel;
};

$.PLAYER.update = function(dt) {
  if($.PLAYER.hasJumped()) {
    $.PLAYER.inAir = true;
    $.PLAYER.velY += $.PLAYER.jumpVel * dt * 7;
    $.PLAYER.jumpVel -= $.PLAYER.jumpVelMax * dt * 9;

    if($.PLAYER.jumpVel >= 0) $.PLAYER.jumpVel = 0;

    if(!$.MOBILE) $.SOUNDS.jump.audio.play();

  } else if($.PLAYER.inAir)
    $.PLAYER.velY -= $.G * dt;

  $.PLAYER.y += $.PLAYER.velY;

  if($.PLAYER.inAir) {
    if($.PLAYER.y > 0) {
      $.PLAYER.velY = 0;
      $.PLAYER.y = 0;
      $.PLAYER.inAir = false;
      $.PLAYER.jumpVel = $.PLAYER.jumpVelMax;
    }
  }

  $.PLAYER.collisionBox.y = $.PLAYER.getScreenY();

  $.PLAYER.yOffset += $.PLAYER.yOffsetSpeed * $.PLAYER.yOffsetDir * dt;
  if($.PLAYER.yOffset >= $.PLAYER.yOffsetMax) {
    $.PLAYER.yOffset = $.PLAYER.yOffsetMax;
    $.PLAYER.yOffsetDir = -1;
  } else if($.PLAYER.yOffset <= 0) {
    $.PLAYER.yOffset = 0;
    $.PLAYER.yOffsetDir = 1;
  }

  if($.DEAD) {
    if($.REVIVING) {
      if($.PLAYER.x < $.PLAYER.baseX)
        $.PLAYER.x += 200 * dt;
      else {
        $.PLAYER.x = $.PLAYER.baseX;
        $.PLAYER.onReviveComplete();
      }
    } else {
      if($.PLAYER.x > -$.GFX.player.w)
        $.PLAYER.x += $.SPEED.value * dt;
    }

    $.PLAYER.collisionBox.x = $.PLAYER.x;
  }
};

$.PLAYER.render = function(c) {
  var scale = $.UTILS.clamp(1 - $.PLAYER.y / -100, 0, 1);
  c.save();
  c.globalAlpha = scale * 0.25;
  c.fillStyle = "#000";
  c.beginPath();
  c.ellipse(this.x + 10, $.H - 10, 25 * scale, 7 * scale, 0, Math.PI * 2, false);
  c.fill();
  c.restore();

  c.drawImage($.GFX.player.canvas, this.x, $.PLAYER.getScreenY(), $.GFX.player.w, $.GFX.player.h);

  /*$.CTX.ui.strokeStyle = "blue";
  $.CTX.ui.strokeRect(
    $.PLAYER.collisionBox.x,
    $.PLAYER.collisionBox.y,
    $.PLAYER.collisionBox.w,
    $.PLAYER.collisionBox.h
  );*/
};


$.PLAYER.die = function() {
  $.DEAD = true;
  $.ONE_RUN = true;

  $.LEVEL = 0;
  $.SPEED.multiplier = $.SPEED.multiplierDef;
};

$.PLAYER.revive = function() {
  $.REVIVING = true;
};

$.PLAYER.onReviveComplete = function() {
  $.PLAYER.score = 0;
  $.REVIVING = false;
  $.DEAD = false;
};