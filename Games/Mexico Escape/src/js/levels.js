$.LEVELS = {
  peyote_speed: [-250, -290, -330, -370, -410],
  peyote_spawn_time_multiplier: [1, 0.9, 0.7, 0.65, 0.5],
  sombrero_speed: [-250, -270, -290, -310, -330],
  sombrero_spawn_chance: [0.0005, 0.001, 0.0025, 0.005, 0.0075],
  glitch_spawn_chance: [0.0025, 0.005, 0.0075, 0.1, 0.2]
};

$.LEVEL = 0;
$.LEVEL_MAX = 5;
$.DEAD = true;

$.ONE_RUN = false;

$.REVIVING = false;

$.SPEED = {
  base: -15,
  value: 0,
  max: $.W * 1.5,
  multiplier: 15,
  multiplierDef: 15,
  decreaseMultiplier: 3
};

$.SPEED.update = function(dt) {

  if($.DEAD && !$.REVIVING) {
    $.SPEED.value += 900 * dt;
  } else {
    $.SPEED.value += $.SPEED.base * $.SPEED.multiplier * dt;

    $.SPEED.multiplier -= dt * $.SPEED.decreaseMultiplier;
    $.SPEED.multiplier = $.UTILS.clamp($.SPEED.multiplier, 1, 10000);
  }

  $.SPEED.value = $.UTILS.clamp($.SPEED.value, -$.SPEED.max, 0);
};