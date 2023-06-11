//////////////////////////////////////////////////////
///   Inits the game, the meat of Earth Invader
//////////////////////////////////////////////////////

function initGame() {
	var igc = document.createElement('canvas'); // Create a new canvas element, add it to the DOM, and use it. This is done to prevent overlapping canvases
	igc.id = 'game';
	document.body.appendChild(igc);
	// Initialize the game canvas, get its context, and set its width and height to that of the screen
	var gamecanvas = document.getElementById("game");
	var gamectx = gamecanvas.getContext("2d");
	currentcanvas = 'gc'; // Set current canvas so the resize function knows which to resize
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	gamecanvas.width = clientWidth;
	gamecanvas.height = clientHeight;
	var halfwidth = gamecanvas.width / 2;
	var halfheight = gamecanvas.height / 2;
	var gameOver = false;
	var winGame = false;

	scoremult = mults[Options.wepType][Options.planType + "score"]; // Set the score multiplier based on the weapon and planet types

	var mousedown = false; // Variable to track if mouse is held down
	var firing = false; // To check if player is firing
	var shootcount = 0; // How frequently to shoot
	var pBullets = []; // Array to contain player bullets
	var eBullets = []; // Array to contain enemy bullets
	var enemies = []; // Array to contain the enemies
	var defenders = []; // Array to contain the enemies that orbit the planet
	var bossbars = []; // Array to contain the miniboss healthbars
	var poweruparray = []; // Array to contain the powerups
	var poweruptimer = Math.round(Math.random() * 30) + 30; // Random time between 30 and 60 seconds for when new powerups should spawn
	var powerupamount = Math.round(Math.random() * 2) + 1; // Random number of powerups from 1 to 3
	var poweruptypes = ["air", "fire", "water", "rock", "health", "invincibility"]; // Powerup types
	var powerupnames = [["multishot", winheight - 5, "white"], ["fastshot", winheight - 30, "red"], ["splash", winheight - 55, "blue"], ["penetrate", winheight - 80, "brown"], ["invincibility", winheight - 105, "gold"]]; // Array containing information needed to render the powerup info
	var removethis = poweruptypes.indexOf(Options.wepType); // Removes the powerup that mimics the players weapon, so no uselesss powerups
	poweruptypes.splice(removethis, 1);

	score = 0; // Reset score, time, and enemies killed to prevent issues
	time = 0;
	enemiesKilled = 1;

	var planet = new Planet(halfwidth, halfheight, "Planet", planTraits[Options.planType].plancolor, planTraits[Options.planType].planstroke, pBullets); // Create the planet and its healthbar
	var planethealth = new Healthbar(clientWidth - 310, 10, planet, false);

	var player = new Turret(halfwidth, 45, [enemies,defenders], eBullets, poweruparray); // Create the player and its healthbar
	var playerhealth = new Healthbar(10, 10, player, false);

	var spawns = [[40, 40], [40, halfheight], [40, clientHeight], [halfwidth, 40], [halfwidth, clientHeight], [clientWidth - 40, 40], [clientWidth - 40, halfheight], [clientWidth - 40, clientHeight - 40]]; // The spawnpoints that enemies will come from
	var enemytypes = ["fire", "air", "water", "rock"]; // All the enemy types. A random one is picked when making a wave
	var enemycount = 1; // Used to spawn a new wave
	var defendercount = 14; // Used to keep the number of defenders topped off

	var makeEnemies = function(x,y, type) { // Makes enemies
		var randOrbit = Math.round(Math.random()*20) + 60; // 30 to 80
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false, true);
		enemy.assigntarget(player); // Assigns the player as the target to shoot at and follow
		enemy.assignorbit(player);
		enemies.push(enemy); // Push to enemy array
		if (enemycount < 7) { // Keep repeating till there are enough enemies
			setTimeout(function(){
				makeEnemies(x, y, type);
			}, 1000);
			enemycount += 1;
		}
	};
	var makeBoss = function(x,y, type) { // Same as above, but for minibosses
		var randOrbit = Math.round(Math.random()*20) + 60; // 30 to 80
		var boss = new Enemy(x, y, 30, 30, randOrbit, type, pBullets, eBullets, true, true);
		boss.assigntarget(player);
		boss.assignorbit(player);
		var bosshealth = new Healthbar(x, y, boss, true); // Create its healthbar, push the healthbar and boss to their arrays
		bossbars.push(bosshealth);
		enemies.push(boss);
	};
	var makeDefenders = function(x,y, type) { // Sane as makeEnemy, but for defenders around the planet
		var randOrbit = Math.round(Math.random()*20) + 80; // 40 to 90
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false, false);
		enemy.assigntarget(player);
		enemy.assignorbit(planet);
		defenders.push(enemy);
		if (defendercount > 0) {
			setTimeout(function(){
				makeDefenders(x, y, type);
			}, 1000);
			defendercount -= 1;
		}
	};
	var makePowerups = function() { // Make a set of powerups
		var powerupamount = Math.round(Math.random() * 2) + 1; // Random number of powerups from 1 - 2
		for (var i = 0; i < powerupamount; i++) {
			var int = Math.floor(Math.random() * 5); // Used to make random type powerup
			var powerup = new Powerup(Math.floor(Math.random() * (winwidth) - 20)+10,Math.floor(Math.random() * (winheight) - 20)+10,poweruptypes[int],poweruparray);
			poweruparray.push(powerup); // Push to powerup array
		}
		lastpowerup = Date.now(); // Used to determine next wave
		var poweruptimer = Math.round(Math.random() * 30) + 30;
	}

