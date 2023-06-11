//////////////////////////////////////////////////////
///   Star Class - The tiny dots in the background
//////////////////////////////////////////////////////

Star = function(x, y, color) { // Simple location and color
	this.x = x;
	this.y = y;
	this.color = color;
}

Star.prototype.draw = function(ctx) { // Draw the star
	ctx.beginPath();
	ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();
}