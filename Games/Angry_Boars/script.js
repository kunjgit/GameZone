window.onload = function(){

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//-----------------------------------------------------------
// Utils
//-----------------------------------------------------------


function setVal(o , v){
	for(var k in v){
		o[k] = v[k];
	}
}

var M = Math,
	rd = Math.random,
	PI = M.PI;

//random number [0..n]
function rand(n){
	n++;
	return M.floor(n*M.random());
}

//Point class
function P(x, y){
    this.x = x || 0;
    this.y = y || 0;
};
P.prototype = {
	i: function(){
		this.x =0;
		this.y = 0;
	},
	l: function(){
		return M.sqrt(this.x * this.x + this.y * this.y);
	},
	n : function(d){
		var l = this.l();
		d = d || 1;
		this.x = (this.x / l) * d;
		this.y = (this.y / l) * d;
	},
	a: function(){
		return Math.atan2(this.y,this.x)
	},
	diff : function(p1,p2){
		this.x = p2.x-p1.x;
		this.y = p2.y-p1.y;
	},
	sum : function(p1,p2){
		this.x = p2.x+p1.x;
		this.y = p2.y+p1.y;
	}
};

//-----------------------------------------------------------
// Input
//-----------------------------------------------------------

//Set up key listener
function onkey(d ,e) {
	if (!e) e = window.e;
	var c = e.keyCode;
	if (e.charCode && c == 0)
		c = e.charCode;
	
	if(c==37) keys.l1 = d; //left
	if(c==38) keys.u1 = d; //up
	if(c==39) keys.r1 = d; //rigth
	if(c==40) keys.d1 = d; //down
	
	if(c==65 || c==81) keys.l2 = d; //a/q
	if(c==90 || c==87) keys.u2 = d; //z/w
	if(c==83) keys.d2 = d; //s
	if(c==68) keys.r2 = d; //d
	
	if(!d){
		if(c==27){ //Escape
			setState(INTRO);
		}
		if(c==32){ //Scape
			if(state==INTRO){
				introNext();
			}
		}
		
		if(c==82){ //R
			if(state==INTRO ||state==GAMEOVER){
				setState(GAME);
			}
		}
	}
};
document.onkeyup = function(e) { 
	onkey(0 , e); 
};
document.onkeydown = function(e) { 
	onkey(1 , e); 
};

//-----------------------------------------------------------
// Game Classes
//-----------------------------------------------------------


function Entity(t, w, h){
	this.pos = new P();
	this.center = new P();
	this.dir = new P();
	this.t = t;
	this.w = w;
	this.h = h;
	entities.push(this);
	this.setPos(0,0);
};
Entity.prototype = {
	move : function(v){
		if(v.x){
			this.pos.x += v.x;
			this.center.x = this.pos.x+this.w/2;
			if(v.x<-0.5){
				this.flip = true;
			}else if(v.x>0.5){
				this.flip = false;
			}
			//this.flip = v.x<0;
		}
		if(v.y){
			this.pos.y += v.y;
			this.center.y = this.pos.y+this.h/2;
		}
		this.lastVx = v.x;
		this.lastVy = v.y;
		
	} ,
	setPos : function(x,y){
		this.pos.x = x;
		this.pos.y = y;
		this.center.x = this.pos.x+this.w/2;
		this.center.y = this.pos.y+this.h/2;
	},
	collides: function(e2){
		return (M.abs(this.center.x-e2.center.x) < this.w*0.5 + e2.w*0.5
			&& M.abs(this.center.y-e2.center.y) < this.h*0.5 + e2.h*0.5 )
	},
	render: function(){
		var x = ~~this.pos.x,
			y = ~~this.pos.y,
			s = this.skin,
			f = this.flip,
			rx = this.w*0.5 ,
			ry = this.h*0.25 ,
			i = img;
		
		//Draw shadow
		if(!this.destroyed){
			ctx.save(); // save state
			ctx.beginPath();
			ctx.translate(-camera+x+this.w*0.5-rx , y+this.h-ry-2);
			ctx.scale(rx, ry);
			ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(0,0,0,0.3)";
			ctx.fill();
			ctx.restore(); // restore to original state
		}
		
		if(this.t != BUSH && !this.destroyed){
			//jumping
			var P = 24 , sin;
			if(isNaN(this.jumpCount)) this.jumpCount = rand(P);
			sin = M.sin(this.jumpCount*PI/P);
			y = ~~(y - M.abs(sin)*4 );
			this.jumpCount++;
			this.jumpCount = this.jumpCount%P;
		}
		
		//beer halo
		if(this.beer>0 || this.t == BEER || this.t==CLOVER || this.t==MUSHROOM || this.t==BEER2 ||this.t==BOOTS){
			ctx.save(); // save state
			ctx.beginPath();
			ctx.arc(-camera+x+this.w*0.5,
						y+this.h*0.5,
						this.h*0.8, 0, 2 * Math.PI, false);
			ctx.globalAlpha = 0.2+sin*0.2;
			ctx.fillStyle = "rgb(255,255,0)";
			ctx.fill();
			ctx.restore(); // restore to original state
		}
			
		
		
		if(this.t==PLAYER){
			if(attack.on){
				f = attack.direction == -1;
				s = this.skin2; 
			}
		}else if(this.t==CAT){
			if(this.flying){
				s = this.skin2; 
			}
		}else if(this.t==BUSH){
			if(this.destroyed){
				s = this.skin2;
			}
		}else if(this.t == CRATE && this.destroyed){
			if(!this.exploCount){
				this.exploCount = 30;
			}
			if(this.exploCount>1){
				if(this.exploCount>20){ 
					s = this.skin2;
				}else if(this.exploCount>10){
					s = this.skin3;
				}else{
					s = this.skin4;
				}
				this.exploCount--;
			}else{
				s = this.skin5;
			}
		}
		
		ctx.save();
		ctx.translate( -camera + x , y);
		if(this.t==PLAYER && this.grown){
			ctx.scale(2, 2);
		}
		ctx.translate( -s.dx , - s.dy);
		if(f){
			ctx.translate(s.w, 0);
			ctx.scale(-1, 1);
		}
		
		
		
		if(this.hurtCount>0){
			this.hurtCount--;
			i = canvasRed;
		}
		ctx.drawImage(i , s.x, s.y, s.w , s.h,
				0 , 0 , s.w , s.h);
		
		if(this.t==PLAYER){
			//draw clover 
			ctx.drawImage(img , 48+(4-player.luck)*16, 48, 16 , 16,
				-3 , 4 , 16 , 16);
		}else if(this.t==BOAR){
			//draw eyes
			ctx.fillStyle = "rgb(255,0,0)";
			var numDots = (~~this.rage);
			numDots *= numDots; // 0 1 2 4 8 16
			for(var i=0 ; i<numDots ; i++){
				ctx.fillRect(
				67 + 12*((M.random()+M.random())*0.5-0.5) ,
				20 + 8*((M.random()+M.random())*0.5-0.5)
				,2,1);
			}
		}
		ctx.restore();
		
		/*
		if(this.t==PLAYER){
			ctx.fillStyle = "rgba(255,0,255,0.5)";
			ctx.fillRect(x-camera , y , this.w , this.h); 
		}
		*/
	},
	hurt : function(){
		this.hurtCount = 20;
		
		if(this.t==PLAYER){
			player.luck --;
			if(player.luck == 0){
				setState(GAMEOVER);
			}
		}
	}
	
};
Entity.ySort = function(e1,e2){
	return (e1.pos.y+e1.h) - (e2.pos.y + e2.h);
};



//-----------------------------------------------------------
// Game
//-----------------------------------------------------------

var CAT = "c", PLAYER = "p", BOAR="b", ATTACK = "a", BEER = "Cat Beer", BUSH="bu",CRATE="cr",
	MUSHROOM = "Big Mushroom" , BOOTS="A Hail of Cats", CLOVER="Lucky Clover",BEER2="Free Beer",
	INTRO = "intro" , GAMEOVER="gameOver" , PAUSED="paused" , GAME="game",
	state = null,
	introStep = 0,
	introCpt = 0,
	canvas = document.getElementById("c"),
	img = document.getElementById("img"),
	ctx = canvas.getContext("2d"),
	canvasBG = document.createElement("canvas"),
	canvasRed = document.createElement("canvas"),
	ctxRed = canvasRed.getContext("2d"),
	ctxBG = canvasBG.getContext("2d"),
	WIDTH = canvas.width = 800,
	HEIGHT = canvas.height = 600,
	entities = [],
	//player
	player = null,
	attack = null,
	//keys
	keys = {l:0 , u:0 , r:0 , d:0},
	cats = [],
	boars = [],
	pt = new P(),
	pt2 = new P(),
	pt3 = new P(),
	camera = 0,
	beer = null,
	powerUps = [],
	bushCpt = 0, catCpt = 0 , boarCpt = 0, crateCpt = 0,
	crates = null,
	img, startTime,
	currentPowerUpCount, maxPowerUpCount=100,
	maxGrowCount = 200 , beerMaxCount = 200,
	currentPowerUp;
	
(function prepareCanvas(){
	ctx["imageSmoothingEnabled"] = false;
	ctx["mozImageSmoothingEnabled"]  = false;
	ctx["webkitImageSmoothingEnabled"] = false;
	
	//prepare canvases
	canvasRed.width = img.width;
	canvasRed.height = img.height;
	ctxRed.drawImage(img,0,0);
	ctxRed.fillStyle = "#f00";
	ctxRed.globalAlpha = 0.5;
	ctxRed.globalCompositeOperation = "source-atop";
	ctxRed.fillRect(0,0,img.width,img.height);

	//background
	canvasBG.width = 2*WIDTH;
	canvasBG.height = HEIGHT;
	var sliceW = 50 , nFlower = 50 , nSlice=WIDTH/sliceW;
	var i,j,x,y;
	//ctxBG.fillRect(0,0,WIDTH,HEIGHT);
	
	//Draw texture
	var nCol = Math.ceil(WIDTH/8),
		nRow = Math.ceil(HEIGHT/8);
	for(i=0 ; i<nCol ; i++){
		for(j=0 ; j<nRow ; j++){
			ctxBG.drawImage(img , 72+rand(40-8) , 64+rand(32-8) , 8 , 8,
				i*8 , j*8 , 8 ,8);
		}
	}
	//Draw flowers
	for(i=0 ; i<nSlice ; i++){
		for(j=0 ; j<nFlower ; j++){
			ctxBG.drawImage(img , 96+8*rand(1) , 0+8*rand(5) , 8 , 8,
				~~(i*sliceW+M.random()*(sliceW-8)) , ~~(M.random()*(HEIGHT-3)) , 8 ,8);
		}
	}
	
	//copy on second part
	ctxBG.drawImage(canvasBG , WIDTH , 0);
	//document.body.appendChild(canvasBG);
	
	/*
	canvas.width *= 2;
	canvas.height *= 2;
	*/
	//needed for intro
	player = new Entity(PLAYER , 18 , 22 );
	player.skin = {x:24,y:0,w:32,h:47,dx:8,dy:24};
	player.skin2 = {x:57,y:0,w:41,h:47,dx:8,dy:24};
	player.sw = player.w;
	player.sh = player.h;
})();

	
	
function init(){
	currentPowerUpCount = 0;
	currentPowerUp = null;
	startTime = Date.now();
	camera = 0;
	entities = [player]; //player is not created each time
	bushCpt = 0;
	catCpt = 0;
	boarCpt = 0;
	
	player.setPos( WIDTH/2-player.w/2,
				   HEIGHT/2-player.h/2 );
	player.speed = 4;
	player.luck = 4;
	player.hurtCount = 0;
	player.beer = 0;
	player.catAttached = 0;
	player.growCount = 0;
	player.grow = false;
	player.w = player.sw;
	player.h = player.sh;
	
	beer = new Entity(BEER ,14 , 15); 
	beer.skin = {x:96,y:96,w:14,h:15,dx:0,dy:0};
	beer.cat = null;
	
	attack = {
		on : false,
		val: 0,
		max: 20,
		min: 18,
		recover: 1
	};
	attack.val = attack.max;
	
	cats = [];
	while(cats.length < 10){
		addCat();
	}
	
	boars = [];
	
	while(boars.length<12){ //12
		addBoar();
	}
	
	
	bushes = [];
	while(bushes.length<4){
		addBush();
	}
	
	crates = [];
	addCrate();
	
	powerUps = [];
}

function createPowerUp(pos){
	var t = BEER2 , r=rd();
	
	if(r<0.1){
		t = CLOVER;
	}else if(r<0.2){
		t = MUSHROOM;
	}else if(r<0.3){
		t = BOOTS;
	}
	
	var e;
	//recycle powerups
	for(var i in powerUps){
		var p = powerUps[i];
		if(p.t==t && !p.placed){
			e = p;
		}
	}
	if(!e){
		var s = beer.skin,
			w = beer.w,
			h = beer.h,
			r = rd();
	
		if(t == CLOVER){
			w = 16;
			h= 15;
			s={x:48,y:49,w:16,h:15,dx:0,dy:0};
		}else if(t == MUSHROOM){
			w = 19;
			h= 17;
			s={x:97,y:132,w:19,h:17,dx:0,dy:0};
		}else if(t == BOOTS){
			w = 19;
			h= 18;
			s={x:97,y:151,w:19,h:18,dx:0,dy:0};
		}
		e = new Entity(t ,w , h); 
		e.skin = s;
		powerUps.push(e);
	}
	e.setPos(pos.x+5 , pos.y);
	e.placed = true;
}


function addBoar(){
	//var boar = new Entity(BOAR, 32, 21);
	//boar.skin = {x:0,y:68,w:47,h:33,dx:4,dy:11};
	var boar = new Entity(BOAR, 64, 42);
	boar.skin = {x:0,y:102,w:97,h:67,dx:8,dy:22};
	
	
	boar.minSpeed = player.speed * (0.6 + M.random()*0.2); //base speed
	boar.maxSpeed = (player.speed*(1.2+rd()*0.1));
	boar.rage = 1*rd();
	boar.rageMax = 4;
	boar.rageIncr = 0.15/50 * (1+ 0.6*M.random());
	boar.minX = -20-rd()*60;
	
	boar.setPos(//camera+1.2*WIDTH ,
			boar.minX + camera, 
			//(boars.length/numBoars)*HEIGHT);
			M.random()*HEIGHT);
	boars.push(boar);
}

function addCat(){
	var cat = new Entity(CAT, 19, 16);
	cat.skin = {x:0,y:0,w:21,h:32,dx:1,dy:16};
	cat.skin2 = {x:0,y:48,w:41,h:18,dx:12,dy:2};
	//cat.setPos( (rand(1)==0) ? -90 : WIDTH+74 , 
	//cat.setPos( -90 , 
	//			rand(HEIGHT-16) );
	setCatRandPos(cat);
	cats.push(cat);
	
	cat.speedX = 1+M.random()*0.2;
	cat.speedY = 1+M.random()*0.2;
	cat.repulsion = 0.5 + M.random()*0.5;
	cat.attraction = 1 + M.random()*0.5;
	
	cat.flySpeed = 8;
	cat.flying = false;
	cat.flyingDist = 0;
}
function setCatRandPos(cat){
	if(!beer.cat && rd()>0.5){
		//top / bottom
		cat.setPos( camera + (0.8 + 0.4*M.random())*WIDTH , M.random()>0.5 ? -50 : HEIGHT+20);
	}else{
		//right (always for beer)
		cat.setPos( camera + WIDTH+20+0.5*WIDTH*M.random() , M.random()*HEIGHT );
	}
	cat.flying = false;
	cat.attached = false;
	if(!beer.cat){
		beer.cat = cat;
	}
}

function addBush(){
	var bush = new Entity(BUSH, 35, 20);
	bush.skin = {x:0,y:67,w:39,h:35,dx:2,dy:15};
	bush.skin2 = {x:2,y:35,w:22,h:10,dx:-6,dy:-5};
	
	bushes.push(bush);
	setBushRandPos(bush);
}

function setBushRandPos(bush){
	//incresed density in the middle
	var y = (rd()+rd())/2; 
	//mirror that for incr density in the sides
	if(y<0.5){
		y = 0.5-y;
	}else{
		y = 1.5-y;
	}
	bush.destroyed = false;
	bush.setPos(
		WIDTH*(1+rd()) + camera,
		y*(HEIGHT-bush.h));
}

function addCrate(){
/*
	var crate = new Entity(CRATE, 26, 18);
	crate.skin = {x:41,y:67,w:26,h:25,dx:0,dy:7};
	crate.skin2 = {x:41,y:94,w:26,h:7,dx:0,dy:-11};
*/
	var crate = new Entity(CRATE, 33, 21);
	crate.skin = {x:0,y:171,w:41,h:36,dx:5,dy:15};
	crate.skin2 = {x:42,y:171,w:41,h:36,dx:5,dy:15};
	crate.skin3 = {x:85,y:174,w:31,h:30,dx:0,dy:9};
	crate.skin4 = {x:43,y:72,w:24,h:31,dx:-4,dy:10};
	crate.skin5 = {x:97,y:122,w:18,h:5,dx:-7,dy:-16};
	//crate.skin = crate.skin3;
	//crate.skin = {x:42,y:65,w:30,h:38,dx:3,dy:9};
	//crate.skin2 = {x:99,y:119,w:16,h:9,dx:1,dy:-14};
	
	crates.push(crate);
	setCrateRandPos(crate);
}
function setCrateRandPos(crate){
	crate.destroyed = false;
	crate.exploCount = 0;
	crate.setPos(
		WIDTH*(1+3*rd()) + camera,
		(0.2+rd()*0.6)*(HEIGHT-crate.h) );
}
function destroyCrate(crate){
	if(!crate.destroyed){
		crate.destroyed = true;
		createPowerUp(crate.pos);
	}
}


function tic(){

	if(state==INTRO){
		ticIntro();
	}
	if(state!=GAME){
		window.requestAnimationFrame(tic);
		return;
	}
	
	var i,j,cat,cat2,dist,dist2,boar,boar2,crate,bush,allCatsForward,pow;	
	
	
	
	//bushes
	var collideBush = 0;
	for(i in bushes){
		bush = bushes[i];
		if(bush.pos.x-camera<-bush.w){
			setBushRandPos(bush);
		}else{
			//collisions
			if(!bush.destroyed && player.collides(bush)){
				collideBush = bush;
			}
		}
	}
	for(i in crates){
		crate = crates[i];
		if(crate.pos.x-camera<-crate.w){
			setCrateRandPos(crate);
		}
	}
	if(cats.length < 16) {
		catCpt++;
		if(catCpt>100){
			addCat();
			catCpt = 0;
		} 
	}
	
	/*
	if(boars.length < 12) {
		boarCpt++;
		if(boarCpt>100){
			addBoar();
			boarCpt = 0;
		} 
	}
	*/
	
	if(bushes.length < 100){
		bushCpt++;
		if(bushCpt>50){
			addBush();
			bushCpt = 0;
		} 
	}
	
	if(crates.length < 3){
		crateCpt++;
		if(crateCpt>50){
			addCrate();
			crateCpt = 0;
		} 
	}
	
	//move player
	pt.i();
	if(keys.l2){
		pt.x = -1;
	}else if(keys.r2){
		pt.x = 1;
	}
	if(keys.u2){
		pt.y = -1;
	}else if(keys.d2){
		pt.y = 1;
	}
	
	//player boost
	if(player.growCount>0){
		player.growCount--;
		if(!player.grown){
			player.grown = true;
			//grow in place
			player.setPos(player.pos.x/*-player.w*0.5*/ , player.pos.y-player.h);
			player.w = player.sw*2;
			player.h = player.sh*2;
		}
	}else{
		if(player.grown){
			player.grown = false;
			player.w = player.sw;
			player.h = player.sh;
			//shrink in place
			player.setPos(player.pos.x/*+player.w*0.5*/ , player.pos.y+player.h);
		}
	}
	//cats
	var speed = player.speed;
	if(player.catAttached>0 && !player.grown){
		speed -= (player.catAttached)*0.5;
		if(speed<0.2) speed = 0.2;
	}
	if(player.beer>0){
		speed *= 1.5;
		player.beer -= 1;
	}
	if(player.grown){
		speed *= 1.4;
		
	}	
	if(collideBush){
		if(!player.grown){
			speed *= 0.5;
		}else{
			collideBush.destroyed = true;
		}
	}
	
	pt.x *= speed;
	pt.y *= speed;
	if(pt.y+player.pos.y < 0){
		pt.y = -player.pos.y
	}else if(pt.y+player.pos.y > HEIGHT-player.w){
		pt.y = HEIGHT-player.w-player.pos.y;
	}
	player.move(pt);
	
	for(i in crates){
		crate = crates[i];
		if(!crate.destroyed && player.collides(crate)){
			if(!player.grown){
				if(player.hurtCount==0){
					player.hurt();
				}
				crate.destroyed = true;
			}else{
				destroyCrate(crate);
			}
		}
	}
	for(i in powerUps){
		pow = powerUps[i];
		if(pow.placed){
			if(pow.pos.x+pow.w<camera){
				pow.placed = false;
			}else if(player.collides(pow)){
				pow.placed = false;
				pow.setPos(-100,-100);
				
				currentPowerUp = pow;
				maxPowerUpCount = 200;
				if(pow.t==BEER2){
					player.beer = beerMaxCount;
					maxPowerUpCount = beerMaxCount;
				}else if(pow.t==MUSHROOM){
					player.growCount = maxGrowCount;
					maxPowerUpCount = maxGrowCount;
				}else if(pow.t==BOOTS){
					allCatsForward = true;
				}else if(pow.t==CLOVER){
					if(player.luck<4){
						player.luck++;
					}
				}
				currentPowerUpCount = maxPowerUpCount;
				
				//playSound();
			}
		}
	}
	
	
	
	
	for(i in cats){
		cat=cats[i];
		if(!cat.flying && !cat.attached && player.collides(cat)){
			//collide with cat -> push it
			//cat.move(pt);
			cat.attached = true;
			player.catAttached++;
			
			if(beer.cat==cat){
				beer.cat = null;
				player.beer = beerMaxCount;
				//playSound();
			}
		}
	}
	
	//player attack
	var keyDown = false;
	if(keys.l1 || keys.r1){
		keyDown = true;
		if(!attack.on && attack.val>attack.min){ 
			attack.on = true;
			attack.direction = keys.l1 ? -1 : 1;
		}
	}else{
		attack.on = false;
	}
	if(attack.on){
		if(attack.val>0){
			attack.val--;
		}else{
			attack.on = false;
		}
	}else{
		//cooldown
		if(!keyDown){
			attack.val = attack.max;
		}
		/*
		if(attack.val<attack.max){
			attack.val += attack.recover;
		}
		*/
	}
	
	//move cats
	for(i in cats){
		cat=cats[i];
		
		//Player distance
		pt.diff(cat.center , player.center);
		dist = pt.l();
		
		
		if(attack.on || allCatsForward){
			var shoot = false;
			if(allCatsForward){
				shoot = true;
				if(cat.attached){
					cat.attached = false;
					player.catAttached--;
				}
				attack.direction = -1;
			}else if(cat.attached){
				/*
				if(cat.center.x<player.center.x && attack.direction==-1){
					shoot = true;
				}else if(cat.center.x>player.center.x && attack.direction==1){
					shoot = true;
				}
				*/
				shoot = true;
				if(shoot){
					cat.attached = false;
					player.catAttached--;
				}
			}else if(cat.pos.y<player.pos.y+player.h
					&& cat.pos.y+cat.h>player.pos.y){
				//shoot passing cat
				if(attack.direction == -1
					&& cat.pos.x+cat.w>player.pos.x-20 && cat.pos.x+cat.w<player.center.x){
					shoot = true;
				}else if(attack.direction == 1
					&& cat.pos.x<player.pos.x+player.w+20&& cat.pos.x>player.center.x){
					shoot = true;
				}
			}
			if(shoot){
				pt2.n();
				cat.dir.x = attack.direction;
				cat.dir.y = 0;
				if(!cat.flying){
					cat.flying = true;
					//playSound(CAT);
					playSound();
				}
			}
		}
		
		
		if(cat.pos.x < camera - 100  || cat.pos.x > camera + WIDTH*2 ){
			//too far away -> place elsewhere
			setCatRandPos(cat);
		}
		
		if(cat.attached){
			pt.x = player.lastVx;
			pt.y = player.lastVy;
			cat.move(pt);
		}else if(!cat.flying){
			
			//Player attraction
			pt.n(cat.attraction);
			
			//Other cats repulsion
			pt3.i();
			for(j in cats){
				if(i!=j){
					cat2 = cats[j];
					if(!cat2.flying){
						pt2.diff(cat2.center,cat.center);
						dist2 = pt2.l();
						pt2.n();
						if(dist2<300){
							dist2 = ((300-dist2)/dist2);
							dist2 *= dist2;
							pt3.x += pt2.x*dist2;
							pt3.y += pt2.y*dist2;
						}
					}
				}
			}
			if(pt3.x!=0 && pt3.y!=0){
				pt3.n(cat.repulsion);
				pt.x += pt3.x;
				pt.y += pt3.y;
			}
			
			var speedX = cat.speedX;
			var speedY = cat.speedY;
			/*
			if(dist>200){
				if(dist>400){
					speedX = player.speed;
					speedY = player.speed;
				}else{
					dist = (dist-200)/(400-200);
					speedX = player.speed*dist+(1-dist)*speedX;
					speedY = player.speed*dist+(1-dist)*speedY;
				}
			}
			*/
			pt.x *= speedX;
			pt.y *= speedY;
			//move
			cat.move(pt);
			
			//Collsions
			pt.x = 0;
			pt.y*=-1;
			pt.n(2);
			if(cat.collides(player)){
				cat.move(pt);
			}
			for(j in boars){
				boar=boars[j];
				if(cat.collides(boar)){
					cat.move(pt);
				}
			}
			
		}else{
			//Flying cat
			pt.x = cat.dir.x*cat.flySpeed;
			pt.y = cat.dir.y*cat.flySpeed;
			cat.move(pt);
			
			//collide with other cats
			for(j in cats){
				cat2 = cats[j];
				if(cat!=cat2 && !cat2.flying){
					if(cat.collides(cat2)){
						cat2.flying = true;
						cat2.dir.x = cat.dir.x;
						cat2.dir.y = -cat.lastVy*10;
					}
				}
			}
			//push boars
			for(j in boars){
				boar=boars[j];
				if(cat.collides(boar)){
					boar.move(pt);
					/*
					if(!boar.hurtCount){
						playSound(BOAR);
					}
					*/
					boar.rage = 0;
					boar.hurt();
				}
			}
			//cut bushes
			for(j in bushes){
				bush=bushes[j];
				if(!bush.destroyed){
					if(cat.collides(bush)){
						bush.destroyed = true;
					}
				}
			}
			//Destroy crates
			for(j in crates){
				crate=crates[j];
				if(cat.collides(crate)){
					destroyCrate(crate);
				}
			}
			if(cat.pos.x>1.2*Math.WIDTH+camera){
				setCatRandPos(cat);
			}
			/*
			cat.flyingDist+=2;
			if(cat.flyingDist > 200){
				cat.flyingDist = 0;
				cat.flying = false;
			}
			*/
		}
	}
	
	//move boars
	for(i in boars){
		boar=boars[i];
		
		
		if(boar.rage<boar.rageMax){
			boar.rage += boar.rageIncr;
		}
		speed = boar.rage/boar.rageMax;
		speed = (1-speed)*boar.minSpeed + speed*boar.maxSpeed;
		
		/*
		straight move
		pt.x = speed;
		pt.y = 0;
		boar.move(pt);
		*/
		
		
		//Player distance
		pt.diff(boar.center , player.center);
		dist = pt.l();
		pt.n();
		//boar.move(pt);
		
		//Other boars repulsion
		pt3.i();
		for(j in boars){
			if(i!=j){
				boar2 = boars[j];
				pt2.diff(boar2.center,boar.center);
				dist2 = pt2.l();
				pt2.n();
				if(dist2<300){
					dist2 = ((300-dist2)/300);
					//dist2 *= dist2;
					pt3.x += pt2.x*dist2;
					pt3.y += pt2.y*dist2;
				}
			}
		}
		if(pt3.y != 0){
			pt3.n(0.5);
			pt.sum(pt,pt3);
		}
		pt.n(speed);
		//if(i==0) console.log(pt3.x , pt3.y);
		boar.move(pt);
		
		
		//pt.x *= 3;
		//pt.y *= 3;
		pt2.x = 0;
		pt2.y = pt2.y;
		for(j in cats){
			cat = cats[j];
			if(!cat2.flying){
				if(cat.collides(boar)){
					cat.move(pt2);
				}
			}
		}
		
		pt.x *= 3;
		pt.y *= 3;
		if(boar.collides(player)){
			boar.rage = 0;
			if(!player.grown){
				player.move(pt);
				player.hurt();
			}
		}
		//cut bushes
		for(j in bushes){
			bush=bushes[j];
			if(!bush.destroyed){
				if(boar.collides(bush)){
					bush.destroyed = true;
				}
			}
		}
		//Destroy crates
		for(j in crates){
			crate=crates[j];
			if(boar.collides(crate)){
				destroyCrate(crate);
			}
		}
		
		if(boar.pos.x<camera+boar.minX){
			boar.setPos(camera+boar.minX , boar.pos.y);
		}
	}
	
	//beer
	if(beer.cat){
		beer.setPos(beer.cat.center.x ,beer.cat.center.y);
	}else{
		beer.setPos(-100,-100);
	}
	
	
	//update camera
	camera = M.max(camera , ~~(player.pos.x - WIDTH/2));
	//camera += player.speed * 0.9;
	if(camera<0) camera = 0;
	
	//ctx.fillStyle = "#8f6";
	//ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.drawImage(canvasBG , -camera%WIDTH , 0); 
	
	//render
	entities = entities.sort(Entity.ySort);
	for(i in entities){
		entities[i].render();
	}
	
	
	//Draw Powerup
	if(currentPowerUp || player.beer > 0){
		ctx.save();
		var p , a;
		if(currentPowerUp){
			currentPowerUpCount--;
			p = currentPowerUp;
			a = currentPowerUpCount/maxPowerUpCount;
			if(currentPowerUpCount==0){
				currentPowerUp = null;
			}
		}else{
			a = player.beer/beerMaxCount;
			p = beer;
		}
		
		if(a<0.1){
			a = a*10;
		}else{
			a = 1;
		}
		var s = p.skin;
		ctx.translate(4,4);
		ctx.globalAlpha = a;
		ctx.scale(2,2);
		ctx.drawImage(img , s.x, s.y, s.w , s.h,
				0 , 0 , s.w , s.h);
		
		ctx.restore();
		
		ctx.save();
		ctx.globalAlpha = a;
		ctx.strokeStyle = "black";
		ctx.fillStyle = "white";
		ctx.lineWidth = 4;
		ctx.font = "bold 24px Georgia";
		ctx.textBaseline = "top";
		ctx.strokeText(p.t, 2*s.w+8, 4);
		ctx.fillText(p.t, 2*s.w+8, 4);
		
		
		ctx.restore();
	}
	
	//Draw luck
	ctx.save();
	ctx.translate(WIDTH-40 , 4);
	ctx.scale(2,2);
	if(player.hurtCount>0){
		i = canvasRed;
	}else{
		i = img;
	}
			
	ctx.drawImage(i , 48+(4-player.luck)*16, 48, 16 , 16,
				0 , 0 , 16 , 16);
	
	ctx.restore();
	
	
	/*
	//Night fx
	ctx.fillStyle = "rgba(0,0,30,0.3)";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	*/
	
	/*
	//with dbl size
	ctx.save(); // save state
    ctx.scale(2, 2);
    ctx.smoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled  = false;
	ctx.drawImage(canvas,0,0);
	ctx.restore();
	*/
	
	//loop
	window.requestAnimationFrame(tic);
};

function setState(s){
	state = s;
	var divs = document.querySelectorAll("div");
	for(var i=0 ; i<divs.length ; i++){
		divs[i].style.display = "none";
	}
	if(state!=GAME){
		document.getElementById(state).style.display = "block";
		if(state==INTRO){
			introCpt = 0;
			introStep = 0;
		}else if(state==GAMEOVER){
			var t = document.getElementById("meters");
			t.innerHTML = ""+Math.round(100*(camera/WIDTH));
			t = document.getElementById("time");
			t.innerHTML = ""+Math.round((Date.now()-startTime)/1000);
		}
	}else{
		//init game
		init();
	}
}
function ticIntro(){
	var d = 300 , f=20 , alpha , x ,y;

	ctx.fillStyle = "#222";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	
	//draw gnome
	if(introStep>=2){
		ctx.save(); // save state
		
		var s = player.skin;
		x = 0;
		y = HEIGHT-s.h*8;
		alpha = 1;
		if(introStep==2 && introCpt/d<0.2){
			alpha = (introCpt/d)/0.2;
			x = (-0.5*s.w*(1-alpha))*8;
			ctx.globalAlpha = alpha;
		}
		
		ctx.translate(x,y);
		ctx.scale(8, 8);
		
		
		ctx.drawImage(img , s.x, s.y, s.w , s.h,
					0 , 0 , s.w , s.h);
		//ctx.drawImage(img , 32, 0, 15 , 29,
		//			0 , 0 , 15 , 29);
		
		ctx.restore();
		
		if(introStep>=3 && introStep<=7){
			if(introCpt<d/2){
				alpha = (~~(introCpt/10))%2;
			}else{
				alpha = 0;
			}
			if(alpha!=0){
				ctx.fillStyle = "#fff";
				ctx.fillRect(x+15*8,y+20*8,8*4,8*3); 
				ctx.fillStyle = "#000";
				ctx.fillRect(x+15*8,y+21*8,8*4,8); 
			}
		}
	}
	
	alpha = 1;
	if(introCpt<f){
		alpha = introCpt/f;
	}else if(introCpt > d-f){
		alpha = (d-introCpt)/f;
	}
	var spans = document.querySelectorAll("#intro span");
	for(var i=0 ; i<spans.length ; i++){
		if(i==introStep){
			spans[i].style.opacity = alpha;
		}else{
			spans[i].style.opacity = 0;
		}
	}
	
	if(introStep<spans.length-1){
		introCpt++;
		if(introCpt>=d){
			introNext();
		}
	}else{
		if(introCpt<d/2){
			introCpt++;
		}
	}
}


function introNext(key){
	introStep++;
	if(introStep<=7){
		introCpt = 0;
	}else{
		setState(GAME);
	}
}

function playSound(t){
	/*
	var s;
	if(t==CAT){
		s = "cat.mp3";
	}else{
		//if(t==BOAR){
		//	s = "boar.mp3";
		//}else{
			s = "beer.mp3";
		//}
	}
	var a = new Audio(s);
	a.volume = 0.5;
	a.play();
	*/
	var a = new Audio("cat.mp3");
	a.volume = 0.5;
	a.play();
	
	
}	



setState(INTRO);
tic();


};