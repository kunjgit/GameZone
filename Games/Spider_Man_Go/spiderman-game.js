(function(window, document) {

// change this to relative path (relative to script) or to absolute path
// where the audio, fonts and images folders are located
// (include a slash at the end)
var RESOURCES_FOLDER_PATH = "";

var requestAnimationFrame = (function() {
	if (window.requestAnimationFrame) return window.requestAnimationFrame;
	if (window.oRequestAnimationFrame) return window.oRequestAnimationFrame;
	if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame;
	if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame;
	return function(callback) {
		setTimeout(callback, 1000 / 60);
	}
})();

window.requestAnimFrame = requestAnimationFrame;

var link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", RESOURCES_FOLDER_PATH + "css/spiderman-game.css");
document.head.appendChild(link);


var RESOURCES = {
	"JUMP"               : "images/jump.png",
	"RUNNING_CHANGE_STEP": "images/running-change-step.png",
	"RUNNING_LEFT_STEP"  : "images/running-left-step.png",
	"RUNNING_RIGHT_STEP" : "images/running-right-step.png",
	"SHOOT_CHANGE_STEP"  : "images/shoot-change-step.png",
	"SHOOT_JUMP"         : "images/shoot-jump.png",
	"SHOOT_LEFT-STEP"    : "images/shoot-left-step.png",
	"SHOOT_RIGHT-STEP"   : "images/shoot-right-step.png",
	"SHOOT"              : "images/shoot.png",
	"SLIDE"              : "images/slide.png",
	"STANDING"           : "images/standing.png",
	"WEB_PROJECTILE"     : "images/web.png",
	"BACKGROUND"         : "images/background.jpg",
	"ROOF"               : "images/wall.jpg",
	"BUILDING"           : "images/building.png",
	"SPIDER_HEAD"        : "images/spider-head.png",
	"HEART"              : "images/heart.png",
	"VENOM"              : "images/venom.png",
	"THUG"               : "images/thug.png",
	"KNIFE"              : "images/knife.png",
};

var AUDIO_RESOURCES = {
	"AMAZING_SPIDER_MAN_2" : new Audio(RESOURCES_FOLDER_PATH + "audio/amazing-spider-man-2.mp3"),
	"FRIENDLY_SPIDERMAN"   : new Audio(RESOURCES_FOLDER_PATH + "audio/60-theme-song.mp3"),
	"MOVIE_THEME"          : new Audio(RESOURCES_FOLDER_PATH + "audio/old-theme.mp3"),
	"ANIMATED_SERIES"      : new Audio(RESOURCES_FOLDER_PATH + "audio/animated-series-theme.mp3"),
	"SHOOT"                : new Audio(RESOURCES_FOLDER_PATH + "audio/shooting-web.mp3"),
};

var AUDIO_LOOP = [
	"AMAZING_SPIDER_MAN_2",
	"FRIENDLY_SPIDERMAN",
	"MOVIE_THEME",
	"ANIMATED_SERIES",
];

var KEY = {
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
	SPACEBAR: 32,
	A: 65,
	S: 87,
	D: 68,
	W: 87,
	ESC: 27,
};

var DIRECTION = {
	RIGHT: 1,
	LEFT: -1,
}

function SpidermanGame(opts) {
	var options = {
		canvas: "canvas",
		score: 0,
		muted: false,
		soundEffects: true,
	};

	opts = opts || {};

	for (var option in options) {
		if (opts.hasOwnProperty(option)) {
			options[option] = opts[option];
		}

		this[option] = options[option];
	}

	// how many frames have passed
	this.frame = 0;
	this.resources = {};

	this.cameraX = 0;
	this.score = this.score || 0;

	this.scene = {
		spiderman: null,
		projectiles: [],
		roofs: [],
		enemies: [],
	}; // object that contains information about the next scene
}

SpidermanGame.prototype.paused             = false;
SpidermanGame.prototype.initialized        = false;
SpidermanGame.prototype.soundEffects       = true;
SpidermanGame.prototype.escapeKey          = false;
SpidermanGame.prototype.muted              = false;
SpidermanGame.prototype.slowmotion         = false;

SpidermanGame.prototype.load = function() {
	if (this.initialized) return false;

	var self = this;

	this.canvas = document.querySelector(this.canvas);
	if (!this.canvas) {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
	}
	this.ctx = this.canvas.getContext("2d");
	this.canvas.height = 400;
	this.canvas.width = 711;

	var menu = document.createElement("div");
	menu.innerHTML = 
	'<div class="spiderman-game-menu-container">' +
		'<div class="spiderman-game-menu-title">PAUSED</div>' +
		'<div class="spiderman-game-menu-button spiderman-game-menu-button-resume">RESUME</div>' +
		'<div class="spiderman-game-menu-button spiderman-game-menu-button-mute-sounds">MUTE SOUNDS</div>' +
		'<div class="spiderman-game-menu-button spiderman-game-menu-button-mute-music">MUTE MUSIC</div>' +
		'<div class="spiderman-game-menu-button spiderman-game-menu-button-mute-slowmotion">TOGGLE SLOWMOTION</div>' +
	'</div>';
	menu = menu.firstChild;
	menu.style.display = "none";
	menu.querySelector(".spiderman-game-menu-button-resume").onclick = function() {
		self.unpause();
	}

	menu.querySelector(".spiderman-game-menu-button-mute-sounds").onclick = function() {
		if (self.soundEffects) {
			self.soundEffects = false;
			this.innerHTML = "UNMUTE SOUNDS";
		} else {
			self.soundEffects = true;
			this.innerHTML = "MUTE SOUNDS";
		}
	}

	menu.querySelector(".spiderman-game-menu-button-mute-music").onclick = function() {
		if (self.muted) {
			self.unmute();
			this.innerHTML = "MUTE MUSIC";
		} else {
			self.mute();
			this.innerHTML = "UNMUTE MUSIC";
		}
	}

	menu.querySelector(".spiderman-game-menu-button-mute-slowmotion").onclick = function() {
		if (self.slowmotion) {
			self.setSlowmotion(false);
		} else {
			self.setSlowmotion(true);
		}
	}
	document.body.appendChild(menu);
	this.pauseMenu = menu;

	var gameoverMenu = document.createElement("div");
	gameoverMenu.innerHTML = 
	'<div class="spiderman-game-menu-container">' +
		'<div class="spiderman-game-menu-title">GAME OVER</div>' +
		'<div class="spiderman-game-menu-title">FINAL SCORE: <span class="spiderman-game-score">0</span></div>' +
		'<div class="spiderman-game-menu-button spiderman-game-menu-button-restart">RESTART</div>' +
	'</div>';
	gameoverMenu = gameoverMenu.firstChild;

	gameoverMenu.querySelector(".spiderman-game-menu-button-restart").onclick = function() {
		self.restart();
	}
	document.body.appendChild(gameoverMenu);
	this.gameoverMenu = gameoverMenu;

	var spiderman = new SpiderMan(this);
	this.spiderman = spiderman;

	document.addEventListener("keydown", function(e) {
		var keyCode = e.keyCode || e.which;

		// fire this on the FIRST keydown callback
		if (keyCode == KEY.ESC && !self.escapeKey) {
			self.escapeKey = true;
			if (self.paused) {
				self.unpause();
			} else {
				self.pause();
			}
		}

		self.spiderman.keydown(e.keyCode || e.which);
	});

	document.addEventListener("keyup", function(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == KEY.ESC) {
			self.escapeKey = false;
		}

		self.spiderman.keyup(keyCode);
	});

	window.addEventListener("resize", function() {
		// resizing might change the canvas position, re position the menu if it is visible
		if (self.paused) {
			self.showPauseMenu();
		}
		if (self.gameIsOver) {
			self.showGameoverMenu();
		}
	});

	for (var i = 0; i < AUDIO_LOOP.length; i++) {
		var soundName = AUDIO_LOOP[i];
		var sound = AUDIO_RESOURCES[soundName];
		sound.setAttribute("data-name", soundName);
		sound.ontimeupdate = function() {
			if (this.currentTime >= this.duration) {
				var current = AUDIO_LOOP.indexOf(this.getAttribute("data-name"));
				var next = (current + 1) % (AUDIO_LOOP.length);
				
				self.playSound(AUDIO_LOOP[next], false, 0);
			}
		}
	}

	// to show that canvas is here, but is being loaded
	this.canvas.style.backgroundColor = "black";
	this.ctx.font = "30px Helvetica";
	this.ctx.textAlign = "center";
	this.ctx.fillStyle = "white";
	this.ctx.fillText("Loading...", this.canvas.width / 2, this.canvas.height / 2);

	return new Promise(function(resolve, reject) {
		var reourcesArray = [];

		for (var resource in RESOURCES) {
			reourcesArray.push({
				name: resource,
				source: RESOURCES_FOLDER_PATH + RESOURCES[resource],
			});
		}

		var index = 0;

		function loadNext() {
			if (!reourcesArray[index]) {
				var roof = new Roof(self, 0);

				self.scene.spiderman = spiderman;
				self.scene.roofs = [roof];
				self.update();
				self.playSound(AUDIO_LOOP[0], false, 0);

				// if game was muted in initial options
				if (self.muted) self.mute();

				return resolve();
			}

			var resource = reourcesArray[index];
			var img = new Image();

			img.onload = function() {
				index++;
				self.resources[resource.name] = img;
				loadNext();
			}
			img.src = resource.source;
		}

		loadNext();
	});
}

SpidermanGame.prototype.setSlowmotion = function(slowmo) {
	if (slowmo) {
		this.slowmotion = true;

		window.requestAnimFrame = function(callback) {
			setTimeout(callback, 1000 / 10);
		}

		for (var audio in AUDIO_RESOURCES) {
			AUDIO_RESOURCES[audio].playbackRate = 0.5;
		}
	} else {
		this.slowmotion = false;

		window.requestAnimFrame = requestAnimationFrame;

		for (var audio in AUDIO_RESOURCES) {
			AUDIO_RESOURCES[audio].playbackRate = 1;
		}
	}
}

SpidermanGame.prototype.mute = function() {
	this.muted = true;

	for (var audio in AUDIO_RESOURCES) {
		AUDIO_RESOURCES[audio].volume = 0;
	}
}

SpidermanGame.prototype.unmute = function() {
	this.muted = false;

	for (var audio in AUDIO_RESOURCES) {
		AUDIO_RESOURCES[audio].volume = 1;
	}
}

SpidermanGame.prototype.showPauseMenu = function() {
	if (this.gameoverMenu.style.display == "block") return;
	var pauseMenu = this.pauseMenu;

	var canvasRect = this.canvas.getBoundingClientRect(); // includes CSS translations
	var left = canvasRect.left;
	var top = canvasRect.top;

	this.pauseMenu.style.display = "block";
	this.pauseMenu.style.left = (left + this.canvas.width / 2) + "px";
	this.pauseMenu.style.top = (top + this.canvas.height / 2) + "px";
}

SpidermanGame.prototype.showGameoverMenu = function() {
	var gameoverMenu = this.gameoverMenu;
	this.gameoverMenu.querySelector(".spiderman-game-score").innerHTML = this.score;

	var canvasRect = this.canvas.getBoundingClientRect(); // includes CSS translations
	var left = canvasRect.left;
	var top = canvasRect.top;

	this.gameoverMenu.style.display = "block";
	this.gameoverMenu.style.left = (left + this.canvas.width / 2) + "px";
	this.gameoverMenu.style.top = (top + this.canvas.height / 2) + "px";
}

SpidermanGame.prototype.pause = function() {
	this.paused = true;
	this.showPauseMenu();
};

SpidermanGame.prototype.unpause = function() {
	this.paused = false;

	this.pauseMenu.style.display = "none";

	this.update();
}

SpidermanGame.prototype.playSound = function(audio, clone, currentTime) {
	audio = audio && audio.play ? audio : AUDIO_RESOURCES[audio];

	if (audio && audio.play) {
		if (clone) {
			audio = audio.cloneNode(true);
		}

		if (currentTime != undefined) {
			audio.currentTime = currentTime;
		}

		return audio.play();
	}
};

SpidermanGame.prototype.pauseSound = function(audio) {
	if (audio && audio.pause) {
		return audio.pause();
	}

	if (AUDIO_RESOURCES[audio]) {
		AUDIO_RESOURCES[audio].pause();
	}
}

SpidermanGame.prototype.drawBackground = function() {
	var background = this.resources.BACKGROUND;
	var backgroundWidth = background.width;
	var backgroundHeight = background.height;

	var x = this.cameraX / 5 * -1;
	var y = 0;

	x %= Math.min(background.width, this.canvas.width);

	var ratio = backgroundWidth / backgroundHeight;
	this.ctx.drawImage(background, x, y, this.canvas.height * ratio, this.canvas.height);
	this.ctx.drawImage(background, x + this.canvas.height * ratio, y, this.canvas.height * ratio, this.canvas.height);
}

SpidermanGame.prototype.drawRoofs = function() {
	var roofs = this.scene.roofs;

	for (var i = 0; i < roofs.length; i++) {
		roofs[i].update();
	}

	// if roof left the frame and was removed, add another one
	if (roofs.length < 3) {
		var lastRoof = roofs[roofs.length - 1];
		var x = lastRoof.x + lastRoof.fullWidth + Math.round(Math.random() * 50) + 100;

		var roof = new Roof(this, x);
		this.addRoof(roof);
		roofs[0].update();
	}
}

SpidermanGame.prototype.drawEnemies = function() {
	var enemies = this.scene.enemies;

	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update();
	}
}

