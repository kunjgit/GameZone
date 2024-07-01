
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




var canvas=document.getElementById("canvas");
canvas.width=800;
canvas.height=window.innerHeight/window.innerWidth*800
var gl=GLInit(canvas);
gl.cullFace(gl.BACK);
gl.enable(gl.CULL_FACE); 
gl.blendFunc(gl["SRC_ALPHA"],gl["ONE"]);

var tree=new Tree({"seed":152,
"segments":6,
"levels":5,
"vMultiplier":1.16,
"twigScale":0.44,
"initalBranchLength":0.49,
"lengthFalloffFactor":0.85,
"lengthFalloffPower":0.99,
"clumpMax":0.454,
"clumpMin":0.246,
"branchFactor":3.2,
"dropAmount":0.09,
"growAmount":0.235,
"sweepAmount":0.01,
"maxRadius":0.114,
"climbRate":0.41,
"trunkKink":0,
"treeSteps":5,
"taperRate":0.835,
"radiusFalloffRate":0.73,
"twistRate":2.06,
"trunkLength":2.5,
"trunkMaterial":"TrunkType3",
"twigMaterial":"BranchType2"});

var tree2=new Tree({"seed":499,
"segments":8,
"levels":5,
"vMultiplier":1,
"twigScale":0.48,
"initalBranchLength":0.5,
"lengthFalloffFactor":0.98,
"lengthFalloffPower":1.08,
"clumpMax":0.414,
"clumpMin":0.282,
"branchFactor":2.2,
"dropAmount":0.24,
"growAmount":0.044,
"sweepAmount":0,
"maxRadius":0.096,
"climbRate":0.39,
"trunkKink":0,
"treeSteps":5,
"taperRate":0.958,
"radiusFalloffRate":0.71,
"twistRate":2.97,
"trunkLength":1.95,
"trunkMaterial":"TrunkType3",
"twigMaterial":"BranchType3"});

var processTreeData=function(tree){
	var data=[];
	var len=tree.verts.length;
	for(var i=0;i<len;i++){
		data.push(tree.verts[i][0]);
		data.push(tree.verts[i][1]);
		data.push(tree.verts[i][2]);
		data.push(tree.normals[i][0]);
		data.push(tree.normals[i][1]);
		data.push(tree.normals[i][2]);
		data.push(tree.UV[i][0]);
		data.push(tree.UV[i][1]);
	}
	var faces=[];
	for(var i=0;i<tree.faces.length;i++){
		faces.push(tree.faces[i][0]);
		faces.push(tree.faces[i][1]);
		faces.push(tree.faces[i][2]);
	}


	var start=data.length/8;
	
	var datatwig=[];
	var len=tree.vertsTwig.length;
	for(var i=0;i<len;i++){
		data.push(tree.vertsTwig[i][0]);
		data.push(tree.vertsTwig[i][1]);
		data.push(tree.vertsTwig[i][2]);
		data.push(tree.normalsTwig[i][0]);
		data.push(tree.normalsTwig[i][1]);
		data.push(tree.normalsTwig[i][2]);
		data.push(tree.uvsTwig[i][0]+50);
		data.push(tree.uvsTwig[i][1]);
	}
	//var facestwig=[];
	for(var i=0;i<tree.facesTwig.length;i++){
		faces.push(tree.facesTwig[i][0]+start);
		faces.push(tree.facesTwig[i][1]+start);
		faces.push(tree.facesTwig[i][2]+start);
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
	blurLevels: 2,
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
	blurLevels: 3,
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
	blurLevels: 3,
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
	blurLevels: 3,
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

function startGame(){
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
Spear.prototype.throw=function(){
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
			spear.throw();
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