/* animLoopX.js from gist.github.com/louisremi/1114293
 * Cross browser, backward compatible solution
 */
(function( window, Date ) {
	// feature testing
	var raf = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;
 
	window.animLoop = function( render, element ) {
		var running, lastFrame = +new Date();
		function loop( now ) {
			if ( running !== false ) {
				if (raf)
					raf(loop, element);
				else
					setTimeout(loop, 16);
				// Make sure to use a valid time, since:
				// - Chrome 10 doesn't return it at all
				// - setTimeout returns the actual timeout
				now = now && now > 1E4 ? now : +new Date();
				var deltaT = now - lastFrame;
				// do not render frame when deltaT is too high
				if ( deltaT < 160 ) {
					running = render( deltaT, now );
				}
				lastFrame = now;
			}
		}
		loop();
	};
})( window, Date );


var middle = 150,
	light_blue = "#40FFE0",
	grey = "#999285",
	yellowy = "#F7B019",
	orange = "#FF6E00",
	green = "#14C77A"
;

_ = {
	nil: function() {},
	$: function(id) {
		return document.getElementById(id);
	},
	$$: function(t) {
		return document.getElementsByTagName(t);
	},
	extend: function(a, b) {
		Object.keys(b).forEach(function(k) {
			a[k] = b[k];
		});
		return a;
	},
	play: function(a) {
		if (!this.muted) {
			a.cloneNode().play();
		}
	},
	muted: false
};

var Seq = function(title, objs, props) {
	this.title = title;
	this.finished = 0;
	this.objs = objs;

	/* each object has an x value, which we consider to be its
		offset from the previous object.
	*/
	var x = 0;
	objs.forEach(function(o) {
		x += o.x;
		o.x0 = x;
		x += o.w;
		o.seq = this;
	}, this);

	this.w = x;
	if (props) {
		_.extend(this, props);
	}
};

_.extend(Seq.prototype, {
	tick: function(t) {
		this.x -= t / 1000 * 200;

		if (this.w + this.x < 0)
			this.gone();
	},

	draw: function(ctx) {
		this.objs.forEach(function(o) {
			o.x = o.x0 + this.x;
			o.draw(ctx);
		}, this);
	},

	checkHit: function(avatar) {
		this.remaining = 0;
		this.objs.forEach(function(o) {
			if (o.checkHit(avatar) === false) {
				this.remaining++;
			}
		}, this);
	},

	init: function(game) {
		this.game = game;
		this.x = 1000;
		this.objs.forEach(function(o) {
			o.hit = false;
		});
		this.setup();
	},

	gone: function() {
		this.teardown();
		if (this.remaining <= 0)
			this.finished = 2;
		else
			this.init(this.game);
	},

	setup: _.nil,
	teardown: _.nil, 
});

var Ball = function(x, h) {
	this.x = x;
	this.y = middle + h * 30;
	this.hit = false;
};

_.extend(Ball.prototype, {
	w: 70,
	hitColor: green,
	checkHit: function(avatar) {
		var dx = avatar.x - this.x, dy = avatar.y - this.y, hit = this.hit;
		if (Math.sqrt(dx * dx + dy * dy) < (this.w/2 + 5)) {
			this.hit = true;
			if (!hit) {
				_.play(this.noise);
			}
		}
		return this.hit;
	},
	
	draw: function(ctx) {
		var x = this.x, y = this.y;
		ctx.fillStyle = this.hit ? this.hitColor : "white";
		ctx.beginPath();
		ctx.moveTo(x + this.w/2, y);
		ctx.arc(x, y, this.w/2, 0, Math.PI * 2);
		ctx.fill();
		/* IFDEF DEBUG
		ctx.strokeStyle = "blue";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(x, y);
		ctx.stroke();
		*/
	}
});

var BadBall = function(x, h) {
	Ball.call(this, x, h);
};


BadBall.prototype = _.extend(Object.create(Ball.prototype), {
	w: 40,
	hitColor: grey,
	checkHit: function(avatar) {
		return !Ball.prototype.checkHit.call(this, avatar);
	}
});

var Thing = function() {
	this.time = 0;
	this.x = 300;
	this.y = middle;
	this.v = 0;
};

_.extend(Thing.prototype, {
	draw: function(ctx) {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.moveTo(this.x + 10, this.y);
		ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
		ctx.fill();
	},
	tick: function(t) {
		var nudged = this.y - middle,
			sign = (nudged > 0) ? 1 : -1;
		this.v -=  sign * 26 / 1000 * t;
		this.v *= 1.0 - (0.9 / 1000 * t);
		if (Math.abs(nudged) < 10 && Math.abs(this.v) < 10 / t) {
			this.v = 0;
			this.y = middle;
		}
		this.y += this.v;

		if (Math.abs(this.y - middle) > 150) {
			this.y = middle + 150 * sign;
			this.v = sign * Math.min(8, Math.abs(this.v));
		}
	},
	nudge: function(sign) {
		this.v -=  sign * 8;
	},
});