SpidermanGame.prototype.update = function() {
	if (this.paused) return;
	if (this.gameIsOver) return;

	// draw the scene
	var scene = this.scene;
	var spiderman = scene.spiderman;
	var projectiles = scene.projectiles;

	// clear the canvas for re drawing
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.drawBackground();
	this.drawRoofs();
	this.drawEnemies();

	for (var i = 0; i < projectiles.length; i++) {
		projectiles[i].update();
	}

	spiderman.update();

	this.ctx.fillStyle = "white";
	this.ctx.font = "20px SpidermanGamePixelFont, Monospace, Helvetica";
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "top";
	this.ctx.fillText(this.score, this.canvas.width / 2, 5);

	for (var i = 0; i < projectiles.length; i++) {
		var projectile = projectiles[i];
		var x = projectile.x;
		var y = projectile.y;

		var character = this.isCharacterAtPoint(x, y);
		if (character) {
			projectile.handleHitWithCharacter(character);
			character.handleHitWithProjectile(projectile);
		}
	}

	requestAnimFrame(this.update.bind(this));
}

SpidermanGame.prototype.addProjectile = function(projectile) {
	if (projectile instanceof Projectile) {
		this.scene.projectiles.push(projectile);
	}
}

SpidermanGame.prototype.removeProjectile = function(projectile) {
	var projectiles = this.scene.projectiles;
	if (projectiles.indexOf(projectile) > -1) {
		projectiles.splice(projectiles.indexOf(projectile), 1);
	}
}

