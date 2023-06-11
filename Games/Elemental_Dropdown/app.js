// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;
document.body.appendChild(canvas);


// The main game loop
var lastTime;

function main() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	update(dt);
	render();

	lastTime = now;
	requestAnimFrame(main);
};

function gbid(s)
{
	return document.getElementById(s);
}

function init() {
	bgPattern = ctx.createPattern(resources.get(skyImg), 'repeat');

	gbid('play-again').addEventListener('click', function() {
		reset();
	});

	gbid('go').addEventListener('click', function() {
		gbid('title').style.display = 'none';
		gbid('title-overlay').style.display = 'none';
		window.scrollTo(0,1);
	});

	//canvas.addEventListener("mousedown", onMouseDown, false);
        //canvas.addEventListener("mousemove", onMouseMove, false);
        canvas.addEventListener("touchstart", onTouchDown, false);
        canvas.addEventListener("touchmove", onMouseMove, true);
        canvas.addEventListener("touchend", onTouchUp, false);
 
        //document.body.addEventListener("mouseup", onMouseUp, false);
        document.body.addEventListener("touchcancel", onTouchUp, false);

	
	//canvas.addEventListener("mousedown", onMouseDown, false);
	//canvas.addEventListener("mouseup", onMouseUp, false);

	leftButton = {
		pos: [canvas.width * 0.14 , canvas.height * 0.8],
		sprite: new Sprite(leftImg, [0, 0], [50, 50], 1, [0]) };

	rightButton = {
		pos: [canvas.width * 0.35 , canvas.height * 0.8],
		sprite: new Sprite(rightImg, [0, 0], [50, 50], 1, [0]) };

	jumpButton = {
		pos: [canvas.width * 0.8 , canvas.height * 0.8],
		sprite: new Sprite(upImg, [0, 0], [50, 50], 1, [0]) };

	buttonsList = [jumpButton, rightButton, leftButton];

	//resize(canvas);

	reset();
	lastTime = Date.now();
	main();
}

var playerImg = 'player.gif';
var terrainImg = 'terrain_mid.gif';
var fireImg = 'fireSheet.gif';
var windImg = 'windSheet.gif';
var waterImg = 'waterDrop.gif';
var skyImg = 'skyGradient.png';
var rightImg = 'right.gif';
var leftImg = 'left.gif';
var upImg = 'up.gif';

resources.load([
	playerImg,
	terrainImg,
	fireImg,
	windImg,
	waterImg,
	skyImg,
	rightImg,
	leftImg,
	upImg
]);
resources.onReady(init);

function mySprite(x, y, img, sx, sy, sw, sh, sfr, sfrms)
{
	return {
		pos: [x, y],
		sprite: new Sprite(img, [sx, sy], [sw, sh], sfr, sfrms)
	};
}


// Game state
var player = {
	pos: [20, 20],
	sprite: new Sprite(playerImg, [0, 0], [15, 30], 10, [1])
};

var walkLeftFrames = [0, 1];
var walkRightFrames = [2, 3];

var explosions = [];
var groundBlocks = [];
var fire = [];
var air = [];
var water = [];

var waterProjectiles = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var bgPattern;

var score = 0;
var bestScore = 0;
var scoreEl = gbid('score');

// Speed in pixels per second
var playerSpeed = 0;
var playerAccel = 90;
var maxSpeed = 240;

var scrollSpeed = 90;
var gravity = 34;
var jumpPower = 520;
var playerDY = 0;

var MAX_FALL_SPEED = 450;

var WIND = 75;
var WIND_GRAVITY = 26;

//var hitWindTime = 999;
var hasWindPower = false;

var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var jumpReleased = true;

var groundCollisionFlag = false;

var playerHitCeilingFlag = false;
var playerIsGroundedFlag = false;
var playerDir = 1;
var wasGrounded = false;

var leftButton = null;
var rightButton = null;
var jumpButton = null;
var buttonsList = null;

var jumpButtonPressed = false;
var rightButtonPressed = false;
var leftButtonPressed = false;

var hasMoved = false;

var mouseDown = false;
var touchDown = false;
var mouseX = 0;
var mouseY = 0;
var screenTouches = null;

