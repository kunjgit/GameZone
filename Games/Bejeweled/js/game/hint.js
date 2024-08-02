// Hint related functions (Possible streaks parsing, etc.)

/**
 * Checks if the player still has a possibility to make a streak
 * @return {Array} An array containing the gems to swap if it is possible, null otherwise
 */
Game.checkHint = function() {
	var gems = get('.gem'),
		hint = null,
		oneHint = false;	// Is there at least one hint found
	
	if (Game.hint != undefined) {
		clearTimeout(Game.hint.timer);
		delete Game.hint;
	}

	for (var i = gems.length - 1; i >= 0; i--) {
		// If there is at least one gem can be moved to make a streak
		if ((hint = gems[i].getPossibleMove()) != null) {
			oneHint = true;
			if (hint.length == 0) {
				continue;
			}
			break;
		}
	};
	
	// We set the hint
	if (hint != null && hint.length > 0) {
		Game.hint = {
			gems: hint,		// We keep the hint for the player
			timer: setTimeout(Game.showHint, 15000),	// We will show it in 15 seconds if the player is stuck
			start: new Date()
		};
	}
	return oneHint;
};

/**
 * Displays an animation to give the player a hint on which gem to move if he is stuck
 */
Game.showHint = function() {
	if (Game.hint == undefined || Game.hint.gems == undefined)
	    return;
	if (Game.hint.timer) {
		Game.removeHint();	// We remove the previous hint
	}
	var arrow = document.createElement('span'),
		gems = Game.hint.gems,
		left, top, width, height,
		timer1, timer2;

	// We make sure to put the first gem from the top, or the left as the first element of the array
	if (gems[0].x() == gems[1].x() && gems[0].y() > gems[1].y() || gems[0].x() > gems[1].x()) {
		gems.reverse();
	}
	
	left = parseInt(gems[0].left().substr(0, gems[0].left().length - 2)) - 2.5;
	top = parseInt(gems[0].top().substr(0, gems[0].top().length - 2)) - 2.5;

	// We place the arrow at the middle of the gems to swap
	if (gems[0].x() == gems[1].x()) {	// If the gems are in the same column.
		width = 19;
		height = 65;
		arrow.style.backgroundImage = 'url("./images/sprites/v_arrow.png")';
		arrow.style.left = (left + Game.TILE_SIZE / 2 - (width / 2)) + 'px';
		arrow.style.top = (top + Game.TILE_SIZE / 2 - (height - Game.TILE_SIZE) / 2) + 'px';
	}else {
		width = 65;
		height = 19;
		arrow.style.backgroundImage = 'url("./images/sprites/h_arrow.png")';
		arrow.style.left = (left + Game.TILE_SIZE / 2 - (width - Game.TILE_SIZE) / 2) + 'px';
		arrow.style.top = (top + Game.TILE_SIZE / 2 - height / 2) + 'px';
	}
	arrow.id = 'hint_arrow';
	arrow.style.position = 'absolute';
	arrow.style.width = width + 'px';
	arrow.style.height = height + 'px';


	// We make the arrow blink
	timer1 = setInterval(function() {
		var blinks = 3, i = 0;	// The arrow blinks 3 times
		timer2 = setInterval(function() {
			if (i == blinks * 2) {
				clearInterval(timer2);
				return;
			}
			// Once every two, we display and remove the arrow
			if (i % 2 == 0) {
				grid.appendChild(arrow);
			}else {
				remove(arrow);
			}
			i++;
		}, 200);
	}, 2000);

	/**
	 * Removes the hint animation once the player has clicked on a gem
	 */
	Game.removeHint = function(reset) {
		if (Game.hint.timer != undefined) {
			clearTimeout(Game.hint.timer);
			delete Game.hint.timer;
		}
		if (timer1 != null) {
			// We stop the blinking
			clearInterval(timer2);
			clearInterval(timer1);
			timer2 = null;
			timer1 = null;
			remove(arrow);	// We remove the arrow if it is displayed
		}
	};
};

/**
 * Removes the hint animation once the player has clicked on a gem
 */
Game.removeHint = function() {
	if (Game.hint != undefined) {
		clearTimeout(Game.hint.timer);
		delete Game.hint.timer;
	}
};

/**
 * Pauses the hint timeout, so that it doesn't show up if the user is on another tab from his browser
 */
Game.pauseHint = function() {
	var remaningTime = 15000;
	if (Game.hint != undefined) {
		remaningTime -= (new Date() - Game.hint.start);	// We calculate the hint's timer remaining time to resume it later
		clearTimeout(Game.hint.timer);
		delete Game.hint.timer;
	}

	/**
	 * Resumes the hint timeout
	 */
	Game.resumeHint = function() {
		if (remaningTime <= 0) {	// If the hint timer was already finished, we look for another hint
			Game.removeHint();
			Game.checkGameOver();
		}else if (Game.hint) {
			Game.hint.start = new Date();	// We set a new starting moment
			Game.hint.timer = setTimeout(Game.showHint, remaningTime);	// We start the timer again, for the remaining time
		}
	};
};

Game.resumeHint = function() {};