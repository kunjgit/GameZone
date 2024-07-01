class Star {
	constructor(x ,y, r, n, inset, ninth){
		this.x=x;
		this.y=y;
		this.r=r *_zoom;
		this.n=n;
		this.inset=inset;

		this.NINTH = ninth;
	}
	draw (){
		ctx.save();
		ctx.fillStyle = "white";
		ctx.shadowColor = "white";
		ctx.shadowBlur = 5;
		ctx.beginPath();
		ctx.translate(this.x,this.y);
		ctx.moveTo(0,0-this.r);
		for (var i=0;i<this.n;i++){
			ctx.rotate(Math.PI / this.n);
			ctx.lineTo(0,0-(this.r*this.inset));
			ctx.rotate(Math.PI / this.n);
			ctx.lineTo(0,0 -this.r);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore()
	}
	update (d){
		v = _spaceship.speed;
		
		dx = v * Math.cos(d*Math.PI);
		dy = v * Math.sin(d*Math.PI);
		
		this.x -= dx;
		this.y -= dy;
		
		var N = calcNINTH (this.x,this.y);
		if (this.NINTH[0] != N[0] && this.NINTH[1] != N[1]){
			if (this.NINTH[0] == 0 && this.NINTH[1] == 0) {
				var a = Math.floor(Math.random()*3)-1;
				var b = Math.floor(Math.random()*3)-1;
				this.NINTH[0] = a;
				this.NINTH[1] = b;
			}
			this.x = (Math.random()+-1*this.NINTH[0])*W; 
			this.y = (Math.random()+-1*this.NINTH[1])*H;
		}
	}
}
function calcNINTH (x,y){
	//NINTHES are indexed as [-1,0,1]*[-1,0,1] indexes mat
	if (-W<=x && x<0) {
		if (-H<=y && y<0) return [-1,-1];
		if (0<=y && y<H) return [-1,0];
		if (H<=y && y<2*H) return [-1,1];
	}
	else if(0<=x && x<W) {
		if (-H<=y && y<0) return [0,-1];
		if (0<=y && y<H) return [0,0];
		if (H<=y && y<2*H) return [0,1];
	}
	else if(W<=x && x<2*W) {
		if (-H<=y && y<0) return [1,-1];
		if (0<=y && y<H) return [1,0];
		if (H<=y && y< 2*H) return [1,1];
	}
	return [-9,-9];
}

function stars(t){
	arr = [];
	for (var i=0;i<t;i++){
		x = Math.random() * 3 * W - W;
		y = Math.random() * 3 * H - H;
		r = Math.random() * 7;
		n = 5;
		inset = 0.5;
		var ninth = calcNINTH(x,y);
		arr.push(new Star(x,y,r,n,inset, ninth));
	}
	return arr;
}