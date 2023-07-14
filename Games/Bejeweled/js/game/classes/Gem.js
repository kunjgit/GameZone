/**
 * Creates an gem from its coordinates and value
 */
Game.Gem = function(x, y, value) {
	if (this == window) {
		throw new Error('Gem() is a constructor, you can only call it with the keyword "new"');
	}
	var left = ((60 * x) + (5 * (x + 1))) + 'px',
		top = ((60 * y) + (5 * (y + 1))) + 'px',
		gem = document.createElement('span');

	gem.className = 'gem item';
	gem.val = value;
	gem.id = 'tile' + y + '_' + x;
	// gem.innerHTML = y+'_'+x;
	
	gem.style.top = top;
	gem.style.left = left;
	gem.style.backgroundImage = 'url("./images/sprites/' + value + '.png")';
	
	gem.falling = false;	// Is the element falling ?
	gem.inStreak = false;
	gem.isGem = true;

	Game.addGemCapabilities(gem);	// We add useful functions relative to gem objects
	return gem;
};

Game.addGemCapabilities = function(gem) {
	addItemCapabilities(gem);	// We add useful functions relative to displayable items
	
	/**
	 * Returns (and sets, if a value is passed as an argument) the gem's y tile value
	 */
	gem.value = function(val) {
		if (val != undefined)
			gem.val = val;
		if (gem.className != '')
			return gem.val;
		return null;
	};

	/**
	 * Makes the gem pop on the grid
	 */
	gem.pop = function(grid) {
		grid.appendChild(gem);
	};

	/**
	 * Compares a gem's value with this gem's value
	 * @param {Gem} target	The gem to compare with the current object
	 */
	gem.equals = function(target) {
		if (target != null && target.isGem && target.value && target.value() == gem.value() && target != gem && !target.falling)	{
			return true;
		}
		return false;
	};

	/**
	 * Checks if a given gem is adjacent to the object
	 * @param {Gem} target	The gem to compare with the current object
	 */
	gem.isNeighbour = function(target) {
		return (((gem.x() === target.x() - 1 || gem.x() === target.x() + 1) && gem.y() === target.y())
			 || ((gem.y() === target.y() - 1 || gem.y() === target.y() + 1) && gem.x() === target.x()));
	};

	/**
	 * Searches for the presence of an gem streak
	 * @return The streak array with the streaked gems in it
	 */
	gem.getStreak = function() {
		var x = gem.x(),
			y = gem.y(),
			row = [],
			column = [],
			streak = {};

		row = gem.checkRow(true, true);
		column = gem.checkColumn(true, true);
		
		// If we have a row of three identical gems
		if (row.length > 1) {
			for (var i = 0; i < row.length; i++) {
				streak[row[i].x()] = [];
				if (streak[row[i].x()].indexOf(row[i]) == -1) {
					streak[row[i].x()].push(row[i]);
					row[i].inStreak = true;
				}
			};
		}

		// If we have a column of three identical gems
		if (column.length > 1) {
			for (var i = 0; i < column.length; i++) {
				if (streak[column[i].x()] == undefined) {
					streak[column[i].x()] = [];
				}
				if (streak[column[i].x()].indexOf(column[i]) == -1) {
					streak[column[i].x()].push(column[i]);
					column[i].inStreak = true;
				}
			};
		}
		// If we have a row or a column of three identical gems
		if ((row.length > 1 || column.length > 1) && (streak[gem.x()] == undefined || streak[gem.x()].indexOf(gem) == -1)) {
			if (streak[gem.x()] == undefined) {
				streak[gem.x()] = [];
			}
			streak[gem.x()].push(gem);	// We know the moved gem will be removed
			gem.inStreak = true;
		}
		return streak;
	};

	/**
	 * Looks through an gem's neighbours in a given direction
	 * @param vertical	bool	Check vertically or horizontally ?
	 * @param step	int	(-1 OR 1) Check on one direction or another (left/right, top/bottom)
	 * @return The streak array with the streaked gems in it
	 */
	gem.parseNeighbours = function(vertical, step) {
		var streak = [],
			i = 0,
			x = gem.x(),
			y = gem.y(),
			currentGem;

		// We run through the gems in one direction. The step indicates if we go one way or another on the X or Y axis (the axis is defined by the 'vertical' parameter)
		for (i = ((vertical ? y : x) + step); (step == -1) ? (i > -1) : (i < Game.GRID_SIZE); i += step) {
			currentGem = vertical ? get('#tile' + i + '_' + x) : get('#tile' + y + '_' + i);	// The current parsed gem
			// If the current gem is equal to the source gem, we add it to the streak
			if (streak.indexOf(currentGem) == -1 && gem.equals(currentGem) && currentGem.inStreak == false) {
				streak = streak.concat(currentGem);
			}else {
				break;
			}
		};
		return streak;
	};



	/**
	 * Checks for a streak in the gem's column
	 * @return An array containing the identical adjacent gems in the column
	 */
	gem.checkColumn = function(top, bottom) {
		if (top !== true && bottom !== true) {
			return;
		}
		
		var column = [];	
		// Checking the gems on top (if the gem is at an extremity, don't check behind the border)
		if (top && gem.y() > 0) {
			column = column.concat(gem.parseNeighbours(true, -1));
		}
		// Checking the gems on bottom (if the gem is at an extremity, don't check behind the border)
		if (bottom && gem.y() < (Game.GRID_SIZE - 1)) {
			column = column.concat(gem.parseNeighbours(true, 1));
		}
		return column;
	};

	/**
	 * Checks for a streak in the gem's row
	 * @return An array containing the identical adjacent gems in the row
	 */
	gem.checkRow = function(left, right) {
		if (left !== true && right !== true) {
			return;
		}

		var row = [];
		// Checking the gems on the left
		if (left && gem.x() > 0) {
			row = row.concat(gem.parseNeighbours(false, -1));
		}
		// Checking the gems on the right
		if (right && gem.x() < (Game.GRID_SIZE - 1)) {
			row = row.concat(gem.parseNeighbours(false, 1));
		}
		return row;
	};

	/**
	 * Animates the explosion of an gem and removes it
	 * @param streak	An array containing the gems that are in a streak
	 * @param fallAfter	bool: Should the gms fall after this gem's explosion ? (true for the first destroyed gem)
	 */
	gem.destroy = function(streak, fallAfter) {
		var i = 0, loops = 3, timer;

		function animateExplosion () {
			if (i >= loops) {
				clearInterval(gem.timer);
				delete gem.timer;
				if (gem.parentNode) {
					gem.parentNode.removeChild(gem);
				}
				if (fallAfter === true) {
					Game.onStreakRemoved(streak);
				}
				return;
			}

			gem.style.backgroundImage = 'url("./images/sprites/' + gem.value() + '_explosion' + (i % 2) + '.png")';
			i++;	
		};

		gem.timer = setInterval(function() {
			animateExplosion();
		}, 100);
	};

	/**
	 * Checks if a gem can be in a streak by a player's move
	 * @return {Array}	The gems that the player has to swap in order to make a streak
	 */
	gem.getPossibleMove = function() {
		var row = gem.checkRow(true, true),
			column = gem.checkColumn(true, true),
			pair = [],
			x = 0,
			y = 0,
			equalGem = null,
			gemsToSwap = [];
		y = gem.y();
		x = gem.x();

		if (row && row.length > 1 || column && column.length > 1) {
			return [];
		}

		// The gem has to have one equal neighbour
		if (row && row.length == 1) {
			pair = gem.x() < row[0].x() ? [gem, row[0]] : [row[0], gem];
			y = gem.y();

			// If a move is possible with this row
			if (pair[0].x() > 0 && gem.equals((equalGem = get('#tile' + (y - 1) + '_' + (pair[0].x() - 1))))	// Checking on left top
			||	pair[0].x() > 0 && gem.equals((equalGem = get('#tile' + (y + 1) + '_' + (pair[0].x() - 1))))	// Checking on left bottom
			||	pair[0].x() > 1 && gem.equals((equalGem = get('#tile' + (y) + '_' + (pair[0].x() - 2))))		// Checking on left, two gems further
			||	pair[1].x() < (Game.GRID_SIZE - 1) && gem.equals((equalGem = get('#tile' + (y - 1) + '_' + (pair[1].x() + 1))))	// Checking on right top
			||	pair[1].x() < (Game.GRID_SIZE - 1) && gem.equals((equalGem = get('#tile' + (y - 1) + '_' + (pair[1].x() + 1))))	// Checking on right bottom
			||	pair[1].x() < (Game.GRID_SIZE - 2) && gem.equals((equalGem = get('#tile' + (y) + '_' + (pair[1].x() + 2))))		// Checking on right, two gems further
			) {
				gemsToSwap = [equalGem];
				if (equalGem.x() > pair[1].x()) {
					gemsToSwap.push(get('#tile' + y + '_' + (pair[1].x() + 1)));
				}else {
					gemsToSwap.push(get('#tile' + y + '_' + (pair[0].x() - 1)));
				}
				return gemsToSwap;
			}
		}else if (column && column.length == 1) {
			pair = gem.y() < column[0].y() ? [gem, column[0]] : [column[0], gem];
			x = gem.x();

			// If a move is possible with this column
			if (pair[0].y() > 0 && gem.equals((equalGem = get('#tile' + (pair[0].y() - 1) + '_' + (x - 1))))	// Checking on top left
			||	pair[0].y() > 0 && gem.equals((equalGem = get('#tile' + (pair[0].y() - 1) + '_' + (x + 1))))	// Checking on top right
			||	pair[0].y() > 1 && gem.equals((equalGem = get('#tile' + (pair[0].y() - 2) + '_' + (x))))		// Checking on top, two gems further
			||	pair[1].y() < (Game.GRID_SIZE - 1) && gem.equals((equalGem = get('#tile' + (pair[1].y() + 1) + '_' + (x - 1))))	// Checking on bottom left
			||	pair[1].y() < (Game.GRID_SIZE - 1) && gem.equals((equalGem = get('#tile' + (pair[1].y() + 1) + '_' + (x - 1))))	// Checking on bottom right
			||	pair[1].y() < (Game.GRID_SIZE - 2) && gem.equals((equalGem = get('#tile' + (pair[1].y() + 2) + '_' + (x))))		// Checking on bottom, two gems further
			) {
				gemsToSwap = [equalGem];
				// If the detected gem is below the column, the gem to swap it with will be below too
				if (equalGem.y() > pair[1].y()) {
					gemsToSwap.push(get('#tile' + (pair[1].y() + 1) + '_' + x));
				}else {	// Otherwise, the gem to swap it with will be on top too
					gemsToSwap.push(get('#tile' + (pair[0].y() - 1) + '_' + x));
				}
				return gemsToSwap;
			}
		}
		var equalVGem = null, equalHGem = null;
		// If there are two equal gems with one space between them, and it is possible to make a streak by placing a surrouding gem between them (horizontally or vertically)
		if (gem.equals(get('#tile' + y + '_' + (x + 2))) && (gem.equals((equalHGem = get('#tile' + (y + 1) + '_' + (x + 1)))) || gem.equals((equalHGem = get('#tile' + (y - 1) + '_' + (x + 1)))))
		||	gem.equals(get('#tile' + y + '_' + (x - 2))) && (gem.equals((equalHGem = get('#tile' + (y - 1) + '_' + (x - 1)))) || gem.equals((equalHGem = get('#tile' + (y + 1) + '_' + (x - 1)))))
		||	gem.equals(get('#tile' + (y + 2) + '_' + x)) && (gem.equals((equalVGem = get('#tile' + (y + 1) + '_' + (x - 1)))) || gem.equals((equalVGem = get('#tile' + (y + 1) + '_' + (x + 1)))))
		||	gem.equals(get('#tile' + (y - 2) + '_' + x)) && (gem.equals((equalVGem = get('#tile' + (y - 1) + '_' + (x - 1)))) || gem.equals((equalVGem = get('#tile' + (y - 1) + '_' + (x + 1)))))
		) {
			equalGem = (equalHGem == null ? equalVGem : equalHGem);
			x = equalGem.x();
			y = equalGem.y();
			return (equalVGem != null) ?
					[equalGem, get('#tile' + y + '_' + gem.x())]
					: [equalGem, get('#tile' + gem.y() + '_' + x)];
		}
	};
};