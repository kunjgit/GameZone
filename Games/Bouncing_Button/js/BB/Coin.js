/**
 * The golden button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Coin(sprite, x, y) {
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;
	this.r = 5;
	this.a = Math.round(Math.random() * 23);
	this.has = false;
	this.hide = false;
}

/**
 * Extends CP_Item
 */
BB_Coin.prototype = new CP_Item(20, 20);

/**
 * Draw the button
 */
BB_Coin.prototype.paint = function(ctx) {
	if (!this.hide) {
		this.sprite.paint(ctx, this.x, this.y, this.w, this.h, this.a * this.w, 80);
	}
};

/**
 * Animation thread
 */
BB_Coin.prototype.run = function() {
	if (this.has && !this.hide) {
		this.hide = this.x < 1 && this.y < 1;
		this.a = this.a < 23 ? this.a + 1 : 0;
		this.x -= this.x / 10;
		this.y -= this.y / 10;
		return true;
	}
	return false;
};

/**
 * Check ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Coin.prototype.check = function(ball) {
	if (this.has) {
		return true;
	}
	var vx = this.ox() - ball.ox(),
		vy = this.oy() - ball.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy));
	this.has = d < this.r + ball.r;
	return this.has;
};
