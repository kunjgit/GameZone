var canvas = document.getElementById("_canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");


var _zoom = 0.6;

W = canvas.width;
H = canvas.height;

Spaceship_Size = 16 *_zoom;


Spaceship_NINTH = 5;
Spaceship_Acc_Factor = 4;

var r,d,v, dx, dy;
var _dx,_dy;

class Spaceship {
	constructor(r,d){
		this.r = r;
		this.d = d;
		this.x_speed;
		this.y_speed;
		this.engine = new Engine();
		this.x = W/2;
		this.y = H/2;
		this.acc = 0;
		this.pts = 0;
		if(document.monetization && document.monetization.state === 'started') {
			this.pts = 1499;
		}
		this.help_flag= 1;
		this.life_state = 0;
		this.fire_mode = 1;
		this.spread_amount = 0;
		this.shotI_bank = 3;
		this.shotI_capacity = 3;
		this.shotII_range = 200;
		this.shotII_max_range = 900;

		this.mobile_flag = 0;

		this.speed_mode = 0;
		this.speed = 3;
		this.speed_lower_limit = 3;
		
		this.life = 100;
		this.fuel = 100;
		this.fuel_capacty = 100;
		this.fuel_penalty = 0;

		this.upgrade_lvl = 0;
		this.upgrade_factor = 1500;

		this.update();
		
		}

	update(){
		this.x_speed = this.speed*Math.cos(this.d * Math.PI);	
		this.y_speed =  this.speed*Math.sin(this.d * Math.PI);
		this .fuel -= this.fuel_penalty;
		if (this.fuel <= 0) {
			this.speed_mode = 0;
			this.speed = this.speed_lower_limit;
			this.fuel_penalty = 0;
			this.fuel = 0;
		}
	}

	reset(f){
		var nm = new Spaceship(15,0);
		Object.assign(this,nm);
		this.mobile_flag = f;
		m = meteors(_METEORS_NUM);
	}

	draw (){
		this.update();
		x = this.x;
		y = this.y;
		r = this.r;
		d = this.d;

		ctx.lineWidth = 2;
		ctx.save();

		spaceship_fig_draw(x,y,r,d);
		
		this.engine.add(0,r*2/3);
		this.engine.draw(this.d, this.x_speed,this.y_speed);

		ctx.restore();
		
		this.drawHood();
	}
	drawEngineFire(){
		
	}
	drawHood(){
		ctx.font = '15px monospace';
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		if (this.life<30) ctx.fillStyle = "red";
		ctx.fillText('Life:'+this.life,W-100,H-50);
		ctx.fillStyle = "white";
		if(this.fuel<30) ctx.fillStyle = "red";
		ctx.fillText('Fuel:'+this.fuel,W-100,H-30);
		ctx.fillStyle = "white";
		ctx.fillText('Accuracy:'+ this.acc+'%',W-130,30);
		ctx.fillText('Hit Bonus:'+this.acc*Spaceship_Acc_Factor,W-130,50);
		var pts = 'Level:'+(this.upgrade_lvl);
		ctx.fillText(pts,W/2-.5*pts.length*7.5,30);

		var req = (this.upgrade_lvl+1)*this.upgrade_factor;
		var ratio = this.pts / req;
		ctx.beginPath();
		ctx.moveTo(W/3,45);
		ctx.lineTo(Math.min(2*W/3,(1-ratio)*W/3 + ratio*2*W/3),45);
		ctx.stroke();
		ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
		ctx.moveTo(W/3,45);
		ctx.lineTo(2*W/3,45);
		ctx.stroke();
		ctx.closePath();

		if (this.life_state == 1) {
			ctx.font = '40px monospace';
			ctx.strokeStyle = 'red';
			ctx.strokeText("Game Over",W/2 - 4.5*20,H/2);
			ctx.font = '20px monospace';
			ctx.fillText("Shoot to restart",W/2 -8*10,H/2+40);
		}
		var text = "Hello Subscriber! Best Wishes, and Free Upgrade!";

		if(document.monetization && document.monetization.state === 'started'){
			ctx.fillText(text,W/2-.5*text.length*7.5,H-15);
		}
	}
}

