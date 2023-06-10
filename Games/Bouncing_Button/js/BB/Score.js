/**
 * Score counter
 * @param {BB_Sprite} sprite
 * @constructor
 */
function BB_Score(sprite) {
	this.sprite = sprite;
	this.score = 0;
	this.buffer = 0;
	this.shot = 3;
	this.high = false;
	this.balls = 0;
	this.highscore = 0;
	this.next = false;
	this.end = false;
};

/**
 * Score event handler
 * @param {String} event
 */
BB_Score.prototype.on = function(event) {
	switch (event) {
		case 'shot':
			this.shot--;
			break;
		case 'wall':
			this.score += 111;
			break; 
		case 'coin':
			this.score += 3250;
			break; 
		case 'end':
			this.score += 12500 * this.shot;
			this.end = true;
			break;
	}
};

/**
 * Score thread
 * @returns {Boolean}
 */
BB_Score.prototype.run = function() {
	var result = this.buffer < this.score,
		value = this.buffer + 43;
	if (result) {
		this.buffer = value < this.score ? value : this.score;
	}
	return result;
};

/**
 * Draw score
 * @param ctx
 */
BB_Score.prototype.paint = function(ctx) {
	var score = this.end ? this.score : this.buffer,
		width = this.shot * 20;
	if (width) {
		this.sprite.paint(ctx, 480-width, 2, width, 16, 0, 100);
	}
	ctx.save();
	ctx.font = "bold 16px Arial";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#852";
	ctx.strokeText(score, 25, 16);
	ctx.fillStyle = "#f90";
	ctx.fillText(score, 25, 16);
	ctx.restore();
};
