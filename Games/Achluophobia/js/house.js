var HOUSE_LAYOUT = new Array();
var HOUSE_ROWS = 60;
var HOUSE_COLS = 60;

var SQUARE_WIDTH = 40;

var FIRST_ROOM = true;

var DOOR_X = 30;
var DOOR_Y = 27;

function find_random() {
	var foundSquare = false;
	
	var location = {};
	
	while(!foundSquare) {
		var randomX = Math.floor(Math.random() * (HOUSE_ROWS - 2)) + 1;
		var randomY = Math.floor(Math.random() * (HOUSE_COLS - 2)) + 1;
		
		if (HOUSE_LAYOUT[randomX][randomY] == 0) {
			if (HOUSE_LAYOUT[randomX + 1][randomY] == 1) {
				foundSquare = true;
				location.new_room = [-1, 0];
			}
			
			if (HOUSE_LAYOUT[randomX - 1][randomY] == 1) {
				if (foundSquare) {
					foundSquare = false;
					continue;
				}
				
				foundSquare = true;
				location.new_room = [1, 0];
			}
			
			if (HOUSE_LAYOUT[randomX][randomY + 1] == 1) {
				if (foundSquare) {
					foundSquare = false;
					continue;
				}
			
				foundSquare = true;
				location.new_room = [0, -1];
			}
			
			if (HOUSE_LAYOUT[randomX][randomY - 1] == 1) {
				if (foundSquare) {
					foundSquare = false;
					continue;
				}
				
				foundSquare = true;
				location.new_room = [0, 1];
			}
		}
	}
	
	location.door = [randomX, randomY];
	
	return location;
}

function add_room() {
	var location = find_random();
	
	var width = (Math.floor(Math.random() * 5) + 5);
	var height = (Math.floor(Math.random() * 5) + 5);
	
	var offset = 0;
	var startX = 0;
	var startY = 0;
	
	if (location.new_room[0] != 0) {
		width *= location.new_room[0];
		startY = Math.floor(Math.random()  * (height-1) * - 1);
	}
	
	if (location.new_room[1] != 0) {
		height *= location.new_room[1];
		startX = Math.floor(Math.random()  * (width-1)* - 1);
	}
	
	if (width < 0) {
		width = Math.abs(width);
		startX = startX + location.door[0] - width;
	} else {
		startX = startX + location.door[0] + location.new_room[0];
	}
	
	if (height < 0) {
		height = Math.abs(height);
		startY = startY + location.door[1] - height;
	} else {
		startY = startY + location.door[1] + location.new_room[1];
	}
	
	if (isFree(startX, startY, width, height)) {	
		HOUSE_LAYOUT[ location.door[0] ][ location.door[1] ] = 1;
		
		digOut(startX, startY, width, height);
		return true;
	} else {
		return false;
	}
}

function getRandomSquare(min_x, min_y, x_offset, y_offset) {
	var random_x = Math.floor(Math.random() * (x_offset)) + min_x;
	var random_y = Math.floor(Math.random() * (y_offset)) + min_y;
	return {x: random_x, y: random_y};

}

function hasFreeAdjacent(x, y) {
	if (x + 1 >= HOUSE_ROWS || y + 1 >= HOUSE_COLS ||
		x - 1 < 0 || y - 1 < 0) {
		return true;
	}

	if (x < HOUSE_ROWS && HOUSE_LAYOUT[x + 1][y] == 1) {
		return true;
	}
			
	if (x > 0 && HOUSE_LAYOUT[x - 1][y] == 1) {
		return true;
	}
			
	if (y <  HOUSE_COLS && HOUSE_LAYOUT[x][y + 1] == 1) {
		return true;
	}
			
	if (y > 0 && HOUSE_LAYOUT[x][y - 1] == 1) {
		return true;
	}
	
	return false;
}

function isFree(x, y, w, h) {
	if (x + w >= HOUSE_ROWS || y + h >= HOUSE_COLS ||
		x < 0 || y < 0) {
		return false;
	}	
	for(var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			if (HOUSE_LAYOUT[x + i][y + j] != 0) return false;
		}
	}
	
	return true;
}

function digOut(x, y, w, h) {
	for(var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {w
			HOUSE_LAYOUT[x + i][y + j] = 1;
		}
	}
	
	if (!FIRST_ROOM) {
		var key_square = getRandomSquare(x, y, w, h);
		var new_key = new Key(key_square.x * SQUARE_WIDTH + SQUARE_WIDTH/2,
							key_square.y * SQUARE_WIDTH + SQUARE_WIDTH/2);
		GAME_OBJECTS.push(new_key);
	}
	
	/* var numberOfWalls = Math.ceil(Math.random() * 3);
	while(numberOfWalls--) {
		var wall = getRandomSquare(x+1, y+1, w-1, h-1);
		HOUSE_LAYOUT[wall.x][wall.y] = 0;
	} */
	
	if (FIRST_ROOM) FIRST_ROOM = false;
}

