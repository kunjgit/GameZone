/**
 * Application controller
 * @constructor
 */
function BB_App() {
	var self = this;
	this.storage = new BB_Storage(BB_Game.maps.length);
	this.game = this.storage.getLevel();
	this.sound = new BB_Sound(function() {
		switch (this.index) {
			case -1:
			case 3:
				self.scene.on('load');
				break;
			case 4:
				self.scene.on('music');
				break;
		}
	});
	this.sound.disabled = !this.storage.getSound();
	this.drawer = new BB_Drawer();
	this.sprite = new BB_Sprite();
	this.init();
	document.body.appendChild(this.drawer.canvas);
	document.body.appendChild(this.canvas);
	this.bind();
}

/**
 * Extends CP_Canvas
 */
BB_App.prototype = new CP_Canvas(480, 320);

/**
 * Init and resize app
 */
BB_App.prototype.init = function() {
	this.resize();
	this.drawer.resize();
	this.sprite.render(this.ctx, this.scale * this.ratio);
	this.scene = new BB_Main(this);
};

/**
 * Event handler
 * @param e
 */
BB_App.prototype.on = function(e) {
	this.scene.on(e, this.x, this.y, this.touch);
};

/**
 * Draw the canvas
 */
BB_App.prototype.paint = function() {
	this.scene.paint(this.ctx);
	this.scene.run();
};

/**
 * Start new level
 * @param {Number} add
 */
BB_App.prototype.start = function(add) {
	if (add) {
		this.game += add;
	}
	delete this.scene;
	this.scene = new BB_Game(this, this.game);
};

/**
 * Animation thread
 */
BB_App.prototype.run = function() {
	var self = this;
	self.paint();
	requestAnimFrame(function() {
		self.run();
	});
};

window.requestAnimFrame =
	window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function(callback) { window.setTimeout(callback, 1000 / 60); };

window.onload = function() {
	var app = new BB_App(),
		timer = null;
	window.setTimeout(function() { app.run(); }, 500);
	window.onresize = function() {
		if (timer) window.clearTimeout(timer);
		timer = window.setTimeout(function() { app.init(); }, 500);
	};
};

