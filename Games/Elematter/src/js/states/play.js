/*==============================================================================

Play State

==============================================================================*/

var StatePlay = function(){};

/*==============================================================================

Initialize

==============================================================================*/

StatePlay.prototype.init = function() {
	// general booleans
	this.isPlaying = 0;
	this.isBuildMenuOpen = 0;
	this.isTowerMenuOpen = 0;
	this.isBuildable = 0;

	// state vars
		// general
		this.won = 0;
		this.tick = 0;
		this.hasPlayed = 0;
		this.speed = 1;
		// waves
		this.wave = 0;
		this.waveNext = this.wave + 1;
		this.wavesTotal = g.data.waves.length;
		// lives
		this.livesTotal = 13;
		this.lives = this.livesTotal;
		// fragments
		this.fragments = 500;
		this.fragmentsDisplay = this.fragments;
		this.fragmentsDisplayLast = 0;
		this.sendEarlyAmt = 0;
		// tiles
		this.lastClickedTile = null;
		// global draw vars
		this.globalSlabRotation = 0;
		this.globalTurretRotation = 0;
		this.globalCoreScale = 0.1;
		// towers
		this.lastClickedTowerId = null;
		this.towers = new g.Group();
		// waves
		this.waves = new g.Group();
		this.activeWaves = new g.Group();
		// enemies
		this.enemies = new g.Group();
		// bullets
		this.bullets = new g.Pool( g.B, 20 );

	// setup dom
		this.dom = {};
		// get state dom
		this.dom.state = g.qS( '.s-play' );
		// get ui button dom
		this.dom.button   = g.qS( '.b' );
		this.dom.play     = g.qS( '.b-play' );
		this.dom.x1       = g.qS( '.b-x1' );
		this.dom.x2       = g.qS( '.b-x2' );
		this.dom.x3       = g.qS( '.b-x3' );
		this.dom.send     = g.qS( '.b-send' );
		this.dom.sendText = g.qS( '.send' );
		// get ui display dom
		this.dom.lives     = g.qS( '.d-lives' );
		this.dom.fragments = g.qS( '.d-fragments' );
		this.dom.wave      = g.qS( '.d-wave' );
		this.dom.next      = g.qS( '.d-next' );
		this.dom.eWave     = g.qS( '.w-e' );
		this.dom.wWave     = g.qS( '.w-w' );
		this.dom.aWave     = g.qS( '.w-a' );
		this.dom.fWave     = g.qS( '.w-f' );
		// get build menu dom
		this.dom.buildMenuWrap = g.qS( '.build-menu-wrap' );
		this.dom.buildMenu     = g.qS( '.build-menu' );
		this.dom.buildButton   = g.qS( '.build-button' );
		this.dom.buildDefault  = g.qS( '.build-d' );
		this.dom.buildEarth    = g.qS( '.build-e' );
		this.dom.buildWater    = g.qS( '.build-w' );
		this.dom.buildAir      = g.qS( '.build-a' );
		this.dom.buildFire     = g.qS( '.build-f' );
		this.dom.buildCost     = g.qS( '.build-cost' );
		this.dom.buildType     = g.qS( '.build-type' );
		this.dom.buildDmg      = g.qS( '.build-dmg' );
		this.dom.buildRng      = g.qS( '.build-rng' );
		this.dom.buildRte      = g.qS( '.build-rte' );
		// get tower menu dom
		this.dom.towerMenuWrap  = g.qS( '.tower-menu-wrap' );
		this.dom.towerMenu      = g.qS( '.tower-menu' );
		this.dom.towerButton    = g.qS( '.tower-button' );
		this.dom.towerHighlight = g.qS( '.tower-button.highlight' );
		this.dom.towerUpgrade   = g.qS( '.tower-button.upgrade' );
		this.dom.towerReclaim   = g.qS( '.tower-button.reclaim' );
		this.dom.towerCost      = g.qS( '.tower-cost' );
		this.dom.towerLabel     = g.qS( '.tower-label' );
		this.dom.towerDmg       = g.qS( '.tower-dmg' );
		this.dom.towerRng       = g.qS( '.tower-rng' );
		this.dom.towerRte       = g.qS( '.tower-rte' );
		this.dom.towerDmgNext   = g.qS( '.tower-dmg-next' );
		this.dom.towerRngNext   = g.qS( '.tower-rng-next' );
		this.dom.towerRteNext   = g.qS( '.tower-rte-next' );

	// events
		// set general events
		document.onselectstart = function(){ return false; };
		g.on( window, 'click', this.onWinClick, this );
		// set ui buttons events
		g.on( this.dom.play, 'click', this.onPlayClick, this );
		g.on( this.dom.x1, 'click', this.onX1Click, this );
		g.on( this.dom.x2, 'click', this.onX2Click, this );
		g.on( this.dom.x3, 'click', this.onX3Click, this );
		g.on( this.dom.send, 'click', this.onSendClick, this );
		for( var i = 0, length = this.dom.button.length; i < length; i++ ) {
			var button = this.dom.button[ i ];
			g.on( button, 'mouseenter', this.onButtonMouseenter, this );
			g.on( button, 'click', this.onButtonClick, this );
		}
		// set build menu events
		g.on( this.dom.buildMenuWrap, 'click', this.onBuildMenuWrapClick, this );
		g.on( this.dom.buildMenu, 'click', this.onBuildMenuClick, this );
		for( var j = 0, lengthj = this.dom.buildButton.length; j < lengthj; j++ ) {
			var buildButton = this.dom.buildButton[ j ];
			g.on( buildButton, 'mouseenter', this.onBuildButtonMouseenter, this );
			g.on( buildButton, 'mouseleave', this.onBuildButtonMouseleave, this );
			g.on( buildButton, 'click', this.onBuildButtonClick, this );
		}
		// set tower menu events
		g.on( this.dom.towerMenuWrap, 'click', this.onTowerMenuWrapClick, this );
		g.on( this.dom.towerMenu, 'click', this.onTowerMenuClick, this );
		for( var k = 0, lengthk = this.dom.towerButton.length; k < lengthk; k++ ) {
			var towerButton = this.dom.towerButton[ k ];
			g.on( towerButton, 'mouseenter', this.onTowerButtonMouseenter, this );
			g.on( towerButton, 'mouseleave', this.onTowerButtonMouseleave, this );
			g.on( towerButton, 'click', this.onTowerButtonClick, this );
		}

	// initialization
		this.updateLife();
		// setup tiles
		this.setupTiles();
		// setup waves
		this.setupWaves();
		// one step for init
		this.isPlaying = 1;
		this.step();
		this.isPlaying = 0;
};

