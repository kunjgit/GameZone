/**
 * Parse channel informations
 * @param {AP_Instrument} instrument
 * @param {String} notes
 * @param {Number} tempo
 * @constructor
 */
function AP_Channel(instrument, notes, tempo) {
	this.instrument = instrument;
	this.notes = notes.split(',');
	this.tempo = tempo || 1;
	this.freq = [];
	this.time = 0;
	this.index = 0;
	if (AP_Channel.freqs.length == 0) {
		var a = Math.pow(2, 1/12);
		for (var n=-57; n<50; n++) {
			AP_Channel.freqs.push(440 * Math.pow(a, n));
		}
	}
};

/**
 * Music note index
 */
AP_Channel.keys = {c:0,db:1,d:2,eb:3,e:4,f:5,gb:6,g:7,ab:8,a:9,bb:10,b:11};

/**
 * Frequency buffer
 */
AP_Channel.freqs = [];

/**
 * Parse one note
 * @param {String} note
 */
AP_Channel.prototype.parse = function(note) {
	var match = note.match(/([a-z]+)(\d+)([a-z]*)(\d*)([a-z]*)(\d*)([a-z]*)(\d*)([a-z]*)(\d*)([a-z]*)(\d*)/);
	if (match) {
		match.shift();
		while(match.length) {
			var c = match.shift(),
				n = match.shift();
			if (n) {
				this.freq.push(AP_Channel.freqs[parseInt(n) * 12 + AP_Channel.keys[c]]);
			}
		}
	}
};

/**
 * Generate the next value of the chabbel
 * @returns {Number}
 */
AP_Channel.prototype.get = function() {
	if (++this.index > this.time) {
		var next = this.notes.shift(),
			match = next ? next.match(/^(\d+)(.*)$/) : false;
		if (!match) return false;
		this.freq = [];
		this.time =  this.instrument.sample / parseInt(match[1]) * this.tempo;
		this.index = 0;
		this.parse(match[2]);
	}
	var value = 0;
	for (var i=0; i<this.freq.length; i++) {
		value += this.instrument.get(this.freq[i], this.index);
	}
	return this.freq.length > 0 ? value / this.freq.length : 0;
};