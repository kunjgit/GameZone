//////////////////////////////////////////////////////
///   Bullet Class - Used by Player and all enemies
//////////////////////////////////////////////////////

Bullet = function(x, y, r, dx, dy, speed, damage, color, type, owner, playershot) {
	this.x = x;
	this.y = y;
	this.radius = r; // For drawing the bullet
	this.dx = dx;
	this.dy = dy;
	this.speed = speed; // Constant that determines the velocity the bullet travels at
	this.damage = damage; // The damage the bullet does
	this.color = color;

	this.alive = true; // Used for determining damage and whether to draw
	this.owner = owner; // Used to determine distance from owner for the fire weapon/flamethrower
	this.playershot = playershot;// Used for weapons like flamethrower and rock cannon to add special attributes

	this.rotation = 0;
	this.penetratecount = 0; // Used for deciding whether or not to penetrate an enemy for the rock weapon
	this.currentenemy = 0; // Used for deciding whether or not to penetrate an enemy for the rock weapon
	this.penetrate = false; // Used for deciding whether or not to penetrate an enemy for the rock weapon

	this.type = type; // Used to determine characteristics like damage
	if ((this.type === "rock" || powerups.penetrate.toggle) && this.playershot) {
		this.penetrate = true;
		this.radius = 4;
	}
};

Bullet.prototype.update = function(array) { // Update the bullet's position and whether or not to kill
	if (this.alive) {
		if ((this.x < 0 || this.x > winwidth || this.y < 0 || this.y > winheight) || ((this.type === "fire") && (distance(this.x,this.y,this.owner.x,this.owner.y) > 250) && (this.playershot)) || (this.penetratecount > 3)) { // If the bullet is out of the screens bounds, a flamethrower shot and too far away, or a rock shot and has penetrated enough, kill
			this.kill(array);
		} else { // Else update the position
			this.x += this.speed * this.dx;
			this.y += this.speed * this.dy;
		}
	} else {
		this.kill(array);
	}
};

Bullet.prototype.draw = function(ctx) { // Draw the bullet object
	if (this.alive) { // Only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.restore();
	}
};

Bullet.prototype.kill = function(array) { // Used to kill the bullet, saves lines of code
	this.alive = false;
	var index = array.indexOf(this);
	array.splice(index, 1);
}