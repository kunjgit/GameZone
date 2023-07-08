// Score related functions

/**
 * Updates the player's score after a match
 * @param {Number}	destroyedGems	The number of gems that were destroyed
 */
Game.updateScore = function(destroyedGems) {
	var perGem = 100 + (Game.combo == undefined ? 0 : (50 * Game.combo)),	// Each combo makes the gems worth 50 points more
		gain = destroyedGems * perGem,
		gaugeSize = 0,
		gainSpan = document.createElement('span'),
		yOrigin = 215,
		yShift = 5;
	
	// For a streak bigger than 3, the player gets a bonus	
	if (destroyedGems > 3) {
		for (var i = 0; i < destroyedGems - 3; i++) {
			gain += 100 * (i+1);
		};
	}

	Game.score.current += gain;
	
	// If there is already a gain displayed, we sum the gains
	var existingGain = get('.score_gain');
	if (existingGain != null) {
		if (existingGain.length == undefined) {
			existingGain = [existingGain];
		}
		for (var i = 0; i < existingGain.length; i++) {
			gain += parseInt(existingGain[i].innerHTML.substr(1));
			get('#player_info').removeChild(existingGain[i]);
		};
	}

	// We update the UI
	gainSpan.className  ='score_gain';
	gainSpan.innerHTML = '+' + gain;
	gainSpan.style.top = yOrigin + 'px';
	get('#player_info').insertBefore(gainSpan, get('#total_score'));

	// The gain animation
	var gainMove = setInterval(function() {
		var y = parseInt(gainSpan.style.top.substring(0, gainSpan.style.top.indexOf('px')));
		if (y >= yOrigin + 35) {
			clearInterval(gainMove);
			if (gainSpan.parentNode) {
				get('#player_info').removeChild(gainSpan);
			}
			return;
		}
		gainSpan.style.top = (y+yShift) + 'px';
	}, 60);

	get('#current_score').innerHTML = Game.score.current;
};

/**
 * Resets the score between the levels
 */
Game.resetScore = function() {
	Game.score.current = 0;
	Game.score.goal *= 1.5;
	get('#current_score').innerHTML = Game.score.current;
	get('#goal_score').innerHTML = Game.score.goal;
}