// Update game objects
function update(dt) {


	gameTime += dt;

	wasGrounded = playerIsGroundedFlag;

	playerHitCeilingFlag = false;
	playerIsGroundedFlag = false;

	handleInput(dt);
	updateEntities(dt);

	if(hasMoved)
	{
		// Move everything up.
		scrollEs(groundBlocks, dt);
		scrollEs(fire, dt);
		scrollEs(air, dt);
		scrollEs(water, dt);

		scrollEs([player], dt);

		// Add some new blocks at the bottom.

		var F = 2.5;
		if (Math.floor(gameTime / F) > Math.floor((gameTime - dt) / F)) {
			addFloor(canvas.height + 20 * 5);
		}
	}
	else
	{
		gameTime -= dt;
	}

	checkCollisions();

	if (playerHitCeilingFlag && playerIsGroundedFlag) {
		if (!isGameOver) {
			gameOver();
			fireSound();
		}
	}

	if (!isGameOver) {
		score = Math.floor(gameTime);
		scoreEl.innerHTML = score;
	}
	else {
		if( input.isDown('SPACE')) {
			reset();
		}
	}

};

/*
function rnd()
{
	return Math.random();
}
*/

function addFloor(Y) {
	var tWid = Math.ceil(canvas.width / 20);
	var holeWid = 4;
	var hole1 = Math.floor(Math.random() * tWid) - holeWid / 2;
	var hole2 = Math.floor(Math.random() * tWid) - holeWid / 2;

	var groundY = Y;

	for (var i = 0; i < tWid; i++) {

		Y += Math.floor(Math.random() * 20 - 10);

		if(Math.abs(groundY - Y) > 10)
		{
			groundY = Y;
		}

		// Leaving a hole.
		var hi;

		hi = i - hole1;
		if (hi > 0 && hi < holeWid) continue;

		hi = i - hole2;
		if (hi > 0 && hi < holeWid) continue;

		if (Math.random() < 0.02) continue; // A change to leave a little hole.


		// Add our ground.

		groundBlocks.push(makeGround(i * 20, groundY));

		// Random changes to add other elements.

		// Air
		if (Math.random() < 0.17) {
			var airOffset = Math.random() * 2 + 2;
			air.push({
				pos: [i * 20 + canvas.width * 0.6 , groundY - 20 * airOffset],
				sprite: new Sprite(windImg, [0, 0], [20, 20], 10, randShift([0,1,2,1]))
			});
		}

		// Fire
		if (Math.random() < 1 - Math.pow(.993, gameTime)) {
			// Add a fire obstacle on this tile
			fire.push({
				pos: [i * 20 + 10 - 7.5, groundY - 15],
				sprite: new Sprite(fireImg, [0, 0], [15, 15], 10, shuffle([0,1,2,3]))
			});
		}
		else { // Water

			groundBlocks.push(makeGround(i * 20, groundY-20));
			if (Math.random() < 0.02) {
				water.push({
					pos: [i * 20, groundY - 20 * 2],
					sprite: new Sprite(waterImg, [0, 0], [20, 20], 1, [0])
				});
			}
		}
	}
};

// FOUND CODE
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
    return o;
};
//

function randShift(arr)
{
	var r = Math.floor(Math.random() * arr.length);
	for(var i = 0; i < r; i++)
	{
		var n = arr[0];	
		arr.splice(0, 1);
		arr.push(n);
	}
	return arr;
}

function makeGround(X, Y) {
	return {
		pos: [X, Y],
		sprite: new Sprite(terrainImg, [0, 0], [20, 20], 1, [0])
	};
}

function handleInput(dt) {

	leftButtonPressed = false;
	rightButtonPressed = false;
	jumpButtonPressed = false;

	updateMouseInput(screenTouches);

	leftPressed = input.isDown('LEFT') || input.isDown('a') || leftButtonPressed;
	rightPressed = input.isDown('RIGHT') || input.isDown('d') || rightButtonPressed;
	jumpPressed = input.isDown('SPACE') || input.isDown('UP') || input.isDown('w') || jumpButtonPressed;

	if (!jumpPressed) {
		jumpReleased = true;
	}

	var prevHasMoved = hasMoved;

	hasMoved = hasMoved || (leftPressed || rightPressed || jumpPressed);

	if(hasMoved && ! prevHasMoved)
	{
		gbid('title').style.display = 'none';
		gbid('title-overlay').style.display = 'none';
		window.scrollTo(0,1);
	}
}