/*==============================================================================

Step

==============================================================================*/

StatePlay.prototype.step = function() {
	// update fragments
	this.updateFragments();

	for( var i = 0; i < this.speed; i++ ) {
		// update global properties
		this.updateGlobals();
		// towers
		this.towers.each( 'step' );
		// enemies
		this.enemies.each( 'step' );
		// bullets
		this.bullets.each( 'step' );
		// waves
		this.updateWaves();
	}
	this.tick++;
};

/*==============================================================================

Draw

==============================================================================*/

StatePlay.prototype.draw = function() {
	// towers
	this.towers.each( 'draw' );
	// enemies
	this.enemies.each( 'draw' );
	// bullets
	this.bullets.each( 'draw' );
};

/*==============================================================================

General Events

==============================================================================*/

StatePlay.prototype.onWinClick = function() {
	// if the area outside of the game is clicked
	// and the build menu is open, hide it
	if( this.isBuildMenuOpen ) {
		g.audio.play( 'ui-l' );
		this.hideBuildMenu();
	}
	// and the tower menu is open, hide it
	if( this.isTowerMenuOpen ) {
		g.audio.play( 'ui-l' );
		this.hideTowerMenu();
	}
};

/*==============================================================================

Button Events

==============================================================================*/

StatePlay.prototype.onButtonMouseenter = function() {
	g.audio.play( 'ui-m' );
};

