function SoundManager() {
	this.soundOn = true;
	this.musicOn = true;
}

SoundManager.prototype = {

	initialize : function(context, game) {
	
		try {
			this.audioFloater = new Audio("");
			var wavSupported = this.audioFloater.canPlayType('audio/wav');
			this.soundSupport = (wavSupported=="probably" || wavSupported=="maybe");
		} catch (e) {
			this.soundSupport = false;
		}
 
		if (!this.soundSupport) { // skip sound initialization
			this.soundOn = false;
			this.musicOn = false;
			game.launchMenu();
			return;
		}
		this.context = context;
		this.game = game;
		context.fillStyle="white";
		context.fillText("decrunching",120,10);
		var mgr = this;
		setTimeout (function() { mgr.init2(); }, 1);
	},
	
	init2 : function() {
		
		var floaterSong = {
			  songData: [
				{ // Instrument 0
				  i: [
				  0, // OSC1_WAVEFORM
				  255, // OSC1_VOL
				  152, // OSC1_SEMI
				  0, // OSC1_XENV
				  0, // OSC2_WAVEFORM
				  255, // OSC2_VOL
				  152, // OSC2_SEMI
				  12, // OSC2_DETUNE
				  0, // OSC2_XENV
				  0, // NOISE_VOL
				  2, // ENV_ATTACK
				  0, // ENV_SUSTAIN
				  60, // ENV_RELEASE
				  0, // LFO_WAVEFORM
				  0, // LFO_AMT
				  0, // LFO_FREQ
				  0, // LFO_FX_FREQ
				  2, // FX_FILTER
				  255, // FX_FREQ
				  0, // FX_RESONANCE
				  0, // FX_DIST
				  32, // FX_DRIVE
				  47, // FX_PAN_AMT
				  3, // FX_PAN_FREQ
				  157, // FX_DELAY_AMT
				  2 // FX_DELAY_TIME
				  ],
				  // Patterns
				  p: [1],
				  // Columns
				  c: [
					{n: [123],
					 fx: []}
				  ]
				}
			  ],
			  rowLen: 5513,   // In sample lengths
			  endPattern: 2  // End pattern
			};

		var floaterSongGen = new CPlayer();
		floaterSongGen.init(floaterSong);
		floaterSongGen.generate(); // single pattern+channel
		this.audioFloater = new Audio ("data:audio/wav;base64,"+btoa(floaterSongGen.createWave()));
		
		var ballLossSong= {
		  songData: [
			{ // Instrument 0
			  i: [
			  2, // OSC1_WAVEFORM
			  100, // OSC1_VOL
			  135, // OSC1_SEMI
			  0, // OSC1_XENV
			  3, // OSC2_WAVEFORM
			  201, // OSC2_VOL
			  128, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  0, // ENV_ATTACK
			  0, // ENV_SUSTAIN
			  40, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  195, // LFO_AMT
			  4, // LFO_FREQ
			  1, // LFO_FX_FREQ
			  3, // FX_FILTER
			  50, // FX_FREQ
			  184, // FX_RESONANCE
			  119, // FX_DIST
			  160, // FX_DRIVE
			  147, // FX_PAN_AMT
			  6, // FX_PAN_FREQ
			  84, // FX_DELAY_AMT
			  6 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [1],
			  // Columns
			  c: [
				{n: [123,,134,,132,,130,,128,,127,,,,,,,,,,,,,,,,,,,,,,123,,122,,120,,118,,116,,115],
				 fx: []}
			  ]
			}
		  ],
		  rowLen: 5513,   // In sample lengths
		  endPattern: 2  // End pattern
		};
		var songGen2 = new CPlayer();
		songGen2.init(ballLossSong);
		songGen2.generate(); // single pattern+channel
		this.audioBallLoss = new Audio ("data:audio/wav;base64,"+btoa(songGen2.createWave()));

		var padHitSong = {
		  songData: [
			{ // Instrument 0
			  i: [
			  0, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  117, // OSC1_SEMI
			  1, // OSC1_XENV
			  0, // OSC2_WAVEFORM
			  255, // OSC2_VOL
			  110, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  1, // OSC2_XENV
			  0, // NOISE_VOL
			  4, // ENV_ATTACK
			  6, // ENV_SUSTAIN
			  35, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  14, // FX_FREQ
			  0, // FX_RESONANCE
			  14, // FX_DIST
			  39, // FX_DRIVE
			  76, // FX_PAN_AMT
			  5, // FX_PAN_FREQ
			  0, // FX_DELAY_AMT
			  0 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [1],
			  // Columns
			  c: [
				{n: [147],
				 fx: []}
			  ]
			}
		  ],
		  rowLen: 5513,   // In sample lengths
		  endPattern: 2  // End pattern
		};
		var songGen3 = new CPlayer();
		songGen3.init(padHitSong);
		songGen3.generate(); // single pattern+channel
		this.audioPadHit = new Audio ("data:audio/wav;base64,"+btoa(songGen3.createWave()));

		var brickHitSong = {
		  songData: [
			 { // Instrument 0
          i: [
          3, // OSC1_WAVEFORM
          255, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          140, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          127, // NOISE_VOL
          2, // ENV_ATTACK
          2, // ENV_SUSTAIN
          23, // ENV_RELEASE
          0, // LFO_WAVEFORM
          96, // LFO_AMT
          3, // LFO_FREQ
          1, // LFO_FX_FREQ
          3, // FX_FILTER
          137, // FX_FREQ
          79, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          84, // FX_PAN_AMT
          2, // FX_PAN_FREQ
          12, // FX_DELAY_AMT
          4 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [135],
             fx: []}
          ]
        }
		  ],
		  rowLen: 5513,   // In sample lengths
		  endPattern: 2  // End pattern
		};

		var songGen4 = new CPlayer();
		songGen4.init(brickHitSong);
		songGen4.generate(); // single pattern+channel
		this.audioBrickHit = new Audio ("data:audio/wav;base64,"+btoa(songGen4.createWave()));

		    // Song data
		var ambientSong = {
		  songData: [
			{ // Instrument 0
			  i: [
			  1, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  1, // OSC2_WAVEFORM
			  154, // OSC2_VOL
			  128, // OSC2_SEMI
			  9, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  7, // ENV_ATTACK
			  5, // ENV_SUSTAIN
			  52, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  255, // FX_FREQ
			  0, // FX_RESONANCE
			  0, // FX_DIST
			  33, // FX_DRIVE
			  47, // FX_PAN_AMT
			  3, // FX_PAN_FREQ
			  146, // FX_DELAY_AMT
			  2 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [5,1,2,3,4,,,,,6,7,6,7,8,9,10,,1,2,3,4],
			  // Columns
			  c: [
				{n: [161,,,,,,163,,164,,163,,161,,,,159,,,,156,,,,154,,,,159],
				 fx: []},
				{n: [161,,163,,161,,159,,161,,,,159,,,,161,,,,,,,,,,,,161,,163],
				 fx: []},
				{n: [164,,,,168,,,,166,,164,,163,,,,164,,163,,161,,,,163,,161,,159],
				 fx: []},
				{n: [161,,,,166,,,,163,,,,159,,,,161],
				 fx: []},
				{n: [,,,,,,,,,,,,,,,,,,,,,,,,,,,,156],
				 fx: [,,,,,22,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,33]},
				{n: [161,,156,,156,,163,,156,,156,,161,,163,,164,,156,,156,,168,,156,,156,,164,,163],
				 fx: []},
				{n: [164,,159,,159,,168,,159,,159,,169,,166,,168,,159,,159,,164,,159,,159,,164,,163],
				 fx: []},
				{n: [169,,161,,161,,166,,161,,161,,168,,169,,166,,157,,157,,166,,157,,161,,166,,169],
				 fx: []},
				{n: [168,,159,,159,,164,,159,,159,,168,,166,,164,,156,,156,,159,,156,,159,,164,,168],
				 fx: []},
				{n: [166,,154,,154,,159,,154,,154,,163,,164,,163,,151,,151,,159,,151,,151,,161,,163],
				 fx: []}
			  ]
			},
			{ // Instrument 1
			  i: [
			  2, // OSC1_WAVEFORM
			  100, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  3, // OSC2_WAVEFORM
			  201, // OSC2_VOL
			  128, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  5, // ENV_ATTACK
			  6, // ENV_SUSTAIN
			  58, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  195, // LFO_AMT
			  6, // LFO_FREQ
			  1, // LFO_FX_FREQ
			  2, // FX_FILTER
			  135, // FX_FREQ
			  0, // FX_RESONANCE
			  0, // FX_DIST
			  32, // FX_DRIVE
			  147, // FX_PAN_AMT
			  6, // FX_PAN_FREQ
			  121, // FX_DELAY_AMT
			  6 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,1,2,3,4,1,2,3,4,5,6,5,6,7,8,9,10],
			  // Columns
			  c: [
				{n: [149,,,,,,149,,147,,,,147,,,,152,,,,,,,,147],
				 fx: []},
				{n: [145,,,,140,,145,,147,,,,142,,147,,149,,,,,,144,,137,,,,149,,147],
				 fx: []},
				{n: [152,,,,,,152,,147,,,,,,147,,149,,,,149,,149,,144,,,,156,,145],
				 fx: []},
				{n: [145,,,,140,,145,,147,,,,,,159,,149,,,,144,,149],
				 fx: []},
				{n: [149,,,,161,,149,,,,156,,152,,151,,149,,,,161,,149,,,,147,,149,,151],
				 fx: []},
				{n: [152,,,,168,,152,,,,147,,152,,151,,152,,,,164,,152,,,,147,,156,,152],
				 fx: []},
				{n: [154,,,,169,,154,,,,166,,161,,157,,154,,,,166,,154,,,,149,,154,,149],
				 fx: []},
				{n: [152,,,,168,,152,,,,147,,149,,147,,152,,,,164,,152,,,,164,,168,,164],
				 fx: []},
				{n: [147,,,,159,,147,,,,147,,154,,151,,147,,,,159,,147,,,,159,,157,,159],
				 fx: []},
				{n: [144,,,,156,,151,,,,151,,154,,156,,144,,,,156,,160,,,,156,,158,,160],
				 fx: []}
			  ]
			},
			{ // Instrument 2
			  i: [
			  1, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  1, // OSC2_WAVEFORM
			  154, // OSC2_VOL
			  128, // OSC2_SEMI
			  9, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  7, // ENV_ATTACK
			  5, // ENV_SUSTAIN
			  52, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  255, // FX_FREQ
			  0, // FX_RESONANCE
			  0, // FX_DIST
			  32, // FX_DRIVE
			  47, // FX_PAN_AMT
			  3, // FX_PAN_FREQ
			  146, // FX_DELAY_AMT
			  2 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,,,,,,,,,,,,,,,,1],
			  // Columns
			  c: [
				{n: [160,,156,,156,,161,,156,,156,,160,,161,,163,,156,,156,,168,,156,,166,,164,,163],
				 fx: []}
			  ]
			},
			{ // Instrument 3
			  i: [
			  2, // OSC1_WAVEFORM
			  100, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  3, // OSC2_WAVEFORM
			  201, // OSC2_VOL
			  128, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  5, // ENV_ATTACK
			  6, // ENV_SUSTAIN
			  58, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  195, // LFO_AMT
			  6, // LFO_FREQ
			  1, // LFO_FX_FREQ
			  2, // FX_FILTER
			  135, // FX_FREQ
			  0, // FX_RESONANCE
			  0, // FX_DIST
			  32, // FX_DRIVE
			  147, // FX_PAN_AMT
			  6, // FX_PAN_FREQ
			  121, // FX_DELAY_AMT
			  6 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,,,,,,,,,,,,,,,,,2,1,3,4],
			  // Columns
			  c: [
				{n: [169,,,,,,,,166,,,,169,,,,168,,,,,,164,,161,,,,159],
				 fx: []},
				{n: [164,,,,166,,168,,166,,,,164,,,,164,,,,159,,,,163,,,,166],
				 fx: []},
				{n: [168,,,,159,,,,163,,,,,,166,,168,,,,164,,,,156,,,,163,,159],
				 fx: []},
				{n: [157,,,,,,,,159,,,,,,,,164,,,,163,,,,161,,,,156],
				 fx: []}
			  ]
			},
			{ // Instrument 4
			  i: [
			  0, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  117, // OSC1_SEMI
			  1, // OSC1_XENV
			  0, // OSC2_WAVEFORM
			  255, // OSC2_VOL
			  110, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  1, // OSC2_XENV
			  0, // NOISE_VOL
			  4, // ENV_ATTACK
			  6, // ENV_SUSTAIN
			  35, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  14, // FX_FREQ
			  0, // FX_RESONANCE
			  1, // FX_DIST
			  39, // FX_DRIVE
			  76, // FX_PAN_AMT
			  5, // FX_PAN_FREQ
			  0, // FX_DELAY_AMT
			  0 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,1,2,1,2,1,2,1,2,3,4,3,4,3,4,3,4,1,2,1,2],
			  // Columns
			  c: [
				{n: [148,,,,,,,,,,,,,,,,148,,,,,,,,,,,,148],
				 fx: []},
				{n: [148,,,,,,,,,,,,,,148,,148,,,,,,,,,,,,148],
				 fx: []},
				{n: [149,,,,,,149,,,,149,,,,149,,149,,,,,,149,,,149,149,,,,149],
				 fx: []},
				{n: [149,,,,,,149,,,,149,,,,149,,149,,,,,,149,,,149,,149,,,149],
				 fx: []}
			  ]
			},
			{ // Instrument 5
			  i: [
			  3, // OSC1_WAVEFORM
			  0, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  3, // OSC2_WAVEFORM
			  68, // OSC2_VOL
			  128, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  1, // OSC2_XENV
			  218, // NOISE_VOL
			  4, // ENV_ATTACK
			  4, // ENV_SUSTAIN
			  40, // ENV_RELEASE
			  1, // LFO_WAVEFORM
			  55, // LFO_AMT
			  4, // LFO_FREQ
			  1, // LFO_FX_FREQ
			  2, // FX_FILTER
			  67, // FX_FREQ
			  115, // FX_RESONANCE
			  124, // FX_DIST
			  190, // FX_DRIVE
			  67, // FX_PAN_AMT
			  6, // FX_PAN_FREQ
			  39, // FX_DELAY_AMT
			  1 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,1,1,1,1,1,1,1,1,,,,,,,,,1,1,1,1],
			  // Columns
			  c: [
				{n: [,,161,,153,,161,,,,,,,,,,,,161,,153,,161],
				 fx: []}
			  ]
			},
			{ // Instrument 6
			  i: [
			  0, // OSC1_WAVEFORM
			  255, // OSC1_VOL
			  117, // OSC1_SEMI
			  1, // OSC1_XENV
			  0, // OSC2_WAVEFORM
			  255, // OSC2_VOL
			  110, // OSC2_SEMI
			  0, // OSC2_DETUNE
			  1, // OSC2_XENV
			  0, // NOISE_VOL
			  4, // ENV_ATTACK
			  6, // ENV_SUSTAIN
			  35, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  0, // LFO_AMT
			  0, // LFO_FREQ
			  0, // LFO_FX_FREQ
			  2, // FX_FILTER
			  14, // FX_FREQ
			  0, // FX_RESONANCE
			  1, // FX_DIST
			  39, // FX_DRIVE
			  76, // FX_PAN_AMT
			  5, // FX_PAN_FREQ
			  0, // FX_DELAY_AMT
			  0 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,1,2,1,3,1,2,1,4,5,6,5,6,5,6,5,6,1,2,1,3],
			  // Columns
			  c: [
				{n: [,,,,,,,,160,,,,,,,,,,,,,,,,160],
				 fx: []},
				{n: [,,,,,,,,160,,,,,,,,,,,,,,,,160,,160,,,,160],
				 fx: []},
				{n: [,,,,,,,,160,,,,,,,,,,,,,,,,160,,160,,160,,160],
				 fx: []},
				{n: [,,,,,,,,160,,,,,,,,,,,,,,,,160,157,157,157,157,157,157,157],
				 fx: []},
				{n: [,,,,157,,,,,,,,157,,,,,,,,157,,,,,,,,157,,,157],
				 fx: []},
				{n: [,,,,157,,,,,,,,157,,,,,,,,157,,,,,,157,,157,157,,157],
				 fx: []}
			  ]
			},
			{ // Instrument 7
			  i: [
			  1, // OSC1_WAVEFORM
			  192, // OSC1_VOL
			  128, // OSC1_SEMI
			  0, // OSC1_XENV
			  1, // OSC2_WAVEFORM
			  192, // OSC2_VOL
			  116, // OSC2_SEMI
			  9, // OSC2_DETUNE
			  0, // OSC2_XENV
			  0, // NOISE_VOL
			  6, // ENV_ATTACK
			  22, // ENV_SUSTAIN
			  34, // ENV_RELEASE
			  0, // LFO_WAVEFORM
			  69, // LFO_AMT
			  3, // LFO_FREQ
			  1, // LFO_FX_FREQ
			  1, // FX_FILTER
			  23, // FX_FREQ
			  167, // FX_RESONANCE
			  0, // FX_DIST
			  0, // FX_DRIVE
			  77, // FX_PAN_AMT
			  6, // FX_PAN_FREQ
			  25, // FX_DELAY_AMT
			  6 // FX_DELAY_TIME
			  ],
			  // Patterns
			  p: [,,,,,1,2,3,4],
			  // Columns
			  c: [
				{n: [161,,156,161,,156,163,,164,163,163,164,161,163,164,161,159,164,161,159,156,161,159,156,154,159,156,154,159,156,154,159],
				 fx: [,,22,22,,22,22,,,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,,,8,16,,,35,,,16,35,16,35,16,8,16,35,,8,16,35,,8,16,35,,8,16,35,,8,16]},
				{n: [161,154,163,161,161,163,159,161,161,159,161,161,159,161,161,159,161,161,159,161,161,159,161,161,159,161,,159,161,,163,161],
				 fx: [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,,22,22,,,,,22,,,22,35,,35,16,35,16,35,16,35,16,8,16,35,,8,16,35,,8,16,,,8,,,,,,35,,,16]},
				{n: [164,,,164,168,,164,168,166,164,164,166,163,164,166,163,164,166,163,164,161,163,164,161,163,164,161,163,159,161,163,159],
				 fx: [22,,,22,22,,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,35,,,16,36,,8,16,35,,35,16,35,16,8,16,35,,35,16,35,16,8,16,35,,35,16,35,16,8,16]},
				{n: [161,163,159,161,166,161,159,166,163,149,166,163,159,166,163,159,161,163,159,161,163,159,161,163,159,161,163,159,161,,,161],
				 fx: [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,,22,22,,,,,,,,,36,,8,16,35,,8,16,35,,8,16,35,,8,17,35,,8,15,,,8]}
			  ]
			}
		  ],
		  rowLen: 4134,   // In sample lengths
		  endPattern: 22  // End pattern
		};
		this.songGen5 = new CPlayer();
		this.songGen5.init(ambientSong, .2);
		this.init3();		
	},
	
	init3 : function() {
		var out = this.songGen5.generate();
		this.context.strokeStyle="#05A";
		this.context.strokeRect(0,20,300,10);
		this.context.fillStyle="#05A";
		this.context.fillRect(0,20,300*out.progress,10);
		if (out.done) {
			this.audioMusic = new Audio ("data:audio/wav;base64,"+btoa(this.songGen5.createWave()));
			this.audioMusic.loop=true;
			this.audioMusic.play();
			this.game.launchMenu();
		} else {
			var mgr = this;
			setTimeout (function() { mgr.init3(); }, 1);
		}
	},
	
	toggleSound : function() {
		if (this.soundSupport) { 
			this.soundOn=!this.soundOn;
			if (!this.soundOn) {
				this.audioFloater.pause();
				this.audioBallLoss.pause();
				this.audioPadHit.pause();
				this.audioBrickHit.pause();
				this.audioMusic.pause();
			}
		}
	},
	
	toggleMusic : function() {
		if (this.soundSupport) { 
			this.musicOn=!this.musicOn;
			if (this.musicOn) {
				this.audioMusic.play();
			} else {
				this.audioMusic.pause();
			}
		}
	},

	playBrickHit : function() {
		if (this.soundOn) {
			this.audioBrickHit.currentTime=0;
			this.audioBrickHit.play();
		}
	},

	playPadHit : function() {
		if (this.soundOn) {
			this.audioPadHit.currentTime=0;
			this.audioPadHit.play();
		}
	},
	
	playBallLoss : function() {
		if (this.soundOn) {
			this.audioBallLoss.currentTime=0;
			this.audioBallLoss.play();
		}
	},
	
	playFloaterCaught : function() {
		if (this.soundOn) {
			this.audioFloater.currentTime=0;
			this.audioFloater.play();
		}
	}

}