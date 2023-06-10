/**
 * Main menu scene
 * @param {BB_App} app
 * @constructor
 */
function BB_Main(app) {
	var sprite = app.sprite,
		drawer = app.drawer;
	this.app = app;
	this.ball = new BB_Ball(sprite, 120, 90);
	this.coin = new BB_Coin(sprite, 130, 135);
	this.sound = new BB_Button(sprite, 140, 245, 100, 32, 360, 100);
	this.sound.disabled = app.sound.disabled;
	this.start = new BB_Button(sprite, 240, 245, 100, 32, 160, 100);
	this.border = 20;
	this.repaint = true;
	drawer.wood(0, 0, this.w, this.h, 10);
	drawer.wood(0, 0, this.w, this.border, 2, 2);
	drawer.wood(0, this.border, this.border, this.h, 2, 2);
	drawer.wood(this.w-this.border, this.border, this.border, this.h, 2, 2);
	drawer.wood(0, this.h-this.border, this.w, this.border, 2, 2);
	drawer.info();
}

/**
 * Extends CP_Item
 */
BB_Main.prototype = new CP_Item(480, 320);

/**
 * Draw scene
 * @param {Object} ctx
 */
BB_Main.prototype.paint = function(ctx) {
	if (this.repaint) {
		this.clear(ctx);
		this.coin.paint(ctx);
		this.ball.paint(ctx);
		this.start.paint(ctx);
		this.sound.paint(ctx);
	}
};

/**
 * Check button status changes
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
BB_Main.prototype.check = function(x, y) {
	return this.sound.active ^ this.sound.check(x, y) |
		this.start.active ^ this.start.check(x, y) > 0;
};

/**
 * Scene event handler
 * @param {String} e
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} touch
 */
BB_Main.prototype.on = function(e, x, y, touch) {
	this.repaint = this.check(x, y) || this.repaint;
	switch (e) {
		case 'end':
			if (this.start.active) {
				this.app.sound.stop(4);
				this.app.start();
			} else if (this.sound.active) {
				this.sound.disabled = this.app.sound.disable();
				this.app.storage.setSound(!this.sound.disabled);
				if (!this.sound.disabled) {
					this.app.sound.play(4, .5 , true);
				}
			}
			break;
		case 'load':
			this.repaint = true;
			break;
		case 'music':
			this.app.sound.play(4, .5 , true);
			break;
	}
};
