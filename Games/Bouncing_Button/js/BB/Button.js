/**
 * UI button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} sx
 * @param {Number} sy
 * @constructor
 */
function BB_Button(sprite, x, y, w, h, sx, sy) {
	this.sprite = sprite;
	this.set(w, h, x, y);
	this.sx = sx;
	this.sy = sy;
	this.active = false;
	this.disabled = false;
}

/**
 * Extends CP_Item
 */
BB_Button.prototype = new CP_Item();

/**
 * Draw the button
 */
BB_Button.prototype.paint = function(ctx) {
	var sy = this.sy;
	if (!this.disabled) {
		sy += this.h;
		if (this.active) {
			sy += this.h;
		}
	}
	this.sprite.paint(ctx, this.x, this.y, this.w, this.h, this.sx, sy);
};

/**
 * Check button active state
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Button.prototype.check = function(x, y) {
	this.active = this.x <= x
		&& this.x + this.w >= x
		&& this.y <= y
		&& this.y + this.h >= y;
	return this.active;
};