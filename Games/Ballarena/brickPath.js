
function CircularPath(radius, speed)
{
	this.radius = radius;
	this.speed = speed;
}

CircularPath.prototype = {

	positionAt : function(time) {
		return { x: this.radius*Math.cos(this.speed*time),
				 y: this.radius*Math.sin(this.speed*time)
			   }
	}
	
}

function DoubleCircularPath(radius, speed, radius2, speed2) {
	this.radius = radius;
	this.speed = speed;
	this.radius2 = radius2;
	this.speed2 = speed2;
}

DoubleCircularPath.prototype = {

	positionAt : function(time) {
		return { x: this.radius*Math.cos(this.speed*time)+this.radius2*Math.cos(this.speed2*time),
				 y: this.radius*Math.sin(this.speed*time)+this.radius2*Math.sin(this.speed2*time)
			   }
	}
	
}

function HarmonicPath(radius, speed, radius2, speed2) {
	this.radius = radius;
	this.speed = speed;
	this.radius2 = radius2;
	this.speed2 = speed2;
}

HarmonicPath.prototype = {

	positionAt : function(time) {
		return { x: (this.radius+this.radius2*Math.cos(this.speed2*time))*Math.cos(this.speed*time),
				 y: (this.radius+this.radius2*Math.cos(this.speed2*time))*Math.sin(this.speed*time)
			   }
	}
	
}

function OscillatingPath(deltaX, radiusX, offsetY, speed1, speed2, shift2) {
	this.deltaX = deltaX;
	this.radiusX = radiusX;
	this.offsetY = offsetY;
	this.speed1 = speed1;
	this.speed2 = speed2;
	this.shift2 = shift2;
}

OscillatingPath.prototype = {

	positionAt : function(time) {
		var angle = this.speed1*time;
		var x = this.deltaX+this.radiusX*Math.cos(this.speed2*time+this.shift2);
		return { x: x*Math.cos(angle)-this.offsetY*Math.sin(angle),
				 y: x*Math.sin(angle)+this.offsetY*Math.cos(angle)
			   }
	}
	
}

function FlowerPath(coefA, coefB, coefC, speed)
{
	this.coefA = coefA;
	this.coefB = coefB;
	this.coefC = coefC;
	this.speed = speed;
}

FlowerPath.prototype = {

	positionAt : function(time) {
		return { x: Math.cos(this.speed*time)/(this.coefA+this.coefB*Math.sin(this.speed*this.coefC*time)),
				 y: Math.sin(this.speed*time)/(this.coefA+this.coefB*Math.sin(this.speed*this.coefC*time))
			   }
	}	
}

function LissajousPath(radius, sx, sy)
{
	this.radius = radius;
	this.sx = sx;
	this.sy = sy;
}

LissajousPath.prototype = {

	positionAt : function(time) {
		return { x: this.radius*Math.cos(this.sx*time),
				 y: this.radius*Math.sin(this.sy*time)
			   }
	}	
}

function PulsatingPath(x, y, angleShift, speed, zoom, period, speed2,offset)
{
	this.speed=speed;
	this.speed2=speed2;
	this.angleShift = angleShift;
	this.x = x;
	this.y = y;
	this.zoom = zoom/2;
	this.period = period;
	this.offset = offset;
}

PulsatingPath.prototype = {

	positionAt : function(time) {
		var phi=this.speed*time+this.offset;
		var angle=this.speed2*time+this.angleShift*((Math.floor(phi/(this.period+1)))+((Math.floor(phi)&this.period)==this.period?.5*(1+Math.cos(phi*Math.PI)):0));
		var r=((Math.floor(phi)&this.period)==this.period?1+this.zoom*(1-Math.cos(2*phi*Math.PI)):1);
		return { x: r*(this.x*Math.cos(angle)+this.y*Math.sin(angle)),
				 y: r*(-this.x*Math.sin(angle)+this.y*Math.cos(angle))
			   }
	}	
}
