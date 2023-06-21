function AdvancedRenderer(canvas, container, game)
{
	this.context=canvas.getContext('2d');
	this.canvas=canvas;
	this.container=container;
	this.game=game;
	this.time=0;
	this.itemDisplayed=0;
	this.itemTime=0;
	this.menuText = ["PLAY ! ", "CONTROLS : ", "MUSIC : ", "SOUND FX : ","HALL OF FAME"];
	this.starfield=[];
	for (var i=0;i<500;++i) {
		this.starfield[i]=[Math.random(),Math.random(),Math.random()];
	}
	this.starfieldX=0;
	this.starfieldY=0;
	this.starfieldZ=0;
	this.starfieldPhi=0;
	this.starfieldSpeed=[0,0,-.005,.01];
	this.starfieldTargetSpeed=[0,0,-.005,.01];
	this.starfieldCount=100;
	this.starfieldTargetCount=100;
	
	this.twirlingStars=[];
	
	this.floaterSymbol=["","\u21d4","><","\u271a","\u2665","\u273f","\u2615","\u2620","\u270b","","","","","","","","\u2638","\u272a","\u26a1","\u269b","\u2668"];
	this.floaterColor=["","#CFC","#FE8","#CFC","#FCC","#CCC","#CCF","#FFF","#FFC","","","","","","","","#FEC","#DEE","#8FF","#8F8","#FFC"];

	this.meteors=[];	// array of retrieved floaters (special animation)
}

