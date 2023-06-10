/**
 * PNG Sprite generator
 * @constructor
 */
function BB_Sprite() {
	this.scale = 1;
	this.image = new Image();
};

/**
 * Draw sprites
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} sx
 * @param {Number} sy
 */
BB_Sprite.prototype.paint = function(ctx, x, y, w, h, sx, sy) {
	var sw = Math.round(w * this.scale),
		sh = Math.round(h * this.scale);
	sx = Math.round(sx * this.scale);
	sy = Math.round(sy * this.scale);
	ctx.drawImage(this.image, sx, sy, sw, sh, x, y, w, h);
};

/**
 * Render circles
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @param {Number} fill
 * @param {Number} stroke
 * @param {Number} width
 * @param {Number} shadow
 */
BB_Sprite.prototype.renderCircle = function(ctx, x, y, r, fill, stroke, width, shadow) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	if (shadow) {
		shadow *= this.scale;
		ctx.shadowBlur = shadow;
		ctx.shadowColor = "rgba(0,0,0,.5)";
		ctx.shadowOffsetX = shadow;
		ctx.shadowOffsetY = shadow;
	}
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.lineWidth = width || 1;
		ctx.strokeStyle = stroke;
		ctx.stroke();
	}
	ctx.restore();	
};

/**
 * Render the red button
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 * @param {Number} rubber
 * @param {Number} scale
 */
BB_Sprite.prototype.renderBall = function(ctx, x, y, angle, rubber, scale) {
	var g = ctx.createRadialGradient(-10, -10, 80, -10, -10, 0),
		s = scale || 1;
    g.addColorStop(0, "#c00");
    g.addColorStop(1, "#900");
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	this.renderCircle(ctx, 0, 0, 17.5, g, '#600', 3, .5);
	ctx.rotate(Math.PI / 180 * angle);
	this.renderCircle(ctx, -5, -5, 3, '#200', '#600');
	this.renderCircle(ctx, -5, 5, 3, '#200', '#600');
	this.renderCircle(ctx, 5, -5, 3, '#200', '#600');
	this.renderCircle(ctx, 5, 5, 3, '#200', '#600');
	if (rubber) {
		ctx.lineWidth = 2.5;
		ctx.lineCap = 'round';
		ctx.strokeStyle = '#ddd';
		ctx.beginPath();
		ctx.moveTo(-5, -5);
		ctx.lineTo(5, 5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-5, 5);
		ctx.lineTo(5, -5);
		ctx.stroke();
	}
	ctx.restore();
};

/**
 * Render the golden buttons
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 * @param {Number} scale
 */
BB_Sprite.prototype.renderCoin = function(ctx, x, y, angle, scale) {
	var g = ctx.createRadialGradient(-5, -5, 40, -5, -5, 0),
		s = scale || 1;
    g.addColorStop(0, "#fc0");
    g.addColorStop(1, "#f60");
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	this.renderCircle(ctx, 0, 0, 8, g, '#c60', 2, .5);
	ctx.rotate(Math.PI / 180 * angle);
	this.renderCircle(ctx, -3, 0, 2, '#420', '#c60');
	this.renderCircle(ctx, 3, 0, 2, '#420', '#c60');
	ctx.restore();
};

/**
 * Render UI buttons 
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} r
 * @param {String} text
 * @param {Number} status
 */
BB_Sprite.prototype.renderButton = function(ctx, x, y, w, h, r, text, status) {
	var g = ctx.createLinearGradient(0,0,0,h);
	g.addColorStop(0,"#fec");
	g.addColorStop(1, "#cb9");
	ctx.save();
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(0, r);
	ctx.arcTo(0, 0, r, 0, r);
	ctx.lineTo(w-r, 0);
	ctx.arcTo(w, 0, w, r, r);
	ctx.lineTo(w, h-r);
	ctx.arcTo(w, h, w-h, h, r);
	ctx.lineTo(r, h);
	ctx.arcTo(0, h, 0, h-r, r);
	ctx.closePath();
	ctx.fillStyle = g;
	ctx.fill();
	ctx.strokeStyle = status > 1 ? "#fff" : "#cb9";
	ctx.lineWidth = 2;
	ctx.stroke();
	
	ctx.font = "bold 20px Arial";
	ctx.textAlign = "center";
	//ctx.textBaseline = "middle";
	ctx.fillStyle = "#ccc";
	ctx.fillText(text, w/2, 22);
	ctx.fillStyle = status > 0 ? "#320" : "#986";
	ctx.fillText(text, w/2, 21);
	ctx.restore();
};

/**
 * Render the whole sprite
 * @param ctx
 * @param {Number} scale
 * @returns {BB_Sprite}
 */
BB_Sprite.prototype.render = function(ctx, scale) {
	this.scale = scale;
	ctx.save();
	var i;
	for (i=0; i<24; i++) {
		var a = i*7.5;
		if (i<12) {
			this.renderBall(ctx, i*40+20, 20, a, false);
			this.renderBall(ctx, i*40+20, 60, a, true);
		}
		if (i<3) {
			this.renderBall(ctx, i*20+10, 108, 0, false, .35);
			this.renderCoin(ctx, i*16+8, 124, 0, .8);
		}
		this.renderCoin(ctx, i*20+10, 90, a);
	}
	for (i=0; i<3; i++) {
		this.renderButton(ctx, 67, i*32+102, 86, 28, 13, "BACK", i);
		this.renderButton(ctx, 167, i*32+102, 86, 28, 13, "START", i);
		this.renderButton(ctx, 267, i*32+102, 86, 28, 13, "NEXT", i);
		this.renderButton(ctx, 367, i*32+102, 86, 28, 13, "SOUND", i);
	}
	this.image.src = ctx.canvas.toDataURL('image/png');
	ctx.restore();
	ctx.clearRect(0, 0, 480, 320);
	return this;
};
