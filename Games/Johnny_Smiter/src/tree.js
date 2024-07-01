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
		this.root=new Branch([0,this.properties.trunkLength,0]);
		this.root.length=this.properties.initalBranchLength;
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
		clumpMax:0.8,
		clumpMin:0.5,
		lengthFalloffFactor:0.85,
		lengthFalloffPower:1,
		branchFactor:2.0,
		radiusFalloffRate:0.6,
		climbRate:1.5,
		trunkKink:0.00,
		maxRadius:0.25,
		treeSteps:2,
		taperRate:0.95,
		twistRate:13,
		segments:6,
		levels:3,
		sweepAmount:0,
		initalBranchLength:0.85,
		trunkLength:2.5,
		dropAmount: 0.0,
		growAmount: 0.0,
		vMultiplier:0.2,
		twigScale:2.0,
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
		var segments=this.properties.segments;
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
			var segOffset=Math.round((angle/Math.PI/2*segments));
			for(var i=0;i<segments;i++){			
				var v1=branch.ring0[i];
				var v2=branch.root[(i+segOffset+1)%segments];
				var v3=branch.root[(i+segOffset)%segments];
				var v4=branch.ring0[(i+1)%segments];
				
				faces.push([v1,v4,v3]);
				faces.push([v4,v2,v3]);
				UV[(i+segOffset)%segments]=[Math.abs(i/segments-0.5)*2,0];
				var len=length(subVec(verts[branch.ring0[i]],verts[branch.root[(i+segOffset)%segments]]))*this.properties.vMultiplier;
				UV[branch.ring0[i]]=[Math.abs(i/segments-0.5)*2,len];
				UV[branch.ring2[i]]=[Math.abs(i/segments-0.5)*2,len];
			}
		}
		
		if(branch.child0.ring0){
			var segOffset0,segOffset1;
			var match0,match1;
			
			var v1=normalize(subVec(verts[branch.ring1[0]],branch.head));
			var v2=normalize(subVec(verts[branch.ring2[0]],branch.head));
			
			v1=scaleInDirection(v1,normalize(subVec(branch.child0.head,branch.head)),0);
			v2=scaleInDirection(v2,normalize(subVec(branch.child1.head,branch.head)),0);
			
			for(var i=0;i<segments;i++){
				var d=normalize(subVec(verts[branch.child0.ring0[i]],branch.child0.head));
				var l=dot(d,v1);
				if(segOffset0==undefined || l>match0){
					match0=l;
					segOffset0=segments-i;
				}
				var d=normalize(subVec(verts[branch.child1.ring0[i]],branch.child1.head));
				var l=dot(d,v2);
				if(segOffset1==undefined || l>match1){
					match1=l;
					segOffset1=segments-i;
				}
			}
			
			var UVScale=this.properties.maxRadius/branch.radius;			

			
			for(var i=0;i<segments;i++){
				var v1=branch.child0.ring0[i];
				var v2=branch.ring1[(i+segOffset0+1)%segments];
				var v3=branch.ring1[(i+segOffset0)%segments];
				var v4=branch.child0.ring0[(i+1)%segments];
				faces.push([v1,v4,v3]);
				faces.push([v4,v2,v3]);
				v1=branch.child1.ring0[i];
				v2=branch.ring2[(i+segOffset1+1)%segments];
				v3=branch.ring2[(i+segOffset1)%segments];
				v4=branch.child1.ring0[(i+1)%segments];
				faces.push([v1,v2,v3]);
				faces.push([v1,v4,v2]);
				
				var len1=length(subVec(verts[branch.child0.ring0[i]],verts[branch.ring1[(i+segOffset0)%segments]]))*UVScale;
				var uv1=UV[branch.ring1[(i+segOffset0-1)%segments]];
				
				UV[branch.child0.ring0[i]]=[uv1[0],uv1[1]+len1*this.properties.vMultiplier];
				UV[branch.child0.ring2[i]]=[uv1[0],uv1[1]+len1*this.properties.vMultiplier];
				
				var len2=length(subVec(verts[branch.child1.ring0[i]],verts[branch.ring2[(i+segOffset1)%segments]]))*UVScale;
				var uv2=UV[branch.ring2[(i+segOffset1-1)%segments]];
				
				UV[branch.child1.ring0[i]]=[uv2[0],uv2[1]+len2*this.properties.vMultiplier];
				UV[branch.child1.ring2[i]]=[uv2[0],uv2[1]+len2*this.properties.vMultiplier];
			}

			this.doFaces(branch.child0);
			this.doFaces(branch.child1);
		}else{
			for(var i=0;i<segments;i++){
				faces.push([branch.child0.end,branch.ring1[(i+1)%segments],branch.ring1[i]]);
				faces.push([branch.child1.end,branch.ring2[(i+1)%segments],branch.ring2[i]]);
				
				
				var len=length(subVec(verts[branch.child0.end],verts[branch.ring1[i]]));
				UV[branch.child0.end]=[Math.abs(i/segments-1-0.5)*2,len*this.properties.vMultiplier];
				var len=length(subVec(verts[branch.child1.end],verts[branch.ring2[i]]));
				UV[branch.child1.end]=[Math.abs(i/segments-0.5)*2,len*this.properties.vMultiplier];
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
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.twigScale)),scaleVec(binormal,this.properties.twigScale*2-branch.length)));
			var vert2=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.twigScale)),scaleVec(binormal,this.properties.twigScale*2-branch.length)));
			var vert3=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.twigScale)),scaleVec(binormal,-branch.length)));
			var vert4=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.twigScale)),scaleVec(binormal,-branch.length)));
			
			var vert8=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.twigScale)),scaleVec(binormal,this.properties.twigScale*2-branch.length)));
			var vert7=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.twigScale)),scaleVec(binormal,this.properties.twigScale*2-branch.length)));
			var vert6=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,-this.properties.twigScale)),scaleVec(binormal,-branch.length)));
			var vert5=vertsTwig.length;
			vertsTwig.push(addVec(addVec(branch.head,scaleVec(tangent,this.properties.twigScale)),scaleVec(binormal,-branch.length)));
			
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
		if(!radius) radius=this.properties.maxRadius;
		
		
		branch.radius=radius;
		
		if(radius>branch.length) radius=branch.length;
		
		var verts=this.verts;
		var segments=this.properties.segments;
		
		var segmentAngle=Math.PI*2/segments;
			
		if(!branch.parent){
			//create the root of the tree
			branch.root=[];
			var axis=[0,1,0];
			for(var i=0;i<segments;i++){
				var vec=vecAxisAngle([-1,0,0],axis,-segmentAngle*i);
				branch.root.push(verts.length);
				verts.push(scaleVec(vec,radius/this.properties.radiusFalloffRate));
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
			var centerloc=addVec(branch.head,scaleVec(dir,-this.properties.maxRadius/2));



			var ring0=branch.ring0=[];
			var ring1=branch.ring1=[];
			var ring2=branch.ring2=[];
			
			var scale=this.properties.radiusFalloffRate;
			
			if(branch.child0.type=="trunk" || branch.type=="trunk") {
				scale=1/this.properties.taperRate;
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
			for(var i=1;i<segments/2;i++){
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
			for(var i=segments/2+1;i<segments;i++){
				var vec=vecAxisAngle(tangent,axis1,segmentAngle*i);
				ring0.push(verts.length);
				ring1.push(verts.length);
				verts.push(addVec(centerloc,scaleVec(vec,radius*scale)));

			}
			ring1.push(linch0);
			ring2.push(linch1);
			var start=verts.length-1;
			for(var i=1;i<segments/2;i++){
				var vec=vecAxisAngle(tangent,axis3,segmentAngle*i);
				ring1.push(start+i);
				ring2.push(start+(segments/2-i));
				var v=scaleVec(vec,radius*scale);
				verts.push(addVec(centerloc,v));
			}
			
			//child radius is related to the brans direction and the length of the branch
			var length0=length(subVec(branch.head,branch.child0.head));
			var length1=length(subVec(branch.head,branch.child1.head));
			
			var radius0=1*radius*this.properties.radiusFalloffRate;
			var radius1=1*radius*this.properties.radiusFalloffRate;
			if(branch.child0.type=="trunk") radius0=radius*this.properties.taperRate;
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
		var s=properties.branchFactor*dot(v,vec);
		return [vec[0]-v[0]*s,vec[1]-v[1]*s,vec[2]-v[2]*s];
	};
	Branch.prototype.split=function(level,steps,properties,l1,l2){
		if(l1==undefined) l1=1;
		if(l2==undefined) l2=1;
		if(level==undefined) level=properties.levels;
		if(steps==undefined) steps=properties.treeSteps;
		var rLevel=properties.levels-level;
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
		var clumpmax=properties.clumpMax;
		var clumpmin=properties.clumpMin;
		
		var adj=addVec(scaleVec(normal,r),scaleVec(tangent,1-r));
		if(r>0.5) adj=scaleVec(adj,-1);
		
		var clump=(clumpmax-clumpmin)*r+clumpmin
		var newdir=normalize(addVec(scaleVec(adj,1-clump),scaleVec(dir,clump)));
			
		
		var newdir2=this.mirrorBranch(newdir,dir,properties);
		if(r>0.5){
			var tmp=newdir;
			newdir=newdir2;
			newdir2=tmp;
		}
		if(steps>0){
			var angle=steps/properties.treeSteps*2*Math.PI*properties.twistRate;
			newdir2=normalize([Math.sin(angle),r,Math.cos(angle)]);
		}
		
		var growAmount=level*level/(properties.levels*properties.levels)*properties.growAmount;
		var dropAmount=rLevel*properties.dropAmount
		var sweepAmount=rLevel*properties.sweepAmount;
		newdir=normalize(addVec(newdir,[sweepAmount,dropAmount+growAmount,0]));
		newdir2=normalize(addVec(newdir2,[sweepAmount,dropAmount+growAmount,0]));
		
		var head0=addVec(so,scaleVec(newdir,this.length));
		var head1=addVec(so,scaleVec(newdir2,this.length));
		this.child0=new Branch(head0,this);
		this.child1=new Branch(head1,this);
		this.child0.length=Math.pow(this.length,properties.lengthFalloffPower)*properties.lengthFalloffFactor;
		this.child1.length=Math.pow(this.length,properties.lengthFalloffPower)*properties.lengthFalloffFactor;
		if(level>0){
			if(steps>0){
				this.child0.head=addVec(this.head,[(r-0.5)*2*properties.trunkKink,properties.climbRate,(r-0.5)*2*properties.trunkKink]);
				this.child0.type="trunk";
				this.child0.length=this.length*properties.taperRate;
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