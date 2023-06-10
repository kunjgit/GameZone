/**
 * Wave form generators
 * @param {Number} sample
 * @constructor
 */
function AP_Oscillator(sample) {
	this.sample = sample;
	this.random = this.rnd();
	this.flop = 0;
}

/**
 * Random noise value
 * @returns {Number}
 */
AP_Oscillator.prototype.rnd = function() {
	return Math.random() * 2 -1;
};

/**
 * Get oscillator value by index
 * @param {Number} freq
 * @param {Number} index
 * @param {String} type
 * @returns {Number}
 */
AP_Oscillator.prototype.get = function(freq, index, type) {
	var flip,
		lambda = this.sample / freq;
	switch (type) {
		case 'sin':
			return -Math.sin((index % lambda) / lambda * Math.PI * 2);
		case 'sqr':
			return Math.round(index / lambda * 2) % 2 ? 1 : -1; 
		case 'saw':
			return (index % lambda) / lambda * 2 - 1;
		case 'noi':
			flip = Math.round(index / lambda) % 2;
			if (this.flop != flip) {
				this.flop = flip;
				this.random = this.rnd();
			}
			return this.random;
	}
	return 0;
};