function updateEntities(dt) {
	// Update the player sprite animation
	// NOTE: There is some framerate dependent stuff going on here.

	player.sprite.update(dt);

	// Gravity
	var targX = player.pos[0];
	var targY = player.pos[1];

	var G = gravity;
	if(hasWindPower)
	{
		G = WIND_GRAVITY;
	}

	playerDY += G;

	if (hasWindPower) {
		if (playerDY > WIND) {
			playerDY = WIND; // Slow falling with wind power.
		}
	} else if (playerDY > MAX_FALL_SPEED) {
		playerDY = MAX_FALL_SPEED;
	}

	targY += playerDY * dt;

	var dir = 0;

	if (leftPressed) dir = -1;
	if (rightPressed) dir = 1;

	playerDir = dir;

	playerSpeed += dir * playerAccel;
	playerSpeed *= 0.7; // Friction
	if (Math.abs(playerSpeed) > maxSpeed) playerSpeed = dir * maxSpeed;

	targX += playerSpeed * dt;

	// Move X
	var prev = player.pos[0];
	player.pos[0] = targX;
	if (collideEntities(player, groundBlocks) != null) {
		player.pos[0] = prev;
	}

	// Move Y
	groundCollisionFlag = false;
	prev = player.pos[1];

	var moveDist = targY - player.pos[1];
	dir = sign(moveDist);
	moveDist = Math.abs(moveDist);

	var i;
	for (i = 0; i < moveDist; i++) {
		player.pos[1] += dir;
		if (collideEntities(player, groundBlocks) != null) {
			playerDY = 0;
			player.pos[1] -= dir;
			break;
		}
	}

	if (groundCollisionFlag) {
		hasWindPower = false;
		playerIsGroundedFlag = true;
	}

	if (!wasGrounded && playerIsGroundedFlag) {
		hitGroundSound();
	}

	if (jumpPressed && jumpReleased && groundCollisionFlag) {
		playerDY = -jumpPower;
		jumpReleased = false;
		jumpSound();
	}


	// The wind entities move around a bit

	var windOffset = pingpong(Math.sin(gameTime), 3) - 1.5;

	for(i = 0; i < air.length; i++)
	{
		var sprite = air[i];	
		sprite.pos[0] += windOffset;

		if(sprite.pos[0] < -20)
		{
			sprite.pos[0] = canvas.width + 20;
		}
	}

	// Water projectile entities go towards their target fires

	for(i = 0; i < waterProjectiles.length; i++)
	{
		var w = waterProjectiles[i];
		var S = 500;
		
		var dist = distance(w.pos, w.target);

		if(dist < 5)
		{
			waterProjectiles.splice(i, 1);
			i--;
		}
		else
		{
			var percMove = (S * dt) / dist;
			w.pos[0] = lerp(w.pos[0], w.target[0], percMove);
			w.pos[1] = lerp(w.pos[1], w.target[1], percMove);
		}
	}

	for(i = 0; i < fire.length; i++)
	{
		fire[i].sprite.update(dt);
	}

	for(i = 0; i < air.length; i++)
	{
		air[i].sprite.update(dt);
	}
}

function distance(p1, p2)
{
	var d1 = p1[0] - p2[0];
	var d2 = p1[1] - p2[1];
	return Math.sqrt(d1*d1 + d2*d2);
}

function lerp(a, b, t)
{
	return a + ((b - a) * t);
}

function pingpong(X, amnt)
{
	var amntX2 = amnt * 2;
	while(X > amntX2)
	{
		X -= amntX2;
	}
	if(X > amnt) X = amntX2 - X;
	return X;
}

function sign(X) {
	if (X > 0) return 1;
	else if (X < 0) return -1;
	else return 0;
}

