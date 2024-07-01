/**
 * Graphics renderer, in charge of displaying all game gfx to the page canvases
 * Handles all ingame modes and planes. 
 * @constructor
 * @param sceneryCanvas HTML5 canvas, with the pinball table
 * @param dotMatrixCanvas HTML5 canvas, with the score LED display
 * @param spriteImg Sprite sheet as a DOM image
 * @param game instance of the Game to render - mostly used to access World data
 */
 
function Renderer(sceneryCanvas, dotMatrixCanvas, spriteImg, game)
{
	this.game = game;
	this.world = game.world;
	this.sceneryCanvas = sceneryCanvas;
	this.dotMatrixCanvas = dotMatrixCanvas;
	this.sceneryContext = sceneryCanvas.getContext("2d");
	this.dotMatrixContext = dotMatrixCanvas.getContext("2d");

	this.bonusLightMask = [0, 0, 0, 0, 0, 0];
	this.lostLightMask = [0, 0, 0, 0];
	this.targetLightMask = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.audienceLightMask = [0, 0, 0, 0, 0, 0];
	this.trapLightMask = [0, 0, 0, 0, 0, 0];
	this.escapeLightMask = [0, 0, 0, 0, 0, 0];
	this.arrowLightMask = [0, 0, 0];
	
	this.spriteSheet = document.createElement("canvas");
	this.spriteSheet.width=800; //spriteImg.width*2;
	this.spriteSheet.height=800; // spriteImg.height+40;
	var bufferContext = this.spriteSheet.getContext('2d');
	
	// draw grid for dot matrix
	bufferContext.fillStyle="#000";
	for (var i=0;i<800; i+=4) {
		bufferContext.fillRect(i+2, 0, 2, 64);
	}
	for (var i=0;i<64; i+=4) {
		bufferContext.fillRect(0, i+2, 800, 2);
	}
	bufferContext.strokeStyle="#000";
	bufferContext.textAlign="center";
	bufferContext.font="bold 22px Verdana";
	bufferContext.textBaseline="middle";
	bufferContext.lineWidth=4;

	for (var j=0;j<4; ++j) {
		for (var i=0;i<6; ++i) { // x2 .. x7
			bufferContext.fillStyle=["#006", "#006", "#600", "#066"][j];
			bufferContext.beginPath();
			bufferContext.arc(32+64*i, 104+80*j, 19, 0, 7);
			bufferContext.stroke();
			bufferContext.fill();
			bufferContext.fillStyle="#000";
			var text = [["x2","x3","x4","x5","x6","x7"],
						["L","O","S","T","",""],
						["I","S","L","A","N","D"],
						["R","A","F","T","",""]][j][i];
			bufferContext.fillText(text, 32+64*i, 105+80*j);
			bufferContext.fillStyle=["#22f", "#22f", "#f22", "#2ff"][j];
			bufferContext.beginPath();
			bufferContext.arc(416+64*i, 104+80*j, 19, 0, 7);
			bufferContext.stroke();
			bufferContext.fill();
			bufferContext.fillStyle="#000";
			bufferContext.fillText(text, 416+64*i, 105+80*j);
		}
	}

	bufferContext.font="14px Verdana";
	for (var i=0;i<6; ++i) { // trail to left ramp 
		bufferContext.save();
		bufferContext.fillStyle="#660";
		bufferContext.translate(64*i, 384);
		bufferContext.beginPath();
		bufferContext.moveTo(2, 28);
		bufferContext.lineTo(41, 6);
		bufferContext.lineTo(62, 52);
		bufferContext.lineTo(23, 74);
		bufferContext.lineTo(2, 28);
		bufferContext.stroke();
		bufferContext.fill();
		bufferContext.fillStyle="#000";
		bufferContext.fillText(["Pilot", "100k", "500k", "", "VOD", "DVD"][i], 32, 40);
		bufferContext.fillStyle="#ff2";
		bufferContext.translate(384, 0);
		bufferContext.beginPath();
		bufferContext.moveTo(2, 28);
		bufferContext.lineTo(41, 6);
		bufferContext.lineTo(62, 52);
		bufferContext.lineTo(23, 74);
		bufferContext.lineTo(2, 28);
		bufferContext.stroke();
		bufferContext.fill();
		bufferContext.fillStyle="#000";
		bufferContext.fillText(["Pilot", "100k", "500k", "", "VOD", "DVD"][i], 32, 40);
		bufferContext.restore();
	}
	bufferContext.fillText("Prime", 223, 414);
	bufferContext.fillText("Time", 225, 434);
	bufferContext.fillText("Prime", 607, 414);
	bufferContext.fillText("Time", 609, 434);

	bufferContext.font="13px Verdana";
	for (var i=0;i<6; ++i) { // trail to right ramp
		bufferContext.save();
		bufferContext.fillStyle="#840";
		bufferContext.translate(64*i, 464);
		bufferContext.beginPath();
		bufferContext.moveTo(62, 28);
		bufferContext.lineTo(23, 6);
		bufferContext.lineTo(2, 52);
		bufferContext.lineTo(41, 74);
		bufferContext.lineTo(62, 28);
		bufferContext.stroke();
		bufferContext.fill();
		bufferContext.fillStyle="#000";
		bufferContext.fillText(["Plane", "", "", "", "", "Time"][i], 34, 30);
		bufferContext.fillText(["Crash", "", "", "", "", "Travel"][i], 28, 50);
		bufferContext.fillText(["", "Bears", "Dharma", "Ghosts", "Aliens", ""][i], 32, 40);
		bufferContext.fillStyle="#fa2";
		bufferContext.translate(384, 0);
		bufferContext.beginPath();
		bufferContext.moveTo(62, 28);
		bufferContext.lineTo(23, 6);
		bufferContext.lineTo(2, 52);
		bufferContext.lineTo(41, 74);
		bufferContext.lineTo(62, 28);
		bufferContext.stroke();
		bufferContext.fill();
		bufferContext.fillStyle="#000";
		bufferContext.fillText(["Plane", "", "", "", "", "Time"][i], 34, 30);
		bufferContext.fillText(["Crash", "", "", "", "", "Travel"][i], 28, 50);
		bufferContext.fillText(["", "Bears", "Dharma", "Ghosts", "Aliens", ""][i], 32, 40);
		bufferContext.restore();
	}

	bufferContext.font="72px Impact";
	bufferContext.strokeStyle="#000";
	bufferContext.lineWidth=6;
	for (var i=0;i<6; ++i) { // E S C A P E  title
		bufferContext.fillStyle="#262";
		bufferContext.strokeText(["E","S","C","A","P","E"][i], 32+64*i, 592);
		bufferContext.fillText(["E","S","C","A","P","E"][i], 32+64*i, 592);
		bufferContext.fillStyle="#6f6";
		bufferContext.strokeText(["E","S","C","A","P","E"][i], 416+64*i, 592);
		bufferContext.fillText(["E","S","C","A","P","E"][i], 416+64*i, 592);
	}

	
	bufferContext.drawImage(spriteImg, 0, 624);
	
	// ball
	var gradient = bufferContext.createRadialGradient(18, 722, 18, 14, 714, 2);
	gradient.addColorStop(0, "#223");
	gradient.addColorStop(1, "#ccc");
	bufferContext.fillStyle = gradient;
	bufferContext.beginPath();
	bufferContext.arc(18, 722, 18, 0, 7, 0);
	bufferContext.fill();
	
	this.resizeWindow(); // define the appropriate pixel zoom for the play area
	
}


