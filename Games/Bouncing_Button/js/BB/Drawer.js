/**
 * The background canvas
 * @constructor
 */
function BB_Drawer() {}

/**
 * Extends CP_Canvas
 */
BB_Drawer.prototype = new CP_Canvas(480, 320);

/**
 * Generate random value
 * @param {Number} value
 * @returns {Number}
 */
BB_Drawer.prototype.rand = function(value) {
	return Math.round(Math.random() * value) - (value / 2);
};

/**
 * Draw the main scene informations
 */
BB_Drawer.prototype.info = function() {
	var ctx = this.ctx,
		title = "BOUNCING BUTTON",
		desc = [
			"Shoot the red button 3 times",
			"Collect all golden buttons",
			"Avoid holes",
			"Bounce off walls"
		];
	ctx.save();
	ctx.font = "bold 36px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#852";
	ctx.fillStyle = "#f90";
	ctx.strokeText(title, 240, 55);
	ctx.fillText(title, 240, 55);
	ctx.font = "bold 16px Arial";
	ctx.fillStyle = "#420";
	ctx.textAlign = "left";
	for (var i=0; i<desc.length; i++) {
		ctx.fillText(desc[i], 190, 110 + i * 35);
	}
	this.hole(140, 180, 18, 2);
	this.wood(115, 205, 50, 20, 2, 2);
	ctx.restore();
};

/**
 * Draw hole
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @param {Number} stroke
 */
BB_Drawer.prototype.hole = function(x, y, r, stroke) {
	var ctx = this.ctx;
	ctx.save();
	ctx.translate(x, y);
	if (stroke) {
		ctx.save();
		ctx.scale(1.1, 1);
		ctx.beginPath();
		ctx.arc(stroke, 0, r + stroke, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#852";
		ctx.fill();
		ctx.restore();	
	}
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.restore();	
};

/**
 * Draw wood pattern rectangle
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} r
 * @param {Number} stroke
 */
BB_Drawer.prototype.wood = function(x, y, w, h, r, stroke) {
	var ctx = this.ctx,
		color = stroke ? "#852" : "#b85";
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = stroke ? "#963" : "#c96";
	ctx.lineWidth = stroke || 0;
	ctx.strokeStyle = color;
	if (stroke) {
		ctx.save();
		ctx.shadowBlur = 10 * this.scale;
		ctx.shadowColor = "#000";
		ctx.shadowOffsetX = 5 * this.scale;
		ctx.shadowOffsetY = 5 * this.scale;
		ctx.fill();
		ctx.restore();
		ctx.stroke();
	} else {
		ctx.fill();
	}
	ctx.restore();
	if (w >= h) {
		for (var i=r; i<h-r; i+=r) {
			ctx.save();
			ctx.translate(x, y + i + this.rand(r));
			ctx.beginPath();
			ctx.moveTo(0, this.rand(r));
			ctx.bezierCurveTo(w/3, this.rand(r), w/3*2, this.rand(r), w, this.rand(r));
			ctx.lineTo(w, this.rand(r));
			ctx.bezierCurveTo(w/3*2, this.rand(r), w/3, this.rand(r), 0, this.rand(r));
			ctx.fillStyle = color;
			ctx.fill();
			ctx.restore();
		}
	} else {
		for (var i=r; i<w-r; i+=r) {
			ctx.save();
			ctx.translate(x + i + this.rand(r), y);
			ctx.beginPath();
			ctx.moveTo(this.rand(r), 0);
			ctx.bezierCurveTo(this.rand(r), h/3, this.rand(r), h/3*2, this.rand(r), h);
			ctx.lineTo(this.rand(r), h);
			ctx.bezierCurveTo(this.rand(r), h/3*2, this.rand(r), h/3, this.rand(r), 0);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.restore();
		}
	}
};
