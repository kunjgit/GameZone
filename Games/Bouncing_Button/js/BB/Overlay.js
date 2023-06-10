/**
 * Game overlay
 * @param {BB_Sprite} sprite
 * @param {BB_Score} score
 * @param {BB_Storage} storage
 * @constructor
 */
function BB_Overlay(sprite, score, level) {
	this.sprite = sprite;
	this.score = score;
	this.level = level;
	this.levels = BB_Game.maps.length;
	this.back = new BB_Button(sprite, 90, 220, 100, 32, 60, 100);
	this.start = new BB_Button(sprite, 190, 220, 100, 32, 160, 100);
	this.next = new BB_Button(sprite, 290, 220, 100, 32, 260, 100);
}

/**
 * Extends CP_Item
 */
BB_Overlay.prototype = new CP_Item(480, 320);

/**
 * Draw overlay
 */
BB_Overlay.prototype.paint = function(ctx) {
	var high = this.score.high ? 'New Highscore!' : 'Highscore: ' + this.score.highscore,
		level = 'Level: ' +  (this.level + 1) + '/' + this.levels,
		balls = this.score.balls,
		score = this.score.score,
		sprite = this.sprite;
	ctx.save();
	ctx.fillStyle = "rgba(0, 0, 0, .6)";
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineWidth = 4;
	ctx.fillStyle = "#f90";
	ctx.strokeStyle = "#420";
	ctx.font = "bold 24px Arial";
	ctx.strokeText(high, 240, 70);
	ctx.fillText(high, 240, 70);
	ctx.font = "bold 16px Arial";
	ctx.strokeText(level, 240, 100);
	ctx.fillText(level, 240, 100);
	ctx.lineWidth = 6;
	ctx.font = "bold 48px Arial";
	ctx.strokeText(score, 240, 150);
	ctx.fillText(score, 240, 150);
	ctx.restore();
	this.back.paint(ctx);
	this.start.paint(ctx);
	this.next.paint(ctx);
	if (balls) {
		sprite.paint(ctx, 216, 180, 48, 16, 0, 116);
	}
};

/**
 * Check bucton status changes
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Overlay.prototype.check = function(x, y) {
	return this.back.active ^ this.back.check(x, y) |
		this.start.active ^ this.start.check(x, y) |
		this.next.active ^ this.next.check(x, y) > 0;
};