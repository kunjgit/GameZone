//////////////////////////////////////////////////////
///   Commonly Used functions throughout the game
//////////////////////////////////////////////////////

function distance (x1,y1,x2,y2) { // Finds distance between two objects with pythagorean theorem
	dX2 = Math.pow((x2-x1),2);
	dY2 = Math.pow((y2-y1),2);
	return Math.sqrt(dX2 + dY2);
} 

function collision (a,b) { // Checks if two objects are colliding, works with circles
	space = a.radius + b.radius;
	if (distance(a.x,a.y,b.x,b.y) < space) {
		return true; // Collision
	}
	else {
		return false; // No Collision
	}
}

function resize() { // Re-init's the menu/ls/game if screen size changes
	if (currentcanvas === 'mm') {
		initMainMenu();
	} else if (currentcanvas === 'ls') {
		initStars();
		initLevelSelect();
	} else if (currentcanvas === 'gc') {
		starting = true;
		initStars();
		initGame();
	}
}

var clicksound = function() { // Plays a click sound, used only in menu. Not enough space for more sounds. :P
	var clicksnd = new Audio();
	clicksnd.src = 'assets/click.wav';
	clicksnd.volume = Options.volume;
	clicksnd.play();
}
