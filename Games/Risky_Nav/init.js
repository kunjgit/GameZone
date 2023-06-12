'use strict';
/* jshint -W018 */


window.addEventListener( 'load', () => {


	/**
	 * Get a certain canvas element and its 2D context.
	 * @return {Array} Canvas and 2D context.
	 */
	function getCanvasAndCtx() {
		let canvas = document.createElement( 'canvas' );
		let ctx = canvas.getContext( '2d' );

		return [canvas, ctx];
	}


	/**
	 * Get a starting position for a monster.
	 * @param  {Char}    player
	 * @param  {number} [retry = 0]
	 * @return {number[]}
	 */
	function getMonsterStartPos( player, retry = 0 ) {
		let x = 2 + ~~( g.rnd() * ( g.mc - 4 ) );
		let y = 2 + ~~( g.rnd() * ( g.mr - 4 ) );
		let dtX = Math.abs( player.x - x );
		let dtY = Math.abs( player.y - y );

		// Minimum distance from player at spawn time.
		if( dtX < 10 && dtY < 10 ) {
			if( retry > 5 ) {
				return null;
			}

			return getMonsterStartPos( player, retry + 1 );
		}

		let index = y * g.mc + x;
		g.map[index] = 2;

		return [x, y];
	}


	/**
	 * Get a starting position for the player.
	 * It has to be at least a certain distance from
	 * the goal and there has to be a path to the
	 * goal. The game is not allowed to be impossible!
	 * @return {number[]}
	 */
	function getPlayerStartPos() {
		// Start close to the border.
		let r = g.rnd();
		let x = null;
		let y = null;

		// Start on the left.
		if( r < 0.33 ) {
			x = 2 + g.rnd() * 4;
			y = g.rnd() * ( g.mr - 4 );
		}
		// Start on the right.
		else if( r < 0.66 ) {
			x = g.mc - 2 - g.rnd() * 4;
			y = g.rnd() * ( g.mr - 4 );
		}
		// Start on the top.
		else {
			x = g.rnd() * ( g.mc - 4 );
			y = 2 + g.rnd() * 4;
		}

		x = ~~x;
		y = ~~y;

		let dtX = x - goal.x;
		let dtY = y - goal.y;
		let dist = Math.sqrt( dtX * dtX + dtY * dtY );

		// Invalid position: If too close to goal
		// or no path to the goal exists.
		if( dist < 50 || !PF.findGoal( x, y ) ) {
			return getPlayerStartPos();
		}

		let index = y * g.mc + x;

		// Make sure the starting point is walkable.
		g.map[index] = 2;

		return [x, y];
	}


	/**
	 * Update the tile and map pixel size.
	 */
	function updateContainSize() {
		// Adjust tile size so the whole map
		// is contained in the browser window.
		let twContainX = ~~( g.ww / g.mc );
		let twContainY = ~~( g.wh / g.mc );
		g.tw = Math.max( g.tw, Math.max( twContainX, twContainY ) );

		g.mw = g.mc * g.tw; // map width [px]
		g.mh = g.mr * g.tw; // map height [px]
	}


	/**
	 * Create the canvas image for the ground.
	 */
	function createGroundMap() {
		g.groundCanvas.width = g.mc;
		g.groundCanvas.height = g.mr;
		g.groundCtx.imageSmoothingEnabled = false;

		let tiles = [];
		let y = 0;
		let seed = 1;

		g.map.forEach( ( v, i ) => {
			let x = i % g.mc;
			let green = 90 + g.rndSeed( seed++ ) * 20;
			let c = `rgb(18,${~~green},40)`;

			// Stone.
			if( v & 4 ) {
				c = '#282828';
			}
			// Water border.
			else if( !x || !y || x == g.mc - 1 || y == g.mr - 1 ) {
				let blue = 140 + g.rndSeed( seed++ ) * 60;
				c = `rgb(30,90,${~~blue})`;
				g.map[i] = 16;
			}

			g.groundCtx.fillStyle = c;
			g.groundCtx.fillRect( x, y, 1, 1 );

			y += !( ++i % g.mc );
		} );
	}


	/**
	 * Create the canvas image for the fog/shadow.
	 */
	function createFogMap() {
		g.fogCanvas.width = g.mc;
		g.fogCanvas.height = g.mr;
		g.fogCtx.imageSmoothingEnabled = false;

		let fogMapWidth = Math.ceil( g.ww / g.tw );
		let fogMapHeight = Math.ceil( g.wh / g.tw );

		for( let y = 0; y < fogMapHeight; y++ ) {
			for( let x = 0; x < fogMapWidth; x++ ) {
				// Euclidean distance from origin.
				let de = Math.sqrt( x * x + y * y );

				let f = ( de < 2 ) ? 0 : Math.min( 1.15 - Math.min( 3 / de, 1 ), 1 );
				g.fogCtx.fillStyle = `rgba(0,0,0,${f})`;
				g.fogCtx.fillRect( x, y, 1, 1 );
			}
		}
	}


	// Re-scale content if winow size changes.
	let resizeTimeout = 0;

	window.onresize = () => {
		// Wait a bit with resizing, because the
		// event fires quite often while resizing
		// the window per mouse.
		clearTimeout( resizeTimeout );

		resizeTimeout = setTimeout( () => {
			g.ww = window.innerWidth;
			g.wh = window.innerHeight;

			updateContainSize();
			createGroundMap();
			createFogMap();

			k.canvas.width = g.ww;
			k.canvas.height = g.wh;
			k.context.imageSmoothingEnabled = false;

			// Before the game has been started by
			// the player, but the game loop is ready.
			if( loop && loop.isStopped ) {
				loop.render();
			}
		}, 200 );
	};


	// Global object to use as shortcut
	// for some variables and functions.
	window.g = {
		isAtGoal: false,
		isGameOver: false,
		isOnline: false,
		started: false,
		rnd: Math.random,
		rndSeed: ( seed ) => {
		    let x = Math.sin( seed ) * 10000;
		    return x - Math.floor( x );
		},
		tw: 48, // default tile width (and height) [px]
		ww: window.innerWidth, // window width
		wh: window.innerHeight // window height
	};

	// Random map size.
	g.mc = 128 + ~~( g.rnd() * 128 ); // number of map columns
	g.mr = 128 + ~~( g.rnd() * 128 ); // number of map rows

	window.k = kontra;

	updateContainSize();


	// Generate map.
	let map = new Array( g.mc * g.mr );
	g.map = map.fill( 2 );


	// Place stones. ~6% of map should be stone.
	let numStones = map.length * 0.06;

	while( numStones-- > 0 ) {
		map[~~( g.rnd() * map.length )] = 4;
	}

	// Place the goal.
	// Make sure it has some minimum
	// margin to the map borders.

	let goal = {
		x: 4 + ~~( g.rnd() * ( g.mc - 8 ) ),
		y: 4 + ~~( g.rnd() * ( g.mr - 8 ) )
	};
	map[goal.y * g.mc + goal.x] = 8;

	// Reduce risk of being walled in by
	// turning the fields around into grass.
	map[( goal.y - 1 ) * g.mc + goal.x] = 2;
	map[( goal.y + 1 ) * g.mc + goal.x] = 2;
	map[goal.y * g.mc + goal.x - 1] = 2;
	map[goal.y * g.mc + goal.x + 1] = 2;


	// Generate static ground. For performance
	// reasons render all the tiles only once
	// and create a new image, which is then used
	// and just moved around.

	[g.groundCanvas, g.groundCtx] = getCanvasAndCtx( 'ground' );
	createGroundMap();


	// Now create a fog overlay.
	// The generated image will only be 1/4 and
	// will be to the bottom right of the player.
	//
	// We will then render it 4 times and just
	// flip it around to cover the other sides.

	[g.fogCanvas, g.fogCtx] = getCanvasAndCtx( 'fog' );
	createFogMap();


	// Generate the path finding map
	// with the goal as static target.
	PF.generateMap( goal.x, goal.y );


	// Initialize the main canvas.
	k.init();
	k.canvas.width = g.ww;
	k.canvas.height = g.wh;
	k.context.imageSmoothingEnabled = false;

	let [pStartX, pStartY] = getPlayerStartPos();
	let player = new Char( pStartX, pStartY );

	Keys.init();

	// Toggle [o]nline mode -> toggle navigation and monster behaviour
	Keys.on( 79, () => {
		if( g.started ) {
			g.isOnline = !g.isOnline;
		}
	} );

	// Source area for fog images.
	let sourceCut = [1, 1, g.mc - 1, g.mr - 1];

	let ctx = k.context;
	let pathColor = '#6BBEE1';

	// Place monsters. ~0.2% of map should be monsters.
	let numMonsters = map.length * 0.002;
	let monsters = [];

	for( let i = 0; i < numMonsters; i++ ) {
		let pos = getMonsterStartPos( player );

		if( pos ) {
			monsters.push( new Char( ...pos, true ) );
		}
	}

	numMonsters = monsters.length;

	let playerImg = document.getElementById( 'p' );
	let monsterImg = document.getElementById( 'm' );
	let variousImg = document.getElementById( 'v' );

	player.path = PF.findGoal( player.x, player.y );

	// Game over text.
	let gameOverTexts = [
		'A gnashing of teeth.',
		'Ah, that was… a little unsatisfying.',
		'Stared at the phone for too long?',
		'Offline again.'
	];
	let gotMaxIndex = gameOverTexts.length - 1;
	let ot = document.getElementById( 'ot' );
	ot.textContent = gameOverTexts[Math.round( g.rnd() * gotMaxIndex )];

	let lastUpdate = 0;
	g.dt = 1 / 60;

	let loop = k.gameLoop( {

		update: ( dt ) => {
			if( lastUpdate ) {
				g.dt = performance.now() - lastUpdate;
			}

			lastUpdate = performance.now();

			// Player reached the goal.
			if( player.x == goal.x && player.y == goal.y && !g.isAtGoal ) {
				g.isAtGoal = true;
				g.isOnline = false;
				loop.stop();
				loop.render(); // One last render pass to hide the player.
				document.getElementById( 'w' ).style.display = 'flex';

				return;
			}

			// Too much damage, dead.
			if( player.dmg > 1 ) {
				g.isGameOver = true;
				g.isOnline = false;
				document.getElementById( 'over' ).style.display = 'flex';
			}
			else {
				let arrow = Keys.getArrowKey();

				// Down.
				if( arrow == 40 ) {
					player.mv( 0, 1, Date.now() );
				}
				// Left.
				else if( arrow == 37 ) {
					player.mv( -1, 0, Date.now() );
				}
				// Right.
				else if( arrow == 39 ) {
					player.mv( 1, 0, Date.now() );
				}
				// Up.
				else if( arrow == 38 ) {
					player.mv( 0, -1, Date.now() );
				}
			}

			player.update( dt );

			for( let i = 0; i < numMonsters; i++ ) {
				let m = monsters[i];
				m.updateMonster( dt, player );

				if( !g.isGameOver && m.x == player.x && m.y == player.y ) {
					player.takeDamage();
				}
			}
		},

		render: () => {
			let centerLimitW = g.ww - g.mw;
			let centerLimitH = g.wh - g.mh;
			let twHalf = ~~( g.tw / 2 );
			let lineWidth = ~~( g.tw / 6 );
			let dest = [0, 0, g.mw, g.mh];
			let destCut = [g.tw, g.tw, g.mw - g.tw, g.mh - g.tw];

			let playerX_px = player.x_px;
			let playerY_px = player.y_px;

			// Game could end while player px position
			// is not aligned with a tile. Which would
			// make the fog look bad.
			if( g.isAtGoal || g.isGameOver ) {
				playerX_px = player.x * g.tw;
				playerY_px = player.y * g.tw;
			}

			// Center on player, but stop at borders.
			let cx = g.ww / 2 - playerX_px;
			cx = ( cx > 0 ) ? 0 : cx;
			cx = ( cx < centerLimitW ) ? centerLimitW : ~~cx;

			let cy = g.wh / 2 - playerY_px;
			cy = ( cy > 0 ) ? 0 : cy;
			cy = ( cy < centerLimitH ) ? centerLimitH : ~~cy;

			ctx.setTransform( 1, 0, 0, 1, cx, cy );


			// Draw the ground image but upscale it.
			// The tiles in the original are only 1x1 px.
			ctx.drawImage( g.groundCanvas, ...dest );


			// Goal.
			let dtX = player.x - goal.x;
			let dtY = player.y - goal.y;
			let dist = Math.sqrt( dtX * dtX + dtY * dtY );

			if( dist < 4 ) {
				ctx.globalAlpha = ( dist < 2 ) ? 1 : 0.4;
				ctx.drawImage( variousImg, 0, 0, 16, 16, goal.x * g.tw, goal.y * g.tw, g.tw, g.tw );
				ctx.globalAlpha = 1;
			}

			// Draw the phone on the ground if it is game over.
			if( g.isGameOver ) {
				ctx.drawImage(
					variousImg,
					16, 0, 16, 16,
					player.x * g.tw,
					player.y * g.tw,
					g.tw, g.tw
				);
			}

			// Monsters.
			for( let i = 0; i < numMonsters; i++ ) {
				let m = monsters[i];
				ctx.drawImage(
					monsterImg, ...m.getImgCut(),
					m.x_px, m.y_px, g.tw, g.tw
				);
			}

			// Player.
			let x = cx + playerX_px;
			let y = cy + playerY_px;
			ctx.setTransform( 1, 0, 0, 1, x, y );

			if( !g.isAtGoal && !g.isGameOver ) {
				ctx.drawImage( playerImg, ...player.getImgCut(), 0, 0, g.tw, g.tw );
			}


			// Draw the fog.

			// Bottom right.
			ctx.drawImage( g.fogCanvas, ...sourceCut, ...destCut );

			// Bottom left.
			ctx.setTransform( -1, 0, 0, 1, x + g.tw, y );
			ctx.drawImage( g.fogCanvas, ...dest );

			// Top right.
			ctx.setTransform( 1, 0, 0, -1, x, y + g.tw );
			ctx.drawImage( g.fogCanvas, ...dest );

			// Top left.
			ctx.setTransform( -1, 0, 0, -1, x + g.tw, y + g.tw );
			ctx.drawImage( g.fogCanvas, ...sourceCut, ...destCut );


			// Draw the navigation path.
			let pp = player.path;
			let ppLen = pp && pp.length;

			// Timestamp used as seed for random generator.
			// The factor dictates the change rhythm. The
			// greater the factor, the longer the random value
			// will stay the same.
			let timestamp = ~~( Date.now() / 250 );

			if( pp && ppLen > 2 && g.isOnline ) {
				ctx.setTransform( 1, 0, 0, 1, cx + twHalf, cy + twHalf );

				ctx.beginPath();
				ctx.lineJoin = 'miter';
				ctx.lineWidth = lineWidth;
				ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
				ctx.strokeStyle = pathColor;

				let step = pp[1];
				ctx.moveTo( step.x * g.tw, step.y * g.tw );

				for( let i = 2; i < ppLen; i++ ) {
					step = pp[i];

					ctx.lineTo( step.x * g.tw, step.y * g.tw );

					// Add a bit of glitter to the path.
					let rndX = g.rndSeed( step.x * step.y + timestamp ) * 0.5 - 0.25;
					let rndY = g.rndSeed( step.x + step.y + timestamp ) * 0.5 - 0.25;
					let size = Math.max( g.rndSeed( i ) * lineWidth / 3, 1 );

					ctx.fillRect(
						( step.x + rndX ) * g.tw,
						( step.y + rndY ) * g.tw,
						size, size
					);
				}

				ctx.stroke();

				// Little marker on the final tile.
				step = pp[ppLen - 1];
				ctx.fillStyle = pathColor;
				ctx.fillRect(
					step.x * g.tw - lineWidth,
					step.y * g.tw - lineWidth,
					lineWidth * 2,
					lineWidth * 2
				);
			}
		}

	} );

	// Render once for background.
	loop.render();

	// [r]etry
	Keys.on( 82, () => {
		if( g.isGameOver || g.isAtGoal ) {
			loop.stop();
			window.location.reload();
		}
	} );

	// [s]tart
	Keys.on( 83, () => {
		if( g.started ) {
			return;
		}

		g.started = true;
		document.getElementById( 't' ).style.display = 'none';
		loop.start();
	} );


} );
