class Scrambler {

	constructor( game ) {

		this.game = game;

		this.dificulty = 0;

		this.scrambleLength = {
			2: [ 7, 9, 11 ],
			3: [ 20, 25, 30 ],
			4: [ 30, 40, 50 ],
			5: [ 40, 60, 80 ],
		};

		this.moves = [];
		this.conveted = [];
		this.pring = '';

	}

	scramble( scramble ) {

		let count = 0;
		this.moves = ( typeof scramble !== 'undefined' ) ? scramble.split( ' ' ) : [];

		if ( this.moves.length < 1 ) {

			const scrambleLength = this.scrambleLength[ this.game.cube.size ][ this.dificulty ];

			const faces = this.game.cube.size < 4 ? 'UDLRFB' : 'UuDdLlRrFfBb';
			const modifiers = [ "", "'", "2" ];
			const total = ( typeof scramble === 'undefined' ) ? scrambleLength : scramble;

			while ( count < total ) {

				const move =
					faces[ Math.floor( Math.random() * faces.length ) ] +
					modifiers[ Math.floor( Math.random() * 3 ) ];

				if ( count > 0 && move.charAt( 0 ) == this.moves[ count - 1 ].charAt( 0 ) ) continue;
				if ( count > 1 && move.charAt( 0 ) == this.moves[ count - 2 ].charAt( 0 ) ) continue;

				this.moves.push( move );
				count ++;

			}

		}

		this.callback = () => {};
		this.convert();
		this.print = this.moves.join( ' ' );

		return this;

	}

	convert( moves ) {

		this.converted = [];

		this.moves.forEach( move => {

			const convertedMove = this.convertMove( move );
			const modifier = move.charAt( 1 );

			this.converted.push( convertedMove );
			if ( modifier == "2" ) this.converted.push( convertedMove );

		} );

	}

	convertMove( move ) {

		const face = move.charAt( 0 );
		const modifier = move.charAt( 1 );

		const axis = { D: 'y', U: 'y', L: 'x', R: 'x', F: 'z', B: 'z' }[ face.toUpperCase() ];
		let row = { D: -1, U: 1, L: -1, R: 1, F: 1, B: -1 }[ face.toUpperCase() ];

		if ( this.game.cube.size > 3 && face !== face.toLowerCase() ) row = row * 2;

		const position = new THREE.Vector3();
		position[ { D: 'y', U: 'y', L: 'x', R: 'x', F: 'z', B: 'z' }[ face.toUpperCase() ] ] = row;

		const angle = ( Math.PI / 2 ) * - row * ( ( modifier == "'" ) ? - 1 : 1 );

		return { position, axis, angle, name: move };

	}

}

export { Scrambler };