///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
var currentcanvas; // Used for resizing the screen
var keysDown = {}; // Used for keyboard buttons
var mouseX = 0; // global mouse coords
var mouseY = 0;
var soundarray = [];

var winheight = 0; // Window width & height
var winwidth = 0;

var score = 0;
var enemiesKilled = 1; // Total enemies killed, used in score calculating, starts at 1 to prevent a score of 0
var time = 0;
var scoremult = 1; // Score Multiplier, rewards using weaker weapons on certain planets
var paused = false;
var starting = true; // Used to draw start timer
var timer = 3;
var highscore = localStorage.getItem('highscore'); // Saves highscore

////////////////// LOAD IN SPRITES \\\\\\\\\\\\\\\\\\
var sprite_player = new Image(); // Player

// Enemy sprites
var sprite_fire = new Image();
var sprite_rock = new Image();
var sprite_water = new Image();
var sprite_air = new Image();

// Enemy death sprites
var boom_fire = new Image();
var boom_rock = new Image();
var boom_water = new Image();
var boom_air = new Image();

// Sprite sources in base64
sprite_player.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAA+VBMVEUAAAAaGRZBQDsiIRoyMS0REAxUT0pKSUM+OzYsKiUpJx/oPxFmYFgWFhLrNgd3dHF3aGBXVVHUy0egiVNbUEfHnDtoQDGvSiyEPyqFKBXAMBHyPA7SNQ769tqBfnzW0G5oZV9+XlJtUkV9d0OYTDmSSC5FQiBPTR85NxwiIBDeNAiJg4CDc2+Tg2LKxFt0YFlfWVTAl1CwllCPe1DIoE3Gt0hwajhWPTLKSSdgXCCyPR2VOBx1bhuSihqoNRpUJhTgPxMCAgL8+vLx77/587OEaVqWbFmubkysXEpeXEB8Uj3KkzrToTLisy6fmCdsLxyvlhe8sxH0Iw3AHj8YAAAAAXRSTlMAQObYZgAAAR9JREFUKM+l0WlXglAQBmDvwr2XC7ggASqm7Eilpqm5ZNm+b///xxQWUVSffD/Oc2bOmZnCpin+U5ekE0n6o75/eavrpu/ZeTjYkyljEFba27+AMBEzSPulnR+jhjLFCAGRMSp/p61hf6UAgFDSpcnl6y+palARQDQNowhPljrxUhhDzAEK3FbrMeRPljkx14s1hA5QgKJ0pq3mmXp0XKvP58s4kdcHVUiiuN3Tpvpcq8eWZcXFj56AcwDAzah5vu7xzVl6ppFLMUdo0VVfQrFWnDlGKoVBj0AR8fEiELFe9+zDbJ9qOSGAuMiI07tIJKMKBCsBQ1ppl3Yz+CSEaQK5k94PyppGCJFTyHJ3ZRiG79jZqCwN6f2r+WJqhQ3zBgiwHGmiI+BQAAAAAElFTkSuQmCC';
sprite_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAJ1BMVEUAAAD/kwD/fwD/nQD/xgD/vgD/0wD/hwD/6AD/swD/qAD/3AD/dwDjrSRSAAAAAXRSTlMAQObYZgAAAFhJREFUCNdjYGAwzWAAAkH1sB0MDOxKxlOzGxiYziiudNvAYHSo0HhKBoO6sqDVEm+GQ4LCUqFuDEZKhZJAilGwfOqUBAZ2ReGV3g1A7VIhO0DGWHkwMAAAMMMS9FP4uwAAAAAASUVORK5CYII=';
sprite_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAG1BMVEUAAACDQBFvNw+WTBeKRBN2OxBiMQ6QSBVIJQ0e7G3aAAAAAXRSTlMAQObYZgAAAFRJREFUCB0FwUEKgCAQQNEPdgAVxf2ArhO7QBS0no7gIlwWdIbO3XtAawBtdRuYGjXMmCjiLIcvXRPPOb4cqDI+CSy+XDkxeelqMS6q3rCsLgG8O/zaXAvNfQ96oAAAAABJRU5ErkJggg==';
sprite_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAM1BMVEUAAACE0vsJgsETicYKebIgkswIfrsLdKoRgbo0oNdCqd46pd0disBXt+cwnNN8zvdtxfMmMafIAAAAAnRSTlMAEoUqvHAAAABbSURBVAjXJY3JEcAwCAMdcxpf6b/aCLIv7YCggUdA+5mDeldfmUdQp67MDAlB5iVutYTM+52wzGp+7yZrJ/cNk6CcVNuJFKUjOAxVqzcwgH5aHBFxbsUTsur/B9V6As3dixo5AAAAAElFTkSuQmCC';
sprite_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAJFBMVEUAAADs7Ozo5+fv7u7a1tbo5+fj39/d2trSzs7Iw8O7tbWsqKgpHvYvAAAAA3RSTlMAOSIhkgiAAAAAWklEQVQI12NgEDQOUWRgYAw1NvUUYFBNdynNWMigbGya4tLAYGxsbOrRxWBs4u7iMZshLL28pGM1SDCsYjYDq7GxWcUsBtGwFBePRQyM6cVmngoMDELGZkwMADJcE8vDAZzpAAAAAElFTkSuQmCC';
boom_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAARVBMVEUAAAD/Og3/MQ7/dgP/kAP/agX/VQf/iAP/SQn/Owv/HRH/fgT/Swj/YQb/ZQX/hwD/Kw7/GRH/FBP/pwH/mwL/zAD/uQH8kbg4AAAAE3RSTlMABAr8/vv7/fn1E/7s+e4e8/EtiDeSTQAAAIJJREFUCB0FwYcBwzAMBLF7kupylZz9Rw0AuiS4pwEde54GMwN6DKzVpOpCrQqkw49ZkqUkoEsevt0DRM0Zj71iD3Fhp49Yv+8XnmQAp+/v+1bx1ABS2WutFV0XVtPwWCNK6RL5OO30neMYGWMCs6RWqLmDAa28dzLVbEjXna2/VQB/9KkFByfSWq4AAAAASUVORK5CYII=';
boom_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAMFBMVEWLcw1+Zw6Cag9zXA6IcQ90XhB6Yw6ReQ1kTg9tVw9/aA9kThBnUQ+ZgA6Mcw+tkRcIyT11AAAADXRSTlMCCv4V/P39/fz69XzZbo3lQQAAAHJJREFUCNdjYGAQ4GIEkmILGZYwGDkycGgxqAMhA2PfgndsF4ASba6x6gxAYKkUe0+AgcHQSun9tam7Ge7evfv/ikoag2BH6/8nzMJAY/ruPgMZJOJaniooyMDgZFwgOpmRgSmRsUBgDjMDpwGzI+NURgDNzRvdY8ialAAAAABJRU5ErkJggg==';
boom_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAwdcwxe84rgc4zdMwxh9A4jdMqe8w6ldYpd8tAoNocZsVIpt1DkdY5ktQxidE2kNQxf88veMw9itI3jNM4idEjbsg6jtNIoNo6mNdKs+AzjNJRvuREqtw2p81NAAAAGXRSTlMABw/7HP39/PPy/vIlFf3w9OmmUMGki2WIXxOO3gAAAIxJREFUCB0FwYUBwzAQALF7MIdTst3uv2YlEBfkkQUQRWJxYd8ElqzIFZ8rRwfP2cE/dq85iu71CYo+UuvzbbWs4O4vCzXYLywIR7AUbIwRb0UxC6HX73fEGexEWJr9xqgxWdkRtPU5e+xvREHalq40r213FF5bWrVMvfupsB5N8BKFJZ8CCiwlOKjIH6dABrw3FL34AAAAAElFTkSuQmCC';
boom_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAY1BMVEUAAADo4eHx7e3u5+fUy8vi2tra09PVysrv7Ozs5ubc09Pf2dnPxsbo4+PZ0tLw7u7CsrLi2dn08/PVzMzh29vn5OS/s7P+/Pzz8vLEtbXz8fHn4+PNwMDr5eXr4+P18vLd09OP7aMuAAAAHnRSTlMA/P7+Cf35+PTyR/X17u3bLxX15uO/hksf8eaglGdMQRepAAAAe0lEQVQIHQXBh0EDMRAAMJ3t7z2dBPzZf0okYNzuUJ7Ggld/w2tdvNfxUPpgn+Lp0y9j2Yds7zKs/XBta/r7nuBoI+ea4pxBeXRRa/1GB4+fuWuaFE1Oqbm6D0PUqLVmHNDWlM8zA0w1STmh4LcJtJcFzDGB2wUAhW3jH7FEBefzYq9lAAAAAElFTkSuQmCC';
/////////////////------------------\\\\\\\\\\\\\\\\\