SpidermanGame.prototype.addEnemy = function(enemy) {
	if (enemy instanceof Enemy) {
		this.scene.enemies.push(enemy);
	}
}

SpidermanGame.prototype.removeEnemy = function(enemy) {
	var enemies = this.scene.enemies;
	if (enemies.indexOf(enemy) > -1) {
		enemies.splice(enemies.indexOf(enemy), 1);
	}
}

SpidermanGame.prototype.addRoof = function(roof) {
	if (roof instanceof Roof) {
		this.scene.roofs.push(roof);
	}
}

SpidermanGame.prototype.removeRoof = function(roof) {
	var roofs = this.scene.roofs;
	if (roofs.indexOf(roof) > -1) {
		roofs.splice(roofs.indexOf(roof), 1);
	}
}

// checks if given point is roof
SpidermanGame.prototype.isRoofAtPoint = function(x, y) {
	x -= this.cameraX; // to move point relative to canvas
	for (var i = 0; i < this.scene.roofs.length; i++) {
		var roof = this.scene.roofs[i];

		// since character is relative to the camera, calculate X of roof relative to camera as well
		var roofX = roof.x - this.cameraX;

		if (roofX <= x && roofX + roof.fullWidth >= x && y >= roof.y) return roof;
	}

	return false;
}