StatePlay.prototype.onButtonClick = function() {
	g.audio.play( 'ui-h' );
};

StatePlay.prototype.onPlayClick = function() {
	if( !this.hasPlayed ) {
		this.advanceWave();
		this.hasPlayed = 1;
	}
	this.isPlaying = !this.isPlaying;
	if( this.isPlaying ) {
		g.addClass( g.dom, 'playing' );
	} else {
		g.removeClass( g.dom, 'playing' );
	}
};

StatePlay.prototype.onX1Click = function() {
	this.speed = 1;
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x1' );
};

StatePlay.prototype.onX2Click = function() {
	this.speed = 2;
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x2' );
};

StatePlay.prototype.onX3Click = function() {
	this.speed = 3;
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x3' );
};

StatePlay.prototype.onSendClick = function() {
	if( this.isPlaying ) {
		this.setFragments( this.sendEarlyAmt );
		this.advanceWave();
	}
};

/*==============================================================================

Map/Tile Generation

==============================================================================*/

StatePlay.prototype.setupTiles = function() {
	// create a full grid of tiles, broken up into two separate arrays
	// they can be base or be path
	this.baseTiles = new g.Group();
	this.pathTiles = new g.Group();
	for( var x = 0; x < g.cols; x++ ) {
		for( var y = 0; y < g.rows; y++ ) {
			var isPath = this.isPath( x, y ),
				classes = [ 'tile' ];
			if( isPath ) {
				classes += ' path';
			}
			var tile = new g.Ti({
				state: this,
				col: x,
				row: y,
				isPath: isPath || 0,
				classes: classes,
				horizontal: x > g.cols / 2 ? 'e' : 'w',
				vertical: y > g.rows / 2 ? 's' : 'n'
			});
			if( isPath ) {
				this.pathTiles.push( tile );
			} else {
				this.baseTiles.push( tile );
			}
		}
	}
};

StatePlay.prototype.isPath = function( x, y ) {
	// based on the map waypoint data
	// determine whether a tile is a base tile or a path tile
	var mapLength = g.data.map.length;
	for( var i = 0; i < mapLength - 1; i++ ) {
		var p1 = g.data.map[ i ],
			p2 = g.data.map[ i + 1 ],
			minX = Math.min( p1[ 0 ], p2[ 0 ] ),
			minY = Math.min( p1[ 1 ], p2[ 1 ] ),
			maxX = Math.max( p1[ 0 ], p2[ 0 ] ),
			maxY = Math.max( p1[ 1 ], p2[ 1 ] );
		if( x >= minX && x <= maxX && y >= minY && y <= maxY ) {
			return 1;
		}
	}
};

/*==============================================================================

Globals

==============================================================================*/

StatePlay.prototype.updateGlobals = function() {
	this.globalSlabRotation -= 0.025;
	this.globalTurretRotation += 0.025;
	this.globalCoreScale = 0.3 + Math.sin( this.tick / 30 ) * 0.15;
};

/*==============================================================================

Lives

==============================================================================*/

StatePlay.prototype.removeLife = function() {
	g.audio.play( 'life' );
	this.lives--;
	this.updateLife();
	if( !this.lives ) {
		g.audio.play( 'gameover' );
		setTimeout( function() {
			alert( 'You lost.' );
			location.reload();
		}, 1000 );
	}
};

StatePlay.prototype.updateLife = function() {
	g.text( this.dom.lives, Math.max( 0, this.lives ) + ' / ' + this.livesTotal );
};

/*==============================================================================

Fragments / Cash / Spending / Money / Currency

==============================================================================*/

StatePlay.prototype.setFragments = function( amt ) {
	this.fragments += amt;
	// update build menu availability
	this.updateBuildMenuAvailability();
	// update tower menu availability
	this.updateTowerMenuAvailability();
	// update tower upgrade availability
	this.updateTowerUpgradeAvailability();
};

