/**
*	---------------------------------------------------
*	FE.Intro
*	---------------------------------------------------
**/
FE.Intro = function(game, layer) {
	var _self = this;
	this.game = game;
	this.layer = layer;
	
	this.draw();
	this.fadeIn();
};

FE.Intro.prototype = {
	// ----------------------------------------
	// draw
	// ----------------------------------------
	draw: function() {
		var _self = this;
		this.title1 = new MGE.BitmapText('SALVATION', this.game.font);
		this.title1.applyParams({
			x: this.game.width / 2 - this.title1.textWidth / 2,
			y: 214,
			alpha: 0
		}).addTo(this.layer);
		
		this.title2 = new MGE.BitmapText('OF FALLEN ANGEL', this.game.font);
		this.title2.applyParams({
			x: this.game.width / 2 - this.title2.textWidth / 2,
			y: this.title1.y + 20,
			alpha: 0
		}).addTo(this.layer);	

		this.title3 = new MGE.BitmapText('GSSOC', this.game.smallFontGrey);
		this.title3.applyParams({
			x: this.game.width / 2 - this.title3.textWidth / 2,
			y: this.title2.y + 20,
			alpha: 0
		}).addTo(this.layer);	

		this.skip = new MGE.BitmapText((MGE._isTouch ? 'TOUCH' : 'CLICK') + ' ANYWHERE TO CONTINUE', this.game.smallFontGrey);
		this.skip.applyParams({
			x: this.game.width / 2 - this.skip.textWidth / 2,
			y: 456,
			alpha: 0
		}).addTo(this.layer);
		
		this.area = new MGE.HitArea(0, 0, 320, 480);
		this.area.onPointerDown = function() {
			// remove hitArea from click detection list
			this.remove();
			MGE.Tweener.removeAll();
			FE.initCachedTextures();
		}		

	},
	
	// ----------------------------------------
	// fadeIn
	// ----------------------------------------
	fadeIn: function() {
		var _self = this;
		
		var o = {
			a: 0
		}
		var o1 = {
			a: 0
		}
		var o2 = {
			a: 0
		}
		var p = {
			a: 1
		}
		var p1 = {
			a: 1
		}
		var p2 = {
			a: 1
		}		
		new MGE.Tweener.Tween(o)
			.to(p, 1000)
			.onUpdate(function(ss,dd) {
				_self.title1.alpha = o.a;
			})
			.start()
		
		new MGE.Tweener.Tween(o1)
			.to(p1, 1000)
			.delay(200)
			.onUpdate(function() {
				_self.title2.alpha = o1.a;
			})
			.start()

		var o3 = {
			a: 0
		}
		var p3 = {
			a: 1
		}		
		
		var a = new MGE.Tweener.Tween(o3)
			.to(p3, 1000)
			.onUpdate(function() {
				_self.skip.alpha = o3.a;
			})
			
		new MGE.Tweener.Tween(o2)
			.to(p2, 1000)
			.delay(400)
			.onUpdate(function() {
				_self.title3.alpha = o2.a;
			})
			.onComplete(function() {
				a.start();
			})
			.start()
	}
}