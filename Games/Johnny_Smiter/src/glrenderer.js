
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
 
	if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
		return null;
	}
	
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
