(function() {
/**
 * Canvas object
 * @param {Number} w
 * @param {Number} h
 * @constructor
 */
function CP_Canvas(w, h) {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.w = w;
	this.h = h;
	this.x = 0;
	this.y = 0;
	this.touch = false;
	this.top = 0;
	this.left = 0;
	this.scale = 1;
	this.ratio = 1;
}

/**
 * Abstract event handler
 * @param {String} e
 */
CP_Canvas.prototype.on = function(e) {};

/**
 * Bind canvas events
 * @returns {CP_Canvas}
 */
CP_Canvas.prototype.bind = function() {
	var self = this;
	this.canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
		self.x = (e.touches[0].pageX - self.left) / self.scale;
		self.y = (e.touches[0].pageY - self.top) / self.scale;
		self.touch = true;
		self.on('start');
	});
	this.canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
		self.x = (e.clientX - self.left) / self.scale;
		self.y = (e.clientY - self.top) / self.scale;
		self.touch = true;
		self.on('start');
	});
	this.canvas.addEventListener('touchmove', function(e) {
		e.preventDefault();
		self.x = (e.touches[0].pageX - self.left) / self.scale;
		self.y = (e.touches[0].pageY - self.top) / self.scale;
		self.on('move');
	});
	this.canvas.addEventListener('mousemove', function(e) {
		e.preventDefault();
		self.x = (e.clientX - self.left) / self.scale;
		self.y = (e.clientY - self.top) / self.scale;
		self.on('move');
	});
	this.canvas.addEventListener('touchend', function(e) {
		e.preventDefault();
		self.on('end');
		self.touch = false;
	});
	this.canvas.addEventListener('mouseup', function(e) {
		e.preventDefault();
		self.on('end');
		self.touch = false;
	});
	return this;
};

/**
 * Resize the canvas object
 * @returns {CP_Canvas}
 */
CP_Canvas.prototype.resize = function() {
	var width = document.body.clientWidth,
		height = document.body.clientHeight,
		ratio = window.devicePixelRatio || 1,
		scale = width / this.w > height / this.h ? height / this.h : width / this.w;
	this.left = Math.round((width - this.w * scale) / 2);
	this.top = Math.round((height - this.h * scale) / 2);
	if (width / height > this.w / this.h) {
		this.canvas.style.left = this.left + 'px';
		this.canvas.style.top = '0px'; 
	} else {
		this.canvas.style.top = this.top + 'px';
		this.canvas.style.left = '0px'; 
	}
	this.canvas.width = Math.round(this.w * scale * ratio);
	this.canvas.height = Math.round(this.h * scale * ratio);
	this.canvas.style.width = Math.round(this.w * scale) + 'px';
	this.canvas.style.height = Math.round(this.h * scale) + 'px';
	this.ctx.scale(scale * ratio, scale * ratio);
	this.scale = scale;
	this.ratio = ratio;
	return this;
};

/**
 * Abstract game item
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function CP_Item(w, h, x, y) {
	this.set(w, h, x, y);
}

/**
 * Set dimensions and coordinates
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 */
CP_Item.prototype.set = function(w, h, x, y) {
	this.w = w || 0;
	this.h = h || 0;
	this.x = x || 0;
	this.y = y || 0;
};

/**
 * Get/Set the origo x coordinate
 * @param {Number} value
 * @returns {Number} 
 */
CP_Item.prototype.ox = function(value) {
	if (value) {
		this.x = value - (this.w / 2);
	} else {
		value = this.x + (this.w / 2); 
	}
	return value;
};

/**
 * Get/Set the origo y coordinate
 * @param {Number} value
 * @returns {Number} 
 */
CP_Item.prototype.oy = function(value) {
	if (value) {
		this.y = value - (this.h / 2);
	} else {
		value = this.y + (this.h / 2); 
	}
	return value;
};

/**
 * Clear the item
 * @param ctx
 */
CP_Item.prototype.clear = function(ctx) {
	ctx.clearRect(this.x, this.y, this.w, this.h);
};

/**
 * Abstract draw function
 * @param ctx
 */
CP_Item.prototype.paint = function(ctx) {};

/**
 * Abstract animation thread
 */
CP_Item.prototype.run = function() {};


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


/**
 * The big red button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Ball(sprite, x, y) {
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;
	this.r = 20;
	this.a = 0;
	this.l = .3;
	this.s = .985;
	this.t = null;
	this.v = null;
	this.o = {x:this.x, y:this.y};
}

/**
 * Extends CP_Item
 */
BB_Ball.prototype = new CP_Item(40, 40);

/**
 * Draw the button
 */
BB_Ball.prototype.paint = function(ctx) {
	this.sprite.paint(ctx, this.x, this.y, this.w, this.h, Math.round(this.a) * 40, this.t ? 40 : 0);
	if (this.t) {
		ctx.save();
		ctx.strokeStyle = '#ddd';
		ctx.lineCap = 'round';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(this.ox(), this.oy());
		ctx.lineTo(this.t.x, this.t.y);
		ctx.stroke();
		ctx.restore();
	}
};

/**
 * Animation thread
 */
BB_Ball.prototype.run = function() {
	if (this.v) {
		this.x += this.v.x;
		this.y += this.v.y;
		this.v.x *= this.s;
		this.v.y *= this.s;
		this.v.d *= this.s;
		var a = this.v.d * this.l;
		this.a += a > 2 ? 2 : a;
		if (this.a < 0) this.a = 11;
		if (this.a > 11) this.a = 0;
		if (this.v.d < 0.05) {
			this.v = null;
		}
		return true;
	}
	return false;
};

/**
 * Stop the animation
 */
BB_Ball.prototype.stop = function() {
	if (this.v) {
		this.v = {x:0,y:0,d:0};
	}
};

