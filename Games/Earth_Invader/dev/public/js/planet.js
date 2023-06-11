//////////////////////////////////////////////////////
///   Planet Class - Creates the main goal/enemy
//////////////////////////////////////////////////////

Planet = function(x, y, name, color, stroke, bullets) {
	this.x = x;
	this.y = y;
	this.health = 10000; // Massive value to ensure game doesn't end too quickly with powerups
	this.shield = 6; // Massive value to ensure game doesn't end too quickly with powerups
	this.name = name; // Name sent to healthbar 
	this.radius = 100;
	this.color = color;
	this.bullets = bullets;
	this.stroke = stroke; // For outline around planet
	this.alive = true;
	this.damagemult = 1; // Used to make certain weapons stronger/weaker
	this.totaldamage = 1; // Used in calculating score
	this.dmgcount = 0; // Used to determine when shields should regenerate
	this.regen = false; // Used to make regen after shields hit 0 take longer
}

Planet.prototype.update = function() { // Update the health and vars
	for (var i = 0; i < this.bullets.length; i++) { // Loop through all the bullets
		this.damagemult = mults[Options.wepType][Options.planType + "dmg"]; // Set the damage multiplier
		if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.shield > 0) { // If there are shields
			this.shield -= wepTraits[Options.wepType].damage * this.damagemult; // Take damage
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult; // Add to totaldamage
			if (!this.regen) {
				this.dmgcount = 180; // If not regenerating from 0, set dmgcount (shield delay) to 180
			}
			this.bullets[i].alive = false; // Kill bullet
		} else if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.health > 0) { // When shields are down, same as above but loses health instead of shields
			this.radius = 70;
			this.health -= wepTraits[Options.wepType].damage * this.damagemult;
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult;
			this.bullets[i].alive = false;
		} else if (this.bullets[i].alive && collision(this,this.bullets[i])) { // If shields are down and health is 0
			this.bullets[i].alive = false;
			this.alive = false;
		}
	}
	if (this.dmgcount > 0) { // Slowly reduce damagecount
		this.dmgcount--;
	}
	if (this.shield < 6000 && this.shield >= 0 && this.dmgcount == 0) {
		this.shield += 0.25; // Shield will regenerate very slowly
		this.regen = false;
	}
	if (this.shield > 0) {
		this.radius = 135; // Make radius larger when shields are up
	}
	if (this.shield <= 0) {
		this.radius = 70; // Reduce radius when shields are down
	}
	if (this.shield < 0) {
		this.shield = 0;
		this.dmgcount = 1500; // Long shield delay for regen after 0
		this.regen = true;
	}
	if (this.health <= 0) {
		this.health = 0;
		this.alive = true;
	}
}

Planet.prototype.draw = function(ctx) { // Draw the Planet
	if (this.alive) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 70, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = this.stroke; // Outline
		ctx.stroke();

		// Draw shield
		var shieldColor = "#"; 
		for (var i = 0; i < 3; i++) {
			shieldColor += (Math.floor(Math.random()*200)+55).toString(16); // Keeping individual RGB values between 100 and 200, just b/c
		}

		ctx.beginPath();
		ctx.arc(this.x, this.y, 135, 0, 2 * Math.PI, false);
		ctx.lineWidth = 7;
		ctx.strokeStyle = shieldColor;
		if (this.shield > 0) { // Only draw if greater than 0
			ctx.stroke(); 
		}
		ctx.closePath();
	}
}