SpidermanGame.prototype.isCharacterAtPoint = function(x, y) {
	// enemies + spiderman
	var characters = this.scene.enemies.concat(this.spiderman);
	x -= this.cameraX;

	for (var i = 0; i < characters.length; i++) {
		var character = characters[i];
		var stateImg = character.stateImg || {};

		var left = character.x - this.cameraX;
		var top = character.y;
		var right = left + stateImg.width * character.scale;
		var bottom = top + stateImg.height * character.scale;

		var isCharacter = 
			   left   <= x // check left bound
			&& top    <= y // top bound
			&& right  >= x // right bound
			&& bottom >= y; // bottom bound

		if (isCharacter) return character;
	}

	return false;
}

SpidermanGame.prototype.restart = function() {
	var roof = new Roof(this);
	roof.x = 0;

	this.spiderman = new SpiderMan(this);
	this.scene.spiderman = this.spiderman;
	this.scene.projectiles = [];
	this.scene.roofs = [roof];
	this.scene.enemies = [];
	this.cameraX = 0;
	this.score = 0;

	this.paused = false;
	this.gameIsOver = false;

	this.gameoverMenu.style.display = "none";
	this.pauseMenu.style.display = "none";

	this.update();
}

SpidermanGame.prototype.gameover = function() {
	this.gameIsOver = true;

	this.showGameoverMenu();
}

