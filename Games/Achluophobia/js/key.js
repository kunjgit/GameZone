function Key (x, y) {
	this.x = x;
	this.y = y;
	this.collected = false;

	this.draw = function() {
		if (this.collected) return;
		ctx.save();	
		ctx.translate(this.x, this.y);
		
		ctx.beginPath();
		
		ctx.arc(0, -6, 4, 2 * Math.PI, false);
		ctx.moveTo(0, -3);
		ctx.lineTo(0, 14);
		ctx.moveTo(0, 6);
		ctx.lineTo(7, 6);
		ctx.moveTo(0, 12);
		ctx.lineTo(7, 12);
		//ctx.closePath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#000000";
		ctx.stroke();

		ctx.translate(-this.x, -this.y);
		ctx.restore();
	};
	
	this.update = function() {
		if (this.collected) return;
		if (MathHelper.distance(player.x, player.y, this.x, this.y) < player.width/2) {
			//Score for palyer
			NUMBER_OF_KEYS_LEFT -= 1;
			key_count.textContent = NUMBER_OF_KEYS_LEFT;
			this.collected = true;
		}
	};
}