StatePlay.prototype.updateFragments = function() {
	this.fragmentsDisplay += ( this.fragments - this.fragmentsDisplay ) * 0.2;
	if( Math.round( this.fragmentsDisplay ) != Math.round( this.fragmentsDisplayLast ) ) {
		g.text( this.dom.fragments, g.formatCommas( this.fragmentsDisplay ) );
	}
	this.fragmentsDisplayLast = this.fragmentsDisplay;
};

/*==============================================================================

Waves

==============================================================================*/

StatePlay.prototype.setupWaves = function() {
	// loop over each wave data
	for( var i = 0, ilength = g.data.waves.length; i < ilength; i++ ) {
		var wave = g.data.waves[ i ],
			newWave = new g.W({
				state: this,
				num: i
			});
		// loop over each set in that wave
		for( var j = 0, jlength = wave.length; j < jlength; j++ ) {
			var set = wave[ j ].split( ' ' ),
				type = set[ 0 ],
				count = set[ 1 ],
				isBoss = set.length >= 3 ? 1 : 0;
			// loop to create the correct amount of enemies for that set
			for( var k = 0, klength = count; k < klength; k++ ) {
				var enemy = new g.E({
					state: this,
					type: type,
					isBoss: isBoss,
					wave: i
				});
				newWave.enemies.push( enemy );
				newWave.counts[ type ]++;
			}
		}
		this.waves.push( newWave );
	}
};

StatePlay.prototype.updateWaves = function() {
	// update early send amt
	if( this.isPlaying ) {
		if( this.waves.length ) {
			this.sendEarlyAmt -= ( 50 + ( 10 * this.wave ) ) * 0.0003;
			this.sendEarlyAmt = Math.max( 0, this.sendEarlyAmt );
		} else {
			this.sendEarlyAmt = 0;
		}
		g.text( this.dom.sendText, Math.ceil( this.sendEarlyAmt ) );
	}

	// step each active wave
	this.activeWaves.each( 'step' );

	// move next wave to active if active waves are empty
	if( !this.activeWaves.length && this.waves.length && !this.enemies.length ) {
		this.advanceWave();
	}

	// check if active waves are empty
	this.activeWaves.each( function( wave, i , collection ) {
		if( !wave.enemies.length ) {
			this.activeWaves.removeAt( i );
		}
	}, 0, this );

	// check win
	if( !this.activeWaves.length && !this.waves.length && !this.enemies.length && !this.won ) {
		this.won = 1;
		var score = ( this.lives * 100 ) + ( this.fragments );
		setTimeout( function() {
			alert( 'You won! Based on lives and elemental fragments left, your score is: ' + g.formatCommas( score ) );
			location.reload();
		}, 1000 );
	}
};

StatePlay.prototype.advanceWave = function() {
	// what a mess, dealing with waves
	if( this.hasPlayed ) {
		if( this.waves.length ) {
			this.activeWaves.push( this.waves.shift() );
			g.text( this.dom.wave, ( this.wave + 1 ) + ' / ' + this.wavesTotal );
			this.wave++;
			g.audio.play( 'wave' );
			if( this.wave < this.wavesTotal ) {
				this.waveNext++;
				var waveNext = this.waves.getAt( 0 );
				this.sendEarlyAmt = 50 + ( 10 * this.wave );
				g.text( this.dom.eWave, waveNext.counts.e );
				g.text( this.dom.wWave, waveNext.counts.w );
				g.text( this.dom.aWave, waveNext.counts.a );
				g.text( this.dom.fWave, waveNext.counts.f );
			} else {
				this.waveNext = null;
				g.text( this.dom.eWave, '--' );
				g.text( this.dom.wWave, '--' );
				g.text( this.dom.aWave, '--' );
				g.text( this.dom.fWave, '--' );
				g.addClass( g.dom, 'no-more-waves' );
			}
		}
	} else {
		var next = this.waves.getAt( 0 );
		g.text( this.dom.eWave, next.counts.e );
		g.text( this.dom.wWave, next.counts.w );
		g.text( this.dom.aWave, next.counts.a );
		g.text( this.dom.fWave, next.counts.f );
		g.text( this.dom.wave, this.wave + ' / ' + this.wavesTotal );
	}
};