/**
 * Check bouncs point
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} bounce
 * @returns {Boolean}
 */
BB_Ball.prototype.check = function(x, y, bounce) {
	var vx = this.ox() - x,
		vy = this.oy() - y,
		d = Math.sqrt((vx * vx) + (vy * vy)),
		result = d <= this.r;
	if (result && bounce) {
		this.ox(vx / d * this.r + x);
		this.oy(vy / d * this.r + y);
		if (this.v) {
			var a = this.v.d / d;
			this.v.x = vx * a;
			this.v.y = vy * a;
		}
	}
	return result;
};

/**
 * Set button bounce vector
 * @param {Number} vx
 * @param {Number} vy
 */
BB_Ball.prototype.bounce = function(vx, vy) {
	if (this.v) {
		this.v.x *= vx;
		this.v.y *= vy;
		this.l = -this.l;
	}
};

/**
 * Stop he button and set the line end
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.hold = function(x, y) {
	this.t = {x:x, y:y};
	this.v = null;
};

/**
 * Start button animation
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.shot = function(x, y) {
	var vx = x - this.ox(),
		vy = y - this.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy)),
		a = d / 20 * (250 / d);
	this.v = {x: vx/a, y: vy/a, d:d/a};
	this.t = null;
	this.l = -this.l;
};

/**
 * Reset button position to default values
 * @param {Number} x
 * @param {Number} y
 */
BB_Ball.prototype.reset = function(x, y) {
	this.x = this.o.x;
	this.y = this.o.y;
	this.a = 0;
	this.v = null;
	this.t = null;
};
/**
 * UI button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} sx
 * @param {Number} sy
 * @constructor
 */
function BB_Button(sprite, x, y, w, h, sx, sy) {
	this.sprite = sprite;
	this.set(w, h, x, y);
	this.sx = sx;
	this.sy = sy;
	this.active = false;
	this.disabled = false;
}

/**
 * Extends CP_Item
 */
BB_Button.prototype = new CP_Item();

/**
 * Draw the button
 */
BB_Button.prototype.paint = function(ctx) {
	var sy = this.sy;
	if (!this.disabled) {
		sy += this.h;
		if (this.active) {
			sy += this.h;
		}
	}
	this.sprite.paint(ctx, this.x, this.y, this.w, this.h, this.sx, sy);
};

/**
 * Check button active state
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Button.prototype.check = function(x, y) {
	this.active = this.x <= x
		&& this.x + this.w >= x
		&& this.y <= y
		&& this.y + this.h >= y;
	return this.active;
};
/**
 * The golden button
 * @param {BB_Sprite} sprite
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Coin(sprite, x, y) {
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;
	this.r = 5;
	this.a = Math.round(Math.random() * 23);
	this.has = false;
	this.hide = false;
}

/**
 * Extends CP_Item
 */
BB_Coin.prototype = new CP_Item(20, 20);

/**
 * Draw the button
 */
BB_Coin.prototype.paint = function(ctx) {
	if (!this.hide) {
		this.sprite.paint(ctx, this.x, this.y, this.w, this.h, this.a * this.w, 80);
	}
};

/**
 * Animation thread
 */
BB_Coin.prototype.run = function() {
	if (this.has && !this.hide) {
		this.hide = this.x < 1 && this.y < 1;
		this.a = this.a < 23 ? this.a + 1 : 0;
		this.x -= this.x / 10;
		this.y -= this.y / 10;
		return true;
	}
	return false;
};

/**
 * Check ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Coin.prototype.check = function(ball) {
	if (this.has) {
		return true;
	}
	var vx = this.ox() - ball.ox(),
		vy = this.oy() - ball.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy));
	this.has = d < this.r + ball.r;
	return this.has;
};

/**
 * The background canvas
 * @constructor
 */
function BB_Drawer() {}

/**
 * Extends CP_Canvas
 */
BB_Drawer.prototype = new CP_Canvas(480, 320);

/**
 * Generate random value
 * @param {Number} value
 * @returns {Number}
 */
BB_Drawer.prototype.rand = function(value) {
	return Math.round(Math.random() * value) - (value / 2);
};

/**
 * Draw the main scene informations
 */
BB_Drawer.prototype.info = function() {
	var ctx = this.ctx,
		title = "BOUNCING BUTTON",
		desc = [
			"Shoot the red button 3 times",
			"Collect all golden buttons",
			"Avoid holes",
			"Bounce off walls"
		];
	ctx.save();
	ctx.font = "bold 36px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#852";
	ctx.fillStyle = "#f90";
	ctx.strokeText(title, 240, 55);
	ctx.fillText(title, 240, 55);
	ctx.font = "bold 16px Arial";
	ctx.fillStyle = "#420";
	ctx.textAlign = "left";
	for (var i=0; i<desc.length; i++) {
		ctx.fillText(desc[i], 190, 110 + i * 35);
	}
	this.hole(140, 180, 18, 2);
	this.wood(115, 205, 50, 20, 2, 2);
	ctx.restore();
};

/**
 * Draw hole
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @param {Number} stroke
 */
