/**
 * The game main loop
 */
Game.mainLoop = setInterval(function() {
	// We consider the game in pause if there is a popup or if we are on another page
	if (Game.paused || get('#game_content').style.display === 'none' || get('.popup') != null) {
		return;
	}
	Game.updateTimer();

	var gems = get('.gem');
	for (var i = 0; i < gems.length; i++) {
		if (gems[i].timer != undefined) {	// If at least one gem is being animated
			Game.moving = true;	// The gems are moving, we prevent the player from clicking on the gems
			return;
		}
	};

	// If all the animations are over
	if (Game.moving) {
		Game.moving = false;
		Game.onMoveComplete(gems);
	}
}, 50);

/**
 * Triggers when all the animations of a movement are done
 */
Game.onMoveComplete = function(gems) {
	for (var i = 0; i < gems.length; i++) {
		gems[i].removeEventListener('click', Game.onGemClick, false);	// We remove all the previous listeners, just in case
		gems[i].addEventListener('click', Game.onGemClick, false);
	};

	if (Game.combo >= 2 && Game.bonus.bomb == undefined) {	// The player earns a bomb is he makes more than 1 combo
		Game.winBomb();
	}

	// We activate the bomb's click
	if (Game.bonus.bomb != undefined) {
		Game.bonus.bomb.active = true;
	}

	if (Game.combo != undefined) {
		delete Game.combo;
	}

	// If the goal has been reached, we go to the next level
	if (Game.score.current >= Game.score.goal) {
		Game.endLevel();
		return;
	}

	// We check if the game is over (and get a hint for the player at the same time)
	Game.checkGameOver();
};

/**
 * Triggers when an gem is clicked (select it or proceed to the swap)
 * @param {event} e	The mouse event
 */
Game.onGemClick = function(e) {
	var target = e.srcElement || e.target;

	if (Game.gem == null) {
		Game.selectGem(target);
	}else {
		if (target.isNeighbour(Game.gem)) {			// If the clicked gem is adjacent to the first selected gem
			Game.swapGems(Game.gem, target, true);	// We can swap them
		}else {							// Otherwise
			Game.selectGem(target);		// We select the new one
		}
	}
};

/**
 * Makes a given gem the game's selected gem
 * @param {Gem} gem	The gem to select
 */
Game.selectGem = function(gem) {
	Game.deselectGem();
	if (Game.gem == null || gem.id !== Game.gem.id) {
		gem.style.backgroundImage += ', url("./images/sprites/gemSelected.gif")';
		Game.gem = gem;
	}
};

/**
 * Deselects the game's selected gem
 */
Game.deselectGem = function() {
	if (Game.gem != null) {
		Game.gem.style.backgroundImage = 'url("./images/sprites/' + Game.gem.value() + '.png")';
		Game.gem = null;   
	}
};

/**
 * Swaps two gems
 * @param {Gem} source	The first gem to swap
 * @param {Gem} dest	The second gem to swap with the first one
 * @param {bool} check	Shall we look for a streak with the swapped gems ?
 */
Game.swapGems = function(source, dest, check) {
	var sourceX = source.x(),
		sourceY = source.y(),
		destX = dest.x(),
		destY = dest.y();

	// We animate the gems to their new positions
	if (source.left() != dest.left() || source.top() != dest.top()) {
		var gems = get('.gem');
		for (var i = 0; i < gems.length; i++) {
			gems[i].removeEventListener('click', Game.onGemClick, false);	// We prevent the player from clicking on the gems
		};

		if (source.left() != dest.left()) {
			source.animate('left', source.left(), dest.left(), 9, check ? Game.checkStreak : null);
			dest.animate('left', dest.left(), source.left(), 9, check ? Game.checkStreak : null);
		}else if (source.top() != dest.top()) {
			source.animate('top', source.top(), dest.top(), 9, check ? Game.checkStreak : null);	
			dest.animate('top', dest.top(), source.top(), 9, check ? Game.checkStreak : null);
		}
		
		// We swap the x and y properties
		source.x(destX);
		source.y(destY);
		dest.x(sourceX);
		dest.y(sourceY);
	}
};

/**
 * Pauses the game
 */
Game.pause = function() {
	if (Game.moving) {
		return;
	}
	var pause, items = get('.item');

	/**
	 * Resumes the game
	 */
	Game.resume = function() {
		for (var i = 0; i < items.length; i++) {
			items[i].style.visibility = 'visible';
		};
		remove(pause);
		Game.paused = false;
		Game.checkGameOver();
	};

	// We create a popup
	pause = new Popup({
		type: 'html',
		content: '<h3>Game Paused</h3><br/>',
		buttons: [
			{
				text: 'Resume',
				callback: Game.resume
			}
		]
	});

	// We hide all the gems to avoid cheating
	for (var i = 0; i < items.length; i++) {
		items[i].style.visibility = 'hidden';
	};
	Game.removeHint();
	pause.show();
	Game.paused = true;
};

window.onload = Game.init();