/*==============================================================================

Build Menu

==============================================================================*/

StatePlay.prototype.showBuildMenu = function( tile ) {
	g.audio.play( 'ui-open' );
	this.isBuildMenuOpen = 1;
	this.isBuildable = 1;
	g.addClass( g.dom, 'build-menu-open' );

	// set the proper positioning to prevent overflow of main game wrap
	g.removeClass( g.dom, 'pos-n pos-e pos-s pos-w' );
	g.addClass( g.dom, 'pos-' + tile.horizontal + ' ' + 'pos-' + tile.vertical );

	// determine proper coordinates
	var x = tile.col * g.size - 20,
		y = tile.row * g.size - 20;

	if( tile.horizontal == 'e' ) {
		x -= 200;
	}

	// set position based on tile
	g.css( this.dom.buildMenu, 'transform', 'translateX(' + x + 'px) translateY(' + y + 'px)' );

	// reset anim on pulsing default box
	g.resetAnim( this.dom.buildDefault );
};

StatePlay.prototype.hideBuildMenu = function() {
	this.isBuildMenuOpen = 0;
	g.removeClass( g.dom, 'build-menu-open' );
};

StatePlay.prototype.updateBuildMenuText = function( type ) {
	// get the tower data based on type
	var data = g.data.towers[ type ];
	// set all text nodes
	g.text( this.dom.buildCost, data.stats[ 0 ].cst );
	g.text( this.dom.buildType, data.title );
	g.text( this.dom.buildDmg, data.dmg + ' ' + data.bonus );
	g.text( this.dom.buildRng, data.rng );
	g.text( this.dom.buildRte, data.rte );
	// reset classes and add proper type classes based on tower data
	g.removeClass( g.dom, 'hover-e hover-w hover-a hover-f' );
	g.addClass( g.dom, 'hover-build-button hover-' + type );
	g.removeClass( g.dom, 'dmg1 dmg2 dmg3 rng1 rng2 rng3 rte1 rte2 rte3' );

	// default to 1, or "low"
	var meterDmg = 1,
		meterRng = 1,
		meterRte = 1;

	// get meter values based on keyword descriptions
	if( data.dmg == 'Medium' ) {
		meterDmg = 2;
	} else if( data.dmg == 'High' ) {
		meterDmg = 3;
	}
	if( data.rng == 'Medium' ) {
		meterRng = 2;
	} else if( data.rng == 'High' ) {
		meterRng = 3;
	}
	if( data.rte == 'Medium' ) {
		meterRte = 2;
	} else if( data.rte == 'High' ) {
		meterRte = 3;
	}

	// set classes based on meter values
	g.addClass( g.dom, 'dmg' + meterDmg );
	g.addClass( g.dom, 'rng' + meterRng );
	g.addClass( g.dom, 'rte' + meterRte );
};

StatePlay.prototype.updateBuildMenuAvailability = function() {
	g.removeClass( g.dom, 'no-b-e no-b-w no-b-a no-b-f' );
	var classes = '';
	if( this.fragments < g.data.towers.e.stats[ 0 ].cst ) {
		classes += 'no-b-e ';
	}
	if( this.fragments < g.data.towers.w.stats[ 0 ].cst ) {
		classes += 'no-b-w ';
	}
	if( this.fragments < g.data.towers.a.stats[ 0 ].cst ) {
		classes += 'no-b-a ';
	}
	if( this.fragments < g.data.towers.f.stats[ 0 ].cst ) {
		classes += 'no-b-f ';
	}

	g.addClass( g.dom, classes );
};

StatePlay.prototype.onBuildMenuWrapClick = function( e ) {
	// if the outer wrap is clicked, close the build menu
	g.audio.play( 'ui-l' );
	this.hideBuildMenu();
};

StatePlay.prototype.onBuildMenuClick = function( e ) {
	// prevent any clicks from bubbling up to any other tiles or buttons
	e.stopPropagation();
};