function scrollEs(entities, dt) {
	for (var i = entities.length - 1; i >= 0; i--) {
		var e = entities[i];
		e.pos[1] -= Math.floor(dt * scrollSpeed);

		if (e.pos[1] < -e.sprite.size[1]) {
			entities.splice(i, 1);
		}
	}
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
	var collides = !(r <= x2 || x > r2 || b <= y2 || y > b2);

	if (collides && !(y < b2)) {
		groundCollisionFlag = true;
	}

	return collides;
}

function boxCollides(pos, size, pos2, size2) {
	return collides(pos[0], pos[1],
		pos[0] + size[0], pos[1] + size[1],
		pos2[0], pos2[1],
		pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
	checkPlayerBounds();

	if (!hasWindPower && !playerIsGroundedFlag) {
		if (collideEntities(player, air) != null) {
			hasWindPower = true;
			windSound();
		}
	}

	var hitWater = collideEntities(player, water);
	if (hitWater != null)
	{
		if (fire.length > 0) {
			// Shoot water at all the fire spaces.
			for(var i = 0; i < fire.length; i++)
			{
				waterProjectiles.push({
					pos: [hitWater.pos[0], hitWater.pos[1]],
					sprite: new Sprite(waterImg, [0, 0], [20, 20], 1, [0]),
					target: [fire[i].pos[0], fire[i].pos[1]]
				});
			}
			fire = [];
			waterSound();
		}
	}

	if (!isGameOver) {
		if (collideEntities(player, fire) != null) {
			gameOver();
			fireSound();
			return;
		}
	}
}

function collideEntities(obj, objList) {
	// TODO: Grid based neighbors or something...
	var L = objList.length;
	for (var i = 0; i < L; i++) {
		var b = objList[i];
		if (boxCollides(b.pos, b.sprite.size, obj.pos, obj.sprite.size)) {
			return b;
		}
	}
	return null;
}

function checkPlayerBounds() {
	// Check bounds
	if (player.pos[0] < 0) {
		player.pos[0] = 0;
	} else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
		player.pos[0] = canvas.width - player.sprite.size[0];
	}

	if (player.pos[1] < 0) {
		player.pos[1] = 0;
		playerHitCeilingFlag = true;
		if (playerDY < 0) {
			playerDY = 0;
		}

	} else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
		player.pos[1] = canvas.height - player.sprite.size[1] - 1;
		if (!isGameOver) {
			gameOver();
			fireSound();
		}
	}
}

// Draw everything
function render() {
	ctx.fillStyle = bgPattern;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	renderEs(groundBlocks);
	renderEs(fire);
	renderEs(air);
	renderEs(water);
	renderEs(waterProjectiles);

	// Render the player if the game isn't over
	if (!isGameOver) {

		if (playerDir > 0) {
			player.sprite.frames = walkLeftFrames;
		} else if (playerDir < 0) {
			player.sprite.frames = walkRightFrames;
		} else {
			if (player.sprite.frames == walkLeftFrames) {
				player.sprite.frames = [1];
			} else if (player.sprite.frames == walkRightFrames) {
				player.sprite.frames = [2];
			}
		}


		renderEs([player]);
	}

	renderEs(buttonsList);


};

function renderEs(list) {
	for (var i = 0; i < list.length; i++) {
		//renderEntity(list[i]);
		var entity = list[i];
		ctx.save();
		ctx.translate(entity.pos[0], entity.pos[1]);
		entity.sprite.render(ctx);
		ctx.restore();
	}
}

//function renderEntity(entity) {
//}

// Game over
function gameOver() {
	gbid('game-over').style.display = 'block';
	gbid('game-over-overlay').style.display = 'block';


	if(score > bestScore)
	{
		bestScore = score;
	}

	gbid('end-score').innerHTML = "Final Score: " + score;
	gbid('best-score').innerHTML = "Best Score: " + bestScore;
	isGameOver = true;
}