BB_Drawer.prototype.hole = function(x, y, r, stroke) {
	var ctx = this.ctx;
	ctx.save();
	ctx.translate(x, y);
	if (stroke) {
		ctx.save();
		ctx.scale(1.1, 1);
		ctx.beginPath();
		ctx.arc(stroke, 0, r + stroke, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#852";
		ctx.fill();
		ctx.restore();	
	}
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.restore();	
};

/**
 * Draw wood pattern rectangle
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} r
 * @param {Number} stroke
 */
BB_Drawer.prototype.wood = function(x, y, w, h, r, stroke) {
	var ctx = this.ctx,
		color = stroke ? "#852" : "#b85";
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = stroke ? "#963" : "#c96";
	ctx.lineWidth = stroke || 0;
	ctx.strokeStyle = color;
	if (stroke) {
		ctx.save();
		ctx.shadowBlur = 10 * this.scale;
		ctx.shadowColor = "#000";
		ctx.shadowOffsetX = 5 * this.scale;
		ctx.shadowOffsetY = 5 * this.scale;
		ctx.fill();
		ctx.restore();
		ctx.stroke();
	} else {
		ctx.fill();
	}
	ctx.restore();
	if (w >= h) {
		for (var i=r; i<h-r; i+=r) {
			ctx.save();
			ctx.translate(x, y + i + this.rand(r));
			ctx.beginPath();
			ctx.moveTo(0, this.rand(r));
			ctx.bezierCurveTo(w/3, this.rand(r), w/3*2, this.rand(r), w, this.rand(r));
			ctx.lineTo(w, this.rand(r));
			ctx.bezierCurveTo(w/3*2, this.rand(r), w/3, this.rand(r), 0, this.rand(r));
			ctx.fillStyle = color;
			ctx.fill();
			ctx.restore();
		}
	} else {
		for (var i=r; i<w-r; i+=r) {
			ctx.save();
			ctx.translate(x + i + this.rand(r), y);
			ctx.beginPath();
			ctx.moveTo(this.rand(r), 0);
			ctx.bezierCurveTo(this.rand(r), h/3, this.rand(r), h/3*2, this.rand(r), h);
			ctx.lineTo(this.rand(r), h);
			ctx.bezierCurveTo(this.rand(r), h/3*2, this.rand(r), h/3, this.rand(r), 0);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.restore();
		}
	}
};

/**
 * Game scene
 * @param {BB_App} app
 * @param {number} level
 * @returns {BB_Game}
 * @constructor
 */
function BB_Game(app, level) {
	var self = this,
		sprite = app.sprite,
		drawer = app.drawer,
		map = BB_Game.maps[level];
	this.app = app;
	this.level = level;
	this.sound = 0;
	this.border = 20;
	this.score = new BB_Score(sprite);
	this.overlay = new BB_Overlay(sprite, this.score, level);
	this.overlay.back.disabled = level <= 0;
	this.overlay.next.disabled = level >= BB_Game.maps.length-1;
	this.ball = new BB_Ball(sprite, map.b[0], map.b[1]);
	this.coins = [];
	this.walls = [];
	this.holes = [];
	drawer.wood(0, 0, this.w, this.h, 10);
	drawer.wood(0, 0, this.w, this.border, 2, 2);
	drawer.wood(0, this.border, this.border, this.h, 2, 2);
	map.w.forEach(function(w) {
		var wall = new BB_Wall(w[0], w[1], w[2], w[3]);
		drawer.wood(wall.x, wall.y, wall.w, wall.h, 2, 2);
		self.walls.push(wall);
	});
	drawer.wood(this.w-this.border, this.border, this.border, this.h, 2, 2);
	drawer.wood(0, this.h-this.border, this.w, this.border, 2, 2);
	sprite.paint(drawer.ctx, 2, 2, 16, 16, 0, 116);
	map.h.forEach(function(h) {
		var hole = new BB_Hole(h[0], h[1]);
		drawer.hole(hole.ox(), hole.oy(), hole.r, 2);
		self.holes.push(hole);
	});
	map.c.forEach(function(c) {
		self.coins.push(new BB_Coin(sprite, c[0], c[1]));
	});
	this.goal = this.coins.length;
	this.repaint = true;
}

/**
 * Extends CP_Item
 */
BB_Game.prototype = new CP_Item(480, 320);

/**
 * Paint game canvas
 * @param ctx
 */
BB_Game.prototype.paint = function(ctx) {
	if (this.repaint) {
		this.clear(ctx);
		this.score.paint(ctx);
		this.coins.forEach(function(coin) {
			coin.paint(ctx);
		});
		this.ball.paint(ctx);
		if (this.end()) {
			this.overlay.paint(ctx);
		}
		this.repaint = false;
	}
};

/**
 * Check game status
 * @returns {Boolean}
 */
BB_Game.prototype.end = function() {
	return !this.ball.v && (!this.score.shot || !this.goal);
};

/**
 * Game thread
 */
BB_Game.prototype.run = function() {
	var goal = 0;
		app = this.app,
		ball = this.ball,
		score = this.score,
		coins = this.coins,
		repaint = this.score.run(),
		sound = false;
		i = 0;
	this.coins.forEach(function(coin) {
		if (coin.run()) repaint = true;
	});
	if (ball.run()) {
		if (this.check(ball)) {
			score.on('wall');
			sound = 0;
		}
		this.walls.forEach(function(wall) {
			if (wall.check(ball)) {
				score.on('wall');
				sound = 0;
			}
		});
		this.holes.forEach(function(hole) {
			if (hole.check(ball)) {
				ball.reset();
				score.on('reset');
			}
		});
		this.coins.forEach(function(coin) {
			if (!coin.has) {
				if (coin.check(ball)) {
					sound = 2;
					score.on('coin');
				}
				goal++;
			}
		});
		this.goal = goal;
		if (this.end()) {
			score.on('end');
			app.storage.setScore(this.level, score, !goal);
			this.overlay.next.disabled = !score.next;
		}
		if (sound !== false) {
			app.sound.play(sound + this.sound);
			this.sound = ++this.sound % 2;
		}
		repaint = true;
	}
	this.repaint = repaint;
};

/**
 * Check ball bounce on drawer
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Game.prototype.check = function(ball) {
	if (ball.x < this.border) {
		ball.x = this.border;
		ball.bounce(-1, 1);
		return true;
	} else if (ball.x + ball.w > this.w - this.border) {
		ball.x = this.w - this.border - ball.w;
		ball.bounce(-1, 1);
		return true;
	}
	if (ball.y < this.border) {
		ball.y = this.border;
		ball.bounce(1, -1);
		return true;
	} else if (ball.y + ball.h > this.h - this.border) {
		ball.y = this.h - this.border - ball.h;
		ball.bounce(1, -1);
		return true;
	}
	return false;
};

/**
 * Game event handler
 * @param {String} e
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} touch
 */
BB_Game.prototype.on = function(e, x, y, touch) {
	if (this.end()) {
		this.repaint = this.overlay.check(x, y) || this.repaint;
		if (e == 'end') {
			if (this.overlay.start.active) {
				this.app.start();
			} else if (
				this.overlay.next.active &&
				!this.overlay.next.disabled
			) {
				this.app.start(1);
			} else if (
				this.overlay.back.active && 
				!this.overlay.back.disabled
			) {
				this.app.start(-1);
			}
		}
	} else if (this.score.shot && this.goal) {
		switch (e) {
			case 'start':
			case 'move':
				if (touch) {
					this.ball.hold(x, y);
				}
				break;
			case 'end':
				this.ball.shot(x, y);
				this.score.on('shot');
				break;
		}
		this.repaint = true;
	} else if (e == 'end') {
		ball.stop();
	}
};

/*
{ //creator
	b:[],
	c:[[50, 50],[140,50],[230,50],[320,50],[410,50],
	   [50, 100],[140,100],[230,100],[320,100],[410,100],
	   [50, 150],[140,150],[230,150],[320,150],[410,150],
	   [50, 200],[140,200],[230,200],[320,200],[410,200],
	   [50, 250],[140,250],[230,250],[320,250],[410,250]],
	w:[[20,280,95,20],[20,280,185,20],[20,280,275,20],[20,280,365,20],
	   [440,20,20,100],[440,20,20,150],[440,20,20,200]],
	h:[]
},
*/

/**
 * Game maps data
 * b: ball position
 * c: coins position
 * w: walls position and size
 * h: holes position
 */
BB_Game.maps = [{ //X
	b:[220, 140],
	c:[[50, 50],[410,50],
	   [140,100],[320,100],
	   [140,200],[320,200],
	   [50, 250],[410,250]],
	w:[],
	h:[]
},{ //diamond
	b:[220, 140],
	c:[[230,50],
	   [140,100],[320,100],
	   [50, 150],[410,150],
	   [140,200],[320,200],
	   [230,250]],
	w:[],
	h:[]
},{ //square
	b:[220, 140],
	c:[[50, 50],[230,50],[410,50],
	   [50,150],[410,150],
	   [50,250],[230,250],[410,250]],
	w:[],
	h:[]
},{ //diamond hole
	b:[130, 140],
	c:[[230,50],
	   [140,100],[320,100],
	   [50, 150],[410,150],
	   [140,200],[320,200],
	   [230,250]],
	w:[],
	h:[[305,135]]
},{ //one wall
	b:[130, 140],
	c:[[140,50],[230,50],[320,50],
	   [50, 100],[410,100],
	   [50, 150],[410,150],
	   [50, 200],[410,200],
	   [140,250],[230,250],[320,250]],
	w:[[20,120,275,100]],
	h:[]
},{ //lines
	b:[220, 140],
	c:[[50, 50],[230,50],[410,50],
	   [50, 100],[230,100],[410,100],
	   [50, 150],[410,150],
	   [50, 200],[230,200],[410,200],
	   [50, 250],[230,250],[410,250]],
	w:[[20,200,95,20],[20,200,365,100]],
	h:[]
},{ //diamond plus
	b:[40,40],
	c:[[230,50],
	   [140,100],[320,100],
	   [50, 150],[410,150],
	   [140,200],[320,200],
	   [230,250]],
	w:[[40,20,190,150],[20,100,230,110],[40,20,250,150]],
	h:[]
},{ //two levels
	b:[220, 140],
	c:[[50, 50],[140,50],[230,50],[320,50],[410,50],
	   [50, 150],[140,150],[320,150],[410,150],
	   [50, 250],[140,250],[230,250],[320,250],[410,250]],
	w:[[175,20,20,100],[175,20,285,200]],
	h:[]
},{ //treasure
	b:[40,140],
	c:[[50,50],[140,50],[230,50],[320,50],[410,50],
	   [50, 100],[140,100],[230,100],[320,100],[410,100],
	   [50, 200],[140,200],[230,200],[320,200],[410,200],
	   [50, 250],[140,250],[230,250],[320,250],[410,250]],
	w:[[280,20,100,150]],
	h:[]
},{ //cross
	b:[220, 140],
	c:[[230,50],
	   [230,100],
	   [50, 150],[140,150],[320,150],[410,150],
	   [230,200],
	   [230,250],],
	w:[[20,80,185,20],[20,80,275,20],[20,80,185,220],[20,80,275,220]],
	h:[]
},{ //boxes
	b:[220, 140],
	c:[[140,50],[230,50],[320,50],
	   [140,100],[320,100],
	   [140,150],[320,150],
	   [140,200],[320,200],
	   [140,250],[230,250],[320,250]],
	w:[[40,40,85,140],[40,40,355,140]],
	h:[]
},{ //corners
	b:[220, 140],
	c:[[140,50],[230,50],[320,50],
	   [50, 100],[410,100],
	   [50, 150],[410,150],
	   [50, 200],[410,200],
	   [140,250],[230,250],[320,250]],
	w:[[20,20,50,50],[20,20,410,50],[20,20,50,250],[20,20,410,250]],
	h:[]
},{ //two holes
	b:[220, 140],
	c:[[50, 50],[140,50],[320,50],[410,50],
	   [50, 100],[140,100],[320,100],[410,100],
	   [50, 200],[140,200],[320,200],[410,200],
	   [50, 250],[140,250],[320,250],[410,250]],
	w:[],
	h:[[35,135],[395,135]]
},{ //full house
	b:[220, 140],
	c:[[50, 50],[140,50],[230,50],[320,50],[410,50],
	   [50, 100],[140,100],[230,100],[320,100],[410,100],
	   [50, 150],[140,150],[320,150],[410,150],
	   [50, 200],[140,200],[230,200],[320,200],[410,200],
	   [50, 250],[140,250],[230,250],[320,250],[410,250]],
	w:[],
	h:[]
},{ //random
	b:[310,190],
	c:[[50, 50],[230,50],[320,50],[410,50],
	   [50, 100],[410,100],
	   [230,150],
	   [50, 200],
	   [230,250],[320,250],[410,250]],
	w:[[160,20,20,150]],
	h:[]
},{ //3+2
	b:[220, 40],
	c:[[50, 50],[410,50],
	   [50, 100],[230,100],[410,100],
	   [50, 150],[230,150],[410,150],
	   [50, 200],[230,200],[410,200],
	   [50, 250],[410,250]],
	w:[[20,100,185,110],[20,100,275,110]],
	h:[]
},{ //one on one
	b:[40,40],
	c:[[140,50],[230,50],[320,50],
	   [140,150],[230,150],[320,150],
	   [140,250],[230,250],[320,250]],
	w:[[200,20,20,200]],
	h:[[395,35]]
},{ //shield
	b:[220, 140],
	c:[[50, 50],[140,50],[230,50],[320,50],[410,50],
	   [50, 250],[140,250],[230,250],[320,250],[410,250]],
	w:[[140,20,20,150],[140,20,320,150]],
	h:[]
},{ //Labirinty
	b:[220, 140],
	c:[[50, 50],[140,50],[410,50],
	   [410,100],
	   [50, 200],
	   [50, 250],[320,250],[410,250]],
	w:[[20,80,95,220],[20,80,365,20],
	   [80,20,20,100],[80,20,380,200]],
	h:[]
},{ //sraf
	b:[40,40],
	c:[[230,50],[320,50],[410,50],
	   [140,150],[230,150],[320,150],
	   [50, 250],[140,250],[230,250]],
	w:[[20,100,95,100],
	   [100,20,115,100],[100,20,265,200],[20,100,365,120]],
	h:[]
}];

/**
 * The hole
 * @param {Number} x
 * @param {Number} y
 * @param {Number}r
 * @constructor
 */
function BB_Hole(x, y, r) {
	this.x = x || 0;
	this.y = y || 0;
	this.r = r || 25;
	this.w = this.r * 2;
	this.h = this.r * 2;
}

/**
 * Extends CP_Item
 */
BB_Hole.prototype = new CP_Item();

/**
 * Checck ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Hole.prototype.check = function(ball) {
	var vx = this.ox() - ball.ox(),
		vy = this.oy() - ball.oy(),
		d = Math.sqrt((vx * vx) + (vy * vy));
	return d < this.r;	
};
/**
 * Main menu scene
 * @param {BB_App} app
 * @constructor
 */
function BB_Main(app) {
	var sprite = app.sprite,
		drawer = app.drawer;
	this.app = app;
	this.ball = new BB_Ball(sprite, 120, 90);
	this.coin = new BB_Coin(sprite, 130, 135);
	this.sound = new BB_Button(sprite, 140, 245, 100, 32, 360, 100);
	this.sound.disabled = app.sound.disabled;
	this.start = new BB_Button(sprite, 240, 245, 100, 32, 160, 100);
	this.border = 20;
	this.repaint = true;
	drawer.wood(0, 0, this.w, this.h, 10);
	drawer.wood(0, 0, this.w, this.border, 2, 2);
	drawer.wood(0, this.border, this.border, this.h, 2, 2);
	drawer.wood(this.w-this.border, this.border, this.border, this.h, 2, 2);
	drawer.wood(0, this.h-this.border, this.w, this.border, 2, 2);
	drawer.info();
}

/**
 * Extends CP_Item
 */
BB_Main.prototype = new CP_Item(480, 320);

/**
 * Draw scene
 * @param {Object} ctx
 */
BB_Main.prototype.paint = function(ctx) {
	if (this.repaint) {
		this.clear(ctx);
		this.coin.paint(ctx);
		this.ball.paint(ctx);
		this.start.paint(ctx);
		this.sound.paint(ctx);
	}
};

/**
 * Check button status changes
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Main.prototype.check = function(x, y) {
	return this.sound.active ^ this.sound.check(x, y) |
		this.start.active ^ this.start.check(x, y) > 0;
};

/**
 * Scene event handler
 * @param {String} e
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} touch
 */
BB_Main.prototype.on = function(e, x, y, touch) {
	this.repaint = this.check(x, y) || this.repaint;
	switch (e) {
		case 'end':
			if (this.start.active) {
				this.app.sound.stop(4);
				this.app.start();
			} else if (this.sound.active) {
				this.sound.disabled = this.app.sound.disable();
				this.app.storage.setSound(!this.sound.disabled);
				if (!this.sound.disabled) {
					this.app.sound.play(4, .5 , true);
				}
			}
			break;
		case 'load':
			this.repaint = true;
			break;
		case 'music':
			this.app.sound.play(4, .5 , true);
			break;
	}
};

/**
 * Game overlay
 * @param {BB_Sprite} sprite
 * @param {BB_Score} score
 * @param {BB_Storage} storage
 * @constructor
 */
function BB_Overlay(sprite, score, level) {
	this.sprite = sprite;
	this.score = score;
	this.level = level;
	this.levels = BB_Game.maps.length;
	this.back = new BB_Button(sprite, 90, 220, 100, 32, 60, 100);
	this.start = new BB_Button(sprite, 190, 220, 100, 32, 160, 100);
	this.next = new BB_Button(sprite, 290, 220, 100, 32, 260, 100);
}

/**
 * Extends CP_Item
 */
BB_Overlay.prototype = new CP_Item(480, 320);

/**
 * Draw overlay
 */
BB_Overlay.prototype.paint = function(ctx) {
	var high = this.score.high ? 'New Highscore!' : 'Highscore: ' + this.score.highscore,
		level = 'Level: ' +  (this.level + 1) + '/' + this.levels,
		balls = this.score.balls,
		score = this.score.score,
		sprite = this.sprite;
	ctx.save();
	ctx.fillStyle = "rgba(0, 0, 0, .6)";
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineWidth = 4;
	ctx.fillStyle = "#f90";
	ctx.strokeStyle = "#420";
	ctx.font = "bold 24px Arial";
	ctx.strokeText(high, 240, 70);
	ctx.fillText(high, 240, 70);
	ctx.font = "bold 16px Arial";
	ctx.strokeText(level, 240, 100);
	ctx.fillText(level, 240, 100);
	ctx.lineWidth = 6;
	ctx.font = "bold 48px Arial";
	ctx.strokeText(score, 240, 150);
	ctx.fillText(score, 240, 150);
	ctx.restore();
	this.back.paint(ctx);
	this.start.paint(ctx);
	this.next.paint(ctx);
	if (balls) {
		sprite.paint(ctx, 216, 180, 48, 16, 0, 116);
	}
};

/**
 * Check bucton status changes
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Overlay.prototype.check = function(x, y) {
	return this.back.active ^ this.back.check(x, y) |
		this.start.active ^ this.start.check(x, y) |
		this.next.active ^ this.next.check(x, y) > 0;
};
/**
 * Score counter
 * @param {BB_Sprite} sprite
 * @constructor
 */
function BB_Score(sprite) {
	this.sprite = sprite;
	this.score = 0;
	this.buffer = 0;
	this.shot = 3;
	this.high = false;
	this.balls = 0;
	this.highscore = 0;
	this.next = false;
	this.end = false;
};

/**
 * Score event handler
 * @param {String} event
 */
BB_Score.prototype.on = function(event) {
	switch (event) {
		case 'shot':
			this.shot--;
			break;
		case 'wall':
			this.score += 111;
			break; 
		case 'coin':
			this.score += 3250;
			break; 
		case 'end':
			this.score += 12500 * this.shot;
			this.end = true;
			break;
	}
};

/**
 * Score thread
 * @returns {Boolean}
 */
BB_Score.prototype.run = function() {
	var result = this.buffer < this.score,
		value = this.buffer + 43;
	if (result) {
		this.buffer = value < this.score ? value : this.score;
	}
	return result;
};

/**
 * Draw score
 * @param ctx
 */
BB_Score.prototype.paint = function(ctx) {
	var score = this.end ? this.score : this.buffer,
		width = this.shot * 20;
	if (width) {
		this.sprite.paint(ctx, 480-width, 2, width, 16, 0, 100);
	}
	ctx.save();
	ctx.font = "bold 16px Arial";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#852";
	ctx.strokeText(score, 25, 16);
	ctx.fillStyle = "#f90";
	ctx.fillText(score, 25, 16);
	ctx.restore();
};

/**
 * Sound manager
 * @param {Function} callback
 * @constructor
 */
function BB_Sound(callback) {
	var self = this;
	this.index = -1;
	this.disabled = true;
	this.sounds = BB_Sound.notes;
	try {
		this.callback = callback;
		this.service = new Worker('worker.js');
		this.service.addEventListener('message', function(e) {
			self.finish(e.data);
		});
		this.create();
	} catch (e) {
		callback.call(this);
	}
}

/**
 * Disable/Enable sounds
 * @returns {Boolean}
 */
BB_Sound.prototype.disable = function() {
	this.disabled = !this.disabled;
	if (this.disabled) {
		for (var i=0; i<this.sounds.length; i++) {
			this.stop(i);
		}
	}
	return this.disabled;
};

/**
 * Generate sound with the worker process
 */
BB_Sound.prototype.create = function() {
	if (++this.index < this.sounds.length) {
		this.service.postMessage(this.sounds[this.index]);
	} else {
		this.service.terminate();
	}
};

/**
 * Create audio tag
 * @param {String} data Base64 encoded WAV data
 */
BB_Sound.prototype.finish = function(data) {
	var sound = new Audio();
	sound.preload = true;
	sound.src = data;
	sound.load();
	this.sounds[this.index] = sound;
	this.callback.call(this);
	this.create();
};

/**
 * Play sound
 * @param {Number} index
 * @param {Number} volume
 * @param {Boolean} loop
 */
BB_Sound.prototype.play = function(index, volume, loop) {
	var sound = this.sounds[index];
	if (!this.disabled && typeof sound == 'object') {
		sound.volume = volume || 1;
		sound.loop = loop || false;
		if (sound.currentTime) {
			sound.pause();
			sound.currentTime = 0;
		}
		sound.play();
	}
};

/**
 * Stop playing
 * @param {Number} index
 */
BB_Sound.prototype.stop = function(index) {
	var sound = this.sounds[index];
	if (typeof sound == 'object') {
		sound.pause();
	}
};

/**
 * Sound notes
 * chanells separated by pipe
 * notes separated by comas
 * note format: 
 *  - the first number is the length 1/n
 *  - character and nmber pairs represents music note and octave
 */
BB_Sound.notes = [
//bounce
'||||16e3',
'||||16e3',
//coin
'||||32e5,32b5',
'||||32e5,32b5',
//sax
'1,4,' +
'1,4,' +
'1,4,' +
'2,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16gb5,16g5,16gb5,16e5,4d5,' +
'2e5,4,16d5,16e5,16d5,16b4,4a4,' +
'2b4,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16d5,16e5,16d5,16b4,4a4,' + 
'2b4,4,16gb5,16g5,16gb5,16e5,4d5,' +
'1e5,4,' +
'8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6,' +
'8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5,' +
'8c6,4e6,8c6,4a5,8gb5,8g5,8a5,8bb5,' +
'8b5,8bb5,8b5,8c6,4d6,8d6,8db6,8d6,8eb6,' +
'8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6,' +
'8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5,' +
'8c6,4e6,8c6,4a5,8gb5,8a5,8d6,8c6,' +
'2b5,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16gb5,16g5,16gb5,16e5,4d5,' +
'2e5,4,16d5,16e5,16d5,16b4,4a4,' +
'2b4,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16d5,16e5,16d5,16b4,4a4,' + 
'2b4,4,16gb5,16g5,16gb5,16e5,4d5,' +
'1e5,4|' +
//piano
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8c3,4g3b3e4,8e3,4e3,4gb3,4g3b3e4,' +
'8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4,' +
'8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4,' +
'8g2,4gb3b3d4,8g2,4g2,4b2,4gb3a3d4,' +
'8c3,4g3c4e4,8e3,4e3,4gb3,4g3c4e4,' +
'8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4,' +
'8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4,' +
'8gb2,4gb3a3e4,8gb2,4gb3a3e4,4b2,4gb3a3db4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4|' +
//bass
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'4c2,1,'+
'4b1,1,'+
'4a1,1,'+
'4b1,2,4g1,4b1,'+
'4c2,1,'+
'4b1,1,'+
'4a1,1,'+
'4gb1,2,4b1,4,'+
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1|' +
//drum
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4'];

/**
 * PNG Sprite generator
 * @constructor
 */
function BB_Sprite() {
	this.scale = 1;
	this.image = new Image();
};

/**
 * Draw sprites
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} sx
 * @param {Number} sy
 */
BB_Sprite.prototype.paint = function(ctx, x, y, w, h, sx, sy) {
	var sw = Math.round(w * this.scale),
		sh = Math.round(h * this.scale);
	sx = Math.round(sx * this.scale);
	sy = Math.round(sy * this.scale);
	ctx.drawImage(this.image, sx, sy, sw, sh, x, y, w, h);
};

/**
 * Render circles
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @param {Number} fill
 * @param {Number} stroke
 * @param {Number} width
 * @param {Number} shadow
 */
BB_Sprite.prototype.renderCircle = function(ctx, x, y, r, fill, stroke, width, shadow) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	if (shadow) {
		shadow *= this.scale;
		ctx.shadowBlur = shadow;
		ctx.shadowColor = "rgba(0,0,0,.5)";
		ctx.shadowOffsetX = shadow;
		ctx.shadowOffsetY = shadow;
	}
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.lineWidth = width || 1;
		ctx.strokeStyle = stroke;
		ctx.stroke();
	}
	ctx.restore();	
};

