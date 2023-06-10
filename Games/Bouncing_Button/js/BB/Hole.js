/**
 * The hole
 * @param {Number} x
 * @param {Number} y
 * @param {Number}r
 * @constructor
 */
function BB_Hole(x, y, r) {
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 25;
	this.w = this.r * 2;
	this.h = this.r * 2;
}

/**
 * Extends CP_Item
 */
BB_Hole.prototype = new CP_Item();

/**
 * Checck ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Hole.prototype.check = function(ball) {
	var vx = this.ox() - ball.ox(),
		vy = this.oy() - ball.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy));
	return d < this.r;	
};