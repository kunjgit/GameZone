'use strict';


let PF = {


	map: null,


	/**
	 * Generate a map for use with path
	 * finding for the static goal.
	 * @param {number} x
	 * @param {number} y
	 */
	generateMap( x, y ) {
		let markFieldsAround = ( x, y, step ) => {
			let next = [];
			let xp = x + 1;
			let xm = x - 1;
			let yp = y + 1;
			let ym = y - 1;


			// Check if there is a field in the 4 directions
			// and if there is one, if it can be walked on.
			//
			// Also do not check already checked fields again.
			// Since we first check all low-number (step) fields,
			// we cannot find a shorter path at a later point.

			// To the right.
			if(
				xp < g.mc && !m2[xp][y] &&
				g.map[y * g.mc + xp] & 2
			) {
				m2[xp][y] = step;
				next.push( { x: xp, y, step } );
			}

			// To the left.
			if(
				x > 0 && !m2[xm][y] &&
				g.map[y * g.mc + xm] & 2
			) {
				m2[xm][y] = step;
				next.push( { x: xm, y, step } );
			}

			// Look below.
			if(
				yp < g.mr && !m2[x][yp] &&
				g.map[yp * g.mc + x] & 2
			) {
				m2[x][yp] = step;
				next.push( { x, y: yp, step } );
			}

			// Look above.
			if(
				y > 0 && !m2[x][ym] &&
				g.map[ym * g.mc + x] & 2
			) {
				m2[x][ym] = step;
				next.push( { x, y: ym, step } );
			}

			return next;
		};

		// 2D array as map.
		let m2 = Array( g.mc );

		for( let i = 0; i < g.mc; i++ ) {
			m2[i] = Array( g.mr ).fill( 0 );
		}

		m2[x][y] = 1;

		// Explore all the connected fields, starting from
		// position "a". Stop when all paths are exhausted.
		let nextFields = [{ x, y, step: 1 }];
		let steps = 0;

		while( nextFields.length ) {
			let n = nextFields.splice( 0, 1 )[0];

			nextFields = nextFields.concat(
				markFieldsAround( n.x, n.y, n.step + 1 )
			);
		}

		this.map = m2;
	},


	/**
	 * Find a path to the goal.
	 * @param  {number} x
	 * @param  {number} y
	 * @return {?object[]}
	 */
	findGoal( x, y ) {
		let map = this.map;
		let steps = map[x][y];

		// If the value of the current position
		// is not "0", there is a path.
		if( !steps ) {
			return null;
		}

		// There is at least 1 connection. Now gather the path.
		let path = [{ x, y }];

		while( --steps ) {
			let field = null;

			if( x > 0 ) {
				field = map[x - 1][y];

				if( field == steps ) {
					path.push( { x: x - 1, y } );
					x--;
					continue;
				}
			}

			if( x < g.mc - 1 ) {
				field = map[x + 1][y];

				if( field == steps ) {
					path.push( { x: x + 1, y } );
					x++;
					continue;
				}
			}

			if( y > 0 ) {
				field = map[x][y - 1];

				if( field == steps ) {
					path.push( { x, y: y - 1 } );
					y--;
					continue;
				}
			}

			if( y < g.mr - 1 ) {
				field = map[x][y + 1];

				if( field == steps ) {
					path.push( { x, y: y + 1 } );
					y++;
					continue;
				}
			}
		}

		return path;
	}


};