////////////////////////////////////////
/// Handlers
////////////////////////////////////////

	gamecanvas.addEventListener('mousedown', function (e) {
		mousedown = true; // Starts the firing if statement
	}, false);
	gamecanvas.addEventListener('mouseup', function (e) {
		mousedown = false;
	}, false);
	gamecanvas.addEventListener("mousemove", function (e) { // Used to calculate where to shoot and draw cursor
		var rect = gamecanvas.getBoundingClientRect(); //get bounding rectangle
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
	}, false);
	window.addEventListener('keydown', function (e) { // Used for movement and pausing
		keysDown[e.keyCode] = true;
	}, false);
	window.addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
		if (e.keyCode === 80 && paused) {
			paused = false;
		} else if (e.keyCode === 80 && !paused) {
			paused = true;
		}
		if (e.keyCode === 77 && muted) {
			muted = false;
		} else if (e.keyCode === 77 && !muted) {
			muted = true;
		}
	}, false);

/////////////////////////////////////////
///   Countdown timer
/////////////////////////////////////////

	timer = 3;
	setTimeout(function(){
		timer = 2;
		clicksound();
		setTimeout(function(){
			timer = 1;
			clicksound();
			setTimeout(function(){
				starting = false;
				clicksound();
				makeEnemies(halfwidth, halfheight + 100, Options.planType);
				makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
			}, 1000);
		}, 1000);
	}, 1000);

	powerups.fastshot.nrof = wepTraits[Options.wepType].rof; // Prepare fastshot powerup so it can revert the rof when done

	// Main game loop, updates and renders the game
	var main = function(){
		var now = Date.now();
		var delta = now - then;

		if (!gameOver) { // If game is still going, update and render
			update(delta / 1000);
			render();			
		} else if (gameOver && winGame) { // If the player won, send true to show win
			gameoverscreen(true);
		} else if (gameOver && !winGame) { // Else send false to show lose
			gameoverscreen(false);
		}

		then = now;

		requestAnimationFrame(main); // Much better performance than setInterval
	};

	var update = function(delta){
		if (!starting) { // Make sure the countdown timer isn't going
			if (!paused) { // Make sure the game isn't paused
				if (powerups.fastshot.toggle) { // Set the rof based on the powerup or lack thereof
					wepTraits[Options.wepType].rof = powerups.fastshot.frof;
				} else {
					wepTraits[Options.wepType].rof = powerups.fastshot.nrof;
				}

				if (mousedown) { // If mousedown, start the shooting loop
					shootcount++;
		 			
		 			if (shootcount % wepTraits[Options.wepType].rof == 1) { // Use rate of fire property as modulo, fire every <rof> frames
		 				var dx = mouseX - player.x; // Use the global variables!
						var dy = mouseY - player.y ;
						var distanceToPlayer = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
						var angle = Math.atan2(dy, dx);

						if (Options.wepType === "air" || powerups.multishot.toggle) { // If air or multishot, do a multishot
							for (var i = -2; i <= 2; i++) {
								// Trig is scary
								var bullet = new Bullet(player.x, player.y, 3, Math.cos(angle+(0.3*i)), Math.sin(angle+(0.3*i)), wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true);
								if (i != 2) {
									pBullets.push(bullet); // Push the bullet
								}
							}
						} else { // Make just one
							var bullet = new Bullet(player.x, player.y, 3, Math.cos(angle), Math.sin(angle), wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true);
						}
						pBullets.push(bullet); // Push the bullet

		 			} 
				}

				// Update everything
				enemies.forEach(function(enemy){
					enemy.update(planet, enemies);
				});
				defenders.forEach(function(enemy){
					enemy.update(planet, defenders);
				});	
				pBullets.forEach(function(bullet){
					bullet.update(pBullets);
				});
				eBullets.forEach(function(bullet){
					bullet.update(eBullets);
				});
				bossbars.forEach(function(bar){
					bar.update();
				});
				poweruparray.forEach(function(powerup){
					powerup.update(gamecanvas);
				});

				player.update(delta, gamecanvas);
				playerhealth.update();
				planethealth.update();
				planet.update();

				if (((Date.now() - wave) / 1000) > 15) { // Every 15 seconds, make a new wave
					wave = Date.now();
					if (enemies.length < 100) { // But only if we're under the enemy cap
						enemycount = 1; // Set to 1 so the makeEnemies function loops
						var randomint = Math.floor(Math.random() * 8); // Random spawn int
						makeEnemies(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
					}
					if (defenders.length < 14) { // If the defenders need to be topped off, make a new one
						defendercount = 14 - defenders.length; // 15 as 14 + 1, to make sure that it spawns in case there are 0 defenders
						makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
					}
				};
				if (((Date.now() - boss) / 1000) > 60) { // Every 60 seconds, make a miniboss
					boss = Date.now();
					var randomint = Math.floor(Math.random() * 8); // Same idea as enemy
					makeBoss(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
				};
				if ((Date.now() - lastpowerup) / 1000 > poweruptimer) { // If a set of powerups is due, make em
					makePowerups();
				}

				if (planet.health <= 0) { // Planet's dead? You win!
					gameOver = true;
					winGame = true;
				} else if (player.health <= 0) { // You dead? You su- Errrr, lose
					player.alive = false;
					gameOver = true;
				};
				if (!gameOver) { // Don't update time or score if the game is over
					time = Math.floor((Date.now() - start) / 1000);
					score = Math.round((((enemiesKilled * planet.totaldamage) / time) * 10) * scoremult); // Multiply kills by damage done, then divide that by time, and multiply by 10 and scoremult. The divide by time is to prevent enemy farming for points, the 10 is to prevent small numbers, and the scoremult is to reward or punish hard or easy combos
				}
				for (i = 0; i < powerupnames.length; i++) { // Condensed for loop to manage all the timers, toggles, and rendering of meters for powerups
					if ((powerups[powerupnames[i][0]].timer > 0) && (powerups[powerupnames[i][0]].toggle)) {
						powerups[powerupnames[i][0]].timer -= 1;
					} else if ((powerups[powerupnames[i][0]].timer <= 0) && (powerups[powerupnames[i][0]].toggle)) {
						powerups[powerupnames[i][0]].toggle = false;
						powerups[powerupnames[i][0]].timer = 1000;
					}
				}
			}
		}
	};

	// Clears the screen
	var clearScreen = function(){
		gamectx.clearRect(0,0,gamecanvas.width, gamecanvas.height);
	};

	// Clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		// Draw everything
		planet.draw(gamectx);
		enemies.forEach(function(enemy){
			enemy.draw(gamectx, enemies);
		});
		defenders.forEach(function(enemy){
			enemy.draw(gamectx, defenders);
		});
		bossbars.forEach(function(bar){
			bar.draw(gamectx);
		});
		poweruparray.forEach(function(powerup){
			powerup.draw(gamectx);
		});
		playerhealth.draw(gamectx);
		planethealth.draw(gamectx);

		// Draw the time
		gamectx.font = "20pt Arial";
		gamectx.fillStyle = "white";
		gamectx.textAlign = "center";
		gamectx.fillText(time, winwidth / 2, 30);

		// Draw player and bullets
		player.draw(gamectx);
		pBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});
		eBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});

		// Draw cursor
		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);

		// Draw paused if paused, draw starting timer if starting
		gamectx.font = "100pt Impact";
		if (paused) {
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("Paused", winwidth / 2, winheight / 2);
		}
		if (starting) {
			gamectx.fillStyle = "white";
			gamectx.textAlign = "center";
			gamectx.fillText(timer, winwidth / 2, winheight / 2);
		}

		// Draw the meters for powerups
		gamectx.font = "20pt Impact";
		for (i = 0; i < powerupnames.length; i++) {
			if (powerups[powerupnames[i][0]].toggle) {
				gamectx.fillStyle = powerupnames[i][2];
				gamectx.textAlign = "left";
				gamectx.fillText(powerupnames[i][0].toUpperCase(),5,powerupnames[i][1]);
				gamectx.fillRect(160, powerupnames[i][1] - 20, 200 * (powerups[powerupnames[i][0]].timer / 1000), 20);
			}
		};
	};

	// Gameover screen 
	var gameoverscreen = function(didwin){
		clearScreen();
		if (score > highscore) { // Make sure highscore is correct
			highscore = score;
			localStorage.setItem("highscore", JSON.stringify(highscore));
		}

		gamectx.font = "100pt Impact";
		if (didwin) { // If you won, show the win stuff, or show gameover if not
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("You Win!", winwidth / 2, winheight / 2);
		} else if (!didwin) {
			gamectx.fillStyle = "red";
			gamectx.textAlign = "center";
			gamectx.fillText("Game Over!", winwidth / 2, winheight / 2);
		}

		// Show stats like score, highscore, time, enemies killed
		gamectx.font = "75pt Impact";
		gamectx.fillText("Score: " + score, winwidth / 2, (winheight / 2) + 110);

		gamectx.font = "30pt Impact";
		gamectx.fillText("Highscore: " + highscore, winwidth / 2, (winheight / 2) + 150);
		gamectx.fillText("Time: " + time + " seconds", winwidth / 2, (winheight / 2) + 185);
		gamectx.fillText("Enemies Killed: " + (enemiesKilled - 1), winwidth / 2, (winheight / 2) + 220);

		// Replay button
		gamectx.font = "30pt Arial";
		gamectx.fillStyle = "green";
		gamectx.fillRect(gamecanvas.width / 2 - 100, gamecanvas.height - 150, 200, 75);
		gamectx.fillStyle = "black";
		gamectx.fillText("Replay", winwidth / 2, winheight - 100);

		// Draw cursor
		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);

	};

	gamecanvas.addEventListener('click', function(event) { // Click handler to deal with replays
		var cLeft = gamecanvas.offsetLeft;
		var cTop = gamecanvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > gamecanvas.height - 150 && y < gamecanvas.height - 150 + 75 && x > gamecanvas.width / 2 - 100 && x < gamecanvas.width / 2 - 100 + 200 && gameOver) {
			gamectx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
			gameOver = false;
			winGame = false;

			// Remove all the stuff in arrays, kill player and planet just in case, reset the powerups and timers, init level select
			for (x in enemies) {
				var index = enemies.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in defenders) {
				var index = defenders.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in pBullets) {
				var index = pBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in eBullets) {
				var index = eBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in bossbars) {
				var index = bossbars.indexOf(x);
				enemies.splice(index,1);
			}
			planet.alive = false;
			player.alive = false;
			renderops.game = false;
			document.body.removeChild(igc);
			starting = true;
			time = 0;
			powerups.multishot.toggle = false;
			powerups.multishot.timer = 1000;
			powerups.fastshot.toggle = false;
			powerups.fastshot.timer = 1000;
			powerups.penetrate.toggle = false;
			powerups.penetrate.timer = 1000;
			powerups.splash.toggle = false;
			powerups.splash.timer = 1000;
			powerups.invincibility.toggle = false;
			powerups.invincibility.timer = 1000;
			Options.resize = true;
			initLevelSelect();
		}
	}, false);

	var then = Date.now(); // For updating
	var start = Date.now(); // For timer
	var wave = Date.now(); // For waves
	var boss = Date.now(); // For minibosses
	var lastpowerup = Date.now(); // For powerups
	main(); // Run the game loop
}