/**
 * Wrapper for audio.
 * Sfx use WebAudio API (doppler for engine pitch variation)
 * Music use Audio HTML tag (load music, play and forget)
 */

 /**
  * @constructor
  */
function SoundManager(persistentData) {
	this.persistentData = persistentData;
}

SoundManager.prototype = {

	initialize : function() {
	
		try {
			var audioTag = new Audio("");
			var wavSupported = audioTag.canPlayType('audio/wav');
			this.audioTagSupport = (wavSupported=="probably" || wavSupported=="maybe");
		} catch (e) {
			this.audioTagSupport = false;
		}
		
		try {
			this.webAudioSupport = true;
			if (typeof AudioContext !== "undefined") {
				this.audioContext = new AudioContext();
			} else if (typeof webkitAudioContext !== "undefined") {
				this.audioContext = new webkitAudioContext();
			} else {
				this.webAudioSupport = false;
			}
		} catch (e) {
			this.webAudioSupport = false;
		}
		if (this.webAudioSupport) {
			// Node graph
			// (Collision left) ---> (gain) --.
			//                                 \               (start signal)-.
			// (Engine base left) --------------.                              \
			//                                   >- (filter) --                 \
			// (Engine thrust left) --> (gain) -'              \                 \
			//                                                  (channel merger) --> (global gain) --> (output)
			// (Engine base right) -------------.              /
			//                                   >- (filter) --
			// (Engine thrust right) -> (gain) -'
			//                                 /
			// (Collision right) --> (gain) --.

			// Engine sound : base noise
			this.engineBaseSoundBuffer = this.audioContext.createBuffer(1, 22050, 22050);
			var sample = this.engineBaseSoundBuffer.getChannelData(0);
			for (var i=0; i<sample.length; ++i) {
				sample[i]=(i%1102)/551-1;//((i%220)>110?1:-1);
			}
			
			// Engine sound : noise when accelerating
			this.engineThrustSoundBuffer = this.audioContext.createBuffer(1, 22050, 22050);
			sample = this.engineThrustSoundBuffer.getChannelData(0);
			for (var i=0; i<sample.length; ++i) {
				sample[i]=((i%1102)>551?1:-1);
			}
			
			// Collision sound
			this.collisionSoundBuffer = this.audioContext.createBuffer(1, 22050, 22050);
			sample = this.collisionSoundBuffer.getChannelData(0);
			for (var i=0; i<sample.length; ++i) {
				sample[i]=(2*Math.random()-1)*Math.exp(-0.00002*i*i);
			}
			
			// Start sound
			this.startSoundBuffer = this.audioContext.createBuffer(1, 22050, 22050);
			sample = this.startSoundBuffer.getChannelData(0);
			for (var i=0; i<sample.length; ++i) {
				sample[i]=((i%100)>50?1:-1)*Math.exp(-0.0004*i);
			}
			
			this.collisionSourceNode = [false, false];
			this.startSourceNode = false;
			
			var n0=this.audioContext.createGain(), n1=this.audioContext.createGain();
			n0.gain.value = n1.gain.value=0;
			this.collisionGainNode = [n0,n1];
			
			var g0=this.audioContext.createGain(), g1=this.audioContext.createGain();
			g0.gain.value = g1.gain.value=0;
			this.thrustGainNode = [g0,g1];
			
			// filter each channel separately - for tunnel effects
			var f0=this.audioContext.createBiquadFilter(), f1=this.audioContext.createBiquadFilter();
			f0.type = f1.type = 0; // lowpass filter
			f0.frequency.value = f1.frequency.value = 9; // Quieten sounds over 9Hz (changed later)
			this.filterNode = [f0,f1];
			
			// Merge the left (0) and right (1) mono sources into a stereo output
			this.mergerNode = this.audioContext.createChannelMerger(2);
			
			// Then apply global volume to the merged channel
			this.volumeNode = this.audioContext.createGain();
			this.volumeNode.gain.value = 0;

			// Closure Compiler fails to interpret types inside arrays.
			g0.connect(f0); // this.thrustGainNode[0].connect(this.filterNode[0]);
			g1.connect(f1); // this.thrustGainNode[1].connect(this.filterNode[1]);
			n0.connect(f0); // this.collisionGainNode[0].connect(this.filterNode[0]);
			n1.connect(f1); // this.collisionGainNode[1].connect(this.filterNode[1]);
			f0.connect(this.mergerNode); // this.filterNode[0].connect(this.mergerNode);
			f1.connect(this.mergerNode); // this.filterNode[1].connect(this.mergerNode);
			this.mergerNode.connect(this.volumeNode);
			this.volumeNode.connect(this.audioContext.destination);
			if (this.persistentData.data.soundOn) 
			{
				this.startSound();
			}
			
			if (this.audioTagSupport) {
				this.audioMusic = new Audio(audioContents());
				this.audioMusic.loop = true;
				if (this.persistentData.data.musicOn) {
					this.audioMusic.play();
				} 
			}
		}
 
	},
	
	/**
	 * Initializes the WebAudio nodes and starts the sfx playback
	 * This is required each time one turns sfx on, since WebAudio
	 * does not allow resuming playback from former nodes. You have to disconnect/recreate them
	 */
	startSound : function() {
		var b0=this.audioContext.createBufferSource(), b1=this.audioContext.createBufferSource();
		b0.buffer = b1.buffer = this.engineBaseSoundBuffer;
		b0.loop = b1.loop = true;
		b0.connect(this.filterNode[0]);
		b1.connect(this.filterNode[1]);
		this.engineBaseNode = [b0, b1];
		
		var t0=this.audioContext.createBufferSource(), t1=this.audioContext.createBufferSource();
		t0.buffer = t1.buffer = this.engineThrustSoundBuffer;
		t0.loop = t1.loop = true;
		t0.connect(this.thrustGainNode[0]);
		t1.connect(this.thrustGainNode[1]);
		this.engineThrustNode = [t0, t1];
		
		b0.start(0,0);
		b1.start(0,0);
		t0.start(0,0);
		t1.start(0,0);
	},
	
	/**
	 * Toggle Sound effects on and off.
	 * Sound playback is stopped immediately when turned off and resumed when turned on.
	 */
	toggleSound : function() {
		if (this.webAudioSupport) { 
			this.persistentData.toggleSound();
			if (this.persistentData.data.soundOn) {
				this.startSound();
			} else {
				this.engineBaseNode[0].stop(0);
				this.engineBaseNode[1].stop(0);
				this.engineThrustNode[0].stop(0);
				this.engineThrustNode[1].stop(0);
				this.engineBaseNode[0].disconnect();
				this.engineBaseNode[1].disconnect();
				this.engineThrustNode[0].disconnect();
				this.engineThrustNode[1].disconnect();
			}
		}
	},
	
	/**
	 * Toggle Background music on and off.
	 * Music playback is stopped immediately when turned off
	 */
	toggleMusic : function() {
		if (this.audioTagSupport) { 
			this.persistentData.toggleMusic();
			if (this.persistentData.data.musicOn) {
				this.audioMusic.play();
			} else {
				this.audioMusic.pause();
			}
		}
	},
	
	
	/**
	 * Adjust the pitch and waveform of the engine sound
	 * @param channel 0 for left (player 1), 1 for right (player 1 or 2)
	 * @param engineOn true to play the engine sound (different from turning all sfx off)
	 * @param rpm Rotation speed of the engine
	 * @param accelerate true if accelerating (at same rpm, engine sound differs if the gas pedal is pressed)
	 * @param insideTunnel true if the car is inside a tunnel (to activate reverb)
	 */
	adjustEngineSound : function (channel, engineOn, rpm, accelerate, insideTunnel) {
		if (this.persistentData.data.soundOn) {
			this.volumeNode.gain.value = (engineOn ? 1 : 0);
			this.thrustGainNode[channel].gain.value = (accelerate ? 1 : 0);
			this.engineBaseNode[channel].playbackRate.value = Math.max(800, rpm)/1000;
			this.engineThrustNode[channel].playbackRate.value = Math.max(400, rpm)/500;
			this.filterNode[channel].frequency.value = (insideTunnel ? 220 : 880);
		}
	},
	
	/**
	 * Create a source node with the collision sound and play it,
	 * on the given channel (0 or 1)
	 */
	playCollisionSound : function(channel, volume, pitch) {
		if (this.persistentData.data.soundOn) {
			this.collisionGainNode[channel].gain.value = 0.5+volume;
			if (this.collisionSourceNode[channel]) {
				this.collisionSourceNode[channel].stop(0);
				this.collisionSourceNode[channel].disconnect();
			}
			this.collisionSourceNode[channel] = this.audioContext.createBufferSource();
			this.collisionSourceNode[channel].buffer = this.collisionSoundBuffer;
			this.collisionSourceNode[channel].playbackRate.value = pitch;
			this.collisionSourceNode[channel].connect(this.collisionGainNode[channel]);
			this.collisionSourceNode[channel].start(0,0);
		}
	},
	
	/**
	 * Create a source node with the start siren sample
	 * which is played at each second of the countdown
	 * @param lastOne true for green light (race starts), false for red light (seconds before)
	 */
	playStartSound : function(lastOne) {
		if (this.persistentData.data.soundOn) {
			if (this.startSourceNode) {
				this.startSourceNode.stop(0);
				this.startSourceNode.disconnect();
			}
			this.startSourceNode = this.audioContext.createBufferSource();
			this.startSourceNode.buffer = this.startSoundBuffer;
			this.startSourceNode.playbackRate.value = lastOne ? 2.0 : 1.0;
			this.startSourceNode.loop = false;
			this.startSourceNode.connect(this.audioContext.destination);
			this.startSourceNode.start(0,0);
		}
	}
	
	
}