StatePlay.prototype.onBuildButtonMouseenter = function( e ) {
	// set the build menu text based on the element that is hovered
	var type = g.attr( e.target, 'data-type' );
	if( type ) {
		g.audio.play( 'ui-m' );
		this.updateBuildMenuText( type );
	}
};

StatePlay.prototype.onBuildButtonMouseleave = function( e ) {
	// remove hover class, which fades out the description
	g.removeClass( g.dom, 'hover-build-button' );
};

StatePlay.prototype.onBuildButtonClick = function( e ) {
	var type = g.attr( e.target, 'data-type' );
	if( type ) {
		var cost = g.data.towers[ type ].stats[ 0 ].cst;
		if( cost <= this.fragments && this.isBuildable ) {
			g.audio.play( 'ui-h' );
			this.setFragments( -cost );
			var tile = this.lastClickedTile;
			var tower = new g.To({
				state: this,
				col: tile.col,
				row: tile.row,
				horizontal: tile.horizontal,
				vertical: tile.vertical,
				type: type
			});
			this.towers.push( tower );
			this.isBuildable = 0;
			this.hideBuildMenu();
			this.updateTowerUpgradeAvailability();
		}
	}
};

/*==============================================================================

Tower Menu

==============================================================================*/

StatePlay.prototype.showTowerMenu = function( tower ) {
	g.audio.play( 'ui-open' );
	this.isTowerMenuOpen = 1;
	g.addClass( g.dom, 'tower-menu-open' );

	// set the proper type class
	g.removeClass( g.dom, 't-menu-e t-menu-w t-menu-a t-menu-f' );
	g.addClass( g.dom, 't-menu-' + tower.type );

	// set the proper positioning to prevent overflow of main game wrap
	g.removeClass( g.dom, 'pos-n pos-e pos-s pos-w' );
	g.addClass( g.dom, 'pos-' + tower.horizontal + ' ' + 'pos-' + tower.vertical );

	// determine proper coordinates
	var x = tower.col * g.size - 20,
		y = tower.row * g.size - 20;

	if( tower.horizontal == 'e' ) {
		x -= 200;
	}

	// set position based on tile
	g.css( this.dom.towerMenu, 'transform', 'translateX(' + x + 'px) translateY(' + y + 'px)' );

	// reset anim on pulsing default box
	g.resetAnim( this.dom.towerHighlight );
};

StatePlay.prototype.hideTowerMenu = function() {
	this.isTowerMenuOpen = 0;
	g.removeClass( g.dom, 'tower-menu-open' );
	this.towers.each( function( tower ) {
		g.removeClass( tower.dom.wrap, 'selected' );
	}, 1, this );
};

StatePlay.prototype.updateTowerMenuText = function( button ) {
	var tower = this.getLastClickedTower();
	if( tower ) {
		var data = g.data.towers[ tower.type ];
		if( button == 'upgrade' ) {
			// upgrade button is hovered, get proper data
			g.addClass( g.dom, 'hover-tower-button hover-tower-upgrade' );
			// if not fully upgraded
			if( tower.lvl < 2 ) {
				g.text( this.dom.towerCost, data.stats[ tower.lvl + 1 ].cst );
				g.text( this.dom.towerLabel, 'Upgrade to Level ' + ( tower.lvl + 2 ) );
				g.text( this.dom.towerDmg, data.stats[ tower.lvl ].dmg );
				g.text( this.dom.towerRng, data.stats[ tower.lvl ].rng );
				g.text( this.dom.towerRte, 60 - data.stats[ tower.lvl ].rte );
				g.text( this.dom.towerDmgNext, data.stats[ tower.lvl + 1 ].dmg );
				g.text( this.dom.towerRngNext, data.stats[ tower.lvl + 1 ].rng );
				g.text( this.dom.towerRteNext, 60 - data.stats[ tower.lvl + 1 ].rte );
			} else {
				g.text( this.dom.towerCost, 'Maxed' );
				g.text( this.dom.towerLabel, data.title + ' Level ' + ( tower.lvl + 1 ) );
				g.text( this.dom.towerDmg, data.stats[ tower.lvl ].dmg );
				g.text( this.dom.towerRng, data.stats[ tower.lvl ].rng );
				g.text( this.dom.towerRte, 60 - data.stats[ tower.lvl ].rte );
				g.text( this.dom.towerDmgNext, 'Maxed' );
				g.text( this.dom.towerRngNext, 'Maxed' );
				g.text( this.dom.towerRteNext, 'Maxed' );
			}
		} else if( button == 'reclaim' ) {
			// sell button is hovered, get proper data
			g.addClass( g.dom, 'hover-tower-button hover-tower-reclaim' );
			g.text( this.dom.towerCost, '+' + Math.ceil( tower.spent * 0.75 ) );
			g.text( this.dom.towerLabel, 'Reclaim 75%' );
			g.text( this.dom.towerDmg, data.stats[ tower.lvl ].dmg );
			g.text( this.dom.towerRng, data.stats[ tower.lvl ].rng );
			g.text( this.dom.towerRte, 60 - data.stats[ tower.lvl ].rte );
		}
	}
};

