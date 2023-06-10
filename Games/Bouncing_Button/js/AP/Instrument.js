/**
 * Instrument
 * @param {Number} sample
 * @param {Number} form
 * @param {Object} config
 * @constructor
 */
function AP_Instrument(sample, form, config) {
	this.oscillator = new AP_Oscillator(sample);
	this.sample = sample;
	this.form = form;
	this.config = config;
};

/**
 * Generate volume values
 * @param {Number} index
 * @returns {Number}
 */
AP_Instrument.prototype.vol = function(index) {
	if (this.form == 0) return 1;
	var sec = index / this.sample;
	return sec < this.form ? 1 - (sec / this.form) : 0;
};

/**
 * Mix the oscillators and the wave form
 * @param {Number} freq
 * @param {Number} index
 * @returns {Number}
 */
AP_Instrument.prototype.get = function(freq, index) {
	var value = 0;
	for (var type in this.config) {
		value += this.oscillator.get(freq, index, type) * this.config[type];
	}
	if (value > 1)  value = 1;
	if (value < -1)  value = -1;
	return value * this.vol(index);
};
