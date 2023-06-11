/**
*	---------------------------------------------------
*	FE.Moves
*	---------------------------------------------------
**/
FE.Moves = function(game, layer) {
	this.game = game;
	this.layer = layer;
	
	this.movesText = new MGE.BitmapText('', this.game.font);
	this.layer.addChild(this.movesText);
};

/**
*	---------------------------------------------------
*	FE.Moves._align
*	---------------------------------------------------
**/
FE.Moves.prototype._align = function() {
	this.movesText.x = this.game.width / 2  -this.movesText.textWidth / 2;
	this.movesText.y = 6;
}

/**
*	---------------------------------------------------
*	FE.Moves.setMoves
*	---------------------------------------------------
**/
FE.Moves.prototype.setMoves = function(t) {
	var _self = this;
	var o = {
		a: 1
	}
	var p = {
		a: 0
	}	
	new MGE.Tweener.Tween(o)
		.to(p, 300)
		.repeat(1)
		.yoyo(true)			
		.onUpdate(function() {
			_self.movesText.alpha = o.a;
		})
		.onYoyo(function() {
			_self.movesText.setText(t);
			_self._align();
		})
		.start()
}