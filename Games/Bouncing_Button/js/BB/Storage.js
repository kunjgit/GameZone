/**
 * Game data storage
 * @param {Number} levels
 * @constructor
 */
function BB_Storage(levels) {
	this.levels = levels;
	this.data = {
		level: 0,
		balls: [],
		score: [],
		sound: !window.orientation
	};
	if (localStorage.data) {
		this.data = JSON.parse(localStorage.data);
	}
}

/**
 * Save data to local storage
 */
BB_Storage.prototype.save = function() {
	localStorage.data = JSON.stringify(this.data);
};

/**
 * Set score data and check new highscore
 * @param {Number} level
 * @param {BB_Score} score
 * @param {Boolean} level completed
 */
BB_Storage.prototype.setScore = function(level, score, done) {
	if (level <= this.data.level) {
		score.highscore = this.data.score[level] || 0;
		score.high = score.score > score.highscore;
		if (score.high) {
			this.data.score[level] = score.score;
			this.data.balls[level] = score.shot;
		}
		if (
			done && 
			level < this.levels-1 && 
			level == this.data.level
		) {
			this.data.level++;
		}
		this.save();
		score.balls = this.data.balls[level] || 0;
		score.next = level < this.data.level;
	}
};

/**
 * Set sound enabled
 * @param {Boolean} enabled
 */
BB_Storage.prototype.setSound = function(enabled) {
	this.data.sound = enabled;
	this.save();
};

/**
 * Get sound enabled
 * @returns {Boolean}
 */
BB_Storage.prototype.getSound = function() {
	return this.data.sound;
};

/**
 * Get maximun level number
 * @returns {Number}
 */
BB_Storage.prototype.getLevel = function() {
	return this.data.level;
};
