// anthony cosgrave
// js13k 2013 contest entry 
// theme: 'bad luck'
(function () {
	var lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			                           timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

(function() {
	"use strict";
	var cvs;
	var ctx;
	var WIDTH;
	var HEIGHT;
	var STATE = {LOAD:0, MENU:1, GAME:2, PAUSED:3, OVER:4};
	var pauseColour = ['#000', '#FF0'];
	var currentPauseColourIndex = 0;
	var pauseWaitTime = 50;
	var currentState = STATE.LOAD;
	// ************************************************************************
	// PLAYER.
	var player = {};
	var gun = {};
	var bullet = {};
	var BULLET_DAMAGE = 10;
	//
	// ************************************************************************
	var particles = [];
	// ************************************************************************
	// CATS
	var RADIUS = 140;
	var cats = [];
	var catImage = new Image();
	var MIN_CAT_SPEED = 1.5;
	var MAX_CAT_SPEED = 2.75;
	var MAX_CAT_RADIUS = 10;
	var CAT_DAMAGE = 10;
	// cat attack types.
	// BASIC : spawns on the circumference and waits before attacking.
	// PROWLER : orbits the circumference before attacking.
	// DIRECT : spawns and attacks directly.
	var ATTACK = {BASIC:0, PROWLER:1, DIRECT:2};
	// rotational direction for prowler cats.
	var DIRECTION = {NONE: 0,CLOCK:1, ANTI:-1};
	// ticker for when to spawn the next cat.
	var catSpawnTime = 300;
	// current elapsed 'time' until the next spawn.
	var spawnTimer = 0;
	// how long a basic cat waits before attacking.
	var catWaitTimeBasic = 50;
	// how long a prowler cat prowls the circumference.
	var catWaitTimeProwler = 150;
	// how long a direct attack cat waits.
	var catWaitTimeDirect = 20;
	// ************************************************************************

	// ************************************************************************
	// BOMBERS
	var bomberImage = new Image();
	// collection for the bomber objects (they sit on the circumference and fire at the player).
	var bombers = [];
	// multiple bombers could fire multiple bullets.
	var bullets = [];
	var bulletColours = ['#B22222', '#9A1D1D', '#801818', '#F2870B', '#FFF802', '#4D0F0F'];
	var BOMBER_SHOOT_TIME = 300;
	var bomberSpawnTimer = 0;
	// bombers should spawn at quite long intervals.
	var BOMBER_SPAWN_TIME = 700;
	var BOMB_DAMAGE = CAT_DAMAGE * 2;
	// ************************************************************************

	// ************************************************************************
	// LUCK
	var LUCK_X = 0;
	var LUCK_Y = 0;
	var LUCK_METER_HEIGHT = 200;
	var LUCK_TARGET_X = 0;
	var LUCK_TARGET_Y = 0;
	var LUCK_TARGET_RADIUS = 25;
	var scores = [];
	var time = 0;
	var totalSeconds = 0;
	var currentElapsedTime = 0;
	var currentLongest = 0;
	var hasStorage = false;
	var appKey = "js13kmw";
	var longestSaved = false;
	// ************************************************************************

	// ************************************************************************
	// SPAWNING
	// current wave counter.
	var waveCounter = 1;
	// how many cats have been spawned this wave.
	var spawnCounter = 0;
	// how many cats to spawn per wave.
	var spawnPerWave = 8;
	// ************************************************************************
	var imageLoadedCount = 0;

	/**
	 * Get access to the canvas object and bind event listeners for mouse movement.
	 */
	function init() {
		waveCounter = 5;
		cvs = document.getElementById('c');
		ctx = cvs.getContext('2d');
		// prevent double click selecting anything on the page
		document.onselectstart = function (e) { e.preventDefault(); return false; };
		ctx.textAlign = 'left';
		WIDTH = cvs.width;
		HEIGHT = cvs.height;
		LUCK_X = WIDTH - 75;
		LUCK_Y = HEIGHT/4;
		LUCK_TARGET_X = LUCK_X + 25;
		LUCK_TARGET_Y = LUCK_Y+(LUCK_METER_HEIGHT/2);
		catImage.onload = function() {imageLoadedCount++;};
		bomberImage.onload = function() {imageLoadedCount++;};
		catImage.src = "img/cat.png";
		bomberImage.src = "img/bomber.png";
		window.addEventListener('mousemove', mouseMove, false);
		window.addEventListener('mouseup', mouseUp, false);
		window.addEventListener('keyup', keyUp, false);
		spawnTimer = catSpawnTime;
		// get previous longest time from localstorage
		if (window.localStorage) {
			currentLongest = localStorage.getItem(appKey+'long');
			hasStorage = true;
		}
		createPlayer();
		createBombers();
		// all set?
		update();
	}

	/**
	 * Generate a random number within a range.
	 * @param min minimum value of the range.
	 * @param max maximum value of the range.
	 * @return {Number}
	 */
	function randomNumber (min, max) {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Set up player x, y, radius and luck.
	 * Set up gun position, radius and angle of rotation.
	 */
	function createPlayer() {
		player = {x: WIDTH/2, y:HEIGHT/2, radius:10, luck:50, score:0};
		gun = {x: WIDTH/2, y:(HEIGHT/2 + player.radius), radius:5, angle:0};
	}

	/**
	 *  Spawn a new cat - x, y, angle of rotation, attack type and wait time.
	 */
	function createCat() {
		// pick an angle at random
		var angle = Math.floor(Math.random() * 360);
		var x = WIDTH/2 + (RADIUS * Math.cos(angle));
		var y = HEIGHT/2 + (RADIUS * Math.sin(angle));
		// rotate to face the player...
		angle = toDegrees(Math.atan2(player.y - y, player.x-x));
		// wave 1 : basic attacking cats
		var type, r, waitTime;
		var dir = DIRECTION.NONE;
		r = Math.floor(Math.random() * 50);
		var speed = MIN_CAT_SPEED;

		if (waveCounter === 1) {
			type = ATTACK.BASIC;
			waitTime = catWaitTimeBasic;
		}
		else if (waveCounter === 2) {
			// wave 2 : add in some prowlers
			type = (r % 2 === 0) ? ATTACK.BASIC : ATTACK.PROWLER;
			waitTime = (type === ATTACK.BASIC)? catWaitTimeBasic : catWaitTimeProwler + randomNumber(1, 300);
		}
		else if (waveCounter === 3) {
			// wave 3 : add in some direct attackers
			type = (r % 2 === 0) ? ATTACK.PROWLER : ATTACK.DIRECT;
			waitTime = (type === ATTACK.PROWLER)? catWaitTimeProwler + randomNumber(1, 400) : catWaitTimeDirect;

			speed = randomNumber(MIN_CAT_SPEED, MAX_CAT_SPEED);
		}
		else {
			// wave 4+ : listen to your heart, as long as it's saying
			// prowlers and direct attackers.
			if (r <= 5)
			{
				// a small amount of the basic attack cats.
				type = ATTACK.BASIC;
				waitTime = catWaitTimeBasic;
			}
			else if (r > 5 && r <= 25)
			{
				type = ATTACK.PROWLER;
				waitTime = catWaitTimeProwler + randomNumber(1, 250);
			}
			else
			{
				type = ATTACK.DIRECT;
				waitTime = catWaitTimeDirect;
			}
			speed = randomNumber(MIN_CAT_SPEED, MAX_CAT_SPEED);
		}

		dir = DIRECTION.CLOCK;

		if (type === ATTACK.PROWLER) {
			// anti clockwise if an even number
			if (r % 2 === 0) {
				dir = DIRECTION.ANTI;
			}
		}

		cats.push({x:x, y:y, direction:dir, angle:angle,
			          radius:MAX_CAT_RADIUS, isWaiting: true, waitTime:waitTime,
			          vx:0, vy:0, speed:speed, damage:CAT_DAMAGE,
			          isActive: true, type:type, colour:'#000'});
	}

	/**
	 * Creates 4 'bomber' entities at the 4 cardinal points, each bomber
	 * has health and as that deteriorates the bomber 'fades' off screen.
	 */
	function createBombers() {
		for (var b = 0; b < 4; b++) {
			var angle = b * toRadians(90);
			var x = WIDTH/2 + (RADIUS * Math.cos(angle));
			var y = HEIGHT/2 + (RADIUS * Math.sin(angle));
			// rotate to face the player...
			angle = toDegrees(Math.atan2(player.y - y, player.x-x));
			bombers.push({x:x, y:y, angle:angle, health:100, alpha:1, radius:10, shootTime:BOMBER_SHOOT_TIME, isActive:false});
		}
	}

	/**
	 * Boom!
	 * @param x horizontal coordinate.
	 * @param y vertical coordinate.
	 * @param type explosion type.
	 * @param colour base colour of the explosion.
	 */
	function createExplosion(x, y, type, colour) {

		var s = 5;
		var l = 10;
		var t = 10;

		if (type === 'bomber') {
			t *= 4;
		}

		for (var i = 0; i < t;i++)
		{
			var angle = randomNumber(1, 360);
			var speed = Math.floor(Math.random() * s /2 ) + s;
			var life = Math.floor(Math.random()* l) + l/2;
			var radians = angle * Math.PI/ 180;
			var xunits = Math.cos(radians) * speed;
			var yunits = Math.sin(radians) * speed;

			var width = 8;
			var height = 8;
			if (type === 'shot') {
				width = height = 4;
			}
			else if (type === 'bomber') {
				width = height = 10;
			}
			// set the x and y values based on the selected A centre and the
			// selected y centres.
			particles.push({x:x,
				                    y:y,
				                    xunits:xunits,
				                    yunits:yunits,
				                    life:life,
				                    colour:colour,
				                    width:width,
				                    height:height,
				                    gravity:0.5,
				                    moves:0,
				                    alpha:1,
				                    maxLife:life});
		}
	}

	/**
	 * Create a new score object.
	 * @param x horizontal coordinate.
	 * @param y vertical coordinate.
	 * @param score the text to display.
	 */
	function createScore(x, y, score) {
		var angle = toDegrees(Math.atan2(LUCK_Y + (LUCK_METER_HEIGHT/2) - y, LUCK_X-x));
		scores.push({x:x, y:y, text:'+'+score, radius:20, angle:angle, vx:0, vy:0, speed:0.5, isActive:true, wait:30});
	}

	/**
	 * Where the magic happens.
	 */
	function update() {

		switch (currentState)
		{
			case STATE.GAME:
				updateCats();
				updateBombers();
				updateBomberBullets();
				updatePlayer();
				updateBullets();
				updateParticles();
				checkForCollisions();
				updateScores();
				break;
			case STATE.MENU:
				break;
			case STATE.PAUSED:
				if (pauseWaitTime === 0) {
					if (currentPauseColourIndex < pauseColour.length-1){
						currentPauseColourIndex++;
					}
					else {
						currentPauseColourIndex = 0;
					}
					pauseWaitTime = 50;
				}
				else {
					pauseWaitTime--;
				}
				break;
			case STATE.OVER:
				if (!longestSaved) {
					if (totalSeconds > currentLongest) {
						localStorage.setItem(appKey+"long", totalSeconds);
					}
					longestSaved = true;
				}
				break;
			case STATE.LOAD:
				if (imageLoadedCount === 2) {
					changeState(STATE.MENU);
				}
				break;
		}

		render();
		requestAnimationFrame(update);
	}

	/**
	 * Make the magic pictures move!
	 */
	function render() {
		ctx.fillStyle = '#FFF';//'#444';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.fillStyle = 'black';
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.fillStyle = '#CCC';
		ctx.arc(WIDTH/2, HEIGHT/2, RADIUS, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();

		switch (currentState)
		{
			case STATE.GAME:
				drawPlayer();
				drawLuck();
				ctx.lineWidth = 1.0;
				drawCats();
				drawBullets();
				drawBombers();
				drawParticles();
				drawScores();
				break;
			case STATE.MENU:
				writeTextOnCircle('MEE-OOOWWWW!',WIDTH/2, HEIGHT/2,RADIUS + 20, 1, 42, '#000');
				writeTextOnCircle('PRESS ENTER TO START', WIDTH/2, HEIGHT/2, RADIUS + 10, 0, 18, '#000');
				ctx.save();
				ctx.translate(WIDTH/2 - (catImage.width/2), HEIGHT/2 - (catImage.height/2));
				writeText('kill to ward off bad luck!', -65, -20, 18, '#000', false);
				writeText('kill these too!', -30, 35, 18, '#000', false);
				ctx.rotate(toRadians(90));
				ctx.translate(-(catImage.width/2), -(catImage.height/2));
				ctx.drawImage(catImage, -25, 80);
				ctx.drawImage(bomberImage, 25, 45, 25, 25);
				ctx.restore();
				break;
			case STATE.PAUSED:
				writeTextOnCircle('PAUSED!',WIDTH/2, HEIGHT/2,RADIUS + 20, 1, 42, pauseColour[currentPauseColourIndex]);
				writeText('PRESS SPACEBAR TO RESUME', WIDTH/2, HEIGHT/2, 18, '#000', true);
				break;
			case STATE.OVER:
				writeTextOnCircle('GAME OVER!',WIDTH/2, HEIGHT/2,RADIUS + 20, 1, 42, '#000');
				writeText('YOUR LUCK LASTED FOR ' + totalSeconds + ' SECONDS!', WIDTH/2, HEIGHT/2, 18, '#000', true);
				if (hasStorage) {
					if (totalSeconds > currentLongest) {
						writeText('YOUR LUCKIEST YET!', WIDTH/2, HEIGHT/2 + 40, 18, '#00F', true);
					}
					else {
						writeText('YOU\'VE BEEN LUCKIER! (' + currentLongest + ' s)', WIDTH/2, HEIGHT/2 + 40, 18, '#000', true);
					}
				}
				writeTextOnCircle('PRESS ENTER FOR MENU',WIDTH/2, HEIGHT/2, RADIUS, 0, 18, pauseColour[currentPauseColourIndex]);
				break;
			case STATE.LOAD:
				break;
		}
	}

	/**
	 * Update player logic.
	 */
	function updatePlayer() {
		if (player.luck <= 0) {
			changeState(STATE.OVER);
		}
	}

	/**
	 * Handle cat spawning and wave updating.
	 * When the cat spawn timer runs out, spawn a new cat.
	 */
	function updateCats() {

		// time to spawn a new one?
		if (spawnTimer === 0) {
			createCat();
			if (spawnCounter < spawnPerWave) {
				spawnCounter++;
			}
			else {

				spawnCounter = 0;
				waveCounter++;
				if (catSpawnTime > 100) {
					// speed up the spawning process.
					catSpawnTime -= 100;
				}
				else {
					// very fast.
					catSpawnTime = 75;
				}
			}
			spawnTimer = catSpawnTime;
		}
		else {
			spawnTimer--;
		}

		for (var c = 0; c < cats.length; c++) {
			if (cats[c].isActive) {
				if (!cats[c].isWaiting)
				{
					var cos = Math.cos(toRadians(cats[c].angle));
					var sin = Math.sin(toRadians(cats[c].angle));
					cats[c].vx = cos * cats[c].speed;
					cats[c].vy = sin * cats[c].speed;
					cats[c].x += cats[c].vx;
					cats[c].y += cats[c].vy;
				}
				else
				{
					cats[c].waitTime--;

					switch (cats[c].type) {
						case ATTACK.BASIC:
							// will just sit on the circumference and wait.
							break;
						case ATTACK.PROWLER:
							// speed/radius
							// move around the circumference
							if (cats[c].direction === DIRECTION.CLOCK) {
								cats[c].angle += Math.acos(1-Math.pow(cats[c].speed/RADIUS, 2) / 2);
							}
							else {
								cats[c].angle -= Math.acos(1-Math.pow(cats[c].speed/RADIUS, 2) / 2);
							}
							cats[c].x = WIDTH/2 + RADIUS * Math.cos(cats[c].angle);
							cats[c].y = HEIGHT/2 + RADIUS * Math.sin(cats[c].angle);
							break;
						case ATTACK.DIRECT:
							// no waiting.
							cats[c].waitTime = 0;
							break;
//						default:
//							console.log('UNKNOWN CAT ATTACK: ' + cat[c].type);
					}

					if (cats[c].waitTime <= 0) {
						// attack!
						cats[c].isWaiting = false;
						// make sure to rotate to face player before attacking.
						cats[c].angle = toDegrees(Math.atan2(player.y - cats[c].y, player.x-cats[c].x));
					}
				}
			}
		}
	}

	/**
	 * Move each score towards the Luck meter, removing them upon collision.
	 */
	function updateScores() {
		for (var s = 0; s < scores.length; s++) {
			if (scores[s].isActive) {
				if (scores[s].wait == 0) {
					scores[s].vx += Math.cos(toRadians(scores[s].angle)) * scores[s].speed;
					scores[s].vy += Math.sin(toRadians(scores[s].angle)) * scores[s].speed;
					scores[s].x += scores[s].vx;
					scores[s].y += scores[s].vy;
				}
				else {
					scores[s].wait--;
				}
			}
		}
	}

	/**
	 * Loop through the bombers that are active, shooting at the player accordingly.
	 * If the wave count is high enough randomly choose a bomber.
	 */
	function updateBombers() {

		// what's the wave count?
		if (waveCounter >= 5) {

			if (bomberSpawnTimer === 0) {

				var allActive = true;
				for (var a = 0; a < bombers.length; a++) {
					if (!bombers[a].isActive) {
						allActive = false;
						break;
					}
				}

				if (!allActive) {
					var r = 0;

					do
					{
						r = Math.floor(randomNumber(0, bombers.length));
					}
					while (bombers[r].isActive);

					bombers[r].isActive = true;
					bombers[r].health = 100;
					bombers[r].shootTime = BOMBER_SHOOT_TIME;
					bomberSpawnTimer = BOMBER_SPAWN_TIME;
				}
			}
			else {
				bomberSpawnTimer--;
			}
		}

		for (var b = 0; b < bombers.length; b++) {
			if (bombers[b].isActive) {
				if (bombers[b].health <= 0)
				{
					createExplosion(bombers[b].x, bombers[b].y, 'bomber', bulletColours[0]);
					bombers[b].isActive = false;
				}
				else {
					if (bombers[b].shootTime === 0) {
						bomberShoot(b);
						bombers[b].shootTime = BOMBER_SHOOT_TIME;
					}
					else {
						bombers[b].shootTime--;
					}
				}
			}
		}
	}

	/**
	 * Update particles life time and position.
	 */
	function updateParticles() {
		for (var p= particles.length-1; p>= 0;p--)
		{
			particles[p].moves++;
			particles[p].x += particles[p].xunits;
			particles[p].y += particles[p].yunits;
			particles[p].life--;

			if (particles[p].life <= 0 )
			{
				particles.splice(p,1);
			}
		}
	}

	/**
	 * Update bullet velocity and position.
	 */
	function updateBullets() {
		if (bullet.isActive) {
			bullet.vx += Math.cos(toRadians(bullet.angle)) * bullet.speed;
			bullet.vy += Math.sin(toRadians(bullet.angle)) * bullet.speed;
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;
		}
	}

	/**
	 * Keep any active bomber bullets moving in the correct direction.
	 */
	function updateBomberBullets() {
		for (var b = 0; b < bullets.length; b++)
		{
			if (bullets[b].isActive) {
				bullets[b].vx += Math.cos(toRadians(bullets[b].angle)) * 0.005;
				bullets[b].vy += Math.sin(toRadians(bullets[b].angle)) * 0.005;
				bullets[b].x += bullets[b].vx;
				bullets[b].y += bullets[b].vy;
			}
		}
	}

	/**
	 * Fire a bullet and create an explosion.
	 */
	function shoot() {
		bullet = {x:gun.x, y:gun.y, radius:4, colour:'#000', angle:gun.angle, speed:2, vx:0, vy:0, isActive:true};
		createExplosion(bullet.x, bullet.y, 'shot', 'orange');
	}

	/**
	 * Fire a shot from one of the bombers.
	 * @param index the bomber that'll fire.
	 */
	function bomberShoot(index) {
		bullets.push({x:bombers[index].x, y:bombers[index].y, radius:6, colourIndex:0, angle:bombers[index].angle, speed:1, vx:0, vy:0, isActive:true});
	}

	/**
	 * Check for collision between cats and the player's path.
	 */
	function checkForCollisions() {
		var minDistance;
		var xDist;
		var yDist;
		var distance;
		for (var c = 0; c < cats.length; c++) {
			if (cats[c].isActive) {

				if (bullet.isActive) {
					// bullet - cat collision
					minDistance = bullet.radius + cats[c].radius;
					xDist = cats[c].x - bullet.x;
					yDist = cats[c].y - bullet.y;
					distance = Math.sqrt(xDist*xDist + yDist*yDist);

					if (distance < minDistance) {
						// cat bullet collision
						cats[c].colour = '#00F';
						cats[c].isActive = false;
						bullet.isActive = false;
						createScore(cats[c].x, cats[c].y, 5);
						createExplosion(cats[c].x, cats[c].y, 'ball', '#EB1010');
					}
				}

				// player - cat
				minDistance = player.radius + cats[c].radius;
				xDist = cats[c].x - player.x;
				yDist = cats[c].y - player.y;
				distance = Math.sqrt(xDist*xDist + yDist*yDist);

				if (distance < minDistance) {
					// collision
					cats[c].colour = '#F00';
					player.luck -= CAT_DAMAGE;
					cats[c].isActive = false;
				}
			}
		}

		// bullet - bomber
		for (var b = 0; b < bombers.length; b++) {
			if (bombers[b].isActive) {
				if (bullet.isActive) {
					minDistance = bullet.radius + bombers[b].radius;
					xDist = bombers[b].x - bullet.x;
					yDist = bombers[b].y - bullet.y;
					distance = Math.sqrt(xDist*xDist + yDist*yDist);

					if (distance < minDistance) {
						bombers[b].health -= BULLET_DAMAGE;
						bullet.isActive = false;
						createExplosion(bullet.x, bullet.y, '', bulletColours[0]);
						break;
					}
				}
			}
		}

		// player - bomber bullet
		for (var b = 0; b < bullets.length; b++) {

			//
			if (bullets[b].isActive) {
				minDistance = player.radius + bullets[b].radius;
				xDist = bullets[b].x - player.x;
				yDist = bullets[b].y - player.y;
				distance = Math.sqrt(xDist*xDist + yDist*yDist);

				if (distance < minDistance) {
					bullets[b].isActive = false;
					player.luck -= BOMB_DAMAGE;
				}
			}

			// bullet - bomber bullet
			if (bullets[b].isActive) {
				if (bullet.isActive) {
					minDistance = bullet.radius + bullets[b].radius;
					xDist = bullets[b].x - bullet.x;
					yDist = bullets[b].y - bullet.y;
					distance = Math.sqrt(xDist*xDist + yDist*yDist);

					if (distance < minDistance) {
						bullets[b].isActive = false;
						bullet.isActive = false;
						createExplosion(bullets[b].x, bullets[b].y, '', bulletColours[bullets[b].colourIndex]);
						break;
					}
				}
			}
		}

		// score - luck meter
		for (var s = 0; s < scores.length; s++) {
			if (scores[s].isActive) {
				minDistance = LUCK_TARGET_RADIUS + scores[s].radius;
				xDist = scores[s].x - LUCK_TARGET_X;
				yDist = scores[s].y - LUCK_TARGET_Y;
				distance = Math.sqrt(xDist*xDist + yDist*yDist);

				if (distance < minDistance) {
					if (player.luck < 200) {
						player.luck += 5;
					}

					scores[s].isActive = false;
				}
			}
		}
	}

	/**
	 * Calculate the angle of rotation between the player and a target.
	 * @param target the coordinates to rotate towards.
	 */
	function rotateToFace(target) {
		var angle = Math.atan2(target.y - gun.y, target.x - gun.x);
		// atan2 returns radians so convert to degrees
		gun.angle = toDegrees(angle);
		gun.x = WIDTH/2 + (player.radius * Math.cos(toRadians(gun.angle)));
		gun.y = HEIGHT/2 + (player.radius * Math.sin(toRadians(gun.angle)));
	}

	/**
	 * Draw the player and gun with the correct rotation.
	 */
	function drawPlayer() {

		ctx.fillStyle = '#EEE';
		ctx.beginPath();
		ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();

		// gun
		ctx.beginPath();
		ctx.arc(gun.x, gun.y, gun.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
	}

	/**
	 * Display the current level of the player's luck.
	 */
	function drawLuck() {
		// luck indicator
		if (player.luck <= 10) {
			ctx.fillStyle = '#B22222';
		}
		else if (player.luck <= 50) {
			ctx.fillStyle = 'yellow';
		}
		else {
			ctx.fillStyle = 'green';
		}
		ctx.font = '24px impact';
		ctx.fillText('LUCK', LUCK_X, HEIGHT/3 - 45);
		ctx.strokeText('LUCK', LUCK_X, HEIGHT/3 - 45);
		ctx.fillRect(LUCK_X, LUCK_Y + LUCK_METER_HEIGHT - player.luck, 50, player.luck);

		ctx.strokeStyle = '#000000';
		ctx.strokeRect(LUCK_X, LUCK_Y, 50, LUCK_METER_HEIGHT);
	}

	/**
	 * Display all the current scores on screen.
	 */
	function drawScores() {
		for (var s = 0; s < scores.length; s++) {
			if (scores[s].isActive) {
				ctx.fillStyle = '#FF0000';
				if (scores[s].wait === 0) {
					ctx.fillStyle = '#000000';
				}
				ctx.font = '14px impact';
				ctx.fillText(scores[s].text, scores[s].x, scores[s].y);
			}
		}
	}

	/**
	 * Write text to the canvas.
	 * @param txt the string to display.
	 * @param x horizontal coordinate.
	 * @param y vertical coordinate.
	 * @param size font size.
	 * @param c colour to use.
	 * @param isCentered flag indicating if text should be centered on canvas.
	 */
	function writeText(txt, x, y, size, c, isCentered) {
		ctx.fillStyle = c;
		ctx.font = ' ' + size + 'px impact';
		ctx.shadowColor = 'rgba(255, 0, 0, 0.3)';
		ctx.shadowOffsetX =  ctx.shadowOffsetY = 1.5;
		ctx.textAlign = 'left';
		var width = 0;
		if (isCentered) {
			var metrics = ctx.measureText(txt);
			width = metrics.width/2;
		}

		ctx.fillText(txt, x - width, y);
		ctx.shadowOffsetX =  ctx.shadowOffsetY = 0;
	}

	/***
	 * Write text along an arc.
	 * @param txt the text to write
	 * @param x horizontal coordinate
	 * @param y vertical coordinate
	 * @param radius radius of the arc
	 * @param topOrBottom top of the cirlce or the bottom.
	 * @param size font size.
	 * @param c colour of font.
	 */
	function writeTextOnCircle(txt, x, y, radius, topOrBottom, size, c)
	{
		var spacePerLetter = Math.PI/ txt.length;
		ctx.save();
		ctx.translate(x, y);
		var t = (topOrBottom) ? 1 : -1;
		ctx.rotate(-t * ((Math.PI - spacePerLetter) / 2));
		for(var i=0; i< txt.length; i++){
			ctx.save();
			ctx.rotate(t * i * (spacePerLetter));
			ctx.textAlign = "center";
			ctx.textBaseline = (!topOrBottom) ? "top" : "bottom";
			writeText(txt[i], 0, -t * (radius), size, c, false);
			ctx.restore();
		}
		ctx.restore();
	}

	/**
	*
	*/
	function drawCats() {
		// black rectangles
		for (var c = 0; c < cats.length; c++) {
			if (cats[c].isActive) {
				ctx.save();
				ctx.translate(cats[c].x, cats[c].y);
				// always face the player.
				ctx.rotate(Math.atan2(player.y - cats[c].y, player.x-cats[c].x));
				ctx.drawImage(catImage, -10, -10);
				ctx.restore();
			}
		}
	}

	/**
	 * Render the active bombers on screen, adjusting the global alpha in relation to
	 * each Bomber's health level.
	 */
	function drawBombers() {
		for (var b = 0; b < bombers.length; b++) {
			if (bombers[b].isActive) {
				ctx.save();
				ctx.globalAlpha = bombers[b].health * 0.1;
				ctx.translate(bombers[b].x, bombers[b].y);
				ctx.rotate(Math.atan2(player.y - bombers[b].y, player.x-bombers[b].x));
				ctx.drawImage(bomberImage, -15, -15, 30, 30);
				//ctx.drawImage(bomberImage, -10, -10);
				ctx.fillStyle = 'red';
				ctx.fillRect(-20, -10, 5, bombers[b].health/5);
				ctx.strokeRect(-20, -10, 5, 20);
				ctx.restore();
//				ctx.globalAlpha = 1.0;
			}
		}
	}

	/**
	 *
	 */
	function drawBullets() {
		if (bullet.isActive) {
			ctx.fillStyle = '#000';
			ctx.beginPath();
			ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		}

		// bomber bullets.
		for (var b = 0; b < bullets.length; b++) {
			//ctx.fillStyle = '#B22222';
			if (bullets[b].isActive) {
				ctx.fillStyle = bulletColours[bullets[b].colourIndex];
				ctx.beginPath();
				ctx.arc(bullets[b].x, bullets[b].y, bullets[b].radius, 0, Math.PI * 2, false);
				ctx.fill();
				ctx.closePath();
				ctx.stroke();
				if (bullets[b].colourIndex === bulletColours.length-1) {
					bullets[b].colourIndex = 0;
				}
				else {
					bullets[b].colourIndex++;
				}
			}
		}
	}

	/**
	 *
	 */
	function drawParticles() {

		for (var i = 0; i <particles.length-1; i++)
		{
			ctx.globalAlpha = (particles[i].life/particles[i].maxLife);
			ctx.fillStyle = particles[i].colour;
			ctx.fillRect(particles[i].x, particles[i].y, particles[i].width, particles[i].height);
			ctx.globalAlpha = 1;
		}
	}

	/**
	 * Handle changing to a new state - any necessary loading goes on
	 * here.
	 * @param newState
	 */
	function changeState(newState) {
		currentState = newState;
		if (currentState === STATE.MENU) {
			longestSaved = false;
			player.luck = 50;
			waveCounter = 1;
			catSpawnTime = 300;
			spawnCounter = 0;
			for (var b = 0; b < bombers.length; b++) {
				bombers[b].isActive = false;
			}
			bullets = [];
			cats = [];
			particles = [];
			totalSeconds = 0;
			currentElapsedTime = 0;
		}
		else if (currentState === STATE.PAUSED) {
			// stop recording time
			// and add to the total amount.
			currentElapsedTime = Math.round((new Date().getTime() - time) / 1000);
			totalSeconds += currentElapsedTime;
		}
		else if (currentState === STATE.GAME) {
			// start recording with a new time.
			time = new Date().getTime();
		}
		else if (currentState === STATE.OVER) {
			currentElapsedTime = Math.round((new Date().getTime() - time)/1000);
			totalSeconds += currentElapsedTime;
		}
	}

	/**
	 * Convert degrees to radians.
	 * @param degrees a value between 0 and 360 inclusive.
	 * @return {Number}
	 */
	function toRadians(degrees)
	{
		return degrees * (Math.PI / 180);
	}

	/**
	 * Convert radians to degrees.
	 * @param radians angle value.
	 * @return {Number}
	 */
	function toDegrees(radians)
	{
		return radians * (180 / Math.PI);
	}

	/**
	 * rotate the gun.
	 * @param e event object.
	 */
	function mouseMove(e) {
		var target = {x:e.pageX - cvs.offsetLeft, y:e.pageY - cvs.offsetTop };
		rotateToFace(target);
	}

	/**
	 * Create a bullet.
	 * @param e
	 */
	function mouseUp(e) {
		e.preventDefault();
		if (currentState === STATE.GAME) {
			shoot();
		}
	}

	/**
	 * Handle the keyup event - change state based on key input and current state.
	 * @param e
	 */
	function keyUp(e) {
		if (e.keyCode === 32) { // SPACE BAR
			if (currentState === STATE.GAME) {
				changeState(STATE.PAUSED);
			}
			else if (currentState === STATE.PAUSED) {
				changeState(STATE.GAME);
			}
		}
		else if (e.keyCode === 13) { // ENTER KEY
			if (currentState === STATE.MENU) {
				changeState(STATE.GAME);
			}
			else if (currentState === STATE.OVER) {
				changeState(STATE.MENU);
			}
		}
	}

	init();

})();