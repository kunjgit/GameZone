/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback, element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}

var ctx;
var canvas = document.getElementById("game");
var key_count = document.getElementById('key-count');
var updateLoop;

var fade_count;

var HEIGHT;
var WIDTH;

var DEBUG;
var GAME_OBJECTS;

var currentGameState;

//Also key count
var NUMBER_OF_KEYS_LEFT;
var NUMBER_OF_ROOMS;

var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;
var enterDown = false;

var MOUSEX;
var MOUSEY;

var GAME_STATES = {
	WIN : 0,
	PLAY : 1,
}

document.onkeydown = function onKeyDown(evt) {
  if (evt.keyCode == 13) enterDown = true;
  if (evt.keyCode == 68) rightDown = true;
  if (evt.keyCode == 65) leftDown = true;
  if (evt.keyCode == 87) upDown = true;
  if (evt.keyCode == 83) downDown = true;
}

document.onkeyup = function onKeyUp(evt) {
  if (evt.keyCode == 13) enterDown = false;
  if (evt.keyCode == 68) rightDown = false;
  if (evt.keyCode == 65) leftDown = false;
  if (evt.keyCode == 87) upDown = false;
  if (evt.keyCode == 83) downDown = false;
}

document.onmousemove = function mouseMove(event) {
	var x = new Number();
    var y = new Number();

    if (event.x != undefined && event.y != undefined) {
		x = event.x;
        y = event.y;
	} else {
		x = event.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
	}
	
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
		
	MOUSEX = x;
	MOUSEY = y;	
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function animateGame() {
	ctx.save();	

    ctx.translate(-player.x + WIDTH/2, -player.y + HEIGHT/2);
		
	if (DEBUG) draw_map();	
	
	player.draw();
	beast.draw();

	for(var i = 0; i < GAME_OBJECTS.length; i++) {
		GAME_OBJECTS[i].draw();
	}
	
	
	draw_shadows();
	
	draw_door();
		
	ctx.translate(player.x - WIDTH/2, player.y - HEIGHT/2);
	ctx.restore();
}

function animateWin() {
	document.body.style.background = "#FFFFFF";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	if (fade_count < 1)	fade_count += 0.005;
	ctx.fillStyle = "rgba(0,0,0," + fade_count + ")";
	ctx.font = "bold 64px Arial";
	ctx.fillText("You Escaped!", WIDTH/2 - 200, HEIGHT/2);
	ctx.font = "bold 24px Arial";
	ctx.fillText("Press the 'Enter' key to replay...", WIDTH/2 - 165, HEIGHT/2 + 40);
	
}

function render() {
	requestAnimationFrame(render);
	clear();
	if (currentGameState == GAME_STATES.PLAY) {
		animateGame();
	} else if (currentGameState == GAME_STATES.WIN) {
		animateWin();
	}
}

function loop() {
	if (currentGameState != GAME_STATES.WIN) {
		player.update();
		beast.update();
	
		for(var i = 0; i < GAME_OBJECTS.length; i++) {
			GAME_OBJECTS[i].update();
		}
	} else {
		if (!beast.source.paused) {
			beast.source.pause();
		}
	}
	if (NUMBER_OF_KEYS_LEFT == 0 && currentGameState != GAME_STATES.WIN) {
		HOUSE_LAYOUT[DOOR_X][DOOR_Y] = 1;
		revealText("goal")
		testWin();
	}
	if (currentGameState == GAME_STATES.WIN && enterDown) {
		initGame();
	}
}

function testWin() {
	var square = translateToSquare(player.x, player.y);
	if (square.x == DOOR_X && square.y == DOOR_Y) {
		currentGameState = GAME_STATES.WIN;
	}
}

function showHelp() {
	document.getElementById('help-link').style.display = "none";
	document.getElementById('help').style.display = "block";
	return false;
}

function revealText(id) {
	var infoPs = document.getElementById('info').getElementsByTagName("p");
	for (var i = 0; i < infoPs.length; i++) {
        infoPs[i].style.display = "none";
    }
	document.getElementById(id).style.display = "block";
}

function initGame() {
	document.body.style.background = "#000000";
	revealText("loading")
	ctx = canvas.getContext("2d");
	fade_count = 0.0;
	
	if (updateLoop != null) clearInterval(updateLoop);
	
	DEBUG = false;
	GAME_OBJECTS = new Array();
	NUMBER_OF_ROOMS = NUMBER_OF_KEYS_LEFT = 6;
	currentGameState = GAME_STATES.PLAY;
	
	ctx.globalAlpha = 1.0;
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	
	key_count.textContent = NUMBER_OF_ROOMS;
	
	beast.init();
	
	init_house();
	
	player.init();
	revealText("objective")
	updateLoop = setInterval(loop, 17);
	window.requestAnimationFrame(render);
		
}

initGame();