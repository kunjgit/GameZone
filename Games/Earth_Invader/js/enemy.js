//////////////////////////////////////////////////////
///   Enemy Class - Standard enemies and minibosses
//////////////////////////////////////////////////////

Enemy = function(x, y, width, height, orbit, type, pBullets, eBullets, isboss, kamikaze) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.isboss = isboss;
	this.kamikaze = kamikaze;
	this.type = type;
	this.speed = enemyTraits[this.type].speed;
	this.orbit = orbit; // Property determining distance of orbit
	this.health = enemyTraits[this.type].health;
	this.damage = enemyTraits[this.type].damage;

	this.damagemult = 1;

	this.rof = enemyTraits[this.type].rof; // Rate of fire
	this.count = 0; //counter for shooting
	this.trigger = Math.floor(Math.random() * this.rof); // Number 0 to rof-1 that will be used as signal to fire

	this.pBullets = pBullets; // Player bullets, object will check for collision with these
	this.eBullets = eBullets; // Enemy bullets, object will push a new Bullet to these every time it shoots
	this.burncount = 0; // Determines how long to take burn damage if hit by flamethrower
	this.slowcount = 0; // Determines how long to move slowly if hit by water weapon
	this.dmgcount = 0; // Used in shield regenerating
	this.splashcount = 0; // Used to draw the water boom sprite for splash

	this.radius = this.width * 1.2; // Have collision circle cover corners better at expense of overcoverage on middle of sides

	this.alive = true; // Used for determining damage and whether to draw
	this.explode = false; // Draws the boom sprite if true
	this.shield = 0; // For minibosses only

	this.rotation = 0; //This allows for the enemy to rotate to face the player

	if (this.isboss) { // Set the neccessary buffs if the enemy is a boss
		this.shield = this.health * 2;
		this.health *= 10;
		this.speed = 3;
		this.damage *= 3;
		this.dmgcount = 0;
		this.maxshield = this.shield;
	}
	this.slowspeed = this.speed / 2; // Used to adjust speed when hit by water weapon
	this.normspeed = this.speed; // Used to adjust speed when hit by water weapon
	this.regen = false; // Var used to make the shields take longer to start regenerating after hitting 0
};

Enemy.prototype.assigntarget = function(target) { // Tells the enemy object which object to shoot
	this.player = target;
};

Enemy.prototype.assignorbit = function(object) { // Tells the enemy object which object to orbit
	this.orbitthis = object;
};

