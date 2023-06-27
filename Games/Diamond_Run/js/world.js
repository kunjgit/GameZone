/**
 * Ingame world, which contains :
 * - a playfield : background to walk on and alter, and for collision detection

 * @constructor
 */
function World(controls)
{
	this.controls = controls;
	this.loader = new LevelLoader();
	
	this.selectedKey = -1;
		
	this.dragStartMouseX = 0;
	this.dragStartMouseY = 0;
	this.dragging = false;
	this.thoughtPuzzled = false;
	
	this.posX = 1;
	this.posY = 9;
	this.floor = 0;
	this.targetFloor = 0;
	this.motionPath = [];
	this.orientation = 0;
	this.keysAcquired = [1];
	this.selectedKey = -1;
	this.highlightedTerminal = -1;
	this.selectedTerminal = -1;
	this.hacking = false;
	this.currentMessage = 0;
	
	this.timer = 90000;
	this.elevatorFrom = 0;
	this.elevatorTo = 0;
	this.wallsH = [];	 // -1 wall, 0 empty, 1+ door
	this.wallsV = [];
	this.ground = [];
	this.doors = [0];	// doors status. [ 0 = open ... 20 = closed ]
	this.terminals = [];	// terminals and door panels
	this.levelWidth = 17;
	this.levelHeight = 17;
	this.levelSize = this.levelWidth * this.levelHeight;
	this.floorTransition = 0;
	this.loadLevel();
	this.doorsMoving = []; // blocks of 3 : door id, direction, target (0 to open, 20 to close)
	this.gameInProgress = false;
	
	this.saveGameListeners = [];
}


