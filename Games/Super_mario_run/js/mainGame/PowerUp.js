function PowerUp() {
  var gameUI = GameUI.getInstance();

  var element = new Image();
  element.src = 'images/powerups.png';

  this.type;
  this.x;
  this.y;
  this.velX = 2;
  this.velY = 0;
  this.grounded = false;
  this.sX;
  this.sY = 0;
  this.width = 32;
  this.height = 32;

  var that = this;

  this.mushroom = function(x, y) {
    that.x = x;
    that.y = y - that.height;
    that.type = 30;
    that.sX = 0;
  };

  this.flower = function(x, y) {
    that.x = x;
    that.y = y - that.height;
    that.type = 31;
    that.sX = 32;
  };

  this.draw = function() {
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };

  this.update = function() {
    if (that.type == 30) {
      var gravity = 0.2;

      if (that.grounded) {
        that.velY = 0;
      }

      that.velY += gravity;

      that.x += that.velX;
      that.y += that.velY;
    }
  };
}
