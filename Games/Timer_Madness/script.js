/*
Helper functions
*/

// Prefix for CSS animation
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

//Check animation method for each browser
//@paul_irish function
window.requestAnimationFrame = (function(){
	return  window.requestAnimationFrame   ||  //Chromium 
		window.webkitRequestAnimationFrame ||  //Webkit
		window.mozRequestAnimationFrame    || //Mozilla Geko
		window.oRequestAnimationFrame      || //Opera Presto
		window.msRequestAnimationFrame     || //IE Trident?
		function(callback, element){ //Fallback function
			window.setTimeout(callback, 1000/60);
		};
})();

// Set and get Cookie
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays === null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1){
		c_value = null;
	}
	else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

/* User Class */
var User = function(){
	return {
		name : 'Player 1',
		points : 0,
		life : 3,
		cont : {
			level : 0,
			points : 0,
			num : 3,
			life : 3
		}
	};
};

/* Bonus class */
var Bonus = function(canvas,ctx,cX,cY){
	this.status =  false;
	this.canvas = canvas;
	this.ctx = ctx;
	this.r = ('createTouch' in document) ? 15 : 20;
	this.cX = cX;
	this.cY = cY;
	this.strokeColor = 'rgb(255,255,255)';
	this.fillStyle = '#7F1313';
	this.counter = 0;

};

/* Bonus public methods */
Bonus.prototype.draw = function() {
	this.counter++;
	var ctx = this.ctx;
	ctx.beginPath();
	this.cX += 2;
	this.cY += Math.sin(this.counter/10);
	ctx.arc(this.cX,this.cY,this.r,0,2*Math.PI);
	ctx.fillStyle = this.fillStyle;
	ctx.fill();
	if(this.cX-this.r > this.canvas.width ){
		return false;
	} else {
		return true;
	}
	
};

/* Timer Class */
var Timer = function(canvas,ctx,speed,cX,cY){
	this.canvas = canvas;
	this.ctx = ctx;
	this.r = ('createTouch' in document) ? 15 : 20;
	this.speed = speed;
	this.cX = cX;
	this.cY = cY;
	this.strokeColor = 'rgb(255,255,255)';
	this.fillStyle = '';
	
	this.fillStyle = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';
	this.circ = 0;
	this.counter = 0;	//timer tick counter

	this.points = 0;
	this.pointsFactor = 1;

	this.lastClickTime = 0;
	this.lastUpdate = 0;
	this.clicked = 0;
	this.animation = 0;


	/* Private methods */
	this.updateArc = function(framerate,callback){

		if(this.circ < 2){ // if the circle is not complete, make another tick
			var now = new Date().getTime();
				this.counter += (60/framerate)*this.speed;
				this.points = Math.floor(this.counter / 3.27) * this.pointsFactor; // x : 327 = 1 : 100
				this.circ = this.counter * 0.006; // 0.006 = (200/360)/100 --> x : 200 = 1 : 360
				this.lastUpdate = now;
			return true;
		} else {
			this.kill(callback);
			return false;
		}
	};
};

/* Public Methods */
Timer.prototype.isAnimation  = function(){
	return this.animation;
};
Timer.prototype.isClicked  = function(){
	return this.clicked;
};
Timer.prototype.setClicked  = function(){
	this.circ = 99;
	this.clicked = true;
};
Timer.prototype.setAnimation  = function(){
	this.circ = 99;
	this.animation = true;
};

Timer.prototype.kill = function(callback){
	if(typeof callback !== 'undefined'){
		if(typeof this.explosion === 'undefined'){
			this.explosion = new TimerExplosion(this.ctx,this.r,this.cX,this.cY,(!this.isClicked()) ? 1 : 2);
		}
		this.explosion.run(callback);
	}
};

