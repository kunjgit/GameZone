/**
*	---------------------------------------------------
*	FE.Player
*	---------------------------------------------------
**/
FE.Player = function(game, image, properties) {
	this.game = game;
	this.image = image;
	this.properties = properties;
	this.health = this.properties.health;
	
	// opponent have only one move, player 5
	this.defaultMoves = this.properties.enemy ? 1 : 5;
	this.moves = this.defaultMoves;
	
	/*
		0 - FIRE
		1 - WATER
		2 - EARTH
		3 - AIR
		
		all elements dealing 10 damage to opponent
		0 (FIRE)  is weak to 1 (WATER)
		1 (WATER) is weak to 0 (FIRE) etc
 	*/
	this.damages = [1,0,3,2];
	this.isDead = false;
	
	// inventory array holding items
	// not used in this version
	this.inventory = [];
	
	// player's window color
	this._activeColors = ['#FFFFFF', '#ae4a12', '#DD6020'];
	// inactive window colors
	// not used in this version
	this._inactiveColors = ['#a0a0a0', '#808080', '#909090'];
	
	MGE.DisplayObjectContainer.call(this);
	
	this.draw();
}

FE.Player.prototype = Object.create(MGE.DisplayObjectContainer.prototype);
FE.Player.prototype.constructor = FE.Player;

/**
*	---------------------------------------------------
*	FE.Player.getDamage
*	---------------------------------------------------
**/
FE.Player.prototype.getDamage = function(val, attack) {
	// determine attack strength 
	var dmg = this.damages[val];
	var multiplier = (FE.TYPES[this.properties.type] == dmg ? 1.5 : (FE.TYPES[this.properties.type] == val ? 0.5 : 1));
	var damage = Math.round(attack * multiplier);
	
	this.health -= damage;
	if (this.health <= 0) {
		this.health = 0;
		this.isDead = true;
		this.animateDeath();
	}
	// update health bar
	this.update();
	// update health text
	this.healthText.setText('HEALTH   : ' + this.health);

	return damage;
}

/**
*	---------------------------------------------------
*	FE.Player.animateDeath
*	---------------------------------------------------
**/
FE.Player.prototype.animateDeath = function() {
	var _self = this;
	
	var o2 = { 
		s: 4,
		a: 1
	};
	var p2 = { 
		s: 2,
		a: 0.5
	};
	
	new MGE.Tweener.Tween(o2)
	.to(p2, 1000)
	.onUpdate(function() {
		_self.avatar.alpha  = o2.a;
		_self.avatar.scaleX = o2.s;
		_self.avatar.scaleY = o2.s;				
	})
	.start()	
}

/**
*	---------------------------------------------------
*	FE.Player.update
*	---------------------------------------------------
**/
FE.Player.prototype.update = function() {
	if (this.health >= 0 && this.health <= this.properties.health) this.healthBar.scaleX = (this.health / this.properties.health);
	if (this.health <= 0) this.healthBar.scaleX = 0;
}

/**
*	---------------------------------------------------
*	FE.Player.reset
*	---------------------------------------------------
**/
FE.Player.prototype.reset = function() {
	// reset player's values, health bar, avatar - used at the start of round
	this.health = this.properties.health;
	this.update();
	this.attackText.setText('ATTACK   : ' + this.properties.attack);
	this.healthText.setText('HEALTH   : ' + this.properties.health);
	this.typeText.setText('TYPE     : ' + this.properties.type);
	this.weaknessText.setText('WEAKNESS : ' + this.properties.weakness);
	this.avatar.applyParams({
		scaleX: 4,
		scaleY: 4,
		alpha: 1
	})
	this.isDead = false;
	this.moves = this.defaultMoves;
}

/**
*	---------------------------------------------------
*	FE.Player.draw
*	---------------------------------------------------
**/
FE.Player.prototype.draw = function() {
	this.bg = new FE.Button('', this.game.font, 120, 161, (this.properties.active ? this._activeColors : this._inactiveColors)).applyParams({
	}).addTo(this);
	
	this.healthBarBG = new FE.Button('', this.game.smallFont, 140, 8, ['#FFFFFF', '#404040', '#404040']).applyParams({
		x: (this.properties.enemy ? -10 : 10),
		y: -88,
		visible: (this.properties.active ? true : false)
	}).addTo(this);	
	
	this.healthBar = new MGE.Rectangle(138, 6).applyParams({
		x: (this.properties.enemy ? 59 : -59),
		y: -88,
		fillStyle: '#00DD00',
		visible: (this.properties.active ? true : false),
		anchorX: (this.properties.enemy ? 1 : 0)
	}).addTo(this);

	this.avatar = new MGE.Sprite(this.image).applyParams({
		scaleX: 4,
		scaleY: 4,
		alpha : 1,
		x: 0,
		y: -20
	}).addTo(this);	
	
	// draw texts
	var xAlign = -48;
	var yAlign = 34;
	
	this.attackText = new MGE.BitmapText('ATTACK   : ' + this.properties.attack, this.game.smallFont);
	this.attackText.applyParams({
		x: xAlign,
		y: yAlign
	}).addTo(this);	
	
	this.healthText = new MGE.BitmapText('HEALTH   : ' + this.properties.health, this.game.smallFont);
	this.healthText.applyParams({
		x: xAlign,
		y: yAlign + 10
	}).addTo(this);		
	
	this.typeText = new MGE.BitmapText('TYPE     : ' + this.properties.type, this.game.smallFont);
	this.typeText.applyParams({
		x: xAlign,
		y: yAlign + 20
	}).addTo(this);

	this.weaknessText = new MGE.BitmapText('WEAKNESS : ' + this.properties.weakness, this.game.smallFont);
	this.weaknessText.applyParams({
		x: xAlign,
		y: yAlign + 30
	}).addTo(this);	
}