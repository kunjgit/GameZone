// Gem streaks related functions (combo checking, etc.)

/**
 * Looks for the presence and removes a streak around an gem
 * @param {Gem} gem	The gem which neighbours will be checked for a streak
 */
Game.checkStreak = function(gem) {
	var gems = get('.gem'),
		streak = gem.getStreak();	// We look for a streak from the gem

	for (var i = 0; i < gems.length; i++) {
		gems[i].removeEventListener('click', Game.onGemClick, false);	// We remove the mouse event listeners
	};

	if (Object.getLength(streak) > 0) {
		// We calculate the number of combos
		if (Game.gem == null) {
			Game.combo = (Game.combo == undefined ? 1 : Game.combo + 1);
		}

		gem.inStreak = true;
		Game.removeStreak(streak);
	}else if (Game.gem != null && Game.gem.id !== gem.id && !Game.gem.inStreak) {	// If there is a selected gem, and it is not in a streak, we will have to reverse the swap
		Game.swapGems(gem, Game.gem, false);		// We re-swap the gems to their respective original positions
		Game.deselectGem();
		
		for (var i = 0; i < gems.length; i++) {
			gems[i].addEventListener('click', Game.onGemClick, false);	// We add the mouse event listener
		};
	}
};

/**
 * Removes all the gems that form a streak (column or row, or both)
 * @param {Array} gemsToRemove	An array containing the gems that are in a streak
 */
Game.removeStreak = function(gemsToRemove) {
	Game.removeHint();	// We delete the gem hint
	var totalGems = 0, nbGems = 0, fallAfter = false;

	for (var column in gemsToRemove) {
		for (var i = 0; i < gemsToRemove[column].length; i++) {
			totalGems++;
		};
	};

	for (var column in gemsToRemove) {
		for (var i = 0; i < gemsToRemove[column].length; i++) {
			nbGems++;
			if (nbGems == totalGems) {
				fallAfter = true;	// We make the gems fall after the last one was destroyed
			}
			gemsToRemove[column][i].destroy(gemsToRemove, fallAfter);
		};
	};
	
	Game.updateScore(totalGems);
};

/**
 * Triggers when a streak is destroyed: starts the generation of new gems
 * After that, makes the columns fall one by one
 * @param {Array} streak	An array containing the gems that are in a streak
 */
Game.onStreakRemoved = function(streak) {		// We continue after the streak disappeared
	var firstYToFall = Game.GRID_SIZE,	// The Y of the first item that will fall
		newGems = null,
		currentItem = null,
		fallHeight = 0,
		fallStarted = false,
		skip = false;

	// We run through the gem columns
	for (var column in streak) {
		for (var i = Game.GRID_SIZE - 1; i >= 0; i--) {
			currentItem = get('#tile' + i + '_' + column);
			if (currentItem != null && currentItem.timer != undefined) {	// If there is an item from another streak that is still animated, we pass this column
				skip = true;
				break;
			}
		};
		if (skip) {	// We will parse another column
			skip = false;
			continue;
		}

		firstYToFall = Game.GRID_SIZE;
		for (i = Game.GRID_SIZE - 1; i >= 0; i--) {	// We run through the column from bottom to top
			currentItem = get('#tile' + i + '_' + column);
			if (currentItem == null) {				// Once we found a gem that was destroyed
				for (var j = i - 1; j >= 0; j--) {	// We run through the gems on top of it
					currentItem = get('#tile' + j + '_' + column);
					if (currentItem != null) {		// Once we found a valid gem on top of the destroyed gems
						firstYToFall = j;			// It is the first that will fall on this column
						break;
					}
				};
				break;
			}
		};
		if (firstYToFall >= 7) {	// If there is no "hole" in the grid
			firstYToFall = -1;		// It means there is a hole from the top, the first gem to fall is on top the grid
		}
		Game.generateGems(column);	// We generate the new gems
		get('#tile' + firstYToFall + '_' + column).fallStreak();	// We make the first gem fall (the others will follow)
	};
	Game.deselectGem();
};
var check = true;
/**
 * Generates random gems above the grid after a streak disappeared
 * @param {Array} streak	An array containing the gems that are in a streak
 * @return {Array} An array of the new generated gems
 */
Game.generateGems = function(x) {
	var quantity = 0, y, value;
	for (var i = Game.GRID_SIZE - 1; i >= 0; i--) {
		currentGem = get('#tile' + i + '_' + x);
		if (currentGem == null) {
			quantity++;

			value = parseInt(Math.random() * Game.gemRange);
			if (check) value = 0;
			y = -1 * quantity;
			gem = new Game.Gem(parseInt(x), y, value);
			grid.appendChild(gem);
		}
	};
	check = false
};