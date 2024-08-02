/**
 * A bonus item for Ore : the Bomb (destoys all the immediatly surrounding gems)
 */
Game.Bomb = function() {
	if (this == window) {
		throw new Error('Bomb() is a constructor, you can only call it with the keyword "new"');
	}
	var bomb = document.createElement('span');
	Game.addBombCapabilities(bomb);

	bomb.className = 'bomb item';
	bomb.style.backgroundImage = 'url("./images/sprites/bomb.png")';
	bomb.addEventListener('click', bomb.explode, false);
	bomb.active = false;
	bomb.isGem = false;

	return bomb;
};

Game.addBombCapabilities = function(bomb) {
	addItemCapabilities(bomb);
	/**
	 * Makes the bomb, and the surrounding gems explode
	 */
	bomb.explode = function(event) {
		if (!bomb.active)
			return;
		bomb.active = false;
		var gemsToRemove = [],
			x = bomb.x(),
			y = bomb.y(),
			item;
		for (var i = (x > 0 ? x - 1 : x); i <= (x < 7 ? x + 1 : x); i++) {
			gemsToRemove[i] = [];
			for (var j = (y > 0 ? y - 1 : y); j <= (y < 7 ? y + 1 : y); j++) {
				item = get('#tile' + j + '_' + i);
				if (i == x && j == y || item == null || !item.isGem)
					continue;
				gemsToRemove[i].push(item);
			};
		};
		get('#grid').removeChild(bomb);
		Game.removeStreak(gemsToRemove);
		delete Game.bonus.bomb;
	};
};