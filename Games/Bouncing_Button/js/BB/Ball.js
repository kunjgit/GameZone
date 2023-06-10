/**
 * The big red button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Ball(sprite, x, y) {
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;
	this.r = 20;
	this.a = 0;
	this.l = .3;
	this.s = .985;
	this.t = null;
	this.v = null;
	this.o = {x:this.x, y:this.y};
}

/**
 * Extends CP_Item
 */
BB_Ball.prototype = new CP_Item(40, 40);

/**
 * Draw the button
 */
BB_Ball.prototype.paint = function(ctx) {
	this.sprite.paint(ctx, this.x, this.y, this.w, this.h, Math.round(this.a) * 40, this.t ? 40 : 0);
	if (this.t) {
		ctx.save();
		ctx.strokeStyle = '#ddd';
		ctx.lineCap = 'round';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(this.ox(), this.oy());
		ctx.lineTo(this.t.x, this.t.y);
		ctx.stroke();
		ctx.restore();
	}
};

/**
 * Animation thread
 */
BB_Ball.prototype.run = function() {
	if (this.v) {
		this.x += this.v.x;
		this.y += this.v.y;
		this.v.x *= this.s;
		this.v.y *= this.s;
		this.v.d *= this.s;
		var a = this.v.d * this.l;
		this.a += a > 2 ? 2 : a;
		if (this.a < 0) this.a = 11;
		if (this.a > 11) this.a = 0;
		if (this.v.d < 0.05) {
			this.v = null;
		}
		return true;
	}
	return false;
};

/**
 * Stop the animation
 */
BB_Ball.prototype.stop = function() {
	if (this.v) {
		this.v = {x:0,y:0,d:0};
	}
};

/**
 * Check bouncs point
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} bounce
 * @returns {Boolean}
 */
BB_Ball.prototype.check = function(x, y, bounce) {
	var vx = this.ox() - x,
		vy = this.oy() - y,
		d = Math.sqrt((vx * vx) + (vy * vy)),
		result = d <= this.r;
	if (result && bounce) {
		this.ox(vx / d * this.r + x);
		this.oy(vy / d * this.r + y);
		if (this.v) {
			var a = this.v.d / d;
			this.v.x = vx * a;
			this.v.y = vy * a;
		}
	}
	return result;
};

/**
 * Set button bounce vector
 * @param {Number} vx
 * @param {Number} vy
 */
BB_Ball.prototype.bounce = function(vx, vy) {
	if (this.v) {
		this.v.x *= vx;
		this.v.y *= vy;
		this.l = -this.l;
	}
};

/**
 * Stop he button and set the line end
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.hold = function(x, y) {
	this.t = {x:x, y:y};
	this.v = null;
};

/**
 * Start button animation
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.shot = function(x, y) {
	var vx = x - this.ox(),
		vy = y - this.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy)),
		a = d / 20 * (250 / d);
	this.v = {x: vx/a, y: vy/a, d:d/a};
	this.t = null;
	this.l = -this.l;
};

/**
 * Reset button position to default values
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.reset = function(x, y) {
	this.x = this.o.x;
	this.y = this.o.y;
	this.a = 0;
	this.v = null;
	this.t = null;
};