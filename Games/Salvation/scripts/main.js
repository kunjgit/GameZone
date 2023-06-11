
(function() {

var FE = FE || {};
FE.TYPES = {
	FIRE  : 0,
	WATER : 1,
	EARTH : 2,
	AIR   : 3
}

FE.CURRENTENEMY = 0;
FE.OPPONENTS = [
	{
		'attack'   : 300,
		'health'   : 1500,
		'type'     : 'EARTH',
		'weakness' : 'AIR',
		'active'   : true,
		'enemy'    : true
	},
	{
		'attack'   : 340,
		'health'   : 1700,
		'type'     : 'AIR',
		'weakness' : 'EARTH',
		'active'   : true,
		'enemy'    : true
	},
	{
		'attack'   : 380,
		'health'   : 1900,
		'type'     : 'FIRE',
		'weakness' : 'WATER',
		'active'   : true,
		'enemy'    : true
	},	
	{
		'attack'   : 410,
		'health'   : 2100,
		'type'     : 'WATER',
		'weakness' : 'FIRE',
		'active'   : true,
		'enemy'    : true
	}
]
var _root = this;
var game;

/**
*	---------------------------------------------------
*	FE.Start
*	---------------------------------------------------
**/
FE.Start = function() {
	game = new MGE.Game();
	
	new FE.MakeImages();
	FE.CreateLayers(game);
	
	game.smallFont = new FE.MakeFont({
		color    : '#FFFFFF',
		shadow   : '#ae4a12',
		size     : 1
	});		
	
	game.smallFontGrey = new FE.MakeFont({
		color    : '#FFFFFF',
		shadow   : '#303030',
		size     : 1
	});		

	game.comboFont = new FE.MakeFont({
		color    : '#b80000',
		shadow   : '#FFFFFF',
		size     : 4
	});	
	
	game.font = new FE.MakeFont({
		color    : '#FFFFFF',
		shadow   : '#505050',
		size     : 2
	});	
	// wait for last font
	game.font.onComplete = FE.initTextures;
}

/**
*	---------------------------------------------------
*	FE.initTextures
*	---------------------------------------------------
**/
FE.initTextures = function() {
	// opponent will use same textures. Will be drawn later to make sure that all images are already cached
	game.player = new FE.Player(game, MGE.TextureCache.angel.src, {
		'attack'   : 10,
		'health'   : 2000,
		'type'     : 'FIRE',
		'weakness' : 'WATER',
		'active'   : true,
		'enemy'    : false
	}).applyParams({
		x: 64,
		y: 97
	}).addTo(game.playersContainer);
	
	game.moves = new FE.Moves(game, game.gameLayer);
	var versus = new MGE.BitmapText('VS', game.font);
	versus.applyParams({
		x: game.width / 2 - versus.textWidth / 2,
		y: 92
	}).addTo(game.gameLayer);
	
	var inventory = new FE.Button('INVENTORY - ' + game.player.inventory.length + ' ITEMS', game.font, 314, 30).applyParams({
		x: 160,
		y: 196
	}).addTo(game.playgroundContainer);

	var chessboard = new FE.Chessboard(6, 5, 51, 6, ['#e9f1f6', '#c6def0']).applyParams({
		x: 160,
		y: 345
	}).addTo(game.playgroundContainer);	
	
	var inventoryBg = new FE.Button('', game.smallFont, 310, 200, ['#FFFFFF', '#404040', '#404040']).applyParams({
		x: game.width / 2,
		y: 314
	}).addTo(game.inventoryContainer);
	
	// same sized button for 'close inventory' will be created later
	var inventoryDescription = new FE.Button('YOU HAVE NO ITEMS TO USE', game.smallFontGrey, 310, 27, ['#FFFFFF', '#404040', '#404040']).applyParams({
		x: game.width / 2,
		y: 430
	}).addTo(game.inventoryContainer);		
	
	// same sized button for 'use item' will be created later
	var cancelButton = new FE.Button('CANCEL', game.font, 154 , 30).applyParams({
		x: 81,
		y: 462
	}).addTo(game.inventoryContainer);
	
	var overBG = new FE.Button('', game.font, 200, 200, ['#FFFFFF', '#ae4a12', '#DD6020']).applyParams({
		x: game.width / 2,
		y: 240
	}).addTo(game.overLayer);
	
	game.overLayer.overText = new MGE.BitmapText('YOU WIN!', game.font);
	game.overLayer.overText.applyParams({
		x: game.width / 2 - game.overLayer.overText.textWidth / 2,
		y: 160
	}).addTo(game.overLayer);
	
	game.overLayer.overText2 = new MGE.BitmapText('PREPARE FOR', game.font);
	game.overLayer.overText2.applyParams({
		x: game.width / 2 - game.overLayer.overText2.textWidth / 2,
		y: 220
	}).addTo(game.overLayer);	
	
	game.overLayer.overText3 = new MGE.BitmapText('NEXT ROUND', game.font);
	game.overLayer.overText3.applyParams({
		x: game.width / 2 - game.overLayer.overText3.textWidth / 2,
		y: game.overLayer.overText2.y + 20
	}).addTo(game.overLayer);	
	
	game.overLayer.continueButton = new FE.Button('CONTINUE', game.font, 160, 30, ['#4f2f03', '#FFFFFF', '#46cd21']).applyParams({
		x: 160,
		y: 304
	}).addTo(game.overLayer);
	
	game.overLayer.area = new MGE.HitArea(0, 0, 320, 480);
	game.overLayer.area.active = false;
	
	// give device enough time to create and cache all images
	// play intro here
	new FE.Intro(game, game.introLayer);
}

/**
*	---------------------------------------------------
*	FE.initCachedTextures
*	---------------------------------------------------
**/
FE.initCachedTextures = function() {
	game.introLayer.visible = false;
	
	var closeInventory = new FE.Button('CLOSE INVENTORY', game.font, 314, 30).applyParams({
		x: 160,
		y: 196
	}).addTo(game.inventoryContainer);
	
	var useButton = new FE.Button('USE ITEM', game.font, 154, 30).applyParams({
		x: 239,
		y: 462
	}).addTo(game.inventoryContainer);


	game.elementsContainer = new MGE.DisplayObjectContainer();
	game.playgroundContainer.addChild(game.elementsContainer);
	
	game.grid = new FE.Grid(6, 5, [0, 1, 2, 3]);

	game.elements = new FE.Elements(game, game.playgroundContainer, 0);
	
	game.gameLayer.visible = true;	
	FE.startGame();
}

/**
*	---------------------------------------------------
*	FE.createOpponent
*	---------------------------------------------------
**/
FE.createOpponent = function() {
	if (game.opponent !== undefined) {
		game.playersContainer.removeChild(game.opponent);
	}

	game.opponent = new FE.Player(game, MGE.TextureCache.dragon.src, FE.OPPONENTS[FE.CURRENTENEMY]).applyParams({
		x: 256,
		y: 97
	}).addTo(game.playersContainer);
}
/**
*	---------------------------------------------------
*	FE.startGame
*	---------------------------------------------------
**/
FE.startGame = function() {
	FE.createOpponent();
	game.moves.setMoves(game.player.moves.toString());
	
	var inventoryButton = new MGE.HitArea(0, 181, 320, 30);
	inventoryButton.onPointerDown = function() {
		if (game.player.moves >  0) {
			if (game.playgroundContainer.visible) {
				game.playgroundContainer.visible = false;
				game.elements.interactive(false);
				game.inventoryContainer.visible  = true;
			} else {
				game.playgroundContainer.visible = true;
				game.elements.interactive(true);
				game.inventoryContainer.visible  = false;
			}
		}
	}
}

window.onload = function() {
	FE.Start();
}

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = FE;
	}
	exports.FE = FE;
} else {
	_root.FE = FE;
}

}).call(this);