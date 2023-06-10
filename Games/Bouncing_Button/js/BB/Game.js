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