/**
 * Render the red button
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 * @param {Number} rubber
 * @param {Number} scale
 */
BB_Sprite.prototype.renderBall = function(ctx, x, y, angle, rubber, scale) {
	var g = ctx.createRadialGradient(-10, -10, 80, -10, -10, 0),
		s = scale || 1;
    g.addColorStop(0, "#c00");
    g.addColorStop(1, "#900");
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	this.renderCircle(ctx, 0, 0, 17.5, g, '#600', 3, .5);
	ctx.rotate(Math.PI / 180 * angle);
	this.renderCircle(ctx, -5, -5, 3, '#200', '#600');
	this.renderCircle(ctx, -5, 5, 3, '#200', '#600');
	this.renderCircle(ctx, 5, -5, 3, '#200', '#600');
	this.renderCircle(ctx, 5, 5, 3, '#200', '#600');
	if (rubber) {
		ctx.lineWidth = 2.5;
		ctx.lineCap = 'round';
		ctx.strokeStyle = '#ddd';
		ctx.beginPath();
		ctx.moveTo(-5, -5);
		ctx.lineTo(5, 5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-5, 5);
		ctx.lineTo(5, -5);
		ctx.stroke();
	}
	ctx.restore();
};

/**
 * Render the golden buttons
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 * @param {Number} scale
 */