Renderer.prototype = {
	

	/** 
	 * Handler for global window resize event, also called once at init time
	 * Defines the zoom factor for the canvas contents and (re)aligns everything
	 * Zoom level is defined so that the number of tiles shown on screen is pretty much constant
	 */
	resizeWindow : function() {
			
		// Set both canvases to full window size
		this.dotMatrixCanvas.width = this.sceneryCanvas.width = 800; //window.innerWidth;
		this.dotMatrixCanvas.height = 64;
		this.sceneryCanvas.height = 1400;
		this.dotMatrixCanvas.style.width = this.sceneryCanvas.style.width = "800px"; //window.innerWidth+"px";
		this.dotMatrixCanvas.style.height = "64px";
		this.sceneryCanvas.style.height = "1400px";
		
	},

	/**
	 * Entry point - Draw the dot matrix screen
	 */
	drawDotMatrixScreen : function() {
		this.dotMatrixContext.fillStyle="#600";
		this.dotMatrixContext.fillRect(0, 0, this.dotMatrixCanvas.width, this.dotMatrixCanvas.height);
		this.dotMatrixContext.fillStyle="#FC0";
		this.dotMatrixContext.font="64px Impact";
		if (this.world.message && !this.messageId) { // new message
			this.messageStartTime = this.world.time;
			this.messageId = this.world.message;
			this.messageText = [ "",
			"ANOTHER EPISODE - BONUS X"+this.world.bonusMultiplier, // bonus multiplier +1
			"HIT THE RAMPS TO IMPROVE THE SCENARIO AND ATTRACT AUDIENCE", // all  I S L A N D  targets hit
			"CLIFFHANGER - SEASON ENDS", // ball lost
			"SHOOT RAMPS - 30 SECONDS TO ESCAPE", // all letters from  E S C A P E  lit : hit all ramps in 30 s
			"PREPARING YOUR ESCAPE", // one letter of  E S C A P E  lit

			"PILOT EPISODE BREAKS RATING RECORDS", // (6) left ramp - level 1
			"100.000 PEOPLE WATCHING EAGERLY", // left ramp - level 2
			"500.000 VIEWERS GLUED TO THEIR TV", // left ramp - level 3
			"NOW AIRING ON PRIME TIME", // left ramp - level 4
			"CATCH-UP TV GATHERS MILLIONS", // left ramp - level 5
			"FULL SEASON NOW ON DVD AND BLU-RAY - EARNING YOU BIG BUCKS", // left ramp - level 6
			"LICENSED MERCHANDISE INCREASE REVENUE STREAM", // left ramp - hit after left scale is maxed
			"FANS ADVERTISE THE SERIES ON FORUMS - AUDIENCE GROWS", // (13) left ramp - hit without completing targets before

			"CHARACTERS STRANDED ON AN ISLAND AFTER THEIR AIRLINER CRASHES", // (14) right ramp - level 1
			"POLAR BEARS SPOTTED IN THE TROPICAL FOREST", // right ramp - level 2
			"DHARMA RESEARCH STATION FOUND", // right ramp - level 3
			"SMOKE GHOSTS WREAK HAVOC IN SURVIVORS CAMP", // right ramp - level 4
			"PROOF OF ALIEN ACTIVITY LEAVE HEROES PUZZLED", // right ramp - level 5
			"CHARACTERS TRANSPORTED BACK AND FORWARD THROUGH TIME", // right ramp - level 6
			"MULTIPLE TIMELINES SET UP ALTERNATIVE FUTURES", // right ramp - hit after right scale is maxed
			"HEROES STRUGGLE TO SURVIVE IN THE JUNGLE", // (21) right ramp - hit without completing targets before
			
			"ATTEMPTING TO GET A RADIO SIGNAL", // (22) right ramp - hit backwards
			"ONE STEP TOWARDS THE EXIT", // (23) escape run : one ramp hit
			"JACKPOT", // (24) escape run completed
			"WELCOME TO ESCAPE - THE PINBALL SIMULATION                  ADD PLAYERS WITH F1-F4, USE DOWN ARROW TO LAUNCH THE BALL, CONTROL FLIPPERS WITH BOTTOM TWO ROWS OF THE KEYBOARD . HIT SPACE TO GENTLY NUDGE THE TABLE .  PRESS P TO PAUSE .                             WINNERS DON'T USE DRUGS" // (25) intro message
			][this.messageId];
		}
		if (this.messageId) { // scroll message
			this.dotMatrixContext.textAlign="left";
			var leftX = 796 - 8*(this.world.time - this.messageStartTime);
			this.dotMatrixContext.fillText(this.messageText, leftX, 58);
			if (leftX + this.dotMatrixContext.measureText(this.messageText).width < 0) { 
				// text scrolled beyond left border : revert to score
				this.messageId = 0;
			}
			
		} else { // show score
			if (this.game.state == 2) {
				this.dotMatrixContext.textAlign="right";
				switch (this.world.ballLostAnimationStep) {
					case 1 :
					case 2 :
						this.dotMatrixContext.fillText(this.world.bonusShown, 796, 58);
						this.dotMatrixContext.textAlign="left";
						this.dotMatrixContext.fillText("BONUS "+(this.world.bonusMultiplierShown>1 ? "x"+this.world.bonusMultiplierShown : ""), 0, 58);
						break;
					case 3 :
					case 4 :
					case 5 :
						this.dotMatrixContext.fillText(this.world.bonusShown, 396, 58);
						this.dotMatrixContext.fillText(this.world.score, 796, 58);
						break;
				}
			} else {
				if (this.game.state == 0 && this.world.score > 0 && (this.world.time%100)<50) {
					// game over : alternate score and message
					this.dotMatrixContext.textAlign="center";
					this.dotMatrixContext.fillText("GAME OVER", 400, 58);
				} else if (this.game.state == 1 && this.world.pause) { // game paused
					this.dotMatrixContext.textAlign="center";
					this.dotMatrixContext.fillText("GAME  PAUSED", 400, 58);
				} else if (this.game.state == 1 && this.world.tilted) { // tilt
					this.dotMatrixContext.textAlign="center";
					this.dotMatrixContext.fillText("TILT", 400, 58);
				} else if (this.game.state == 1 && this.world.tiltControl>15) { // tilt
					this.dotMatrixContext.textAlign="center";
					this.dotMatrixContext.fillText("DANGER", 400, 58);
				} else if (this.game.state == 1 && this.world.escapeRunActive) { // escape run
					if ((this.world.time%50)<25) { // blinking
						this.dotMatrixContext.textAlign="left";
						this.dotMatrixContext.fillText("ESCAPE RUN", 4, 58);
					}
					this.dotMatrixContext.textAlign="right";
					var secondsLeft = Math.floor((this.world.escapeRunStartTime + 2000 - this.world.time)/60);
					this.dotMatrixContext.fillText(secondsLeft, 796, 58);
				} else {  // show score
					this.dotMatrixContext.textAlign="right";
					this.dotMatrixContext.fillText(this.world.score, 796, 58);
					this.dotMatrixContext.textAlign="left";
					if (this.game.state == 1) {
						this.dotMatrixContext.save();
						this.dotMatrixContext.scale(1, .5);
						this.dotMatrixContext.fillText("PLAYER "+(this.world.currentPlayer+1), 0, 58);
						this.dotMatrixContext.fillText("BALL "+this.world.currentBall, 0, 118);
						this.dotMatrixContext.restore();
					} else if (this.game.state == 0 && this.world.score > 0) {
						this.dotMatrixContext.fillText("PLAYER "+(this.world.currentPlayer+1), 0, 58);
					}
				}
			}
		}
		this.dotMatrixContext.drawImage(this.spriteSheet, 0, 0, 800, 64, 0, 0, 800, 64);
	},

	
	/**
	 * Entry point, draw both dot matrix (score screen) and table
	 */
	drawMain : function() {
	
		this.drawDotMatrixScreen();		
		this.drawPlayfield();
		
	},

	/**
	 * Toggle the demo (i.e. not playing) mode
	 * Lights are blinking alternatively and specific messages are shown
	 */
	setDemoMode : function() {
		this.bonusLightMask[0] = this.bonusLightMask[2] = this.bonusLightMask[4] = 255;
		this.bonusLightMask[1] = this.bonusLightMask[3] = this.bonusLightMask[5] = 65280;
		this.lostLightMask = [0x055F, 0x0AAF, 0x055F, 0x0AAF];
		this.targetLightMask = [0xFF, 0x1FE, 0x3FC, 0x7F8, 0xFF0, 0x1FE0, 0xFF, 0xFF00, 0xFF, 0xFF00 ];
		this.audienceLightMask = [0xFFF, 0x7FE, 0x3FC, 0x1F8, 0xF0, 0x60];
		this.trapLightMask = [0xFF0F, 0xFE07, 0xFC03, 0xF801, 0xF000, 0x6000];
		this.escapeLightMask  = [0xF0F0, 0x0F0F, 0xF0F0, 0x0F0F, 0xF0F0, 0x0F0F];
		this.arrowLightMask = [0x5A5A, 0x5A5A, 0x5A5A];
		this.messageId = 0;
		this.messageText = "";
		this.messageStartTime = 0;
	},
	
	/**
	 * Draw one icon / light on the main table
	 * It is displayed as on(lit) or off depending of the mask and time (8 programmable steps in the mask)
	 * @param sx source column in the sprite sheet, 0 to 11
	 * @param sy source row in the sprite sheet
	 * @param time current time as used by light timing
	 * @param mask 16-bit mask for light timing. 0 for off, 0xFFFF for on, 0x5555 for shimmering, 255 for blinking
	 * @param dx destination pixel X (center)
	 * @param dy destination pixel Y (center)
	 */
	drawLight : function(sx, sy, time, mask, dx, dy) {
		var lit = (1<<(time&15))&mask;
		this.sceneryContext.drawImage(this.spriteSheet, sx*64+(lit?384:0), sy*80+64, 64, 80, dx-32, dy-40, 64, 80);
	},
	
	
	/**
	 * Draw the ball
	 * Private method called by drawPlayfield(), order depends on whether the ball is on a ramp or not
	 */
	drawBall : function() {
		this.sceneryContext.drawImage(this.spriteSheet, 0, 704, 37, 37, this.world.ballX-18, this.world.ballY-18, 37, 37);
	},
	
	/**
	 * Draw walls, flippers .. anything defined with the same structure used for collisions
	 * fillStyle must be defined before calling drawSolidSurface()
	 */
	drawSolidSurface : function(surface) {
		for (var i=0; i<surface.length; ++i) {
			var wall=surface[i];
			switch (wall[0]) {
				case 0:
				case 4:
					if (first) {
						this.sceneryContext.moveTo(wall[1], wall[2]);
					}
					this.sceneryContext.lineTo(wall[3], wall[4]);
					first = false;
					break;
				case 1:
					this.sceneryContext.arc(...wall.slice(1,6));
					break;
				case 2:
					this.sceneryContext.arc(wall[1], wall[2], wall[3], wall[5], wall[4], -1);
					break;
				case 8 :
					this.sceneryContext.beginPath();	
					first = true;
					break;
				case 9:
					this.sceneryContext.fill();
					break;
			}
		}
	},
	
	/**
	 * Draw the main table
	 * Private method called by drawMain()
	 */
	drawPlayfield : function() {
		var topLine = 0;
		var hiddenHeight = this.sceneryCanvas.height - window.innerHeight + 68;
		if (this.game.state == 0) { // demo mode
			var relativeTime = (4*this.world.time) % (2*hiddenHeight);
			topLine = (relativeTime > hiddenHeight ? 2*hiddenHeight - relativeTime : relativeTime)-68;
		} else {
			//topLine = Math.min(Math.max(0, this.world.ballY-50), hiddenHeight) - 68;
			topLine = this.world.jolt+hiddenHeight/2*(1+Math.sin((Math.max(200, Math.min(1200, this.world.ballY))-700)/500*Math.PI/2)) - 68;
		}
		this.sceneryCanvas.style.top = -topLine+"px";
		this.sceneryContext.fillStyle = "#003";
		this.sceneryContext.fillRect(0, 0, this.sceneryCanvas.width, this.sceneryCanvas.height);
		
		if (this.game.state == 1) {
			// set lights to match game state
			this.bonusLightMask[0] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 1 ? 0xFFFF : 0);
			this.bonusLightMask[1] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 2 ? 0xFFFF : 0);
			this.bonusLightMask[2] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 3 ? 0xFFFF : 0);
			this.bonusLightMask[3] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 4 ? 0xFFFF : 0);
			this.bonusLightMask[4] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 5 ? 0xFFFF : 0);
			this.bonusLightMask[5] = this.world.tilted ? 0 : (this.world.bonusMultiplier > 6 ? 0xFFFF : 0);
			
			this.lostLightMask[0] = this.world.tilted ? 0 : (this.world.lostLightsLit & 1 ? 0xFFFF : 0);
			this.lostLightMask[1] = this.world.tilted ? 0 : (this.world.lostLightsLit & 2 ? 0xFFFF : 0);
			this.lostLightMask[2] = this.world.tilted ? 0 : (this.world.lostLightsLit & 4 ? 0xFFFF : 0);
			this.lostLightMask[3] = this.world.tilted ? 0 : (this.world.lostLightsLit & 8 ? 0xFFFF : 0);

			this.targetLightMask[0] = this.world.tilted ? 0 : (this.world.targetsHit & 1 ? 0xFFFF : 0);
			this.targetLightMask[1] = this.world.tilted ? 0 : (this.world.targetsHit & 2 ? 0xFFFF : 0);
			this.targetLightMask[2] = this.world.tilted ? 0 : (this.world.targetsHit & 4 ? 0xFFFF : 0);
			this.targetLightMask[3] = this.world.tilted ? 0 : (this.world.targetsHit & 8 ? 0xFFFF : 0);
			this.targetLightMask[4] = this.world.tilted ? 0 : (this.world.targetsHit & 16 ? 0xFFFF : 0);
			this.targetLightMask[5] = this.world.tilted ? 0 : (this.world.targetsHit & 32 ? 0xFFFF : 0);
			this.targetLightMask[6] = this.world.tilted ? 0 : (this.world.targetsHit & 64 ? 0xFFFF : 0);
			this.targetLightMask[7] = this.world.tilted ? 0 : (this.world.targetsHit & 128 ? 0xFFFF : 0);
			this.targetLightMask[8] = this.world.tilted ? 0 : (this.world.targetsHit & 256 ? 0xFFFF : 0);
			this.targetLightMask[9] = this.world.tilted ? 0 : (this.world.targetsHit & 512 ? 0xFFFF : 0);

			this.audienceLightMask[0] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>0 ? 0xFFFF : (this.world.audienceLevelOpen>0 ? 0xFF : 0));
			this.audienceLightMask[1] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>1 ? 0xFFFF : (this.world.audienceLevelOpen>1 ? 0xFF : 0));
			this.audienceLightMask[2] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>2 ? 0xFFFF : (this.world.audienceLevelOpen>2 ? 0xFF : 0));
			this.audienceLightMask[3] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>3 ? 0xFFFF : (this.world.audienceLevelOpen>3 ? 0xFF : 0));
			this.audienceLightMask[4] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>4 ? 0xFFFF : (this.world.audienceLevelOpen>4 ? 0xFF : 0));
			this.audienceLightMask[5] = this.world.tilted ? 0 : (this.world.audienceLevelAcquired>5 ? 0xFFFF : (this.world.audienceLevelOpen>5 ? 0xFF : 0));

			this.trapLightMask[0] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>0 ? 0xFFFF : (this.world.trapLevelOpen>0 ? 0xFF : 0));
			this.trapLightMask[1] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>1 ? 0xFFFF : (this.world.trapLevelOpen>1 ? 0xFF : 0));
			this.trapLightMask[2] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>2 ? 0xFFFF : (this.world.trapLevelOpen>2 ? 0xFF : 0));
			this.trapLightMask[3] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>3 ? 0xFFFF : (this.world.trapLevelOpen>3 ? 0xFF : 0));
			this.trapLightMask[4] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>4 ? 0xFFFF : (this.world.trapLevelOpen>4 ? 0xFF : 0));
			this.trapLightMask[5] = this.world.tilted ? 0 : (this.world.trapLevelAcquired>5 ? 0xFFFF : (this.world.trapLevelOpen>5 ? 0xFF : 0));

			this.escapeLightMask[0] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 0 ? 0xFFFF : 0));
			this.escapeLightMask[1] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 1 ? 0xFFFF : 0));
			this.escapeLightMask[2] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 2 ? 0xFFFF : 0));
			this.escapeLightMask[3] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 3 ? 0xFFFF : 0));
			this.escapeLightMask[4] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 4 ? 0xFFFF : 0));
			this.escapeLightMask[5] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.escapeLightsLit > 5 ? 0xFFFF : 0));
			
			this.arrowLightMask[0] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.audienceLevelOpen > this.world.audienceLevelAcquired ? 0xFF : 0));
			this.arrowLightMask[1] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : (this.world.trapLevelOpen > this.world.trapLevelAcquired ? 0xFF : 0));
			this.arrowLightMask[2] = this.world.tilted ? 0 : (this.world.escapeRunActive ? 0xAAAA : 0);
		}

		// shadow
		this.sceneryContext.fillStyle="#00001f";
		this.sceneryContext.translate(5, 10);
		this.drawSolidSurface(this.world.walls);
		
		// bumper shadow
		for (var i=0; i<this.world.bumpers.length; ++i) {
			this.sceneryContext.beginPath();
			this.sceneryContext.arc(this.world.bumpers[i][0], this.world.bumpers[i][1], 40, 0, 2*Math.PI);
			this.sceneryContext.fill();
		}
		this.sceneryContext.translate(-5, -10);
		
		this.sceneryContext.fillStyle="#2af";	
		this.drawSolidSurface(this.world.walls);
		

		
		var time = this.world.time >> 1;
		this.drawLight(0, 0, time, this.bonusLightMask[0], 105, 1150);
		this.drawLight(1, 0, time, this.bonusLightMask[1], 150, 1180);
		this.drawLight(2, 0, time, this.bonusLightMask[2], 195, 1210);
		this.drawLight(3, 0, time, this.bonusLightMask[3], 553, 1210);
		this.drawLight(4, 0, time, this.bonusLightMask[4], 598, 1180);
		this.drawLight(5, 0, time, this.bonusLightMask[5], 643, 1150);
		this.drawLight(0, 1, time, this.lostLightMask[0], this.world.rollovers[0][0], this.world.rollovers[0][1]+50);
		this.drawLight(1, 1, time, this.lostLightMask[1], this.world.rollovers[1][0], this.world.rollovers[1][1]+50);
		this.drawLight(2, 1, time, this.lostLightMask[2], this.world.rollovers[2][0], this.world.rollovers[2][1]+50);
		this.drawLight(3, 1, time, this.lostLightMask[3], this.world.rollovers[3][0], this.world.rollovers[3][1]+50);
		this.drawLight(0, 2, time, this.targetLightMask[0], 187, 393);
		this.drawLight(1, 2, time, this.targetLightMask[1], 211, 435);
		this.drawLight(2, 2, time, this.targetLightMask[2], 235, 477);
		this.drawLight(3, 2, time, this.targetLightMask[3], 428, 568);
		this.drawLight(4, 2, time, this.targetLightMask[4], 470, 544);
		this.drawLight(5, 2, time, this.targetLightMask[5], 512, 520);
		this.drawLight(0, 3, time, this.targetLightMask[6], 60, 729);
		this.drawLight(1, 3, time, this.targetLightMask[7], 84, 687);
		this.drawLight(2, 3, time, this.targetLightMask[8], 108, 645);
		this.drawLight(3, 3, time, this.targetLightMask[9], 132, 603);
		this.drawLight(0, 4, time, this.audienceLightMask[0], 270, 750);
		this.drawLight(1, 4, time, this.audienceLightMask[1], 246, 698);
		this.drawLight(2, 4, time, this.audienceLightMask[2], 222, 646);
		this.drawLight(3, 4, time, this.audienceLightMask[3], 198, 594);
		this.drawLight(4, 4, time, this.audienceLightMask[4], 174, 542);
		this.drawLight(5, 4, time, this.audienceLightMask[5], 150, 490);
		this.drawLight(0, 5, time, this.trapLightMask[0], 530, 930);
		this.drawLight(1, 5, time, this.trapLightMask[1], 554, 878);
		this.drawLight(2, 5, time, this.trapLightMask[2], 578, 826);
		this.drawLight(3, 5, time, this.trapLightMask[3], 602, 774);
		this.drawLight(4, 5, time, this.trapLightMask[4], 626, 722);
		this.drawLight(5, 5, time, this.trapLightMask[5], 650, 670);
		this.drawLight(0, 6, time, this.escapeLightMask[0], 275, 1000);
		this.drawLight(1, 6, time, this.escapeLightMask[1], 315, 1030);
		this.drawLight(2, 6, time, this.escapeLightMask[2], 355, 1000);
		this.drawLight(3, 6, time, this.escapeLightMask[3], 395, 1030);
		this.drawLight(4, 6, time, this.escapeLightMask[4], 435, 1000);
		this.drawLight(5, 6, time, this.escapeLightMask[5], 475, 1030);
		this.drawLight(this.world.escapeRunActive?1:0, 7, time, this.arrowLightMask[0], 318, 854);
		this.drawLight(this.world.escapeRunActive?3:2, 7, time, this.arrowLightMask[1], 692, 576);
		this.drawLight(3, 7, time, this.arrowLightMask[2], 562, 456);

				
	
		for (var i=0; i<3; ++i) {
			var targetDown = (this.world.targetsHit & (1<<i));
			this.sceneryContext.drawImage(this.spriteSheet, targetDown?96:64, 704, 32, 48, this.world.targets[i][0], this.world.targets[i][1], 32, 48);
		}
		for (var i=3; i<6; ++i) {
			var targetDown = (this.world.targetsHit & (1<<i));
			this.sceneryContext.drawImage(this.spriteSheet, 128, targetDown?744:704, 48, 32, this.world.targets[i][0], this.world.targets[i][3]-8, 48, 32);
		}
		for (var i=6; i<10; ++i) {
			var targetDown = (this.world.targetsHit & (1<<i));
			this.sceneryContext.drawImage(this.spriteSheet, targetDown?224:192, 704, 32, 48, this.world.targets[i][0]-6, this.world.targets[i][3]-4, 32, 48);
		}
		
		// draw flippers
		this.sceneryContext.strokeStyle = "#00F";
		this.sceneryContext.lineWidth = 2;
		this.sceneryContext.fillStyle="#ddd";
		this.sceneryContext.save();
		this.sceneryContext.translate(240, 720+570);
		this.sceneryContext.rotate(.5 - this.world.leftFlipperUp);
		this.drawSolidSurface(this.world.flipperOutline);
		this.sceneryContext.fill();
		this.sceneryContext.stroke();
		this.sceneryContext.restore();
		
		this.sceneryContext.save();
		this.sceneryContext.translate(510, 720+570);
		this.sceneryContext.rotate(Math.PI - .5 + this.world.rightFlipperUp);
		this.drawSolidSurface(this.world.flipperOutline);
		this.sceneryContext.fill();
		this.sceneryContext.stroke();
		this.sceneryContext.restore();

		// draw rollovers
		for (var i=0; i<this.world.rollovers.length; ++i) {
			this.sceneryContext.drawImage(this.spriteSheet, 352, 624, 6, 29, this.world.rollovers[i][0]-2, this.world.rollovers[i][1]-14, 6, 29);
		}

		
		// if the ball is not on a ramp (i.e. is below the ramp), draw it now
		if (!this.world.activeRamp) {
			this.drawBall();
		}

		// draw bumpers
		for (var i=0; i<this.world.bumpers.length; ++i) {
			this.sceneryContext.drawImage(this.spriteSheet, 256, 624, 80, 80, this.world.bumpers[i][0]-40, this.world.bumpers[i][1]-40, 80, 80);
		}
		
		// draw ramp
		this.sceneryContext.strokeStyle="#CCC";
		this.sceneryContext.lineWidth=3;
		for (var i=0; i<this.world.leftRamp.length; ++i)  {
			var line=this.world.leftRamp[i];
			switch (line[0]) {
				case 0:
				case 4:
					this.sceneryContext.beginPath();
					this.sceneryContext.moveTo(line[1], line[2]);
					this.sceneryContext.lineTo(line[3], line[4]);
					this.sceneryContext.stroke();
					break;
				case 1:
				case 2:
				case 3:
					this.sceneryContext.beginPath();
					this.sceneryContext.arc(...line.slice(1,6));
					this.sceneryContext.stroke();
					break;
			}
		}
					
		
		// draw the ball last if it is on a ramp
		if (this.world.activeRamp) {
			this.drawBall();
		}

		// draw ramp end
		for (var i=0; i<this.world.leftRampEnd.length; ++i)  {
			var line=this.world.leftRampEnd[i];
			this.sceneryContext.beginPath();
			this.sceneryContext.moveTo(line[1], line[2]);
			this.sceneryContext.lineTo(line[3], line[4]);
			this.sceneryContext.stroke();
			
		}

		
	}

		
	

}