StatePlay.prototype.updateTowerMenuAvailability = function() {
	var lastClickedTower = this.getLastClickedTower();
	if( lastClickedTower ) {
		g.removeClass( g.dom, 'no-upgrade maxed-upgrade' );
		var lvl = lastClickedTower.lvl;
		if( lvl == 2 ) {
			g.addClass( g.dom, 'no-upgrade maxed-upgrade' );
		} else {
			if( this.fragments < g.data.towers[ lastClickedTower.type ].stats[ lvl + 1 ].cst ) {
				g.addClass( g.dom, 'no-upgrade' );
			}
		}
	}
};

StatePlay.prototype.updateTowerUpgradeAvailability = function() {
	this.towers.each( function( tower ) {
		if( tower.lvl < 2 ) {
			if( this.fragments >= g.data.towers[ tower.type ].stats[ tower.lvl + 1 ].cst ) {
				tower.upgradable = 1;
				g.addClass( tower.dom.wrap, 'upgradable' );
			} else {
				tower.upgradable = 0;
				g.removeClass( tower.dom.wrap, 'upgradable' );
			}
		} else {
			tower.upgradable = 0;
			g.removeClass( tower.dom.wrap, 'upgradable' );
		}
	}, 0, this );
	
};

StatePlay.prototype.onTowerMenuWrapClick = function( e ) {
	// if the outer wrap is clicked, close the tower menu
	g.audio.play( 'ui-l' );
	this.hideTowerMenu();
};

StatePlay.prototype.onTowerMenuClick = function( e ) {
	// prevent any clicks from bubbling up to any other tiles or buttons
	e.stopPropagation();
};

StatePlay.prototype.onTowerButtonMouseenter = function( e ) {
	// set the tower menu text based on the button that is hovered
	g.audio.play( 'ui-m' );
	this.updateTowerMenuText( g.attr( e.target, 'data-action' ) );
};

StatePlay.prototype.onTowerButtonMouseleave = function( e ) {
	// remove hover class, which fades out the description
	g.removeClass( g.dom, 'hover-tower-button hover-tower-upgrade hover-tower-reclaim' );
};

StatePlay.prototype.onTowerButtonClick = function( e ) {
	g.audio.play( 'ui-h' );
	var action = g.attr( e.target, 'data-action' ),
		lastClickedTower = this.getLastClickedTower();
	if( action == 'upgrade') {
		if( lastClickedTower.upgradable ) {
			lastClickedTower.upgrade();
			this.setFragments( -g.data.towers[ lastClickedTower.type ].stats[ lastClickedTower.lvl ].cst );
			this.updateTowerMenuText( 'upgrade' );
		}
	} else if( action == 'reclaim' ) {
		lastClickedTower.reclaim();
		this.hideTowerMenu();
	}
};

StatePlay.prototype.getLastClickedTower = function() {
	if( this.lastClickedTowerId ) {
		return this.towers.getByPropVal( 'guid', this.lastClickedTowerId );
	}
};