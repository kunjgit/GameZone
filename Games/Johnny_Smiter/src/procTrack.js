var ProcTrack;

(function(){
var last= 0.9015853619202971;
var rnd=function(){
	last++;
	last=((last*last*255)%128)/128;
	return last;
};
	
ProcTrack=function(options){
	for(i in options) this[i]=options[i];
	this.trackPoints=this.generateTrackPoints();
	this.interPoints=this.generateTrackInterPoints(this.numTrackInterPoints);
	this.randomData=this.generateRandomData();
	this.heightMap=this.generateHeightMap();
	this.terrainMesh=this.generateTerrainMesh();
	//this.trackMesh=this.generateRoadMesh();
};
ProcTrack.prototype.numTrackPoints=42;
ProcTrack.prototype.numTrackInterPoints=150;
ProcTrack.prototype.terrainSize=300;
ProcTrack.prototype.height=1;
ProcTrack.prototype.trackSize=220;
ProcTrack.prototype.trackDiv=0.75;
ProcTrack.prototype.trackWidth=2;
ProcTrack.prototype.trackFalloffDistance=15;
ProcTrack.prototype.trackHeightMin=3.5;
ProcTrack.prototype.trackHeightMax=4.5;

ProcTrack.prototype.generateTrackPoints=function(){
	var points=[];
	var NUM=this.numTrackPoints;
	var trackRange=this.trackHeightMax-this.trackHeightMin;
	var last=0;
	var rand=0;
	var lastd=0;
	for(var i=0; i<NUM;i++){
		if(i-last>2){
			if(rnd()>0.5){
				var rad=i/(NUM*0.5)*Math.PI;
				var d=rnd()*this.trackSize/2*this.trackDiv+this.trackSize/2*(1-this.trackDiv);
				//if(d>lastd) rad+=(rnd()-0.5)/(NUM*0.5)*6;
				points.push([Math.sin(rad)*d+this.terrainSize/2, Math.cos(rad)*d+this.terrainSize/2, (rnd()*trackRange+this.trackHeightMin)]);
				last=i;
				lastd=d
			}
		}
	}
	return points;
};

ProcTrack.prototype.generateRandomData=function(){
	var data=[];
	for(var x=0;x<8;x++){
		data[x]=[];
		for(var y=0;y<8;y++){
			data[x][y]=rnd();
		}
	};
	return data;
};

ProcTrack.prototype.generateTrackInterPoints=function(num){
	var points=[];
	for(var i=0;i<num;i++){
		points.push(this.curvePoint(i/num));
	}
	return points;
};

ProcTrack.prototype.cubicInterpolate=function(y0,y1,y2,y3,mu){
	var a0,a1,a2,a3,mu2;

	mu2 = mu*mu;
	a0 = y3 - y2 - y0 + y1;
	a1 = y0 - y1 - a0;
	a2 = y2 - y0;
	a3 = y1;

	return (a0*mu*mu2+a1*mu2+a2*mu+a3);
};

ProcTrack.prototype.curvePoint=function(t){
	var points=this.trackPoints;
	var P=t*points.length;
	var idx=Math.floor(P);
	t=P%1;
	
	var previous=(idx+points.length-1)%points.length;
	var current=idx;
	var next=(idx+1)%points.length;
	var next2=(idx+2)%points.length;

	var x=this.cubicInterpolate(points[previous][0],points[current][0],points[next][0],points[next2][0],t);
	var y=this.cubicInterpolate(points[previous][1],points[current][1],points[next][1],points[next2][1],t);
	var z=this.cubicInterpolate(points[previous][2],points[current][2],points[next][2],points[next2][2],t);

	return [x,y,z];
};

ProcTrack.prototype.distanceFromSegment=function(p1,p2,p3){
	var p12=[ p1[0]-p2[0], p1[1]-p2[1] ];
	var p13=[ p1[0]-p3[0], p1[1]-p3[1] ];
	var p23=[ p3[0]-p2[0], p3[1]-p2[1] ];
		
	var l12=Math.sqrt(p12[0]*p12[0]+p12[1]*p12[1]);
	var l13=Math.sqrt(p13[0]*p13[0]+p13[1]*p13[1]);
	var l23=Math.sqrt(p23[0]*p23[0]+p23[1]*p23[1]);
		
	var n23=[p23[0]/l23,p23[1]/l23];
		
	var p1d=n23[0]*p12[0]+n23[1]*p12[1];
	var st1=p1d > 0;
	var st2=n23[0]*p13[0]+n23[1]*p13[1] < 0;
	var d,h;
		
	if(st1 && st2){
		d=Math.abs(n23[1]*p12[0]-n23[0]*p12[1]);
		var t=p1d/l23;
		h=this.mix(p2[2],p3[2],t);
	}else if(st1){
		d=l13;
		h=p3[2];
	}else{
		d=l12;
		h=p2[2];
	}
	return [d,h];
};

ProcTrack.prototype.distanceFromTrack=function(x,y){
	var distance=10000;
	var height=0;
	var v=[x,y];
	var points=this.interPoints;
	for(var i=0;i<points.length;i++){
		var point0=points[i];
		var point1=points[(i+1)%points.length];
			
		var d=this.distanceFromSegment(v,point1,point0);
		if(d[0]<distance){
			distance=d[0];
			height=d[1];
		}
	}
	return [distance,height];
};

ProcTrack.prototype.mix=function(a,b,t){
	return a*(1-t)+b*t;
};
ProcTrack.prototype.clamp=function(a,b,c){
	return Math.max(a,Math.min(b,c));
};

ProcTrack.prototype.sampleAt=function(x,y){
	var data=this.randomData;
	var x0=Math.floor(x%8);
	var y0=Math.floor(y%8);
	try{
		return this.mix(this.mix(data[x0][y0],data[x0][(y0+1)%8],y%1), this.mix(data[(x0+1)%8][y0],data[(x0+1)%8][(y0+1)%8],y%1), x%1);
	}catch(e){
		return 0;
	}
};

ProcTrack.prototype.heightAt=function(x,y){
	var sd=Math.min(Math.abs(x-this.terrainSize),Math.abs(y-this.terrainSize),x,y);
	sd=Math.sqrt(Math.max(0,7-sd)*5);
	var d=this.distanceFromTrack(x,y);
	x/=0.5*this.terrainSize;
	y/=0.5*this.terrainSize;
	var value=this.sampleAt(x*2,y*2)/2+this.sampleAt(x*3,y*3)/4+this.sampleAt(x*5,y*5)/8+this.sampleAt(x*13,y*13)/16+this.sampleAt(x*19,y*19)/16;
	value=value*value*1.5*this.height;
	value=Math.min(this.height,value);
	var t=(this.clamp(this.trackWidth,this.trackFalloffDistance,d[0])-this.trackWidth)/(this.trackFalloffDistance-this.trackWidth);
	return this.mix(value,d[1],Math.pow(1.0-t,4.0))+sd;
};

ProcTrack.prototype.generateHeightMap=function(){
	var size=this.terrainSize;
	var heightMap=[];
	for(var x=0;x<size;x++){
		heightMap[x]=[];
		for(var y=0; y<size;y++){
			heightMap[x][y]=this.heightAt(x,y);
		}
	}
	return heightMap;
};

ProcTrack.prototype.generateTerrainMesh=function(){
	var size=this.terrainSize;
	var verts=[];
	var uvs=[];
	for(var x=0;x<size;x++){
		for(var y=0; y<size;y++){
			verts.push(x,y,this.heightMap[x][y]); 
			uvs.push(x,y);
		}
	}
	var faces=[];
	for(var x=0;x<(size-1);x++){
		for(var y=0; y<(size-1);y++){
			var idx1=x*size+y;
			var idx2=x*size+y+1;
			var idx3=(x+1)*size+y;
			var idx4=(x+1)*size+y+1;
			//if(idx1%2==0) faces.push(idx1,idx3,idx2,idx2,idx3,idx4);
			//	else  faces.push(idx1,idx3,idx4,idx1,idx4,idx2);
			faces.push(idx1,idx3,idx4,idx1,idx4,idx2);
		}
	}
	//calc the normals
	var normals=[];
	for(var i=0;i<verts.length;i++) normals.push(0);
	for(var i=0;i<faces.length;i++){
		var f1=faces[i*3]*3
		var f2=faces[i*3+1]*3;
		var f3=faces[i*3+2]*3;
		var x1=verts[f2]-verts[f1];
		var x2=verts[f3]-verts[f1];
		var y1=verts[f2+1]-verts[f1+1];
		var y2=verts[f3+1]-verts[f1+1];
		var z1=verts[f2+2]-verts[f1+2];
		var z2=verts[f3+2]-verts[f1+2];
		var n1=y1*z2-z1*y2;
		var n2=z1*x2-x1*z2
		var n3=x1*y2-y1*x2
		normals[f1]+=n1;
		normals[f2]+=n1;
		normals[f3]+=n1;
		normals[f1+1]+=n2;
		normals[f2+1]+=n2;
		normals[f3+1]+=n2;
		normals[f1+2]+=n3;
		normals[f2+2]+=n3;
		normals[f3+2]+=n3;
	}
	for(var i=0;i<normals.length;i+=3){
		var n1=normals[i];
		var n2=normals[i+1];
		var n3=normals[i+2];
		var m=Math.sqrt(n1*n1+n2*n2+n3*n3);
		normals[i]/=m;
		normals[i+1]/=m;
		normals[i+2]/=m;
	}
	return {verts:verts,faces:faces, uvs:uvs, normals: normals};
};
/*
ProcTrack.prototype.generateRoadMesh=function(){
	var points=this.generateTrackInterPoints(1000);
	
	var verts=[];
	var uvs=[];
	var distance=0;
	var width=this.trackWidth/3;
	for(var i=0;i<points.length; i++){
		var p=points[i];
		var p2=points[(i+1)%points.length];
		var x=p2[0]-p[0];
		var y=p2[1]-p[1];
		var m=Math.sqrt(x*x+y*y);
		var dx=y/m*width;
		var dy=-x/m*width;
		verts.push(p[0]+dx,p[1]+dy,p[2]+0.01);
		verts.push(p[0]-dx,p[1]-dy,p[2]+0.01);
		uvs.push(0,distance,1,distance);
		distance+=m;
	}
	
	var faces=[];
	var len=verts.length/3;
	for(var i=0;i<len;i+=2){
		idx1=i;
		idx2=i+1;
		idx3=(i+2)%len;
		idx4=(i+3)%len;
		faces.push(idx1,idx3,idx2,idx2,idx3,idx4);
	}
	return {verts:verts,faces:faces, uvs: uvs};
};
*/
})();