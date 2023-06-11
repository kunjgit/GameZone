/**
*	---------------------------------------------------
*	FE.Elements
*	---------------------------------------------------
**/
FE.Elements = function(game, layer, whoStarts) {
	this.game = game;
	this.layer = layer;
	
	MGE.DisplayObjectContainer.call(this);
	this.layer.addChild(this);

	this.textures = [MGE.TextureCache.fire, MGE.TextureCache.water, MGE.TextureCache.earth, MGE.TextureCache.air];	
	this.init();
	
	this._pool = [];
	this._textPool = [];
	this._maxPool = 30;
	this.initPool();
	
	this.createHitArea();
	this.selected = {};
	this.lastSelected = {
		col: -1,
		row: -1
	};
	this.comboCount = 0;
	this.whosTurnItIs = whoStarts;
};

FE.Elements.prototype = Object.create(MGE.DisplayObjectContainer.prototype);
FE.Elements.prototype.constructor = FE.Elements;

/**
*	---------------------------------------------------
*	FE.Elements.init
*	---------------------------------------------------
**/
FE.Elements.prototype.init = function() {
	this.removeAll();

	for (var i=0; i < this.game.grid.size.y; i++) {
		for (var j=0; j < this.game.grid.size.x; j++) {
			var tmp = new MGE.Sprite(this.textures[this.game.grid.getItem(i,j)].src).applyParams({
				scaleX: 2,
				scaleY: 2,
				x: j * 51 + 32,
				y: i * 51 + 243
			}).addTo(this);
		}
	}	
}

/**
*	---------------------------------------------------
*	FE.Elements.initPool
*	---------------------------------------------------
**/
FE.Elements.prototype.initPool = function() {
	this.poolContainer = new MGE.DisplayObjectContainer();
	this.addChild(this.poolContainer);
	
	this.textPoolContainer = new MGE.DisplayObjectContainer();
	this.addChild(this.textPoolContainer);	
	
	this.comboPoolContainer = new MGE.DisplayObjectContainer();
	this.addChild(this.comboPoolContainer);		

	for (var i=0; i < this._maxPool; i++) {
		var tmp = new MGE.Sprite(this.textures[0].src).applyParams({
			visible : false
		}).addTo(this.poolContainer);
		this._pool.push(tmp);
		
		tmp = new MGE.BitmapText('12345', this.game.smallFontGrey);
		tmp.applyParams({
			visible: false
		}).addTo(this.textPoolContainer);
		this._textPool.push(tmp);		
	}

	tmp = new MGE.BitmapText('X COMBO', this.game.comboFont);
	tmp.applyParams({
		visible: false
	}).addTo(this.comboPoolContainer);
}

/**
*	---------------------------------------------------
*	FE.Elements.getFromPool
*	---------------------------------------------------
**/
FE.Elements.prototype.getFromPool = function(which) {
	var tmp;
	
	for (var i=0; i < this._maxPool; i++) {
		if (this[which][i].visible === false) {
			this[which][i].visible = true;
			break;
		}
	}
	
	if (i >= this._maxPool) {
		return null;
	}

	return this[which][i];
}

/**
*	---------------------------------------------------
*	FE.Elements.interactive
*	---------------------------------------------------
**/
FE.Elements.prototype.interactive = function(val) {
	this.area.active = val;
}

/**
*	---------------------------------------------------
*	FE.Elements.animateRemoved
*	---------------------------------------------------
**/
FE.Elements.prototype.animateRemoved = function(removed, callback) {
	for (var i in removed) {
		var tmp = this.getFromPool('_pool');
		var which = this.children[removed[i].row * this.game.grid.size.x + removed[i].col];
		which.visible = false;

		// out of pool
		if (tmp == null) {
			if (callback) {
				callback.call(); 
			}			
		}
		
		tmp.applyParams({
			texture: which.texture,
			x: which.x,
			y: which.y,
			scaleX: which.scaleX,
			scaleY: which.scaleY			
		});

		this.animateOneRemoved(tmp, i, null);
	}
	
	if (callback) {
		callback.call(); 
	}	
}

