/**
 * @constructor
 */
 
function Renderer(sceneryCanvas, overlayCanvas, spriteImg, messageBox, game)
{
	this.game = game;
	this.world = game.world;
	this.sceneryCanvas = sceneryCanvas;
	this.overlayCanvas = overlayCanvas;
	this.sceneryContext = sceneryCanvas.getContext("2d");
	this.overlayContext = overlayCanvas.getContext("2d");
	this.windowLayout = {
		playArea : [],
		controlBar : [],
		hackingMode : 0,
		hackingArea : []
	};
	this.messageBox = messageBox;
	
	this.mainMenuText = ["RESUME", "NEW GAME", "SAVE GAME"];
	this.messages = [ 	"Here we are. Main security is disabled, the doors are on local. Only four stories between you and the diamond. Remember, you only have one hour.",
						"The diamond is here ! But you have a feeling that something isn't right .. maybe you forgot to disable some hidden sensors and all hell will break loose once you grab it.",
						"Oops .. you half expected a wailing siren, but instead the building went dark. The elevators seem to be out as well, you will need another way down.",
						"You escape the tower empty handed, trying to recover your breath from the stress. Looking at the building again, you swear to come back better prepared. After all, there still is some time left.",
						"You lost count of time ... the main security system reactivates, bolting all doors shut and trapping you inside. GAME OVER.",
						"You close the entrance door and prompty vanish into the darkness. Slowly, you start to realize that you made it, the diamond is yours. A new life begins. YOU WIN."
					];
	
	// create a mirrored version of the sprite sheet
	this.spriteSheet = document.createElement("canvas");
	this.spriteSheet.width=480; //spriteImg.width*2;
	this.spriteSheet.height=288; // spriteImg.height+40;
	var bufferContext = this.spriteSheet.getContext('2d');
	
	bufferContext.drawImage(spriteImg, 0, 0);
	
	// draw mirror animation for main character
	bufferContext.scale(1, -1);
	bufferContext.drawImage(spriteImg, 48, 192, 192, 48, 240, -240, 192, 48);
	bufferContext.scale(1, -1);
	
	
	this.resizeWindow(); // define the appropriate pixel zoom for the play area
	
	this.frameCount = 0;
	this.terminalId = 0;
	
	this.keyColors = ["#414","#fea","#46d","#e41","#c5c","#f28"];
}


