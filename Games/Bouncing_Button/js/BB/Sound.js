/**
 * Sound manager
 * @param {Function} callback
 * @constructor
 */
function BB_Sound(callback) {
	var self = this;
	this.index = -1;
	this.disabled = true;
	this.sounds = BB_Sound.notes;
	try {
		this.callback = callback;
		this.service = new Worker('worker.js');
		this.service.addEventListener('message', function(e) {
			self.finish(e.data);
		});
		this.create();
	} catch (e) {
		callback.call(this);
	}
}

/**
 * Disable/Enable sounds
 * @returns {Boolean}
 */
BB_Sound.prototype.disable = function() {
	this.disabled = !this.disabled;
	if (this.disabled) {
		for (var i=0; i<this.sounds.length; i++) {
			this.stop(i);
		}
	}
	return this.disabled;
};

/**
 * Generate sound with the worker process
 */
BB_Sound.prototype.create = function() {
	if (++this.index < this.sounds.length) {
		this.service.postMessage(this.sounds[this.index]);
	} else {
		this.service.terminate();
	}
};

/**
 * Create audio tag
 * @param {String} data Base64 encoded WAV data
 */
BB_Sound.prototype.finish = function(data) {
	var sound = new Audio();
	sound.preload = true;
	sound.src = data;
	sound.load();
	this.sounds[this.index] = sound;
	this.callback.call(this);
	this.create();
};

/**
 * Play sound
 * @param {Number} index
 * @param {Number} volume
 * @param {Boolean} loop
 */
BB_Sound.prototype.play = function(index, volume, loop) {
	var sound = this.sounds[index];
	if (!this.disabled && typeof sound == 'object') {
		sound.volume = volume || 1;
		sound.loop = loop || false;
		if (sound.currentTime) {
			sound.pause();
			sound.currentTime = 0;
		}
		sound.play();
	}
};

/**
 * Stop playing
 * @param {Number} index
 */
BB_Sound.prototype.stop = function(index) {
	var sound = this.sounds[index];
	if (typeof sound == 'object') {
		sound.pause();
	}
};

/**
 * Sound notes
 * chanells separated by pipe
 * notes separated by comas
 * note format: 
 *  - the first number is the length 1/n
 *  - character and nmber pairs represents music note and octave
 */
BB_Sound.notes = [
//bounce
'||||16e3',
'||||16e3',
//coin
'||||32e5,32b5',
'||||32e5,32b5',
//sax
'1,4,' +
'1,4,' +
'1,4,' +
'2,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16gb5,16g5,16gb5,16e5,4d5,' +
'2e5,4,16d5,16e5,16d5,16b4,4a4,' +
'2b4,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16d5,16e5,16d5,16b4,4a4,' + 
'2b4,4,16gb5,16g5,16gb5,16e5,4d5,' +
'1e5,4,' +
'8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6,' +
'8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5,' +
'8c6,4e6,8c6,4a5,8gb5,8g5,8a5,8bb5,' +
'8b5,8bb5,8b5,8c6,4d6,8d6,8db6,8d6,8eb6,' +
'8e6,4g6,8e6,4c6,8a5,8b5,8c6,8db6,' +
'8d6,4gb6,8d6,4b5,8g5,8a5,8bb5,8b5,' +
'8c6,4e6,8c6,4a5,8gb5,8a5,8d6,8c6,' +
'2b5,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16gb5,16g5,16gb5,16e5,4d5,' +
'2e5,4,16d5,16e5,16d5,16b4,4a4,' +
'2b4,4,8b4,8e5,8g5,8a5,' +
'8bb5,8b5,8bb5,8a5,4e5,4b4,4d5,' + 
'2e5,4,16d5,16e5,16d5,16b4,4a4,' + 
'2b4,4,16gb5,16g5,16gb5,16e5,4d5,' +
'1e5,4|' +
//piano
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8c3,4g3b3e4,8e3,4e3,4gb3,4g3b3e4,' +
'8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4,' +
'8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4,' +
'8g2,4gb3b3d4,8g2,4g2,4b2,4gb3a3d4,' +
'8c3,4g3c4e4,8e3,4e3,4gb3,4g3c4e4,' +
'8b2,4ab3a3d4,8d3,4d3,4e3,4gb3a3d4,' +
'8a2,4e3g3c4,8c3,4c3,4d3,4e3g3c4,' +
'8gb2,4gb3a3e4,8gb2,4gb3a3e4,4b2,4gb3a3db4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4,' +
'8e2,4g3b3e4,8e2,4g3b3e4,4b3,4ab3a3d4|' +
//bass
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'4c2,1,'+
'4b1,1,'+
'4a1,1,'+
'4b1,2,4g1,4b1,'+
'4c2,1,'+
'4b1,1,'+
'4a1,1,'+
'4gb1,2,4b1,4,'+
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1,' +
'2e2,4e2,4b2,4b1|' +
//drum
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4,' +
'4e6,8,8b8,4,8b8,8,4'];