var Game = function() {
	var canvas = _.$('c');
	this.w = canvas.width;
	this.h = canvas.height;
	this.ctx = canvas.getContext('2d');
	this.seq = 0;
	this.progress = _.$("progress");
	this.title = _.$("title");
	this.player = new Thing();

	this.seqs = [new Seq("tap up", [
					new Ball(0, 0),
					new Ball(260, 2),
					new Ball(90, -2.5),
					]),
				new Seq("adapt", [
					new BadBall(0, 0),
					new Ball(260, 2),
					new Ball(90, -2.5),
					]),
				new Seq("you are special and amazing", [
					new Ball(0, 0),
					new BadBall(40, 0),
					new Ball(40, 0),
					new BadBall(40, 0),
					new Ball(40, 0),
					new BadBall(40, 0),
					new Ball(40, 0),
					]),
				new Seq("you don't need to know what you're doing",
					[new Ball(0, 0),
					new Ball(90, 3),
					new Ball(160, 3),
					new Ball(30, 0),
					new Ball(190, 0)], {
						setup: function() {
							_.$$('body')[0].className = "squished";
						},
						teardown: function() {
							_.$$('body')[0].className = "";
						},
					}),
				new Seq("push against your limits", [
					new Ball(0, 5),
					new Ball(60, 5),
					new Ball(30, -5),
					new Ball(60, -5),
					]),
				new Seq("you can do it", [
					new Ball(0, 2),
					new Ball(90, -2.5),
					new Ball(80, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					new Ball(0, 0),
					]),
				new Seq("you can do anything", [
					new Ball(0, 0),
					new Ball(30, 3),
					new Ball(30, -0),
					new Ball(30, -3),
					]),
				new Seq("never give up", [
					new Ball(90, -2.5),
					new BadBall(100, 5),
					new BadBall(-50, 4),
					new BadBall(-50, 3),
					new BadBall(-50, 2),
					new BadBall(-50, 1),
					new BadBall(-50, 0),
					new BadBall(-50, -1),
					new BadBall(-50, -2),
					new BadBall(-50, -3),
					new BadBall(-50, -4),
					new BadBall(-50, -5),
					new Ball(140, 2.5),],
					{
						tries: 0,
						titles: ["don't stop now", 'keep trying',
							'never give up', 'believe in yourself'],
						teardown: function() {
							this.tries = ++this.tries % this.titles.length;
							this.title = this.titles[this.tries];
							this.game.title.innerHTML = this.title;
						}
					}
				),
				new Seq("how did you get here?", [
					new Ball(0, 0),
				]),
				new Seq("srsly", [
					new Ball(0, 0),
				])
			];
	this.seqs[this.seq].init(this);
};

_.extend(Game.prototype, {
	nextSeq: function() {
		++this.seq;
		if (this.seq >= this.seqs.length)
			this.finished = true;
		else
			this.seqs[this.seq].init(this);
		this.updatePosition();
	},

	updatePosition: function() {
		var result = [], type;
		for (var i = 0; i < this.seqs.length; i++) {
			type = this.seqs[i].finished == 2 ? "finished" : "unfinished";
			if (i == this.seq) {
				type = "current";	
				this.title.innerHTML = this.seqs[i].title;
			}
			result.push('<span class="', type, '">&#5603;</span>');
		}
		this.progress.innerHTML = result.join("");
	},

	update: function(t) {
		var s = this.seqs[this.seq];
		this.player.tick(1000/60);
		s.tick(1000/60);
		s.checkHit(this.player);
		this.ctx.clearRect(0, 0, this.w, this.h);
		s.draw(this.ctx);
		this.player.draw(this.ctx);

		if (s.finished > 0)
			this.nextSeq();
	},
});

window.onload = function() {
		var game = new Game();
		Ball.prototype.noise = _.$('h');
		BadBall.prototype.noise = _.$('l');

		/* some event handlers */
		_.$$('body')[0].onkeydown = function(e) {
			var key = e.keyCode || e.which;
			if (key == 0x26) {
				game.player.nudge(1);
			} else if (key == 0x28) {
				game.player.nudge(-1);
			}
		};

		_.$('mute').onclick = function() {
			_.muted = !_.muted;
			_.$('mute').textContent = _.muted ? 'unmute' : 'mute';
		};

		game.updatePosition();
		animLoop(function(dt, now) {
			if (!game.finished) {
				game.update(1000/60);
			}
		}, _.$('c'));
};