BB_Sprite.prototype.renderCoin = function(ctx, x, y, angle, scale) {
	var g = ctx.createRadialGradient(-5, -5, 40, -5, -5, 0),
		s = scale || 1;
    g.addColorStop(0, "#fc0");
    g.addColorStop(1, "#f60");
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	this.renderCircle(ctx, 0, 0, 8, g, '#c60', 2, .5);
	ctx.rotate(Math.PI / 180 * angle);
	this.renderCircle(ctx, -3, 0, 2, '#420', '#c60');
	this.renderCircle(ctx, 3, 0, 2, '#420', '#c60');
	ctx.restore();
};

/**
 * Render UI buttons 
 * @param ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} r
 * @param {String} text
 * @param {Number} status
 */
BB_Sprite.prototype.renderButton = function(ctx, x, y, w, h, r, text, status) {
	var g = ctx.createLinearGradient(0,0,0,h);
	g.addColorStop(0,"#fec");
	g.addColorStop(1, "#cb9");
	ctx.save();
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(0, r);
	ctx.arcTo(0, 0, r, 0, r);
	ctx.lineTo(w-r, 0);
	ctx.arcTo(w, 0, w, r, r);
	ctx.lineTo(w, h-r);
	ctx.arcTo(w, h, w-h, h, r);
	ctx.lineTo(r, h);
	ctx.arcTo(0, h, 0, h-r, r);
	ctx.closePath();
	ctx.fillStyle = g;
	ctx.fill();
	ctx.strokeStyle = status > 1 ? "#fff" : "#cb9";
	ctx.lineWidth = 2;
	ctx.stroke();
	
	ctx.font = "bold 20px Arial";
	ctx.textAlign = "center";
	//ctx.textBaseline = "middle";
	ctx.fillStyle = "#ccc";
	ctx.fillText(text, w/2, 22);
	ctx.fillStyle = status > 0 ? "#320" : "#986";
	ctx.fillText(text, w/2, 21);
	ctx.restore();
};

