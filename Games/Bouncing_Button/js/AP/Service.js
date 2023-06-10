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
