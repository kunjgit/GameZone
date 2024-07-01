shot_sx=W/2; 
shot_sy=H/2;
shot_rx = 20;
shot_ry = 2;
shot_dt = 0.02;
function Trapezoid (x,y,bottom_w,top_w,h){
	ctx.save();
	ctx.beginPath();
	ctx.translate(x,y);
	ctx.moveTo(-top_w/2,-h/2);
	ctx.lineTo(top_w/2,-h/2);
	ctx.lineTo(bottom_w/2,h/2);
	ctx.lineTo(-bottom_w/2,h/2);
	ctx.closePath();
}
var strokeTrapezoid = function(x,y,bottom_w,top_w,h){
	Trapezoid(x,y,bottom_w,top_w,h);
	ctx.stroke();
	ctx.restore();
};
var fillTrapezoid = function (x,y,bottom_w,top_w,h){
	Trapezoid(x,y,bottom_w,top_w,h);
	ctx.fill();
	ctx.restore();
};
class ShotI{
	constructor(ex,ey,d){
		this.sx = shot_sx;
		this.sy = shot_sy;
		this.ex =ex;
		this.ey =ey;
		this.x =shot_sx;
		this.y =shot_sy;
		this.t =0.01;
		this.d = d;
		this.flag = 0;

		play([[0,5],[0,4],[0,3],[0,2],[0,1]],1000,.03,.1,.001,.2,.01,'sine');
	}

	draw(){
		ctx.save();
		var c = "#28FFBF";
		ctx.shadowColor = c;
		ctx.shadowBlur = 100;
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.translate(0,0);
		ctx.beginPath();
		ctx.ellipse(this.x,this.y,shot_rx,shot_ry,this.d*Math.PI,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	static drawHood() {
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";
		ctx.lineWidth = 0.5;
		var tmp = _spaceship.shotI_bank;
		var p,l;
		for (var i=1;i>-2;i--){
			if (i%2==0) {
				p=15;l=9;
			}
			else {
				p=9;l=15;
			}
			if (tmp>0) {
				strokeTrapezoid(W/2+i*17,H/2+25,p,l,3);
				fillTrapezoid(W/2+i*17,H/2+25,p,l,3);
				tmp -= 1;
			}
			else {
				strokeTrapezoid(W/2+i*17,H/2+25,p,l,3);
			}
		}
		ctx.restore();
	}

	update(){
		
		v = _spaceship.speed+4;
		dx = v * Math.cos(this.d*Math.PI);
		dy = v * Math.sin(this.d*Math.PI);

		this.sx -= dx;
		this.ex -= dx;
		this.sy -= dy;
		this.ey -= dy;
		
		this.t+= shot_dt;
		var new_pt = linear_A_to_B(this.sx,this.sy,this.ex,this.ey,this.t);
		this.x = new_pt[0];
		this.y = new_pt[1];
		
		if(this.t>1) this.flag=1;
	}
}

class ShotII{
	constructor(ex,ey,d){
		this.sx = shot_sx;
		this.sy = shot_sy;
		this.ex =ex;
		this.ey =ey;
		this.MaxLen = Math.sqrt(Math.pow(this.ex-W/2,2)+Math.pow(this.ey-H/2,2)); 
		this.x =shot_sx;
		this.y =shot_sy;
		this.t =0;
		this.d = d;
		this.flag = 0;
		zzfx(...[zzfxV,,152,.01,.01,0,4,.24,24,,826,.01,,,-27,,.49,.5,.02]); // Blip 213
		}
	draw(){
		ctx.save();
		var c = "#FAFF00";
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.shadowColor = "white";
		ctx.beginPath();
		ctx.translate(W/2,H/2);
		ctx.rotate(this.d*Math.PI);
		ctx.moveTo(0,0);
		var len = this.t * this.MaxLen;
		var fractions = Math.floor(Math.random()*6)+4;
		var width = Math.random()*20+0.5;
		for (var i=0;i<=fractions-1;i++){
			var curr_x = (i/fractions)*len;
			var next_x = ((i+1)/fractions)*len;
			
			var blur = Math.random()*20;

			var rand_x = Math.random()*(next_x-curr_x) +curr_x;
			var rand_y = (Math.random()-0.5)*(next_x-curr_x);
			ctx.lineWidth = (width*(fractions-i))/fractions;
			ctx.shadowBlur = blur;
			ctx.lineTo(rand_x,rand_y);
			ctx.moveTo(rand_x,rand_y);
			ctx.lineTo(next_x,0);
			ctx.moveTo(next_x,0);
		}

		ctx.lineTo(len,0);
		ctx.closePath();
		ctx.stroke();
		ctx.shadowColor = "white";
		ctx.shadowBlur = 25;
		ctx.restore();
	}

	update(){
		v = _spaceship.speed*2;
		dx = v * Math.cos(this.d*Math.PI);
		dy = v * Math.sin(this.d*Math.PI);

		this.sx -= dx;
		this.ex -= dx;
		this.sy -= dy;
		this.ey -= dy;
		
		this.t+= shot_dt*10;
		var new_pt = linear_A_to_B(this.sx,this.sy,this.ex,this.ey,this.t);
		
		this.x = new_pt[0];
		this.y = new_pt[1];
		
		if(this.t>1) this.flag=1;
	}
	static drawHood() {
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";
		ctx.lineWidth = 0.5;

		var tmp = _spaceship.shotII_range;
		var max = _spaceship.shotII_max_range;
		strokeTrapezoid(W/2,H/2+25,20,20,3);
		fillTrapezoid(W/2,H/2+25,20*(tmp/max),20*(tmp/max),3);

		ctx.restore();
	}
}
