var renderops = { // Used to fix canvases being drawn when they shouldn't be
	main: false,
	levelselect: false,
	game: false
};

var Options = { // Keeps track of planet and weapon type
	planType: "fire",
	wepType: "fire",
	volume: 0.1,
	difficulty: 0,
	resize: false
};

var powerups = { // Toggles and timers for powerups
	multishot: {
		toggle: false,
		timer: 1000
	},
	fastshot: {
		toggle: false,
		nrof: 15, // Normal rate of fire, gets changed in game init
		frof: 12, // Fastshot rate of fire
		timer: 1000
	},
	penetrate: {
		toggle: false,
		timer: 1000
	},
	splash: {
		toggle: false,
		timer: 1000
	},
	invincibility: {
		toggle: false,
		timer: 1000
	}
};

var planTraits = { // Color is the circle color, stroke is the outline
	fire: {
		plancolor: "#F72A0A",
		planstroke: "#CF2308"
	},
	air: {
		plancolor: "#DEDEDE",
		planstroke: "#BFBFBF"
	},
	water: {
		plancolor: "#076DF2",
		planstroke: "#0658C4"
	},
	rock: {
		plancolor: "#6B4303",
		planstroke: "#593802"
	}
}

var wepTraits = { // Traits for the player weapons
	fire: {
		color: "orange",
		rof: 5, // Rate of fire
		speed: 15,
		damage: 3
	},
	air: {
		color: "ghostwhite",
		rof: 50,
		speed: 15,
		damage: 20
	},
	water: {
		color: "deepskyblue",
		rof: 20,
		speed: 20,
		damage: 10
	},
	rock: {
		color: "saddlebrown",
		rof: 30,
		speed: 10,
		damage: 25
	}
}

