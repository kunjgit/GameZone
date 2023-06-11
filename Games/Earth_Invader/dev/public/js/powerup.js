//////////////////////////////////////////////////////
///   Powerup Class - Creates all the powerups
//////////////////////////////////////////////////////

Powerup = function(x,y,type,array) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.name = "powerup"; // Name is drawn above the actual powerups
	this.color = "white";

	// Powerups basically give you the other weapons powers, as well as invincibility and health refills
	if (this.type === "air") {
		this.name = "MULTISHOT";
		this.color = "white";
	} else if (this.type === "fire") {
		this.name = "FASTSHOT";
		this.color = "red";
	} else if (this.type === "water") {
		this.name = "SPLASHSHOT";
		this.color = "blue";
	} else if (this.type === "rock") {
		this.name = "PENETRATE";
		this.color = "brown";
	} else if (this.type === "health") {
		this.name = "HEALTH";
		this.color = "maroon";
	} else if (this.type === "invincibility") {
		this.name = "INVINCIBILITY";
		this.color = "gold";
	}

	this.radius = 5;
	this.alive = true;
	this.powerups = array;
	this.timer = 500;
	this.vx = Math.floor(Math.random() * 4) - 2; // Random direction
	this.vy = Math.floor(Math.random() * 4) - 2; // Random direction
};

Powerup.prototype.update = function(gc) { // Update position
	if (this.alive) {
		this.x += this.vx; // Move
		this.y += this.vy; // Move

		if (this.vx === 0) {
			this.vx = Math.floor(Math.random() * 4) - 2; // Recalculate velocity if its 0 to prevent still powerups
		}
		if (this.vy === 0) {
			this.vy = Math.floor(Math.random() * 4) - 2; // Recalculate velocity if its 0 to prevent still powerups
		}

		if (this.x < 0 || this.x > gc.width) {
			this.vx *= -1; // Bounce when it hits a screen edge
		}
		if (this.y < 0 || this.y > gc.height) {
			this.vy *= -1; // Bounce when it hits a screen edge
		}
		if (this.timer > 0) { // When timer reaches 0, remove the powerup
			this.timer--;
		} else {
			this.alive = false;
			var index = this.powerups.indexOf(this);
			this.powerups.splice(index, 1);
		}
	} else { // If not alive, remove powerup
		var index = this.powerups.indexOf(this);
		this.powerups.splice(index, 1);
	}
}

Powerup.prototype.draw = function(ctx) { // Draw the powerup
	if (this.alive) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(0, 0, this.radius, 0, 2*Math.PI); // The powerup circlee
		ctx.fill();
		ctx.restore();
		ctx.font = "12pt Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = this.color;
		ctx.fillText(this.name, this.x, this.y - 15); // The floating name above it
		
	}
}