World.prototype = {

	/**
	 * Fill the level information : walls, door data
	 */
	loadLevel : function() {	
		var size = 6 * this.levelSize;
		this.ground = new Array(size).fill(0);
		this.roomNumber = new Array(size).fill(0);
		this.wallsH = new Array(size).fill(0);
		this.wallsV = new Array(size).fill(0);
		this.loader.loadLevel(6, this.levelWidth, this.levelHeight, this.ground, this.wallsH, this.wallsV, this.roomNumber, this.terminals);
		this.roomCount = this.loader.roomCount;
		this.elevatorDoors = this.loader.elevatorDoors
		this.passageways = this.loader.passageways;
		this.doors = new Array (this.loader.doorCount);
		this.inElevator = false;
		this.inStairs = false;
		this.visitedDiamondRoom = false;
		
	},

	/**
	 * Reinitialize the game progress
	 * Closes all doors, empties key inventory and teleports the player to the entrance
	 */
	startNewGame : function() {
		this.posX = -0.9;
		this.posY = 8.5;
		this.targetFloor = this.floor = 0;
		this.keysAcquired = [1];
		this.motionPath = [];
		this.currentMessage = 1;
		
		this.inElevator = false;
		this.inStairs = false;
		this.visitedDiamondRoom = false;
		this.hacking = false;
		this.timer = 90000; // 1 hour = 25 fps * 60 s * 60 mn
		this.gameInProgress = true;
		this.loader.resetGroundAndDoors(this.doors, this.ground);
		this.computeShortestPaths();
	},
	
	/**
	 * Teleports the player at the entrance of the tutorial level
	 * Well .. no. Not enough room for the tutorial level.
	 */
	startTutorial : function() {
		
	},

	/**
	 * Loads the game progress from a previously saved game
	 */
	loadGame : function(gameProgress) {
		this.posX = gameProgress.posX;
		this.posY = gameProgress.posY;
		this.targetFloor = this.floor = gameProgress.floor;
		this.keysAcquired = gameProgress.keysAcquired.slice();
		this.doors = gameProgress.doors.slice();
		this.ground = gameProgress.ground.slice();
		this.timer = gameProgress.timer;
		this.gameInProgress = true;
		this.inElevator = false;
		this.inStairs = false;
		this.visitedDiamondRoom = (this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize] == 116);
		this.computeShortestPaths();
	},
	
	/**
	 * Getter function for walls
	 * @param floor
	 * @param x
	 * @param y
	 * @param horiz true for horizontal wall, false for vertical
	 * @return -1 for wall, 0 for nothing, doorId (>0) for door
	 */
	wallAt : function (floor, x, y, horiz) {
		var index = x+y*this.levelWidth+floor*this.levelSize;
		return (horiz ? this.wallsH[index] : this.wallsV[index]);
	},
	
	/**
	 * Access a terminal and try to open a door
	 */
	startHacking : function() {
		this.keysAvailable = [];
		for (var i=0; i<this.keysAcquired.length; ++i) {
			this.keysAvailable.push(true);
		}
		this.hacking = true;
		this.controls.acknowledgeMouseClick();	// avoid an immediate exit

		this.currentRegistry = [0, 0, 0, 0, 0, 0, 0, 0];
		this.circuitInputs = [-1, -1, -1, -1, -1, -1, -1, -1]; // -1 for no key, 0+ for key
		
		// hardcoded initial circuit
		this.circuitEdgeValues = [0, 0, 0, 0, 0, 0, 0, 0];
		this.circuitDesc = this.loader.getCircuitDescription(this.selectedTerminal);
		this.targetRegistry = this.loader.getTerminalCode(this.selectedTerminal);
		this.updateCircuitBoard();
		this.computeCircuitBoardGfx();

	},
	
	/**
	 * Performs one step of animation : move critters, check them against traps
	 */
	animateItems : function()
	{
		if (this.timer <= 0) {
			this.currentMessage = 5; // timeout, game over
			for (var i=1; i<this.doors.length; ++i) {
				if (!this.doors[i]) {
					this.doorsMoving.push(i, 1, 20);
				}
			}
		}
		
		if (!this.currentMessage) {
			// Suspend the countdown while a message is being displayed
			--this.timer;
		}
		
		// move the player
		if (this.motionPath.length > 0) {
			var targetX = this.motionPath[0];
			var targetY = this.motionPath[1];
			var dist2 = (targetX - this.posX)*(targetX - this.posX) + (targetY - this.posY)*(targetY - this.posY);
			var step = this.inStairs ? .1 : .2;
			if (step*step > dist2) {
				this.posX = targetX;
				this.posY = targetY;
				this.motionPath.splice(0, 2);
				this.computeShortestPaths();
				if (this.motionPath.length == 0) {
					// move ends
					var itemType = this.ground[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
					if (this.selectedTerminal > -1) {	// arriving near a terminal : start hacking
						this.orientation = Math.PI*((itemType&1536)>>9)/2;
						this.startHacking();
					}
					if (itemType==64 || itemType == 65) {
						if (this.elevatorFrom == 0 && !this.playerHasDiamond()) {
							// enter elevator (without the diamond): close the doors
							this.elevatorFrom = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
							this.elevatorTo = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+(this.floor+(itemType==64?1:-1))*this.levelSize];
							this.doorsMoving.push(this.elevatorDoors[this.elevatorFrom], 1, 20);
							this.doorsMoving.push(this.elevatorDoors[this.elevatorTo], 1, 20);
						}
					}
					if (this.posX<0) {
						// the player exited the building : end the game
						this.currentMessage = (this.playerHasDiamond() ? 6 : 4);
					}
				}
				if (this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize] == 116 && !this.visitedDiamondRoom) {
					// first time in the diamond room : prompt a message
					this.visitedDiamondRoom = true;
					this.currentMessage = 2;
				}
								
			} else {
				this.orientation = Math.atan2(targetY-this.posY, targetX-this.posX);
				this.posX += step*Math.cos(this.orientation);
				this.posY += step*Math.sin(this.orientation);
				
				var itemType = this.ground[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
				if (itemType > 0 && itemType < 63) {
					// grab object
					var insertIndex = 0;
					while (insertIndex<this.keysAcquired.length && itemType>this.keysAcquired[insertIndex]) {
						++insertIndex;
					}
					this.keysAcquired.splice(insertIndex, 0, itemType);
					
					this.ground[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize] = 0;
					if (itemType == 5) {
						// got the diamond ! Inform the player that (s)he now has to run for the exit 
						this.currentMessage = 3;
					}
				} else if (itemType>127 && itemType<192) {
					// stairs
					var direction = (Math.sin(this.orientation)>0 ? 1 : -1);
					
					// force destination at end of stairs
					this.motionPath[this.motionPath.length-1] = direction < 0 ? Math.floor(this.posY) - .5 - itemType + 128 : Math.floor(this.posY) + .5 + 132 - itemType;
					this.targetFloor = this.floor - direction;
					var alpha = 8*(itemType-128+this.posY-Math.floor(this.posY))
					this.floorTransition = Math.floor(direction>0 ? alpha : 32-alpha);
					this.elevatorFrom = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
					this.elevatorTo = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+(this.floor-direction)*this.levelSize];
					this.inStairs = true;
				} else {
					if (this.inStairs) {
						this.floor = this.targetFloor;
						this.floorTransition = 0;
						this.inStairs = false;
						this.elevatorFrom = this.elevatorTo = 0;
					}
					
				}
			}
		}
		
		// move elevators
		if (this.inElevator) {
			++this.floorTransition;
			if (this.floorTransition>=32) {
				// new floor reached : open elevator doors
				this.floor = this.targetFloor;
				this.floorTransition = 0;
				this.doorsMoving.push(this.elevatorDoors[this.elevatorFrom], -1, 0);
				this.doorsMoving.push(this.elevatorDoors[this.elevatorTo], -1, 0);
				this.elevatorFrom = this.elevatorTo = 0;
				this.inElevator = false;
			}
		}
		
		// open and close doors
		for (var i=0; i<this.doorsMoving.length; i+=3) {
			this.doors[this.doorsMoving[i]] += this.doorsMoving[i+1];
			if ( (this.doorsMoving[i+1] > 0 && this.doors[this.doorsMoving[i]] >= this.doorsMoving[i+2])
				|| (this.doorsMoving[i+1] < 0 && this.doors[this.doorsMoving[i]] <= this.doorsMoving[i+2])) {
				// sensor : stop motion when the door is open or closed
				this.doors[this.doorsMoving[i]] = this.doorsMoving[i+2];
				this.doorsMoving.splice(i, 3);
				i-=3;
				if (this.elevatorFrom) {
					// elevator door closed : move up or down
					// possible but unlikely bug, if another door closes first, it triggers the elevator 
					this.floorTransition = 0;
					this.inElevator = true;
					this.targetFloor = this.floor + (this.ground[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize]==64 ? 1 : -1);
				} 
				this.saveGame();
				this.computeShortestPaths(); // opening or closing a door changes the paths
				// TODO : handle the fact that the path we took just closed
			}
		}
	},
	
	
	/**
	 * Take into account user actions (mouse move / click)
	 * Called once each step.
	 */
	processControls : function()
	{
		if (this.controls.mouseLeftButton) {
			if (this.currentMessage) {	
				// modal dialog showing a message, consumes a mouse click
				this.controls.acknowledgeMouseClick();
				if (this.currentMessage == 5 || this.currentMessage == 6) {
					// endgame messages (win and loss)
					this.gameInProgress = false;
					// the Game object will change the state to the main menu
				}
				this.currentMessage = 0;
			}
			else if (this.dragging) {
				// mouse move event while dragging : check if a drop target is below				
				
			} else { // mouse down : first event with button down, or setting motion
				if (this.controls.mouseInPlayArea) {
					if (this.hacking) {
						if (this.controls.mouseInBullsEye) {	
							// click in the circle showing main view : exit hacking mode
							this.hacking = false; // for now, leave the hacking mode
							this.selectedTerminal = -1;
							this.controls.acknowledgeMouseClick();
						} else {
							if (this.controls.dropTargetBelowMouse > -1) {
								this.selectedKey = this.circuitInputs[this.controls.dropTargetBelowMouse];
								this.circuitInputs[this.controls.dropTargetBelowMouse] = -1;
								this.dragging = true;
							}
						}
					} else if (!this.inStairs) {
						 // define a new target. Not allowed in stairs
						var targetX = this.posX + this.controls.worldDX;
						var targetY = this.posY + this.controls.worldDY;
						var itemAtTarget = 0;
						if (targetX >= 0 && targetY >=0 && targetX<16 && targetY<16) {
							itemAtTarget = this.ground[Math.floor(targetX)+Math.floor(targetY)*this.levelWidth+this.floor*this.levelSize];
						}
						if (itemAtTarget&2048) {
							// there is a terminal or lock at target : move in front or the panel
							var orientation = (itemAtTarget&1536)>>9;
							targetX = Math.floor(targetX)+[.25, .5, .75, .5][orientation];
							targetY = Math.floor(targetY)+[.5, .25, .5, .75][orientation];
							this.selectedTerminal = itemAtTarget & 511;
						} else {
							this.selectedTerminal = -1;
							// keep one's distance from the wall
							if (this.wallsV[Math.floor(targetX)+Math.floor(targetY)*this.levelWidth+this.floor*this.levelSize]) {
								targetX = Math.max(targetX, Math.floor(targetX)+.4);
							}
							if (this.wallsV[Math.floor(targetX+1)+Math.floor(targetY)*this.levelWidth+this.floor*this.levelSize]) {
								targetX = Math.min(targetX, Math.floor(targetX)+.6);
							}
							if (this.wallsH[Math.floor(targetX)+Math.floor(targetY)*this.levelWidth+this.floor*this.levelSize]) {
								targetY = Math.max(targetY, Math.floor(targetY)+.4);
							}
							if (this.wallsH[Math.floor(targetX+1)+Math.floor(targetY+1)*this.levelWidth+this.floor*this.levelSize]) {
								targetY = Math.min(targetY, Math.floor(targetY)+.6);
							}
						}
						var currentRoom = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
						var targetRoom = 0;
						if (targetX >= 0 && targetY >=0 && targetX<16 && targetY<16) {
							targetRoom = this.roomNumber[Math.floor(targetX)+Math.floor(targetY)*this.levelWidth+this.floor*this.levelSize];
						}
						var path = this.shortestPaths[targetRoom];
						if (path) {
							this.motionPath = path.slice();
							if (!targetRoom) {
								// recenter any target outside the building to aim in front of the door
								targetX = -.9;
								targetY = 8.5;
							}
							this.motionPath.push(targetX, targetY);
							this.thoughtPuzzled = false;
						} else {
							this.thoughtPuzzled = true;
						}
					}
				} else if (this.controls.keyBelowMouse < this.keysAcquired.length) { 
					// click in control bar : choose key and prepare to drag it
					if (this.hacking && this.keysAvailable[this.controls.keyBelowMouse] && this.keysAcquired[this.controls.keyBelowMouse]<5) {
						this.selectedKey = this.controls.keyBelowMouse;
						this.dragging = true;
					}
				} else {	
					// click beyond inventory = on ground info or timer => trigger main menu
					this.controls.controlEscape = true;
					this.controls.acknowledgeMouseClick();
				}
			}
		} else if (this.dragging) {
			// mouse up event : release drag
			this.dragging = false;
			if (this.hacking) {
				if (this.controls.dropTargetBelowMouse > -1) { // drop the key onto a target
					
					// if there is a key in place, release it
					var formerKey = this.circuitInputs[this.controls.dropTargetBelowMouse];
					if (formerKey > -1) {
						this.keysAvailable[formerKey] = true;
					}
					
					// and put the new key, if any
					this.circuitInputs[this.controls.dropTargetBelowMouse] = this.selectedKey;
					this.keysAvailable[this.selectedKey] = false;
				} else {	// drop the key somewhere .. return it to the inventory (control bar)
					this.keysAvailable[this.selectedKey] = true;
				}
				this.updateCircuitBoard();
			}
			this.selectedKey = -1;
		}
		
		// highlight any terminal below the mouse pointer
		this.highlightedTerminal = -1;
		if (this.controls.mouseInPlayArea) {
			var targetX = Math.floor(this.posX + this.controls.worldDX);
			var targetY = Math.floor(this.posY + this.controls.worldDY);
			var itemAtTarget = this.ground[targetX+targetY*this.levelWidth];
			if (itemAtTarget & 2048) {
				this.highlightedTerminal = itemAtTarget & 511;
			}
		}
	},
	
	/**
	 * Prepare the graph of passageways between rooms
	 * that will later be used to identify the shortest path between current and requested location
	 */
