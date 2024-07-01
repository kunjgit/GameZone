function Bullet() {
  var gameUI = GameUI.getInstance();

  var element = new Image();
  element.src = 'images/bullet.png';

  this.x;
  this.y;
  this.velX;
  this.velY;
  this.grounded = false;
  this.sX;
  this.sY = 0;
  this.width = 16;
  this.height = 16;

  var that = this;

  this.init = function(x, y, direction) {
    that.velX = 8 * direction; //changing the direction of the bullet if mario faces another side
    that.velY = 0;
    that.x = x + that.width;
    that.y = y + 30;
    that.type = 30;
    that.sX = 0;
  };

  this.draw = function() {
    gameUI.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
  };

  this.update = function() {
    var gravity = 0.2;

    if (that.grounded) {
      //bouncing the bullet as it touches the ground
      that.velY = -4;
      that.grounded = false;
    }

    that.velY += gravity;

    that.x += that.velX;
    that.y += that.velY;
  };
}
