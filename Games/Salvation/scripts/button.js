/**
*	---------------------------------------------------
*	FE.Button
*	---------------------------------------------------
**/
FE.Button = function(text, font, width, height, colors) {
	this._w = width;
	this._h = height;

	this.colors = colors || ['#4f2f03', '#FFFFFF', '#DD6020'];
	this.view = MGE.createCanvas(this._w, this._h);

	for (var i = 0; i < 3; i++) {
		this.view.context.fillStyle = this.colors[i];
		this.view.context.fillRect(i * font.size, i * font.size, this._w - i * 2 * font.size, this._h - i * 2 * font.size);
	}
	
	MGE.Sprite.call(this, this.view.canvas.toDataURL("image/png"));

	MGE.removeCanvas(this.view.canvas);

	this.text = new MGE.BitmapText(text, font);
	this.setText(text);
	this.addChild(this.text);
};

FE.Button.prototype = Object.create(MGE.Sprite.prototype);
FE.Button.prototype.constructor = FE.Button;

/**
*	---------------------------------------------------
*	FE.Button._align
*	---------------------------------------------------
**/
FE.Button.prototype._align = function() {
	this.text.x = -this.text.textWidth / 2;
	this.text.y = ~~(-this.text.textHeight / 2);
}

/**
*	---------------------------------------------------
*	FE.Button.setText
*	---------------------------------------------------
**/
FE.Button.prototype.setText = function(t) {
	this.text.setText(t);
	this._align();
}