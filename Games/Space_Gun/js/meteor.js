
const Meteor_plate = ["rgba(255, 36, 66,","rgba(255, 103, 231,","rgba(214, 42, 208,","rgba(224, 82, 151,"];
class Meteor {
	constructor(sx,sy,ex,ey,r, dt){
		this.sx = sx;
		this.sy = sy;
		this.ex = ex;
		this.ey = ey;
		this.dt = dt;
		this.d = Math.random()*2;

		this.x = sx;
		this.y = sy;
		this.r = r ;
		this.t = 0;

		this.colorI = Math.floor(Math.random()*4);
		this.color = this.pick_color(1,this.colorI);
		this.soundlst = randomCollisionSound(); 
	}
	draw(){

		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.d*Math.PI);

		ctx.beginPath();

		var c = this.color;
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.shadowColor = this.pick_color(1,2);
		ctx.shadowBlur=150;
		ctx.arc(0,0,this.r,0,2*Math.PI,true);
		ctx.fill();
		ctx.beginPath();

		ctx.fillStyle = "rgba(256,256,256,0.8)";
		ctx.arc(0,0+this.r*3/4,this.r/4,0,2*Math.PI,true);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
		ctx.save();
		ctx.beginPath();
		for (var i=9;i>6;i--){
			var prev = linear_A_to_B(this.sx,this.sy,this.ex,this.ey,this.t-this.t*(10-i)/80);
			var c1 = this.pick_color((10-i)/10,this.colorI); 
			ctx.fillStyle = c1;
			ctx.arc(prev[0],prev[1],this.r*i/10,0,2*Math.PI,true);
			ctx.fill();

		}

		

		ctx.closePath();

		ctx.restore();

	}
	pick_color(o,i){
		return Meteor_plate[i]+o+")";
	}
	update(d){
		var ninth = calcNINTH(this.x,this.y);
		var flag = ninth[0]==0&&ninth[1]==0?1:0;
		if (this.t>1.5 && !flag) {
			this.reset();
		}
		v = _spaceship.speed;

		dx = v * Math.cos(d*Math.PI);
		dy = v * Math.sin(d*Math.PI);

		this.sx -= dx;
		this.ex -= dx;
		this.sy -= dy;
		this.ey -= dy;
		
		this.t+= this.dt;
		var new_pt = linear_A_to_B(this.sx,this.sy,this.ex,this.ey,this.t);
		this.x = new_pt[0];
		this.y = new_pt[1];

		this.dt += 0.0000001;
		this.d += Math.random()/10;
	}
	reset(){
		var nm = createRandomMeteor();
		Object.assign(this,nm);

	}
}
function linear_A_to_B (x1,y1,x2,y2,t) {
	return [(1-t)*x1+t*x2,(1-t)*y1+t*y2];
}

function createRandomMeteor(){
	var _boxW = W;
	var _boxH = H;
	var ex = Math.random()*W;
	var ey = Math.random()*H;
	var w = Math.random()*3*W -W;
	var h = Math.random()*3*H -H;
	var flag = calcNINTH(h,w);
	while(flag[0]==0 && flag[1]==0){
		var w = Math.random()*3*W -W;
		var h = Math.random()*3*H -H;
		flag = calcNINTH(w,h);
	}
	var dt = Math.random()/550+1/150;
	return new Meteor(w,h,ex,ey,Math.random()*6+15,dt);
}
function meteors(num){
	arr = [];
	for (var i=0;i<num;i++){
		arr.push(createRandomMeteor());
	}
	return arr;
}
function randomCollisionSound(){
	var num_of_bits = 1+ Math.floor(Math.random()*2);
	var lst = [];
	for (var i=0;i<num_of_bits;i++){
		var start_bit = 1+Math.floor(Math.random()*3);
		for (var j=0;j<3;j++) {
			for (var k=0;k<3;k++) 
				lst.push([i,10*j+start_bit+k]);
		}
	}
	return lst;
}	