/**
*	---------------------------------------------------
*	FE.Elements.animateOneRemoved
*	---------------------------------------------------
**/
FE.Elements.prototype.animateOneRemoved = function(removed, delay, callback) {
	var _self = this;
	
	var o = { 
		x: removed.x,
		y: removed.y,
		
		s: 2
	};
	var p = { 
		x: this.game.opponent.x + this.game.opponent.avatar.x,
		y: this.game.opponent.y + this.game.opponent.avatar.y,

		s: 1
	};
	
	var a = new MGE.Tweener.Tween(o)
	.to(p, 500)
	.delay(delay * 100)
	.onUpdate(function() {
		removed.x = o.x;
		removed.y = o.y;
		removed.scaleX = o.s;
		removed.scaleY = o.s;
	})
	.onComplete(function() {
		setTimeout(function() {
			_self.animateDamage(removed, _self.game.opponent);
			removed.visible = false;
		}, 30);
		if (callback) {
			callback.call();
		}
	})	
	.start()
}

/**
*	---------------------------------------------------
*	FE.Elements.animateDamage
*	---------------------------------------------------
**/
FE.Elements.prototype.animateDamage = function(xxx, who, callback) {
	for (var i=0; i < this.textures.length; i++) {
		if (xxx.texture.src == this.textures[i].src) break;
	}
	var damage = who.getDamage(i, (who == this.game.opponent ? this.game.player.properties.attack : this.game.opponent.properties.attack));
	
	var removed = this.getFromPool('_textPool');
	removed.applyParams({
		x: xxx.x + Math.random() * 30 - 15,
		y: xxx.y - 30
	});
	removed.setText('-' + damage);
	
	this.animateOpponent(who);
	
	var o = { 
		y: removed.y,
		a: 1
	};
	var p = { 
		y: removed.y - 50,
		a: 0
	};
	
	new MGE.Tweener.Tween(o)
	.to(p, 1000)
	.onUpdate(function() {
		removed.y = Math.floor(o.y);
		removed.alpha = o.a;
	})
	.onComplete(function() {
		setTimeout(function() {
			removed.visible = false;
		}, 30);
		if (callback) {
			callback.call();
		}
	})	
	.start()	
}

/**
*	---------------------------------------------------
*	FE.Elements.animateOpponent
*	---------------------------------------------------
**/
FE.Elements.prototype.animateOpponent = function(who) {
	if (who.isDead) return;
	var _self = this;
	var o = { 
		s: 4
	};
	var p = { 
		s: 4.3
	};
	
	new MGE.Tweener.Tween(o)
	.to(p, 45)
	.repeat(1)
	.yoyo(true)
	.onUpdate(function() {
		who.avatar.scaleX = who.avatar.scaleY = o.s;
	})
	.start()	
}