Enemy.prototype.update = function(planet, earray) { // Update the enemy's position and variables
	if(! (this.player === undefined) && this.alive) { // Only update if alive
		this.count = (this.count+1) % this.rof; // Update counter
		var ctx = ctx;
		var enemies = earray;
		if (Options.difficulty === 0 ) {
			this.orbitcheck = this.orbitthis.name !== "Planet";
		} else {
			this.orbitcheck = true;
		}

		// Calculate Shooting Params
		this.playerX = this.player.x;
		this.playerY = this.player.y;
		// Calculate direction towards target
		var toPlayerX = this.playerX - this.x;
		var toPlayerY = this.playerY - this.y;
		// Normalize
		var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
		toPlayerX = toPlayerX / toPlayerLength;
		toPlayerY = toPlayerY / toPlayerLength;

		// Calculate Movement Params
		this.orbitX = this.orbitthis.x;
		this.orbitY = this.orbitthis.y;
		// Calculate direction towards orbit
		var toOrbitX = this.orbitX - this.x;
		var toOrbitY = this.orbitY - this.y;
		// Normalize
		var toOrbitLength = Math.sqrt(toOrbitX * toOrbitX + toOrbitY * toOrbitY);
		toOrbitX = toOrbitX / toPlayerLength;
		toOrbitY = toOrbitY / toPlayerLength;

		this.rotation = Math.atan2(toPlayerY, toPlayerX); // Face the player

		//////////////////////////
		//////// MOVEMENT ////////
		//////////////////////////

		if ((toOrbitLength > this.orbit+5 || this.orbitthis.shield <= 0) && this.kamikaze) { // Move towards the player. If shield is down enemy will kamikaze 
			this.angle = Math.atan2(toOrbitY,toOrbitX)+Math.PI;
			this.x += toOrbitX * this.speed;
			this.y += toOrbitY * this.speed;

		} else if (toOrbitLength < this.orbit-5) { // Move away from player
			this.angle = Math.atan2(toOrbitY, toOrbitX)+Math.PI;
			this.x -= toOrbitX * this.speed * 2;
			this.y -= toOrbitY * this.speed * 2;

		} else { // Orbit player
			this.angle -= 0.02;
			this.x = ((toOrbitLength * Math.cos(this.angle)) + (this.orbitthis.x));
			this.y = ((toOrbitLength * Math.sin(this.angle)) + (this.orbitthis.y));
			
		}

		if (this.slowcount > 0) { // If slowed, slow speed and reduce timer
			this.slowcount--;
			this.speed = this.slowspeed;
		} else {
			this.speed = this.normspeed; // Else go back to normal speed
		}
		if (this.burncount > 0) { // If burning, take damage and reduce timer
			this.burncount--;
			this.health--;
		}
		if (this.dmgcount > 0) { // When dmgcount is 0, shields will start to regenerate
			this.dmgcount--;
		}
		if (this.splashcount > 0) { // Same idea as burncount, used to draw the splash sprite
			this.splashcount--;
		}
		if (this.shield <=0 && this.dmgcount == 0) {
			this.shield = this.maxshield * .2; // Shield will regenerate very slowly
			this.regen = false; 
		} else if (this.shield < this.maxshield && this.shield >=0 && this.dmgcount == 0) {
			this.shield += 0.25; // Shield will regenerate very slowly
			this.regen = false; 
		}
		if (this.shield > 0) { // Make radius the length of the shield radius for consistency
			this.radius = 60;
		}

		if (this.shield <= 0) {
			this.radius = this.width * 1.2; // Set radius back to just above sprite size when shield is down
		}
		if (this.shield < 0) {
			this.shield = 0;
			this.dmgcount = 300; // Creates the longer shield regen
			this.regen = true;
		}

		//////////////////////////
		//////// SHOOTING ////////
		//////////////////////////

		if (this.count == this.trigger && this.orbitcheck) {
			if (this.isboss) {
				var bullet = new Bullet(this.x, this.y, 6, toPlayerX, toPlayerY, 8, this.damage, enemyTraits[this.type].bulletColor, this.type, this, false); // Create bullet/Has bigger bullets
			} else {
				var bullet = new Bullet(this.x, this.y, 3, toPlayerX, toPlayerY, 8, this.damage, enemyTraits[this.type].bulletColor, this.type, this, false); // Create bullet
			}
			this.eBullets.push(bullet); // Push bullet to enemy bullet array so player can collision check
		}

		//////////////////////////
		//////// COLLISIONS //////
		//////////////////////////

		for (var i = 0; i < this.pBullets.length; i++) { // Check for collision with bullet
			this.damagemult = mults[Options.wepType][this.type + "dmg"]; // Set damage multiplier based on the enemy type and the bullet type
			if (this.pBullets[i].alive && collision(this,this.pBullets[i]) && this.shield > 0) { // If the enemy has a shield
				if (!this.pBullets[i].penetrate) {
					this.pBullets[i].alive = false; // Normal bullet collision
					this.shield -= wepTraits[Options.wepType].damage * this.damagemult; // Normal bullet collision
				} else if (this.pBullets[i].penetrate && this !== this.pBullets[i].currentenemy) { // If bullet should penetrate, set this enemy to the bullets current enemy so it doesnt collide again
					this.pBullets[i].currentenemy = this;
					this.pBullets[i].penetratecount += 1; // When the bullets penetrate count reaches 3, the bullet dies
					this.shield -= wepTraits[Options.wepType].damage * this.damagemult;
				}
				if(Options.wepType === "water" || powerups.splash.toggle) { // If the bullet is water/splash powerup
					enemies.forEach(function(enemy) {
						if(enemy !== this) {
							if(distance(this.x, this.y, enemy.x, enemy.y) <= 250) { // Damage and slow all enemies in a 250 radius
								this.splashcount = 10; // Set the timer to deal with the sprite
								enemy.slowcount = 100; // Set the timer to deal with the slowdown
								if (enemy.shield > 0) {
									enemy.shield -= wepTraits[Options.wepType].damage * this.damagemult; // Accounts for minibosses caught in splash
								} else {
									enemy.health -= wepTraits[Options.wepType].damage * this.damagemult;
								}
							}
						}
					});
					this.slowcount = 100;
				}
				if (Options.wepType === "fire") {
					this.burncount = 100; // Burn enemy
				}
				if (Options.wepType === "air") { // Pushes enemies back, special power of air
					this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
					this.x -= toPlayerX * this.speed * 30;
					this.y -= toPlayerY * this.speed * 30;
				}
				if (!this.regen) {
					this.dmgcount = 100; // Only set dmgcount, which makes the shields regen after some time after getting hit, if the shield isnt at regen, which means the shields were below 0
				}
			} if (this.pBullets[i].alive && collision(this,this.pBullets[i]) && this.health > 0) { // Same code as above, but does damage to health instead of shields
				if (!this.pBullets[i].penetrate) {
					this.pBullets[i].alive = false;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				} else if (this.pBullets[i].penetrate && this !== this.pBullets[i].currentenemy) {
					this.pBullets[i].currentenemy = this;
					this.pBullets[i].penetratecount += 1;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				}
				if(Options.wepType === "water" || powerups.splash.toggle){
					enemies.forEach(function(enemy){
						if(enemy !== this){
							if(distance(this.x, this.y, enemy.x, enemy.y) <= 250){
								this.splashcount = 10;
								enemy.slowcount = 100;
								if (enemy.shield > 0) {
									enemy.shield -= wepTraits[Options.wepType].damage * this.damagemult; // Accounts for minibosses caught in splash
								} else {
									enemy.health -= wepTraits[Options.wepType].damage * this.damagemult;
								}
							}
						}
					});
					this.slowcount = 100;
				}
				if (Options.wepType === "fire") {
					this.burncount = 100;
				}
				if (Options.wepType === "air") {
					this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
					this.x -= toPlayerX * this.speed * 30;
					this.y -= toPlayerY * this.speed * 30;
				}
			} else if (this.pBullets[i].alive && collision(this,this.pBullets[i])) { // If the enemy has no health and shields, kill it
				this.alive = false;
				enemiesKilled += 1;
				this.explode = 1; // Draw explosion sprite
			}
		}
	}
};

