/**
 * Wrapper for audio.
 * Sfx and music use Audio HTML tag (load music, play and forget)
 *
 * @constructor
 */
function SoundManager(persistentData) {
	this.persistentData = persistentData;
	try {
		var audioTag = new Audio("");
		var wavSupported = audioTag.canPlayType('audio/wav');
		this.audioTagSupport = (wavSupported=="probably" || wavSupported=="maybe");
	} catch (e) {
		this.audioTagSupport = false;
	}
}

SoundManager.prototype = {
	
	/**
	 * Create all the audio tags instances 
	 * @return true if init completed, false if more calls are needed
	 */
	initSoundFX : function() {
		if (this.audioTagSupport) {
			var header="RIFF_oO_WAVEfmt "+atob("EAAAAAEAAQAcRwAAHEcAAAEACABkYXRh"), content = "";
			for (var i=0; i<1280;++i) {
				var envelope = i<150 ? 25 : (i<200 ? 25+2*(i-150) : (i<320 ? 125 : 125*Math.exp((320-i)/300)));
				var round = Math.sin(i*(70+45*Math.sin(i/60))*Math.PI/880);
				var square = Math.sin(i*envelope*Math.PI/1000)>0?1:-1;
				var saw = ((220*256/8000*i)&255)/255;
				var sample = Math.floor(128+.5*envelope*(square+saw));
				content+=String.fromCharCode(sample);
			}
			this.audioLeftFlipper = new Audio("data:audio/wav;base64,"+btoa(header+content));

/*			content="";
			for (var i=0; i<24576;++i) {
				var envelope = (8192-(i&8191))>>7;
				var round = Math.sin(i*envelope*Math.PI/1e5);
				var square = (i&256)?1:-1;
				var saw = ((55*256/8000*i)&255)/255;
				var sample = Math.floor(128+.5*envelope*(square+0));
				content+=String.fromCharCode(sample);
			}*/
			this.audioRightFlipper = new Audio("data:audio/wav;base64,"+btoa(header+content));

			
			content="";
			for (var i=0; i<2000;++i) {
				var envelope = i<150 ? 25 : (i<200 ? 25+2*(i-150) : (i<320 ? 125 : 125*Math.exp((320-i)/500)));
				var round = Math.sin(i*envelope*Math.PI/1e5);
				var square = Math.sin(i*envelope*Math.PI/1000)>0?1:-1;
				var sample = Math.floor(128+.5*envelope*(round+square));
				content+=String.fromCharCode(sample);
			}
			this.audioBumper = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
			content="";
			for (var i=0; i<1200;++i) {
				var envelope = i<50 ? 25 : (i<100 ? 25+2*(i-50) : (i<160 ? 125 : 125*Math.exp((160-i)/300)));
				var square = Math.sin(i*envelope*Math.PI/500)>0?1:-1;
				var saw = ((1760*256/8000*i)&255)/255;
				var sample = Math.floor(128+.5*envelope*(square+saw));
				content+=String.fromCharCode(sample);
			}
			this.audioLauncher = new Audio("data:audio/wav;base64,"+btoa(header+content));

			content="";
			for (var i=0; i<1280;++i) {
				var envelope = i<150 ? 25 : (i<200 ? 25+2*(i-150) : (i<320 ? 125 : 125*Math.exp((320-i)/300)));
				var square = Math.sin(i*envelope*Math.PI/1000)>0?1:-1;
				var sample = Math.floor(128+.5*envelope*square);
				content+=String.fromCharCode(sample);
			}
			this.audioSlingshot = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
			content="";
			for (var i=0; i<24000;++i) {
				var envelope = i<800 ? i/7 : (i<1000 ? 114 : 114*Math.exp((800-i)/2e4));
				var saw = (((6000-i/8)*256/8000*i)&255)/255;
				var sample = Math.floor(128+.5*envelope*saw);
				content+=String.fromCharCode(sample);
			}
			this.audioTilt = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
			content="";
			for (var i=0; i<2400;++i) {
				var envelope = 125*Math.exp(-(i%800)/2e4);
				var envelope2 = i<150 ? 25 : (i<200 ? 25+2*(i-150) : (i<320 ? 125 : 125*Math.exp((320-i)/300)));
				var round = Math.sin(i*.2*(250-envelope)*Math.PI/880);
				var square = Math.sin(i*envelope2*Math.PI/1000)>0?1:-1;
				var sample = Math.floor(128+.5*envelope*(round+square));
				content+=String.fromCharCode(sample);
			}
			this.audioBonusWhirl = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
			content="";
			for (var i=0; i<1200;++i) {
				var envelope = i<150 ? 25 : (i<200 ? 25+2*(i-150) : (i<320 ? 125 : 125*Math.exp((320-i)/300)));
				var round = Math.sin(i*(100+30*Math.sin(i/60))*Math.PI/880);
				var square = Math.sin(i*envelope*Math.PI/1000)>0?1:-1;
				var sample = Math.floor(128+.5*envelope*(round+.5*square));
				content+=String.fromCharCode(sample);
			}
			this.audioBonusAdd = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
			content="";
			for (var i=24575; i; --i) {
				var envelope = (i&1023)>>3;
				var square = Math.sin((100+i)*i*Math.PI/3e6)>0?1:-1;
				var sample = Math.floor(128+envelope*square);
				content+=String.fromCharCode(sample);
			}
			this.audioLoseBall = new Audio("data:audio/wav;base64,"+btoa(header+content));

			content="";
			for (var i=0; i<24576;++i) {
				var envelope = (1023-(i&1023))>>3;
				var saw = (((500+i)/8000*i)&255)/255;
				var sample = Math.floor(128+envelope*saw);
				content+=String.fromCharCode(sample);
			}
			this.audioRamp = new Audio("data:audio/wav;base64,"+btoa(header+content));
			
		}

	},
	
	
	/**
	 * Sound for left flipper 
	 */
	playLeftFlipper : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioLeftFlipper.currentTime=0;
			this.audioLeftFlipper.play();
		}
	},

	/**
	 * Sound for right flipper (same as left flipper, but different channel)
	 */
	playRightFlipper : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioRightFlipper.currentTime=0;
			this.audioRightFlipper.play();
		}
	},

	/**
	 * Sound for bumper
	 */
	playBumper : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioBumper.currentTime=0;
			this.audioBumper.play();
		}
	},
	
	/**
	 * Sound for ball launcher
	 */
	playLauncher : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioLauncher.currentTime=0;
			this.audioLauncher.play();
		}
	},
	
	/**
	 * Sound when slingshot thrusts the ball
	 */
	playSlingshot : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioSlingshot.currentTime=0;
			this.audioSlingshot.play();
		}
	},

	/**
	 * Sound when the flipper tilts
	 */
	playTilt : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioTilt.currentTime=0;
			this.audioTilt.play();
		}
	},
	
	/**
	 * Sound when the player shoots a ramp
	 */
	playRamp : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioRamp.currentTime=0;
			this.audioRamp.play();
		}
	},
	
	/**
	 * Sound when the ball is lost
	 */
	playLoseBall : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioLoseBall.currentTime=0;
			this.audioLoseBall.play();
		}
	},
		
	/**
	 * Sound when counting bonus multiplier
	 */
	playBonusWhirl : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioBonusWhirl.currentTime=0;
			this.audioBonusWhirl.play();
		}
	},
	
	/**
	 * Sound when adding bonus to main score
	 */
	playBonusAdd : function() {
		if (this.audioTagSupport && this.persistentData.soundOn) {
			this.audioBonusAdd.currentTime=0;
			this.audioBonusAdd.play();
		}
	}


	
}