AdvancedRenderer.prototype = {

	initialize : function() {
		this.renderBuffer = document.createElement("canvas");
		this.renderBuffer.width=1060;
		this.renderBuffer.height=580;
		var bufferContext = this.renderBuffer.getContext('2d');
		
		// bricks
		var highlightColor = ["#FFFFC0", "#FFFFC0", "#FFFFC0", "#C0FFC0", "#C0FFFF", "#FFC0FF", "#FFC0FF", "#FFC0FF", "#FFFFFF", "#AAA"];
		var solidColor = ["#FF2000", "#E08000", "#C0C000", "#00A000", "#0080C0", "#0020FF", "#7000C0", "#FF00A0", "#404040", "#000"];
		bufferContext.save();
		for (var color=0;color<10;++color) {
			var gradient = bufferContext.createRadialGradient(15, 45, 2, 30, 30, 30);
			gradient.addColorStop(0, highlightColor[color]);
			gradient.addColorStop(1, solidColor[color]);
			bufferContext.fillStyle = gradient;
			bufferContext.beginPath();
			bufferContext.arc(30, 30, 30, 0, 7, 0); // 7 is shorter than 6.2832 or 2*Math.PI and every byte counts
			bufferContext.fill();
			bufferContext.translate(0,60);
			for (var line=1;line<8;++line) {
				bufferContext.strokeStyle=gradient;
				bufferContext.lineWidth=26-line*3;
				var halfAngle=(8.5-line)/8;
				for (var dash=0;dash<8;++dash) {
					bufferContext.beginPath();
					bufferContext.arc(30, 30, 17, (dash-halfAngle)*Math.PI/4, (dash+halfAngle)*Math.PI/4, 0); 
					bufferContext.stroke();
				}
				bufferContext.translate(0,60);
			}
			bufferContext.translate(60,-480);
		}
		bufferContext.restore();
		
		// floaters
		bufferContext.save();
		bufferContext.translate(600,0);
		var gradient = bufferContext.createRadialGradient(30, 30, 2, 30, 30, 30);
		gradient.addColorStop(0, "rgba(0,0,0,0)");
		gradient.addColorStop(.7, "rgba(0,0,0,0)");
		gradient.addColorStop(.8, "#0000FF");
		gradient.addColorStop(.85, "#00FFFF");
		gradient.addColorStop(1, "rgba(0,0,255,0)");
		bufferContext.fillStyle = gradient;
		bufferContext.beginPath();
		bufferContext.arc(30, 30, 30, 0, 7, 0);
		bufferContext.fill();
		
		// ball
		bufferContext.translate(0,60);
		gradient = bufferContext.createRadialGradient(8, 23, 2, 15, 15, 15);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(1, "#202030");
		bufferContext.fillStyle = gradient;
		bufferContext.beginPath();
		bufferContext.arc(15, 15, 15, 0, 7, 0);
		bufferContext.fill();
		
		// pad
		bufferContext.translate(0,60);
		gradient = bufferContext.createRadialGradient(8, 23, 2, 15, 15, 15);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(1, "red");
		bufferContext.fillStyle = gradient;
		bufferContext.beginPath();
		bufferContext.arc(15, 15, 15, 0, 7, 0);
		bufferContext.fill();
		bufferContext.translate(0,60);
		bufferContext.beginPath();
		bufferContext.arc(15, 15, 15, 0, 7, 0);
		bufferContext.fill();
		bufferContext.translate(0,-60);
		gradient = bufferContext.createLinearGradient(0,0,30,0);
		gradient.addColorStop(0, "#FF0000");
		gradient.addColorStop(.1, "#00A000");
		gradient.addColorStop(.3, "#A0FFA0");
		gradient.addColorStop(.9, "#00A000");
		gradient.addColorStop(1, "#FF0000");
		bufferContext.fillStyle = gradient;
		bufferContext.fillRect(0, 15, 30, 60);		
		bufferContext.restore();
		
		
		bufferContext.textAlign="center";
		bufferContext.textBaseline="middle";
		
		bufferContext.fillStyle="yellow";
		bufferContext.font="20px Verdana";
		var message = ["1990 ProTracker module.","for the original","Horace Wimp of Aurora","","and music.","used for both sfx","the amazing SoundBox Lite","Marcus Geelnard for","","version go as follow :","Credits for this","","Acorn Archimedes.","by Eterna on","released in 1990","original Ballarena","tribute to the","This game is a","","","again for next compo.", "and meet you", "enjoyed the game,", "Hope you", "" , "Ballarena 2013k", "You just completed", "Congratulations !"];
		for (var index=0;index<message.length;++index) {
			bufferContext.fillText(message[index], 860, 20+index*20);
		}

	},
	

	resize : function() {
		var size = Math.min(window.innerWidth, window.innerHeight);
		this.canvas.height=this.canvas.width=size;
		this.context.height=this.context.width=size;
		this.context.translate(size/2,size/2);
		this.context.scale(.4*size,-.4*size);
		this.canvas.style.left=Math.floor((window.innerWidth-size)/2)+"px";
		this.canvas.style.top=Math.floor((window.innerHeight-size)/2)+"px";
	},

	drawMain : function() {
		this.context.save();
		this.context.clearRect(0,0,this.context.width, this.context.height);
		this.resize();
		this.drawStarfield();
		
		if (this.game.eventType==2)  {	// lost ball : all stars converge to form a new ball
			if (this.twirlingStars.length==0) {
				for (var index=0; index<this.starfieldCount; ++index) {
					var x = this.starfield[index][0]+this.starfieldX;
					var y = this.starfield[index][1]+this.starfieldY;
					var z = this.starfield[index][2]+this.starfieldZ;
					x=x-Math.floor(x)-.5;
					y=y-Math.floor(y)-.5;	
					z=z-Math.floor(z)+.5;
					if (x*x+y*y<z*z) {
						var nx = x*Math.cos(this.starfieldPhi)-y*Math.sin(this.starfieldPhi);
						var ny = y*Math.cos(this.starfieldPhi)+x*Math.sin(this.starfieldPhi);
						this.twirlingStars.push([2*nx/z, 2*ny/z, .005/z]);
					}
				}
				this.starfieldCount=0;
			}
			this.context.save();
			var targetX = Math.cos(this.game.level.padAngle[0])*(this.game.level.padRadius-.04);
			var targetY = Math.sin(this.game.level.padAngle[0])*(this.game.level.padRadius-.04);

			this.context.translate(targetX*(50-this.game.transitionTimer)/50, targetY*(50-this.game.transitionTimer)/50);
			var scale=(1+this.game.transitionTimer)/51;
			this.context.scale(scale, scale);
			for (var index=0; index<this.twirlingStars.length; ++index) {
				this.context.fillRect(this.twirlingStars[index][0], this.twirlingStars[index][1], this.twirlingStars[index][2]/scale, this.twirlingStars[index][2]/scale);
			}
			this.context.restore();
			
		} else {
			this.twirlingStars.length=0;
		}
		
		if (this.game.transitionToHof) { // not zero : Hall of Fame is visible
			this.context.save();
			this.context.translate(2-this.game.transitionToHof/5, 0);
			this.drawHallOfFame();
			this.context.restore();
		} else {
			this.time=0;
		}
		if (this.game.transitionToHof<10 && this.game.level.level<14 ) { // game board visible
			this.context.save();
			this.context.translate(-this.game.transitionToHof/5, 0);
			this.drawGame();
			this.context.restore();
		}

		if (this.game.eventType==3 && this.game.transitionTimer) { // game over text
			this.context.save();
			this.context.scale(.01,-.01);
			this.context.fillStyle="black";
			this.context.strokeStyle="white";
			this.context.font="64px Verdana";
			this.context.textAlign="center";
			this.context.textBaseline="middle";
			var x = .09*(this.game.transitionTimer-50)*(this.game.transitionTimer-50)-20;
			this.context.fillText("GAME", -x, -30);
			this.context.strokeText("GAME", -x, -30);
			this.context.fillText("OVER", x, 30);
			this.context.strokeText("OVER", x, 30);
			this.context.restore();
		}
				
		if (this.game.menuOffset<10) {  // menu
			var timer=this.game.level.time;
			var red = Math.round(215-Math.cos(timer/20));
			var highlightColor = "rgb("+red+",255,"+(430-red)+")";
			if ((timer%3)==0 && ((Math.floor(timer/50)&1)==0)) {
				highlightColor = "#FF8080";
			}
			
			this.context.translate(this.game.menuOffset/5, 0);
			this.context.scale(.012,-.012);
			this.context.textAlign="center";
			this.context.fillStyle="black";			
			this.context.lineWidth=1.5;
			this.context.lineJoin="bevel";
			for (var index=0; index<5; ++index) {
				this.context.strokeStyle=(this.game.menu.selectedOption==index?highlightColor : "#A0A0A0");
				var text=this.menuText[index];
				if (this.game.level.level) {
					text=(index==4?"QUIT":(!index?"RESUME":text));
				}
				text+=(index==1?(this.game.controls.stance==1?"REGULAR":"GOOFY"):"");
				text+=(index==2?(this.game.level.soundManager.soundSupport?(this.game.level.soundManager.musicOn?"ON":"OFF"):"not supported"):"");
				text+=(index==3?(this.game.level.soundManager.soundSupport?(this.game.level.soundManager.soundOn?"ON":"OFF"):"not supported"):"");
				this.context.strokeText(text, 0, 25*index-50);
				this.context.fillText(text, 0, 25*index-50);
			}
		}
		this.context.restore();
		
	},
	
	drawEndGame : function() {
		this.context.save();
		this.context.clearRect(0,0,this.context.width, this.context.height);
		this.resize();
		this.drawStarfield();

		var baseOrigin=580;
		for (var line=-1.25; line<.5; line+=.01) {
			var dx=-1/(line-1);
			var origin=Math.min(580,Math.max(0, 930-200*dx-(this.time%850)));
			var height=baseOrigin-Math.floor(origin);
			if ((this.time%850)==0) {
				baseOrigin=580;
			} else if (height>0) {
				this.context.globalAlpha=.5-line/2;
				this.context.drawImage(this.renderBuffer, 660, origin, 400, 1, (-1+line), line, 2-2*line, .01);
				baseOrigin=Math.min(baseOrigin, Math.ceil(origin));
			}
		}
		this.context.restore();
		++this.time;
	},


	/**
	 * Draws the game content. No starfield nor menu. 
	 * This method is "C++ private" and should only be called by drawGameAndHof(), and not form outside 
	 * It does NOT save nor restore the context
	 */
	drawGame : function() {
		var level = this.game.level;
		this.context.rotate(-level.cameraRoll);

		// draw floaters
		this.context.textAlign="center";
		this.context.textBaseline="middle";
		for (var i=0 ; i<level.floaters.length; ++i) {
			this.context.save();
			this.context.translate(level.floaters[i].posX, level.floaters[i].posY);
			this.context.drawImage(this.renderBuffer, 600, 0, 60, 60, -level.floaters[i].radius, -level.floaters[i].radius, 2*level.floaters[i].radius, 2*level.floaters[i].radius);
			var scale=.010+.002*Math.sin(level.time/5);
			this.context.scale(scale, -scale);
			this.context.fillStyle=this.floaterColor[level.floaters[i].item];
			this.context.fillText(this.floaterSymbol[level.floaters[i].item], 0, .5);
			this.context.restore();
			if (level.floaters[i].hit) {
				this.meteors.push( { x:level.floaters[i].posX, y : level.floaters[i].posY, i : level.floaters[i].item, t:0, r:level.floaters[i].radius });
			}
		}
		
		// draw bricks
		for (var i=0 ; i<level.bricks.length; ++i) {
			var frame = (level.bricks[i].alive?0:level.time-level.bricks[i].timeBlown);
			if (frame<8) {
				this.context.drawImage(this.renderBuffer, 60*level.bricks[i].color, 60*frame, 60, 60, level.bricks[i].posX-level.bricks[i].radius, level.bricks[i].posY-level.bricks[i].radius, 2*level.bricks[i].radius, 2*level.bricks[i].radius);
			}
			if (level.bricks[i].hitEcho) {
				this.context.beginPath();
				this.context.arc(level.bricks[i].posX, level.bricks[i].posY, level.bricks[i].radius, 0, 7, 0);
				this.context.fill();
			}
		}
		
		// draw meteors (retrieved floaters)
		for (var i=0; i<this.meteors.length; ++i) {
			if (this.meteors[i].t>50) {
				this.meteors[i]=this.meteors[this.meteors.length-1];
				--this.meteors.length;
				--i;
			} else {
				var r=this.meteors[i].r*(50-this.meteors[i].t)/50;
				this.context.save();
				this.context.lineWidth=.01;
				this.context.translate(this.meteors[i].x, this.meteors[i].y);
				this.context.rotate(++this.meteors[i].t/10);
				this.context.strokeStyle="blue";
				this.context.beginPath();
				this.context.arc(0, 0, .95*r, 0, 7, 0);
				this.context.stroke();
				this.context.fillStyle=this.meteors[i].i==7?"red":"white";
				this.context.beginPath();
				this.context.moveTo(r, 0);
				for (var phi=0; phi<9; ++phi) {
					this.context.lineTo(((phi&1)?r/4:r)*Math.cos(phi*Math.PI/4), ((phi&1)?r/4:r)*Math.sin(phi*Math.PI/4));
				}
				this.context.fill();
				this.context.restore();
			}
		}
		
		// draw balls
		if (this.game.eventType!=1) {
			for (var i=0 ; i<level.ballsInPlay; ++i) {
				this.context.drawImage(this.renderBuffer, 600, 60, 30, 30, level.balls[i].posX-level.balls[i].radius, level.balls[i].posY-level.balls[i].radius, 2*level.balls[i].radius, 2*level.balls[i].radius);	
			}
		}
		
		if (level.level) {	// things to display only during a game
			this.context.rotate(level.cameraRoll);
			this.context.save();
			this.context.scale(.01,-.01);
			
			// item
			if (level.newItem && (level.lastItem != this.itemDisplayed || this.itemTime>=115)) {
				this.itemDisplayed = level.lastItem;
				this.itemTime = 0;
				this.predrawItemName(0);
			}
			if (this.itemDisplayed && this.itemTime<60) {
				var x=-120+(this.itemTime>15?0:.3*(this.itemTime-15)*(this.itemTime-15));	// motion : time 0 to 20
				var w=Math.min(240, 120-x);
				if (this.itemTime>15 && this.itemTime<30) {
					this.predrawItemName(this.itemTime-15);
				} else if (this.itemTime>=50) {
					this.predrawItemNameHide(this.itemTime-50);
				}
				this.context.drawImage(this.renderBuffer, 0, 480, 2.5*w, 100, x, -130, w, 40);
				++this.itemTime;
			}
		
			// score, lives ..
			this.context.rotate(Math.PI/2);
			for (var i=0 ; i<level.lives; ++i) {
				this.context.drawImage(this.renderBuffer, 600, 120, 30, 30, -85+10*i, 90, 5, 5);
				this.context.drawImage(this.renderBuffer, 600, 150, 30, 30, -85+10*i, 95, 5, 10);
				this.context.drawImage(this.renderBuffer, 600, 180, 30, 30, -85+10*i, 105, 5, 5);
			}
			this.context.rotate(-Math.PI/2);

			this.context.fillStyle=("white");
			this.context.fillText(level.score, -100, 80);
			this.context.fillStyle="blue";
			
			// level, with animation during transition
			var levelText=(level.level==13?"\u2169\u2162":String.fromCharCode(0x215f+level.level));
			
			if (this.game.eventType==1 && this.game.transitionTimer) {
				var levelX=80-3*this.game.transitionTimer;
				var levelY=-80+5*this.game.transitionTimer;
				this.context.translate(levelX, levelY);
				var scale=1+this.game.transitionTimer/10;
				this.context.scale(scale,scale);
				this.context.fillText("level", 0, -this.game.transitionTimer/scale-300/(3+this.game.transitionTimer));
				this.context.fillText(levelText, 0, 0);
				this.context.lineWidth=.3;
				this.context.strokeStyle="rgb(0,"+Math.min(255,this.game.transitionTimer*4)+",255)";
				this.context.strokeText("level", 0, -this.game.transitionTimer/scale-300/(3+this.game.transitionTimer));
				this.context.strokeText(levelText, 0, 0);
			} else {
				this.context.fillText(levelText, 80, -80);
			}			
			this.context.restore();
			
			// draw environment remaining time
			if (level.environmentItem) {
				this.context.strokeStyle="red";
				this.context.lineWidth=.02;
				for (var index=0; index*12.5<level.environmentItemEnd-level.time;++index) {
					this.context.beginPath();
					this.context.arc(0, 0, 1, Math.PI/2-Math.PI*index/12, Math.PI/2-Math.PI*(index/12+1/13), true);			
					this.context.stroke();
				}
			}
			
			// draw pads
			if (this.game.eventType!=1) {
				this.context.rotate(-level.cameraRoll);
				for (var i=0 ; i<level.padCount; ++i) {
					this.context.rotate(level.padAngle[i]);
					this.context.drawImage(this.renderBuffer, 600, 120, 30, 30, level.padRadius, -level.padWidth, level.padThickness, level.padThickness);
					this.context.drawImage(this.renderBuffer, 600, 150, 30, 30, level.padRadius, -level.padWidth+level.padThickness, level.padThickness, 2*(level.padWidth-level.padThickness));
					this.context.drawImage(this.renderBuffer, 600, 180, 30, 30, level.padRadius, level.padWidth-level.padThickness, level.padThickness, level.padThickness);
				}
			}
		}
	},
	
	predrawItemName : function(offset) {
		var itemName = ["", "LARGER PAD", "SMALLER PAD", "EXTRA PAD", "LIFE", "MULTI BALL", "SLOW DOWN BALLS", "POISON", "SLOW DOWN PADS", "", "", "", "", "", "", "", "CAMERA ROLL", "STEEL BRICKS", "MAGNETIC", "GRAVITY", "STICKY PADS" ];
		var bufferContext = this.renderBuffer.getContext('2d');
		if (!offset) {
			bufferContext.clearRect(0, 480, 600, 100);
		}
		bufferContext.globalCompositeOperation="lighter";
		bufferContext.font="64px Verdana";
		bufferContext.strokeStyle="rgba(16, 64, 16, 64)";
		bufferContext.strokeText(itemName[this.itemDisplayed], 300-offset, 530);
		
	},
	
	predrawItemNameHide : function(offset) {
		var bufferContext = this.renderBuffer.getContext('2d');
		for (var i=0;i<10;++i) {
			bufferContext.clearRect(0,480+i*10+offset,600,1);
		}
		
	},

	drawStarfield : function() {
		var level = this.game.level.level;
	
		// draw starfield
		this.context.fillStyle="white";
		this.context.rotate(this.starfieldPhi);
		for (var i=0; i<this.starfieldCount; ++i) {
			var x = this.starfield[i][0]+this.starfieldX;
			var y = this.starfield[i][1]+this.starfieldY;
			var z = this.starfield[i][2]+this.starfieldZ;
			x=x-Math.floor(x)-.5;
			y=y-Math.floor(y)-.5;
			z=z-Math.floor(z)+.5;
			this.context.fillRect(2*x/z, 2*y/z, .005/z, .005/z); 
		}
		this.context.rotate(-this.starfieldPhi);

		// compute starfield direction
		this.starfieldTargetSpeed[0] = [0, .01, 0, -.01][level&3];
		this.starfieldTargetSpeed[1] = [0, 0, -.01, .01, 0, 0][level%6];
		this.starfieldTargetSpeed[2] = [-.005, 0, -.005, 0, 0, -.01, -.02, 0][level&7];
		this.starfieldTargetSpeed[3] = [.01, 0, 0, 0, -.008][level%4];
		this.starfieldTargetCount = (level?100:(this.starfieldTargetCount==500?100:(this.starfieldTargetCount==100?500:this.starfieldTargetCount)));

		this.starfieldX+=this.starfieldSpeed[0];
		this.starfieldY+=this.starfieldSpeed[1];
		this.starfieldZ+=this.starfieldSpeed[2];
		this.starfieldPhi+=this.starfieldSpeed[3];
		for (var i=0;i<4;++i) { // starfield acceleration
			var delta=this.starfieldTargetSpeed[i]-this.starfieldSpeed[i];
			this.starfieldSpeed[i]+=(Math.abs(delta)<.0001?0:(delta>0?.0001:-.0001));
		}
		this.starfieldCount+=(this.starfieldTargetCount==this.starfieldCount?0:(this.starfieldTargetCount>this.starfieldCount?1:-1));

	},
	
	drawHallOfFame : function() {
		this.context.scale(.025,-.025);
		this.context.textAlign="center";
		this.context.lineWidth=.3;
		for (var i=15;i>0;--i) {
			this.context.strokeStyle="rgb("+(255-17*i)+","+(255-17*i)+","+(255-17*i)+")";
			this.context.strokeText("Hall of Fame", .2*i*Math.cos(-i+this.time), -i/3-35);
		}
		this.context.fillStyle="black";
		this.context.fillText("Hall of Fame", 0, -35);
		// rotate the entries : fast towards the edited line, or continously if not entering a hiscore.
		if (this.game.signingToHof>-1) {
			var targetTime=30*this.game.signingToHof;
			this.time=(this.time*8+targetTime)/9;
		} else ++this.time;
		
		this.context.scale(.4,.4);
		this.context.rotate(-.01*this.time);
		this.context.textBaseline="middle";
		for (var index=0; index<16; ++index) {
			this.context.fillStyle="rgb("+(255-index*17)+","+(index*17)+","+(index==this.game.signingToHof?255:0)+")";
			this.context.textAlign="left";
			this.context.font="6px Verdana";
			this.context.fillText((1+index)+".", 18, 0);
			this.context.font="7px Verdana";
			this.context.scale(1,1.5);
			this.context.fillText(this.game.hof[index][0],30, 0);
			this.context.textAlign="right";
			this.context.scale(1,1.7);
			this.context.fillText(this.game.hof[index][1], 86, 0);
			this.context.scale(1,1/2.55);
			this.context.rotate(.3);
		}
	}
	
}
