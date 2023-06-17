var startGame;
(function(){

/*
tree.js
Copyright (c) 2011, Paul Brunt
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of tree.js nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var Tree;
(function(window){
	Tree=function(data){
		for(i in data){
			if(this.properties[i]!=undefined){
				this.properties[i]=data[i];
			}
		}
		this.properties.rseed=this.properties.seed;
		this.root=new Branch([0,this.properties.u,0]);
		this.root.length=this.properties.e;
		this.verts=[];
		this.faces=[];
		this.normals=[];
		this.UV=[];
		this.vertsTwig=[];
		this.normalsTwig=[];
		this.facesTwig=[];
		this.uvsTwig=[];
		this.root.split(null,null,this.properties);
		this.createForks();
		this.createTwigs();
		this.doFaces();
		this.calcNormals();
		
	};
	Tree.prototype.properties={
		h:0.8,
		i:0.5,
		f:0.85,
		g:1,
		j:2.0,
		s:0.6,
		o:1.5,
		p:0.00,
		n:0.25,
		q:2,
		r:0.95,
		t:13,
		a:6,
		b:3,
		m:0,
		e:0.85,
		u:2.5,
		k: 0.0,
		l: 0.0,
		c:0.2,
		d:2.0,
		seed:10,
		rseed:10,
		random:function(a){
			if(!a) a=this.rseed++;
			return Math.abs(Math.cos(a+a*a));
		}
	};


	Tree.prototype.calcNormals=function(){
		var normals=this.normals;
		var faces=this.faces;
		var verts=this.verts;
		var allNormals=[];
		for(var i=0;i<verts.length;i++){
			allNormals[i]=[];
		}
		for(var i=0;i<faces.length;i++){
			var face=faces[i];
			var norm=normalize(cross(subVec(verts[face[1]],verts[face[2]]),subVec(verts[face[1]],verts[face[0]])));		
			allNormals[face[0]].push(norm);
			allNormals[face[1]].push(norm);
			allNormals[face[2]].push(norm);
		}
		for(var i=0;i<allNormals.length;i++){
			var total=[0,0,0];
			var l=allNormals[i].length;
			for(var j=0;j<l;j++){
				total=addVec(total,scaleVec(allNormals[i][j],1/l))
			}
			normals[i]=total;
		}
	};

	Tree.prototype.doFaces=function(branch){
		if(!branch) branch=this.root;
		var a=this.properties.a;
		var faces=this.faces;
		var verts=this.verts;
		var UV=this.UV;
		if(!branch.parent){
			for(i=0;i<verts.length;i++){
				UV[i]=[0,0];
			}
			var tangent=normalize(cross(subVec(branch.child0.head,branch.head),subVec(branch.child1.head,branch.head)));
			var normal=normalize(branch.head);
			var angle=Math.acos(dot(tangent,[-1,0,0]));
			if(dot(cross([-1,0,0],tangent),normal)>0) angle=2*Math.PI-angle;
			var segOffset=Math.round((angle/Math.PI/2*a));
			for(var i=0;i<a;i++){			
				var v1=branch.ring0[i];
				var v2=branch.root[(i+segOffset+1)%a];
				var v3=branch.root[(i+segOffset)%a];
				var v4=branch.ring0[(i+1)%a];
				
				faces.push([v1,v4,v3]);
				faces.push([v4,v2,v3]);
				UV[(i+segOffset)%a]=[Math.abs(i/a-0.5)*2,0];
				var len=length(subVec(verts[branch.ring0[i]],verts[branch.root[(i+segOffset)%a]]))*this.properties.c;
				UV[branch.ring0[i]]=[Math.abs(i/a-0.5)*2,len];
				UV[branch.ring2[i]]=[Math.abs(i/a-0.5)*2,len];
			}
		}
		
		if(branch.child0.ring0){
			var segOffset0,segOffset1;
			var match0,match1;
			
			var v1=normalize(subVec(verts[branch.ring1[0]],branch.head));
			var v2=normalize(subVec(verts[branch.ring2[0]],branch.head));
			
			v1=scaleInDirection(v1,normalize(subVec(branch.child0.head,branch.head)),0);
			v2=scaleInDirection(v2,normalize(subVec(branch.child1.head,branch.head)),0);
			
			for(var i=0;i<a;i++){
				var d=normalize(subVec(verts[branch.child0.ring0[i]],branch.child0.head));
				var l=dot(d,v1);
				if(segOffset0==undefined || l>match0){
					match0=l;
					segOffset0=a-i;
				}
				var d=normalize(subVec(verts[branch.child1.ring0[i]],branch.child1.head));
				var l=dot(d,v2);
				if(segOffset1==undefined || l>match1){
					match1=l;
					segOffset1=a-i;
				}
			}
			
			var UVScale=this.properties.n/branch.radius;			

			
			for(var i=0;i<a;i++){
				var v1=branch.child0.ring0[i];
				var v2=branch.ring1[(i+segOffset0+1)%a];
				var v3=branch.ring1[(i+segOffset0)%a];
				var v4=branch.child0.ring0[(i+1)%a];
				faces.push([v1,v4,v3]);
				faces.push([v4,v2,v3]);
				v1=branch.child1.ring0[i];
				v2=branch.ring2[(i+segOffset1+1)%a];
				v3=branch.ring2[(i+segOffset1)%a];
				v4=branch.child1.ring0[(i+1)%a];
				faces.push([v1,v2,v3]);
				faces.push([v1,v4,v2]);
				
				var len1=length(subVec(verts[branch.child0.ring0[i]],verts[branch.ring1[(i+segOffset0)%a]]))*UVScale;
				var uv1=UV[branch.ring1[(i+segOffset0-1)%a]];
				
				UV[branch.child0.ring0[i]]=[uv1[0],uv1[1]+len1*this.properties.c];
				UV[branch.child0.ring2[i]]=[uv1[0],uv1[1]+len1*this.properties.c];
				
				var len2=length(subVec(verts[branch.child1.ring0[i]],verts[branch.ring2[(i+segOffset1)%a]]))*UVScale;
				var uv2=UV[branch.ring2[(i+segOffset1-1)%a]];
				
				UV[branch.child1.ring0[i]]=[uv2[0],uv2[1]+len2*this.properties.c];
				UV[branch.child1.ring2[i]]=[uv2[0],uv2[1]+len2*this.properties.c];
			}

			this.doFaces(branch.child0);
			this.doFaces(branch.child1);
		}else{
			for(var i=0;i<a;i++){
				faces.push([branch.child0.end,branch.ring1[(i+1)%a],branch.ring1[i]]);
				faces.push([branch.child1.end,branch.ring2[(i+1)%a],branch.ring2[i]]);
				
				
				var len=length(subVec(verts[branch.child0.end],verts[branch.ring1[i]]));
				UV[branch.child0.end]=[Math.abs(i/a-1-0.5)*2,len*this.properties.c];
				var len=length(subVec(verts[branch.child1.end],verts[branch.ring2[i]]));
				UV[branch.child1.end]=[Math.abs(i/a-0.5)*2,len*this.properties.c];
			}
		}
	};
	
	Tree.prototype.createTwigs=function(branch){
		if(!branch) branch=this.root;
		var vertsTwig=this.vertsTwig;
		var normalsTwig=this.normalsTwig;
		var facesTwig=this.facesTwig;
		var uvsTwig=this.uvsTwig;
		if(!branch.child0){
			var tangent=normalize(cross(subVec(branch.parent.child0.head,branch.parent.head),subVec(branch.parent.child1.head,branch.parent.head)));
			var binormal=normalize(subVec(branch.head,branch.parent.head));
			var normal=cross(tangent,binormal);				
			
			var vert1=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.d)),scaleVec(binormal,this.properties.d*2-branch.length)));
			var vert2=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.d)),scaleVec(binormal,this.properties.d*2-branch.length)));
			var vert3=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.d)),scaleVec(binormal,-branch.length)));
			var vert4=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.d)),scaleVec(binormal,-branch.length)));
			
			var vert8=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.d)),scaleVec(binormal,this.properties.d*2-branch.length)));
			var vert7=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.d)),scaleVec(binormal,this.properties.d*2-branch.length)));
			var vert6=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.d)),scaleVec(binormal,-branch.length)));
			var vert5=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.d)),scaleVec(binormal,-branch.length)));
			
			facesTwig.push([vert1,vert2,vert3]);
			facesTwig.push([vert4,vert1,vert3]);
			
			facesTwig.push([vert6,vert7,vert8]);
			facesTwig.push([vert6,vert8,vert5]);
			
			normal=normalize(cross(subVec(vertsTwig[vert1],vertsTwig[vert3]),subVec(vertsTwig[vert2],vertsTwig[vert3])));
			normal2=normalize(cross(subVec(vertsTwig[vert7],vertsTwig[vert6]),subVec(vertsTwig[vert8],vertsTwig[vert6])));
			
			normalsTwig.push(normal);
			normalsTwig.push(normal);
			normalsTwig.push(normal);
			normalsTwig.push(normal);
			
			normalsTwig.push(normal2);
			normalsTwig.push(normal2);
			normalsTwig.push(normal2);
			normalsTwig.push(normal2);
			
			uvsTwig.push([0,1]);
			uvsTwig.push([1,1]);
			uvsTwig.push([1,0]);
			uvsTwig.push([0,0]);
			
			uvsTwig.push([0,1]);
			uvsTwig.push([1,1]);
			uvsTwig.push([1,0]);
			uvsTwig.push([0,0]);
		}else{
			this.createTwigs(branch.child0);
			this.createTwigs(branch.child1);
		}
	};

	Tree.prototype.createForks=function(branch,radius){
		if(!branch) branch=this.root;
		if(!radius) radius=this.properties.n;
		
		
		branch.radius=radius;
		
		if(radius>branch.length) radius=branch.length;
		
		var verts=this.verts;
		var a=this.properties.a;
		
		var segmentAngle=Math.PI*2/a;
			
		if(!branch.parent){
			//create the root of the tree
			branch.root=[];
			var axis=[0,1,0];
			for(var i=0;i<a;i++){
				var vec=vecAxisAngle([-1,0,0],axis,-segmentAngle*i);
				branch.root.push(verts.length);
				verts.push(scaleVec(vec,radius/this.properties.s));
			}
		}
		
		//cross the branches to get the left
		//add the branches to get the up
		if(branch.child0){
			if(branch.parent){
				var axis=normalize(subVec(branch.head,branch.parent.head));
			}else{
				var axis=normalize(branch.head);
			}
			
			var axis1=normalize(subVec(branch.head,branch.child0.head));
			var axis2=normalize(subVec(branch.head,branch.child1.head));
			var tangent=normalize(cross(axis1,axis2));
			branch.tangent=tangent;
			
			var axis3=normalize(cross(tangent,normalize(addVec(scaleVec(axis1,-1),scaleVec(axis2,-1)))));
			var dir=[axis2[0],0,axis2[2]];			
			var centerloc=addVec(branch.head,scaleVec(dir,-this.properties.n/2));



			var ring0=branch.ring0=[];
			var ring1=branch.ring1=[];
			var ring2=branch.ring2=[];
			
			var scale=this.properties.s;
			
			if(branch.child0.type=="trunk" || branch.type=="trunk") {
				scale=1/this.properties.r;
			}
			
			//main segment ring
			var linch0=verts.length;
			ring0.push(linch0);
			ring2.push(linch0);
			verts.push(addVec(centerloc,scaleVec(tangent,radius*scale)));
			
			var start=verts.length-1;			
			var d1=vecAxisAngle(tangent,axis2,1.57);
			var d2=normalize(cross(tangent,axis));
			var s=1/dot(d1,d2);
			for(var i=1;i<a/2;i++){
				var vec=vecAxisAngle(tangent,axis2,segmentAngle*i);
				ring0.push(start+i);
				ring2.push(start+i);
				vec=scaleInDirection(vec,d2,s);
				verts.push(addVec(centerloc,scaleVec(vec,radius*scale)));
			}
			var linch1=verts.length;
			ring0.push(linch1);
			ring1.push(linch1);
			verts.push(addVec(centerloc,scaleVec(tangent,-radius*scale)));
			for(var i=a/2+1;i<a;i++){
				var vec=vecAxisAngle(tangent,axis1,segmentAngle*i);
				ring0.push(verts.length);
				ring1.push(verts.length);
				verts.push(addVec(centerloc,scaleVec(vec,radius*scale)));

			}
			ring1.push(linch0);
			ring2.push(linch1);
			var start=verts.length-1;
			for(var i=1;i<a/2;i++){
				var vec=vecAxisAngle(tangent,axis3,segmentAngle*i);
				ring1.push(start+i);
				ring2.push(start+(a/2-i));
				var v=scaleVec(vec,radius*scale);
				verts.push(addVec(centerloc,v));
			}
			
			//child radius is related to the brans direction and the length of the branch
			var length0=length(subVec(branch.head,branch.child0.head));
			var length1=length(subVec(branch.head,branch.child1.head));
			
			var radius0=1*radius*this.properties.s;
			var radius1=1*radius*this.properties.s;
			if(branch.child0.type=="trunk") radius0=radius*this.properties.r;
			this.createForks(branch.child0,radius0);
			this.createForks(branch.child1,radius1);
		}else{
			//add points for the ends of braches
			branch.end=verts.length;
			//branch.head=addVec(branch.head,scaleVec([this.properties.xBias,this.properties.yBias,this.properties.zBias],branch.length*3));
			verts.push(branch.head);
			
		}
		
	};

	var Branch=function(head,parent){
		this.head=head;
		this.parent=parent;
	};
	Branch.prototype.child0=null;
	Branch.prototype.child1=null;
	Branch.prototype.parent=null;
	Branch.prototype.head=null;
	Branch.prototype.length=1;
	Branch.prototype.mirrorBranch=function(vec,norm,properties){
		var v=cross(norm,cross(vec,norm));
		var s=properties.j*dot(v,vec);
		return [vec[0]-v[0]*s,vec[1]-v[1]*s,vec[2]-v[2]*s];
	};
	Branch.prototype.split=function(level,steps,properties,l1,l2){
		if(l1==undefined) l1=1;
		if(l2==undefined) l2=1;
		if(level==undefined) level=properties.b;
		if(steps==undefined) steps=properties.q;
		var rLevel=properties.b-level;
		var po;
		if(this.parent){
			po=this.parent.head;
		}else{
			po=[0,0,0];
			this.type="trunk";
		}
		var so=this.head;
		var dir=normalize(subVec(so,po));

		var normal = cross(dir,[dir[2],dir[0],dir[1]]);
		var tangent = cross(dir,normal);
		var r=properties.random(rLevel*10+l1*5+l2+properties.seed);
		var r2=properties.random(rLevel*10+l1*5+l2+1+properties.seed);
		var h=properties.h;
		var i=properties.i;
		
		var adj=addVec(scaleVec(normal,r),scaleVec(tangent,1-r));
		if(r>0.5) adj=scaleVec(adj,-1);
		
		var clump=(h-i)*r+i
		var newdir=normalize(addVec(scaleVec(adj,1-clump),scaleVec(dir,clump)));
			
		
		var newdir2=this.mirrorBranch(newdir,dir,properties);
		if(r>0.5){
			var tmp=newdir;
			newdir=newdir2;
			newdir2=tmp;
		}
		if(steps>0){
			var angle=steps/properties.q*2*Math.PI*properties.t;
			newdir2=normalize([Math.sin(angle),r,Math.cos(angle)]);
		}
		
		var l=level*level/(properties.b*properties.b)*properties.l;
		var k=rLevel*properties.k
		var m=rLevel*properties.m;
		newdir=normalize(addVec(newdir,[m,k+l,0]));
		newdir2=normalize(addVec(newdir2,[m,k+l,0]));
		
		var head0=addVec(so,scaleVec(newdir,this.length));
		var head1=addVec(so,scaleVec(newdir2,this.length));
		this.child0=new Branch(head0,this);
		this.child1=new Branch(head1,this);
		this.child0.length=Math.pow(this.length,properties.g)*properties.f;
		this.child1.length=Math.pow(this.length,properties.g)*properties.f;
		if(level>0){
			if(steps>0){
				this.child0.head=addVec(this.head,[(r-0.5)*2*properties.p,properties.o,(r-0.5)*2*properties.p]);
				this.child0.type="trunk";
				this.child0.length=this.length*properties.r;
				this.child0.split(level,steps-1,properties,l1+1,l2);
			}else{
				this.child0.split(level-1,0,properties,l1+1,l2);
			}
			this.child1.split(level-1,0,properties,l1,l2+1);
		}
	};


	var dot=function(v1,v2){
		return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
	};
	var cross=function(v1,v2){
		return [v1[1]*v2[2]-v1[2]*v2[1],v1[2]*v2[0]-v1[0]*v2[2],v1[0]*v2[1]-v1[1]*v2[0]];
	};
	var length=function(v){
		return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
	};
	var normalize=function(v){
		var l=length(v);
		return scaleVec(v,1/l);
	};
	var scaleVec=function(v,s){
		return [v[0]*s,v[1]*s,v[2]*s];
	};
	var subVec=function(v1,v2){
		return [v1[0]-v2[0],v1[1]-v2[1],v1[2]-v2[2]];
	};
	var addVec=function(v1,v2){
		return [v1[0]+v2[0],v1[1]+v2[1],v1[2]+v2[2]];
	};

	var vecAxisAngle=function(vec,axis,angle){
		//v cos(T) + (axis x v) * sin(T) + axis*(axis . v)(1-cos(T)
		var cosr=Math.cos(angle);
		var sinr=Math.sin(angle);
		return addVec(addVec(scaleVec(vec,cosr),scaleVec(cross(axis,vec),sinr)),scaleVec(axis,dot(axis,vec)*(1-cosr)));
	};
	
	var scaleInDirection=function(vector,direction,scale){
		var currentMag=dot(vector,direction);
		
		var change=scaleVec(direction,currentMag*scale-currentMag);
		return addVec(vector,change);
	};

})(window);

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
	for(var i=2;i<prop.blurb+2;i++){
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
		blurb: 3,
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


var makeFrustum=function(left,right,bottom,top,near,far,m){
	var x = 2*near/(right-left);
	var y = 2*near/(top-bottom);
	var a = (right+left)/(right-left);
	var b = (top+bottom)/(top-bottom);
	var c = -(far+near)/(far-near);
	var d = -2*far*near/(far-near);
	return mat4(x, 0, a, 0,
		       0, y, b, 0,
		       0, 0, c, d,
		       0, 0, -1, 0,m);
};

var makePerspective=function(fovy, aspect, near, far,m){
	var ymax = near * Math.tan(fovy * 0.00872664625972);
	var ymin = -ymax;
	var xmin = ymin * aspect;
	var xmax = ymax * aspect;
	return makeFrustum(xmin, xmax, ymin, ymax, near, far,m);
};


var unique=0;
var identMatrix=function(){
	var mat=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
	unique=(unique+1)%100000;
	mat.unique=unique;
	return mat;
};
var translateMatrix=function(x,y,z,m){
	return mat4(1,0,0,x,0,1,0,y,0,0,1,z,0,0,0,1,m);
};
var scaleMatrix=function(x,y,z,m){
	return mat4(x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1,m);
};

var angleAxis=function(angle, axis,m) {
	var xmx,ymy,zmz,xmy,ymz,zmx,xms,yms,zms;
	axis=[axis[0],axis[1],axis[2],0];

	var x = axis[0];
	var y = axis[1];
	var z = axis[2];
	        
	var cos = Math.cos(angle);
	var cosi = 1.0 - cos;
	var sin = Math.sin(angle);
 
	xms = x * sin;yms = y * sin;zms = z * sin;
	xmx = x * x;ymy = y * y;zmz = z * z;
	xmy = x * y;ymz = y * z;zmx = z * x;
	
	return mat4((cosi * xmx) + cos,(cosi * xmy) - zms,(cosi * zmx) + yms,0,
			(cosi * xmy) + zms,(cosi * ymy) + cos,(cosi * ymz) - xms,0,
			(cosi * zmx) - yms,(cosi * ymz) + xms,(cosi * zmz) + cos,0,
			0,0,0,1,m);
};

var tsrMatrix=function(){
	var mat1=identMatrix();
	var mat2=identMatrix();
	var mat3=identMatrix();

	return function(tx,ty,tz,sx,sy,sz,angle,axis,m){
		translateMatrix(tx,ty,tz,mat1);
		angleAxis(angle, axis,mat2);
		mulMat4(mat1,mat2,mat3);
		mulMat4(mat3,scaleMatrix(sx,sy,sz,mat1),m);
		return m;
	};
}();

var transposeMat4=function(m) {
	var v=m[1];
	m[1]=m[4];
	m[4]=v;
	var v=m[8];
	m[8]=m[2];
	m[2]=v;
	var v=m[3];
	m[3]=m[12];
	m[12]=v;
	var v=m[9];
	m[9]=m[6];
	m[6]=v;
	var v=m[13];
	m[13]=m[7];
	m[7]=v;
	var v=m[14];
	m[14]=m[11];
	m[11]=v;
	unique=(unique+1)%100000;
	m.unique=unique;
	return m;
};

var mat4=function(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,m){
	m[0]=a1; m[1]=a2;m[2]=a3;m[3]=a4;
	m[4]=a5; m[5]=a6;m[6]=a7;m[7]=a8;
	m[8]=a9; m[9]=a10;m[10]=a11;m[11]=a12;
	m[12]=a13; m[13]=a14;m[14]=a15;m[15]=a16;
	unique=(unique+1)%100000;
	m.unique=unique;
	return m;
};

var mulMat4=function(mat2,mat1,m){

	var a00 = mat1[0], a01 = mat1[1], a02 = mat1[2], a03 = mat1[3];
	var a10 = mat1[4], a11 = mat1[5], a12 = mat1[6], a13 = mat1[7];
	var a20 = mat1[8], a21 = mat1[9], a22 = mat1[10], a23 = mat1[11];
	var a30 = mat1[12], a31 = mat1[13], a32 = mat1[14], a33 = mat1[15];
	
	var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
	var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
	var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
	var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
	return mat4(b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
		b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
		b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
		b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
		
		b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
		b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
		b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
		b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
		
		b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
		b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
		b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
		b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
		
		b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
		b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
		b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
		b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
		m);
};

var inverseMat4=function(mat,m){
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var d = a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
			a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
			a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
			a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
			a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
			a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
	
	return mat4((a21*a32*a13 - a31*a22*a13 + a31*a12*a23 - a11*a32*a23 - a21*a12*a33 + a11*a22*a33)/d,
	(a31*a22*a03 - a21*a32*a03 - a31*a02*a23 + a01*a32*a23 + a21*a02*a33 - a01*a22*a33)/d,
	(a11*a32*a03 - a31*a12*a03 + a31*a02*a13 - a01*a32*a13 - a11*a02*a33 + a01*a12*a33)/d,
	(a21*a12*a03 - a11*a22*a03 - a21*a02*a13 + a01*a22*a13 + a11*a02*a23 - a01*a12*a23)/d,
	(a30*a22*a13 - a20*a32*a13 - a30*a12*a23 + a10*a32*a23 + a20*a12*a33 - a10*a22*a33)/d,
	(a20*a32*a03 - a30*a22*a03 + a30*a02*a23 - a00*a32*a23 - a20*a02*a33 + a00*a22*a33)/d,
	(a30*a12*a03 - a10*a32*a03 - a30*a02*a13 + a00*a32*a13 + a10*a02*a33 - a00*a12*a33)/d,
	(a10*a22*a03 - a20*a12*a03 + a20*a02*a13 - a00*a22*a13 - a10*a02*a23 + a00*a12*a23)/d,
	(a20*a31*a13 - a30*a21*a13 + a30*a11*a23 - a10*a31*a23 - a20*a11*a33 + a10*a21*a33)/d,
	(a30*a21*a03 - a20*a31*a03 - a30*a01*a23 + a00*a31*a23 + a20*a01*a33 - a00*a21*a33)/d,
	(a10*a31*a03 - a30*a11*a03 + a30*a01*a13 - a00*a31*a13 - a10*a01*a33 + a00*a11*a33)/d,
	(a20*a11*a03 - a10*a21*a03 - a20*a01*a13 + a00*a21*a13 + a10*a01*a23 - a00*a11*a23)/d,
	(a30*a21*a12 - a20*a31*a12 - a30*a11*a22 + a10*a31*a22 + a20*a11*a32 - a10*a21*a32)/d,
	(a20*a31*a02 - a30*a21*a02 + a30*a01*a22 - a00*a31*a22 - a20*a01*a32 + a00*a21*a32)/d,
	(a30*a11*a02 - a10*a31*a02 - a30*a01*a12 + a00*a31*a12 + a10*a01*a32 - a00*a11*a32)/d,
	(a10*a21*a02 - a20*a11*a02 + a20*a01*a12 - a00*a21*a12 - a10*a01*a22 + a00*a11*a22)/d,
	m);
};

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();


var GLInit=function(canvas) {
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	if (!gl) {
		alert("No Webgl");
	}
	return gl;
};

var GLProgram=function(gl,vShader,fShader){
	this.gl=gl;
	
	var program = gl.createProgram();
 
	var vs = this.createShader( gl, vShader, gl.VERTEX_SHADER );
	var fs = this.createShader(gl, fShader, gl.FRAGMENT_SHADER );
 
	if ( vs == null || fs == null ) return null;
 
	gl.attachShader( program, vs );
	gl.attachShader( program, fs );
 
	gl.deleteShader( vs );
	gl.deleteShader( fs );
 
	gl.linkProgram( program );
 
	
	this.uniforms=[];
	this.uniformNames={};
	var uniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

	for (var i=0;i<uniforms;i++) {
		var info=gl.getActiveUniform(program, i);
		info.location=gl.getUniformLocation(program, info.name);
		this.uniforms.push(info);
		this.uniformNames[info.name]=info;
	}
	this.attributes=[];
	var attributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	var offset=0;
	for (var i=0;i<attributes;i++) {
		var info=gl.getActiveAttrib(program, i);
		info.location=gl.getAttribLocation(program, info.name);
		info.offset=offset;
		info.num= info.type==gl.FLOAT_VEC3 ? 3 : info.type==gl.FLOAT_VEC4 ? 4 : 2 ;
		offset+= info.num;
		this.attributes.push(info);
		gl.enableVertexAttribArray(info.location);
	}
	this.totalStride=offset*4;
	this.totalOffset=offset;
	this.uniformCache={};
	
	this.program=program;
};

GLProgram.prototype.createShader=function(gl, src, type) {
	var shader = gl.createShader( type );
 
	gl.shaderSource( shader, src );
	gl.compileShader( shader );
 
	if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
		return null;
	}
 
	return shader;
};
GLProgram.prototype.setUniform=function(name,value) {
	var v=value;
	if(v.length) v=value.unique;
	if(this.uniformCache[name]!=v || isNaN(v)){
		loc=this.uniformNames[name].location;
		if(this.uniformNames[name].type==gl.FLOAT_MAT4){
			gl.uniformMatrix4fv(loc,false,value);
		}else if(this.uniformNames[name].type==gl.SAMPLER_2D){
			gl.uniform1i(loc,value);
		}else if(this.uniformNames[name].type==gl.FLOAT){
			gl.uniform1f(loc,value);
		}
		this.uniformCache[name]=v;
	}
};


var GLBuffer=function(gl, data,type){
	this.data=data;
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl[type], buffer);

	gl.bufferData(gl[type], data, gl.STATIC_DRAW);
	this.buffer=buffer;
};
GLBuffer.prototype.offsets={
	aVertexPosition: 0,
	aVertexNormal: 12,
	aTextureCoord: 24
};

var GLRenderer=function(gl){
	this.gl=gl;
	//gl.clearColor(0.51, 0.65, 0.66, 1.0);
	gl.clearColor(0.3, 0.4, 0.5, 1.0);
	gl.enable(gl.DEPTH_TEST);
	this.clear();
};
GLRenderer.prototype.useProgram=function(program){
	var gl=this.gl;
	if(program!=gl.program){
		gl.program=program;
		this.program=program;
		gl.useProgram(program.program);
	}
};
GLRenderer.prototype.useBuffer=function(buffer){
	if(this.buffer!=buffer){
		var gl=this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
		if(this.program){
			var attributes=this.program.attributes;
			var len=attributes.length;
			for(var i=0;i<len;i++){
				gl.vertexAttribPointer(attributes[i].location, attributes[i].num, gl.FLOAT, false, this.program.totalStride, buffer.offsets[attributes[i].name]);
			}
		}
	}
};
GLRenderer.prototype.useElements=function(buffer){
	if(buffer!=this.elementsBuffer){
		var gl=this.gl;
		this.elementsBuffer=buffer;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
	}
};
GLRenderer.prototype.drawElements=function(){
	var gl=this.gl;
	gl.drawElements(gl.TRIANGLES, this.elementsBuffer.data.length, gl.UNSIGNED_SHORT, 0);
};
GLRenderer.prototype.setUniform=function(name,value){
	var gl=this.gl;
	var program=this.program;
	program.setUniform(name,value);
};
GLRenderer.prototype.clear=function(){
	var gl=this.gl;
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
GLRenderer.prototype.addTexture=function(idx,image){
	
	var gl=this.gl;
	var texture=gl.createTexture();
	gl.activeTexture(gl["TEXTURE"+idx]);
	gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
};



var bar=document.getElementById("bar");
var intro=document.getElementById("intro");
var startgame=document.getElementById("startgame");
var underlay=document.getElementById("underlay");
var smotenum=document.getElementById("smotenum");
var bi=document.getElementById("bi");
var gameover=document.getElementById("gameover");

bi.style.backgroundImage=intro.style.backgroundImage="url("+paper().toDataURL()+")";


var overlayLayer=document.getElementById("overlay");
overlayLayer.style.backgroundImage="url('"+overlay().toDataURL()+"')";

var GLCamera=function(){
	this.position=[125,10,-125];
	this.rotation=[0,0];
	this.transMat=identMatrix();
	this.rotMat1=identMatrix();
	this.rotMat2=identMatrix();
	this.temp=identMatrix();
	this.matrix=identMatrix();
	this.invMatrix=identMatrix();
	this.updateMatrix();
};
GLCamera.prototype.updateMatrix=function(){
	var p=this.position;
	var r=this.rotation;
	var t=this.transMat;
	var m=this.temp;
	var r1=this.rotMat1;
	var r2=this.rotMat2;
	translateMatrix(p[0],p[1],p[2], t);
	angleAxis(r[0],[1,0,0], r1);
	angleAxis(r[1],[0,1,0], r2);
	mulMat4(r2,r1,m);
	mulMat4(t,m,this.matrix);
	inverseMat4(this.matrix,this.invMatrix);
};
GLCamera.prototype.rotateV=function(rot){
	this.rotation[0]+=rot;
	this.updateMatrix();
};
GLCamera.prototype.rotateH=function(rot){
	this.rotation[1]+=rot;
	this.updateMatrix();
};
GLCamera.prototype.move=function(dir,distance){
	this.position[0]+=this.matrix[0+dir]*distance;
	this.position[1]+=this.matrix[4+dir]*distance;
	this.position[2]+=this.matrix[8+dir]*distance;
	this.updateMatrix();
};




var canvas=document.getElementById("canvas");
canvas.width=800;
canvas.height=window.innerHeight/window.innerWidth*800
var gl=GLInit(canvas);
gl.cullFace(gl.BACK);
gl.enable(gl.CULL_FACE); 
gl.blendFunc(gl["SRC_ALPHA"],gl["ONE"]);

var tree=new Tree({seed:152,
a:6,
b:5,
c:1.16,
d:0.44,
e:0.49,
f:0.85,
g:0.99,
h:0.454,
i:0.246,
j:3.2,
k:0.09,
l:0.235,
m:0.01,
n:0.114,
o:0.41,
p:0,
q:5,
r:0.835,
s:0.73,
t:2.06,
u:2.5});

var tree2=new Tree({"seed":499,
a:8,
b:5,
c:1,
d:0.48,
e:0.5,
f:0.98,
g:1.08,
h:0.414,
i:0.282,
j:2.2,
k:0.24,
l:0.044,
m:0,
n:0.096,
o:0.39,
p:0,
q:5,
r:0.958,
s:0.71,
t:2.97,
u:1.95});

var processTreeData=function(tree){
	var data=[];
	var len=tree.verts.length;
	for(var i=0;i<len;i++){
		data.push(tree.verts[i][0],tree.verts[i][1],tree.verts[i][2],tree.normals[i][0],tree.normals[i][1],tree.normals[i][2],tree.UV[i][0],tree.UV[i][1]);
	}
	var faces=[];
	for(var i=0;i<tree.faces.length;i++){
		faces.push(tree.faces[i][0],tree.faces[i][1],tree.faces[i][2]);
	}


	var start=data.length/8;
	
	var datatwig=[];
	var len=tree.vertsTwig.length;
	for(var i=0;i<len;i++){
		data.push(tree.vertsTwig[i][0],tree.vertsTwig[i][1],tree.vertsTwig[i][2],tree.normalsTwig[i][0],tree.normalsTwig[i][1],tree.normalsTwig[i][2],tree.uvsTwig[i][0]+50,tree.uvsTwig[i][1]);
	}
	//var facestwig=[];
	for(var i=0;i<tree.facesTwig.length;i++){
		faces.push(tree.facesTwig[i][0]+start,tree.facesTwig[i][1]+start,tree.facesTwig[i][2]+start);
	}
	return [data,faces];
};

var data=processTreeData(tree)
var data2=processTreeData(tree2)


var vertices = new GLBuffer(gl, new Float32Array(data[0]),"ARRAY_BUFFER");
var faces = new GLBuffer(gl, new Uint16Array(data[1]),"ELEMENT_ARRAY_BUFFER");


var vertices2 = new GLBuffer(gl, new Float32Array(data2[0]),"ARRAY_BUFFER");
var faces2 = new GLBuffer(gl, new Uint16Array(data2[1]),"ELEMENT_ARRAY_BUFFER");


var track=new ProcTrack({height:15, terrainSize:250});
var len=track.terrainMesh.verts.length/3;
var trackdata=[];
for(var i=0;i<len;i++){
	trackdata.push(track.terrainMesh.verts[i*3]);
	trackdata.push(track.terrainMesh.verts[i*3+1]);
	trackdata.push(track.terrainMesh.verts[i*3+2]);
	trackdata.push(track.terrainMesh.normals[i*3]);
	trackdata.push(track.terrainMesh.normals[i*3+1]);
	trackdata.push(track.terrainMesh.normals[i*3+2]);
	trackdata.push(track.terrainMesh.uvs[i*2]);
	trackdata.push(track.terrainMesh.uvs[i*2+1]);
}
var verticestrack = new GLBuffer(gl, new Float32Array(trackdata),"ARRAY_BUFFER");
var facestrack = new GLBuffer(gl, new Uint16Array(track.terrainMesh.faces),"ELEMENT_ARRAY_BUFFER");


var program = new GLProgram(gl, document.getElementById("shader-vs").innerHTML, document.getElementById("shader-fs").innerHTML);
var program2 = new GLProgram(gl, document.getElementById("shader-vs").innerHTML, document.getElementById("shader-fs2").innerHTML);
var program3 = new GLProgram(gl, document.getElementById("particle-vs").innerHTML, document.getElementById("particle-fs").innerHTML);

var pMatrix=transposeMat4(makePerspective(45, 1.6, 0.01, 1000,identMatrix()));

var mat=identMatrix();

var mat2=identMatrix();

tsrMatrix(0,0,0,1,1,1,-1.57,[1,0,0],mat2);

var renderer=new GLRenderer(gl);

var bark={
	size: 256,
	xbias: 1,
	ybias: 3,
	r: 0.46,
	g: 0.37,
	b: 0.32,
	minIntensity: -0.1,
	lineAlpha: 0.5,
	blurAlpha: 0.5,
	minLine: 1,
	lineWidth: 5,
	lines: 50,
	blurb: 2,
	seed: 0.22342867101542652
};

var grass={
	size: 512,
	xbias: 1,
	ybias: 1,
	r: 0.14,
	g: 0.33,
	b: 0.13,
	minIntensity: 0.2,
	lineAlpha: 0.5,
	blurAlpha: 0.5,
	minLine: 1,
	lineWidth: 2,
	lines: 0,
	blurb: 3,
	seed:  0.6985204408410937
};
var mud={
	size: 512,
	xbias: 1,
	ybias: 1,
	r: 0.42,
	g: 0.38,
	b: 0.26,
	minIntensity: 0.2,
	lineAlpha: 0.5,
	blurAlpha: 0.5,
	minLine: 1,
	lineWidth: 5,
	lines: 100,
	blurb: 3,
	seed: 0.31093138875439763
};
var rock={
	size: 512,
	xbias: 1.2,
	ybias: 1,
	r: 0.5,
	g: 0.7,
	b: 0.7,
	minIntensity: 0.0,
	lineAlpha: 0.6,
	blurAlpha: 0.75,
	minLine: 1,
	lineWidth: 20,
	lines: 50,
	blurb: 3,
	seed: 0.8831543794367462
};
renderer.addTexture(0,makeSeemless(generateTexture(bark)));

renderer.addTexture(1,branchTexture(["rgba(0,36,0,1)","rgba(25,36,12,1)","rgba(36,36,0,1)"]));


renderer.addTexture(2,makeSeemless(generateTexture(rock)));
renderer.addTexture(3,makeSeemless(generateTexture(mud)));
renderer.addTexture(4,makeSeemless(generateTexture(grass)));

renderer.addTexture(5,branchTexture(["rgba(25,36,0,1)","rgba(50,36,12,1)","rgba(65,36,0,1)"]));

bark.r=0.40;
bark.g=0.40;
bark.b=0.36;
renderer.addTexture(6,makeSeemless(generateTexture(bark)));
renderer.addTexture(7,fireTexture());
var img=new Image;
img.onload=function(){
renderer.addTexture(8,img);
};
img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAABhQTFRFDA4KLS4sVldVZ2lmjY+Ms7Wy1NbT+fv4geR4pwAAAF1JREFUCNdjKIcCBiAOK4UwUlWL3UGMFEO2QiFXICNIQLyIQQXIKDFOL3d2AyuG6kpLKytLSwMyytLLQRgklZoOMafUwTkczChTdEiHWGHkCLXLOQgiVZ6aCpUCAwBYHTQLXnC3gQAAAABJRU5ErkJggg==";





renderer.useProgram(program);
renderer.setUniform("uPMatrix",pMatrix);
renderer.useProgram(program3);
renderer.setUniform("uPMatrix",pMatrix);
renderer.setUniform("texture1",7);
renderer.useProgram(program2);
renderer.setUniform("uPMatrix",pMatrix);
renderer.setUniform("texture1",2);
renderer.setUniform("texture2",3);
renderer.setUniform("texture3",4);

var camera=new GLCamera;
var ms=identMatrix();
var nm=identMatrix();



var trees=[];
var treecamera=[];
for(var i=0;i<500;i++){
	var x=Math.floor(Math.random()*250);
	var y=-Math.floor(Math.random()*250);
	var z=track.heightAt(x,-y);
	var treemat=identMatrix();
	var scale=Math.random()*1.5+0.9;
	tsrMatrix(x,z,y,scale,scale,scale,Math.random()*Math.PI*2,[0,1,0],treemat);
	trees.push({idx:i,mat:treemat});
	treecamera.push({idx:i,mv:identMatrix(),mn:identMatrix()});
} 


var S1=0.04,S2=1.58,S3=0.85,S4=0.53;
var sverts=[S2,S1,-S1,-S3,-S4,0,55,1,S2,S1,S1,-S3,-S4,0,56,1,1.45,0.24,-0.01,-S3,-S4,0,56,0,S2,-S1,-S1,-0.88,0.47,-0,55,1,1.45,-0.27,-0.01,-0.88,0.47,-0,56,1,S2,-S1,S1,-0.88,0.47,-0,56,0,S2,S1,S1,0.09,0.26,0.96,55,1,2.07,-0,0.01,0.09,0.26,0.96,56,1,1.45,0.24,-0.01,0.09,0.26,0.96,56,0,S2,S1,S1,0.07,-0,1,55,1,S2,-S1,S1,0.07,-0,1,56,1,2.07,-0,0.01,0.07,-0,1,56,0,S2,-S1,S1,0.08,-0.24,0.97,55,1,1.45,-0.27,-0.01,0.08,-0.24,0.97,56,1,2.07,-0,0.01,0.08,-0.24,0.97,56,0,S2,S1,-S1,0.09,0,-1,55,1,2.07,-0,0.01,0.09,0,-1,56,1,S2,-S1,-S1,0.09,0,-1,56,0,S2,S1,-S1,0.10,0.21,-0.97,55,1,1.45,0.24,-0.01,0.10,0.21,-0.97,56,1,2.07,-0,0.01,0.10,0.21,-0.97,56,0,S2,-S1,-S1,0.10,-0.16,-1,55,1,2.07,-0,0.01,0.10,-0.16,-1,56,1,1.45,-0.27,-0.01,0.10,-0.16,-1,56,0,S2,S1,S1,0,1,0,0,1,S2,S1,-S1,0,1,0,1,1,-S2,S1,S1,0,1,0,0,0,-S2,S1,-S1,0,1,0,1,0,-S2,-S1,-S1,-1,0,0,0,1,-S2,-S1,S1,-1,0,0,1,1,-S2,S1,S1,-1,0,0,1,0,-S2,S1,-S1,-1,0,0,0,0,S2,-S1,-S1,0,-1,0,0,1,S2,-S1,S1,0,-1,0,1,1,-S2,-S1,-S1,0,-1,0,0,0,-S2,-S1,S1,0,-1,0,1,0,S2,S1,S1,0,0,1,0,1,-S2,S1,S1,0,0,1,1,1,S2,-S1,S1,0,0,1,0,0,-S2,-S1,S1,0,0,1,1,0,S2,S1,-S1,0,0,-1,0,1,S2,-S1,-S1,0,0,-1,1,1,-S2,S1,-S1,0,0,-1,0,0,-S2,-S1,-S1,0,0,-1,1,0];
var sfacesi=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,25,27,26,28,29,30,28,30,31,32,33,34,33,35,34,36,37,38,37,39,38,40,41,42,41,43,42];
var svertices= new GLBuffer(gl, new Float32Array(sverts),"ARRAY_BUFFER");
var sfaces= new GLBuffer(gl, new Uint16Array(sfacesi),"ELEMENT_ARRAY_BUFFER");
var smat=identMatrix();
var smat2=identMatrix();
var smat3=identMatrix();

//plane
var fverts= new GLBuffer(gl, new Float32Array([-0.3,-0.3,0, 0,0,1, 0,0,  0.3,-0.3,0, 0,0,1,  1,0,   0.3,0.3,0 , 0,0,1, 1,1   ,-0.3,0.3,0, 0,0,1,  0,1]),"ARRAY_BUFFER");
var ffaces= new GLBuffer(gl, new Uint16Array([0,3,1,1,3,2]),"ELEMENT_ARRAY_BUFFER");


/*particles*/

var NUMPARICLES=100;
var partverts=[];
var partfaces=[];
for(var i=0;i<NUMPARICLES;i++){
	var r=Math.random();
	partverts.push(0,0,0,r, 1,0,0,r, 1,1,0,r, 0,1,0,r);
	var idx=i*4;
	partfaces.push(idx+1,idx+3,idx+0,idx+2,idx+3,idx+1);
}

var verticespart= new GLBuffer(gl, new Float32Array(partverts),"ARRAY_BUFFER");
var facespart = new GLBuffer(gl, new Uint16Array(partfaces),"ELEMENT_ARRAY_BUFFER");

startGame=function(){
	for(var i=0;i<40;i++){
	baddies.push(new FlameBaddie);
	}
	gameEnded=false;
	health=100;
	smote=0;
	smotenum.innerHTML=smote;
	bar.style.width=(health*3)+"px";
	anim();
	startgame.setAttribute("class","hide");
	underlay.setAttribute("class","hide");
	start=+new Date;
	gameover.style.display="none";
};
function gameOver(){
	gameEnded=true;
	setTimeout(anim,10);
	startgame.setAttribute("class","");
	underlay.setAttribute("class","");
	gameover.style.display="block";
};

var FlameBaddie=function(){
	this.position=[Math.random()*200,10,Math.random()*200];
	this.lastTime=+new Date;
	this.matrix=identMatrix();
	tsrMatrix(this.position[0],8,-this.position[1],1,1,1,0,[0,1,0],this.matrix)
	this.transMatrix=identMatrix();
	this.randomDir();
	this.state=0;
	this.live=1;
	this.speed=0.002;
};
FlameBaddie.prototype.randomDir=function(){
	var x=Math.random()-0.5;
	var y=Math.random()-0.5;
	var a=Math.sqrt(x*x+y*y);
	this.direction=[x/a,y/a];

}
FlameBaddie.prototype.updatePosition=function(){
	var now=+new Date;
	var dt=now-this.lastTime;
	dt=Math.min(30,dt);
	this.lastTime=now;
	this.speed=(now-start)*0.00000003;
	this.position[0]+=this.direction[0]*dt*this.speed;
	this.position[2]+=this.direction[1]*dt*this.speed;
	if(this.position[0]<10 || this.position[0]>190) this.direction[0]*=-0.9;
	if(this.position[2]<10 || this.position[2]>190) this.direction[1]*=-0.9;
	if(Math.random()<0.005) this.randomDir();
};
FlameBaddie.prototype.render=function(){
	if(this.live==1 && this.state>0) this.state--;
	if(this.live==0 && this.state<100) this.state++;
	if(this.live==0 && this.state==100){
		this.position=[Math.random()*200,10,Math.random()*200];
		this.live=1;
	}
	var dx=camera.position[0]-this.position[0];
	var dy=camera.position[2]+this.position[2];
	var d=Math.sqrt(dx*dx+dy*dy);
	if(d<50){
		this.direction[0]=dx/d;
		this.direction[1]=-dy/d;
	}
	if(d<2){
		health-=1;
		if(health<0){
			health=0;
			gameOver();
		}
		bar.style.width=(health*3)+"px";
	}
	this.updatePosition();
	this.position[1]=track.heightAt(this.position[0],this.position[2]);
	tsrMatrix(this.position[0],this.position[1]+1,-this.position[2],1,1,1,Math.atan2(-this.direction[0],this.direction[1]),[0,1,0],this.matrix);
	transposeMat4(mulMat4(camera.invMatrix,this.matrix,this.transMatrix));
	renderer.setUniform("uMVMatrix",this.transMatrix);
	renderer.setUniform("uState",this.state);
	renderer.drawElements();
};
FlameBaddie.prototype.renderFace=function(){
	transposeMat4(mulMat4(camera.invMatrix,this.matrix,this.transMatrix));
	renderer.setUniform("uMVMatrix",this.transMatrix);
	renderer.drawElements();
};

var baddies=[];


var Spear=function(){
	this.lastTime=+new Date;
	this.smat=identMatrix();
	this.smat2=identMatrix();
	this.smat3=identMatrix();
};
Spear.prototype.render=function(){
	var now=+new Date;
	var dt=now-this.lastTime;
	dt=Math.min(30,dt);
	this.lastTime=now;
	var smat=this.smat,smat2=this.smat2,smat3=this.smat3;
	renderer.useBuffer(svertices);
	renderer.useElements(sfaces);
	
	if(now-this.throwStarted<3000){
		smat[3]+=dt*0.001*20*smat[0];
		smat[7]+=dt*0.001*20*smat[4];
		smat[11]+=dt*0.001*20*smat[8];
		this.checkBaddies();
	}else{
		var m=camera.matrix;
		tsrMatrix(-0.6,0,0.2,1,1,1,1.4,[0,1,0],smat2);
		mulMat4(angleAxis(1.57,[0,0,1],smat),smat2,smat3);
		mulMat4(camera.matrix,smat3,smat);
	}
	transposeMat4(mulMat4(camera.invMatrix,smat,smat2));
	inverseMat4(smat,smat3);
	renderer.setUniform("uMVMatrix",smat2);
	renderer.setUniform("uNMatrix",smat3);
	renderer.drawElements();
};
Spear.prototype.thro=function(){
	this.throwStarted=+new Date;
};
Spear.prototype.checkBaddies=function(){
	for(var i=0;i<baddies.length;i++){
		var baddie=baddies[i];
		var dx=baddie.position[0]-this.smat[3];
		var dy=baddie.position[1]-this.smat[7];
		var dz=-baddie.position[2]-this.smat[11];
		var d=dx*dx+dy*dy+dz*dz;
		if(d<6){
			smote++;
			smotenum.innerHTML=smote;
			baddie.live=0;
			this.throwStarted=0;
		}
	}
};

var spear=new Spear;


var angle=0;
var health=100;
var smote=0;

var treesort=function(a,b){
	if(a.mv[14]<b.mv[14]) return 1;
		else return -1;
}
var start=+new Date;
var gameEnded=true;
var anim=function(){
	if(gameEnded){
		baddies=[];
		camera.position=[125,10,-125];
		camera.rotation=[0,0];
	}
	renderer.clear();
	angle+=0.02;
	if(camera.position[0]<7) camera.position[0]=7;
	if(camera.position[0]>243) camera.position[0]=243;
	if(camera.position[2]>-7) camera.position[2]=-7;
	if(camera.position[2]<-243) camera.position[2]=-243;
	
	var height=track.heightAt(camera.position[0],-camera.position[2]);
	camera.position[1]=height+1.5;
	
		
	renderer.useProgram(program2);
	transposeMat4(mulMat4(camera.invMatrix,mat2,ms));

	renderer.setUniform("uMVMatrix",ms);
	renderer.setUniform("uNMatrix",inverseMat4(mat2,nm));
	renderer.useBuffer(verticestrack);
	renderer.useElements(facestrack);
	renderer.drawElements();
	
	renderer.useProgram(program);
	
	renderer.setUniform("uUseAlpha",0.0);
	
	for(var i=0;i<trees.length;i++){
		transposeMat4(mulMat4(camera.invMatrix,trees[i].mat,treecamera[i].mv));
		inverseMat4(trees[i].mat,treecamera[i].mn);
		treecamera[i].idx=i;
	}
	treecamera.sort(treesort);

	for(var i=0;i<trees.length;i++){
		if(treecamera[i].idx>250){
			renderer.useBuffer(vertices);
			renderer.useElements(faces);
			renderer.setUniform("texture1",0);
			renderer.setUniform("texture2",1);
		}else{
			renderer.useBuffer(vertices2);
			renderer.useElements(faces2);
			renderer.setUniform("texture1",6);
			renderer.setUniform("texture2",5);
		}
	
		var mv=treecamera[i].mv;
		var mag=Math.sqrt(mv[12]*mv[12]+mv[14]*mv[14]);
		var dir=mv[14]/mag;
		if(dir<-0.70 || mag<20){
			renderer.setUniform("uMVMatrix",mv);
			renderer.setUniform("uNMatrix",treecamera[i].mn);
			renderer.drawElements();
		}
	}
	renderer.setUniform("texture1",0);
	renderer.setUniform("texture2",2);
	spear.render();
	
	
	gl.enable(gl.BLEND);
	gl.depthMask(false);
	gl.blendFunc(gl["SRC_ALPHA"],gl["ONE"]);
	renderer.useProgram(program3);
	renderer.useBuffer(verticespart);
	renderer.useElements(facespart);
	renderer.setUniform("uTime",+new Date-start);
	for(var i=0;i<baddies.length;i++) baddies[i].render();
	
	
	
	gl.disable(gl.CULL_FACE); 
	gl.blendFunc(gl["ONE"],gl["ONE_MINUS_SRC_ALPHA"]);
	renderer.useProgram(program);
	renderer.setUniform("uUseAlpha",1.0);
	renderer.useBuffer(fverts);
	renderer.useElements(ffaces);
	renderer.setUniform("texture1",8);
	for(var i=0;i<baddies.length;i++) baddies[i].renderFace();
	gl.depthMask(true);
	gl.disable(gl.BLEND);
	gl.enable(gl.CULL_FACE); 
	
	if(!gameEnded) requestAnimFrame(anim);
};
anim();

(function(){
	
	var drag=false;
	overlayLayer.onmousedown=function(e){
		if(e.button===0){
			drag=[e.clientX,e.clientY];
		}else{
			spear.thro();
		}
		e.preventDefault();
		return false;
	};
	overlayLayer.onmousemove=function(e){
		if(drag && ! gameEnded){
			dx=e.clientX-drag[0];
			dy=e.clientY-drag[1];
			camera.rotateH(-dx*0.01);
			camera.rotateV(-dy*0.01);
			drag[0]=e.clientX;
			drag[1]=e.clientY;
		}
	};
	var keys=[];
	document.onmouseup=function(e){if(e.button===0){drag=false}};
	document.addEventListener("keydown",function(e){
		keys[e.keyCode]=true;
	},false);
	document.addEventListener("keyup",function(e){
		keys[e.keyCode]=false;
	},false);
	var lastTime=+new Date;
	setInterval(function(){
		var now=+new Date;
		var dt=now-lastTime;
		dt=Math.min(30,dt);
		lastTime=now;
		if(!gameEnded){
			if(keys[87]) camera.move(2,-0.1*dt*0.1);
			if(keys[83]) camera.move(2,0.1*dt*0.1);
			if(keys[68]) camera.move(0,0.1*dt*0.1);
			if(keys[65]) camera.move(0,-0.1*dt*0.1);
		}
	},15);
	document.body.oncontextmenu = function(){return false;};

})();

})();