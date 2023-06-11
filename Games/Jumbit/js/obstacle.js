$.Obstacle = function (x, y) {
    this.type = 'obstacle';
	this.x = x;
	this.y = y;
    this.vx = $.speed;
    this.vy = 0;
    this.height = 35;
    this.width = 35;
	this.background = '#aa856a';
    this.remove = false;
    this.hit = false;
    this.falling = false;
};

$.Obstacle.prototype.render = function () {
    $.Draw.obstacle(this.x, this.y, this.width, this.background);
};

$.Obstacle.prototype.update = function () {
    if (this.falling) {
        this.vy += $.gravity;
        this.y += this.vy;
    }

    this.x -= this.vx;

    this.remove = (this.x < -100);
};
