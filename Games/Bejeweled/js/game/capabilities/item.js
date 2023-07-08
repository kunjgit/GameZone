/**
 * Adds some methods to a given item to make it a displayable and movable item on the game grid
 */
function addItemCapabilities(item) {
	/**
	 * Returns (and sets, if a value is passed as an argument) the gem's "left" CSS property in px
	 */
	item.left = function(value) {
		if (value != undefined) {
			if (typeof(value) == 'number' && parseInt(value) == value)	// If value is an integer
				item.style.left = value + 'px';
			else if (typeof(value) == 'string')	// If value is a string
				item.style.left = value;
			return value;
		}
		return item.style.left;
	};

	/**
	 * Returns (and sets, if a value is passed as an argument) the item's "top" CSS property in px
	 */
	item.top = function(value) {
		if (value != undefined) {
			if (typeof(value) == 'number' && parseInt(value) == value)	// If value is an integer
				item.style.top = value + 'px';
			else if (typeof(value) == 'string')	// If value is a string
				item.style.top = value;
			return value;
		}
		return item.style.top;
	};

	/**
	 * Returns (and sets, if a value is passed as an argument) the item's x position on the map
	 */
	item.x = function(value) {
		if (value != undefined)	{
			item.id = (item.id != '') ? (item.id.substr(0, item.id.length - 1) + value) : 'tile0_' + value;
			// item.innerHTML = item.y()+'_'+item.x();
		}
		if (item.id != '')
			return parseInt(item.id.substr(item.id.length - 1));
		return null;
	};

	/**
	 * Returns (and sets, if a value is passed as an argument) the item's y position on the map
	 */
	item.y = function(value) {
		if (value != undefined) {
			item.id = (item.id != '') ? (item.id.substring(0, 4) + value + item.id.substr(item.id.indexOf('_'))) : 'tile' + value + '_0';
			// item.innerHTML = item.y()+'_'+item.x();
		}
		if (item.id != '')
			return parseInt(item.id.substring(4, item.id.indexOf('_')));
		return null;
	};

	/**
	 * Animates an element's CSS property from start value to end value (only values in pixels)
	 */
	item.animate = function(property, start, end, speed, callback) {
		if (start == end)
			return;
		
		this.style[property] = start;
		start = parseInt(start.substr(0, start.length - 2));
		end = parseInt(end.substr(0, end.length - 2));

		var doAnimation = function(start) {
			for (var i = 0; i < speed; i++) {
				// If the property has reached the end value
				if ((direction == 1 && start >= end) || (direction == -1 && start <= end)) {
					clearInterval(item.timer);	// We stop the animation timer
					delete item.timer;

					if (callback != undefined && callback != null && !item.falling) {
						callback(item);
					}
					if (item.falling) {
						item.onFallComplete();
					}
					return;
				}
				start += direction;
				item.style[property] = start + 'px';
			};
			return start;
		};

		var delta = end - start,
			direction = (delta > 0) ? 1 : -1;

		// We start the item's timer
		item.timer = setInterval(function() {
			start = doAnimation(start);
		}, 30);
	};

	/**
	 * Makes the item fall vertically
	 */
	item.fallStreak = function () {
		var x = item.x(),
			y = item.y(),
			currentGem = null;

		// We make all the items on the column fall by 1 slot
		item.fall();
		for (var i = y; i >= -(Game.GRID_SIZE - 1); i--) {
			currentGem = get('#tile' + i + '_' + x);
			if (currentGem != null) {
				currentGem.fall();
			}
		};
	};

	/**
	 * Makes the item fall by one slot
	 */
	item.fall = function () {
		var top = item.top(),
			height = parseInt(top.substring(0, top.length - 2));
		
		height += Game.TILE_SIZE;
		item.falling = true;
		item.y(parseInt(item.y() + 1));	// We set the new Y position after the fall
		item.animate('top', top, height + 'px', Game.GRID_SIZE);
	};

	/**
	 * Trggiers everytime the item's fall is finished
	 */
	item.onFallComplete = function() {
		item.falling = false;
		if (get('#tile' + (item.y() + 1) + '_' + item.x()) == null && (item.y() + 1) != Game.GRID_SIZE) {	// If there is still an empty slot below the item
			item.fall();		// We make it fall again
		}else if(item.className == 'gem item') {				// Otherwise, the fall is over
			Game.checkStreak(item);	// We look for a streak
		}
	};
};