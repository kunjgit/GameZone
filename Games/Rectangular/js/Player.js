/*
	By Yhoyhoj : twitter.com/yhoyhoj
*/

function Player(x,y){

	this.startX = x;
	this.startY = y;
	this.x = x;
	this.y = y;
	this.up = -50;
	this.rotate = 0;
	this.parachute = 100;
	this.renderPara = false;
	this.renderer;
}
Player.prototype.render = function() {

	c.save();

	c.translate(this.x, this.y);
	if(this.rotate != 0)
	{
		c.rotate(Math.PI * this.rotate / 180);
		this.rotate = 0;
	}
	c.fillStyle = "red";
	c.shadowBlur=7;
	c.shadowOffsetX = -2;
	c.shadowOffsetY = 2;
	c.fillRect(0, 0, 10, 20);

	c.restore();

	if(this.renderPara)
		this.renderParachute();
}
Player.prototype.renderParachute = function() {

	c.save();

	if(this.parachute < 50 && this.parachute %5 == 0)
		c.strokeStyle = "white";
	else
		c.strokeStyle = "red";
	c.moveTo(this.x, this.y);
	c.lineTo(this.x-10, this.y-20);
	c.moveTo(this.x+10, this.y);
	c.lineTo(this.x+20, this.y-20);
	c.stroke();

	if(this.parachute < 50 && this.parachute %5 == 0)
		c.strokeStyle = "white";
	else
		c.strokeStyle = "red";
	c.beginPath();
	c.arc(this.x+5, this.y-20, 20, Math.PI, 2*Math.PI);
	c.lineTo(this.x-15, this.y-20);
	c.stroke();

	c.restore();
}
Player.prototype.tick = function() {

	var fall = true;
	var speed;

	this.renderPara = false;

	if(this.x > canvas.width-10 && !win){ //when behind the line/win
		win = true;

		var date =  new Date(new Date() - seconds);
		elapsedTime = ("0" + date.getMinutes()).slice(-2) + ":" + ("0"+date.getSeconds()).slice(-2);

		if(localStorage) {

			if(localStorage && (localStorage.getItem('rectangularBest') == null || localStorage.getItem('rectangularBest').slice(0,2) > date.getMinutes()) ) { //save the time iif no saveed before or if minutes are lower
				localStorage.setItem('rectangularBest', elapsedTime);
			}
			else if(localStorage && localStorage.getItem('rectangularBest').slice(-2) > date.getSeconds()) { //saving  the time if minute is not lower but seconds are lower
				localStorage.setItem('rectangularBest', elapsedTime);
			}
		}
	}

	if(this.x < -10) {			//if player is no more in the screen (only for the left), respawn
		this.x = this.startX;
		this.y = this.startY;
	}
	else if(this.y > canvas.height) //if player is under the screen, put it on the top
		this.y = -20;

	for(var i = 0; i < objects.length; i++) { //collision loop
		var p = objects[i];

//			Squares :

		if(p instanceof Square)	{

			if(this.x > p.x-10 && this.x < p.x + p.size){ //collision test

				if(this.y+20 < p.y+1 && this.y+20 > p.y-2){ //collision test

					if(this.renderer != p){		//player is rendered by the last square he stand on, to be rendered at the right pseudo z position

						if(this.renderer)
							this.renderer.player = false; //say to the old renderer to no more render player
						p.player = true;	//say to the new renderer to start render
						this.renderer = p; //save the last renderer/square to avoid useless change
					}
					speed = p.speed; //set player the movement of the square to make it move with the square
					fall = false; 
				}
			}

		}

//			Mines :

		else if(p instanceof Mine) {

			if(this.x > p.x-p.size-10 && this.x < p.x + p.size ){ //colision test

				if(this.y+20 < p.y+p.size && this.y > p.y-p.size){ //collision test
					this.x = this.startX;	//the player respawn
					this.y = this.startY;
					p.explo(); //make the collided mine explodes
				}
			}

		}
//			Bonus :

		else {

			if(this.x > p.x-p.size-10 && this.x < p.x + p.size ){

				if(this.y+20 < p.y+p.size && this.y > p.y-p.size){
					this.parachute += 100;
					p.disappear();
				}
			}

		}

	}

	if(up && !fall){ //when up key is down and player is not falling : jump
		this.up = 50; //add jump power to the player
	}

	if(!fall) { //normal movement

		if(right) //when right key is down
			this.x++;
		else if(left) //when left key is down
			this.x--;

		this.x -= speed; //add speed of mounted square
	}

	if(space && fall && this.parachute > 0) { //when space key is down and player have parachute power

		if(right){
			this.x+= 0.5;
			this.rotate = -5; //rotate player
			this.parachute--; //decrease parachute power
			this.renderPara = true; //render the parachute
			this.y -= 1.5; //slow the fall
		}
		else if(left) {
			this.x-= 0.5;
			this.rotate = 5;
			this.parachute--;
			this.renderPara = true;
			this.y -= 1.5;
		}
		else {
			this.parachute--;
			this.renderPara = true;
			this.y -= 1.5;
		}

	}
	
	if(this.up > 0) { //jump movement, when jump power is ok

		this.y-=this.up/8; //make the player jump

		if(right)
			this.x += 1.1;
		else if(left)
			this.x -= 1.1;

		this.up--;
	}
	else if(this.up > -50 && fall) { //after jump falling movement

		if(right)
			this.x += 0.8+this.up/80;
		else if(left)
			this.x -= 0.8+this.up/80;

		this.up--;

	}

	if(fall) {
		this.y+=3; //make the player fall
	}

	if(!this.renderer) //if player has no renderer (on the beginning)
		this.render(); //render itself
}