// Reset game to original state
function reset() {

	window.scrollTo(0,1);

	gbid('game-over').style.display = 'none';
	gbid('game-over-overlay').style.display = 'none';

	gbid('title').style.display = 'block';
	gbid('title-overlay').style.display = 'block';

	isGameOver = false;
	gameTime = 0;
	score = 0;

	player.pos = [20, 20];


	groundBlocks = [];
	fire = [];
	air = [];
	water = [];

	hasWindPower = false;

	groundBlocks.push(makeGround(player.pos[0], player.pos[1] + 20 * 4));


	addFloor(canvas.height * 0.75);
	addFloor(canvas.height * 1.2);

	hasMoved = false;

};

/*
function onMouseDown(event)
{
	mouseDown = true;
	onMouseMove(event);
}

function onMouseUp(event)
{
	mouseDown = false;
}
*/

function onMouseMove(event)
{
	mouseX = event.pageX;
	mouseY = event.pageY;
	screenTouches = event.touches;
}

function onTouchDown(event)
{
	onMouseMove(event);
}

function onTouchUp(event)
{
	onMouseMove(event);
}

function updateMouseInput(touches)
{
	if(touches == null) return;

	for(var i = 0; i < touches.length; i++)
	{
		var btn = nearestButton(touches[i].pageX, touches[i].pageY, buttonsList);

		if(btn == jumpButton)
		{
			jumpButtonPressed = true;
		}
		else if(btn == rightButton)
		{
			rightButtonPressed = true;
		}
		else if(btn == leftButton)
		{
			leftButtonPressed = true;
		}
	}
}

function nearestButton(X, Y, btns)
{
	//var X = touch.pageX;
	//var Y = touch.pageY;

	X -= canvas.offsetLeft;

	X /= (720.0 / 480.0);
	Y /= (480.0 / 320.0);

	var dist = 999999;
	var btn = null;
	for(var i = 0; i < btns.length; i++)
	{
		var d = distSquared(X, Y, btns[i].pos[0], btns[i].pos[1]);
		if(d < dist)
		{
			dist = d;
			btn = btns[i];
		}
	}

	return btn;

	/*
	if(contains(jumpButton, X, Y)) {
		jumpButtonPressed = true;
	}

	if(contains(rightButton, X, Y)) {
		rightButtonPressed = true;
	}

		if(contains(leftButton, X, Y)) {
			leftButtonPressed = true;
		}
		*/
}

function distSquared(X1, Y1, X2, Y2)
{
	var d1 = X1 - X2;
	var d2 = Y1 - Y2;
	return d1 * d1 + d2 * d2;
}

/*
function contains(s, X, Y)
{
	return X > s.pos[0] && X < s.pos[0] + s.sprite.size[0] &&
		Y > s.pos[1] && Y < s.pos[1] + s.sprite.size[1];
}
*/

//function resize(canvas) { // TODO: remove this function
//}


// Audio calls.
var soundsHashtable = {};

function playSound(key, arr) {
	if (soundsHashtable[key] != null) {
		soundsHashtable[key].play();
	} else {
		var soundURL = jsfxr(arr);
		var player = new Audio();
		player.src = soundURL;
		player.play();

		soundsHashtable[key] = player;
	}
}

function fireSound() {
	playSound('fire', [3, , 0.3801, 0.6534, 0.2899, 0.2148, , -0.0684, , , , 0.3938, 0.8769, , , 0.7486, , , 1, , , , , 0.34]);
}

function hitGroundSound() {
	playSound('hitGround', [1, , 0.0308, , 0.2874, 0.502, , -0.6323, , , , , , , , , , , 1, , , , , 0.34]);
}

function jumpSound() {
	playSound('jump', [0, , 0.2733, , 0.1748, 0.3053, , 0.2171, , , , , , 0.2731, , , , , 0.6673, , , , , 0.5]);
}

function waterSound() {
	playSound('water', [2, 0.0017, 0.36, 0.4096, 0.09, 0.36, , 0.3799, -0.46, , , -0.46, , , -0.0954, 0.61, , 0.176, 0.619, 0.4429, 0.7347, 0.453, 0.0002, 0.23]);
}

function windSound() {
	playSound('wind', [3, 0.1899, 0.46, 0.1199, 0.2224, 0.624, , , -0.043, , 0.2215, 0.0572, 0.8233, 0.0504, 0.1193, , 0.0533, -0.1569, 0.9984, 0.0244, , 0.1093, 0.0001, 0.25]);
}
