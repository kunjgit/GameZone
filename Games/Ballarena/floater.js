function Floater(x, y, time, item)
{
	this.posX=x;
	this.posY=y;
	// floater motion is based on 
	//  - radial outward motion, usually at constant speed
	//  - angular motion, with a constant angular speed (can be zero), plus a sinewave motion
	this.speedR=0.01; // radial speed
	this.constantPhi=0; // angular speed (radian / frame)
	this.phiAmplitude=0; // amplitude (radian) for sinewave motion
	this.phiFrequency=.2; // frequency (radian / frame) for sinewave motion
	this.radius=.08;
	this.t0=time;
	this.item=item;
	this.hit=false;
}

Floater.prototype = {

	/**
	 * Move the floater on its own path
	 * Returns the distance to origin (to detect lost floaters)
	 */
	move : function(time) {
		var r = Math.sqrt(this.posX*this.posX+this.posY*this.posY);
		var phi = Math.atan2(this.posY, this.posX);
		r+=this.speedR;
		phi += this.constantPhi+this.phiAmplitude*Math.cos(this.phiFrequency*(time-this.t0));
		this.posX=r*Math.cos(phi);
		this.posY=r*Math.sin(phi);
		return r;
	}
}