Timer.prototype.draw = function(activeBonus,framerate,callback) {
	if(this.updateArc(framerate,callback)){
		var ctx = this.ctx,
			c = this.canvas;
		var trX = 0,
		trY = 0;
		if(this.circ > 1.5){
			trX = Math.floor(Math.random() * 10);
			trY = Math.floor(Math.random() * 10);
		}	else if(this.circ > 1) {
			trX = Math.floor(Math.random() * 5);
			trY = Math.floor(Math.random() * 5);
		} else if(this.circ > 0.5){
			trX = Math.floor(Math.random() * 2);
			trY = Math.floor(Math.random() * 2);
		}

		var alpha = (this.circ < 0.25 ) ? this.circ*4 : 1;
		var g = Math.floor(255-((Math.floor(1-this.circ)*-1) * (this.circ-1)*255));
		var r = Math.floor(255*this.circ) - (255-g)+1;
		ctx.fillStyle = 'rgba('+r+','+g+',0,'+alpha+')';
		ctx.strokeStyle = (this.circ < 0.25 ) ? 'rgb(0,255,0)' : 'rgb(0,0,0)';
		ctx.beginPath();
		ctx.arc(this.cX+trX,this.cY+trY,this.r ,0,2*Math.PI);
		
		ctx.stroke();
		ctx.fill();
	}
};
Timer.prototype.changeColor = function(color) {
	this.strokeColor = color;
};
Timer.prototype.getPoints = function() {
	return this.points;
};

/* Timer explosion class */
var TimerExplosion = function(ctx,r,cx,cy,type){
	this.ctx = ctx;
	this.r = r;
    this.cx = cx;
    this.cy = cy;
    this.grown = 1;
    this.animFrames = 20;
    this.num = 10;
    this.numSteps = 30;
    this.type = type;
};

/* Public methods */
TimerExplosion.prototype.run = function(callback){
	var px1,py1,rand,newR;

	var alpha = 1;
	var green = 255-Math.round(this.num*2.55);
		newR = (20-this.grown > 0) ? 20-this.grown : 0;
		this.ctx.beginPath();
		this.ctx.arc(this.cx,this.cy,newR,0,2*Math.PI);
		this.ctx.fillStyle = 'rgba(255,'+green+',0,'+alpha+')';
		this.ctx.fill();
		px1 = Math.floor(Math.random()-1)*Math.floor(Math.random()*(this.grown*2))+(this.cx+this.r/2);
		py1 = Math.floor(Math.random()-1)*Math.floor(Math.random()*(this.grown*2))+(this.cy+this.r/2);
		this.ctx.beginPath();
		this.ctx.arc(px1,py1,newR,0,2*Math.PI);
		this.ctx.fillStyle = 'rgba(255,'+green+',0,'+alpha+')';
		this.ctx.fill();
		
	for (var a=0,aMax=(2*Math.PI),aStep=(Math.PI/this.num); a<aMax; a+=aStep){
		if(this.type === 2){
			rand = (Math.round(Math.random())-1) * (Math.floor(Math.random()*10)+1);
			rDyn = this.r+rand;
			px1 = this.cx+Math.sin(a)*(rDyn);
			py1 = this.cy+Math.cos(a)*(rDyn);
		} else {
			rand = (Math.round(Math.random())-1) * (Math.floor(Math.random()*5)+1);
			rDyn = this.r+rand;
			px1 = this.cx+Math.sin(a)*(rDyn);
			py1 = this.cy+Math.cos(a)*(rDyn);
		}
		this.ctx.beginPath();
		this.ctx.moveTo(px1,py1);
		this.ctx.lineTo(px1-1,py1-1);
		
		this.ctx.strokeStyle ='rgba(255,'+green+',0,'+alpha+')';
		this.ctx.stroke();
	}

	if(this.grown >= 20){
           callback();
    } else {
        this.grown++;
    }
    
};