/**
 * Render the whole sprite
 * @param ctx
 * @param {Number} scale
 * @returns {BB_Sprite}
 */
BB_Sprite.prototype.render = function(ctx, scale) {
	this.scale = scale;
	ctx.save();
	var i;
	for (i=0; i<24; i++) {
		var a = i*7.5;
		if (i<12) {
			this.renderBall(ctx, i*40+20, 20, a, false);
			this.renderBall(ctx, i*40+20, 60, a, true);
		}
		if (i<3) {
			this.renderBall(ctx, i*20+10, 108, 0, false, .35);
			this.renderCoin(ctx, i*16+8, 124, 0, .8);
		}
		this.renderCoin(ctx, i*20+10, 90, a);
	}
	for (i=0; i<3; i++) {
		this.renderButton(ctx, 67, i*32+102, 86, 28, 13, "BACK", i);
		this.renderButton(ctx, 167, i*32+102, 86, 28, 13, "START", i);
		this.renderButton(ctx, 267, i*32+102, 86, 28, 13, "NEXT", i);
		this.renderButton(ctx, 367, i*32+102, 86, 28, 13, "SOUND", i);
	}
	this.image.src = ctx.canvas.toDataURL('image/png');
	ctx.restore();
	ctx.clearRect(0, 0, 480, 320);
	return this;
};