function translateToSquare(x, y) {
	var x_coord = Math.floor(x / SQUARE_WIDTH);
	var y_coord = Math.floor(y / SQUARE_WIDTH);
	
	return {x: x_coord, y: y_coord};
}


function draw_map() {
	for(var i = 0; i < HOUSE_ROWS; i++) {
		for(var j = 0; j < HOUSE_COLS; j++) {
			if (HOUSE_LAYOUT[i][j] != 0) {
				
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(i * SQUARE_WIDTH,
						 j * SQUARE_WIDTH,
						 SQUARE_WIDTH,
						 SQUARE_WIDTH);

			}
		}
	}	
}

function init_house() {

	HOUSE_LAYOUT = new Array();
	HOUSE_ROWS = 60;
	HOUSE_COLS = 60;

	SQUARE_WIDTH = 40;

	FIRST_ROOM = true;

	DOOR_X = 30;
	DOOR_Y = 27;


	for(var i = 0; i < HOUSE_ROWS; i++) {
		HOUSE_LAYOUT[i] = new Array();
		for(var j = 0; j < HOUSE_COLS; j++) {
			HOUSE_LAYOUT[i][j] = 0;
		}
	}
	
	HOUSE_LAYOUT[DOOR_X-1][DOOR_Y] = -1;
	HOUSE_LAYOUT[DOOR_X-1][DOOR_Y-1] = -1;
	HOUSE_LAYOUT[DOOR_X][DOOR_Y-1] = -1;
	HOUSE_LAYOUT[DOOR_X+1][DOOR_Y] = -1;
	HOUSE_LAYOUT[DOOR_X+1][DOOR_Y-1] = -1;
	HOUSE_LAYOUT[DOOR_X][DOOR_Y] = -1;
	
	digOut(28, 28, 5, 5);
	
	var room_count = 0;
	while(room_count < NUMBER_OF_ROOMS) {
		if (add_room()) ++room_count;
	}
	
	for(var i = 0; i < HOUSE_ROWS; i++) {
		for(var j = 0; j < HOUSE_COLS; j++) {
			if ((i == 0 || i == HOUSE_ROWS-1) ||
				(j == 0 || j == HOUSE_COLS-1)) {
				HOUSE_LAYOUT[i][j] = 0;
			}
		}
	}
	
}

function draw_door() {
		ctx.save();	
		ctx.translate(DOOR_X * SQUARE_WIDTH, DOOR_Y * SQUARE_WIDTH);
		
		if (NUMBER_OF_KEYS_LEFT > 0) {
			ctx.beginPath();
			ctx.moveTo(0, SQUARE_WIDTH);
			ctx.lineTo(SQUARE_WIDTH, SQUARE_WIDTH);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#000000";
			ctx.stroke();
		
			ctx.beginPath();
			ctx.arc(SQUARE_WIDTH/2, SQUARE_WIDTH/2, 4, 0, 2 * Math.PI);
			ctx.fillStyle = "#000000";
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo(SQUARE_WIDTH/2, SQUARE_WIDTH/2);
			ctx.lineTo(SQUARE_WIDTH/2, SQUARE_WIDTH/2 + 10);
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#000000";
			ctx.stroke();
		} else {
			
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0,0,SQUARE_WIDTH,SQUARE_WIDTH);
			ctx.save();	
			//ctx.scale(2, 1);
			ctx.beginPath();
			ctx.moveTo(0, SQUARE_WIDTH);
			ctx.lineTo(-SQUARE_WIDTH, SQUARE_WIDTH * 1.5);
			ctx.bezierCurveTo(-SQUARE_WIDTH, SQUARE_WIDTH * 3, SQUARE_WIDTH * 2, SQUARE_WIDTH * 3, SQUARE_WIDTH * 2, SQUARE_WIDTH * 1.5);
			ctx.lineTo(SQUARE_WIDTH, SQUARE_WIDTH);
			
			var fading_gradient = ctx.createRadialGradient(SQUARE_WIDTH/2, SQUARE_WIDTH, SQUARE_WIDTH * 1.5, SQUARE_WIDTH/2, SQUARE_WIDTH, 0);
			fading_gradient.addColorStop(0, 'rgba(255,255,255,0)');
			fading_gradient.addColorStop(0.5, 'rgba(255,255,255,.9)');
			fading_gradient.addColorStop(1, 'rgba(255,255,255,1)');
			ctx.fillStyle = fading_gradient;

			ctx.fill();
			ctx.restore();
		}
		
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, SQUARE_WIDTH/2);
		ctx.arcTo(SQUARE_WIDTH/2,
				-SQUARE_WIDTH*4,
				SQUARE_WIDTH,
				SQUARE_WIDTH/2,
				SQUARE_WIDTH/2);
		ctx.lineTo(SQUARE_WIDTH, 0);
		ctx.closePath();
		ctx.fillStyle = "#000000";
		ctx.fill();
		
		ctx.translate(-DOOR_X * SQUARE_WIDTH, -DOOR_Y * SQUARE_WIDTH);
		ctx.restore();
}