/**
 * @constructor
 */
function Renderer(canvas, container, game)
{
	this.context=canvas.getContext('2d');
	this.canvas=canvas;
	this.container=container;
	this.game=game;
	this.time=0;
}

Renderer.prototype = {

	initialize : function() {
		this.renderBuffer = document.createElement("canvas");
		this.renderBuffer.width=1024;
		this.renderBuffer.height=512;
		var bufferContext = this.renderBuffer.getContext('2d');
		
		bufferContext.fillStyle="green";
		bufferContext.fillRect(0,0,1024,512);
		bufferContext.strokeStyle="#666";
		bufferContext.lineWidth=60;
		bufferContext.beginPath();
		bufferContext.arc(256,256,192,Math.PI/2,Math.PI*1.5,0);
		//bufferContext.lineTo(
		bufferContext.arc(768,256,192,Math.PI*1.5,Math.PI/2,0);
		bufferContext.closePath();
		bufferContext.stroke();
		
		// debug
		this.container.appendChild(this.renderBuffer);
	},
	

	resize : function() {
		var size = Math.min(window.innerWidth, window.innerHeight);
		this.canvas.height=this.canvas.width=size;
		this.context.height=this.context.width=size;
		this.context.translate(size/2,size/2);
		this.context.scale(.4*size,-.4*size);
		this.canvas.style.left=Math.floor((window.innerWidth-size)/2)+"px";
		this.canvas.style.top=Math.floor((window.innerHeight-size)/2)+"px";
	},

	drawMain : function() {
		this.context.save();
		this.context.clearRect(0,0,this.context.width, this.context.height);
		this.resize();
		this.context.rotate(1.57-this.game.race.carAngle);
		
		var halfWidth=30+5*this.game.race.carSpeed;
		var halfHeight=30+5*this.game.race.carSpeed;
		var x=Math.min(1024-halfWidth, Math.max(this.game.race.carX, halfWidth));
		var y=Math.min(512-halfHeight, Math.max(this.game.race.carY, halfHeight));
		this.context.drawImage(this.renderBuffer, x-halfWidth, y-halfHeight, halfWidth*2, halfHeight*2, -1, -1, 2, 2);
		this.context.strokeStyle="blue";
		this.context.translate((this.game.race.carX-x)/halfWidth, (this.game.race.carY-y)/halfHeight);
		this.context.rotate(this.game.race.carAngle);
		this.context.lineWidth=.01;
		this.context.strokeRect(-.04, -.02, .08, .04);
		this.context.restore();
	
	},

	
	applySkidMarks : function(x,y,angle) {
		if (x>1 && y>1 && x<1022 && y<510) {
			var bufferContext = this.renderBuffer.getContext('2d');
			bufferContext.save();
			bufferContext.translate(x,y);
			bufferContext.rotate(angle);
			bufferContext.fillStyle="black";
			bufferContext.fillRect(-2,-1,2,1);
			bufferContext.fillRect(-2,1,2,1);
			bufferContext.restore();
		}
	}
	
	
}
