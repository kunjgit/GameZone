class Boat {
	constructor(img){
		this.pos = {
			x: ((w4+w4/2) + this.side * w4) - 20,
			y: h4-20,
		}
		this.passengers = [];
		this.w = Math.max(w,h) * 0.2;
		this.h = this.w<<1;
		this.side = 0;
		this.img = img;
	}
	
	show(){
		this.pos.x = ((this.side+1) * w4) + (w4/4) - (this.w/4);
		this.pos.y = (h - this.h)/2 + (this.h * 0.1);
		/*
		c.fillStyle = 'red';
		c.fillRect(this.pos.x, this.pos.y, this.w, this.h);
		*/
		c.drawImage(this.img,this.pos.x,this.pos.y,this.w,this.h);
	}
	
	addPassenger(p){
		if( this.passengers.length < 2 && this.passengers.indexOf(p) == -1){
			p.side += this.side == 0 ? 1 : -1 ;
			this.passengers.push( p );
			return true;
		}
		return false;
	}
	
	removePassanger(p){
		let index = this.passengers.indexOf(p);
		if(index >= 0){
			p.side += this.side == 0 ? -1 : 1;
			this.passengers.splice(index, 1);
		}
	}
	
	action(){
		if( this.passengers.length > 0 ){
			let p = false;
			for(let i = 0; i < this.passengers.length; i++){
				if( this.passengers[i].pilot ){
					p = true;
					break;
				}
			}
			if(p){
				this.side = ( this.side + 1 ) % 2;
				for(let i = 0; i < this.passengers.length; i++){
					this.passengers[i].side = this.side+1;
				}
			}
		}
	}
	
}