/**
*	---------------------------------------------------
*	FE.Elements.checkMove
*	---------------------------------------------------
**/
FE.Elements.prototype.checkMove = function(start, end) {
	var removedItems = [];
	var removedItems2 = [];
	
	this.game.player.moves --;
	if (this.game.player.moves >=  0) {
		this.game.moves.setMoves(this.game.player.moves.toString());
	} 
	
	if (this.game.grid.isStreak(start.row, start.col) || this.game.grid.isStreak(end.row, end.col)) {
		this.interactive(false);
		// we have a streak, determine which one is it, maybe both of them
		if (this.game.grid.isStreak(start.row, start.col)){
			removedItems = this.game.grid.removeItems(start.row, start.col);
		}
		if (this.game.grid.isStreak(end.row, end.col)){
			removedItems2 = this.game.grid.removeItems(end.row, end.col);
		}
		// in case 2nd streak was triggered, merge arrays
		if (removedItems2.length > 0) {
			removedItems = removedItems.concat(removedItems2);
		}
		this.animateRemoved(removedItems);
		this.applyGravity();
		// check for round over
		// this.checkMovesCount();
	} else {
		// check for round over
		this.checkMovesCount();
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.applyGravity
*	---------------------------------------------------
**/
FE.Elements.prototype.applyGravity = function() {
	var self = this;
	this.falling = true;
	var itemsToMove = this.game.grid.applyGravity();

	this.fallDownSpritesAnimation(itemsToMove, 
		function() {
			self.reorderFallenSprites(itemsToMove);
			if (itemsToMove.length != 0) {
				self.applyGravity();
			} else {
				self.checkCombo(function() {
					setTimeout(function() {
						self.refill();
					}, 30);
				});
			}
		}
	);
}

/**
*	---------------------------------------------------
*	FE.Elements.checkCombo
*	---------------------------------------------------
**/
FE.Elements.prototype.checkCombo = function(callback) {
	var self = this;

	var a = this.game.grid.checkCombo();
	if (a.count != 0) {
		this.comboCount++;
		this.animateRemoved(a.removed, function() {
			setTimeout(function() {
				if (callback) {
					callback.call();
				}
			}, 30);
		});
	} else {
		if (callback) {
			callback.call();
		}
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.refill
*	---------------------------------------------------
**/
FE.Elements.prototype.refill = function(s) {
	var newItems = this.game.grid.refillGrid();
	var self = this;
	
	for (var i in newItems) {
		var tmp = newItems[i].row * this.game.grid.size.x + newItems[i].col;
		this.children[tmp].texture = this.textures[this.game.grid.getItem(newItems[i].row, newItems[i].col)];
		this.children[tmp].visible = true;
	}

	if (newItems.length != 0) {
		this.applyGravity();
	} else {
		// done with falling, refilling
		if (this.comboCount > 0) {
			this.showComboWords(this.comboCount, function() {
				self.comboCount = 0;
				self.interactive(true);
				// check for game over
				self.checkMovesCount();	
			});
		} else {
			self.interactive(true);
			// check for game over
			this.checkMovesCount();
		}
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.showComboWords
*	---------------------------------------------------
**/
FE.Elements.prototype.showComboWords = function(kery, callback) {
	var self = this;
	if (this.animatingCombo) {
		if (callback) {
			callback.call();
		}
		return;
	}

	this.animatingCombo = true;
	this.animateComboWord(kery, function() {
		self.animatingCombo = false;
		if (callback) {
			callback.call();
		}
	});
}

/**
*	---------------------------------------------------
*	FE.Elements.animateComboWord
*	---------------------------------------------------
**/
FE.Elements.prototype.animateComboWord = function(kery, callback) {
	var txt = kery + 'X COMBO';
	var cmb = this.comboPoolContainer.children[0];
	cmb.setText(txt);
	cmb.visible = true;
	cmb.x = this.game.width / 2 - cmb.textWidth / 2;
	cmb.y = 340;
	
	var o = { 
		y: 480
	};
	var p = { 
		y: 190
	};
	
	new MGE.Tweener.Tween(o)
	.to(p, 3000)
	.onUpdate(function() {
		cmb.y = Math.floor(o.y);
	})
	.onComplete(function() {
		cmb.visible = false;
		
		if (callback) {
			callback.call();
		}
	})	
	.start()	
	
	var o2 = { 
		a: 0
	};
	var p2 = { 
		a: 1
	};
	
	new MGE.Tweener.Tween(o2)
	.to(p2, 1500)
	.repeat(1)
	.yoyo(true)
	.onUpdate(function() {
		cmb.alpha = o2.a;				
	})
	.start()	
}

/**
*	---------------------------------------------------
*	FE.Elements.reorderFallenSprites
*	---------------------------------------------------
**/
FE.Elements.prototype.reorderFallenSprites = function(s) {
	// return fallen sprites back to original position
	for (var i in s) {
		var tmp = s[i].row * this.game.grid.size.x + s[i].col;
		this.children[s[i].row * this.game.grid.size.x + s[i].col].y -= 51;
	}
	
	// set proper textures for sprites
	this.resetSprites(s);
}

/**
*	---------------------------------------------------
*	FE.Elements.resetSprites
*	---------------------------------------------------
**/
FE.Elements.prototype.resetSprites = function(s) {
	for (var i=0; i < this.game.grid.size.y; i++) {
		for (var j=0; j < this.game.grid.size.x; j++) {
			if (this.game.grid.getItem(i, j) != -1) {
				this.children[i * this.game.grid.size.x + j].visible = true;
				this.children[i * this.game.grid.size.x + j].texture = this.textures[this.game.grid.getItem(i, j)];
			} else {
				this.children[i * this.game.grid.size.x + j].visible = false;
				this.children[i * this.game.grid.size.x + j].texture = this.textures[0];
			}
		}
	}	
}
	
/**
*	---------------------------------------------------
*	FE.Elements.fallDownSpritesAnimation
*	---------------------------------------------------
**/
FE.Elements.prototype.fallDownSpritesAnimation = function(s, callback) {
	if (this.animating) {
		return;
	}
	var self = this;
	var b;
	var initPositions = [];
	var o = {
		y : 0
	};
	var p = {
		y: 51
	}
	
	this.animating = true;
	for (var i in s) {
		initPositions.push(this.children[s[i].row * this.game.grid.size.x + s[i].col].y);
	}
	
	new MGE.Tweener.Tween(o)
		.to(p, 60)
		.easing('Linear')
		.onUpdate(function() {
			for (var i in s) {
				self.children[s[i].row * self.game.grid.size.x + s[i].col].y = initPositions[i] + o.y;
			}		
		})
		.onComplete(function() {
			self.animating = false;
			setTimeout(function() {
				for (var i in s) {
					self.children[s[i].row * self.game.grid.size.x + s[i].col].y = initPositions[i] + o.y;
				}
				
				if (callback) {
					callback.call();
				}
			}, 5);
		})	
		.start()	
}

/**
*	---------------------------------------------------
*	FE.Elements.checkMovesCount
*	---------------------------------------------------
**/
FE.Elements.prototype.checkMovesCount = function() {
	if (this.game.player.isDead || this.game.opponent.isDead) {
		this.interactive(false);
		this.gameOver();
	} else if (this.game.player.moves <= 0) {
		this.interactive(false);
		this.roundOver();
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.opponentAttack
*	---------------------------------------------------
**/
FE.Elements.prototype.opponentAttack = function() {
	var _self = this;
	var pool1 = this.getFromPool('_pool');
	pool1.applyParams({
		texture: this.textures[FE.TYPES[this.game.opponent.properties.type]],
		x: this.game.opponent.x + this.game.opponent.avatar.x,
		y: this.game.opponent.y + this.game.opponent.avatar.y,
		scaleX: 2,
		scaleY: 2
	});	
	
	var o = { 
		s: 2
	};
	var p = { 
		s: 4
	};
	
	new MGE.Tweener.Tween(o)
	.to(p, 500)
	.onUpdate(function() {
		pool1.scaleX = o.s;
		pool1.scaleY = o.s;		
	})
	.start()

	var o2 = { 
		s: 4
	};
	var p2 = { 
		s: 3
	};
	
	new MGE.Tweener.Tween(o2)
	.to(p2, 500)
	.repeat(2)
	.yoyo(true)
	.delay(500)
	.onUpdate(function() {
		pool1.scaleX = o2.s;
		pool1.scaleY = o2.s;		
	})
	.start()

	var o3 = { 
		s: 4,
		x: pool1.x,
		y: pool1.y
	};
	var p3 = { 
		s: 2,
		x: this.game.player.x + this.game.player.avatar.x,
		y: this.game.player.y + this.game.player.avatar.y,		
	};
	
	new MGE.Tweener.Tween(o3)
	.to(p3, 200)
	.delay(2000)
	.onUpdate(function() {
		pool1.scaleX = o3.s;
		pool1.scaleY = o3.s;		
		pool1.x = o3.x;
		pool1.y = o3.y;		
	})
	.onComplete(function() {
		pool1.visible = false;
		_self.animateDamage(pool1, _self.game.player);
		_self.checkMovesCount();
	})
	.start()	
}

/**
*	---------------------------------------------------
*	FE.Elements.roundOver
*	---------------------------------------------------
**/
FE.Elements.prototype.roundOver = function() {
	this.whosTurnItIs = !this.whosTurnItIs;
	
	// opponent's move
	if (this.whosTurnItIs == 1) {
		this.opponentAttack();
	} else {
		this.game.player.moves = this.game.player.defaultMoves;
		this.game.moves.setMoves(this.game.player.moves.toString());
		this.interactive(true);
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.gameOver
*	---------------------------------------------------
**/
FE.Elements.prototype.gameOver = function() {
	var _self = this;
	this.interactive(false);
	
	this.game.overLayer.visible = true;	
	this.game.overLayer.area.active = true;
	
	if (this.game.opponent.isDead) {
		FE.CURRENTENEMY ++;
		this.game.overLayer.overText.setText('YOU WIN!');
		this.game.overLayer.overText.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText.textWidth / 2
		})
		this.game.overLayer.overText2.setText('PREPARE FOR');
		this.game.overLayer.overText2.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText2.textWidth / 2
		})	
		this.game.overLayer.overText3.setText('NEXT ROUND');
		this.game.overLayer.overText3.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText3.textWidth / 2
		})
		this.game.overLayer.continueButton.setText('CONTINUE');		
	} else {
		this.game.overLayer.overText.setText('YOU LOSE!');
		this.game.overLayer.overText.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText.textWidth / 2
		})
		this.game.overLayer.overText2.setText('BETTER LUCK');
		this.game.overLayer.overText2.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText2.textWidth / 2
		})	
		this.game.overLayer.overText3.setText('NEXT TIME!');
		this.game.overLayer.overText3.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText3.textWidth / 2
		})
		this.game.overLayer.continueButton.setText('RESTART');
	}
	
	if (FE.CURRENTENEMY + 1 > FE.OPPONENTS.length) {
		this.game.overLayer.continueButton.visible = false;
		this.game.overLayer.overText.setText('GAME OVER');
		this.game.overLayer.overText.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText.textWidth / 2
		});
		this.game.overLayer.overText2.setText('YOU DID IT!');
		this.game.overLayer.overText2.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText2.textWidth / 2
		})	
		this.game.overLayer.overText3.setText('YOU SAVED LIVES');
		this.game.overLayer.overText3.applyParams({
			x: this.game.width / 2 - this.game.overLayer.overText3.textWidth / 2
		})
	} else {
		this.game.overLayer.area.onPointerDown = function() {
			if (_self.game.player.isDead) {
				FE.CURRENTENEMY = 0;
			}
			_self.game.overLayer.area.active = false;
			_self.game.opponent.properties = FE.OPPONENTS[FE.CURRENTENEMY];
			_self.game.opponent.reset();
			_self.game.player.reset();
			_self.game.overLayer.visible = false;
			_self.interactive(true);
			_self.game.moves.setMoves(_self.game.player.moves.toString());
		}
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.doDecision
*	---------------------------------------------------
**/
FE.Elements.prototype.doDecision = function(val) {
	var _self = this;
	
	if ((this.selected.col == this.lastSelected.col) && (this.selected.row == this.lastSelected.row)) {
		this.highlight(this.selected, 2.5, 2);
		this.lastSelected.col = -1;
		this.lastSelected.row = -1;	
	} else {
		_self.tmp = {
			col: _self.lastSelected.col,
			row: _self.lastSelected.row
		}

		this.highlight(this.selected, 2, 2.5, function() {
			// animate swap
			setTimeout(function() {
				if ((_self.tmp.col !== -1 ) && (_self.tmp.row !== -1)) {
					_self.game.grid.swap(_self.selected, _self.tmp);
					_self.interactive(false);
					
					// will be not animating, allow clicking after swap animation
					if (!_self.game.grid.isStreak(_self.selected.row, _self.selected.col) || !_self.game.grid.isStreak(_self.tmp.row, _self.tmp.col)) {
						setTimeout(function() {
							_self.interactive(true);
							_self.checkMovesCount();
						}, 550);
					}
					_self.swap(_self.selected, _self.tmp, function() {
						setTimeout(function() {
							_self.checkMove(_self.selected, _self.tmp);
							_self.lastSelected.col = -1;
							_self.lastSelected.row = -1;
						}, 50);
					});
				}
			}, 50);
		});
		_self.lastSelected.col = _self.selected.col;
		_self.lastSelected.row = _self.selected.row;	
	}
}

/**
*	---------------------------------------------------
*	FE.Elements.createHitArea
*	---------------------------------------------------
**/
FE.Elements.prototype.createHitArea = function() {
	var _self = this;
	
	this.area = new MGE.HitArea(7, 218, 306, 255);
	this.area.onPointerDown = function(clickedPos) {
		_self.selected = _self.determinePosition(clickedPos, this);
		_self.doDecision();
	}	
}

/**
*	---------------------------------------------------
*	FE.Elements.determinePosition
*	---------------------------------------------------
**/
FE.Elements.prototype.determinePosition = function(pos, area) {
	var x = Math.floor((pos.x - area.x) / 51);
	var y = Math.floor((pos.y - area.y) / 51);
	return {'col':x, 'row':y}
}

/**
*	---------------------------------------------------
*	FE.Elements.highlight
*	---------------------------------------------------
**/
FE.Elements.prototype.highlight = function(pos, f, t, callback) {
	var _self = this;
	var o = { s: f };
	var p = { s: t };

	var which = _self.children[pos.row * _self.game.grid.size.x + pos.col];
	
	new MGE.Tweener.Tween(o)
	.to(p, 200)
	.onUpdate(function() {
		which.scaleX = o.s;
		which.scaleY = o.s;
	})
	.onComplete(function() {
		if (callback) {
			callback.call();
		}
	})	
	.start()
}

/**
*	---------------------------------------------------
*	FE.Elements.swap
*	---------------------------------------------------
**/
FE.Elements.prototype.swap = function(pos1, pos2, callback) {
	var _self = this;
	
	var which1 = this.children[pos1.row * _self.game.grid.size.x + pos1.col];
	var pool1 = this.getFromPool('_pool');
	pool1.applyParams({
		texture: which1.texture,
		x: which1.x,
		y: which1.y,
		scaleX: which1.scaleX,
		scaleY: which1.scaleY
	});

	var which2 = this.children[pos2.row * _self.game.grid.size.x + pos2.col];
	var pool2 = this.getFromPool('_pool');
	pool2.applyParams({
		texture: which2.texture,
		x: which2.x,
		y: which2.y,
		scaleX: which2.scaleX,
		scaleY: which2.scaleY
	});	
	
	which1.applyParams({
		texture: which2.texture,
		scaleX: 2,
		scaleY: 2,
		visible: false
	});
	which2.applyParams({
		texture: pool1.texture,
		scaleX: 2,
		scaleY: 2,
		visible: false
	});	

	var o = { 
		x1: pool1.x,
		y1: pool1.y,
		
		x2: pool2.x,
		y2: pool2.y,
		
		s: 2.5
	};
	var p = { 
		x1: pool2.x,
		y1: pool2.y,
		
		x2: pool1.x,
		y2: pool1.y,
		
		s: 2
	};
	
	new MGE.Tweener.Tween(o)
	.to(p, 500)
	.onUpdate(function() {
		pool1.x = o.x1;
		pool1.y = o.y1;
		pool1.scaleX = o.s;
		pool1.scaleY = o.s;		

		pool2.x = o.x2;
		pool2.y = o.y2;
		pool2.scaleX = o.s;
		pool2.scaleY = o.s;				
	})
	.onComplete(function() {
		which1.visible = true;
		which2.visible = true;
		
		pool1.visible = false;
		pool2.visible = false;
		
		if (callback) {
			callback.call();
		}
	})	
	.start()
}