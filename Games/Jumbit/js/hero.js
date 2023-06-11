$.Hero = function () {
	this.x = 75;
	this.y = $.base_y;
    this.vy = 0.0;

    this.width = 30;
    this.height = 30;

	this.background = [240,47,47];
    this.opacity = 1;
    this.onGround = true;
    this.lives = 6;

    this.distanceCovered = 0;

    this.invincible = 0;
    this.invincibleCount = 0;
};


$.Hero.prototype.render = function () {
    $.Draw.rect(this.x, this.y, this.width, this.height, $.util.arrayToRGBAString(this.background, this.opacity));
};

$.Hero.prototype.update = function () {
    this.width = (this.lives * 5);
    this.height = (this.lives * 5);
 
    this.vy += $.gravity;
    this.y += this.vy;
    
    if (this.y > $.base_y) {
        this.vy = 0;
        this.y = $.base_y;
        this.onGround = true;
    }
    
    this.distanceCovered += $.speed;
    
    // Animate hero when invincible    
    if (this.invincible > 0) {
        if (this.invincibleCount < 5) {
	        this.background = [255,165,0];
            this.invincibleCount++; 
        } else {
            this.invincible -= this.invincibleCount;
            this.invincibleCount = 0;
	        this.background = [221, 25, 25];
        }
    } else {
	    this.background = [221, 25, 25];
    }
};

$.Hero.prototype.startJump = function () {
    if (this.onGround && this.y > 70) {
        this.vy = -8;
    }
};

$.Hero.prototype.takeHit = function () {
    // Make hero invincible for the next 100 frames
    this.invincible = 80;
    this.lives -= 1;
};

$.Hero.prototype.oneUp = function () {
    this.invincible = 80;
    this.lives += 1;
};
