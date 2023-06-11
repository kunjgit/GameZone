function Block(opts) {
	this.state = 0;
	this.angle = 0;
	this.initTime = settings.initTime;
	this.counter = 0;
	this.parent = false;
	this.endTime = 15;
	this.peer = false;
	this.iter = 5;
	this.shouldShake = 1;
	this.color = '#f1c40f';
	this.shouldDeleteSelf = false;
	this.angularWidth = Math.PI/5;
	this.distFromCenter = settings.baseDistFromCenter;
	for (var i in opts) {
		this[i] = opts[i];
	}

	this.draw = function() {
		var op;
		switch (this.state) {
			case 0:
				drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle - this.angularWidth/2) + (this.angularWidth) * (this.counter/this.initTime), (this.angle - this.angularWidth/2), this.blockHeight, this.distFromCenter + gdr, this.color);
				op = (1 - (this.counter)/this.initTime);
				if (op > 0) {
					drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle - this.angularWidth/2) + (this.angularWidth) * (this.counter/this.initTime), (this.angle - this.angularWidth/2), this.blockHeight, this.distFromCenter + gdr, '#FFFFFF', op);
				}
				break;

			case 1:
				drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, this.angle + this.angularWidth/2, this.angle - this.angularWidth/2, this.blockHeight, this.distFromCenter + gdr, this.color);
				break;

			case 2:
			case 4:
				op = 1 - ((this.counter)/this.endTime);
				if (op > 0 && op <= 1) {
					drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, this.angle + this.angularWidth/2, this.angle - this.angularWidth/2, this.blockHeight, this.distFromCenter + gdr, '#FFFFFF', op);
				}
				break;
		}
	};

	this.update = function(dt) {
		if (this.shouldDeleteSelf !== false) {
			if (this.distFromCenter <= this.shouldDeleteSelf) {
				this.state = 4;
			}
		}

		switch (this.state) {
			case 0:
				this.counter += dt;
				if (this.counter >= this.initTime) {
					this.state = 1;
					this.counter = 0;
					if (this.peer) {
						this.distFromCenter = this.peer.distFromCenter + this.blockHeight;
						this.peer = false;
					}
				}
				break;

			case 1:
				this.distFromCenter -= this.iter * dt;
				if (this.distFromCenter <= settings.startRadius) {
					this.distFromCenter = settings.baseRadius;
					if (this.shouldShake) shakes.push({a:this.angle, m:settings.shakeMagnitude});
					this.state = 2;
				}
				break;

			case 2:
				this.distFromCenter = settings.baseRadius;
				this.counter += dt;
				if (this.counter > this.endTime) {
					this.state = 3;
				}
				break;

			case 4:
				this.distFromCenter -= this.iter * dt;
				this.counter += dt;
				if (this.counter > this.endTime) {
					this.state = 3;
				}

				if (this.distFromCenter <= settings.startRadius) {
					this.state = 2;
				}
				break;
		}
	};
}

Block.prototype.blockHeight = 25;