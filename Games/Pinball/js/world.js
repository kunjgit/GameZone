/**
 * Ingame world, contains all game mechanisms
 * along with the information for the game in progress 
 *
 *
 * @constructor
 * @param controls Instance of the Controls class, used to process player actions
 */
function World(controls, soundManager)
{
	this.controls = controls;
	this.soundManager = soundManager;
	
	this.ballRadius = 18;
	this.loadLevel();
	this.startNewGame(1);
	
	this.message = 25; // intro message
	this.pause = false;
	
}


World.prototype = {

	/**
	 * Fill the level information : wall shape, ramps, targets
	 */
	loadLevel : function() {
		var bottomArea = 940;
		var slingShotY = bottomArea;
		var bonusLaneX = 250, bonusLaneY = 200, bonusLaneWidth = 80;
		this.walls = [
			// bonus lanes : wall between ramp and first lane
			[8],
			[2, bonusLaneX-bonusLaneWidth+16, bonusLaneY-20, 16, -.6*Math.PI, 0, 1],  // separator between access lane and L lane
			[2, bonusLaneX-bonusLaneWidth+26.15, bonusLaneY + 11.25, 48.85, -Math.PI, -.6*Math.PI, 1],
			[2, bonusLaneX-bonusLaneWidth+26.15, bonusLaneY + 11.25, 48.85, 5/6*Math.PI, Math.PI, 1],
			[0, bonusLaneX-bonusLaneWidth-16.16, bonusLaneY+35.68, bonusLaneX-bonusLaneWidth+117.55, bonusLaneY+267.26, 1],
			[2, bonusLaneX-bonusLaneWidth+121.86, bonusLaneY+264.77, 5, -1/6*Math.PI, 5/6*Math.PI, 1],
			[0, bonusLaneX-bonusLaneWidth+126.2, bonusLaneY+262.27, bonusLaneX-bonusLaneWidth+45.4, bonusLaneY+122, 1 ],
			[1, bonusLaneX-bonusLaneWidth+132, bonusLaneY+72, 100, 5/6*Math.PI, Math.PI, 1],
			[0, bonusLaneX-bonusLaneWidth+32, bonusLaneY+72, bonusLaneX-bonusLaneWidth+32, bonusLaneY-20, 1],
			[9],
			// bonus lanes : first separator
			[8],
			[0, bonusLaneX, bonusLaneY-20, bonusLaneX, bonusLaneY+20, 1],
			[2, bonusLaneX+16, bonusLaneY+20, 16, 0, Math.PI, 1], 
			[0, bonusLaneX+32, bonusLaneY+20, bonusLaneX+32, bonusLaneY-20, 1],
			[2, bonusLaneX+16, bonusLaneY-20, 16, -Math.PI, 0, 1], 
			[9],
			// bonus lanes : second separator
			[8],
			[0, bonusLaneX+bonusLaneWidth, bonusLaneY-20, bonusLaneX+bonusLaneWidth, bonusLaneY+20, 1],
			[2, bonusLaneX+bonusLaneWidth+16, bonusLaneY+20, 16, 0, Math.PI, 1], 
			[0, bonusLaneX+32+bonusLaneWidth, bonusLaneY+20, bonusLaneX+32+bonusLaneWidth, bonusLaneY-20, 1],
			[2, bonusLaneX+bonusLaneWidth+16, bonusLaneY-20, 16, -Math.PI, 0, 1], 
			[9],
			// bonus lanes : third separator
			[8],
			[0, bonusLaneX+2*bonusLaneWidth, bonusLaneY-20, bonusLaneX+2*bonusLaneWidth, bonusLaneY+20, 1],
			[2, bonusLaneX+2*bonusLaneWidth+16, bonusLaneY+20, 16, 0, Math.PI, 1], // bonus lane separators
			[0, bonusLaneX+32+2*bonusLaneWidth, bonusLaneY+20, bonusLaneX+32+2*bonusLaneWidth, bonusLaneY-20, 1],
			[2, bonusLaneX+2*bonusLaneWidth+16, bonusLaneY-20, 16, -Math.PI, 0, 1],
			[9],
			// left slingshot
			[8],
			[0, 102, slingShotY+17, 102, slingShotY+170, 1],
			[2, 120, slingShotY+170, 18, Math.PI-Math.atan(1.5), Math.PI, 1],
			[0, 110, slingShotY+185, 185, slingShotY+235, 1],
			[2, 195, slingShotY+220, 18, -Math.atan2(71, 204), Math.PI-Math.atan(1.5), 1],
			[0, 212, slingShotY+214.1, 140.74, slingShotY+9.3, 1.2],
			[2, 122, slingShotY+17, 20, -Math.PI, -Math.atan2(71, 204), 1],			
			[9],
			// right slingshot
			[8],
			[0, 647, slingShotY+170, 647, slingShotY+17, 1],
			[2, 627, slingShotY+17, 20, Math.atan2(71, 204)-Math.PI, 0, 1],
			[0, 608.26, slingShotY+9.3, 537, slingShotY+214.1, 1.2],			
			[2, 554, slingShotY+220, 18, -Math.PI, Math.atan2(71, 204)-Math.PI, 1],
			[2, 554, slingShotY+220, 18, Math.atan(1.5), Math.PI, 1],
			[0, 564, slingShotY+235, 639, slingShotY+185, 1],
			[2, 629, slingShotY+170, 18, 0, Math.atan(1.5), 1], // right slingshot
			[9],
			// center of right ramp
			[8],
			[ 0, 565, 519, 630, 584, 1 ],
			[ 2, 637.5, 576.5, 10.6, Math.PI/4, 3/4*Math.PI, 1 ],
			[ 2, 541, 480, 147, 0, Math.PI/4, 1 ],
			[ 0, 688, 480, 688, 269, 1 ],
			[ 2, 616, 269, 72, -Math.PI, 0, 1 ],
			[ 2, 616, 269, 72, 3/4*Math.PI, Math.PI, 1 ],
			[ 1, 470.5, 414.5, 133.8, -Math.PI/4, Math.PI/4, 1],
			[ 2, 570, 514, 7, -Math.PI, -3/4*Math.PI, 1 ],
			[ 2, 570, 514, 7, 3/4*Math.PI, Math.PI, 1 ],
			[9],
			// separator between bottom left lanes, ending with left flipper
			[8],
			[0, 235, bottomArea+325, 70, bottomArea+215, 1],
			[1, 86, bottomArea+191, 28.9, 2.16, Math.PI, 1 ], // bottom left lane separation
			[0, 57, bottomArea+191, 57, bottomArea, 1], 
			[2, 54, bottomArea, 3, -Math.PI, 0, 1], 
			[0, 51, bottomArea, 51, bottomArea+211, 1],
			[2, 87, bottomArea+211, 36, 2.16, Math.PI, 1], 
			[0, 67, bottomArea+241, 217, bottomArea+341, 1],			
			[9],
			// separator between bottom right lanes, ending with right flipper
			[8],
			[0, 532, bottomArea+341, 682, bottomArea+241, 1],
			[2, 662, bottomArea+211, 36, 0, .98, 1],
			[0, 698, bottomArea+211, 698, bottomArea, 1],
			[2, 695, bottomArea, 3, -Math.PI, 0, 1],
			[0, 692, bottomArea, 692, bottomArea+191, 1 ],
			[1, 663, bottomArea+191, 28.9, 0, .98, 1], // bottom right lane separation
			[0, 679, bottomArea+215, 514, bottomArea+325, 1],
			[9],
			
			// outer frame
			[8],
			[0, 231, bottomArea+460, 24, bottomArea+322, 1],
			[1, 57, bottomArea+279, 54, 2.16, Math.PI, 1], // bottom left fast lane
			[0, 3, bottomArea+279, 3, 929.8, 1], 
			[1, 27.8, 929.8, 24.8, -Math.PI,-3/4*Math.PI, 1 ], // left wall
			[0, 10.2, 912.2, 51.7, 870.6, 1 ],
			[2, 41.1, 860, 15, 0, Math.PI/4, 1 ],
			[0, 56.1, 860, 56.1, 824.9, 1 ],
			[2, 7.6, 824.9, 48.5, -Math.PI/6, 0, 1 ],
			[0, 49.6, 800.7, 29, 765, 1 ],
			[1, 87.5, 731.3, 67.5, 5/6*Math.PI, Math.PI, 1 ],
			[1, 87.5, 731.3, 67.5, -Math.PI, -5/6*Math.PI, 1 ],
			[0, 29, 697.6, 104.1, 567.5, 1 ], // wall behind  R A F T  targets
			[2, 77.3, 552, 31, -Math.PI/8, Math.PI/6, 1 ],
			[0, 106, 540, 17.8, 327.2, 1 ],
			[1, 197, 253, 194, 7/8*Math.PI, Math.PI, 1],
			[1, 197, 253, 194, -Math.PI, -2*Math.PI/3, 1],
			[1, 400, 605, 600, -2*Math.PI/3, -Math.PI/2, 1], // left ramp (outer wall)
			[4, 400, 5, 400, 49, 1], // arbitrary end of left ramp
			[2, 400, 605, 556, -2*Math.PI/3, -Math.PI/2, 1], // left ramp (inner wall)
			[2, 171, 207, 97, -Math.PI, -2*Math.PI/3, 1],
			[2, 171, 207, 97, 7/8*Math.PI, Math.PI, 1],
			[0, 81.4, 244.1, 111.8, 317.7, 1 ],
			[2, 119.3, 314.7, 8, -Math.PI/8, 7/8*Math.PI, 1], // separation between left ramp and lane to bonus group
			[0, 126.7, 311.7, 96.2, 238, 1 ],
			[1, 171, 207, 81, 7/8*Math.PI, Math.PI, 1],
			[1, 171, 207, 81, -Math.PI, -2*Math.PI/3, 1],
			[1, 400, 605, 540, -2*Math.PI/3, -.6*Math.PI, 1], 
			[1, 271, 208, 122.5, -.6*Math.PI, -Math.PI/3, 1],
			[2, 387.7, 6.2, 110.5, Math.PI/3, 2/3*Math.PI, 1], // bump above bonus group
			[1, 561, 306, 236, -2/3*Math.PI, 0, 1], // launch ramp to bonus group (outer wall)
			[0, 797, 306, 797, bottomArea+279, 1],
			[0, 797, bottomArea+279, 753, bottomArea+279, .4],
			[0, 753, bottomArea+279, 753, 306, 1],
			[2, 561, 306, 192, -.6*Math.PI, 0, 1], //launch ramp to bonus group (inner wall)			
			[2, 506.9, 139.5, 16.9,-Math.PI, -.6*Math.PI , 1],
			[0, bonusLaneX+3*bonusLaneWidth, 139.5, bonusLaneX+3*bonusLaneWidth, bonusLaneY+80, 1],
			[1, 303, bonusLaneY+80, 187, 0, Math.PI/6, 1],
			[0, 465, 373.5, 377, 526, 1],	// right side of the funnel at the bottom of bonus group
			[2, 381.4, 528.5, 5, -Math.PI, -5/6*Math.PI, 1],
			[2, 381.4, 528.5, 5, Math.PI/3, Math.PI, 1],
			[0, 383.9, 532.8, 518.2, 455.3, 1], // support for  A N D  targets
			[2, 484.7, 397.3, 67 , -Math.PI/4 , Math.PI/3, 1],
			[1, 615.8, 266.2, 118.4, 3/4*Math.PI , Math.PI, 1 ],
			[1, 613.2, 266.2, 115.8, -Math.PI, -Math.PI/4, 1 ],
			[1, 583.5, 295.9, 157.8, -Math.PI/4, 0, 1],
			[0, 741.3, 295.9, 741.3, 500, 1 ], // right ramp, outer wall
			[1, 460, 500, 281.3, 0, Math.PI/7, 1],
			[2, 938.7, 730.5, 250, -Math.PI, -6/7*Math.PI, 1], // bump on right wall
			[2, 938.7, 730.5, 250, 5/6*Math.PI, Math.PI, 1],
			[1, 574.8, 940.6, 170.2, -Math.PI/6, 0, 1 ],
			[0, 745, 940.6, 745, bottomArea+279, 1],
			[1, 691, bottomArea+279, 54, 0, .98, 1], // bottom right fast lane
			[0, 724, bottomArea+322, 517, bottomArea+460, 1],
			
			// drawing only, not considered for collisions
			[4, 517, 1400, 799, 1400, 1],
			[4, 799, 1400, 799, 0, 1],
			[4, 799, 0, 0, 0, 1],
			[4, 0, 0, 0, 1400, 1],
			[4, 0, 1400, 231, 1400, 1],
			[9],
		
			[0, 487, 83, 502, 123, 1] // blocker at the end of the launch ramp to prevent the ball from coming back			

		];
		
		this.leftRamp = [
			[1, 400, 605, 600, -Math.PI/2, -Math.PI/3, 1], // left ramp (outer wall)
			[3, 400, 605, 578, -Math.PI/2, -Math.PI/3, 1], // left ramp (center pole)
			[2, 400, 605, 556, -Math.PI/2, -Math.PI/3, 1], // left ramp (inner wall)
			[1, 604, 251.7, 192, -Math.PI/3, 0, 1 ],
			[3, 604, 251.7, 170, -Math.PI/3, 0, 1 ],
			[2, 604, 251.7, 148, -Math.PI/3, 0, 1 ],
			[0, 796, 251.7, 796, 740, 1],
			[0, 752, 740, 752, 251.7, 1],
			[4, 774, 740, 774, 251.7, 1],
			[1, 693, 740, 103, 0, Math.PI/3, 1 ],
			[2, 693, 740, 59, 0, Math.PI/3, 1 ],
			[3, 693, 740, 81, 0, Math.PI/3, 1 ],
			[2, 796, 918.5, 103, -Math.PI, -2/3*Math.PI , 1],
			[1, 796, 918.5, 147, -Math.PI, -2/3*Math.PI , 1],
			[3, 796, 918.5, 125, -Math.PI, -2/3*Math.PI , 1],
			[0, 693, 918.5, 693, 965, 1],
			[4, 671, 918.5, 671, 943, 1],
			[0, 649, 965, 649, 918.5, 1],
			[3, 671, 965, 22, -Math.PI, Math.PI, 1],
			
			// left side of the ramp, already included in table definition
			[10, 106, 540, 17.8, 327.2, 1 ],
			[11, 197, 253, 194, 7/8*Math.PI, Math.PI, 1],
			[11, 197, 253, 194, -Math.PI, -2*Math.PI/3, 1],
			[11, 400, 605, 600, -2*Math.PI/3, -Math.PI/2, 1], // left ramp (outer wall)
			[12, 400, 605, 556, -2*Math.PI/3, -Math.PI/2, 1], // left ramp (inner wall)
			[12, 171, 207, 97, -Math.PI, -2*Math.PI/3, 1],
			[12, 171, 207, 97, 7/8*Math.PI, Math.PI, 1],
			[10, 81.4, 244.1, 111.8, 317.7, 1 ],
		];
		
		this.leftRampEnd = [
			[4, 658, 982, 658, 930, 1],
			[4, 684, 982, 684, 930, 1],
			[4, 649, 965, 693, 965, 1],
		];

		var r1 = 20, r2 = 12, length = 90, a1 = Math.acos((r1-r2)/length);
		this.flipperOutline = [
			[8], 
			[0, r1*Math.cos(a1), r1*Math.sin(a1), length+r2*Math.cos(a1), r2*Math.sin(a1), .7],
			[2, length, 0, r2, -a1, a1, .7],
			[0, length+r2*Math.cos(a1), -r2*Math.sin(a1), r1*Math.cos(a1), -r1*Math.sin(a1), .7],
			[2, 0, 0, r1, -Math.PI, -a1, .7],
			[2, 0, 0, r1, a1, Math.PI, .7],
			[9]
			];
		this.bumpers = [ [bonusLaneX+50, bonusLaneY+120, 24, 1.1], [bonusLaneX+105, bonusLaneY+220, 24, 1.1], [bonusLaneX+160, bonusLaneY+120, 24, 1.1] ];
		this.targets = [ [208, 355, 232, 397], [232, 397, 256, 439], [256, 439, 280, 481],
						 [390, 547, 432, 523], [432, 523, 474, 499], [474, 499, 516, 475],
						 [25, 732, 49, 690], [49, 690, 73, 648], [73, 648, 97, 606 ], [97, 606, 121, 564] ];
		this.rollovers = [ 	[bonusLaneX + 16 - bonusLaneWidth*.5, bonusLaneY],
							[bonusLaneX + 16 + bonusLaneWidth*.5, bonusLaneY],
							[bonusLaneX + 16 + bonusLaneWidth*1.5, bonusLaneY],
							[bonusLaneX + 16 + bonusLaneWidth*2.5, bonusLaneY],
							[79, bottomArea+70], [670, bottomArea+70], [25, bottomArea+70], [724, bottomArea+70] ];
		this.rampGates = [ [0, 210, 85, 260], [680, 460, 742, 520], [550, 370, 610, 440]];
	},

	/**
	 * Sets the pinball up for a new game
	 */
	startNewGame : function(playerCount) {
		this.playerScore = [0, 0, 0, 0];
		this.playerCount = playerCount;
		this.score = 0; // current player
		this.currentBall = 0;
		this.time = 0;
		this.messageCoolDown = 0;
		this.currentPlayer = playerCount-1;
		
		this.leftFlipperUp = 0; // 0 = down, 1 = up
		this.rightFlipperUp = 0; // 0 = down, 1 = up
		this.leftFlipperAngularSpeed = 0; 
		this.rightFlipperAngularSpeed = 0;
	},
	
	/**
	 * Prepare the launch of a new ball.
	 */
	prepareNewBall : function() {
		this.message = 0;
		this.ballX = 775;
		this.ballY = 1200;
		this.ballSpin = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.activeRamp = 0;
		this.launchStrength = 0;		
		this.targetsHit = 0; // no target hit 
		this.lostLightsLit = 0; // L O S T lights on the top
		this.escapeLightsLit = 0;
		this.audienceLevelAcquired = 0;
		this.audienceLevelOpen = 0;
		this.trapLevelAcquired = 0;
		this.trapLevelOpen = 1;
		this.animationTimer = 0;
		this.activeRollover = 0;
		this.escapeRunStartTime = 0;
		this.escapeRunActive = false;
		this.escapeRunScore = 0;
		++this.currentPlayer;
		if (this.currentPlayer >= this.playerCount) {
			this.currentPlayer = 0;
			++this.currentBall;
		}
		this.score = this.playerScore[this.currentPlayer];
		
		this.jolt = 0;
		this.tiltControl = 0;
		this.tilted = false;
		
		this.keyTriggerLeft = false;
		this.keyTriggerRight = false;
		this.bonus = 0;
		this.bonusMultiplier = 1;
		this.bonusShown = 0;
		this.bonusMultiplierShown = 1;
		this.ballLostAnimationStep = 0;
		this.nextAnimationFrame = 0;
		
	},

	/**
	 * Trigger the scrolling of a new message.
	 * If the cooldown of the former message is still activated (too recent), this one is discarded
	 * @param messageId id of the message, 0 for none
	 */
	setMessage : function (messageId)
	{
		if (this.messageCoolDown <= 0) {
			this.message = messageId;
			this.messageCoolDown = 50; // no other message for 1 second
		}
	},
	
	
	/**
	 * Inner method for ball physics
	 * @param time : 0 to 1 in current frame, to apply collisions in order
	 * @param rotationCenterX : x offset to rotation center (for flippers, 0 otherwise)
	 * @param rotationCenterY : y offset to rotation center (for flippers, 0 otherwise)
	 * @param rotationAngle : rotation angle in radians (for flippers, 0 otherwise)
	 * @param rotationSpeed : rotation speed in radians/frame (when moving flippers, 0 otherwise)
	 * @param localPosX : ball position X coordinate in collided element
	 * @param localPosY : ball position Y coordinate in collided element
	 * @param localSpeedX : ball speed X component in collided element
	 * @param localSpeedY : ball speed Y component in collided element
	 * @param normalX : normal to surface at collision point (X coordinate, normalized)
	 * @param normalY : normal to surface at collision point (Y coordinate, normalized)
	 * @param elasticity : energy restitution factor. 1 for pure elastic, <1 to slow down, >1 to accelerate the ball
 	 */
	recordCollision : function(time, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
							   localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, elasticity)
	{
		// bounce only if the speed is towards the wall, i.e. opposite to normal vector
		var dotProd = localSpeedX*normalX + localSpeedY*normalY;
		if (dotProd > 0) {
			return false;
		}

		if (time < this.collision[0]) {
			this.collision = [time, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
							   localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, elasticity];
		}
		return true;
	},
	
	/**
	 * Run the collision detection algorithm onto a provided set of walls
	 * @param allWalls array describing the walls to be tested : whole table, ramp only, or one flipper
	 * @param maxTime maximum time of the simulation
	 * @param rotationCenterX : x offset to rotation center (for flippers, 0 otherwise)
	 * @param rotationCenterY : y offset to rotation center (for flippers, 0 otherwise)
	 * @param rotationAngle : rotation angle in radians (for flippers, 0 otherwise)
	 * @param rotationSpeed : rotation speed in radians/frame (when moving flippers, 0 otherwise)
	 * @param localPosX : ball position X coordinate in collided element
	 * @param localPosY : ball position Y coordinate in collided element
	 * @param localSpeedX : ball speed X component in collided element
	 * @param localSpeedY : ball speed Y component in collided element
	 */
	detectCollisions : function(allWalls, maxTime, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
							   localPosX, localPosY, localSpeedX, localSpeedY) {
		for (var i=0; i<allWalls.length; ++i) {
			var wall = allWalls[i];
			switch (wall[0]) {
				case 0 : // straight wall
				case 10 : // straight wall from table (in ramp)
					var cx = wall[1], cy = wall[2];
					var dx = wall[3], dy = wall[4];
					var vx = dx-cx;
					var vy = dy-cy;
					var vLength = Math.sqrt(vx*vx+vy*vy);
					var normalX = -vy/vLength;
					var normalY = vx/vLength;
					var bx = localPosX - this.ballRadius*normalX;
					var by = localPosY - this.ballRadius*normalY;

					var u = (localSpeedY*(bx-cx)-localSpeedX*(by-cy))/(localSpeedY*vx-localSpeedX*vy);
					if (u>=0 && u<=1) {	// ball direction intersects with flipper
						var t=((cy-by)*vx-(cx-bx)*vy)/(localSpeedY*vx-localSpeedX*vy);
						if (t>=-.5 && t<=maxTime) { // collision happens during this time frame
							this.recordCollision(t, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed, 
												localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, wall[5]);
						}
					}
					break;
				
				case 1 : // inner curved wall
				case 11 : // inner curved wall from table (in ramp)
					var dx = localPosX-wall[1];
					var dy = localPosY-wall[2];
					var eqA = localSpeedX*localSpeedX+localSpeedY*localSpeedY;
					var eqB = 2*(localSpeedX*dx+localSpeedY*dy);
					var eqC = dx*dx + dy*dy - (wall[3]-this.ballRadius)*(wall[3]-this.ballRadius);
					var delta = eqB*eqB-4*eqA*eqC;
					if (delta >= 0) {	// ball direction intersects with circle boundary
						var t = .5 * (-eqB + Math.sqrt(delta)) / eqA;	// use the most distant point
						if (t>=-.5 && t<=maxTime) { // collision happens during this time frame
							var collisionX = localPosX + t*localSpeedX;
							var collisionY = localPosY + t*localSpeedY;
							var angle = Math.atan2(collisionY-wall[2], collisionX-wall[1]);
							if (angle >= wall[4] && angle <= wall[5])
							{
								var normalX = -Math.cos(angle), normalY = -Math.sin(angle);
								this.recordCollision(t, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
										localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, wall[6]);
							}
						}
					}
					break;
					
				case 2 : // outer curved wall
				case 12 : // outer curved wall from table (in ramp)
					var dx = localPosX-wall[1];
					var dy = localPosY-wall[2];
					var eqA = localSpeedX*localSpeedX+localSpeedY*localSpeedY;
					var eqB = 2*(localSpeedX*dx+localSpeedY*dy);
					var eqC = dx*dx + dy*dy - (wall[3]+this.ballRadius)*(wall[3]+this.ballRadius);
					var delta = eqB*eqB-4*eqA*eqC;
					if (delta >= 0) {	// ball direction intersects with bumper boundary
						var t = -.5 * (eqB + Math.sqrt(delta)) / eqA;
						if (t>=-.5 && t<=maxTime) { // collision happens during this time frame
							var collisionX = localPosX + t*localSpeedX;
							var collisionY = localPosY + t*localSpeedY;
							var angle = Math.atan2(collisionY-wall[2], collisionX-wall[1]);
							if (angle >= wall[4] && angle <= wall[5]) {
								var normalX = Math.cos(angle), normalY = Math.sin(angle);
								this.recordCollision(t, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
										localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, wall[6]);
							}
						}
					}
					break;
			}
		}
	},
	
	/**
	 * Ball physics and ingame actions, called at 50 FPS
	 */
	animateItems : function()
	{		
		this.jolt = Math.max(0, this.jolt-2);
		this.tiltControl = Math.max(0, this.tiltControl-1);
		var maxTime = 1;	// end time of the current simulation
		var formerX = this.ballX, formerY = this.ballY;
		
		while (maxTime > 0) {
			var localWalls = (this.activeRamp == 1 ? this.leftRamp : this.walls);
			this.collision = [maxTime];
			
			this.detectCollisions(localWalls, maxTime, 0, 0, 0, 0, this.ballX, this.ballY, this.speedX, this.speedY);
			
			for (var i=0; i<this.bumpers.length; ++i) {
				var bumper = this.bumpers[i];
				var dx = this.ballX-bumper[0];
				var dy = this.ballY-bumper[1];
				var eqA = this.speedX*this.speedX+this.speedY*this.speedY;
				var eqB = 2*(this.speedX*dx+this.speedY*dy);
				var eqC = dx*dx + dy*dy - (bumper[2]+this.ballRadius)*(bumper[2]+this.ballRadius);
				var delta = eqB*eqB-4*eqA*eqC;
				if (delta >= 0) {	// ball direction intersects with bumper boundary
					var t = -.5 * (eqB + Math.sqrt(delta)) / eqA;
					if (t>=0 && t<=1) { // collision happens during this time frame
						var collisionX = this.ballX + t*this.speedX;
						var collisionY = this.ballY + t*this.speedY;
						var angle = Math.atan2(collisionY-bumper[1], collisionX-bumper[0]);
						var normalX = Math.cos(angle), normalY = Math.sin(angle);
						if (this.recordCollision(t, 0, 0, 0, 0, this.ballX, this.ballY, this.speedX, this.speedY, normalX, normalY, bumper[3])
							&& ! this.tilted) {
							this.soundManager.playBumper();
							this.score += 500;
							this.bonus += 50;
						}
					}
				}
			}
			for (var i=0; i<this.targets.length; ++i) {
				var target = this.targets[i];
				var cx = target[0], cy = target[1];
				var dx = target[2], dy = target[3];
				var vx = dx-cx;
				var vy = dy-cy;
				var vLength = Math.sqrt(vx*vx+vy*vy);
				var normalX = -vy/vLength;
				var normalY = vx/vLength;
				var bx = this.ballX - this.ballRadius*normalX;
				var by = this.ballY - this.ballRadius*normalY;

				var u = (this.speedY*(bx-cx)-this.speedX*(by-cy))/(this.speedY*vx-this.speedX*vy);
				if (u>=0 && u<=1) {	// ball direction intersects with flipper
					var t=((cy-by)*vx-(cx-bx)*vy)/(this.speedY*vx-this.speedX*vy);
					if (t>=-1 && t<=1) { // collision happens during this time frame
						if (this.recordCollision(t, 0, 0, 0, 0, this.ballX, this.ballY, this.speedX, this.speedY, normalX, normalY, 1) && ! this.tilted) {
							
							this.targetsHit = this.targetsHit | (1<<i);
							this.score += 2000;
							if ((this.targetsHit&63) == 63) {	// all  I S L A N D  targets hit
								this.targetsHit = this.targetsHit & 0x3C0; // reset targets
								// TODO : effect of hitting all targets
								this.setMessage(2);
							}
							if ((this.targetsHit&0x3C0) == 0x3C0) { // all  R A F T  targets hit
								this.targetsHit = this.targetsHit &  63; // reset targets
								++this.escapeLightsLit;
								if (this.escapeLightsLit == 6) {
									this.setMessage(4);
									this.escapeLightsLit = 0;
									
									// initiate escape run
									this.escapeRunStartTime = this.time;
									this.escapeRunActive = true;
									this.escapeRunScore = 0;
									
								} else {
									this.setMessage(5);
								}
							}
						}
					}
				}			
			}
			
			// left flipper
			var leftFlipperX = 240, leftFlipperY = 720+570, leftFlipperAngle = .5 - this.leftFlipperUp;
			var localBallX = (this.ballX - leftFlipperX)*Math.cos(leftFlipperAngle) + (this.ballY - leftFlipperY)*Math.sin(leftFlipperAngle);
			var localBallY = -(this.ballX - leftFlipperX)*Math.sin(leftFlipperAngle) + (this.ballY - leftFlipperY)*Math.cos(leftFlipperAngle);
			var localSpeedX = this.speedX*Math.cos(leftFlipperAngle) + this.speedY*Math.sin(leftFlipperAngle);
			var localSpeedY = - this.speedX*Math.sin(leftFlipperAngle) + this.speedY*Math.cos(leftFlipperAngle);
			localSpeedX += this.leftFlipperAngularSpeed*localBallY;
			localSpeedY -= this.leftFlipperAngularSpeed*localBallX;
						
			this.detectCollisions(this.flipperOutline, maxTime, leftFlipperX, leftFlipperY, leftFlipperAngle, this.leftFlipperAngularSpeed,
								localBallX, localBallY, localSpeedX, localSpeedY);
			
			
			
			// right flipper
			var rightFlipperX = 510, rightFlipperY = 720+570, rightFlipperAngle = Math.PI -.5 + this.rightFlipperUp;
			var localBallX = (this.ballX - rightFlipperX)*Math.cos(rightFlipperAngle) + (this.ballY - rightFlipperY)*Math.sin(rightFlipperAngle);
			var localBallY = -(this.ballX - rightFlipperX)*Math.sin(rightFlipperAngle) + (this.ballY - rightFlipperY)*Math.cos(rightFlipperAngle);
			var localSpeedX = this.speedX*Math.cos(rightFlipperAngle) + this.speedY*Math.sin(rightFlipperAngle);
			var localSpeedY = - this.speedX*Math.sin(rightFlipperAngle) + this.speedY*Math.cos(rightFlipperAngle);
			localSpeedX += this.rightFlipperAngularSpeed*localBallY;
			localSpeedY -= this.rightFlipperAngularSpeed*localBallX;
			
			this.detectCollisions(this.flipperOutline, maxTime, rightFlipperX, rightFlipperY, rightFlipperAngle, this.rightFlipperAngularSpeed,
								localBallX, localBallY, localSpeedX, localSpeedY);

			
			if (this.collision.length == 1) {
				// no collision found : advance to next frame
				this.ballX += maxTime * this.speedX;
				this.ballY += maxTime * this.speedY;
				maxTime = 0;
			} else {

				[time, rotationCenterX, rotationCenterY, rotationAngle, rotationSpeed,
				   localPosX, localPosY, localSpeedX, localSpeedY, normalX, normalY, elasticity] = this.collision;
			
				if (this.tilted) {	// switch off slingshot and bumpers in case of tilt
					elasticity = Math.min(elasticity, 1);
				}
			
				// apply collision effect in local frame
				localPosX += time*localSpeedX;
				localPosY += time*localSpeedY;

				if (elasticity > 1.1) { // slingshot
					this.soundManager.playSlingshot();
					this.score += 100;
					this.bonus += 20;
				}
				
				var dotProd = localSpeedX*normalX + localSpeedY*normalY;
				
				localSpeedX -= 2*dotProd*normalX;
				localSpeedY -= 2*dotProd*normalY;
				// elasticity > 1 for bumpers and slingshots : increase normal speed
				var normalSpeed = .9*(localSpeedX*normalX + localSpeedY*normalY)+Math.max(0,elasticity-1)*12;
				var tangentSpeed = -localSpeedX*normalY + localSpeedY*normalX
				
				// apply friction with walls, linear speed turns to ball spin and the other way around
				var friction = Math.max(0, 1.02-elasticity);
				if (friction>0) {
					this.ballSpin += friction*tangentSpeed;
					tangentSpeed*=(1-friction);
					tangentSpeed += friction*this.ballSpin;
					this.ballSpin*=(1-friction);
				}
				localSpeedX = normalSpeed*normalX - tangentSpeed*normalY;
				localSpeedY = tangentSpeed*normalX + normalSpeed*normalY;
								
				// and return to main vector frame
				this.ballX = rotationCenterX + localPosX*Math.cos(rotationAngle) - localPosY*Math.sin(rotationAngle);
				this.ballY = rotationCenterY + localPosX*Math.sin(rotationAngle) + localPosY*Math.cos(rotationAngle);

				localSpeedX -= rotationSpeed*localPosY;
				localSpeedY += rotationSpeed*localPosX;
				this.speedX = localSpeedX*Math.cos(rotationAngle) - localSpeedY*Math.sin(rotationAngle);
				this.speedY = localSpeedX*Math.sin(rotationAngle) + localSpeedY*Math.cos(rotationAngle);

				
				maxTime = 1-time; // remaining time in current simulation
			}
		}

		var rolloverFound = 0;
		for (var i=0; i<this.rollovers.length; ++i) {
			var rollover = this.rollovers[i];
			var dx = rollover[0] - this.ballX;
			var dy = rollover[1] - this.ballY;
			if (5*dx*dx + dy*dy <  this.ballRadius*this.ballRadius) {
				rolloverFound = i+1;
			}
		}
		if (rolloverFound && !this.activeRollover) {
			// rollover activated
			if (rolloverFound>0 && rolloverFound<5) { // 1-4 : L O S T lights for bonus multiplier
				this.lostLightsLit |= 1<<(rolloverFound-1);
				if (this.lostLightsLit==15) {
					++this.bonusMultiplier;
					this.lostLightsLit=0;
					this.setMessage(1); 
				}
			}
		}
		this.activeRollover = rolloverFound;
		
		// detect entrance / exit of a ramp
		for (var i=0; i<this.rampGates.length; ++i) {
			var gate = this.rampGates[i];
			if (this.ballX>gate[0] && this.ballX<gate[2] && this.ballY>gate[1] && this.ballY<gate[3]) {
				this.activeRamp = (this.speedY < 0 ? i+1 : 0);
			}
		}
		
		// left ramp effect trigger
		if (this.activeRamp == 1 && this.ballX >= 400 && formerX < 400) {
			this.soundManager.playRamp();
			if (this.escapeRunActive) {	// escape run : record ramp was hit
				this.escapeRunScore |= 1;
				this.setMessage(this.escapeRunScore==7?24:23);
			} else {
				if (this.audienceLevelOpen > this.audienceLevelAcquired) {	// collect bonus (blinking light on left scale)
					this.score += [5e4, 2e5, 5e5, 1e6, 2e6, 5e6, 5e6][this.audienceLevelAcquired];
					this.setMessage(6+this.audienceLevelAcquired);
					if (this.audienceLevelAcquired < 6) {
						++this.audienceLevelAcquired;	
					} else {
						--this.audienceLevelOpen;
					}
				} else { //  I S L A N D targets not acquired : 100k pts added to bonus
					this.bonus += 1e5;
					this.setMessage(13);
				}
			}
		}

		// left ramp effect trigger
		if (this.activeRamp == 2 && this.ballX < 615 && formerX >= 615) {
			this.soundManager.playRamp();
			if (this.escapeRunActive) {	// escape run : record ramp was hit
				this.escapeRunScore |= 2;
				this.setMessage(this.escapeRunScore==7?24:23);
			} else {
				if (this.trapLevelOpen > this.trapLevelAcquired) {	// collect bonus (blinking light on left scale)
					this.score += [5e4, 1e5, 3e5, 8e5, 3e6, 8e6, 2e6][this.trapLevelAcquired];
					this.setMessage(14+this.trapLevelAcquired);
					if (this.trapLevelAcquired < 6) {
						++this.trapLevelAcquired;	
					} else {
						--this.trapLevelOpen;
					}
				} else { //  I S L A N D targets not acquired : 50k pts added to bonus, 50k to score
					this.bonus += 5e4;
					this.score += 5e4;
					this.setMessage(21);
				}
			}
		}
		
		// left ramp taken backwards
		if (this.activeRamp == 3 && this.ballX >= 615 && formerX < 615) {
			this.soundManager.playRamp();
			if (this.escapeRunActive) {	// escape run : record ramp was hit
				this.escapeRunScore |= 4;
				this.setMessage(this.escapeRunScore==7?24:23);
			} else {
				this.bonus += 1e5;
				this.score += 1e6;
				this.setMessage(22);
			}
		}
		
		if (this.escapeRunScore == 7 && this.escapeRunActive) {	// escape run completed
			this.score += 1e7;
			this.escapeRunActive = false;
		}
		
		if (this.escapeRunActive && (this.time - this.escapeRunStartTime) > 2000) { // escape run timeout
			this.escapeRunActive = false;
		}
		
		
		var speed2 = this.speedX*this.speedX+this.speedY*this.speedY;
		var friction = Math.min (.5, .00001 * speed2);
		this.speedX *= (1-friction);
		this.speedY *= (1-friction);

		this.speedY+=.3; // gravity
		
		
		// slowdown at the end of the ramp
		if (this.activeRamp==1 && this.ballY > 920) {
			var factor = (1020 - this.ballY) / 100;
			this.speedX *= factor;
			this.speedY *= factor;
			
			if (this.ballY > 965) {	// exit the ramp
				this.activeRamp = 0;
				this.ballX = 671;
			}
		}
	
		++this.time;
		--this.messageCoolDown;
		if (!this.messageCoolDown) {
			this.message = 0;
		}
	},
	
	/**
	 * Take into account user actions (mouse move / click)
	 * Called once each step.
	 */
	processControls : function()
	{
		if (this.controls.controlFire) {
			this.jolt += 10;
			this.speedY -= 1;
			this.controls.controlFire = false;
			this.tiltControl += 8;
			if (this.tiltControl > 30) {
				this.tilted = true;
				this.soundManager.playTilt();
			}
		}
		if (this.tilted) {
			this.controls.controlLeft = false;
			this.controls.controlRight = false;
		}
	
		if (this.controls.controlLeft && !this.keyTriggerLeft) {	// left flipper hit : shift LOST lights left + sound
			this.lostLightsLit = (this.lostLightsLit>>1) + (this.lostLightsLit&1 ? 8 : 0);
			this.soundManager.playLeftFlipper();
		}
		if (this.controls.controlRight && !this.keyTriggerRight) {	// right flipper hit : shift LOST lights right + sound
			this.lostLightsLit = ((this.lostLightsLit<<1)&15) + (this.lostLightsLit&8 ? 1 : 0);
			this.soundManager.playRightFlipper();
		}
		this.keyTriggerLeft = this.controls.controlLeft;
		this.keyTriggerRight = this.controls.controlRight;

		this.leftFlipperUp = this.controls.controlLeft ? Math.min(this.leftFlipperUp +.1, 1) : Math.max(this.leftFlipperUp - 0.1, 0);
		this.leftFlipperAngularSpeed = this.controls.controlLeft && this.leftFlipperUp < 1 ? -.4 :
										(!this.controls.controlLeft && this.leftFlipperUp > 0 ? .4 : 0);
		
		this.rightFlipperUp = this.controls.controlRight ? Math.min(this.rightFlipperUp +.1, 1) : Math.max(this.rightFlipperUp - 0.1, 0);
		this.rightFlipperAngularSpeed = this.controls.controlRight && this.rightFlipperUp < 1 ? .4 :
										(!this.controls.controlRight && this.rightFlipperUp > 0 ? -.4 : 0);
										
		// game begins : press down key / touch controls to build up strength
		if (this.controls.controlDown) {
			this.launchStrength = Math.min(360, this.launchStrength+2);
		}
		// and release to launch
		if (!this.controls.controlDown && this.launchStrength > 0) {
			this.soundManager.playLauncher();
			if (this.ballX > 750 && this.ballY > 1197) {
				this.speedY = -this.launchStrength;
			}
			this.launchStrength = 0;
		}
		
		// P key presses toggles pause on / off
		if (this.controls.controlPause) {	
			this.pause = !this.pause;
			this.controls.controlPause = false;
		}

	},

	/**
	 * Ball lost main loop
	 * Adds the bonus to the current score
	 */
	cashOutBonus : function()
	{
		if (!this.animationTimer) {
			// initial ball loss message
			this.setMessage(3);
			this.ballLostAnimationStep = 0;
			this.nextAnimationFrame = 0;
		}
		if (this.animationTimer > 25) {
			// disable the message so it vanishes once the scrolling is complete
			this.message = 0;
		}
		switch (this.ballLostAnimationStep) {
			case 0 :
				// ball lost message scrolls
				if (this.animationTimer>110) {
					this.ballLostAnimationStep = 1;
					this.bonusShown = this.bonus;
				}
				break;
			case 1 :
				// first, count up to bonus multiplier, one at a time 
				if ((this.animationTimer%10)==0) {
					if (this.bonusMultiplierShown + .5 > this.bonusMultiplier) {
						this.nextAnimationFrame = this.animationTimer + 50;
						++this.ballLostAnimationStep;
					} else {
						++this.bonusMultiplierShown;
						this.bonusShown = this.bonus * this.bonusMultiplierShown;
						this.soundManager.playBonusWhirl();
					}
				}
				break;
			case 2 :
			case 3 :
			case 5 :
				// wait a bit
				if (this.animationTimer > this.nextAnimationFrame) {
					++this.ballLostAnimationStep;
					if (!this.bonus) {	// skip the animation altogether if the player scored no bonus points
						this.ballLostAnimationStep = 6;
					}
					this.nextAnimationFrame = this.animationTimer + 50;
				}
				break;
			case 4 :
				// then, add the multiplied bonus to the score
				if ((this.animationTimer%4)==0) {
					var point = 10;
					while (this.bonusShown%point == 0) {
						point *= 10;
					}
					this.bonusShown -= point/10;
					this.score += point/10;
					this.soundManager.playBonusAdd();
					if (!this.bonusShown) {
						this.nextAnimationFrame = this.animationTimer + 30;
						this.ballLostAnimationStep = 5;
					}
				}
				break;

		}
		
		if (this.ballLostAnimationStep==6) { // not case 6 : do it immediately once we reach 6
			this.playerScore[this.currentPlayer] = this.score;
		}
		++this.animationTimer;
		++this.time;
		
	},
	
	/**
	 * Checks if the ball is lost, beyond the player's ability to recover it
	 * (below flippers and any possible bounce)
	 * @return true if ball lost (signal to trigger ball end animation), false otherwise
	 */
	isBallLost : function()
	{
		return (this.ballY - this.ballRadius) > 1400;
	},

	/**
	 * Checks whether the ball currently in play is the last one
	 * @return true if no further ball remaining, false otherwise
	 */
	isLastBall : function()
	{
		return this.currentBall == 3 && this.currentPlayer == this.playerCount-1;
	}
	
}
