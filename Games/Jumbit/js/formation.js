$.Formation = function (x, y, formationTypeNum) {
    this.type='formation';
	this.x = x;
	this.y = y;
    this.vx = $.speed;
    this.formationType = (formationTypeNum <= 0.5) ? 'small_formation' : 'large_formation';

    this.remove = false;
    this.opacity = 1;
    this.fade = 0.01;
    this.pixelSize = 5;
};

$.Formation.prototype.render = function () {
    $.Draw.formation(this.x, this.y, this.formationType);
};

$.Formation.prototype.update = function () {
    this.x -= this.vx;
    
    if (this.x <= 100) {
        this.opacity -= this.fade;
    }

    if(this.opacity <= 0){
        this.remove = true;
    }
};