/**
 * Game data storage
 * @param {Number} levels
 * @constructor
 */
function BB_Storage(levels) {
	this.levels = levels;
	this.data = {
		level: 0,
		balls: [],
		score: [],
		sound: !window.orientation
	};
	if (localStorage.data) {
		this.data = JSON.parse(localStorage.data);
	}
}

/**
 * Save data to local storage
 */
BB_Storage.prototype.save = function() {
	localStorage.data = JSON.stringify(this.data);
};

/**
 * Set score data and check new highscore
 * @param {Number} level
 * @param {BB_Score} score
 * @param {Boolean} level completed
 */
BB_Storage.prototype.setScore = function(level, score, done) {
	if (level <= this.data.level) {
		score.highscore = this.data.score[level] || 0;
		score.high = score.score > score.highscore;
		if (score.high) {
			this.data.score[level] = score.score;
			this.data.balls[level] = score.shot;
		}
		if (
			done && 
			level < this.levels-1 && 
			level == this.data.level
		) {
			this.data.level++;
		}
		this.save();
		score.balls = this.data.balls[level] || 0;
		score.next = level < this.data.level;
	}
};

/**
 * Set sound enabled
 * @param {Boolean} enabled
 */
BB_Storage.prototype.setSound = function(enabled) {
	this.data.sound = enabled;
	this.save();
};