function SpiderMan(game) {
	this.game = game;
	this.canvas = game.canvas;
	this.ctx = game.ctx;
	this.name = "SPIDER_MAN";
	this.x = 0;
	this.y = 0; 
	this.states = ["STANDING"];
	this.scale = 0.5;
	this.keydowns = [];
	this.health = 5;
	this.maxHealth = 5;

	this.web = 50;

	this.velocityX = 0;
	this.velocityY = 0;

	// to regenerate every N fps (approximately N / 60 seconds)
	this.regenerationSpeed = 1200;

	// how many frames have passed
	this.frame = 0;

	this.runningFrames = ["RUNNING_RIGHT_STEP", "RUNNING_CHANGE_STEP", "RUNNING_LEFT_STEP", "RUNNING_CHANGE_STEP"];
	this.runningShootingFrames = ["SHOOT_RIGHT-STEP", "SHOOT_CHANGE_STEP", "SHOOT_LEFT-STEP", "SHOOT_CHANGE_STEP"];
	this.runningFrame = 0;

	this.gravityForce = 0.7;

	this.runningDirection = 0;
	this.runningSpeed = 5;

	this.shootingFrame = 0;
	this.wasDamagedOnPreviousFrame = false;
}

SpiderMan.prototype.keyIsDown = function(keyCode) {
	return this.keydowns.indexOf(keyCode) > -1;
}

SpiderMan.prototype.hasState = function(state) {
	return this.states.indexOf(state) > -1;
}

SpiderMan.prototype.hasStates = function(states) {
	states = states.split(" ");
	var hasStates = true;
	for (var i = 0; i < states.length; i++) {
		hasState = hasState && this.hasState(states[i]);
	}
	return hasStates;
}

SpiderMan.prototype.addState = function(state) {
	if (this.hasState(state) === false) this.states.push(state);
}

SpiderMan.prototype.removeState = function(state) {
	if (state instanceof Array) {
		for (var i = 0; i < state.length; i++) {
			this.removeState(state[i]);
		}
	}

	if (this.hasState(state)) this.states.splice(this.states.indexOf(state), 1);
}

SpiderMan.prototype.handleHitWithProjectile = function(projectile) {
	if (projectile.name != "WEB") {
		this.health -= projectile.damage;
		this.wasDamagedOnPreviousFrame = true;
	}
}

// returns the image to draw in position of spiderman
SpiderMan.prototype.stateImage = function() {
	var state = "STANDING";

	if (this.hasState("JUMP")) {
		state = "JUMP";

		if (this.velocityY == 0) {
			this.velocityY = -15;
		}
	}

	if (this.velocityY >= 0) this.removeState("JUMP");

	if (this.hasState("RUNNING")) {
		state = this.runningFrames[this.runningFrame];

		// if user is shooting while running
		if (this.hasState("SHOOT")) state = this.runningShootingFrames[this.runningFrame];

		// every 10th frame update the image
		if (this.frame % 10 === 0) {
			this.runningFrame++;
			this.runningFrame %= this.runningFrames.length - 1;
		}

		this.velocityX = this.runningDirection * this.runningSpeed;
	} else {
		this.velocityX = 0;
	}

	if (this.hasState("SHOOT")) {
		if (!this.hasState("RUNNING")) state = "SHOOT";
		if (this.shootingFrame % 20 === 0) {
			this.shoot(this.game.resources.SHOOT);
		}
		this.shootingFrame++;
	}

	var image = this.game.resources[state] || this.game.resources["STANDING"];
	this.stateImg = image; // so that stateImage is accessible

	return image;
}

