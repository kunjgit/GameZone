function Brick(x, y, color)
{
	this.hitPoints=1;
	this.relativeTime=0;
	this.posX=x;
	this.posY=y;
	this.radius=.08;
	this.alive=true;
	this.timeBlown=0;
	this.path=null;
	this.color=color;
	this.value=this.hitPoints;
}


Brick.prototype = {

	moveTo : function(newX, newY) {
		this.posX = newX;
		this.posY = newY;
	},

	/**
	 * Give the brick one hit (damage), return true if destroyed
	 */
	receiveHit : function(timeStamp) {
		if (!--this.hitPoints) {
			this.explode(timeStamp);
		} else {
			++this.color;
		}
		return !this.hitPoints;
	},

	explode : function(timeStamp) {
		this.alive=false;
		this.timeBlown=timeStamp;
	}
}