Renderer.prototype = {
	

	/** 
	 * Handler for global window resize event, also called once at init time
	 * Defines the zoom factor for the canvases and (re)aligns everything
	 * Zoom level is the largest integer so that 320 (game height) times zoom level fits vertically in window
	 */
	resizeWindow : function() {
			
		// Set both canvases to full window size
		this.overlayCanvas.width = this.sceneryCanvas.width = window.innerWidth;
		this.overlayCanvas.height = this.sceneryCanvas.height = window.innerHeight;
		this.overlayCanvas.style.width = this.sceneryCanvas.style.width = window.innerWidth+"px";
		this.overlayCanvas.style.height = this.sceneryCanvas.style.height = window.innerHeight+"px";

		// Determine zoom level. Squares are 24x24, 32x32, 40x40 or 48x48 depending on screen size
		var minSize = Math.min(window.innerWidth, window.innerHeight);
		var blockSize = Math.min(48, Math.max(24, 8*Math.floor(minSize/100)));
		var playAreaHeight = window.innerHeight-blockSize;
		this.windowLayout.playArea = [blockSize, window.innerWidth >> 1, playAreaHeight >> 1];
		this.windowLayout.controlBar = [playAreaHeight];
		
		// place character at center of screen
		this.characterPixelX = this.sceneryCanvas.width >> 1;
		this.characterPixelY = this.windowLayout.controlBar[0] >> 1;

		// define layout of the hacking screen
		var circuitBaseSize = minSize<320?24:(minSize<480?32:40);
		circuitBaseSize = Math.min(circuitBaseSize, 16*Math.floor(playAreaHeight-4*blockSize)/144);
		this.windowLayout.hackingArea = [circuitBaseSize];
		for (var i=0; i<4; ++i) {
			this.windowLayout.hackingArea.push(2*blockSize-circuitBaseSize, 4*blockSize+(2*i+1)*circuitBaseSize);
			this.windowLayout.hackingArea.push(2*blockSize+circuitBaseSize, 4*blockSize+(2*i+2)*circuitBaseSize);
		}
		this.game.layoutChanged(this.windowLayout);
	},
	
	
	/**
	 * Draw text on the text canvas, with shadow
	 * @param text The text to write
	 * @param x X-coordinate of the text, left/center/right depending on the textAlign property of the canvas
	 * @param y Y-coordinate of the text
	 */
	drawShadedText : function(text, x, y)
	{
		this.sceneryContext.shadowOffsetX = -1;
		this.sceneryContext.shadowOffsetY = -1;
		this.sceneryContext.fillText(text, x, y);
		this.sceneryContext.shadowOffsetX = 2;
		this.sceneryContext.shadowOffsetY = 2;
		this.sceneryContext.fillText(text, x, y);
	},

	/**
	 * Draw text on the text canvas, with an outline
	 * @param text The text to write
	 * @param x X-coordinate of the text, left/center/right depending on the textAlign property of the canvas
	 * @param y Y-coordinate of the text
	 * @param size Text size in px
	 */	
	outlineText : function(text,x,y,size) {
		this.overlayContext.font = Math.ceil(size)+"px cursive";
		this.overlayContext.strokeText(text, x, y);
		this.overlayContext.fillText(text, x, y);
	},

	/**
	 * Show the current message - if any - on top of the playing area
	 * @param canShow true if the message may be shown. False to force hide it.
	 */
	drawMessage : function(canShow) {
		if (this.world.currentMessage && canShow) {
			this.messageBox.style.visibility = "visible";
			var textNode = this.messageBox.firstChild;
			textNode.data = this.messages[this.world.currentMessage-1];
		} else {
			this.messageBox.style.visibility = "hidden";
		}
	},

	
	/**
	 * Draw both scenery and overlay canvas 
	 */
	drawMain : function() {
	
		// animated toggle between move and hack modes
		if (this.world.hacking) {
			this.windowLayout.hackingMode = Math.min(this.windowLayout.hackingMode+.02, 1);
		} else {
			this.windowLayout.hackingMode = Math.max(this.windowLayout.hackingMode-.02, 0);
		}

		this.characterPixelX = 2*this.windowLayout.playArea[0]*this.windowLayout.hackingMode + (1-this.windowLayout.hackingMode)*(this.sceneryCanvas.width >> 1);
		this.characterPixelY = 2*this.windowLayout.playArea[0]*this.windowLayout.hackingMode + (1-this.windowLayout.hackingMode)*(this.windowLayout.controlBar[0] >> 1);
		
		this.drawPlayfield();
		
		// Draw hacking view
		if (this.windowLayout.hackingMode > 0) {
			this.drawHackingView();
		} else {
			this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
		}

		// Draw control bar (keys)
		this.drawControlBar();
		
		++this.frameCount;
	},

	
	/**
	 * Draw the main game view on the scenery canvas
	 */
	drawPlayfield : function() {
		var dark = this.world.playerHasDiamond();
		this.sceneryContext.clearRect(0, 0, this.sceneryCanvas.width, this.sceneryCanvas.height);
		
		if (this.world.floorTransition) {
			this.sceneryContext.save();
			var alpha = (this.world.floor < this.world.targetFloor ? this.world.floorTransition/32 : 1-this.world.floorTransition/32);
			this.sceneryContext.translate(this.characterPixelX, this.characterPixelY);
			this.sceneryContext.scale(1-.8*alpha, 1-.8*alpha);
			this.sceneryContext.translate(-this.characterPixelX, -this.characterPixelY);
			this.drawOneFloor(Math.min(this.world.floor, this.world.targetFloor), this.world.elevatorFrom, this.world.elevatorTo, true, false, dark);
			this.sceneryContext.restore();
			this.sceneryContext.save();
			this.sceneryContext.translate(this.characterPixelX, this.characterPixelY);
			this.sceneryContext.scale(7-6*alpha, 7-6*alpha);
			this.sceneryContext.translate(-this.characterPixelX, -this.characterPixelY);
			this.drawOneFloor(Math.max(this.world.floor, this.world.targetFloor), this.world.elevatorFrom, this.world.elevatorTo, true, false, dark);
			this.sceneryContext.restore();
			this.drawOneFloor(this.world.floor, this.world.elevatorFrom, this.world.elevatorTo, false, false, dark);
		} else {
			this.drawOneFloor(this.world.floor, this.world.elevatorFrom, this.world.elevatorTo, false, true, dark);
		}
		
		// Draw character
		this.sceneryContext.save();
		this.sceneryContext.translate(this.characterPixelX, this.characterPixelY);
		this.sceneryContext.rotate(-this.world.orientation);		
		var animStep = (this.world.motionPath.length ? 1+((this.frameCount>>1)&7) : 0);
		this.sceneryContext.drawImage(this.spriteSheet, 48*animStep, 192, 48, 48, -this.windowLayout.playArea[0]/2, -this.windowLayout.playArea[0]/2, this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
		this.sceneryContext.restore();
		this.sceneryContext.strokeStyle = "#00f";
		
		if (this.world.thoughtPuzzled) {
			this.sceneryContext.fillStyle = "#fff";
			this.sceneryContext.fillRect(this.characterPixelX+10, this.characterPixelY-25, 15, 15);
			this.sceneryContext.strokeText("?", this.characterPixelX+15, this.characterPixelY-14);
		}
		
		// Draw movement target
		if (this.world.motionPath.length > 0) {
			var x = this.worldToPixelX(this.world.motionPath[this.world.motionPath.length-2]);
			var y = this.worldToPixelY(this.world.motionPath[this.world.motionPath.length-1]);
			this.sceneryContext.beginPath();
			this.sceneryContext.moveTo(x-(this.windowLayout.playArea[0]/8),y-(this.windowLayout.playArea[0]/8));
			this.sceneryContext.lineTo(x+(this.windowLayout.playArea[0]/8),y+(this.windowLayout.playArea[0]/8));
			this.sceneryContext.moveTo(x+(this.windowLayout.playArea[0]/8),y-(this.windowLayout.playArea[0]/8));
			this.sceneryContext.lineTo(x-(this.windowLayout.playArea[0]/8),y+(this.windowLayout.playArea[0]/8));
			this.sceneryContext.stroke();
		}
		
	
	},

	drawOneFloor : function(floor, room1, room2, exclude, allRooms, dark) {
		var windowMinX = Math.max(0, Math.floor(this.world.posX-this.characterPixelX/this.windowLayout.playArea[0]));
		var windowMaxX = Math.min(16, Math.ceil(this.world.posX+this.characterPixelX/this.windowLayout.playArea[0]));
		var windowMinY = Math.max(0, Math.floor(this.world.posY-(this.windowLayout.controlBar[0]-this.characterPixelY)/this.windowLayout.playArea[0]));
		var windowMaxY = Math.min(16, 1+Math.ceil(this.world.posY+this.characterPixelY/this.windowLayout.playArea[0]));
		
		var deltaWallH = 0;
		if (!allRooms && !exclude && room1>0) {
			// drawing the elevator animation, keep only the room size
			windowMinX = windowMinY = 16;
			windowMaxX = windowMaxY = 0;
			for (var j=0; j<16; ++j) {
				for (var i=0 ; i<16 ; ++i) {
					if (this.world.roomNumber[i+j*this.world.levelWidth+floor*this.world.levelSize] == room1) {
						windowMinX = Math.min(windowMinX, i);
						windowMaxX = Math.max(windowMaxX, i+1);
						windowMinY = Math.min(windowMinY, j);
						windowMaxY = Math.max(windowMaxY, j+1);
					}
				}
			}
			// do not show a wall at the end of stairs
			deltaWallH = (this.world.inStairs ? 1 : 0);
		}
		
		// Draw floor, terminals and objects
		for (var j=windowMinY; j<windowMaxY; ++j) {
			for (var i=windowMinX ; i<windowMaxX ; ++i) {
				var roomNumber = this.world.roomNumber[i+j*this.world.levelWidth+floor*this.world.levelSize];
				if (allRooms || (exclude ^ (roomNumber == room1 || roomNumber == room2))) {
					var type = this.world.ground[i+j*this.world.levelWidth+floor*this.world.levelSize];
					this.sceneryContext.drawImage(this.spriteSheet, (type>127&&type<255?96:(type==64||type==65?48:0)), dark?96:0, 48, 48, this.worldToPixelX(i), this.worldToPixelY(j+1), this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
					if (type>0) {
						if (type<6) {
							// pickable object, key or diamond
							this.sceneryContext.drawImage(this.spriteSheet, type*48-48, 144, 48, 48, this.worldToPixelX(i), this.worldToPixelY(j+1), this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
						} else if (type>2048) {
							// terminal
							var orientation = (type&1536)>>9; 
							this.sceneryContext.drawImage(this.spriteSheet, 48*orientation, 48, 48, 48, this.worldToPixelX(i), this.worldToPixelY(j+1), this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
							if (this.world.highlightedTerminal == (type&511)) {
								this.sceneryContext.strokeStyle = "#fff";
								var x0 = this.worldToPixelX(i+[.55, 0, 0, 0][orientation]);
								var y0 = this.worldToPixelY(j+[1, 1, 1, .45][orientation]);
								var dx = this.windowLayout.playArea[0]*[.45, 1, .45, 1][orientation];
								var dy = this.windowLayout.playArea[0]*[1, .45, 1, .45][orientation];
								this.sceneryContext.strokeRect(x0, y0, dx, dy);
							}
							if (this.world.selectedTerminal == (type&511)) {
								this.sceneryContext.strokeStyle = "#f00";
								var x0 = this.worldToPixelX(i+[.55, 0, 0, 0][orientation]);
								var y0 = this.worldToPixelY(j+[1, 1, 1, .45][orientation]);
								var dx = this.windowLayout.playArea[0]*[.45, 1, .45, 1][orientation];
								var dy = this.windowLayout.playArea[0]*[1, .45, 1, .45][orientation];
								this.sceneryContext.strokeRect(x0, y0, dx, dy);
							}
						}
					}
					// debug : room ID
			/*		
					{
						var x = this.worldToPixelX(i);
						var y = this.worldToPixelY(j);
						if (type >= 2048) {
							this.sceneryContext.fillStyle = "#f00";
							this.sceneryContext.fillText((type&255)+" -> "+this.world.terminals[type&255].door, x+this.windowLayout.playArea[0]/4, y-this.windowLayout.playArea[0]/2);
						} else {
							this.sceneryContext.fillStyle = "#000";
							this.sceneryContext.fillText(roomNumber, x+this.windowLayout.playArea[0]/2, y-this.windowLayout.playArea[0]/2);
						}
					}*/
				}				
			}
		}
		
		
		// draw doors
		
		for (var j=windowMinY+deltaWallH; j<=windowMaxY-deltaWallH; ++j) {
			var y = this.worldToPixelY(j);
			for (var i=windowMinX ; i<windowMaxX ; ++i) {
				var x = this.worldToPixelX(i);

				var wallH = this.world.wallAt(floor,i,j,true);
				if (wallH > 0) {
					// debug : door ID
					/*
					{
						this.sceneryContext.fillStyle = "#00f";
						this.sceneryContext.fillText(wallH, x+this.windowLayout.playArea[0]/2, y);
					}*/
					wallH = this.world.doors[wallH];
				}
				if (wallH) {
					if (wallH > 0) { // door
						var dys = Math.floor(48*wallH/40);
						var dyd = Math.floor(this.windowLayout.playArea[0]*wallH/40);
						this.sceneryContext.drawImage(this.spriteSheet, 216-dys, 24, dys, 8, x, y-4, dyd, 8);
						this.sceneryContext.drawImage(this.spriteSheet, 216, 24, dys, 8, x+this.windowLayout.playArea[0]-dyd, y-4, dyd, 8);
					} else { // wall
						this.sceneryContext.drawImage(this.spriteSheet, 192, 0, 48, 8, x, y-4, this.windowLayout.playArea[0], 8);
					}
				}
			}
		}
				
		for (var j=windowMinY; j<windowMaxY; ++j) {
			var y = this.worldToPixelY(j);
			for (var i=windowMinX ; i<=windowMaxX ; ++i) {
				var x = this.worldToPixelX(i);
				
				var wallV = this.world.wallAt(floor,i,j,false);
				if (wallV > 0) {
					// debug : door ID
					/*
					{
						this.sceneryContext.fillStyle = "#00f";
						this.sceneryContext.fillText(wallV, x, y-this.windowLayout.playArea[0]/2);
					}*/
					wallV = this.world.doors[wallV];
				}
				if (wallV) {
					if (wallV > 0) { // door
						var dys = Math.floor(48*wallV/40);
						var dyd = Math.floor(this.windowLayout.playArea[0]*wallV/40);
						this.sceneryContext.drawImage(this.spriteSheet, 216, 72-dys, 8, dys, x-4, y-this.windowLayout.playArea[0], 8, dyd);
						this.sceneryContext.drawImage(this.spriteSheet, 216, 72, 8, dys, x-4, y-dyd, 8, dyd);
						

					} else { // wall
						this.sceneryContext.drawImage(this.spriteSheet, 192, 48, 8, 48, x-4, y-this.windowLayout.playArea[0], 8, this.windowLayout.playArea[0]);
					}
				}
			}
		}

	},
	
	worldToPixelX : function(x) {
		return this.characterPixelX-this.windowLayout.playArea[0]*(this.world.posX - x);
	},
	
	worldToPixelY : function(y) {
		return this.characterPixelY-this.windowLayout.playArea[0]*(y-this.world.posY);
	},
	
	/**
	 * Draw the view for the hacking mode, when attempting to open a door through a terminal
	 */
	drawHackingView : function() {
		// keep the view in the outside of a circle around the playfield
		this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
		this.overlayContext.save();
		this.overlayContext.beginPath();
		this.overlayContext.rect(0, 0, this.overlayCanvas.width, this.windowLayout.controlBar[0]);
		this.overlayContext.arc(this.characterPixelX, this.characterPixelY, this.characterPixelX, 0, 2*Math.PI, true);
		this.overlayContext.clip();
		this.overlayContext.fillStyle = "#040";
		this.overlayContext.fillRect(0, 0, this.overlayCanvas.width, this.windowLayout.controlBar[0]);
		
		// text
		this.terminalId = this.world.selectedTerminal>0?this.world.selectedTerminal:this.terminalId;
		this.overlayContext.fillStyle = "#2a2";
		this.overlayContext.font = this.windowLayout.playArea[0]+"px Impact,fantasy";
		var message = "DOOR #"+this.world.floor+(this.terminalId<15?"0":"")+(1+this.terminalId).toString(16).toUpperCase();
		this.overlayContext.fillText(message, this.overlayCanvas.width/2, 3*this.windowLayout.playArea[0]);
		
		// circuit : edges / conductive horizontal lines
		var resultChipX = Math.floor(this.overlayCanvas.width-8*this.windowLayout.hackingArea[0]);
		for (var i=0; i<8; ++i) {
			var y = this.windowLayout.hackingArea[2]+i*this.windowLayout.hackingArea[0];
			this.overlayContext.fillRect(resultChipX, y-6, this.overlayCanvas.width-resultChipX, 12);
		}
		
		var x0 = this.windowLayout.hackingArea[3];
		var dx = Math.floor((resultChipX - x0)/this.world.circuitGfxWidth);
		this.overlayContext.fillStyle = "#2a2";
		for (var i=0; i<this.world.circuitGfxEdges.length; ++i) {
			var edge = this.world.circuitGfxEdges[i];
			var xLeft = edge[0] ? x0+dx*edge[0]+this.windowLayout.hackingArea[0]/2 : this.windowLayout.hackingArea[2*i+1];
			var y = this.windowLayout.hackingArea[2]+edge[1]*this.windowLayout.hackingArea[0];
			this.overlayContext.fillRect(xLeft, y-6, dx*edge[2]-(xLeft-x0)-this.windowLayout.hackingArea[0]/2, 12);
		}
		
		// circuit : nodes / conductive oblique lines
		this.overlayContext.lineWidth = 12;
		this.overlayContext.strokeStyle = "#2a2";
		this.overlayContext.fillStyle = "#2a2";
		this.overlayContext.lineCap = "round";
		for (var i=0; i<this.world.circuitGfxNodes.length; ++i) {
			var node = this.world.circuitGfxNodes[i];
			var y = this.windowLayout.hackingArea[2]+node[2]*this.windowLayout.hackingArea[0];
			if (node[0]==7) {	// switch
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, 1);
				this.overlayContext.beginPath();
				this.overlayContext.arc(x0+dx*node[1]-this.windowLayout.hackingArea[0]/2, y+this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0]/4, 0, 7);
				this.overlayContext.arc(x0+dx*node[1]+this.windowLayout.hackingArea[0]/2, y, this.windowLayout.hackingArea[0]/4, 0, 7);
				this.overlayContext.fill();
			}
			if (node[0]==8) {	// divider 2
				this.drawSlantedTrack(x0+dx*node[1], y, .5, .5, 0);
				this.drawSlantedTrack(x0+dx*node[1], y, .5, .5, 1);
			}
			if (node[0]==9) {	// divider 3
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, -.5);
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, .5);
			}
			if (node[0]==10) {	// skew up
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, -.5);
			}
			if (node[0]==11) {	// skew down
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, .5);
			}
			if (node[0]==12) {	// end point or switch
				this.overlayContext.beginPath();
				this.overlayContext.arc(x0+dx*node[1]-this.windowLayout.hackingArea[0]/2, y, this.windowLayout.hackingArea[0]/4, 0, 7);
				this.overlayContext.fill();
			}
		}

		// circuit : edges / values on horizontal lines
		for (var i=0; i<this.world.circuitGfxEdges.length; ++i) {
			this.overlayContext.fillStyle = this.keyColors[this.world.circuitEdgeValues[i]];
			var edge = this.world.circuitGfxEdges[i];
			var xLeft = edge[0] ? x0+dx*edge[0]+this.windowLayout.hackingArea[0]/2 : this.windowLayout.hackingArea[2*i+1];
			var y = this.windowLayout.hackingArea[2]+edge[1]*this.windowLayout.hackingArea[0];
			this.overlayContext.fillRect(xLeft, y-3, dx*edge[2]-(xLeft-x0)-this.windowLayout.hackingArea[0]/2, 6);
		}

		// circuit : nodes / values on oblique lines
		this.overlayContext.lineWidth = 6;
		for (var i=0; i<this.world.circuitGfxNodes.length; ++i) {
			var node = this.world.circuitGfxNodes[i];
			var y = this.windowLayout.hackingArea[2]+node[2]*this.windowLayout.hackingArea[0];
			this.overlayContext.strokeStyle = this.keyColors[this.world.circuitEdgeValues[node[3]]];
			if (node[0]==7) {	// switch
				this.overlayContext.fillStyle = this.keyColors[this.world.circuitEdgeValues[node[4]]];
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, 1);
				this.overlayContext.beginPath();
				this.overlayContext.arc(x0+dx*node[1]-this.windowLayout.hackingArea[0]/2, y+this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0]/6, 0, 7);
				this.overlayContext.arc(x0+dx*node[1]+this.windowLayout.hackingArea[0]/2, y, this.windowLayout.hackingArea[0]/6, 0, 7);
				this.overlayContext.fill();
				this.overlayContext.strokeStyle = "#ccc";
				this.overlayContext.lineWidth = 4;
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 1, 0);
				this.overlayContext.lineWidth = 6;
			}
			if (node[0]==8) {	// divider 2
				this.drawSlantedTrack(x0+dx*node[1], y, .5, .5, 0);
				this.drawSlantedTrack(x0+dx*node[1], y, .5, .5, 1);
			}
			if (node[0]==9) {	// divider 3
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, -.5);
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, .5);
			}
			if (node[0]==10) {	// skew up
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, -.5);
			}
			if (node[0]==11) {	// skew down
				this.drawSlantedTrack(x0+dx*node[1], y, .5, 0, .5);
			}
			if (node[0]==12) {	// end point
				this.overlayContext.fillStyle = this.keyColors[this.world.circuitEdgeValues[node[3]]];
				this.overlayContext.beginPath();
				this.overlayContext.arc(x0+dx*node[1]-this.windowLayout.hackingArea[0]/2, y, this.windowLayout.hackingArea[0]/6, 0, 7);
				this.overlayContext.fill();
			}
		}

		
		// circuit chips
		for (var i=0; i<this.world.circuitGfxNodes.length; ++i) {
			var node = this.world.circuitGfxNodes[i];
			var y = this.windowLayout.hackingArea[2]+node[2]*this.windowLayout.hackingArea[0];
			if (node[0]>0 && node[0]<5) { // NOT door
				this.drawChip(x0+dx*node[1], y, .5*this.windowLayout.hackingArea[0], 1, node[0]);
			}
			if ((node[0]>=5 && node[0]<=6) || node[0]==13) {	// AND2, OR2, decrease
				this.drawChip(x0+dx*node[1], y, .5*this.windowLayout.hackingArea[0], 2, node[0]);
			}
		}
		
		
		// entry points
		for (var i=0; i<8; ++i) {
			
			this.overlayContext.fillStyle = (this.world.circuitInputs[i] == -1 ?"#fff" : this.keyColors[this.world.keysAcquired[this.world.circuitInputs[i]]]);
			this.overlayContext.beginPath();
			this.overlayContext.arc(this.windowLayout.hackingArea[2*i+1], this.windowLayout.hackingArea[2*i+2], this.windowLayout.hackingArea[0]/2, 0, 7);
			this.overlayContext.fill();
			
			if (i==this.world.controls.dropTargetBelowMouse) {
				this.overlayContext.lineWidth = 2;
				this.overlayContext.strokeStyle = (this.world.selectedKey == -1 ?"#fff" : this.keyColors[this.world.keysAcquired[this.world.selectedKey]]);
				this.overlayContext.beginPath();
				this.overlayContext.arc(this.windowLayout.hackingArea[2*i+1], this.windowLayout.hackingArea[2*i+2], this.windowLayout.hackingArea[0]/2-2, 0, 7);
				this.overlayContext.stroke();
			}
		}
		
		// registry output
		this.overlayContext.fillStyle = this.keyColors[this.world.doorOpen?1:0];
		for (var i=0; i<8; ++i) {
			var y = this.windowLayout.hackingArea[2]+i*this.windowLayout.hackingArea[0];
			this.overlayContext.fillRect(resultChipX, y-3, this.overlayCanvas.width-resultChipX, 6);
		}
		
		// door internal memory registry
		this.drawChip(resultChipX, this.windowLayout.hackingArea[2], 1.5*this.windowLayout.hackingArea[0], 8, 8);
		
		this.drawRegistry(this.world.currentRegistry, resultChipX-.5*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]+.5*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0]*.75);
		
		// GlitchMaker
		this.overlayContext.fillStyle = "#028";
		this.overlayContext.fillRect(this.overlayCanvas.width-4*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]-3*this.windowLayout.hackingArea[0], 4*this.windowLayout.hackingArea[0], 11*this.windowLayout.hackingArea[0]);
		this.overlayContext.fillStyle = "#001";
		this.overlayContext.fillRect(this.overlayCanvas.width-3.8*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]-2*this.windowLayout.hackingArea[0], 3.9*this.windowLayout.hackingArea[0], 9.8*this.windowLayout.hackingArea[0]);
		this.overlayContext.font=(this.windowLayout.hackingArea[0]>>1)+"px cursive";
		this.overlayContext.textAlign = "left";
		this.overlayContext.fillText(" GlitchMaker 3000", this.overlayCanvas.width-4*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]-2.5*this.windowLayout.hackingArea[0]);
		this.overlayContext.textAlign = "center";
		this.overlayContext.fillStyle = "#08f";
		this.overlayContext.fillText(this.world.doorOpen?"ACCESS":"MATCH TO", this.overlayCanvas.width-1.5*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]-this.windowLayout.hackingArea[0]);
		this.overlayContext.fillText(this.world.doorOpen?"GRANTED":"OPEN", this.overlayCanvas.width-1.5*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]-this.windowLayout.hackingArea[0]/2);
		
		this.drawRegistry(this.world.targetRegistry, this.overlayCanvas.width-2*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[2]+.5*this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0], this.windowLayout.hackingArea[0]*.75);
		
		this.overlayContext.restore();
	},
	
	/**
	 * Draw one chip : dark box, pins, and symbol
	 */
	drawChip (x, y, halfWidth, height, type) {
		this.overlayContext.fillStyle = "#111";
		this.overlayContext.fillRect(x-halfWidth, y-.5*this.windowLayout.hackingArea[0], 2*halfWidth, height*this.windowLayout.hackingArea[0]);		
		if (type<7 || type==13) {
			var index = (type<5 ? 0 : (type==6 ? 1 : (type==5 ? 2 : 3)));
			this.overlayContext.drawImage(this.spriteSheet, index*48,240, 48, 48, x-halfWidth, y+(height-1)*this.windowLayout.hackingArea[0]/2-halfWidth, 2*halfWidth, 2*halfWidth);
			if (type<5) {	// NOT door : show which color
				this.overlayContext.fillStyle = this.keyColors[type];
				this.overlayContext.fillRect(x, y-.5*this.windowLayout.hackingArea[0]+2, halfWidth-2, 3);		
			}
 		}
		// pins
		for (var i=0; i<height; ++i) {
			this.overlayContext.drawImage(this.spriteSheet, 192, 240, 5, 16, x-halfWidth-4, y+i*this.windowLayout.hackingArea[0]-8, 5, 16);
			if (type<5 ||type >6) {
				this.overlayContext.drawImage(this.spriteSheet, 198, 240, 5, 16, x+halfWidth-1, y+i*this.windowLayout.hackingArea[0]-8, 5, 16);
			}
		}
		if (type==5 ||type==6) {
			this.overlayContext.drawImage(this.spriteSheet, 198, 240, 5, 16, x+halfWidth-1, y+this.windowLayout.hackingArea[0]/2-8, 5, 16);
		}
	},
	
	/**
	 * Draw one slanted piece of track
	 */
	drawSlantedTrack (x, y, halfWidth, dY0, dY1) {
		this.overlayContext.beginPath();
		this.overlayContext.moveTo(x-halfWidth*this.windowLayout.hackingArea[0], y+dY0*this.windowLayout.hackingArea[0]);
		this.overlayContext.lineTo(x+halfWidth*this.windowLayout.hackingArea[0], y+dY1*this.windowLayout.hackingArea[0]);
		this.overlayContext.stroke();
	},
	
	/**
	 * Draw the registry values on a chip
	 */
	drawRegistry : function(registry, x, y, sizeX, sizeY) {
		this.overlayContext.strokeStyle = "#000";
		this.overlayContext.lineWidth = 2;
		for (var i=0; i<8; ++i) {
			this.overlayContext.fillStyle = this.keyColors[registry[i]];
			this.overlayContext.fillRect(x, y+i*sizeY, sizeX, sizeY);
			this.overlayContext.strokeRect(x, y+i*sizeY, sizeX, sizeY);
		}
	},
	
	/**
	 * Draw the keys obtained by the player
	 */
	drawControlBar : function() {
		this.sceneryContext.fillStyle = "#122";
		this.sceneryContext.fillRect(0, this.windowLayout.controlBar[0], this.sceneryCanvas.width, this.windowLayout.playArea[0]);
		for (var keyIndex = 0 ; keyIndex < this.world.keysAcquired.length; ++keyIndex) {
			if (this.world.selectedKey == keyIndex) {
				this.sceneryContext.strokeStyle = "#fff";
				this.sceneryContext.beginPath();
				this.sceneryContext.arc((keyIndex+.5)*this.windowLayout.playArea[0], this.windowLayout.controlBar[0]+this.windowLayout.playArea[0]/2, this.windowLayout.playArea[0]*.45, 0, 7); 
				this.sceneryContext.stroke();
			}
				
			var key = this.world.keysAcquired[keyIndex];
			this.sceneryContext.strokeStyle = this.keyColors[key];
			var x = keyIndex*this.windowLayout.playArea[0];
			var y = this.windowLayout.controlBar[0];
			if (key<5) {
				// draw a circle around keys, not around the diamond
				if (this.world.hacking && !this.world.keysAvailable[keyIndex]) {
					this.sceneryContext.setLineDash([5]);
				} 
				this.sceneryContext.beginPath();
				this.sceneryContext.arc(x+this.windowLayout.playArea[0]/2, y+this.windowLayout.playArea[0]/2, this.windowLayout.playArea[0]*.4, 0, 7); 
				this.sceneryContext.stroke();
				this.sceneryContext.setLineDash([]);
			}
			if (this.world.selectedKey == keyIndex && this.world.dragging) {
				x = this.world.controls.mouseX-this.windowLayout.playArea[0]/2;
				y = this.world.controls.mouseY-this.windowLayout.playArea[0]/2;
				this.overlayContext.drawImage(this.spriteSheet, key*48-48, 144, 48, 48, x, y, this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
			} else if (!this.world.hacking || this.world.keysAvailable[keyIndex]){
				this.sceneryContext.drawImage(this.spriteSheet, key*48-48, 144, 48, 48, x, y, this.windowLayout.playArea[0], this.windowLayout.playArea[0]);
			}
			
		}
		
		// time
		this.overlayContext.textAlign = "center";
		this.overlayContext.fillStyle = "#f00";
		this.overlayContext.strokeStyle = "#811";
		var seconds = Math.floor((this.world.timer/25)%60);
		var minutes = Math.floor(this.world.timer/1500);
		var textMsg = (minutes<10?"0":"")+minutes+":"+(seconds<10?"0":"")+seconds;
		this.outlineText(textMsg, this.overlayCanvas.width-this.windowLayout.playArea[0]*2, this.windowLayout.controlBar[0]+this.windowLayout.playArea[0]*.65, this.windowLayout.playArea[0]/2);
		
		// floor
		this.overlayContext.fillStyle = "#ccc";
		this.overlayContext.strokeStyle = "#766";
		var floorNames = ["Ground", "1st", "2nd", "3rd", "4th", "Tutorial"];
		var floorMsg = floorNames[this.world.floor];
		if (this.world.targetFloor != this.world.floor) {
			floorMsg += " -> "+ floorNames[this.world.targetFloor];
		}
		this.outlineText(floorMsg, this.sceneryCanvas.width-this.windowLayout.playArea[0]*5, this.windowLayout.controlBar[0]+this.windowLayout.playArea[0]*.4, this.windowLayout.playArea[0]/2);
		this.outlineText("FLOOR", this.sceneryCanvas.width-this.windowLayout.playArea[0]*5, this.windowLayout.controlBar[0]+this.windowLayout.playArea[0]*.9, this.windowLayout.playArea[0]/2);
		
		
	},
	
	/**
	 * Display title and main menu
	 */
	/**
	 * Draw the main menu options
	 * @param menu the active menu
	 */
	drawMainMenu : function(menu) {
		
		this.overlayContext.save();
		var highlightColor = "#fff";
		if ((this.frameCount%3)==0 && ((Math.floor(this.frameCount/50)&1)==0)) {
			highlightColor = "#f77";
		}
		var gray = Math.round(50+50*Math.cos(this.frameCount/20));
			
		this.overlayContext.lineWidth = 6;
		this.overlayContext.textAlign="center";
		for (var index=0; index<3; ++index) {
			this.overlayContext.fillStyle=(menu.selectedLine==index?highlightColor : (index<menu.minLine ? "#888" : "#aaa"));
			this.overlayContext.strokeStyle="hsl(0,0%,"+(menu.selectedLine==index?gray:(index<menu.minLine ? 50 : 0))+"%)";			
			var text=this.mainMenuText[index];
			/*
			text+=(index==3?(menu.soundManager.audioTagSupport?(menu.soundManager.persistentData.data.musicOn?"ON":"OFF"):"not supported"):"");
			text+=(index==4?(menu.soundManager.webAudioSupport?(menu.soundManager.persistentData.data.soundOn?"ON":"OFF"):"not supported"):"");
			*/
			this.outlineText(text, this.overlayCanvas.width/2, this.overlayCanvas.height*(.35+.1*index), this.overlayCanvas.height*.06);
		}
		this.overlayContext.restore();
		
	}

	

}