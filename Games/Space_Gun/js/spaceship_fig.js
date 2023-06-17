
function triangle (x,y,r,d){
	ctx.save();
	ctx.beginPath();
	ctx.rotate(d * Math.PI);
	ctx.moveTo(x,y-2*r);

	ctx.rotate(Math.PI/1.5);
	ctx.lineTo(0,0-r);
	ctx.lineTo(0,0);
	ctx.closePath();
	ctx.fillStyle = "#595260";
	ctx.fill();
	ctx.beginPath();
	ctx.rotate(-Math.PI/1.5);
	ctx.moveTo(x,y-2*r);
	ctx.rotate(-Math.PI/1.5);
	ctx.lineTo(0,0-r);
	ctx.lineTo(0,0);
	ctx.closePath();
	
	ctx.closePath();
	ctx.fillStyle= "#B2B1B9";
	ctx.fill();
	ctx.restore();
}

function spaceship_fig_draw(x,y,r,d){
    ctx.beginPath();

    ctx.translate(x,y);
    ctx.rotate(Math.PI / 2);

    triangle(0,0,r*_zoom,d);

    ctx.rotate(d*Math.PI);
    ctx.moveTo(0,r*2/3);
    ctx.lineTo(0,r*2/3+10);
}



class Engine_Circle{
	constructor(x,y,r){
		this.x = x;
		this.y = y;
		this.r = r ;
		this.dx = 0;
		this.dy = 0;

		this.color = this.pick_color();
	}
	draw(d){

		ctx.save();
		var c = this.color;
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.beginPath();

		ctx.arc(this.x,this.y,this.r,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	pick_color(){
		const plate = ["#FAAD80","#FF6767","#FF3D68","#A73489"];
		var i = Math.floor(Math.random()*4);
		return plate[i];
	}
	update(d){
		v = _spaceship.speed;
		var t0,t1,t2;
			t0 = Math.random()/3 + 1/3;
			t1 = Math.cos(t0 * Math.PI) * 100/v;
			t2 = Math.sin(t0 * Math.PI) * 100/v;
			this.dx = t1;
			this.dy = t2;

		this.x += this.dx /2;
		this.y += this.dy /2;
	}
}
class Engine{
	constructor(){
		this.arr = [];
	}
	add(x,y){
		r = _zoom*Spaceship_Size/1.5*Math.random();
		var c = new Engine_Circle(x,y,r);
		this.arr.push(c);
	}
	draw(d, a,b){
		v = _spaceship.speed;
		var sx,sy;
		sx = sy = 1;
		
		for (var i=0;i<this.arr.length;i++){
			this.arr[i].update(d);
			this.arr[i].draw(d);
			if (this.arr.length>v*0.5) this.arr.shift();
		}
	}
}
