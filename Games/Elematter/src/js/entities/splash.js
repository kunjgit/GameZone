/*==============================================================================

Splash

==============================================================================*/

/*g.S = function() {
	this.dom = g.cE( g.qS( '.s-play' ), 'splash' );
};

g.S.prototype.init = function( opt ) {
	g.merge( this, opt );
	this.guid = g.guid++;
	this.size = 100;
	this.radius = this.size / 2;
	this.x -= this.radius; // actual x
	this.y -= this.radius; // actual y
	this.cx = 0; // center x
	this.cy = 0; // center y
	this.rx = 0; // render x
	this.ry = 0; // render y
	this.scale = 1;
	this.scaleChange = 0;
	this.scaleAccel = 0.001;
	this.updateCoords();
	g.addClass( this.dom, 'splash' );
	g.css( this.dom, {
		'width': this.size + 'px',
		'height': this.size + 'px',
		'transform': 'translate3d(-999px, -999px, 0)'
	});
};

g.S.prototype.step = function() {
	if( this.state.isPlaying ) {
		this.scaleChange += this.scaleAccel;
		this.scale -= this.scaleChange;
		if( this.scale <= 0 ) {
			this.destroy();
		}
	}
};

g.S.prototype.draw = function() {
	g.css( this.dom, 'transform', 'translate3d(' + this.rx + 'px , ' + this.ry + 'px, 0) scale(' + this.scale + ')' );
};

g.S.prototype.activate = function() {
	this.state.dom.state.appendChild( this.dom );
};

g.S.prototype.destroy = function() {
	g.css( this.dom, 'transform', 'translate3d(-999px , -999px, 0)');
	this.state.splashes.release( this );
};

g.S.prototype.updateCoords = function() {
	this.cx = this.x + this.size / 2;
	this.cy = this.y + this.size / 2;
	this.rx = this.x;
	this.ry = this.y;
};*/