var enemyTraits = {
	fire: {
		img: sprite_fire,
		boom: boom_fire,
		speed: 4,
		rof: 20,
		health: 100,
		damage: 10,
		bulletColor: "orange"
	},
	air: {
		img: sprite_air,
		boom: boom_air,
		speed: 5,
		rof: 100,
		health: 50,
		damage: 5,
		bulletColor: "ghostwhite"
	},
	water: {
		img: sprite_water,
		boom: boom_water,
		speed: 3,
		rof: 100,
		health: 150,
		damage: 15,
		bulletColor: "deepskyblue"
	},
	rock: {
		img: sprite_rock,
		boom: boom_rock,
		speed: 2,
		rof: 100,
		health: 200,
		damage: 20,
		bulletColor: "saddlebrown"
	}

}

var mults = { // Multipliers used for damage and score, kept key value style to save lines
	fire: {
		waterdmg: 1.25,
		waterscore: 0.75,
		airdmg: 0.75,
		airscore: 1.25,
		firedmg: 1.0,
		firescore: 1.0,
		rockdmg: 1.0,
		rockscore: 1.0
	},
	air: {
		waterdmg: 1.0,
		waterscore: 1.0,
		airdmg: 1.0,
		airscore: 1.0,
		firedmg: 1.25,
		firescore: 0.75,
		rockdmg: 0.75,
		rockscore: 1.25
	},
	water: {
		waterdmg: 1.0,
		waterscore: 1.0,
		airdmg: 1.0,
		airscore: 1.0,
		firedmg: 0.75,
		firescore: 1.25,
		rockdmg: 1.25,
		rockscore: 0.75
	},
	rock: {
		waterdmg: 0.75,
		waterscore: 1.25,
		airdmg: 1.25,
		airscore: 0.75,
		firedmg: 1.0,
		firescore: 1.0,
		rockdmg: 1.0,
		rockscore: 1.0
	}
}
/////////////////------------------\\\\\\\\\\\\\\\\\