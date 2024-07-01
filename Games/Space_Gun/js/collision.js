function distance (e1,e2) {
	return Math.sqrt((e1.x-e2.x)*(e1.x-e2.x)+(e1.y-e2.y)*(e1.y-e2.y));
}

class Circle {
	constructor(x,y,r,color){
		this.x=x;
		this.y=y;
		this.r=r;
		this.color=color;
	}
	draw(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 30;
		ctx.beginPath();

		ctx.arc(this.x,this.y,this.r,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
}
class Triangle{
	constructor(x,y,d,r,color){
		this.x=x;
		this.y=y;
		this.d=d;
		this.r=r;
		this.color=color;
		this.random_direction = Math.random()*2*Math.PI;
	}
	draw(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.d);
		ctx.moveTo(0,-2*this.r);
		ctx.rotate(Math.PI*2/3);
		ctx.lineTo(0,-2*this.r);
		ctx.rotate(Math.PI*2/3);
		ctx.lineTo(0,-2*this.r);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}
_COLLISION_DT=0.01;
class Collision {
	constructor(x,y){
		this.x=x;
		this.y=y;
		this.arr = this.createCollisionFigures();
		this.t = 0;
		this.flag = 0;
	}
	draw() {
		for (var i=0;i<this.arr.length;i++){
			this.arr[i].draw();
		}
	}

	pickColor(){
		var i = Math.floor(Math.random()*4);
		var op = (Math.random()+0.4)/1;
		var plate = ["rgba(58,31,91","rgba(200,54,93","rgba(225,82,73","rgba(246,211,101"];
		plate.forEach((el,index,plate)=>plate[index]=el+","+op+")");
		return plate[i];
	}
	
	createCollisionFigures(){
		var result = [];
		var i = Math.floor(Math.random()*40);
		for (var j=0;j<i;j++){
			var k = Math.floor(Math.random()*2);
			var r = Math.random()*5;
			var d = Math.random()*Math.PI*2;
			var ddx = Math.random()*8-4;
			var ddy = Math.random()*8-4;
			if (k==0) result.push(new Circle(this.x+ddx*4,this.y+ddy*4,r*0.2,this.pickColor()));
			else result.push(new Triangle(this.x+ddx,this.y+ddy,d,r,this.pickColor()));
		}
		return result;
	}
	update(){
		v = _spaceship.speed;
		dx = v * Math.cos(d*Math.PI);
		dy = v * Math.sin(d*Math.PI);
		this.x -= dx;
		this.y -= dy;
		var arr= this.arr;
		for(var i=0;i<this.arr.length;i++){
			arr[i].x -=dx;
			arr[i].y -=dy;
			if (arr[i] instanceof Triangle){
				arr[i].d+=0.2;
				arr[i].x+= Math.cos(arr[i].random_direction) * 0.33;
				arr[i].y+= Math.sin(arr[i].random_direction) * 0.33;
			}
			else {
				var r1 = Math.random()/100;
				arr[i].r*=1.02+r1;
			}
		}
		this.t += _COLLISION_DT;

		if(this.t>1) {
			this.flag = 1;
		}
	}
}