/* App Class */
var App = {
	// properties
	debug : false,
	interval : false,
	timers : [],
	timersPos : [],
	level : 0,
	r : 20,
	levelLabel : function(){
		return this.level +1;
	},
	status : 'stop',
	mode : '',
	countDownValue : -1,
	lastSecond : 0,
	bonus : {},
	shakeCounter : 0,
	shakeActive : false,
	actualFramerate : 60,
	framerateCounter : 0,
	logoInterval : true,
	continueOn : false,
	// Levels
	levelsDataArcade : [
		{
			level : 1,
			timersMax : 4,
			countDown : 15,
			pointsNeeded :800,
			speed : [1,1.3,1.5],
			bonus : 1
		},
		{
			level : 2,
			timersMax : 4,
			countDown : 15,
			pointsNeeded : 1000,
			speed : [1,1.3,1.5,1.7],
			bonus : 1
		},
		{
			level : 3,
			timersMax : 5,
			countDown : 15,
			pointsNeeded : 1200,
			speed : [1,1.3,1.5,1.7,2],
			bonus : 1
		},
		{
			level : 4,
			timersMax : 5,
			countDown : 15,
			pointsNeeded : 1400,
			speed : [1,1.5,1.7,2,2.5],
			bonus : 1
		},
		{
			level : 5,
			timersMax : 6,
			countDown : 15,
			pointsNeeded : 2000,
			speed : [1,1.5,1.7,2,2.5,2.7],
			bonus : 5
		},
		{
			level : 6,
			timersMax : 6,
			countDown : 20,
			pointsNeeded : 2200,
			speed : [1,1.5,1.7,2,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 7,
			timersMax : 7,
			countDown : 20,
			pointsNeeded : 2400,
			speed : [1,1.5,1.7,2,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 8,
			timersMax : 7,
			countDown : 20,
			pointsNeeded : 2600,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 9,
			timersMax : 8,
			countDown : 20,
			pointsNeeded : 3000,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 10,
			timersMax : 10,
			countDown : 20,
			pointsNeeded : 3200,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 11,
			timersMax : 12,
			countDown : 25,
			pointsNeeded : 3400,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 12,
			timersMax : 14,
			countDown : 25,
			pointsNeeded : 3800,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 13,
			timersMax : 15,
			countDown : 27,
			pointsNeeded : 4500,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 14,
			timersMax : 15,
			countDown : 30,
			pointsNeeded : 6000,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
		{
			level : 15,
			timersMax : 15,
			countDown : 30,
			pointsNeeded : 8000,
			speed : [1,1.5,1.7,2,2.3,2.5,2.7,3],
			bonus : 5
		},
	],
	levelsDataSurvivor : [
		{
			level : 1,
			timersMax : 3,
			countDown : 15,
			pointsNeeded :0,
			speed : [1,1.5],
			bonus : 1,
		},
		{
			level : 2,
			timersMax : 3,
			countDown : 15,
			pointsNeeded : 0,
			speed : [1,1.5,1.7],
			bonus : 1,
		},
		{
			level : 3,
			timersMax : 4,
			countDown : 15,
			pointsNeeded : 0,
			speed : [1,1.5,1.7,1.9],
			bonus : 2,
		},
		{
			level : 4,
			timersMax : 5,
			countDown : 17,
			pointsNeeded : 0,
			speed : [1,1.5,1.7,1.9],
			bonus : 2,
		},
		{
			level : 5,
			timersMax : 5,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1,1.5,1.7,1.9,2],
			bonus : 3,
		},
		{
			level : 6,
			timersMax : 6,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2],
			bonus : 3,
		},
		{
			level : 7,
			timersMax : 6,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.2],
			bonus : 4,
		},
		{
			level : 8,
			timersMax : 6,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.3,2.5],
			bonus : 4,
		},
		{
			level : 9,
			timersMax : 7,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.3,2.5],
			bonus : 6,
		},
		{
			level : 10,
			timersMax : 7,
			countDown : 20,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.3,2.5,2.7],
			bonus : 6,
		},
		{
			level : 11,
			timersMax : 8,
			countDown : 25,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.3,2.5,2.7],
			bonus : 8,
		},
		{
			level : 12,
			timersMax : 8,
			countDown : 25,
			pointsNeeded : 0,
			speed : [1.5,1.7,1.9,2,2.3,2.5,2.7,2.9],
			bonus : 9,
		},
		{
			level : 13,
			timersMax : 9,
			countDown : 30,
			pointsNeeded : 0,
			speed : [1.7,1.9,2,2.3,2.5,2.7,3],
			bonus : 10,
		},
		{
			level : 14,
			timersMax : 10,
			countDown : 30,
			pointsNeeded : 0,
			speed : [1.7,1.9,2,2.3,2.5,2.7,3,3.1],
			bonus : 10,
		},
		{
			level : 15,
			timersMax : 5,
			countDown : 30,
			pointsNeeded : 0,
			speed : [1.7,1.9,2,2.3,2.5,2.7,3,3.1,3.3],
			bonus : 10,
		}
	],
	/* Getter */
	getSpeed : function(){
		return this.getLevelData().speed[Math.floor(Math.random() * this.getLevelData().speed.length)];
	},
	getLevelData : function(){
		if(this.mode === 'survivor')
			return this.levelsDataSurvivor[this.level];
		else
			return this.levelsDataArcade[this.level];
	},


	// methods
	init : function(){
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 0);
		}, 10);
		var self = this;
		

		var supportsTouch = 'createTouch' in document;
		this.user = new User();

		this.menuContainer = document.getElementById('menu-container');
		this.gameContainer = document.getElementById('game-container');
		this.hud = document.getElementById('hud');
		this.endGameContainer = document.getElementById('endgame-container');
		this.canvas = document.getElementById("game-stage");
		this.ctx = this.canvas.getContext("2d");

		
		/* Resize */

		var resizeWin = function(canvas){
			if(window.innerWidth < 1024){
				canvas.width = window.innerWidth-2;
			} else {
				document.getElementById('general-container').style.width = canvas.width-2;
				document.getElementById('menu-container').style.width = canvas.width-2;
				document.getElementById('tutorial-container').style.width = canvas.width-2;
			}
			if(window.innerHeight  < 768){
				document.body.style.height = window.innerHeight + "px";
				//canvas.height = document.documentElement.clientHeight-35;
				canvas.height = window.innerHeight-2;
				document.getElementById('tutorial-container').style.height = (window.innerHeight-32) + 'px';
				document.getElementById('general-container').style.width = canvas.width-2;
				document.getElementById('menu-container').style.width = canvas.width-2;
			}
		};

		resizeWin(this.canvas);
		
		var c_username = getCookie('c_username');
		if(c_username !== null){
			document.getElementById('player-input').value = c_username;
		}

		/* Start eventListeners */

		window.onresize=function(e){
			resizeWin(self.canvas);
		};

		document.getElementById('player-form').addEventListener('submit', function(e){
			e.preventDefault();
			if(document.getElementById('player-input').value !== ''){
				self.user.name = document.getElementById('player-input').value;
				self.startGame(e);
			}
			return false;
		});

		var ev = '';
		if(supportsTouch){
			ev ='touchstart';
			this.canvas.addEventListener('touchstart', function(e){
				e.preventDefault();
				self.getTimerTouched(e);
				return false;
			});
			this.canvas.addEventListener('touchmove',function(e){
				e.preventDefault();
				if('status' in self.bonus && self.bonus.status === true){
					self.getTimerTouched(e);
				}
			});
		} else{
			ev = 'click';
			this.canvas.addEventListener('click', function(e){
				self.getTimerClicked(e);
				return false;
			});
		}
		document.getElementById('status').addEventListener(ev,function(e){
			self.startPauseGame(e);
			return false;
		});
		document.getElementById('change-level-start').addEventListener(ev,function(e){
			self.startPauseGame(e);
			return false;
		});

		document.getElementById('how-to-play').addEventListener(ev,function(e){
			document.getElementById('tutorial-container').className = '';
			document.getElementById('menu-container').className = 'hidden';
			return false;
		});
		document.getElementById('close-how-to-play').addEventListener(ev,function(e){
			document.getElementById('tutorial-container').className = 'hidden';
			document.getElementById('menu-container').className = '';
			return false;
		});

		document.getElementById('start-game-arcade').addEventListener(ev, function(e){
			self.mode = 'arcade';
			self.showPreStartGraphics();
			return false;
		});
		document.getElementById('start-game-survivor').addEventListener(ev, function(e){
			self.mode = 'survivor';
			self.showPreStartGraphics();
			return false;
		});

		document.getElementById('start-game').addEventListener(ev, function(e){
			e.preventDefault();
			if(document.getElementById('player-input').value !== ''){
				self.user.name = document.getElementById('player-input').value;
			}
			self.startGame(e);
			return false;
		});

		// Menu and how to animation

		var canvasLogo = document.getElementById("logo");
		canvasLogo.width = 300;
		canvasLogo.height = 300;
		var ctxLogo = canvasLogo.getContext("2d");
		var logoRandX,
			logoRandY;

		var canvasTimer2 = document.getElementById('show-timer-2');
		canvasTimer2.width = 30;
		canvasTimer2.height = 30;
		var ctxCanvas2 = canvasTimer2.getContext("2d");
		var canvas2aRndX,
			canvas2RandY;


		var canvasTimerMadness = document.getElementById('show-timer-madness');
		canvasTimerMadness.width = this.canvas.width-2;
		canvasTimerMadness.height = 60;
		var ctxCanvasMadness = canvasTimerMadness.getContext("2d");
		var canvasMadnessX =-20;
		var canvasMadnessY;


		var canvasTimerSwipe = document.getElementById('show-timer-swipe');

		
		function renderLogo(){

			ctxLogo.clearRect(0,0,canvasLogo.width,canvasLogo.height);
			ctxCanvas2.clearRect(0,0,canvasTimer2.width,canvasTimer2.height);
			ctxCanvasMadness.clearRect(0,0,canvasTimerMadness.width,canvasTimerMadness.height);

			logoRandX = Math.floor(Math.random() * 40)-20;
			logoRandY = Math.floor(Math.random() * 40)-20;
			ctxLogo.beginPath();
			ctxLogo.arc(150+logoRandX,150+logoRandY,100,0,2*Math.PI);
			ctxLogo.fillStyle = 'rgb(255,0,0)';
			ctxLogo.fill();

			canvas2aRndX = Math.floor(Math.random() * 2)-1;
			canvas2aRndY = Math.floor(Math.random() * 2)-1;

			ctxCanvas2.beginPath();
			ctxCanvas2.arc(15+canvas2aRndX,15+canvas2aRndY,10,0,2*Math.PI);
			ctxCanvas2.fillStyle = 'rgb(180,255,0)';
			ctxCanvas2.fill();

			canvasMadnessX = (canvasMadnessX > canvasTimerMadness.width+50) ? -20 : canvasMadnessX+2;

			canvasMadnessY = Math.sin(canvasMadnessX/10)*5+15;

			ctxCanvasMadness.beginPath();
			ctxCanvasMadness.arc(canvasMadnessX,canvasMadnessY,10,0,2*Math.PI);
			ctxCanvasMadness.fillStyle = '#7F1313';
			ctxCanvasMadness.fill();
			
			if(self.logoInterval === true){
				requestAnimationFrame(renderLogo);
			}
				
		}

		requestAnimationFrame(renderLogo);
	},
	showPreStartGraphics : function(){
		this.menuContainer.className = 'hidden';
		document.getElementById('player-container').className = '';
	},
	startPauseGame : function (e) {
		e.preventDefault();
		if(this.status === 'play'){
			this.status = 'pause';
			this.updateHUD();
			this.interval = false;
		} else {
			var self = this;
			document.getElementById('change-level-start').className = 'hidden';
			document.getElementById('change-level').className = 'hidden';
			self.runGameInterval();
			
		}
		return false;
	},
	runGameInterval : function(){
		
		this.status = 'play';
		this.interval = true;
		var self = this;
		this.lastSecond = new Date().getTime();
		var frame = 0;
		var frameTime = new Date().getTime();
		
		function renderGame(){
			self.gameLoop();
			if(new Date().getTime() - frameTime >= 1000){
				self.framerate = frame;
				frame = 0;
				frameTime = new Date().getTime();
			} else {
				frame++;
			}
			if(self.interval === true){
				requestAnimationFrame(renderGame);
			}
		}
		requestAnimationFrame(renderGame);
	},
	startGame : function(e){
		
		e.preventDefault();

		setCookie('c_username', this.user.name,365);

		this.logoInterval = false;
		// hide intro screen
		document.getElementById('player-container').className = 'hidden';
		document.getElementById('player-input').blur();
		this.hud.className = '';
		this.updateHUD();
		var self = this;
		
		setTimeout(function(){ // wait a second before start with the game
			self.startLevel();
			self.runGameInterval();
		}, 1000);
		return false;
	},
	restartGame : function(e){
		window.location.reload(true);
		return false;
	},
	startLevel : function(){
		this.countDownValue = this.getLevelData().countDown;
	},
	countDownLoop : function(){		
		var now = new Date().getTime();
		var minX = this.r,
			maxX = this.canvas.width-this.r,
			minY = 50+this.r,
			maxY = this.canvas.height-this.r;
		this.framerateCounter++;
		if(now - this.lastSecond >= 1000){
			this.lastSecond = now;
			this.actualFramerate = this.framerateCounter;
			this.framerateCounter = 0;
			this.countDownValue--;
			if(this.countDownValue <= 0){
				this.changeLevel();
			} else if(typeof this.bonus.status ==='undefined'){
				var randActivate = Math.floor(Math.random()*100);
				if(randActivate <= this.getLevelData().bonus){
					var bonusX = 0;
					var bonusY = Math.floor(Math.random()*(maxY-minY+1))+minY;
					this.bonus = new Bonus(this.canvas,this.ctx,bonusX,bonusY);
				}
			}
		}
		
	},

	changeLevel : function(){
		if((this.user.points >= this.getLevelData().pointsNeeded && this.mode === 'arcade') || this.mode === 'survivor'){ // livello superato
			console.log(this.getLevelData().level+ ' -> '+ this.user.points);
			this.status = 'changing-level';
			this.level++;
			this.bonus = {};
			this.canvas.style.backgroundColor = '';
			
			this.user.cont.level = this.level;
			this.user.cont.points = this.user.points;
			this.user.cont.life = this.user.life;
			var self = this;
			if(typeof this.getLevelData() === 'undefined'){
				if(this.shakeActive !== true)
					this.gameOver();
			} else {
				for(var i in self.timers){
					self.timers[i].setAnimation();
				}
				this.changeLevelAnimation();
				if( this.mode === 'arcade')
					this.user.points = 0;
			}
		} else {
			if(this.shakeActive !== true)
				this.gameOver();
		}
	},
	changeLevelAnimation : function(){
		var self = this;
		this.shakeActive = true;
		setTimeout(function(){
			self.canvas.style.backgroundColor = 'rgb(0,0,0)';
			self.interval = false;
			self.timers = [];
			self.timersPos =[];
			self.startLevel();
			self.shakeCounter = 0;
			self.shakeActive = false;
			
			document.getElementById('change-level-value').innerHTML = self.levelLabel();
			document.getElementById('change-level').className = 'level-animation';
			
			self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);

			PrefixedEvent(document.getElementById('change-level'), "AnimationEnd", function(){
				document.getElementById('change-level').className = 'show-level';
				document.getElementById('change-level-start').className = 'show-level-start';
				self.status ='pause';
			}, false);
		},2000);
	},
	setBonusActive : function(){
		
		this.bonus.activationTime = new Date().getTime();
		this.bonus.status = true;
		this.canvas.style.backgroundColor = '#7F1313';
	},
	setBonusInActive : function(){
		this.bonus = {};
		this.canvas.style.backgroundColor = '';

	},
	gameLoop : function(){
		var self = this;
		var i,
			found = false,
			minX = this.r,
			maxX = this.canvas.width-this.r,
			minY = 50+this.r,
			maxY = this.canvas.height-this.r-50;
		if(this.status !== 'changing-level'){

			var now = new Date().getTime();
			
			if(typeof this.bonus.activationTime !== 'undefined' && now - this.bonus.activationTime >= 3000){
				this.setBonusInActive();
			}
			
			this.countDownLoop();
			if(typeof this.getLevelData() !== 'undefined'){
				if(this.timers.length < this.getLevelData().timersMax){ // check actual number of timers
					var newX = Math.floor(Math.random()*(maxX-minX+1))+minX;
					var newY = Math.floor(Math.random()*(maxY-minY+1))+minY;
					var newTimerPos = {
							x : newX,
							y : newY
						};

					for(i=0;i<this.timersPos.length;i++){
						// check if new position is avaible
						if((newX >= this.timersPos[i].x-this.r &&  newX <= this.timersPos[i].x+this.r) || (newY >= this.timersPos[i].y-this.r &&  newY <= this.timersPos[i].y+this.r)){
							found = true;
						}
					}
					if(!found){
						var newTimer = new Timer(this.canvas,this.ctx,this.getSpeed(),newX,newY);
						this.timers.push(newTimer);
						this.timersPos.push(newTimerPos);
					}
				}	
			}
			
		} else {
			self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
		}
		
		if(this.shakeActive === true){
			this.shakeCounter++;
			var c = (6*this.shakeCounter);
			this.canvas.style.backgroundColor = 'rgb('+c+','+c+','+c+')';
		}
		
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.updateHUD();


		if(this.bonus.status === false){
			if(!this.bonus.draw()){
				this.bonus = {};
			}
		}

		var callbackTimer = function(){
			if(self.mode === 'survivor' && !self.timers[j].isClicked() && !self.timers[j].isAnimation()){
				self.user.life--;
			}
			self.removeTimer(j);
			self.updateHUD();
			if(self.user.life <= 0 && self.shakeActive !== true){
				self.gameOver();
			}
		};

		if(this.shakeCounter <= 10){
			for(var j in this.timers){
				this.timers[j].draw((this.bonus.status === true),this.actualFramerate,callbackTimer);
			}	
		}
	},
	getTimerTouched : function(event){
		var touches = event.changedTouches;

		if(this.status === 'play'){
			for (var i=0; i<touches.length; i++) {
				var x = touches[i].pageX - this.canvas.offsetLeft,
				y = touches[i].pageY - this.canvas.offsetTop;

				if(false){
					this.ctx.beginPath();
					this.ctx.arc(x,y,20,0,2*Math.PI);
					this.ctx.strokeStyle = 'red';
					this.ctx.fillStyle='red';
					this.ctx.fill();
				}

				for(i=0;i<this.timersPos.length;i++){
					// check if new position is avaible
					var overfl = 10;
					if((x >= this.timersPos[i].x-(this.r+overfl) &&  x <= this.timersPos[i].x+(this.r+overfl)) && (y >= this.timersPos[i].y-(this.r+overfl) &&  y <= this.timersPos[i].y+(this.r+overfl))){
						this.timers[i].changeColor('red');
						this.user.points += this.timers[i].getPoints();
						this.timers[i].setClicked();
					}
				}
				if(this.bonus.status === false){
					if((x >= this.bonus.cX-this.bonus.r &&  x <= this.bonus.cX+this.bonus.r) && (y >= this.bonus.cY-this.bonus.r &&  y <= this.bonus.cY+this.bonus.r)){
						this.setBonusActive();
					}
				}
			}
		}
	},
	getTimerClicked : function(event){
		var x = event.pageX - this.canvas.offsetLeft,
			y = event.pageY - this.canvas.offsetTop;
		
		if(false){
			this.ctx.beginPath();
			this.ctx.arc(x,y,20,0,2*Math.PI);
			this.ctx.strokeStyle = 'red';
			this.ctx.fillStyle='red';
			this.ctx.fill();
		}
		if(this.status === 'play'){
			for(i=0;i<this.timersPos.length;i++){
				// check if new position is avaible
				if((x >= this.timersPos[i].x-this.r &&  x <= this.timersPos[i].x+this.r) && (y >= this.timersPos[i].y-this.r &&  y <= this.timersPos[i].y+this.r)){
					this.timers[i].changeColor('red');
					this.user.points += this.timers[i].getPoints();
					this.timers[i].setClicked();
				}
			}
			if(this.bonus.status === false){
				if((x >= this.bonus.cX-this.bonus.r &&  x <= this.bonus.cX+this.bonus.r) && (y >= this.bonus.cY-this.bonus.r &&  y <= this.bonus.cY+this.bonus.r)){
					this.setBonusActive();
					
				}
			}
		}
	},
	removeTimer : function(index){
		this.timers.splice(index,1);
		this.timersPos.splice(index,1);
	},
	gameOver : function (){
		this.shakeActive = true;
		var self = this;
		setTimeout(function(){
			this.shakeActive = false;
			self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
			self.endGameContainer.className = '';
			self.gameContainer.className = 'hidden';
			self.hud.className = 'hidden';

			var supportsTouch = 'createTouch' in document;
			self.status = 'stop';
			self.interval = false;			

			if(self.user.cont.num > 0 && self.level > 0 && typeof self.getLevelData() !== 'undefined'){
				document.getElementById('endgame-container').innerHTML = '<center> <p id="continue-timer" class="num-timer" >30</p><br> <span class="try-left">'+self.user.cont.num+' try left </span><br><center><a class="arcade-mode" href="#" id="continue">Continue</a></center><center><a class="survivor-mode" href="#" id="surrender">No, I surrender</a>  </center></center>';

				var continueTimer = 30;
				var continueTimerEl = document.getElementById('continue-timer');

				var continueTimerTick = function (){
					setTimeout(function(){
						if(self.continueOn === true){
							continueTimer--;
							continueTimerEl.innerHTML = continueTimer;
							if(continueTimer > 0){
								continueTimerTick();
							} else {
								self.surrender();
							}
						}
					}, 1000);
				};
				self.continueOn = true;
				continueTimerTick();

				document.getElementById('continue').addEventListener((supportsTouch) ? 'touchstart' : 'click' ,function(){
					self.continueMeth();
				});
				document.getElementById('surrender').addEventListener((supportsTouch) ? 'touchstart' : 'click' ,function(){
					self.surrender();
				});
			} else {
				self.surrender();
			}
		},1000);
	},
	continueMeth : function(){
		this.continueOn = false;
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.level = this.user.cont.level;
		if(this.mode === 'survivor')
			this.user.points = 0;
		else 
			this.user.points = this.user.cont.points;
		this.user.life = this.user.cont.life;
		this.user.cont.num--;
		this.startLevel();

		this.endGameContainer.className = 'hidden';
		this.gameContainer.className = '';
		this.hud.className = '';

		this.changeLevelAnimation();
	},
	surrender : function(){
		this.continueOn = false;
		if(typeof this.getLevelData() === 'undefined'){
			alert('You WON!!!!');
		} else {
			alert('Game Over!!!!');
		}
	
		var record = getCookie(this.mode+'_record');
		var level = getCookie(this.mode+'_level_record');
		

		if(typeof this.getLevelData() === 'undefined' || record === null || level < this.getLevelData().level  || (level == this.getLevelData().level && record < this.user.points)){
			setCookie(this.mode+'_record',this.user.points,365);
			setCookie(this.mode+'_level_record',this.getLevelData().level,365);
			document.getElementById('endgame-container').innerHTML = '<center><p class="new-record">NEW RECORD!! </p><br> <span class="thank">Thank you '+this.user.name+' for playing </span><br> <span class="following">copy the following text and paste it into your favourite social network:</span><br><textarea class="text-fol" cols="50" rows="5">I played Timer Madness at '+window.location+' in '+this.mode.charAt(0).toUpperCase()+this.mode.substring(1)+' mode and I totalized '+this.user.points+' points at level '+this.levelLabel()+'.</textarea><br><a class="arcade-mode" href="#" id="re-start-game">Play again</a></center>'+"<center class='delete-rec' ><a href='#' id='delete-record'>Reset my record</a></center>";
		} else {
			document.getElementById('endgame-container').innerHTML = '<center><br><br><span class="thank">Thank you '+this.user.name+' for playing </span><br> <span class="following">copy the following text and paste it into your favourite social network:</span> <br><textarea class="text-fol" cols="50" rows="5">I played Timer Madness at '+window.location+' in '+this.mode.charAt(0).toUpperCase()+this.mode.substring(1)+' mode and I totalized '+this.user.points+' points at level '+this.levelLabel()+' </textarea><br><a class="arcade-mode" href="#" id="re-start-game">Play again</a></center>'+"<center class='delete-rec' ><a href='#' id='delete-record'>Reset my record</a></center>";;
		}

		
		var supportsTouch = 'createTouch' in document;
		var self = this;
		document.getElementById('re-start-game').addEventListener((supportsTouch) ? 'touchstart' : 'click' ,this.restartGame);
		document.getElementById('delete-record').addEventListener((supportsTouch) ? 'touchstart' : 'click' ,function(){
			setCookie(self.mode+'_record',self.user.points,-1);
			setCookie(self.mode+'_level_record',self.user.points,-1);
			self.restartGame();
		});
		
	},



	updateHUD : function(){
		
		var lives_pti = document.getElementById('lives_pti_needed');
		var lives_pti_label = document.getElementById('lives_pti_needed_label');
		var timer = document.getElementById('timer');
		var points = document.getElementById('points');
		var level = document.getElementById('level');
		var status = document.getElementById('status');

		
		var cdVal, cdLength;
		if(this.mode === 'survivor'){
			lives_pti_label.innerHTML ='Lives:';
			var content = '';
			for(var i=0;i<this.user.life;i++){
				content += '<span class="heart"></span>';
			}
			lives_pti.innerHTML = content;
		} else {
			lives_pti_label.innerHTML ='To go:';
			var needed = this.getLevelData().pointsNeeded;
			if(needed-this.user.points > 0){
				cdLength = 100*(needed-this.user.points)/needed;
				cdVal = (needed-this.user.points);
				if(cdLength > 50){
					lives_pti.className = 'redBar';
				} else if(cdLength > 30){
					lives_pti.className = 'yellowBar';
				} else{
					lives_pti.className = 'greenBar';
				}
			} else {
				cdLength = 0;
				cdVal = 'Ok';
				lives_pti.className = 'widthZero';
			}
			lives_pti.innerHTML = cdVal;
			lives_pti.style.width = cdLength + 'px';

			
		}
		// Timer
		if(this.countDownValue <= 0){
			cdLength = 100;
			cdVal = '';
			timer.className = 'widthZero';
		} else{
			cdLength = 100*this.countDownValue/this.getLevelData().countDown;
			cdVal = this.countDownValue;

			if(cdLength > 50){
			timer.className = 'greenBar';
			} else if(cdLength > 30){
				timer.className = 'yellowBar';
			} else{
				timer.className = 'redBar';
			}
		}
		timer.innerHTML = cdVal;
		timer.style.width = cdLength + 'px';
		// Points
		points.innerHTML = this.user.points;
		// level
		level.innerHTML =  this.levelLabel();
		//status
		if(this.status === 'play'){
			status.innerHTML = '<strong>X</strong> pause';
		} else if (this.status === 'pause'){
			status.innerHTML = '&#9654; play';
		}
	}
};
