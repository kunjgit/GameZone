var generateTexture=function(prop){
	var canvas=document.createElement("canvas");
	canvas.height=canvas.width=prop.size;
	var ctx=canvas.getContext("2d");
	var last=prop.seed;
	var rnd=function(){
		last++;
		last=((last*last*255)%128)/128;
		return last;
	};
	
	var imgData=ctx.createImageData(prop.size,prop.size);
	var len=prop.size*prop.size*4;
	for(var i=0;i<len;i+=4){
		var value=255*(rnd()+prop.minIntensity);
		imgData.data[i]=value*prop.r;
		imgData.data[i+1]=value*prop.g;
		imgData.data[i+2]=value*prop.b;
		imgData.data[i+3]=255;
	}
	ctx.putImageData(imgData,0,0);
	ctx.globalAlpha=prop.lineAlpha;
	for(var i=0;i<prop.lines;i++){
		ctx.beginPath();
		ctx.lineWidth=(rnd()+prop.minLine)*prop.lineWidth;
		var value=255*(rnd()+prop.minIntensity);
		ctx.strokeStyle="rgb("+value+","+value+","+value+")";
		var x1=rnd()*prop.size;
		var y1=rnd()*prop.size;
		var x2=x1+(rnd()-0.5)*prop.size*prop.xbias;
		var y2=y1+(rnd()-0.5)*prop.size*prop.ybias;
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}
	ctx.globalAlpha=prop.blurAlpha;
	
	var blur=function(outputSize){
		var offset=-(outputSize-prop.size)*0.5*rnd();
		ctx.drawImage(canvas,0,0,prop.size,prop.size,offset*prop.xbias,offset*prop.ybias,outputSize*prop.xbias,outputSize*prop.ybias);
	};
	for(var i=2;i<prop.blurLevels+2;i++){
		blur(i*prop.size);
	}
	
	return canvas;
};

var makeSeemless=function(canvas){
	var d,c,idx,idx2;
	var ctx=canvas.getContext("2d");
	var width=canvas.width;
	var height=canvas.height;
	var imageData=ctx.getImageData(0,0,width,height);
	var newImage=ctx.createImageData(width,height);
	var finalImage=ctx.createImageData(width,height);
	for(var i=0;i<2;i++){
		for(var x=0;x<width;x++){
			for(var y=0;y<height;y++){
				if(!i){
					d=Math.min(Math.abs(x-width),x);
					c=Math.sqrt(Math.min(1,d/width*2));
					idx2=(y*width+(x+width*0.5)%width)*4;
					dataDst=newImage.data;
					dataSrc=imageData.data;
				}else{
					d=Math.min(Math.abs(y-height),y);
					c=Math.sqrt(Math.min(1,d/height*2));
					idx2=(((y+height*0.5)%height)*width+x)*4;
					dataDst=finalImage.data;
					dataSrc=newImage.data;
				}
				idx=(y*width+x)*4
				dataDst[idx]=dataSrc[idx]*c+dataSrc[idx2]*(1-c);
				dataDst[idx+1]=dataSrc[idx+1]*c+dataSrc[idx2+1]*(1-c);
				dataDst[idx+2]=dataSrc[idx+2]*c+dataSrc[idx2+2]*(1-c);
				dataDst[idx+3]=255;
			}
		}
	}
	ctx.putImageData(finalImage,0,0);
	return canvas;
};

