$.PEYOTES = {
  list: []
};

$.PEYOTE = function() {
  this.scale = Math.random() * 1.5 + 1;
  this.x = $.W;
  this.y = $.H - 10 - 5 * (1 - this.scale / 2.5);
  this.yOffset = $.GFX["peyote"].h * this.scale;

  this.collisionBox = new $.RECT(this.x, this.y - this.yOffset, $.GFX["peyote"].w * this.scale, $.GFX["peyote"].h * this.scale);

  this.destroyed = false;
};

$.PEYOTE.prototype.update = function(dt) {
  this.x += $.SPEED.value * dt;

  this.collisionBox.x = this.x;

  if(!$.DEAD && this.collisionBox.collidesWith($.PLAYER.collisionBox)) {
    if($.LEVEL < $.LEVEL_MAX - 1) {
      $.LEVEL++;
      $.SOUNDS.hit.audio.play();
    } else {
      $.SOUNDS.die.audio.play();
      $.PLAYER.die();
    }


    this.destroyed = true;
  }

  if(this.x < -$.GFX.peyote.w * this.scale) {
    this.destroyed = true;
    $.PLAYER.score += Math.round(147 * this.scale) * Math.pow($.LEVEL + 1, 2);
  }
};

$.PEYOTE.prototype.render = function(c) {
  if(!this.destroyed) {
    c.save();
    c.translate(this.x, this.y - this.yOffset);
    c.scale(this.scale, this.scale);

    c.save();
    c.globalAlpha = this.scale / 2.5 * 0.5;
    c.fillStyle = "#000";
    c.beginPath();
    c.ellipse($.GFX["peyote"].w / 2, 23, 15 * this.scale / 2.5, 4 * this.scale / 2.5, 0, Math.PI * 2, false);
    c.fill();
    c.restore();

    c.drawImage($.GFX["peyote"].canvas, 0, 0);
    c.restore();

    /*$.CTX.ui.strokeStyle = "cyan";
    $.CTX.ui.strokeRect(
      this.collisionBox.x,
      this.collisionBox.y,
      this.collisionBox.w,
      this.collisionBox.h
    );*/
  }
};

$.PEYOTES.add = function() {
  $.PEYOTES.list.push(new $.PEYOTE());
};

$.PEYOTES.time = 1;
$.PEYOTES.timer = 0;
$.PEYOTES.double = false;

$.PEYOTES.update = function(dt) {

  if(!$.DEAD) {
    $.PEYOTES.timer += dt;
    while($.PEYOTES.timer >= $.PEYOTES.time) {
      $.PEYOTES.timer -= $.PEYOTES.time;

      $.PEYOTES.time = (Math.random() < 0.005 ? 0.75 : 1) * ( ( 1 - Math.abs($.SPEED.value / $.SPEED.max) * 0.6) + 0.2 ) * (1 + Math.random() * 0.4);

      $.PEYOTES.add();
    }
  }

  for(var i=0;i<$.PEYOTES.list.length;i++) {
    if($.PEYOTES.list[i].destroyed) $.PEYOTES.list.splice(i--, 1);
    else $.PEYOTES.list[i].update(dt);
  }
};

$.PEYOTES.render = function(c) {
  $.PEYOTES.list.forEach(function(peyote) {
    peyote.render(c);
  });
};