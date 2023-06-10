(function() {
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

/**
 * Sound generator worker
 * @param {Number} sample
 * @constructor
 */
function AP_Service(sample) {
	this.keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.sample = sample;
	this.instrument = [
       	new AP_Instrument(sample, 1, {sqr:-.2,sin:.5}),
    	new AP_Instrument(sample, .3, {sqr:.4,sin:.4}),
    	new AP_Instrument(sample, .7, {sin:2}),
    	new AP_Instrument(sample, .1, {noi:.2}),
    	new AP_Instrument(sample, .1, {sin:.6})
    ];
}

/**
 * Base64 encoding
 * @param {Number} value
 */
AP_Service.prototype.add = function(value) {
	var buffer = this.buffer,
		c1, c2, c3, e1, e2, e3, e4;
	if (value !== undefined) {
		buffer.push(value);
	}
	if (buffer.length > 2 || value === undefined) {
		c1 = buffer.shift();
		c2 = buffer.shift();
		c3 = buffer.shift();
		e1 = c1 >> 2;
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        e3 = ((c2 & 15) << 2) | (c3 >> 6);
        e4 = c3 & 63;
        if (isNaN(c2)) e3 = e4 = 64;
        else if (isNaN(c3)) e4 = 64;
        this.data = this.data +
        	this.keys.charAt(e1) +
        	this.keys.charAt(e2) +
        	this.keys.charAt(e3) +
        	this.keys.charAt(e4);
	}
};

/**
 * String encoding
 * @param value
 * @returns {AP_Service}
 */
AP_Service.prototype.str = function(value) {
	for (var i=0; i<value.length; i++) {
		this.add(value.charCodeAt(i));
	}
	return this;
};

/**
 * Number encoding
 * @param value
 * @param size
 * @returns {AP_Service}
 */
AP_Service.prototype.num = function(value, size) {
	for (var i=0; i<size; i++) {
		this.add(value % 256);
		value = Math.floor(value / 256);
	}
	return this;
};

/**
 * Generate Base64 encoded WAV file from data array
 * @param {Array} data
 * @returns {String}
 */
AP_Service.prototype.write = function(data) {
	this.str('RIFF')
		.num(data.length + 36, 4)
		.str('WAVEfmt ')
		.num(16, 4)
		.num(1, 2)
		.num(1, 2)
		.num(this.sample, 4)
		.num(this.sample, 4)
		.num(1, 2)
		.num(8, 2)
		.str('data')
		.num(data.length, 4);
	for (var i=0; i<data.length; i++) {
		this.add(data[i]);
	}
	this.add();
	delete data;
	return this.data;
};

/**
 * Worker service
 * @param {String} notes
 * @returns {String}
 */
AP_Service.prototype.handle = function(notes) {
	this.buffer = [];
	this.data = 'data:audio/wav;base64,';
	var tempo = 1.25,
		note = notes.split('|', this.instrument.length);
		channel = [],
		data = [];
	for (var i=0; i<note.length; i++) {
		channel.push(new AP_Channel(this.instrument[i], note[i], tempo));
	}
	do {
		var num = 0,
			sum = 0,
			val = 0;
		for (var j=0; j<channel.length; j++) {
			val = channel[j].get();
			if (val !== false) {
				sum += val;
				num++;
			}
		}
		if (num > 0) {
			data.push(Math.round(sum / num * 120 + 128));
		}
	}
	while (num > 0);
	return this.write(data);
};

var service = new AP_Service(22050);
self.addEventListener('message', function(e) {
	var result = service.handle(e.data);
	self.postMessage(result);
});


})();