/*	precomputeTopology : function() {
		var squaresInRoom = [0, 0];
		var squaresBeyondRoom = [];
		this.roomNumber = [];
		this.passageways = [];
		for (var j=0; j<this.levelHeight; ++j) {
			for (var i=0; i<this.levelWidth; ++i) {
				this.roomNumber.push(0);
			}
		}
		
		
		// count rooms, assigning the same number to all squares inside the room
		this.roomCount = 1;
		while (squaresInRoom.length>0 || squaresBeyondRoom.length>0) {
			var x = 0 , y = 0;
			if (squaresInRoom.length>0) {
				x = squaresInRoom[0];
				y = squaresInRoom[1];
				squaresInRoom.splice(0,2);
			} else {
				x = squaresBeyondRoom[0];
				y = squaresBeyondRoom[1];
				squaresBeyondRoom.splice(0,2);
				if (!this.roomNumber[x+y*this.levelWidth]) {
					++this.roomCount;
				}
			}
			
			if (!this.roomNumber[x+y*this.levelWidth]) {
				this.roomNumber[x+y*this.levelWidth] = this.roomCount;
				if (x+1 < this.levelWidth) {
					if (this.wallAt(x+1,y,false)) {
						squaresBeyondRoom.push(x+1, y);
					} else {
						squaresInRoom.push(x+1, y);
					}
				}
				if (x > 0) {
					if (this.wallAt(x,y,false)) {
						squaresBeyondRoom.push(x-1, y);
					} else {
						squaresInRoom.push(x-1, y);
					}
				}
				if (y+1 < this.levelHeight) {
					if (this.wallAt(x,y+1,true)) {
						squaresBeyondRoom.push(x, y+1);
					} else {
						squaresInRoom.push(x, y+1);
					}
				}
				if (y > 0) {
					if (this.wallAt(x,y,true)) {
						squaresBeyondRoom.push(x, y-1);
					} else {
						squaresInRoom.push(x, y-1);
					}
				}
			}
		}
		
		// record passageways between two adjacent rooms
		// constraint : only one single door between the two same rooms
		for (var j=0; j<=this.roomCount; ++j) {
			for (var i=0; i<this.roomCount; ++i) {
				this.passageways.push(false);
			}
		}
		
		for (var j=0; j<this.levelHeight; ++j) {
			for (var i=0; i<this.levelWidth; ++i) {
				var doorId = this.wallAt(i, j, false);
				if (doorId>0) {
					var room1 = this.roomNumber[i-1+j*this.levelWidth];
					var room2 = this.roomNumber[i+j*this.levelWidth];
					this.passageways[room1+room2*this.roomCount] = [doorId, i-.5, j+.5, i+.5, j+.5];
					this.passageways[room2+room1*this.roomCount] = [doorId, i+.5, j+.5, i-.5, j+.5];
				}
				doorId =this.wallAt(i, j, true);
				if (doorId>0) {
					var room1 = this.roomNumber[i+(j-1)*this.levelWidth];
					var room2 = this.roomNumber[i+j*this.levelWidth];
					this.passageways[room1+room2*this.roomCount] = [doorId, i+.5, j-.5, i+.5, j+.5];
					this.passageways[room2+room1*this.roomCount] = [doorId, i+.5, j+.5, i+.5, j-.5];
				}
			}
		}
		
	},*/
	
	/**
	 * Compute the shortest paths between the accessible rooms
	 */
	computeShortestPaths : function() {
		this.shortestPaths = [];
		for (var i=0; i<this.roomCount; ++i) {
			this.shortestPaths.push(false);
		}
		//this.roomsCompleted = [];
		var currentRoom = this.roomNumber[Math.floor(this.posX)+Math.floor(this.posY)*this.levelWidth+this.floor*this.levelSize];
		this.shortestPaths[currentRoom] = [];
		this.roomQueue = [ currentRoom ];
		while (this.roomQueue.length) {
			var currentRoom = this.roomQueue.shift();
			for (var nextRoom=0; nextRoom<=this.roomCount; ++nextRoom) {
				var wayOut = this.passageways[currentRoom+nextRoom*this.roomCount];
				if (wayOut) {	// there is a door between the two rooms ...
					if (this.doors[wayOut[0]]<10) {	// .. and that door is open
						if (!this.shortestPaths[nextRoom]) { // never visited
							this.shortestPaths[nextRoom] = this.shortestPaths[currentRoom].slice(); // shallow copy
							this.shortestPaths[nextRoom].push(wayOut[1], wayOut[2], wayOut[3], wayOut[4]);
							this.roomQueue.push(nextRoom);
						} else { // already visited, check if we have a shorter path
							if (this.shortestPaths[nextRoom].length > this.shortestPaths[currentRoom].length + wayOut.length) {
								this.shortestPaths[nextRoom] = this.shortestPaths[currentRoom].slice(); // shallow copy
								this.shortestPaths[nextRoom].push(wayOut[1], wayOut[2], wayOut[3], wayOut[4]);
							}
						}
					}
				}
			}
		}
	},
	
	/**
	 * Hacking mode : update the values of the circuit
	 * call each time the inputs change, or if there is a timing chip involved
	 */
	updateCircuitBoard : function() {
	
		// first edges are directly connected to the inputs
		this.circuitEdgeValues = [];
		for (var i=0; i<8; ++i) {
			var keyIndex = this.circuitInputs[i];
			this.circuitEdgeValues.push(keyIndex>-1 ? this.keysAcquired[keyIndex] : 0);
		}
		
		var outputLine = 0;
		var edgeIndex = 8;
		this.doorOpen = true;
		
		for (var i=0; i<this.circuitDesc.length; ++i) {
			var node = this.circuitDesc[i];
			switch (node[0]) {
				case 0 : // exit node
					this.currentRegistry[outputLine] = this.circuitEdgeValues[node[1]];
					this.doorOpen = this.doorOpen && (this.currentRegistry[outputLine] == this.targetRegistry[outputLine]);
					++outputLine;
					break;
				case 1 : // NOT1 node
				case 2 : // NOT2 node
				case 3 : // NOT3 node
				case 4 : // NOT4 node
					this.circuitEdgeValues.push(this.circuitEdgeValues[node[1]] ? 0 : node[0]);
					++edgeIndex;
					break;
				case 5 : // AND2 node
					this.circuitEdgeValues.push(Math.min(this.circuitEdgeValues[node[1]], this.circuitEdgeValues[node[2]]));
					break;
				case 6 : // OR2 node
					this.circuitEdgeValues.push(Math.max(this.circuitEdgeValues[node[1]], this.circuitEdgeValues[node[2]]));
					break;
				case 7 : // circuit switch
					this.circuitEdgeValues.push(this.circuitEdgeValues[node[2]], this.circuitEdgeValues[node[1]]);
					break;
				case 8 : // circuit divider 2
					this.circuitEdgeValues.push(this.circuitEdgeValues[node[1]], this.circuitEdgeValues[node[1]]);
					break;
				case 9 : // circuit divider 3
					this.circuitEdgeValues.push(this.circuitEdgeValues[node[1]], this.circuitEdgeValues[node[1]], this.circuitEdgeValues[node[1]]);
					break;
				case 10 : // skew up
				case 11 : // skew down
					this.circuitEdgeValues.push(this.circuitEdgeValues[node[1]]);
					break;
				case 13 : // decrease
					this.circuitEdgeValues.push(Math.max(0, this.circuitEdgeValues[node[1]]-1), Math.max(0, this.circuitEdgeValues[node[2]]-1));
					break;
				
				default: // end point (12), shift to next column (50)
			}
		}

		if (this.doorOpen) {
			var controlledDoor = this.terminals[this.selectedTerminal].door;
			if (this.doors[controlledDoor] > 0) {
				this.doorsMoving.push(controlledDoor, -1, 0);
			} else {
				this.doorsMoving.push(controlledDoor, 1, 20);
			}
		}

	},
	
	/**
	 * Prepare the rendering of the circuit
	 */
	computeCircuitBoardGfx : function()
	{
		var outputLine = 0;
		this.circuitGfxWidth = 1;
		this.circuitGfxEdges = [];
		for (var edgeIndex=0; edgeIndex<8; ++edgeIndex) {
			this.circuitGfxEdges.push([0, edgeIndex]);	// x0, y0
		}
		
		this.circuitGfxNodes = [];
		
		for (var i=0; i<this.circuitDesc.length; ++i) {
			var node = this.circuitDesc[i];
			switch (node[0]) {
				case 0 : // exit node, connected to registry
					var edgeId = node[1];
					this.circuitGfxEdges[edgeId].push(999, outputLine++);	// x1, y1
					break;
				case 1 : // NOT1 node
				case 2 : // NOT2 node
				case 3 : // NOT3 node
				case 4 : // NOT4 node
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line]);
					this.circuitGfxNodes.push([node[0], this.circuitGfxWidth, line]);
					break;
				case 5 : // ADD2 node
				case 6 : // OR2 node
					var edgeId1 = node[1];
					var edgeId2 = node[2];
					var line1 = this.circuitGfxEdges[edgeId1][1];
					var line2 = this.circuitGfxEdges[edgeId2][1];	// == 1+line1
					this.circuitGfxEdges[edgeId1].push(this.circuitGfxWidth, line1);
					this.circuitGfxEdges[edgeId2].push(this.circuitGfxWidth, line2);
					this.circuitGfxEdges.push([this.circuitGfxWidth, (line1+line2)/2]);
					this.circuitGfxNodes.push([node[0], this.circuitGfxWidth, line1]);
					break;
				case 7 : // switch node
				case 13 : // decrease node
					var edgeId1 = node[1];
					var edgeId2 = node[2];
					var line1 = this.circuitGfxEdges[edgeId1][1];
					var line2 = this.circuitGfxEdges[edgeId2][1];	// == 1+line1
					this.circuitGfxEdges[edgeId1].push(this.circuitGfxWidth, line1);
					this.circuitGfxEdges[edgeId2].push(this.circuitGfxWidth, line2);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line1]);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line2]);
					this.circuitGfxNodes.push([node[0], this.circuitGfxWidth, line1, edgeId1, edgeId2]);
					break;
				case 8 : // divider2 node
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line-.5]);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line+.5]);
					this.circuitGfxNodes.push([8, this.circuitGfxWidth, line-.5, edgeId]);
					break;
				case 9 : // divider3 node
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line-1]);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line]);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line+1]);
					this.circuitGfxNodes.push([9, this.circuitGfxWidth, line-1, edgeId]);
					break;					
				case 10 : // skew up
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line-.5]);
					this.circuitGfxNodes.push([10, this.circuitGfxWidth, line, edgeId]);
					break;
				case 11 : // skew down
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxEdges.push([this.circuitGfxWidth, line+.5]);
					this.circuitGfxNodes.push([11, this.circuitGfxWidth, line, edgeId]);
					break;
				case 12 : // end point
					var edgeId = node[1];
					var line = this.circuitGfxEdges[edgeId][1];
					this.circuitGfxEdges[edgeId].push(this.circuitGfxWidth, line);
					this.circuitGfxNodes.push([12, this.circuitGfxWidth, line, edgeId]); 
					break;
				case 50 : // shift right to next column
					++this.circuitGfxWidth;
					break;
				default:
			}
		}
		++this.circuitGfxWidth;
		
		for (var edgeIndex=0; edgeIndex<this.circuitGfxEdges.length; ++edgeIndex) {
			this.circuitGfxEdges[edgeIndex][2] = Math.min(this.circuitGfxEdges[edgeIndex][2], this.circuitGfxWidth);
		}
	},
	
	/**
	 * Return true if the player has the diamond in inventory
	 * Used for endgame conditions, and also to deactivate lights / elevators
	 */
	playerHasDiamond : function()
	{
		for (i=0; i<this.keysAcquired.length; ++i) {
			if (this.keysAcquired[i] == 5) {
				return true;
			}
		}
		return false;
	},
	
	/** 
	 * Add a listener to be notified of game save / autosave
	 */
	addSaveGameListener : function(listener) {
		this.saveGameListeners.push(listener);
	},
	
	/**
	 * Saves the game in progress
	 */
	saveGame : function() {
		for (i=0; i<this.saveGameListeners.length; ++i) {
			
			this.saveGameListeners[i].notifySave(this.posX, this.posY, this.floor, this.keysAcquired, this.doors, this.ground, this.timer);
		}
	}
		
}
