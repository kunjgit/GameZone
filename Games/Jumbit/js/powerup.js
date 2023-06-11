$.Powerup = function (x, y) {
	this.x = x;
	this.y = y;

    this.type = 'powerup';

    this.vx = $.speed;
    this.vy = 1;

    this.width = 18;
    this.height = 18;
};


$.Powerup.prototype.render = function () {
    $.Draw.heart(this.x, this.y);
};

$.Powerup.prototype.update = function () {
    this.x -= this.vx;
    this.y -= this.vy;

    this.remove = (this.x < -100);
};
