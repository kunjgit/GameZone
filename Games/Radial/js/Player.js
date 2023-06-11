function Player(opts) {
	this.renderColor = "#232323";
	this.sideLength = 22;
	this.keyBindings = [37, 39, 38]; //left / right arrow keys	
	this.jumps = 0;
	this.angle = 0;
	this.angularWidth = .2;
	this.angularVelocity = 0;
	this.yOffset = 0;
	this.yVelocity = 0;
	this.numBodies = 1;
	this.acceleration = (1/180) * Math.PI;
	this.bodies = [];

	this.init = function(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}

		var angleDiff = (Math.PI * 2) / this.numBodies;
		for (var i = 0; i < this.numBodies; i++) {
			this.bodies.push(angleDiff * i);
		}
	};

	this.update = function(dt) {
		var normalizedAcceleration = dt * this.acceleration;

		for (var x = 0; x < blocks.length; x++ ){
			//debugger;
			if (blocks[x].state == 1 && isPlayerTouchingBlock(this, blocks[x])){

				endGame();
				//blocks[x].state = 3;
			}			
			else {
			}
		}

		var shouldLeft = keys[this.keyBindings[1]] || right;
		var shouldRight = keys[this.keyBindings[0]] || left;

		if (keys[this.keyBindings[2]]) {
			if (this.jumps < this.maxJumps) {
				this.jumps += 1;
				this.yVelocity = this.jumpForce;
			}

			keys[this.keyBindings[2]] = 0;
		}
		//if (right == true)debugger;
		if (shouldRight) {
			if (this.angularVelocity > 4 * normalizedAcceleration) {
				this.angularVelocity -= 4 * normalizedAcceleration;
			} else if (this.angularVelocity > 0) {
				this.angularVelocity = (this.angularVelocity - 4 * normalizedAcceleration)/4;
			} else {
				this.angularVelocity -= normalizedAcceleration;
			}
		}

		if (shouldLeft) {
			if (this.angularVelocity < -4 * normalizedAcceleration) {
				this.angularVelocity += 4 * normalizedAcceleration;
			} else if (this.angularVelocity < 0) {
				this.angularVelocity = (this.angularVelocity + 4 * normalizedAcceleration)/4;
			} else {
				this.angularVelocity += normalizedAcceleration;
			}
		}

		if (!shouldLeft && !shouldRight) {
			this.angularVelocity *= this.angularDeceleration*dt;
		}

		if (Math.abs(this.angularVelocity) > this.maxAngularVelocity) {
			this.angularVelocity -= this.recoveryDeceleration * dt * (this.angularVelocity < 0 ? -1 : 1);
		}

		this.angle += this.angularVelocity * dt;

		this.yVelocity -= settings.gravity * dt;
		this.yOffset += this.yVelocity * dt;
		if (this.yOffset <= 0) {
			this.yOffset = 0;
			this.jumps = 0;
			this.yVelocity = 0;
		}

		var players = [player1];
		if ('player2' in window) {
			players.push(player2);
		}

		for(var x = 0; x < players.length; x++ ){
			if(isPLayerTouchingPlayer(this, players[x]) && this !== players[x]){
				//this.angularVelocity = -this.angularVelocity*2;
			}
		}

		this.radius = settings.baseRadius + this.yOffset;
		
		for(var x = 0; x < players.length; x++ ){
			if(isPLayerTouchingPlayer(this, players[x]) && this !== players[x]){
				this.angle -= this.angularVelocity * dt;
				this.angularVelocity = -this.angularVelocity*2;
				players[x].angularVelocity = -this.angularVelocity*2;
			}
		}

		var twoPI = Math.PI * 2;
		if (this.angle < 0) this.angle += twoPI;
		if (this.angle > twoPI) this.angle -= twoPI;
		this.radius = settings.baseRadius + this.yOffset;
	};

	this.draw = function() {
		for (var i = 0; i < this.bodies.length; i++) {
			var angle = this.bodies[i] + this.angle;
			var ss = settings.scale;



			//Figure out proper angle for height.
			/*
			var trueWidth = 1; //how many radians wide it is at baseradius
			var floorRadius = (settings.baseRadius + gdr);
			var floorCircumference = (floorRadius)*6.28;
			var percentageOfCircle = trueWidth/floorCircumference;

			//converttowidth
			var bottomX = floorRadius * Math.cos(angle+1/2); 
			var bottomY = floorRadius * Math.sin(angle+1/2);
			
			var topX = floorRadius * Math.cos(angle-1/2);
			var topY = floorRadius * Math.sin(angle-1/2);

			distBetweenPoints = Math.sqrt((topY-bottomY)*(topY-bottomY) + (topX-bottomX)*(topX-bottomX));

			var bottomDistanceMax = Math.sqrt(bottomX^2 + bottomY^2);
			var DistanceMax = Math.sqrt(topX^2 + topY^2);

			var currentCircumference = this.radius*6.28;
			var finalWidth = currentCircumference*percentageOfCircle;
			finalWidth = finalWidth/2;
			if(this.radius > 140) debugger;
			*/

			drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle + this.angularWidth/2), (this.angle - this.angularWidth/2), this.sideLength, this.radius + gdr, this.color);
			
			//drawRect(trueCanvas.width/2 + ss * Math.cos(angle) * this.radius + (-this.sideLength/2) * Math.sin(2 * Math.PI - angle) * ss, trueCanvas.height/2 + Math.sin(angle) * this.radius * ss + (-this.sideLength/2) * Math.cos(2 * Math.PI - angle) * ss, this.sideLength, this.color, angle, (this.yOffset == 0));
		}
	};

	this.init(opts);
}

Player.prototype.jumpForce = 16;
Player.prototype.maxJumps = 3;
Player.prototype.maxAngularVelocity = 5/180 * Math.PI;
Player.prototype.angularDeceleration = 0; //.75 is best
Player.prototype.bounce = 0;
Player.prototype.recoveryDeceleration = 1/180 * Math.PI;
