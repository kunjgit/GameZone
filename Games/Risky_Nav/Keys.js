'use strict';


var Keys = {


	_handler: {},
	state: {},


	/**
	 * Get the currently active arrow key.
	 * @return {?number} Key code.
	 */
	getArrowKey() {
		let down = this.state[40] || 0;
		let left = this.state[37] || 0;
		let right = this.state[39] || 0;
		let up = this.state[38] || 0;

		let values = [down, left, right, up];
		values.sort( ( a, b ) => b - a );

		let max = values[0];

		if( !max ) {
			return null;
		}

		if( max == down ) { return 40; }
		if( max == left ) { return 37; }
		if( max == right ) { return 39; }
		if( max == up ) { return 38; }

		return null;
	},


	/**
	 * Initialize. Setup event listeners.
	 */
	init() {
		const arrows = [37, 38, 39, 40];

		document.body.onkeydown = ( ev ) => {
			this.state[ev.which] = Date.now();
			this._handler[ev.which] && this._handler[ev.which]();
		};

		document.body.onkeyup = ( ev ) => {
			this.state[ev.which] = 0;
		};
	},


	/**
	 * Check if a key is currently being pressed.
	 * @param  {number} code - Key code.
	 * @return {boolean}
	 */
	isPressed( code ) {
		return !!this.state[code];
	},


	/**
	 * Add a listener for the keydown event.
	 * @param {number}   code - Key code.
	 * @param {function} cb   - Callback.
	 */
	on( code, cb ) {
		this._handler[code] = cb;
	}


};