SpiderMan.prototype.keydown = function(keyCode) {
	this.keydowns.push(keyCode);
}

SpiderMan.prototype.keyup = function(keyCode) {
	this.runningFrame = 0;

	if (keyCode == KEY.ARROW_RIGHT || keyCode == KEY.ARROW_LEFT) {
		this.removeState("RUNNING");
	}

	if (keyCode == KEY.SPACEBAR) {
		this.removeState("SHOOT");
		// reset the shootingFrame so if user presses space rapidly, it shoots rapidly
		// but if user holds the space, it shoots every 20 frame
		this.shootingFrame = 0;
	}

	while (this.keydowns.indexOf(keyCode) > -1) {
		this.keydowns.splice(this.keydowns.indexOf(keyCode), 1);
	}
}

SpiderMan.prototype.regenerate = function() {
	// if this is 300th fps, regenerate
	if (this.frame % this.regenerationSpeed === 0 && this.health < this.maxHealth) {
		this.health = Math.round(this.health + 1);
	}
}

SpiderMan.prototype.shoot = function(img) {
	if (this.web <= 0) return;

	var direction = this.runningDirection || 1;
	var web = new Projectile(this.game);

	web.name = "WEB";
	web.damage = 2;

	web.x = this.x + img.width * this.scale + 1;
	if (this.runningDirection == DIRECTION.LEFT) {
		web.x = this.x - 1; // left hand will be the X position of the spiderman
	}
	web.y = this.y + img.height * this.scale / 2;

	web.update = function() {            
		var x = this.x - this.game.cameraX;
		var y = this.y;

		if (direction == DIRECTION.LEFT) {
			// if spiderman is turned to left,
			// move web by 20pixels since X coordinates start from LEFT to right
			x -= 20;
		}

		this.ctx.drawImage(this.game.resources["WEB_PROJECTILE"], x, y - 10, 20, 20);

		this.x += direction * 10;
		if (this.x - this.game.cameraX >= this.canvas.width || this.x <= 0) this.remove();
	}

	web.handleHitWithCharacter = function(character) {
		// somtimes projectile is being hit by the spiderman ON launch
		// the best way is probably to launch it better but for now, i'll just make sure
		// it doesn't get destroyed on launch
		if (character.name != "SPIDER_MAN") return this.remove();
	}

	web.spiderman = this;

	this.game.addProjectile(web);
	if (this.game.soundEffects == true) {
		this.game.playSound("SHOOT", true, 0);
	}

	this.web--;
}

SpiderMan.prototype.drawHealthbar = function() {
	var heart = {
		width: 25,
		height: 25,
	};

	for (var i = 0; i < this.health; i++) {
		// (i + 1) * 5 for every 5 pixel padding per heart
		var x = i * heart.width + 5 * (i + 1);
		var y = 5;
		this.ctx.drawImage(this.game.resources.HEART, x, y, heart.width, heart.height);
	}
}

SpiderMan.prototype.drawWebbar = function() {
	var img = this.game.resources.WEB_PROJECTILE;
	var string = "X " + this.web;
	this.ctx.fillStyle = "white";
	this.ctx.font = "15px SpidermanGamePixelFont, Monospace, Arial";
	this.ctx.textAlign = "start";
	this.ctx.textBaseline = "top";

	var web = {
		width: 20,
		height: 20,
	};

	var text = {
		string: string,
		width: this.ctx.measureText(string).width,
		verticalPadding: 5,
		horizontalPadding: 10,
	};

	var x = this.canvas.width - web.width - text.width - text.horizontalPadding * 2;
	var y = text.verticalPadding;

	var textX = x + web.width + text.horizontalPadding;
	var textY = y;

	this.ctx.drawImage(img, x, y, web.width, web.height);
	this.ctx.fillText(text.string, textX, textY);
}

