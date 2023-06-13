var player = {
	x: 0,
	y: 0,
	width: 30,
	speed: 2,

	init: function() {
		this.x = (HOUSE_ROWS * SQUARE_WIDTH)/2 + SQUARE_WIDTH/2;
		this.y = (HOUSE_COLS * SQUARE_WIDTH)/2 + SQUARE_WIDTH/2;
	},
	
	draw: function() {
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width/2, 2 * Math.PI, false);
		if (DEBUG) {
			ctx.fillStyle = "#0000FF";
		} else {
			ctx.fillStyle = "#FFFFFF";
		}
		ctx.fill();
		
		
		playerSight.draw();
	},
	
	//TODO: make speed constant with time
	update: function() {	
		//Check only holding 1 button, otherwise dont do anything
		var numberDown = rightDown + leftDown + upDown + downDown;
		
		if (rightDown) {
			this.x = this.x + this.speed;
			var point_1 = translateToSquare(this.x + this.width/2, this.y - this.width/2);
			var point_2 = translateToSquare(this.x + this.width/2, this.y + this.width/2);

			if (HOUSE_LAYOUT[point_1.x][point_1.y] <= 0 ||
				HOUSE_LAYOUT[point_2.x][point_2.y] <= 0) {
				this.x = this.x - this.speed;
				//Shove player around corners
				if (numberDown == 1) {
					if (HOUSE_LAYOUT[point_1.x][point_1.y] > 0) {
						this.y = this.y - this.speed;
					} else if (HOUSE_LAYOUT[point_2.x][point_2.y] > 0) {
						this.y = this.y + this.speed;
					}
				}
			}
		}
		if (leftDown) {
			this.x = this.x - this.speed;
			
			var point_1 = translateToSquare(this.x - this.width/2, this.y - this.width/2);
			var point_2 = translateToSquare(this.x - this.width/2, this.y + this.width/2);

			if (HOUSE_LAYOUT[point_1.x][point_1.y] <= 0 ||
				HOUSE_LAYOUT[point_2.x][point_2.y] <= 0) {
				this.x = this.x + this.speed;
				//Shove player around corners
				if (numberDown == 1) {
					if (HOUSE_LAYOUT[point_1.x][point_1.y] > 0) {
						this.y = this.y - this.speed;
					} else if (HOUSE_LAYOUT[point_2.x][point_2.y] > 0) {
						this.y = this.y + this.speed;
					}
				}
			}
		}
		if (upDown) {
			this.y = this.y - this.speed;
						
			var point_1 = translateToSquare(this.x - this.width/2, this.y - this.width/2);
			var point_2 = translateToSquare(this.x + this.width/2, this.y - this.width/2);

			if (HOUSE_LAYOUT[point_1.x][point_1.y] <= 0 ||
				HOUSE_LAYOUT[point_2.x][point_2.y] <= 0) {
				this.y = this.y + this.speed;
				//Shove player around corners
				if (numberDown == 1) {
					if (HOUSE_LAYOUT[point_1.x][point_1.y] > 0) {
						this.x = this.x - this.speed;
					} else if (HOUSE_LAYOUT[point_2.x][point_2.y] > 0) {
						this.x = this.x + this.speed;
					}
				}
			}
		}
		if (downDown) {
			this.y = this.y + this.speed;
									
			var point_1 = translateToSquare(this.x - this.width/2, this.y + this.width/2);
			var point_2 = translateToSquare(this.x + this.width/2, this.y + this.width/2);

			if (HOUSE_LAYOUT[point_1.x][point_1.y] <= 0 ||
				HOUSE_LAYOUT[point_2.x][point_2.y] <= 0) {
				this.y = this.y - this.speed;
				//Shove player around corners
				if (numberDown == 1) {
					if (HOUSE_LAYOUT[point_1.x][point_1.y] > 0) {
						this.x = this.x - this.speed;
					} else if (HOUSE_LAYOUT[point_2.x][point_2.y] > 0) {
						this.x = this.x + this.speed;
					}
				}
			}
		}
		
		playerSight.update();
	}
};

var playerSight = {
	arc_length : 180,
	arc_angle : 35,
	update: function() {
		var lookStart = MathHelper.getAngleTo(WIDTH/2, HEIGHT/2, MOUSEX, MOUSEY) - this.arc_angle/2;
		var lookEnd = MathHelper.getAngleTo(WIDTH/2, HEIGHT/2, MOUSEX, MOUSEY) + this.arc_angle/2;
		if (lookStart - 10 < beast.getAngle() &&
			lookEnd + 10 > beast.getAngle()) {
			beast.newPosition();
		}
	},
	draw: function() {
		
		var startX = player.x;
		var startY = player.y;
		
		var rotateTo = MathHelper.getAngleTo(WIDTH/2, HEIGHT/2, MOUSEX, MOUSEY) - this.arc_angle/2;
		
		ctx.save();	
		ctx.translate(startX, startY);
		
		ctx.rotate(rotateTo * Math.PI/180);
		
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0 + this.arc_length, 0);
		ctx.arc(0, 0, this.arc_length, 0, Math.PI/180 * this.arc_angle, false);
		ctx.closePath();
		
		if (DEBUG) {
			ctx.fillStyle = "#00FF00";
		} else {
			var fading_gradient = ctx.createRadialGradient(0,0,this.arc_length,0,0,0);
			fading_gradient.addColorStop(0, 'rgba(255,255,255,0)');
			fading_gradient.addColorStop(0.5, 'rgba(255,255,255,.9)');
			fading_gradient.addColorStop(1, 'rgba(255,255,255,1)');
			ctx.fillStyle = fading_gradient;
		}
		ctx.fill();
		
		ctx.rotate(-rotateTo * Math.PI/180);

		ctx.translate(-startX, -startY);
		ctx.restore();
	}
};