
/* global GameCtrl */

/* exported WebFontConfig */
var WebFontConfig ={
	custom: {
		families: ['arcadeclasic'],
		urls: ['css/fonts.css'],
	}
};

(function(){
'use strict';

GameCtrl.Preloader = function () {
	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

GameCtrl.Preloader.prototype = {

	preload: function () {
		this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar		
		this.background = this.add.sprite(this.game.width / 2 - 250, this.game.height / 2 - 70, 'preloaderBackground');
		this.preloadBar = this.add.sprite(this.game.width / 2 - 250, this.game.height / 2 - 70, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.		
		this.load.image('stage01', 'assets/images/stage01.png');
		this.load.image('stage02', 'assets/images/stage02.png');
		
		//  This is how you load an atlas
		//this.load.atlas('playButton', 'assets/images/play_button.png', 'assets/images/play_button.json');

		this.load.audio('stage1', ['assets/audio/stage1-4.mp3']);
        this.load.audio('stage2', ['assets/audio/stage1-4.mp3']);
		this.load.audio('failure', ['assets/audio/failure.mp3']);

		//  This is how you load fonts
		//this.load.bitmapFont('caslon', 'assets/fonts/caslon.png', 'assets/fonts/caslon.xml');


var botData={'frames': [
    {
    'filename': 'clown0000',
    'frame': {'x':164,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {
    'filename': 'clown0001',
    'frame': {'x':185,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {
    'filename': 'clown0002',
    'frame': {'x':205,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {
    'filename': 'clownJump0003',
    'frame': {'x':226,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {
    'filename': 'clownStand0000',
    'frame': {'x':164,'y':58,'w':15,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':15,'h':24}
    },
    {
    'filename': 'clownStandJump0000',
    'frame': {'x':182,'y':58,'w':15,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':15,'h':24}
    },
    {
    'filename': 'clownburn0000',
    'frame': {'x':164,'y':32,'w':15,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {
    'filename': 'lion0002',
    'frame': {'x':164,'y':87,'w':33,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':33,'h':16},
    'sourceSize': {'w':33,'h':16}
    },
    {
    'filename': 'lion0001',
    'frame': {'x':200,'y':87,'w':33,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':33,'h':16},
    'sourceSize': {'w':33,'h':16}
    },
    {
    'filename': 'lion0000',
    'frame': {'x':234,'y':87,'w':33,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':33,'h':16},
    'sourceSize': {'w':33,'h':16}
    },
    {
    'filename': 'lionburn0000',
    'frame': {'x':272,'y':87,'w':33,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':33,'h':16},
    'sourceSize': {'w':33,'h':16}
    },
    {
    'filename': 'firepot0000',
    'frame': {'x':221,'y':194,'w':24,'h':31},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':24,'h':31},
    'sourceSize': {'w':24,'h':31}
    },
    {
    'filename': 'firepot0001',
    'frame': {'x':195,'y':194,'w':24,'h':31},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':24,'h':31},
    'sourceSize': {'w':24,'h':31}
    },
    {
    'filename': 'firecirclel0000',
    'frame': {'x':136,'y':145,'w':12,'h':80},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':12,'h':80},
    'sourceSize': {'w':12,'h':80}
    
    },
    {
    'filename': 'firecirclel0001',
    'frame': {'x':165,'y':145,'w':12,'h':80},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':12,'h':80},
    'sourceSize': {'w':12,'h':80}
    },
    {
    'filename': 'firecircler0000',
    'frame': {'x':148,'y':145,'w':12,'h':80},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':12,'h':80},
    'sourceSize': {'w':12,'h':80}
    },
    {
    'filename': 'firecircler0001',
    'frame': {'x':177,'y':145,'w':12,'h':80},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':12,'h':80},
    'sourceSize': {'w':12,'h':80}
    },
    {'filename': 'endLevel1',
    'frame': {'x':129,'y':243,'w':37,'h':22},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':37,'h':22},
    'sourceSize': {'w':37,'h':18}
    },
    {'filename': 'walkBalance0',
    'frame': {'x':164,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {'filename': 'walkBalance1',
    'frame': {'x':185,'y':5,'w':15,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':15,'h':24},
    'sourceSize': {'w':15,'h':24}
    },
    {'filename': 'walkBalance2',
    'frame': {'x':205,'y':5,'w':16,'h':24},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':24},
    'sourceSize': {'w':16,'h':24}
    },
    {'filename': 'jumpBalance',
    'frame': {'x':226, 'y':7,'w':16,'h':22},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':22},
    'sourceSize': {'w':16,'h':22}
    },
    {'filename': 'monkey0',
    'frame': {'x':78, 'y':106,'w':16,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':16},
    'sourceSize': {'w':16,'h':16}
    },
    {'filename': 'monkey1',
    'frame': {'x':98, 'y':106,'w':16,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':16,'h':16},
    'sourceSize': {'w':16,'h':16}
    },
    {'filename': 'monkey2',
    'frame': {'x':118, 'y':106,'w':17,'h':16},
    'rotated': false,
    'trimmed': true,
    'spriteSourceSize': {'x':0,'y':0,'w':17,'h':16},
    'sourceSize': {'w':17,'h':16}
    }
    ]};


    this.game.load.atlas('clown', 'assets/images/CircusCharlieSheet1.gif', null, botData);




	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('stage1') && this.ready === false){
			this.ready = true;
			this.game.state.start('MainMenu');
		}

	}

};

})();