// function that gets called with global update function
SpiderMan.prototype.update = function() {
	if (this.keyIsDown(KEY.ARROW_UP) && !this.hasState("FALL")) {
		this.addState("JUMP");
	}
	if (this.keyIsDown(KEY.ARROW_RIGHT)) {
		this.addState("RUNNING");
		this.runningDirection = DIRECTION.RIGHT;
	}
	if (this.keyIsDown(KEY.ARROW_LEFT)) {
		this.addState("RUNNING");
		this.runningDirection = DIRECTION.LEFT;
	}
	if (this.keyIsDown(KEY.SPACEBAR)) {
		this.addState("SHOOT");
	}

	if (this.y >= this.canvas.height || !this.health || !this.web) {
		this.game.gameover();
	}

	var img = this.stateImage();

	this.velocityY += this.gravityForce;

	this.y += this.velocityY;
	this.x += this.velocityX;

	if (this.x - this.game.cameraX < 0) {
		this.x = this.game.cameraX; // dont allow going left
	}

	if (this.x - this.game.cameraX > 150) {
		this.game.cameraX += this.velocityX;
	}
	
	// check if coordinates are on the roof, before increasing it by velocityX, because it might BE inside the building
	// after velocityX
	// check if left side is on the roof
	var roofLeft = this.game.isRoofAtPoint(this.x - this.velocityX, this.y + img.height * this.scale + 1);
	// check if right X hit the roof
	var roofRight = this.game.isRoofAtPoint(this.x + img.width * this.scale - this.velocityX, this.y + img.height * this.scale + 1);

	// check if spiderman is standing on the ground (roof)
	if (roofLeft || roofRight) {
		var roof = roofLeft || roofRight;

		// since velocity might kinda make the spiderman go INSIDE the wall by adding too much Y,
		// we'll just check if spider's y is INSIDE the wall just because of the velocityY
		// just to make sure that spider is actually on the roof
		if (roof.y + this.velocityY <= this.y) {
			this.x -= this.velocityX;
			this.velocityX = 0;
		} else {
			this.y = this.canvas.height - roof.height - img.height * this.scale;
			this.velocityY = 0;
			this.removeState("FALL");
		}
	}

	var x = this.x - this.game.cameraX;
	var y = this.y;
	var width = img.width * this.scale;
	var height = img.height * this.scale;

	this.ctx.save();

	// if the spiderman is running to the left, flip him
	if (this.runningDirection == DIRECTION.LEFT) {
		this.ctx.scale(-1, 1);
		x *= -1;
		x -= width;
	}

	this.ctx.drawImage(img, x, y, width, height);
	this.ctx.restore();

	if (this.wasDamagedOnPreviousFrame) {
		this.wasDamagedOnPreviousFrame = false;

		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(x, y, width, height);
	}

	this.regenerate();
	this.drawHealthbar();
	this.drawWebbar();

	this.frame++;
}

function Projectile(game) {
	this.x = 0;
	this.y = 0;

	this.damage = 0;
	this.name = "UNKNOWN";

	this.canvas = game.canvas;
	this.ctx = game.ctx;
	this.game = game;
}

Projectile.prototype.update = function() {
}

Projectile.prototype.remove = function() {
	this.game.removeProjectile(this);
}

Projectile.prototype.handleHitWithCharacter = function() {
	this.remove();
}

function Roof(game, x, y) {
	this.game = game;
	this.canvas = game.canvas;
	this.ctx = game.ctx;

	this.width = Math.round(Math.random() * (this.game.resources.BUILDING.width - 200)) + 200;
	this.height = Math.round(Math.random() * 50) + 100;
	this.fullWidth = this.width + 15; // 15 pixels for right end of the roof top

	this.x = x || 0;
	this.y = this.canvas.height - this.height;

	// 70% chance?
	var shouldSpawnEnemy = Math.round(Math.random() * 100) >= 30;
	if (shouldSpawnEnemy) {
		var enemy = new Enemy(this.game, {
			x: this.x + this.width / 2,
		});
		enemy.y = this.y - 1 - enemy.stateImg.height * enemy.scale;
		this.game.addEnemy(enemy);
		this.enemy = enemy;
	}
}

