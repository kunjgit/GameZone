$.SOMBREROS = {
  list: []
};

$.SOMBRERO = function() {
  var yOffset = 30;

  this.x = $.W;
  this.y = Math.random() * 30 + yOffset;
  this.velX = Math.abs(Math.random() * 2 - 0.5);
  this.type = Math.floor(Math.random() * 2);

  this.scale = (this.y - yOffset) / 30 * 0.4 + 0.2;

  this.destroyed = false;
};

$.SOMBRERO.prototype.update = function(dt) {
  this.x += Math.max($.SPEED.value, -500) * this.velX * dt;

  if(this.x < -$.GFX.sombrero.w * this.scale) {
    this.destroyed = true;
  }
};

$.SOMBRERO.prototype.render = function(c) {
  c.save();
  c.translate(this.x, this.y);
  c.scale(this.scale, this.scale);
  c.globalAlpha = $.UTILS.clamp(this.scale * 2.5, 0, 1);
  c.drawImage($.GFX["sombrero"].canvas, 0, 0);
  c.restore();
};

$.SOMBREROS.add = function() {
  $.SOMBREROS.list.push(new $.SOMBRERO());
};

$.SOMBREROS.update = function(dt) {
  for(var i=0;i<$.SOMBREROS.list.length;i++) {
    if($.SOMBREROS.list[i].destroyed) $.SOMBREROS.list.splice(i--, 1);
    else $.SOMBREROS.list[i].update(dt);
  }
};

$.SOMBREROS.render = function(c) {
  $.SOMBREROS.list.forEach(function(sombrero) {
    sombrero.render(c);
  });
};

/*
*
* The mexicans started their mission to abduct all thr chilly in the world. The bravest of all the chillies tries to escape the invasion. Help the little chilly to achieve it's goal.
*
*
* */