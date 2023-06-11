$.Particle = function (x, y, xdir, ydir, w, h) {
    this.type='particle';
	this.x = x;
	this.y = y;

    this.height = h;
    this.width = w;
    this.remove = false;
    this.background = [188, 151, 125];
    this.opacity = 1;
    this.fade = 0.01;
    this.dir = (Math.random() * 2 > 1)? 1: -1;
    this.vx = (Math.random() * 4) * xdir;
    this.vy = (Math.random() * 7) * ydir;
                     
};

$.Particle.prototype.render = function () {
    $.Draw.rect(this.x, this.y, this.width, this.height, $.util.arrayToRGBAString(this.background, this.opacity));
};

$.Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.99;
    this.vy *= 0.99;

    this.opacity -= this.fade;

    if(this.opacity <= 0){
        this.remove = true;
    }
};
