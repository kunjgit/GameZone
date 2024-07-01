function Level(controls, soundManager)
{
	this.bricks=new Array();
	this.bricksLeft=0;
	this.balls=new Array();
	this.ballsInPlay=0;
	this.floaters=new Array();
	this.padRadius=.8;
	this.padThickness=.08;
	this.lossDistanceSq = 1;
	this.controls = controls;
	this.soundManager = soundManager;
	this.collisionHandler = new CollisionHandler (this);
	this.canCheat=false;
	this.initialize();
}

Level.prototype = {

	/**
	 * Reset the member variables to their default values 
	 * at the beginning of the game : two pads, default width
	 * (not to be called between lives)
	 */
	initialize : function() {
		this.padCount=2;
		this.padAngle=[0, 3.1416];
		this.padSpeed=0.05;
		this.padWidth=.16;
		this.floaters.length=0;
		this.time=0;
		this.environmentItem=0;
		this.environmentItemEnd=0;
		this.score=0;
		this.lives=3;
		this.cameraRoll=0;
		this.ballMinSpeed=.02;
		this.lastItem=0;
	},

	createContents : function(index) {
		this.floaters.length=0;
		this.bricks.length=0; // clear the array
		switch (index) {
			case 1 :
				this.createLevel1();
				break;
			case 2 :
				this.createLevel2();
				break;
			case 3 :
				this.createLevel3();
				break;
			case 4 :
				this.createLevel4();
				break;
			case 5 :
				this.createLevel5();
				break;
			case 6 :
				this.createLevel6();
				break;
			case 7 :
				this.createLevel7();
				break;
			case 8 :
				this.createLevel8();
				break;
			case 9 :
				this.createLevel9();
				break;
			case 10 :
				this.createLevel10();
				break;
			case 11 :
				this.createLevel11();
				break;
			case 12 :
				this.createLevel12();
				break;
			case 13 :
				this.createLevel13();
				break;
			default :
				this.createLevel0();
				break;
		}
		this.bricksLeft =this.bricks.length;
		this.level=index;
	},
	
	/** 
	 * Creates and places the first ball on the pad
	 * Used at the beginning of each level, and to respawn after losing a life
	 */
	giveInitialBall : function(resetPads) {
		this.padCount=2;
		if (this.padAngle.length==1) {
			this.padAngle.push(Math.PI);
		}
		if (resetPads ||!this.padAngle.length) {
			this.padAngle=[0, 3.1416];
		}
		this.padAngle.length=2;
		this.padSpeed=0.05;
		this.padWidth=.16;
		this.ballsInPlay = 1;
		this.balls[0] = new Ball(0);
		this.balls.length = 1;
		this.cameraRoll = 0;
		this.environmentItem = 0;
		this.environmentItemEnd = 0;
	},

	won : function() {
		return !this.bricksLeft;
	},
	
	lost : function() {
		return !this.ballsInPlay;
	},
	
	animateItems : function(useControls) {
	
		// pad motion
		if (useControls && this.padCount) {
			this.padAngle[0] += this.controls.getAngularDirection() * this.padSpeed;
			if (this.environmentItem==16) {
				this.cameraRoll += this.controls.getAngularDirection() * this.padSpeed;
				this.cameraRoll += (this.cameraRoll > Math.PI ? -2*Math.PI : (this.cameraRoll < -Math.PI ? 2*Math.PI : 0));
			}
			var sector = 2*Math.PI/this.padCount;
			for (var index=1; index<this.padCount; ++index) {
				if (Math.abs(this.padAngle[index]-sector)<.01) {
					this.padAngle[index] = sector;
				} else {
					this.padAngle[index]+=(this.padAngle[index]>sector?-.01:.01);
				}
			}
		}
		if (!this.ballsInPlay) {	// restore camera roll to 0 between balls
			var delta = (this.cameraRoll>0?-.05:.05);
			if (Math.abs(delta)>Math.abs(this.cameraRoll)) {
				delta=-this.cameraRoll;
			}
			this.cameraRoll+=delta;
		}
		
		// F9 to cheat
		if (this.controls.lastKeyDown==120 && this.canCheat) {
			this.bricksLeft=0;
		}
		// ball motion
		for (var index=0; index<this.ballsInPlay && useControls; ++index) {
			// launch balls if fire pressed
			if (this.balls[index].stuckOnPad>-1 && this.controls.controlFire) {
				this.balls[index].heading = this.padAngle[this.balls[index].stuckOnPad] + Math.PI + this.balls[index].offsetOnPad/200;
				this.balls[index].stuckOnPad = -1;
			}
			if (this.balls[index].stuckOnPad>-1 && !this.controls.controlFire) { // balls glued to pad move along with it
				var padAngle = this.padAngle[this.balls[index].stuckOnPad];
				this.balls[index].posX = Math.cos(padAngle)*(this.padRadius-this.balls[index].radius)-Math.sin(padAngle)*this.balls[index].offsetOnPad;
				this.balls[index].posY = Math.sin(padAngle)*(this.padRadius-this.balls[index].radius)+Math.cos(padAngle)*this.balls[index].offsetOnPad;
			} else {
				var sx = this.balls[index].speed*Math.cos(this.balls[index].heading);
				var sy = this.balls[index].speed*Math.sin(this.balls[index].heading);
				
				if (this.environmentItem==18 || this.environmentItem==19) { // magnetic(18) or gravity(19) modifier
					var d2 = this.balls[index].posX*this.balls[index].posX+this.balls[index].posY*this.balls[index].posY;
					sx+=this.balls[index].posX*(this.environmentItem==18?-.001/(d2+.01):.0002/(d2+.01));
					sy+=this.balls[index].posY*(this.environmentItem==18?-.001/(d2+.01):.0002/(d2+.01));
					this.balls[index].heading = Math.atan2(sy, sx);
					this.balls[index].speed = Math.sqrt(sx*sx+sy*sy);
				} else {	// accelerate the ball to minimal speed, to avoid having it stay almost motionless upon exiting magnetic or gravity
					this.balls[index].speed+= (this.balls[index].speed<this.ballMinSpeed?.0002:0);
				}
				this.balls[index].posX += sx;
				this.balls[index].posY += sy;
			}
			
			
			
			var distanceSq = this.balls[index].posX*this.balls[index].posX+this.balls[index].posY*this.balls[index].posY;
			if (distanceSq > this.lossDistanceSq) { // ball beyond pad range : lost
				--this.ballsInPlay;
				// reorder balls
				this.balls[index]=this.balls[this.ballsInPlay];
				--this.balls.length;
				--index;
			}
		}
		
		// brick motion (levels with animated bricks)
		for (var index=0; index<this.bricks.length; ++index) {
			this.bricks[index].hitEcho=false; // triggered while "steel bricks" item is active
			if (this.bricks[index].path) {
				var newPos = this.bricks[index].path.positionAt(this.time+this.bricks[index].relativeTime);
				this.bricks[index].posX = newPos.x;
				this.bricks[index].posY = newPos.y;
			}
			if (this.level==7) {
				this.bricks[index].radius=.08+.02*Math.cos(.1*this.time+this.bricks[index].relativeTime);
			}
			if (this.level==12 && this.ballsInPlay) {
				var dx = this.bricks[index].posX-this.balls[0].posX;
				var dy = this.bricks[index].posY-this.balls[0].posY;
				this.bricks[index].radius=Math.min(.03+.1*(dx*dx+dy*dy), .1);
			}
		}
		
		// floater motion
		for (var index=0; index<this.floaters.length; ++index) {
			if (this.floaters[index].move(this.time) > this.lossDistanceSq || this.floaters[index].hit) { // lost or retrieved floater
				this.deleteFloater(index);
				--index; // position iterator before the element moved back
			}
		}
		
		// collision tests
		this.newItem=false;
		if (this.collisionHandler.testBrickHits()) { // all three should be Observer patterns, but too heavy for 13k
			this.soundManager.playBrickHit();
		}
		if (this.collisionHandler.testPadHits()) {	
			this.soundManager.playPadHit();
		}
		if (this.collisionHandler.testFloaterHits()) {
			this.soundManager.playFloaterCaught();
		}
		
		// time and environment
		++this.time;
		if (this.time>=this.environmentItemEnd) {
			this.environmentItem=0;
		}
	},
	
	/**
	 * Does one point of damage to a given brick
	 * Handles the result of the damage, such as brick destruction and floater creation
	 */
	hitBrick : function(brickIndex) {
		if (this.environmentItem == 17) {	// steel bricks : no damage
			this.bricks[brickIndex].hitEcho=true;
			return;
		}
		if (this.bricks[brickIndex].receiveHit(this.time)) {	// true if destroyed
			if (Math.random()>.8) { // 1 in 5 bricks
				this.createFloater(brickIndex);
			}
			--this.bricksLeft;
			this.score += this.bricks[brickIndex].value*10*(9+this.ballsInPlay)*(12-this.padCount);
		}
	},
	
	/**
	 * Activate an item, bonus or malus.
	 * Usually called after the pad retrieves a floater
	 *  @param item : numeric identifier of the bonus/malus item
	 *  @param padIndex : index of the pad retrieving the floater
	 */
	itemActivated : function(item, padIndex) {
		this.lastItem = item;
		this.newItem = true;
		switch (item) {
			case 1: // widen pad
				this.padWidth=Math.min(this.padWidth+.04,.32);
				break;
			case 2 : // narrow pad
				this.padWidth=Math.max(this.padWidth-.04,.08);
				break;
			case 3 : // extra pad
				this.padAngle.push(Math.PI/this.padCount);
				++this.padCount;
				break;
			case 4 : // extra life
				++this.lives;
				break;
			case 5 : // multi-ball
				var extraBalls=0;
				for (var index=0; index<this.ballsInPlay; ++index) {
					if (this.balls[index].stuckOnPad==-1) {	// only duplicate balls in flight
						var newBall = Object.create(this.balls[index]);
						newBall.heading+=Math.PI;
						this.balls.push(newBall);
						++extraBalls;
					}
				}
				this.ballsInPlay+=extraBalls;
				break;
			case 6 : // slow balls
				for (var index=0; index<this.ballsInPlay; ++index) {
					this.balls[index].speed-=.005;
				}
				break;
			case 7 : // destroy pad
				// called after pad loop in collisionHandler, so it is safe to destroy it now
				for (var i=padIndex+1; i<this.padCount; ++i) {
					this.padAngle[i-1]=this.padAngle[i]+(i==padIndex+1?this.padAngle[i-1]:0);
				}
				--this.padAngle.length;
				--this.padCount;
				break;
			case 8 : // slow pads
				this.padSpeed=Math.max(this.padSpeed-.01,.03);
				break;
			default :
				break;
		}
		if (item>15) { // change the environment to the current, time-limited, item
			this.environmentItem = item;
			this.environmentItemEnd = this.time+300;
		}
	},
	
	/**
	 * Creates a floater (bonus or malus)
	 */
	createFloater : function(brickIndex) {
		var brick = this.bricks[brickIndex];
		var item = 1+Math.floor(Math.random()*13);
		item+=(item>8?7:0);
		this.floaters.push(new Floater(brick.posX, brick.posY, this.time, item));
	},
	
	/**
	 * Removes a floater from play (lost or taken)
	 * Rearranges the array at minimal cost : the last floater is moved to
	 * the freed slot, the the list is shortened.
	 */
	deleteFloater : function(index) {
		this.floaters[index]=this.floaters[this.floaters.length-1];
		--this.floaters.length;
	 },
	 
	createLevel0 : function() {
		var layout = [[3, 2, 1, 1, 2, 3, 7, 3, 2, 0, 3, 2, 2, 3, 1],
					  [5, 5, 1, 1, 5, 5, 1, 5, 5, 0, 4, 5, 3, 4, 1],
					  [3, 7, 1, 1, 7, 3, 7, 5, 7, 0, 2, 5, 2, 2, 5],
					  [5, 5, 1, 1, 5, 5, 1, 5, 5, 0, 1, 5, 2, 4, 3],
					  [7, 5, 7, 7, 5, 5, 7, 5, 5, 0, 7, 2, 2, 3, 5]];
		for (var layer=0; layer<layout.length; ++layer) {
			var path = new CircularPath(.95-.09*layer, .03);
			for (var index=0;index<layout[layer].length;++index){
				for (var b=0;b<3;++b) {
					if (layout[layer][index]&(1<<b)) {
						var brick = new Brick(0,0,index&7);
						brick.path = path;
						brick.relativeTime = -3.2*(b+4*index);
						brick.radius=.04;
						this.bricks.push(brick);
					}
				}
			}
		}
	},
	 
	createLevel1 : function() {
		this.bricks.push (new Brick(0,0,2));
		for (var layer=1;layer<3;++layer) {
			for (var index=0;index<6*layer;++index) {
				this.bricks.push (new Brick(.24*layer*Math.cos(index*6.28/(6*layer)),.24*layer*Math.sin(index*6.28/(6*layer)), 2-layer));
			}
		}
	},
	
	createLevel2 : function() {
		for (var layer=1;layer<4;++layer) {
			var path = new CircularPath(.24*layer-.12, .03);
			var count = [0,3,6,6][layer];
			for (var index=0;index<count;++index) {
				var brick = new Brick(0,0,4+((count==6&&(index&1)?1:0))+(layer==3?1:0));
				brick.path = path;
				brick.relativeTime = index*210/count+layer*5;
				this.bricks.push(brick);
			}
		}
	},
	
	createLevel3 : function() {
		this.bricks.push (new Brick(0,0,0));
		for (var layer=1;layer<4;++layer) {
			var path = new CircularPath(.18*layer, (layer&1?.03:-.03));
			for (var index=0;index<6*layer;++index) {
				var brick = new Brick(0,0,[0,1,4,3][layer]);
				brick.path = path;
				brick.relativeTime = index*35/layer;
				this.bricks.push(brick);
			}
		}
	},
	
	createLevel4 : function() {
		for (var layer=0;layer<3;++layer) {
			var path = new DoubleCircularPath(.38, .0002, .2, .03);
			for (var index=0;index<6;++index) {
				var brick = new Brick(0,0,[1,4,6][layer]);
				brick.path = path;
				brick.relativeTime = index*35+layer*10500;
				this.bricks.push(brick);
			}
		}
	},
	
	createLevel5 : function() {
		var path = new HarmonicPath(.2, .015, .05, .045);
		for (var index=0;index<6;++index) {
			var brick = new Brick(0,0,3);
			brick.radius=.06;
			brick.path = path;
			brick.relativeTime = index*280/4;
			this.bricks.push(brick);
		}
		 path = new HarmonicPath(.55, .015, .08, .09);
		for (var index=0;index<24;++index) {
			var brick = new Brick(0,0,6);
			brick.radius=.06;
			brick.path = path;
			brick.relativeTime = index*70/4;
			this.bricks.push(brick);
		}
	},
	
	createLevel6 : function() {
		for (var index=0;index<24;++index) {
			var path = new OscillatingPath(.18*Math.floor(index/6)-.27, .3, (index%6)*.18-.5, .015, .045, 3.1416*index);
			var brick = new Brick(0,0,[5,8][index&1]);
			brick.path = path;
			brick.relativeTime = 0;
			this.bricks.push(brick);
		}
	},
	
	createLevel7 : function() {
		this.bricks.push (new Brick(0,0,8));
		for (var layer=1;layer<3;++layer) {
			for (var index=0;index<6*layer;++index) {
				var brick = new Brick(.24*layer*Math.cos(index*6.28/(6*layer)),.24*layer*Math.sin(index*6.28/(6*layer)), [8,6,8][layer]);
				brick.relativeTime = index+layer*2;
				brick.hitPoints=2;
				this.bricks.push(brick);
			}
		}
	},
	
	createLevel8 : function() {
		for(var index=0; index<6;++index) {
			var brick = new Brick(0,0,1);
			var x=.6*Math.cos(Math.PI*index/3);
			var y=.6*Math.sin(Math.PI*index/3);
			var path = new PulsatingPath(x,y,Math.PI/6,.03,-.33,1,.01,0);
			brick.path=path;
			this.bricks.push(brick);
		}
		for(var index=0; index<6;++index) {
			var brick = new Brick(0,0,4);
			var x=.4*Math.cos(Math.PI*(index+.25)/3);
			var y=.4*Math.sin(Math.PI*(index+.25)/3);
			var path = new PulsatingPath(x,y,Math.PI/6,.03,-.33,1,.01,Math.PI);
			brick.path=path;
			this.bricks.push(brick);
		}
	},

	createLevel9 : function() {
		var path = new LissajousPath(.4, .03, .02);
		for (var index=0;index<20;++index) {
			var brick = new Brick(0,0,7);
			brick.path = path;
			brick.relativeTime = index*6.28/.2;
			this.bricks.push(brick);
		}
	},

	createLevel10 : function() {
		for(var index=0; index<16;++index) {
			var brick = new Brick(0,0,[0,2,3,4][index>>2]);
			var x=[0, 1, 0, -1, -1, -2, -3, -2, 0, -1, 0, 1, 1, 2, 3, 2][index]/8; 
			var y=[1, 2, 3, 2, 0, 1, 0, -1, -1, -2, -3, -2, 0, -1, 0, 1][index]/8; 
			var path = new PulsatingPath(x,y,Math.PI/2,.03,1,7,0,0);
			brick.path=path;
			this.bricks.push(brick);
		}
	},

	createLevel11 : function() {
		for (var layer=0;layer<6;++layer) {
			for(var index=0; index<3;++index) {
				var brick = new Brick(0,0,[2,8,4,8,7,8][layer]);
				var x=[.6,.3,.6][index]*Math.cos(2*Math.PI*(layer/6+(index-1)/28)); 
				var y=[.6,.3,.6][index]*Math.sin(2*Math.PI*(layer/6+(index-1)/28)); 
				var path = new PulsatingPath(x,y,-Math.PI/6,.03,-.4,3,0,0);
				brick.path=path;
				this.bricks.push(brick);
			}
		}
	},

	createLevel12 : function() {
		this.bricks.push (new Brick(0,0,8));
		for (var layer=1;layer<3;++layer) {
			for (var index=0;index<6*layer;++index) {
				this.bricks.push(new Brick(.24*layer*Math.cos(index*6.28/(6*layer)),.24*layer*Math.sin(index*6.28/(6*layer)), [8,1,8][layer]));
			}
		}
	},
	
	createLevel13 : function() {
		var layout = [[5, 2, 9, 0],
					  [2, 2, 9, 0],
					  [5, 2, 9, 0]];
		for (var layer=0; layer<3; ++layer) {
			// outer ring
			var path = new CircularPath(.6-.09*layer, .03);
			for (var index=0;index<16;++index){
				for (var b=0;b<4;++b) {
					if (layout[layer][index&3]&(1<<b)) {
						var brick = new Brick(0,0,[1,6,2,7][index>>2]);
						brick.path = path;
						brick.relativeTime = -3.2*(b+4*index);
						brick.radius=.04;
						this.bricks.push(brick);
					}
				}
			}
			
			// inner number
			for (var index=0;index<3;++index){
				for (var b=0;b<4;++b) {
					if (layout[layer][index&3]&(1<<b)) {
						var brick = new Brick(0.05*(b+4*index-5.6),(layer-1)*.1,0);
						brick.radius=.04;
						brick.hitPoints=7;
						this.bricks.push(brick);
					}
				}
			}
		}
	}
}
