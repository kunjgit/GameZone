///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
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
var muted = false;

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;

var keys = {
	up: false,
	down: false,
	left: false,
	right: false,
	mute: false,
	pause: false,
	fullscreen: false
}

var player;
var starfield;
var mousedown = false;
var firing = false;
var shootcount = 0;
var pBullets = [];
var eBullets = [];
var enemies = [];
var defenders = [];
var healthbars = [];
var powerups = {
	names: [],
	types: [],
	timer: 0,
	amount: 0
};
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
		//img: sprite_fire,
		//boom: boom_fire,
		speed: 4,
		rof: 20,
		health: 100,
		damage: 10,
		bulletColor: "orange"
	},
	air: {
		//img: sprite_air,
		//boom: boom_air,
		speed: 5,
		rof: 100,
		health: 50,
		damage: 5,
		bulletColor: "ghostwhite"
	},
	water: {
		//img: sprite_water,
		//boom: boom_water,
		speed: 3,
		rof: 100,
		health: 150,
		damage: 15,
		bulletColor: "deepskyblue"
	},
	rock: {
		//img: sprite_rock,
		//boom: boom_rock,
		speed: 2,
		rof: 100,
		health: 200,
		damage: 20,
		bulletColor: "saddlebrown"
	}

}

var mults = { // Multipliers used for damage and score, kept key value style to save lines
	fire: {
		waterdmg: 1.5,
		waterscore: 0.5,
		airdmg: 0.5,
		airscore: 1.5,
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
		firedmg: 1.5,
		firescore: 0.5,
		rockdmg: 0.5,
		rockscore: 1.5
	},
	water: {
		waterdmg: 1.0,
		waterscore: 1.0,
		airdmg: 1.0,
		airscore: 1.0,
		firedmg: 0.5,
		firescore: 1.5,
		rockdmg: 1.5,
		rockscore: 0.5
	},
	rock: {
		waterdmg: 0.5,
		waterscore: 1.5,
		airdmg: 1.5,
		airscore: 0.5,
		firedmg: 1.0,
		firescore: 1.0,
		rockdmg: 1.0,
		rockscore: 1.0
	}
}
/////////////////------------------\\\\\\\\\\\\\\\\\