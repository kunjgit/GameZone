function Bonus(x, y){

	this.x = x;
	this.y = y;
	this.size = 15;

	objects.push(this);
}
Bonus.prototype.render = function() {

	c.save();

	c.strokeStyle = "red";//"FF5B03";
	c.shadowColor="rgba(0,0,0,0.5)";
	c.shadowBlur=7;
	c.shadowOffsetX = -2;
	c.shadowOffsetY = 2;
	c.beginPath();
	c.arc(this.x, this.y, this.size, 0,2*Math.PI);
	c.stroke();

	c.restore();
}
Bonus.prototype.tick = function() {

	if(this.x > canvas.width+this.size) {
		this.x = -this.size;
		this.y = Math.random()*canvas.height+1;
	}
	else
		this.x+= 0.1;

	this.render();
}
Bonus.prototype.disappear = function() {

	objects.splice(objects.indexOf(this), 1); //remove it from objects list

	new Bonus(canvas.width+100, Math.random()*canvas.height+1); //create a new bonus on the screen
}