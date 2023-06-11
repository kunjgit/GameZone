/*==============================================================================

Tower

==============================================================================*/

g.To = function( opt ) {
	g.merge( this, opt );
	this.init();
};

g.To.prototype.init = function() {
	this.guid = g.guid++;
	this.data = g.data.towers[ this.type ];
	this.lvl = 0;
	this.counters = this.data.counters;
	this.spent = this.data.stats[ 0 ].cst;

	this.cx = this.col * g.size + g.size / 2; // center x
	this.cy = this.row * g.size + g.size / 2; // center y
	
	this.turretRotation = 0;

	this.setupDom();
	this.setupEvents();
	this.setStats();
};

g.To.prototype.step = function() {
	var angle = this.state.globalTurretRotation;
	if( this.target ) {
		var dx = this.target.cx - this.cx,
			dy = this.target.cy - this.cy,
			dist = Math.sqrt( dx * dx + dy * dy );
		angle = Math.atan2( dy, dx ) + Math.PI * 0.75;
	}
	this.turretRotation = angle;

	if( this.state.isPlaying ) {
		this.fire();

		if( this.bulletTick < this.rte ) {
			this.bulletTick++;
		}
	}
};

g.To.prototype.draw = function() {
	g.css( this.dom.slab, 'transform', 'rotate(' + this.state.globalSlabRotation+ 'rad)' );
	g.css( this.dom.turret, 'transform', 'rotate(' + this.turretRotation + 'rad)' );
	if( this.target ) {
		g.addClass( this.dom.wrap, 'targeting' );
		g.css( this.dom.core, 'transform', 'scale(' + (0.25 + Math.sin( this.state.tick * 0.75 ) * 0.05) + ')' );
	} else {
		g.css( this.dom.core, 'transform', 'scale(' + this.state.globalCoreScale + ')' );
		g.removeClass( this.dom.wrap, 'targeting' );
	}
};

g.To.prototype.setStats = function() {
	var stats = this.data.stats[ this.lvl ];
	this.dmg = stats.dmg;
	this.rng = stats.rng;
	this.rte = stats.rte;

	this.bulletTick = this.rte;

	g.css( this.dom.range, {
		'width': this.rng * 2 + 'px',
		'height': this.rng * 2 + 'px'
	});
};

g.To.prototype.upgrade = function() {
	this.lvl++;
	this.spent += this.data.stats[ this.lvl ].cst;
	this.setStats();
	g.removeClass( this.dom.wrap, 't-lvl-0 t-lvl-1 t-lvl-2' );
	g.addClass( this.dom.wrap, 't-lvl-' + this.lvl );
};

g.To.prototype.reclaim = function() {
	this.state.setFragments( Math.ceil( this.spent * 0.75 ) );
	this.state.towers.remove( this );
	this.state.dom.state.removeChild( this.dom.wrap );
};

g.To.prototype.getTarget = function() {
	var enemies = this.state.enemies,
		enemiesInRange = [];
	// if enemies are on the map
	if( enemies.length ) {
		// loop over enemies to get which ones are in range
		enemies.each( function( enemy, i, collection ) {
			var dist = g.distance( this.cx, this.cy, enemy.cx, enemy.cy );
			if( this.rng + enemy.radius > dist ) {
				enemiesInRange.push( enemy );
			}
		}, 1, this );
		// if enemies are in range
		if( enemiesInRange.length ) {
			if( this.type =='w' ) {
				// water tower, which slows, so pick a random target for best use
				this.target = enemiesInRange[ Math.floor( g.rand( 0, enemiesInRange.length ) ) ];
			} else {
				enemiesInRange.sort(function( a, b ) {
					return a.distanceTraveled - b.distanceTraveled;
				});
				this.target = enemiesInRange.pop();
			}
		} else {
			this.target = null;
		}
	} else {
		this.target = null;
	}
};

g.To.prototype.fire = function() {
	// if we can fire a bullet at current rate
	if( this.bulletTick >= this.rte ) {
		this.getTarget();
		// if this tower has a target enemy
		if( this.target ) {
			g.audio.play( 'fire-' + this.type );
			this.bulletTick = 0;
			var slow = 0;
			if( this.type == 'w' ) {
				slow = 20 + this.lvl * 20;
			}
			this.state.bullets.create({
				state: this.state,
				type: this.type,
				counters: this.counters,
				dmg: this.dmg,
				target: this.target.guid,
				x: this.cx,
				y: this.cy,
				slow: slow
			});
		}
	}
};

g.To.prototype.setupDom = function() {
	this.dom = {};
	this.dom.wrap   = g.cE( this.state.dom.state, 't-wrap t-lvl-' + this.lvl + ' t-type-' + this.type );
	this.dom.tower  = g.cE( this.dom.wrap, 't-tower' );
	this.dom.slab   = g.cE( this.dom.tower, 't-slab' );
	this.dom.turret = g.cE( this.dom.tower, 't-turret' );
	this.dom.base   = g.cE( this.dom.tower, 't-base' );
	this.dom.core   = g.cE( this.dom.tower, 't-core' );
	this.dom.range  = g.cE( this.dom.tower, 't-range' );
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-0' );
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-1' );
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-2' );
	g.css( this.dom.wrap, 'transform', 'translate3d(' + this.col * g.size + 'px , ' + this.row * g.size + 'px, 0 )');
};

g.To.prototype.setupEvents = function() {
	g.on( this.dom.wrap, 'click', this.onClick, this );
};

g.To.prototype.onClick = function() {
	if( !this.state.isTowerMenuOpen ) {
		this.state.showTowerMenu( this );
		this.state.lastClickedTowerId = this.guid;
		this.state.updateTowerMenuAvailability();
		g.addClass( this.dom.wrap, 'selected' );
	}
};