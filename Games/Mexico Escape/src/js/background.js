$.BACKGROUND = {
  layers: 3,
  offset: [0, 0, 0],
  baseSpeed: -5,
  speed: [0, 0, 0],
  speedMultiplier: [0.8, 0.9, 1]
};

$.BACKGROUND.update = function(dt) {
  //if(!$.DEAD || $.STARTING)
    for(var i = 0;i < $.BACKGROUND.layers ; i++) {
      $.BACKGROUND.offset[i] += $.SPEED.value * $.BACKGROUND.speedMultiplier[i] * dt;
      $.BACKGROUND.offset[i] += $.BACKGROUND.offset[i] <= -$.W ? $.W : 0;
    }
};
$.BACKGROUND.render = function(c) {
  var grd = c.createLinearGradient(0, 0, 0, $.H / 2);
  grd.addColorStop(0, "#749dc8");
  grd.addColorStop(1, "#d5c3b2");
  c.fillStyle = grd;
  c.fillRect(0, 0, $.W, $.H / 2);

  for(var i = 0;i < $.BACKGROUND.layers ; i++) {
    c.drawImage($.GFX["bg_layer_" + (i + 1)].canvas, $.BACKGROUND.offset[i] + $.W, $.H - $.GFX["bg_layer_" + (i + 1)].h);
    c.drawImage($.GFX["bg_layer_" + (i + 1)].canvas, $.BACKGROUND.offset[i]      , $.H - $.GFX["bg_layer_" + (i + 1)].h);
  }
};