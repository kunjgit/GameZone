/**
 * Canvas object
 * @param {Number} w
 * @param {Number} h
 * @constructor
 */
function CP_Canvas(w, h) {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.w = w;
	this.h = h;
	this.x = 0;
	this.y = 0;
	this.touch = false;
	this.top = 0;
	this.left = 0;
	this.scale = 1;
	this.ratio = 1;
}

/**
 * Abstract event handler
 * @param {String} e
 */
CP_Canvas.prototype.on = function(e) {};

/**
 * Bind canvas events
 * @returns {CP_Canvas}
 */
CP_Canvas.prototype.bind = function() {
	var self = this;
	this.canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
		self.x = (e.touches[0].pageX - self.left) / self.scale;
		self.y = (e.touches[0].pageY - self.top) / self.scale;
		self.touch = true;
		self.on('start');
	});
	this.canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
		self.x = (e.clientX - self.left) / self.scale;
		self.y = (e.clientY - self.top) / self.scale;
		self.touch = true;
		self.on('start');
	});
	this.canvas.addEventListener('touchmove', function(e) {
		e.preventDefault();
		self.x = (e.touches[0].pageX - self.left) / self.scale;
		self.y = (e.touches[0].pageY - self.top) / self.scale;
		self.on('move');
	});
	this.canvas.addEventListener('mousemove', function(e) {
		e.preventDefault();
		self.x = (e.clientX - self.left) / self.scale;
		self.y = (e.clientY - self.top) / self.scale;
		self.on('move');
	});
	this.canvas.addEventListener('touchend', function(e) {
		e.preventDefault();
		self.on('end');
		self.touch = false;
	});
	this.canvas.addEventListener('mouseup', function(e) {
		e.preventDefault();
		self.on('end');
		self.touch = false;
	});
	return this;
};

/**
 * Resize the canvas object
 * @returns {CP_Canvas}
 */
CP_Canvas.prototype.resize = function() {
	var width = document.body.clientWidth,
		height = document.body.clientHeight,
		ratio = window.devicePixelRatio || 1,
		scale = width / this.w > height / this.h ? height / this.h : width / this.w;
	this.left = Math.round((width - this.w * scale) / 2);
	this.top = Math.round((height - this.h * scale) / 2);
	if (width / height > this.w / this.h) {
		this.canvas.style.left = this.left + 'px';
		this.canvas.style.top = '0px'; 
	} else {
		this.canvas.style.top = this.top + 'px';
		this.canvas.style.left = '0px'; 
	}
	this.canvas.width = Math.round(this.w * scale * ratio);
	this.canvas.height = Math.round(this.h * scale * ratio);
	this.canvas.style.width = Math.round(this.w * scale) + 'px';
	this.canvas.style.height = Math.round(this.h * scale) + 'px';
	this.ctx.scale(scale * ratio, scale * ratio);
	this.scale = scale;
	this.ratio = ratio;
	return this;
};