/**
 * Get sound enabled
 * @returns {Boolean}
 */
BB_Storage.prototype.getSound = function() {
	return this.data.sound;
};

/**
 * Get maximun level number
 * @returns {Number}
 */
BB_Storage.prototype.getLevel = function() {
	return this.data.level;
};

/**
 * Wooden walls
 * @param {Number} w
 * @param {Number} h
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
function BB_Wall(w, h, x, y) {
	this.set(w, h, x, y);
}

/**
 * Extends CP_Item
 */
BB_Wall.prototype = new CP_Item();

/**
 * Check ball collision
 * @param {BB_Ball} ball
 * @returns {Boolean}
 */
BB_Wall.prototype.check = function(ball) {
	var r = ball.r,
		x = ball.ox(),
		y = ball.oy(),
		x1 = this.x,
		y1 = this.y,
		x2 = x1 + this.w,
		y2 = y1 + this.h;
	if (x >= x1 && x <= x2) {
		//top
		if (y < y1 && y1 - y < r) {
			ball.oy(y1 - r);
			ball.bounce(1, -1);
			return true;
		}
		//bottom
		if (y > y2 &&  y - y2 < r) {
			ball.oy(y2 + r);
			ball.bounce(1, -1);
			return true;
		}
	}
	if (y >= y1 && y <= y2) {
		//left
		if (x < x1 && x1 - x < r) {
			ball.ox(x1 - r);
			ball.bounce(-1, 1);
			return true;
		}
		//right
		if (x > x2 &&  x - x2 < r) {
			ball.ox(x2 + r);
			ball.bounce(-1, 1);
			return true;
		}
	}
	//top left
	if (x < x1 && y < y1) {
		return ball.check(x1, y1, true);
	}
	//bottom left
	if (x < x1 && y > y2) {
		return ball.check(x1, y2, true);		
	}
	//top right
	if (x > x2 && y < y1) {
		return ball.check(x2, y1, true);
	}
	//bottom right
	if (x > x2 && y > y2) {
		return ball.check(x2, y2, true);
	}
	return false;	
};


})();
