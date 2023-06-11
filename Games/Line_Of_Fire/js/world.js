/**
 * Ingame world, contains all game mechanisms
 * along with the information for the game in progress (tank location, beacon condition)
 *
 *
 * @constructor
 * @param controls Instance of the Controls class, used to process player actions
 */
function World(controls)
{
	this.controls = controls;

	this.initialize();
	
	this.playerId = 0;
	this.message = 0;
	this.messageTimer = -500;
		
	this.ground = [];
	this.loadLevel(); // fill this.ground
	
	this.aiPlayers = [ new AIPlayer(1), new AIPlayer(2), new AIPlayer(3) ];
	
	
}


World.prototype = {

	initialize : function() {
		this.playerData = [ {x: 44, y: 0, z: 44, speed:0, dir:   Math.PI/4, aimH:	Math.PI/4, aimY:   Math.PI/4, droneX:0, droneY:0, droneZ:0, droneSX:0, droneSY:0, droneSZ:0, weapons:[20, 0, 0, 0], currentWeapon : 0, beacons:0, reload:0, hp:100},
							{x:212, y: 0, z: 44, speed:0, dir: 3*Math.PI/4, aimH:	Math.PI/4, aimY: 3*Math.PI/4, droneX:0, droneY:0, droneZ:0, droneSX:0, droneSY:0, droneSZ:0, weapons:[20, 0, 0, 0], currentWeapon : 0, beacons:0, reload:0, hp:100},
							{x:212, y: 0, z:212, speed:0, dir:-3*Math.PI/4, aimH:	Math.PI/4, aimY:-3*Math.PI/4, droneX:0, droneY:0, droneZ:0, droneSX:0, droneSY:0, droneSZ:0, weapons:[20, 0, 0, 0], currentWeapon : 0, beacons:0, reload:0, hp:100},
							{x: 44, y: 0, z:212, speed:0, dir:  -Math.PI/4, aimH:	Math.PI/4, aimY:  -Math.PI/4, droneX:0, droneY:0, droneZ:0, droneSX:0, droneSY:0, droneSZ:0, weapons:[20, 0, 0, 0], currentWeapon : 0, beacons:0, reload:0, hp:100} ];

		this.timer = -50;
		this.shells = [];
		this.beacons = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
		this.crates = [];
		this.explosions = [];
		this.useDroneView = false;
		this.gameCondition = -1; // not started yet

	},

	/**
	 * Fill the level information : ground
	 */
	loadLevel : function() {	
	
		this.seed = .1;
		this.ground = [];
		for (var y=0; y<256; ++y) {
			for( var x=0; x<256; ++x) {
				this.ground.push(0);
			}
		}
		
		this.performDiamondSquareStep(0, 0, 256, 30);	
		
		// add barriers on the border
		for (var y=0; y<256; ++y) {
			for( var x=0; x<256; ++x) {
				var distanceToBorder = Math.min(x, y, 256-x, 256-y)+2*Math.sin((x+y)/5)/*+2*Math.sin(2*x-y)*/;
				if (distanceToBorder < 16) {
					this.setLandscapeHeightAt(x, y, Math.max(this.landscapeHeightAt(x,y), 
													10-10*Math.cos((16-distanceToBorder)*Math.PI/10)));
				}
			}
		}
		
		for (var i=0; i<4; ++i) {
			this.playerData[i].y = this.landscapeHeightAt(this.playerData[i].x, this.playerData[i].z);
		}
	
	},

	landscapeHeightAtFloat : function (x,y) {
		var x0 = Math.floor(x), y0 = Math.floor(y);
		var dx = x - x0, dy = y - y0;
		
		var h = (1-dx)*((1-dy)*this.landscapeHeightAt(x0, y0) + dy*this.landscapeHeightAt(x0, y0+1))
				+ dx * ((1-dy)*this.landscapeHeightAt(x0+1, y0) + dy*this.landscapeHeightAt(x0+1, y0+1));
				
		return h;
	},
	
	landscapeHeightAt : function (x,y)
	{
		x= x&255;	// hardcoded for 256
		y= y&255;
		return this.ground[(y<<8)+x];
	},
	
	setLandscapeHeightAt : function(x,y,h) {
		x= x&255;	// hardcoded for 256
		y= y&255;
		this.ground[(y<<8)+x] = h;
	},

	controlledRandom : function()
	{
		this.seed = 3.9*this.seed*(1-this.seed);	// chaotic function
		return this.seed;
	},
	
	/**
	 * Landscape generation : perform one step
	 */
	performDiamondSquareStep : function(x, y, size, scale)
	{
		var zTL = this.landscapeHeightAt(x     , y     );
		var zTR = this.landscapeHeightAt(x+size, y     );
		var zBL = this.landscapeHeightAt(x     , y+size);
		var zBR = this.landscapeHeightAt(x+size, y+size);
		var zT, zL, zR, ZB;
		size = size>>1;
		if ((x+size<33 || x>223) && (y+size<33 || y>223)) { // horizontal starting pads on each corner
			scale = 0.0;
		}
		var zT  = this.landscapeHeightAt(x+size  , y       );
		if (zT==0) {
			this.setLandscapeHeightAt(x+size,y,zT = .5*(zTL+zTR)+scale*(this.controlledRandom()-.5));
		}
		var zL  = this.landscapeHeightAt(x       , y+size  );
		if (zL==0) {
			this.setLandscapeHeightAt(x, y+size, zL=.5*(zTL+zBL)+scale*(this.controlledRandom()-.5));
		}
		var zR  = this.landscapeHeightAt(x+2*size, y+size  );
		if (zR==0) {
			this.setLandscapeHeightAt(x+2*size, y+size, zR=.5*(zTR+zBR)+scale*(this.controlledRandom()-.5));
		}
		var zB  = this.landscapeHeightAt(x+size  , y+2*size);
		if (zB==0) {
			this.setLandscapeHeightAt(x+size, y+2*size, zB=.5*(zBL+zBR)+scale*(this.controlledRandom()-.5));
		}
		var zC  = this.landscapeHeightAt(x+size  , y+size  );
		if (zC==0) {
			this.setLandscapeHeightAt(x+size, y+size, .25*(zT+zL+zR+zB)+scale*(this.controlledRandom()-.5));
		}

		if (size>1) {
			scale = .5 * scale;
			this.performDiamondSquareStep(x, y, size, scale);
			this.performDiamondSquareStep(x+size, y, size, scale);
			this.performDiamondSquareStep(x, y+size, size, scale);
			this.performDiamondSquareStep(x+size, y+size, size, scale);
		}
		
	},

	
	/**
	 * Reinitialize the game progress
	 * Closes all doors, empties key inventory and teleports the player to the entrance
	 */
	startNewGame : function() {
	
		this.initialize();
		this.gameCondition = 0; // game in progress

		this.loadLevel();
	},
	
	
	/**
	 * Trigger an explosion (usually when a shell hits something)
	 * Applies damage to all tanks nearby
	 * Does not change anything to the shell list
	 */
	initiateExplosion : function(x, y, z, range, damage) {
		this.explosions.push ( {x : x, y : y, z : z, range : range, t0 : this.timer});
		
		// Damage to all tanks within range, decreases as 1/distance
		for (var i=0; i<this.playerData.length; ++i) {
			var currentPlayer = this.playerData[i];
			var dist2 = Math.pow(currentPlayer.x - x, 2) + Math.pow(currentPlayer.y + 3 - y, 2) + Math.pow(currentPlayer.z - z, 2);
			if (dist2 < range*range) {
				currentPlayer.hp = Math.max (0, currentPlayer.hp - damage * (1 - Math.sqrt(dist2) / range));
				if (i==0 && currentPlayer.hp < .01) {
					this.gameCondition = 1; // lost, player tank destroyed
				}
			}
		}
	},

	/** 
	 * One player fires the tank cannon
	 * Fails if no ammo left
	 */
	playerShoots : function(playerId) {
		var player = this.playerData[playerId];
		if (player.weapons[player.currentWeapon]>0) {
			player.reload = 50;
			var shootingSpeed = 3;
			this.shells.push( { type : player.currentWeapon, 
								timer : 0,
								x : player.x + Math.cos(player.aimY)*Math.cos(player.aimH)*10,
								y : player.y+5+Math.sin(player.aimH)*10,
								z : player.z + Math.sin(player.aimY)*Math.cos(player.aimH)*10,
								dx : Math.cos(player.aimY)*Math.cos(player.aimH)*shootingSpeed,
								dy : Math.sin(player.aimH)*shootingSpeed,
								dz : Math.sin(player.aimY)*Math.cos(player.aimH)*shootingSpeed,
								});
			
			// expend a shell in the inventory. If none left of that type, revert to first non-empty
			--player.weapons[player.currentWeapon];
			if (player.weapons[player.currentWeapon] == 0) {
				for (var i=0; i<4 && !player.weapons[i]; ++i) {
				}
				player.currentWeapon = i&3; // if no weapon i==4 => revert to main weapon even if empty
			}

		}
	},
	
	/** 
	 * Parachute a crate above the arena
	 * Contents is chosen at random.
	 * Drop area is a weighted random depending on lit beacons
	 */
	dropCrate : function() {
	
		// compute average position of lit beacons
		var posX=0, posZ=0, beaconCount=0;
		for (var i=0; i<this.beacons.length; ++i) {
			if (this.beacons[i]>-1) {
				posX += 32 + 64 * (i&3)
				posZ += 32 + 64 * (i>>2);
				++beaconCount;
			}
		}
		if (!beaconCount)
			return; // no weapon drop as long as all beacons are off
			
		posX = Math.max(8, Math.min (248, posX/beaconCount + 64 * this.controlledRandom() - 32));
		posZ = Math.max(8, Math.min (248, posZ/beaconCount + 64 * this.controlledRandom() - 32));
		var shellType = Math.floor(4 * this.controlledRandom());
		
		this.crates.push( { x : posX , y : 100, z : posZ, 
							onGround : false, speedY : 0,
							shellType : shellType, shellCount : [20, 5, 5, 5][shellType],
							groundY : 2+ Math.min( 	this.landscapeHeightAtFloat(posX-2, posZ-2), this.landscapeHeightAtFloat(posX+1, posZ-2),
													this.landscapeHeightAtFloat(posX-2, posZ+2), this.landscapeHeightAtFloat(posX+1, posZ+2))
							});
		
	},
	
	
	/**
	 * Detects collision of one player with the environment, and acts upon it :
	 *  - borders : stop tank
	 *  - other tank : stop tank, slight damage to both
	 *  - crate : gain munitions
	 */
	detectCollisions : function(activePlayerId) {
		var activePlayer = this.playerData[activePlayerId];
		var collisionPoints = [ [2.5, 3.5], [0, 3.5], [-2.5, 3.5], [-2.5, 0], [-2.5, -3.5], [0, -3.5], [2.5, -3.5], [2.5, 0] ];
		var weaponName = ["Armor piercing", "Explosive", "Splitter", "Delay-action"];

		var collisionRadius = .5;
		for (var pt = 0; pt<8; ++pt) {
			var worldX = activePlayer.x + activePlayer.speed*Math.cos(activePlayer.dir) + collisionPoints[pt][0]*Math.cos(activePlayer.dir) - collisionPoints[pt][1]*Math.sin(activePlayer.dir);
			var worldZ = activePlayer.z + activePlayer.speed*Math.sin(activePlayer.dir) + collisionPoints[pt][0]*Math.sin(activePlayer.dir) + collisionPoints[pt][1]*Math.cos(activePlayer.dir);
			var worldY = activePlayer.y;
			
			// Collisions with walls
			if (worldX < 10 || worldX > 246 || worldZ < 10 || worldZ > 246) { // walls hit
				activePlayer.speed = 0;
			}
			
			// Collisions with crates
			for (var i=0; i<this.crates.length; ++i) {
				var crate = this.crates[i];
				if (	worldX>crate.x-2-collisionRadius && worldX<crate.x+2+collisionRadius
					&& 	worldZ>crate.z-2-collisionRadius && worldZ<crate.z+2+collisionRadius
					&&  worldY>crate.y-6) { // crate caught
					activePlayer.weapons[crate.shellType] += crate.shellCount;
					
					// if the player was out of round, immediately select the weapon retrieved
					if (activePlayer.weapons[activePlayer.currentWeapon] < 1) {
						activePlayer.currentWeapon = crate.shellType;
					}
					if (activePlayerId == this.playerId) {	// initiate message on the main view
						this.message = "+"+crate.shellCount+" "+weaponName[crate.shellType]+" shells";
						this.messageTimer = this.timer;
					}
					this.crates.splice(i, 1);
					--i;
				}
			}
			
			// Collisions with other players
			for (var i=0; i<4; ++i) if (i!=activePlayerId) {
				var otherPlayer = this.playerData[i];
				var localX =  Math.cos(otherPlayer.dir)*(worldX - otherPlayer.x) + Math.sin(otherPlayer.dir)*(worldZ - otherPlayer.z);
				var localZ = -Math.sin(otherPlayer.dir)*(worldX - otherPlayer.x) + Math.cos(otherPlayer.dir)*(worldZ - otherPlayer.z);
				
				if (localX > -3.5 && localX < 3.5 && localZ > -2.5 && localZ < 2.5) {
					activePlayer.speed = 0;
					otherPlayer.speed = 0;
				}
				
			}
			
			
		}
		
		// Collisions with shells
		for (var i=0; i<this.shells.length; ++i) {
			var oneShell = this.shells[i];
			var localX =  Math.cos(activePlayer.dir)*(oneShell.x - activePlayer.x) + Math.sin(activePlayer.dir)*(oneShell.z - activePlayer.z);
			var localZ = -Math.sin(activePlayer.dir)*(oneShell.x - activePlayer.x) + Math.cos(activePlayer.dir)*(oneShell.z - activePlayer.z);
			
			if (localX > -3.5 && localX < 3.5 && localZ > -2.5 && localZ < 2.5 && worldY>oneShell.y-6) { // hit
				this.initiateExplosion(oneShell.x, oneShell.y, oneShell.z, [10, 20, 10, 13][oneShell.type], [30, 60, 30, 40][oneShell.type]);
				this.shells.splice(i,1);
				--i;
			}
		}
	},
	
	/**
	 * Performs one step of animation : 
	 *  - move enemies
	 *  - perform collision test and
	 *  - trigger messages if the conditions are met (entering diamond room, timeout, ...)
	 *  - move elevators
	 */
	animateItems : function()
	{
		++this.timer;
		if (this.timer < 0) {
			return;
		}
		if (this.timer > 2999) {
			this.gameCondition = 3; // lost, timeout
		}
		
		var enemiesLeft = false;
		for (var i=1; i<this.playerData.length; ++i) {
			if (this.playerData[i].hp > .01) {
				this.aiPlayers[i-1].playOneFrame(this);
				enemiesLeft = true;
			}
		}
		
		if (!enemiesLeft) {
			this.gameCondition = 5;	// won, all enemies destroyed
		}
		
		// for all players 
		//  - move according to speed
		//  - slow down vehicles
		//  - countdown to reload
		for (var i=0; i<this.playerData.length ; ++i) {
		
			this.detectCollisions(i);

			this.playerData[i].x += this.playerData[i].speed*Math.cos(this.playerData[i].dir);
			this.playerData[i].z += this.playerData[i].speed*Math.sin(this.playerData[i].dir);
			this.playerData[i].y = this.landscapeHeightAtFloat(this.playerData[i].x, this.playerData[i].z);
			if (this.playerData[i].droneY>0) { // drone launched
				this.playerData[i].droneX += this.playerData[i].droneSX;
				this.playerData[i].droneY += this.playerData[i].droneSY;
				this.playerData[i].droneZ += this.playerData[i].droneSZ;
				this.playerData[i].droneSY -= (this.playerData[i].droneSY < 0 ? .001 : .01);
				if (this.playerData[i].droneY < this.landscapeHeightAtFloat(this.playerData[i].droneX, this.playerData[i].droneZ)) {
					this.playerData[i].droneY = -2; // drone crashed
					this.useDroneView = false; // revert to main view
				}
			} 		

			this.playerData[i].speed *=.95;
			if (Math.abs(this.playerData[i].speed) < .01) {
				this.playerData[i].speed = 0;
			}
			this.playerData[i].reload = Math.max(this.playerData[i].reload-1, 0);
		}
		
		// detect any converted beacons 
		for (var i=0; i<this.playerData.length ; ++i) {
			var dx = (this.playerData[i].x+35)%64;
			var dz = (this.playerData[i].z+35)%64;
			if (dx < 6 && dz < 6) {
				// near a beacon
				var nx = Math.floor(this.playerData[i].x/64);
				var nz = Math.floor(this.playerData[i].z/64);
				var formerOwner = this.beacons[nx+4*nz];
				if (formerOwner>=0) {
					--this.playerData[formerOwner].beacons;
				}
				this.beacons[nx+4*nz] = i;
				++this.playerData[i].beacons;
				if (this.playerData[i].beacons > 7) {	// convert 8 beacons to win the game
					this.gameCondition = (i==0 ? 6 /* player wins */ : 2 /* AI wins */);
				}
			}
		}
		
		// move all shells
		for (var i=0; i<this.shells.length ; ++i) {
			var oneShell = this.shells[i];
			
			if (oneShell.timer) {  // delayed shell on ground : countdown
				--oneShell.timer;
				if (oneShell.timer == 0) {
					this.initiateExplosion(oneShell.x, oneShell.y, oneShell.z, [6, 12, 6, 8][oneShell.type], [30, 60, 30, 40][oneShell.type]);
					this.shells.splice(i,1);
					--i;
				}
			} else {	// shell in flight
				oneShell.x += oneShell.dx;
				oneShell.y += oneShell.dy;
				oneShell.z += oneShell.dz;
				oneShell.dy -= .05; // gravity
				if (oneShell.type == 2 && oneShell.dy < -.3) { // divider
					for (var j=0; j<6; ++j) {
						this.shells.push({	type : 0, 
											timer : 0,
											x : oneShell.x,
											y : oneShell.y,
											z : oneShell.z,
											dx : oneShell.dx + Math.cos(j*Math.PI/3),
											dy : oneShell.dy,
											dz : oneShell.dz + Math.sin(j*Math.PI/3)
										});
					}
					this.shells.splice(i,1);
					--i;
				}
				
				
				if (oneShell.y < this.landscapeHeightAtFloat(oneShell.x, oneShell.z)) { // ground hit
					if (oneShell.type == 3) { // delayed type
						oneShell.dx = oneShell.dy = oneShell.dz = 0;
						oneShell.y = this.landscapeHeightAtFloat(oneShell.x, oneShell.z);
						oneShell.timer = 125; // 5 seconds
					} else { // explodes immediately
						this.initiateExplosion(oneShell.x, oneShell.y, oneShell.z, [5, 10, 5, 5][oneShell.type], [30, 60, 30, 30][oneShell.type]);
						this.shells.splice(i,1);
						--i;
					}	
				}
			}

		}
		
		// shells again, collision with crates
		for (var i=0; i<this.shells.length ; ++i) {
			var oneShell = this.shells[i];
			var blownCrates = [];
			for (var j=0; j<this.crates.length; ++j) {
				var oneCrate = this.crates[j];
				if (oneShell.x > oneCrate.x - 2.5 && oneShell.x < oneCrate.x + 2.5
				    && oneShell.y > oneCrate.y - 2.5 && oneShell.y < oneCrate.y + 2.5
					&& oneShell.z > oneCrate.z - 2.5 && oneShell.z < oneCrate.z + 2.5) {
					blownCrates.unshift(j); // in decreasing order, for upcoming splice()
				}
			}
			if (blownCrates.length) {
				for (var j=0; j<blownCrates.length; ++j) {
					this.crates.splice(blownCrates[j], 1);
				}
				// explosion is larger (25 units radius) and stronger (120 damage) than usual
				this.initiateExplosion(oneShell.x, oneShell.y, oneShell.z, 25, 120);
				this.shells.splice(i,1);
				--i;
			}
		}
		
		
		// crates obey gravity, drop a new one every 10 s
		for (var i=0; i<this.crates.length; ++i) {
			if (!this.crates[i].hitGround) {
				if (this.crates[i].y < 20 + this.crates[i].groundY) { // deploy chute
					this.crates[i].speedY *= .95;
				}
				this.crates[i].speedY -= .01; // gravity
				this.crates[i].y += this.crates[i].speedY;
				if (this.crates[i].y < this.crates[i].groundY) {
					this.crates[i].hitGround = true;
					this.crates[i].y = this.crates[i].groundY;
				}
			}
		}
		if ((this.timer%500)==0) {
			this.dropCrate();
		}
		
		// explosions : simply remove them after a given delay
		for (var i=0; i<this.explosions.length; ++i) {
			if (this.timer - this.explosions[i].t0 > 25) {
				this.explosions.splice(i, 1);
				--i;
			}
		}

		
	},
	
	
	/**
	 * Take into account user actions (mouse move / click)
	 * Called once each step.
	 */
	processControls : function()
	{
		var player = this.playerData[this.playerId];
		player.dir += (this.controls.customKeyStatus[1] ? .1 : 0) + (this.controls.customKeyStatus[3] ? -.1 : 0);
		player.speed = 	Math.min(1, Math.max(-1, player.speed 
		     + (this.controls.customKeyStatus[0] ? .1 : 0)
			 - (this.controls.customKeyStatus[2] ? .1 : 0)));
			 
		player.aimY = player.dir + Math.PI * (1 - 2*this.controls.worldDX);
		player.aimH = .7* (1 - this.controls.worldDY);
		
		// LMB down : fire immediately (do not wait for mouse up)
		if (this.controls.leftMouseButton && !player.reload) {
			this.controls.acknowledgeLeftMouseClick();
			this.playerShoots(this.playerId);			
		}
		
		// RMB down : change weapon
		if (this.controls.rightMouseButton) {
			if (player.weapons[0] + player.weapons[1] + player.weapons[2] + player.weapons[3] < 1) {
				player.currentWeapon = 0;
			} else {
				player.currentWeapon = (player.currentWeapon+1)&3;
				while (player.weapons[player.currentWeapon]==0) {
					player.currentWeapon = (player.currentWeapon+1)&3;
				}
			}
			this.controls.acknowledgeRightMouseClick();
		}
		
		if (this.controls.customKeyStatus[4] && player.droneY > -1) {
			this.controls.customKeyStatus[4] = false;
			this.useDroneView = !this.useDroneView;
			if (this.useDroneView  && player.droneX == 0) { // launch drone
				player.droneX = player.x;
				player.droneY = player.y + 5;
				player.droneZ = player.z;
				player.droneSY = 3;
			}
		}
		
		if (this.controls.controlEscape) {	// pause
			this.gameCondition = 4;
			this.controls.totalClear();
		}
	},
	
	
		
}
