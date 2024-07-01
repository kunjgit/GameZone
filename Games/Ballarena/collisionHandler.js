function CollisionHandler(level)
{
	this.level = level;
}

CollisionHandler.prototype = {

	/**
	 * Handles balls colliding with bricks
	 *  => bricks taking hits and destruction thereof
	 *
	 */
	testBrickHits : function() {
		var test=false;
		for (var a=0; a<this.level.ballsInPlay; ++a) {
			for (var b=0; b<this.level.bricks.length; ++b) {
				if (this.level.bricks[b].alive) {
					var dx = this.level.bricks[b].posX-this.level.balls[a].posX;
					var dy = this.level.bricks[b].posY-this.level.balls[a].posY;
					var radius = this.level.balls[a].radius+this.level.bricks[b].radius;
					var dd = Math.sqrt(dx*dx+dy*dy);
					if (dd<radius) { // ball hit a brick
						test=true;
						this.level.hitBrick(b);
						
						// bounce ball off brick
						var hitAngle = Math.atan2(dy,dx);
						this.level.balls[a].heading = 2*hitAngle - Math.PI - this.level.balls[a].heading;
					}
				}
			}
		}
		return test;
	},
	
	/**
	 * Handles balls colliding with pads
	 *  => balls bounce off pad or remain stuck (depend on current conditions)
	 *
	 * return true if hit or stuck
	 */
	testPadHits : function() {
		var test=false;
		for (var a=0; a<this.level.ballsInPlay; ++a) {
			if (this.level.balls[a].stuckOnPad<0) {
				var padAngle = 0;
				for (var b=0; b<this.level.padCount; ++b) {
					padAngle += this.level.padAngle[b];
					var relativeAngle = padAngle-this.level.balls[a].heading;
					if (Math.cos(relativeAngle)>=0) {
						// do not test for collision if the ball is headed away from the pad
						var cb = Math.cos(padAngle);
						var sb = Math.sin(padAngle);
						var xa = cb*this.level.balls[a].posX+sb*this.level.balls[a].posY;
						if (Math.abs(xa-this.level.padRadius)<this.level.balls[a].radius) { // ball crossing pad line
							var ya = -sb*this.level.balls[a].posX+cb*this.level.balls[a].posY;
							if (Math.abs(ya)<this.level.padWidth) { // ball touches pad
								test=true;
								if (this.level.environmentItem==20) { // ball remains stuck if "sticky pad" item in action
									this.level.balls[a].stuckOnPad = b;
									this.level.balls[a].offsetOnPad = ya;
								} else { // ball bounces
									var hitAngle = padAngle+Math.PI;
									this.level.balls[a].heading = 2*hitAngle - Math.PI - this.level.balls[a].heading;
								}
							}
						}
					}
				}
			}
		}
		return test;
	},
	
	/**
	 * Handles floaters colliding with pads
	 *  => bonus / malus taken, change game condition
	 *
	 * return true if at least one floater hit
	 */
	testFloaterHits : function() {
		var padAngle = 0;
		var hits = [];
		for (var b=0; b<this.level.padCount; ++b) {
			padAngle += this.level.padAngle[b];
			var cb = Math.cos(padAngle);
			var sb = Math.sin(padAngle);
			for (var a=0; a<this.level.floaters.length; ++a) {
				var xa = cb*this.level.floaters[a].posX+sb*this.level.floaters[a].posY;
				if (Math.abs(xa-this.level.padRadius-.5*this.level.padThickness)<(this.level.floaters[a].radius+.5*this.level.padThickness)) { // floater crossing pad line
					var ya = -sb*this.level.floaters[a].posX+cb*this.level.floaters[a].posY;
					if (Math.abs(ya)<this.level.padWidth) { // floater touches pad => taken
						hits.push([this.level.floaters[a].item, b]);
						this.level.floaters[a].hit=true;
					}
				}
			}
		}
		
		// collect items at the end, as some may destroy pads and we might have confused
		// the pad iteration loop had we done it inside
		for (var i=0; i<hits.length; ++i) {
			this.level.itemActivated(hits[i][0], hits[i][1]);
		}
		return hits.length>0;
	}
}