var branchTexture=function(leafColors){
	var canvas=document.createElement("canvas");
	canvas.height=512;
	canvas.width=512;
	var ctx=canvas.getContext("2d");
	var size=512;
	var maxLife=13;
	var branchWidth=0.3;

	var branchLength=size/maxLife;
	var leafLength=size/maxLife;
	var leafwidth=size/maxLife*0.8;
	//var leafColors=["rgba(0,36,0,1)","rgba(25,36,12,1)","rgba(36,36,0,1)"];

	var last= 0.9015853619202971;
	var rnd=function(){
		last++;
		last=((last*last*255)%128)/128;
		return last;
	};
		
	var drawBranch=function(life,position,direction){
		for(var i=life;i<maxLife;i++){
			var newDirection=[direction[0]+(rnd()-0.5)*1.5,direction[1]+(rnd()-0.5)*1.5];
			var m=Math.sqrt(newDirection[0]*newDirection[0]+newDirection[1]*newDirection[1]);
			newDirection[0]/=m;
			newDirection[1]/=m;
			
			if(rnd()>0.5 && i!=life){
				drawBranch(i,[position[0],position[1]],newDirection);
			}else if(i>maxLife*0.5){
				ctx.beginPath();
				ctx.fillStyle=leafColors[Math.floor(rnd()*leafColors.length)];
				var x=position[0]+newDirection[0]*leafLength;
				var y=position[1]+newDirection[1]*leafLength;
				var cp1x=position[0]+newDirection[0]*leafLength*0.5+newDirection[1]*leafwidth;
				var cp1y=position[1]+newDirection[1]*leafLength*0.5-newDirection[0]*leafwidth;
				var cp2x=position[0]+newDirection[0]*leafLength*0.5-newDirection[1]*leafwidth;
				var cp2y=position[1]+newDirection[1]*leafLength*0.5+newDirection[0]*leafwidth;
				ctx.moveTo(position[0],position[1]);
				ctx.quadraticCurveTo(cp1x, cp1y, x, y);
				ctx.quadraticCurveTo(cp2x, cp2y, x, y);
				ctx.closePath();
				ctx.fill();
			}
			ctx.beginPath();
			ctx.lineWidth=branchWidth*(maxLife-i);
			ctx.moveTo(position[0],position[1]);
			position[0]+=direction[0]*branchLength;
			position[1]+=direction[1]*branchLength;
			ctx.lineTo(position[0],position[1]);
			ctx.stroke();
		}
	};

	var position=[canvas.width/2,canvas.height];
	var direction=[0,-1];
	var life=1;
	drawBranch(life,position,direction);
	return canvas;
};

var fireTexture=function(){
	var canvas=document.createElement("canvas");
		canvas.height=canvas.width=256;
	var ctx=canvas.getContext("2d");
	var last= 0.3015853619202971;
	var rnd=function(){
		last++;
		last=((last*last*255)%128)/128;
		return last;
	};
	//draw some random lines
	for(var i=0;i<100;i++){
	ctx.beginPath();
	ctx.strokeStyle=rnd()>0.8 ? "#f02" : "#ff2";
	ctx.moveTo(rnd()*100+100,250-rnd()*200);
	ctx.lineTo(rnd()*100+100,250-rnd()*200);
	ctx.stroke();
	}
	ctx.globalAlpha=0.15;
	for(var i=0;i<20;i++){
		ctx.drawImage(canvas, 0, 0, 256, 256, -10+Math.cos(i)*5, -12,270,270);
	}
	return canvas;
};

var paper=function(){
	var paper={
		size: 512,
		xbias: 1,
		ybias: 1,
		r: 0.58,
		g: 0.58,
		b: 0.5,
		minIntensity: 0.2,
		lineAlpha: 0.5,
		blurAlpha: 0.5,
		minLine: 1,
		lineWidth: 5,
		lines: 100,
		blurLevels: 3,
		seed: 0.31093138875439763
	};
	return generateTexture(paper);
};
var overlay=function(){
	var c=paper();
	var canvas=document.createElement("canvas");
	canvas.width=canvas.height=512;
	var ctx=canvas.getContext("2d");
	ctx.drawImage(c,0,0);
	var data=ctx.getImageData(0,0,512,512);
	for(var x=0;x<512;x++){
		for(var y=0;y<512;y++){
			var idx=(y*512+x)*4;
			var dx=x-256;
			var dy=y-320;
			var d=Math.sqrt(dx*dx+dy*dy)/320;
			d=Math.pow(d,10)+0.02;
			data.data[idx+3]=Math.round(d*255);
			
		}
	}
	ctx.putImageData(data,0,0);
	return canvas;	
};