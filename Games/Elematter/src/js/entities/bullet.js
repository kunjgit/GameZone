/*==============================================================================

Bullet

==============================================================================*/

g.B = function() {
	this.dom = g.cE( g.qS( '.s-play' ), 'bullet' );
};

g.B.prototype.init = function( opt ) {
	g.merge( this, opt );
	this.guid = g.guid++;
	this.size = 6;
	this.radius = this.size / 2;
	this.x -= this.radius; // actual x
	this.y -= this.radius; // actual y
	this.cx = 0; // center x
	this.cy = 0; // center y
	this.rx = 0; // render x
	this.ry = 0; // render y
	this.vx = 0; // velocity x
	this.vy = 0; // velocity y
	this.dx = 0; // dist x to target
	this.dy = 0; // dist y to target
	this.dist = 0; // dist to target
	this.angle = 0; // angle to target
	this.accel = 0.1;
	this.speed = 0;
	this.updateCoords();
	g.removeClass( this.dom, 'type-e type-w type-a type-f' );
	g.addClass( this.dom, 'type-' + this.type );
	g.css( this.dom, {
		'width': this.size + 'px',
		'height': this.size + 'px',
		'transform': 'translate3d(-999px, -999px, 0)'
	});
};

g.B.prototype.step = function() {
	if( this.state.isPlaying ) {
		var target = this.state.enemies.getByPropVal( 'guid', this.target );
		if( target ) {
			this.dx = target.cx - this.cx;
			this.dy = target.cy - this.cy;
			this.dist = Math.sqrt( this.dx * this.dx + this.dy * this.dy );
			this.angle = Math.atan2( this.dy, this.dx );
			this.vx = Math.cos( this.angle ) * this.speed;
			this.vy = Math.sin( this.angle ) * this.speed;
			this.speed += this.accel;

			if( Math.abs( this.dist ) > this.speed ) {
				this.x += this.vx;
				this.y += this.vy;
			} else {
				var dmg = this.dmg;
				if( target.type == this.counters ) {
					dmg *= 1.5;
				}
				g.audio.play( 'hit-' + this.type );
				target.receiveDamage( dmg, this.slow );
				this.destroy();
			}
		} else {
			this.destroy();
		}
	}

	this.updateCoords();
};

g.B.prototype.draw = function() {
	g.css( this.dom, 'transform', 'translate3d(' + this.rx + 'px , ' + this.ry + 'px, 0) rotate(' + ( this.angle + Math.PI / 4 ) + 'rad)' );
};

g.B.prototype.destroy = function() {
	g.css( this.dom, 'transform', 'translate3d(-999px , -999px, 0)');
	this.state.bullets.release( this );
};

g.B.prototype.updateCoords = function() {
	this.cx = this.x + this.size / 2;
	this.cy = this.y + this.size / 2;
	this.rx = this.x;
	this.ry = this.y;
};