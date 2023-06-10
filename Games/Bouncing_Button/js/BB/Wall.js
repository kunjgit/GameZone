/**
 * Wooden walls
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Wall(w, h, x, y) {
	this.set(w, h, x, y);
}

/**
 * Extends CP_Item
 */
BB_Wall.prototype = new CP_Item();

/**
 * Check ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Wall.prototype.check = function(ball) {
	var r = ball.r,
		x = ball.ox(),
		y = ball.oy(),
		x1 = this.x,
		y1 = this.y,
		x2 = x1 + this.w,
		y2 = y1 + this.h;
	if (x >= x1 && x <= x2) {
		//top
		if (y < y1 && y1 - y < r) {
			ball.oy(y1 - r);
			ball.bounce(1, -1);
			return true;
		}
		//bottom
		if (y > y2 &&  y - y2 < r) {
			ball.oy(y2 + r);
			ball.bounce(1, -1);
			return true;
		}
	}
	if (y >= y1 && y <= y2) {
		//left
		if (x < x1 && x1 - x < r) {
			ball.ox(x1 - r);
			ball.bounce(-1, 1);
			return true;
		}
		//right
		if (x > x2 &&  x - x2 < r) {
			ball.ox(x2 + r);
			ball.bounce(-1, 1);
			return true;
		}
	}
	//top left
	if (x < x1 && y < y1) {
		return ball.check(x1, y1, true);
	}
	//bottom left
	if (x < x1 && y > y2) {
		return ball.check(x1, y2, true);		
	}
	//top right
	if (x > x2 && y < y1) {
		return ball.check(x2, y1, true);
	}
	//bottom right
	if (x > x2 && y > y2) {
		return ball.check(x2, y2, true);
	}
	return false;	
};