Roof.prototype.update = function() {
	var renderX = this.x - this.game.cameraX;
	var roof = this.game.resources.BUILDING;

	this.ctx.drawImage(roof, 0, 0, this.width, this.height, renderX, this.y, this.width, this.height);
	this.ctx.drawImage(roof, this.width, 0, 15, 26, renderX + this.width, this.y, 15, 26);

	if (renderX + this.width <= 0) {
		this.game.removeRoof(this);
		this.game.removeEnemy(this.enemy);
	}
}


function Enemy(game, opts) {
	opts = opts || {};

	this.game = game;
	this.canvas = game.canvas;
	this.ctx = game.ctx;

	this.health = opts.health || 4;
	this.maxHealth = opts.maxHealth || this.health;
	this.name = opts.name || "THUG";
	this.x = opts.x || this.canvas.width - 50;
	this.y = opts.y || 0;
	// just to control the scaling of an image
	this.scale = 0.5;
	this.stateImg = this.game.resources[this.name];

	this.wasDamagedOnPreviousFrame = false;
	this.frame = 0;
};

Enemy.prototype.shoot = function() {
	var self = this;
	var knife = this.game.resources.KNIFE;

	var projectile = new Projectile(this.game);
	projectile.name = "KNIFE";
	projectile.damage = 1;

	projectile.x = this.x - knife.width * this.scale / 2;
	// so knifes height is divided by 4 because, 2 is for center, and another 2 is for 0.5 scale
	projectile.y = this.y + (this.stateImg.height * this.scale / 2) - (knife.height * this.scale / 4);
	projectile.update = function() {
		this.ctx.drawImage(knife, this.x - this.game.cameraX, this.y, knife.width * self.scale / 2, knife.height * self.scale / 2);

		this.x -= 10;
	}

	this.game.addProjectile(projectile);
}

Enemy.prototype.drawHealthbar = function() {
	var healthbar = {
		height: 5,
		width: 100,
		style: "red",
		borderWidth: 2,
		borderStyle: "black"
	};

	var x = this.x - this.game.cameraX;
	x -= healthbar.width / 2; // to center the healthbar with the X of the character
	x += this.stateImg.width * this.scale / 2; // to center the healthbar with the X of characters center

	var y      = this.y - (healthbar.height + healthbar.borderWidth * 2) - 5;
	var width  = healthbar.width * this.health / this.maxHealth; // get the width for current health
	var height = healthbar.height;

	var borderX      = x - healthbar.borderWidth;
	var borderY      = y - healthbar.borderWidth;
	var borderWidth  = healthbar.width + healthbar.borderWidth * 2;
	var borderHeight = healthbar.height + healthbar.borderWidth * 2;

	this.ctx.fillStyle = healthbar.borderStyle;
	this.ctx.fillRect(borderX, borderY, borderWidth, borderHeight);

	this.ctx.fillStyle = healthbar.style;
	this.ctx.fillRect(x, y, width, height);
}

Enemy.prototype.update = function() {
	var img = this.game.resources[this.name];
	this.stateImg = img;

	if (this.health <= 0) {
		this.remove();
	}

	this.drawHealthbar();

	var x = this.x - this.game.cameraX;
	var y = this.y;
	var width = img.width * this.scale;
	var height = img.height * this.scale;

	this.ctx.save();
	this.ctx.scale(-1, 1);

	this.ctx.drawImage(this.game.resources[this.name], (x + width) * -1, y, width, height);
	this.ctx.restore();

	if (this.wasDamagedOnPreviousFrame) {
		this.wasDamagedOnPreviousFrame = false;
		this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
		this.ctx.fillRect(x, y, width, height);
	}

	var isInScreen = this.x - this.game.cameraX <= this.canvas.width;

	if (this.frame % 100 === 0 && isInScreen) {
		this.shoot();
	}

	this.frame++;
}

Enemy.prototype.remove = function() {
	this.game.score++;
	this.game.spiderman.web += this.maxHealth;
	this.game.removeEnemy(this);	
}

Enemy.prototype.handleHitWithProjectile = function(projectile) {
	if (projectile.name == "WEB") {
		this.health -= projectile.damage;
		this.wasDamagedOnPreviousFrame = true;
	}
}

window.SpidermanGame = SpidermanGame;
window.Projectile    = Projectile;
window.SpiderMan     = SpiderMan;
window.Enemy         = Enemy;
window.Roof          = Roof;

})(window, document);