/**
 * Abstract game item
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function CP_Item(w, h, x, y) {
	this.set(w, h, x, y);
}

/**
 * Set dimensions and coordinates
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 */
CP_Item.prototype.set = function(w, h, x, y) {
	this.w = w || 0;
	this.h = h || 0;
	this.x = x || 0;
	this.y = y || 0;
};

/**
 * Get/Set the origo x coordinate
 * @param {Number} value
 * @returns {Number} 
 */
CP_Item.prototype.ox = function(value) {
	if (value) {
		this.x = value - (this.w / 2);
	} else {
		value = this.x + (this.w / 2); 
	}
	return value;
};

/**
 * Get/Set the origo y coordinate
 * @param {Number} value
 * @returns {Number} 
 */
CP_Item.prototype.oy = function(value) {
	if (value) {
		this.y = value - (this.h / 2);
	} else {
		value = this.y + (this.h / 2); 
	}
	return value;
};

/**
 * Clear the item
 * @param ctx
 */
CP_Item.prototype.clear = function(ctx) {
	ctx.clearRect(this.x, this.y, this.w, this.h);
};

/**
 * Abstract draw function
 * @param ctx
 */
CP_Item.prototype.paint = function(ctx) {};

/**
 * Abstract animation thread
 */
CP_Item.prototype.run = function() {};