Enemy.prototype.draw = function(ctx, array) { // Draw the enemy
	if (this.alive) { // only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		if (this.isboss) {
			ctx.drawImage(enemyTraits[this.type].img,-18,-18,36,36); // Draw sprite larger for bosses
			var shieldColor = "#"; 
			for (var i = 0; i < 3; i++) {
				shieldColor += (Math.floor(Math.random()*200)+55).toString(16); // Keeping individual RGB values between 100 and 200, just b/c
			}
			ctx.beginPath();
			ctx.arc(0, 0, 60, 0, 2 * Math.PI, false);
			ctx.lineWidth = 4;
			ctx.strokeStyle = shieldColor;
			if (this.shield > 0) { // Only draw shield if greater than 0
				ctx.stroke(); 
			}
			ctx.closePath();
		} else {
			ctx.drawImage(enemyTraits[this.type].img,-6,-6); // Normal sprite
		}
		if (this.burncount > 0) {
			ctx.globalAlpha = 0.75
			if (this.isboss) {
				ctx.drawImage(enemyTraits.fire.boom,-20,-20,40,40); // Draw burn sprite, larger for bosses
			} else {
				ctx.drawImage(enemyTraits.fire.boom,-10,-10,20,20); // Draw burn sprite
			}
			ctx.globalAlpha = 1.0
		}
		if(this.splashcount > 0){
			ctx.globalAlpha = 0.75;
			ctx.drawImage(enemyTraits.water.boom,-30,-30,60,60); // Draw splash sprite
			ctx.globalAlpha = 1.0
		}
		ctx.restore();
	} else if (this.explode) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		if (this.isboss) {
			ctx.drawImage(enemyTraits[this.type].boom,-24,-24,48,48); // Draw boom sprite, larger for bosses
		} else {
			ctx.drawImage(enemyTraits[this.type].boom,-14,-14,28,28); // Draw boom sprite
		}
		ctx.restore();
		this.explode = (this.explode+1)%7; // Add a count, when this.explode hits 4 (or 0) it will go false
	} else if (!this.alive && !this.boom) { // Remove from array if not alive or exploding
		var index = array.indexOf(this);
		array.splice(index, 1);
	}
}