function SfxrP(){this.set=function(a){for(var b=0;b<24;b++)this[String.fromCharCode(97+b)]=a[b]||0;this.c<.01&&(this.c=.01);var c=this.b+this.c+this.e;if(c<.18){var d=.18/c;this.b*=d,this.c*=d,this.e*=d}}}function sy(){this._p=new SfxrP;var a,b,c,d,e,f,g,h,i,j,k,l;this.reset=function(){var a=this._p;d=100/(a.f*a.f+.001),e=100/(a.g*a.g+.001),f=1-a.h*a.h*a.h*.01,g=-a.i*a.i*a.i*1e-6,a.a||(k=.5-a.n/2,l=5e-5*-a.o),h=1+a.l*a.l*(a.l>0?-.9:10),i=0,j=1==a.m?0:(1-a.m)*(1-a.m)*2e4+32},this.totalReset=function(){this.reset();var d=this._p;return a=d.b*d.b*1e5,b=d.c*d.c*1e5,c=d.e*d.e*1e5+12,3*((a+b+c)/3|0)},this.sW=function(m,n){var o=this._p,p=1!=o.s||o.v,q=o.v*o.v*.1,r=1+3e-4*o.w,s=o.s*o.s*o.s*.1,t=1+1e-4*o.t,u=1!=o.s,v=o.x*o.x,w=o.g,x=o.q||o.r,y=o.r*o.r*o.r*.2,z=o.q*o.q*(o.q<0?-1020:1020),A=o.p?((1-o.p)*(1-o.p)*2e4|0)+32:0,B=o.d,C=o.j/2,D=o.k*o.k*.01,E=o.a,F=a,G=1/a,H=1/b,I=1/c,J=5/(1+o.u*o.u*20)*(.01+s);J>.8&&(J=.8),J=1-J;for(var Q,S,U,W,Y,Z,K=!1,L=0,M=0,N=0,O=0,P=0,R=0,T=0,V=0,X=0,$=0,_=new Array(1024),aa=new Array(32),ba=_.length;ba--;)_[ba]=0;for(var ba=aa.length;ba--;)aa[ba]=2*Math.random()-1;for(var ba=0;ba<n;ba++){if(K)return ba;if(A&&++X>=A&&(X=0,this.reset()),j&&++i>=j&&(j=0,d*=h),f+=g,d*=f,d>e&&(d=e,w>0&&(K=!0)),S=d,C>0&&($+=D,S*=1+Math.sin($)*C),S|=0,S<8&&(S=8),E||(k+=l,k<0?k=0:k>.5&&(k=.5)),++M>F)switch(M=0,++L){case 1:F=b;break;case 2:F=c}switch(L){case 0:N=M*G;break;case 1:N=1+2*(1-M*H)*B;break;case 2:N=1-M*I;break;case 3:N=0,K=!0}x&&(z+=y,U=0|z,U<0?U=-U:U>1023&&(U=1023)),p&&r&&(q*=r,q<1e-5?q=1e-5:q>.1&&(q=.1)),Z=0;for(var ca=8;ca--;){if(T++,T>=S&&(T%=S,3==E))for(var da=aa.length;da--;)aa[da]=2*Math.random()-1;switch(E){case 0:Y=T/S<k?.5:-.5;break;case 1:Y=1-T/S*2;break;case 2:W=T/S,W=6.28318531*(W>.5?W-1:W),Y=1.27323954*W+.405284735*W*W*(W<0?1:-1),Y=.225*((Y<0?-1:1)*Y*Y-Y)+Y;break;case 3:Y=aa[Math.abs(32*T/S|0)]}p&&(Q=R,s*=t,s<0?s=0:s>.1&&(s=.1),u?(P+=(Y-R)*s,P*=J):(R=Y,P=0),R+=P,O+=R-Q,O*=1-q,Y=O),x&&(_[V%1024]=Y,Y+=_[(V-U+1024)%1024],V++),Z+=Y}Z*=.125*N*v,m[ba]=Z>=1?1:Z<=-1?-1:Z}return n}}var synth=new sy;window.jsfxr=function(a){window._audioContext=window._audioContext||new AudioContext;var b=window._audioContext;synth._p.set(a);var c=synth.totalReset(),d=c+1>>1<<1,e=b.createBuffer(1,d,b.sampleRate),f=e.getChannelData(0);2*synth.sW(f,c);return e},window.playSound=function(n){if(!sound){return;}jsfxr(n);var o=window._audioContext,e=o.createBufferSource();e.buffer=jsfxr(n),e.loop=!1,e.connect(o.destination),e.start(o.currentTime);return [e.buffer,o,e]};
										
glMatrixArrayType="undefined"!=typeof Float32Array?Float32Array:"undefined"!=typeof WebGLFloatArray?WebGLFloatArray:Array;var mat3={};mat3.create=function(r){var t=new glMatrixArrayType(9);return r&&(t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9]),t},mat3.transpose=function(r,t){if(!t||r==t){var a=r[1],n=r[2],e=r[5];return r[1]=r[3],r[2]=r[6],r[3]=a,r[5]=r[7],r[6]=n,r[7]=e,r}return t[0]=r[0],t[1]=r[3],t[2]=r[6],t[3]=r[1],t[4]=r[4],t[5]=r[7],t[6]=r[2],t[7]=r[5],t[8]=r[8],t};var mat4={};mat4.create=function(r){var t=new glMatrixArrayType(16);return r&&(t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15]),t},mat4.identity=function(r){return r[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=1,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r},mat4.toInverseMat3=function(r,t){var a=r[0],n=r[1],e=r[2],u=r[4],i=r[5],o=r[6],f=r[8],m=r[9],c=r[10],v=c*i-o*m,y=-c*u+o*f,l=m*u-i*f,s=a*v+n*y+e*l;return s?(s=1/s,t||(t=mat3.create()),t[0]=v*s,t[1]=(-c*n+e*m)*s,t[2]=(o*n-e*i)*s,t[3]=y*s,t[4]=(c*a-e*f)*s,t[5]=(-o*a+e*u)*s,t[6]=l*s,t[7]=(-m*a+n*f)*s,t[8]=(i*a-n*u)*s,t):null},mat4.translate=function(r,t,a){var n=t[0],e=t[1];if(t=t[2],!a||r==a)return r[12]=r[0]*n+r[4]*e+r[8]*t+r[12],r[13]=r[1]*n+r[5]*e+r[9]*t+r[13],r[14]=r[2]*n+r[6]*e+r[10]*t+r[14],r[15]=r[3]*n+r[7]*e+r[11]*t+r[15],r;var u=r[0],i=r[1],o=r[2],f=r[3],m=r[4],c=r[5],v=r[6],y=r[7],l=r[8],s=r[9],M=r[10],p=r[11];return a[0]=u,a[1]=i,a[2]=o,a[3]=f,a[4]=m,a[5]=c,a[6]=v,a[7]=y,a[8]=l,a[9]=s,a[10]=M,a[11]=p,a[12]=u*n+m*e+l*t+r[12],a[13]=i*n+c*e+s*t+r[13],a[14]=o*n+v*e+M*t+r[14],a[15]=f*n+y*e+p*t+r[15],a},mat4.rotate=function(r,t,a,n){var e=a[0],u=a[1];a=a[2];var i=Math.sqrt(e*e+u*u+a*a);if(!i)return null;1!=i&&(e*=i=1/i,u*=i,a*=i);var o=Math.sin(t),f=Math.cos(t),m=1-f;t=r[0],i=r[1];var c=r[2],v=r[3],y=r[4],l=r[5],s=r[6],M=r[7],p=r[8],A=r[9],d=r[10],h=r[11],F=e*e*m+f,g=u*e*m+a*o,x=a*e*m-u*o,T=e*u*m-a*o,b=u*u*m+f,w=a*u*m+e*o,G=e*a*m+u*o;return e=u*a*m-e*o,u=a*a*m+f,n?r!=n&&(n[12]=r[12],n[13]=r[13],n[14]=r[14],n[15]=r[15]):n=r,n[0]=t*F+y*g+p*x,n[1]=i*F+l*g+A*x,n[2]=c*F+s*g+d*x,n[3]=v*F+M*g+h*x,n[4]=t*T+y*b+p*w,n[5]=i*T+l*b+A*w,n[6]=c*T+s*b+d*w,n[7]=v*T+M*b+h*w,n[8]=t*G+y*e+p*u,n[9]=i*G+l*e+A*u,n[10]=c*G+s*e+d*u,n[11]=v*G+M*e+h*u,n},mat4.frustum=function(r,t,a,n,e,u,i){i||(i=mat4.create());var o=t-r,f=n-a,m=u-e;return i[0]=2*e/o,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=2*e/f,i[6]=0,i[7]=0,i[8]=(t+r)/o,i[9]=(n+a)/f,i[10]=-(u+e)/m,i[11]=-1,i[12]=0,i[13]=0,i[14]=-u*e*2/m,i[15]=0,i},mat4.perspective=function(r,t,a,n,e){return r=a*Math.tan(r*Math.PI/360),t*=r,mat4.frustum(-t,t,-r,r,a,n,e)};

var sound = 1;
var font = [];
//font[0] = "111101101101111";
font[0] = "01110100011001110101110011000101110";
//font[1] = "010110010010111";
font[1] = "00100011000010000100001000010001110";

//font[2] = "111001111100111";
font[2] = "01110100010000100110010001000011111";
//font[3] = "111001111001111";
font[3] = "01110100010000100110000011000101110";
//font[4] = "101101111001001";
font[4] = "00010001100101010010111110001000010";
//font[5] = "111100111001111";
font[5] = "11111100001111000001000011000101110";
//font[6] = "111100111101111";
font[6] = "00110010001000011110100011000101110";
//font[7] = "111001010010010";
font[7] = "11111000010001000100010000100001000";
//font[8] = "111101111101111";
font[8] = "01110100011000101110100011000101110";
//font[9] = "111101111001111";
font[9] = "01110100011000101111000010001001100";
//font["A"] = "111101111101101";
font["A"] = "00100010101000110001111111000110001";

//font["B"] = "110101110101110";
font["B"] = "11110010010100101110010010100111110";
font["C"] = "01110100011000010000100001000101110";
font["D"] = "11110010010100101001010010100111110";
//font["E"] = "111100110100111";
font["E"] = "11111100001000011110100001000011111";
font["F"] = "11111100001000011110100001000010000";
//font["G"] = "111100101101111";
font["G"] = "01110100011000010011100011000101111";
font["H"] = "10001100011000111111100011000110001";
font["I"] = "01110001000010000100001000010001110";
font["J"] = "00111000100010000100001001001001100";
font["K"] = "10001100101010011000101001001010001";
font["L"] = "10000100001000010000100001000011111";
font["M"] = "10001110111010110101100011000110001";
font["N"] = "10001100011100110101100111000110001";
font["O"] = "01110100011000110001100011000101110";
font["P"] = "11110100011000111110100001000010000";
font["Q"] = "01110100011000110001101011001001101";
font["R"] = "11110100011000111110101001001010001";
//font["S"] = "111100111001111";
font["S"] = "01110100011000001110000011000101110";
//font["T"] = "111010010010010";
font["T"] = "11111001000010000100001000010000100";
font["U"] = "10001100011000110001100011000101110";
font["V"] = "10001100011000110001100010101000100";
font["W"] = "10001100011000110101101011010101010";
font["X"] = "10001100010101000100010101000110001";
font["Y"] = "10001100011000101010001000010000100";
font["Z"] = "11111000010001000100010001000011111";
font["-"] = "00000000000000011111000000000000000";
//font[":"] = "000010000010000";
font["."] = "00000000000000000000000000011000110";
font[","] = "00000000000000000000000110000100010";
//font["'"] = "001010000000000";
//font["?"] = "010101001010010";
//font["+"] = "000010111010000";
//font["="] = "000111000111000";
font["!"] = "00100001000010000100001000000000100";
font["("] = "00010001000100001000010000010000010";
font[")"] = "00100000100000100001000010001000100";

var speedZ = frame = totalMove =0;
var gl, shaderProgram, shaderProgramLava, ctx, mur, red, portal, textureDoor, textureKey;
var moveF = moveB = moveL = moveR = false;
var UVW = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var lights = new Float32Array([
	0,0,0,0,
	5,-5,2,2
]);
var lightsDisplayed = [];
var nbMoves = nbMovesAtStart = 0;
var tilesColors = {length:0};
var cubeVertexIndexBuffer;
var sphereVertexIndexBuffer;
var coordBuffer = [];
var UVWBuffer = [];

var players = [];
var selectedPlayer = 0;
var vitesseRotation = 10;

var canvas2;
var canvasHUD;
var GAME,camera,triggers,level;
var levels;
var fov = 45;
var levelEnCours = 1;
var levelDrawing = false;
var levelExplode = false;
var zoomOn = false;
function drawText(posX, posY, text, scale) {
	var aa = ['#000','#FFF'];
	scale/=2;
	for (var j=0; j<aa.length; j++) {
		ctx.fillStyle = aa[j];
		j!=0 ? posX-=2 : 0;
		j!=0 ? posY-=2 : 0;
		
		ctx.lineWidth=0.5;
		ctx.strokeStyle="#000";
		var pX = posX;
		var pY = posY;
		for (var i=0; i<text.length; i++) {
			var index = 0;
			if (text[i]=="&") { 
				pX = posX;
				pY+=2*scale*12;
				continue
			}
			for (y=0; y<7; y++) {
				for (x=0; x<5; x++) {
					if (waitingKeyStart) {
						decalY = Math.cos((frame+y+x+posY)/32)*5
					} else {
						decalY = 0;
					}
					if (text[i]==" ") { continue; }
					if (font[text[i]][index]!="0") {
						ctx.fillRect(pX+x*2*scale, pY+y*2*scale + decalY, 3*scale, 3*scale); //1.8 à la place de 3 pour des carrés
					}
					index++;
				}
			}
			pX += 12*scale;
		}
	}
}
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	//if (!shaderScript) { return null; }

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(shaderScript.type+gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function initShaders() {
	var vertexShader = getShader(gl, "shader-vs");
	var fs = getShader(gl, "shader-fs");
	var fsL = getShader(gl, "lava-fs");
	var shaders = [["shaderProgram", fs],["shaderProgramLava", fsL]];

	for (var i=0; i<shaders.length; i++) {
		//var sh = shaders[i];
		s = gl.createProgram();
		gl.attachShader(s, vertexShader);
		gl.attachShader(s, shaders[i][1]);
		gl.linkProgram(s);

		/*if (!gl.getProgramParameter(s, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}*/

		gl.useProgram(s);
		s.vertexPositionAttribute = gl.getAttribLocation(s, "avp");
		gl.enableVertexAttribArray(s.vertexPositionAttribute);
		s.textureCoordAttribute = gl.getAttribLocation(s, "aTextureCoord");
		gl.enableVertexAttribArray(s.textureCoordAttribute);
		s.it = gl.getUniformLocation(s, "it");
		s.res = gl.getUniformLocation(s, "res");
		s.pMatrixUniform = gl.getUniformLocation(s, "uPMatrix");
		s.mvMatrixUniform = gl.getUniformLocation(s, "uMVMatrix");
		s.samplerUniform = gl.getUniformLocation(s, "uSampler");
		s.cp = gl.getUniformLocation(s, "cp");
		s.lights = gl.getUniformLocation(s, "lights");
		s.nbLights = gl.getUniformLocation(s, "nbLights");
		s.cubeFace = gl.getUniformLocation(s, "cubeFace");
		s.isPlayer = gl.getUniformLocation(s, "isPlayer");
		s.isCurrentPlayer = gl.getUniformLocation(s, "isCurrentPlayer");
		s.ac = gl.getUniformLocation(s, "ac");
		window[shaders[i][0]] = s;
	}
	initBuffers();
}

function setTextureParams(texture) {
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
}

function handleLoadedTexture(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setTextureParams(texture.image);
}
function handleLoadedTextureFromCanvas(name, textureCanvas) {
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setTextureParams(textureCanvas);
	//gl.bindTexture(gl.TEXTURE_2D, null);
	window[name] = texture;
}
function handleLoadedTextureFromCanvasTiles(name, textureCanvas) {
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setTextureParams(textureCanvas);
	//gl.bindTexture(gl.TEXTURE_2D, null);
	tilesColors[name] = texture;
	tilesColors.length++;
}
function initTexture() {
	crate = gl.createTexture();
	crate.image = new Image();
	crate.image.onload = function () { handleLoadedTexture(crate) }
	crate.image.src = "crate.png";
}

function degToRad(d) {
	return d * Math.PI / 180;
}
/*
getSphere = function(radius) {
	var latitudeBands = 30;
        var longitudeBands = 30;
        //var radius = 2;
	var vertexPositionData = [];
	for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			vertexPositionData.push(radius * x);
			vertexPositionData.push(radius * y);
			vertexPositionData.push(radius * z);
		}
	}
	return vertexPositionData;
}
*/

getP = function(x, y, d) {
	x/=2;
	y/=2;
	return [
		-x, -y, d*2,
		x, -y, d*2,
		x, y, d*2,
		-x, y, d*2,
		-x, -y, 0,
		-x, y, 0,
		x, y, 0,
		x, -y, 0,
		-x, y, 0,
		-x, y, d*2,
		x, y, d*2,
		x, y, 0,
		-x, -y, 0,
		x, -y, 0,
		x, -y, d*2,
		-x, -y, d*2,
		x, -y, 0,
		x, y, 0,
		x, y, d*2,
		x, -y, d*2,
		-x, -y, 0,
		-x, -y, d*2,
		-x, y, d*2,
		-x, y, 0
	];
}
getCube = function(d) {
	return getP(2,2,d);
}

getUVW = function(type, h) {
	if (UVW[type] && UVW[type][h]) {
		return UVW[type][h];
	} else if (!UVW[type]) {
		UVW[type] = [];
	}
	var data = [
		0,0,
		1,0,
		1,1,
		0,1,

		0,1,
		0,0,
		1,0,
		1,1,

		0,h,
		0,0,
		1,0,
		1,h,

		0,0,
		1,0,
		1,h,
		0,h,

		0,0,
		1,0,
		1,h,
		0,h,

		1,0,
		1,h,
		0,h,
		0,0,
	];
	UVW[type][h] = data;
	return data;
	/*switch (type) {
		case "block2": //Seulement si c'est une sphere
			var latitudeBands = 30;
			var longitudeBands = 30;
			var textureCoordData = [];
			for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
			    for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
				var u = 1 - (longNumber / longitudeBands);
				var v = 1 - (latNumber / latitudeBands);
				textureCoordData.push(u);
				textureCoordData.push(v);
			    }
			}
			UVW[type][h] = textureCoordData;
			return UVW[type][h];
		default:
			//h *= 2;
			
	}*/
}

function initBuffers() {	
	//Create faceindex of cube
	cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	/*var cubeVertexIndices = [
	    0, 1, 2,      0, 2, 3,    // Front face
	    4, 5, 6,      4, 6, 7,    // Back face
	    8, 9, 10,     8, 10, 11,  // Top face
	    12, 13, 14,   12, 14, 15, // Bottom face
	    16, 17, 18,   16, 18, 19, // Right face
	    20, 21, 22,   20, 22, 23  // Left face
	];*/
	var cubeVertexIndices = [0,1,2,0,2,3];
	for (var i=6; i<36; i++) {
		cubeVertexIndices.push(cubeVertexIndices[i-6]+4);
	}
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cubeVertexIndexBuffer.itemSize = 1;
	cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;
	
	/*//Create faceindex of sphere
	var latitudeBands = 30;
        var longitudeBands = 30;
	var indexData = [];
        for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }
	sphereVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	sphereVertexIndexBuffer.itemSize = 1;
	sphereVertexIndexBuffer.numItems = indexData.length;*/
}


getCoord = function(type, height, cube) {
	if (!coordBuffer[type]) {
		coordBuffer[type] = [];
	}
	if (!coordBuffer[type][height]) {
		coordBuffer[type][height] =  gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer[type][height]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW);
		coordBuffer[type][height].itemSize = 3;
		coordBuffer[type][height].numItems = cube.length / 3;
	}
	return coordBuffer[type][height];
}
getUVWBuffer = function(type, height) {
	if (!UVWBuffer[type]) {
		UVWBuffer[type] = [];
	}
	if (!UVWBuffer[type][height]) {
		var data = new Float32Array(getUVW(type, height));
		UVWBuffer[type][height] =  gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, UVWBuffer[type][height]);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		UVWBuffer[type][height].itemSize = 2;
		UVWBuffer[type][height].numItems = data.length / 2;
	}
	return UVWBuffer[type][height];
}

drawCube = function(obj) {
	var x = obj.x;
	var y = obj.y;
	var z = obj.z;
	var height = obj.h;
	var type = obj.type;
	var trigger = obj.trigger;
	var decal = obj.decal;
	var rotation = obj.rotation;
	var p = obj.player;
	var selectedPlayer = obj.selectedPlayer;
	var triggered = obj.triggered;
	//var face = obj.face;
	//Get geometry
	switch (type) {
		case "trigger":
			height = 0.2;
			var geometry = getCube(height);
			for (var i=0; i<geometry.length; i++) {
				geometry[i]/=2;
			}
			
			break;
		case "player":
			//J'ai besoin de centrer le centrer de gravité pour les rotations
			var geometry = getCube(height);
			for (var i=0; i<geometry.length; i+=3) {
				geometry[i+2]--;
			}
			break;
		default:
			var geometry = getCube(height);
			break;
	}

	if (obj.geometry) {
		var geometry = getP(obj.geometry.x, obj.geometry.y, obj.geometry.z);
	}
	
	//move and rotate accordinaly to camera
	cam = {
		x:x+camera.x,
		y:y+camera.y,
		z:z+-1.2 - camera.z
	}
	if (decal) {
		cam.x+=decal.x;
		cam.y+=decal.y;
		cam.z+=decal.z;
	}
	
	mat4.identity(mvMatrix);
	mat4.rotate(mvMatrix, degToRad(camera.rotation.z), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(camera.rotation.y), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);
	mat4.translate(mvMatrix, [cam.x, cam.y, cam.z]);
	
	if (type=="ball") {
		mat4.rotate(mvMatrix,  -Math.atan(cam.x/cam.y), [0, 0, 1]); 
		mat4.rotate(mvMatrix, Math.atan((y-cam.y)/(cam.z-z)), [1, 0, 0]); 
		mat4.translate(mvMatrix, [0, 0.5, (Math.sin(frame/50)/4)+0.7]);
		lights[0] = x;
		lights[1] = y;
		lights[2] = z + decal.z;
	}
	
	//rotate player 
	if (type==="player") {
		mat4.translate(mvMatrix, [0, 0, 1]);
		if (p.inMoveY>0) {
			p.rotation.x += degToRad(90/vitesseRotation);
		} else if (p.inMoveY<0) {
			p.rotation.x -= degToRad(90/vitesseRotation);
		}
		
		if (p.inMoveX>0) {
			p.rotation.y += degToRad(90/vitesseRotation);
		} else if (p.inMoveX<0) {
			p.rotation.y -= degToRad(90/vitesseRotation);
		}
		
		mat4.rotate(mvMatrix, p.rotation.x, [1, 0, 0]);
		switch (p.rotation.xD) {
			case 0:
				mat4.rotate(mvMatrix, p.rotation.y, [0, 1, 0]);
				break;
			case 1:
				mat4.rotate(mvMatrix, -p.rotation.y, [0, 0, 1]);
				break;
			case 2:
				mat4.rotate(mvMatrix, -p.rotation.y, [0, 1, 0]);
				break;
			case 3:
				mat4.rotate(mvMatrix, p.rotation.y, [0, 0, 1]);
				break;
		}
	}
	if (rotation) {
		mat4.rotate(mvMatrix, rotation.x, [1, 0, 0]);
		mat4.rotate(mvMatrix, rotation.y, [0, 1, 0]);
		mat4.rotate(mvMatrix, rotation.z, [0, 0, 1]);
	}
	
	//openGL CORE
	//set Shader
	/*switch (type) {
		case "ball":
			var shader = shaderProgramLava;
			break;
		default:
			var shader = shaderProgram;
			break;
			
	}*/
	
	shader = type=="ball" ? shaderProgramLava : shaderProgram;
	
	if (obj.geometry) {
		var shader = shaderProgramLava;
	}
	gl.useProgram(shader);
	gl.uniform3f(shader.cp, x, y, z);
	
	//set UVW buffer
	var buffer = getUVWBuffer(type, height);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(shader.textureCoordAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//set geometry buffer
	buffer = getCoord(type, height, geometry);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(shader.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);

	//set uniforms
	if (lightsDisplayed.length) {
		gl.uniform4fv(shader.lights, lightsDisplayed);
	}
	gl.uniform1i(shader.nbLights, lightsDisplayed.length/4);
	gl.uniform3f(shader.ac, 0.1 ,0.1 ,0.1);
	gl.uniform2f(shader.res, 1920,1000);
	gl.uniform1i(shader.samplerUniform, 0); //Déclare la texture 0 sur uSampler
	gl.uniform1f(shader.it, frame);
	gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shader.mvMatrixUniform, false, mvMatrix);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	
	//draw object		
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(shader.isPlayer, 0);
	gl.uniform1i(shader.cubeFace, 1);
	gl.uniform1i(shader.isCurrentPlayer, 0);
	if (type=="ball") {
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	} else if (type=="block" || type=="block2") {
		if (type=="block2") {
			gl.bindTexture(gl.TEXTURE_2D, tilesColors[22]);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, crate);
		}
		gl.uniform1i(shader.isCurrentPlayer, type=="block2" ? 1 : 0);
		gl.uniform1i(shader.cubeFace, 1);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
		gl.uniform1i(shader.cubeFace, 5);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);  //Face avant
		gl.uniform1i(shader.cubeFace, 6);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36+12); //Droite
		gl.uniform1i(shader.isCurrentPlayer, 0);
	} else if (type=="player") {
		gl.uniform1i(shader.isPlayer, 1);
		gl.uniform1i(shader.isCurrentPlayer, selectedPlayer ? 1 : 0);
		gl.uniform1i(shader.cubeFace, 1);
		//gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
		gl.uniform1i(shader.cubeFace, 5);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);  //Face avant
		gl.uniform1i(shader.cubeFace, 6);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36+12); //Droite
	} else {
		if (type=="trigger") {
			gl.bindTexture(gl.TEXTURE_2D, trigger.color);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, triggered ? tilesColors[21] : tilesColors[(x/2+(-y/2*10))%21]);
		}
		gl.uniform1i(shader.cubeFace, 0);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
											
		if (type!="normal2") {
			gl.bindTexture(gl.TEXTURE_2D, mur);
		}
		gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 12); //Le dessous, je m'en tape
		gl.uniform1i(shader.cubeFace, 5);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);  //Face avant
		gl.uniform1i(shader.cubeFace, 6);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36+12); //Droite
	}
}


move = function(x, y, p) {
	if (p.inMoveX!=0 || p.inMoveY!=0 || p.inMoveZ!=0 || !p.haveControl) {
		return;
	}
	var oldT = level[p.tile.x][p.tile.y];
	if (!level[p.tile.x + x] || !level[p.tile.x + x][p.tile.y + y]) {
		return false;
	}
	var t = level[p.tile.x + x][p.tile.y + y];
	var t2 = false;
	var can = 0;
	var hauteur = (t.h * 2);
	for (var i=0; i<players.length; i++) {
		if ((players[i].tile.x==p.tile.x + x) && (players[i].tile.y==p.tile.y + y)) {
			hauteur++;
		}
	}
	//if (t.o)
	if (hauteur > p.z) { //C'est un mur
		can = 0;
	} else {
		if (oldT.p.length>1 && oldT.p[oldT.p.length-1].z>players[selectedPlayer].z) {
			return 0;
		}
		
		//En tout cas, ce n'est pas un mur qui me bloque
		hauteur+= t.o.length*2;
		if (hauteur - p.z > 2) {
			can = 0;
		} else {
			if (hauteur>p.z) {
				if (hauteur==p.z+2) { //Il y a un seul bloc
					if (t.o[0].type==2 && t.o.length==1) { //Ok c'est un bloc grimpable
						can = 1;
					}
				}
				if (!can) {
					//Il y a un object
					//Je regarde si je peux le pousser
					//Je peux le pousser si la case suivante à la même hauteur additionné des objects déjà posé ne dépasse pas la hauteur actuel
					if (!level[p.tile.x + x + x] || !level[p.tile.x + x + x][p.tile.y + y + y]) {
						return false;
					}
					var t2 = level[p.tile.x + x + x][p.tile.y + y + y];

					if (t2.h*2 + t2.o.length*2 > p.z) {
						can = 0;
					} else {
						//Bon la caisse peut y aller
						can = 1;
						t2.o.push(t.o[t.o.length-1]);
						t.o.pop();
						t2.o[t2.o.length-1].inMoveX = x * vitesseRotation;
						t2.o[t2.o.length-1].inMoveY = y * vitesseRotation;
					}
				}
			} else {
				can = 1;
			}
		}
	}
	
	if (can) {
		level[p.tile.x][p.tile.y].p.pop();
		p.inMoveX = x*vitesseRotation+(x ? (x>0 ? 1 : -1) : 0);
		p.inMoveY = y*vitesseRotation+(y ? (y>0 ? 1 : -1) : 0);
		p.tile.x += x;
		p.tile.y += y;
		level[p.tile.x][p.tile.y].p.push(p);
	}
	
	if (can && t2 && t2.t) {
		actionTrigger(t2.t, true);
	}
	if (can && oldT.t && !oldT.o.length) {
		actionTrigger(oldT.t, false);
	}
	if (can && t.t && !t.o.length) {
		actionTrigger(t.t, true);
	}
	nbMoves+= can;
	if (can) {
		playSound([0,,0.047,0.5711,0.1329,0.8391,,,,,,,,,,,,,1,,,,,0.5]);
	}
	return can;
}
actionTrigger = function(t, state) {
	if (t.state==state) { return; }
	t.state = state;
	if (t.action) { t.action(); }
	switch (t.type) {
		case 1:
			if (!state) {
				return;
			}
		case 2:
			for (var i=0; i<t.on.length; i++) {
				var tl = t.on[i]
				level[tl[0]][tl[1]].nb+=state ? 1 : -1;
				if (state===false && level[tl[0]][tl[1]].nb>0) { continue ; }
				switchTileHeight(tl[0], tl[1], tl[2], tl[3], state);
			}
			break;
		case 3:
			for (var i=0; i<t.on.length; i++) {
				var tl = t.on[i]
				switchTileHeight(tl[0], tl[1], state ? tl[2] : -tl[2], null, state);
			}
			break;
	}
}
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, 0.001, 100, pMatrix);
	mat4.identity(mvMatrix);
	blocksInMove = false;
	if (levelExplode) {
		levelExplodeSince--;
	}
	var p = players[selectedPlayer];
	if (p) {
		if (p.inMoveX==1 || p.inMoveX==-1) { p.inMoveX=0; }
		if (p.inMoveY==1 || p.inMoveY==-1) { p.inMoveY=0; }
		
		if (moveF) {
			if (move(0,1,p)) {
				p.rotation.xD = (p.rotation.xD+1) % 4;
			}
		}
		if (moveB) {
			if (move(0,-1,p)) {
				p.rotation.xD --;
				if (p.rotation.xD==-1) { p.rotation.xD=3; };
			}
		}
		if (moveR) {
			move(1, 0, p);
		}
		if (moveL) {
			move(-1, 0, p);
		}
		
		if (p.inMoveY>0) {
			p.y += -(1/(vitesseRotation/2));
			p.inMoveY--;
		} else if (p.inMoveY<0) {
			p.y -= -(1/(vitesseRotation/2));
			p.inMoveY++;
		}

		if (p.inMoveX>0) {
			p.x += (1/(vitesseRotation/2));
			p.inMoveX--;
		} else if (p.inMoveX<0) {
			p.x -= (1/(vitesseRotation/2));
			p.inMoveX++;
		}
	}
	/*var target = zoomOn ? zoomOn : (p ? -p : false);
	if (target!==false) {
		camera.x-= (camera.x-(-target.x))/10;
		camera.y-= (camera.y-(target.y+10))/10;
		camera.z-= (camera.z-(target.z+20))/10;
	}*/
		
	if (zoomOn) {
		camera.x-= (camera.x-(-zoomOn.x))/10;
		camera.y-= (camera.y-(zoomOn.y+10))/10;
		camera.z-= (camera.z-(zoomOn.z+20))/10;
	} else if (p) {
		camera.x-= (camera.x-(-p.x))/10;
		camera.y-= (camera.y-(-p.y+10))/10;
		camera.z-= (camera.z-(p.z+20))/10;
	}
	
	//Tmp
	/*	camera.x-= (camera.x-(-tmpCreator.x))/10;
		camera.y-= (camera.y-(+tmpCreator.y+20))/10;
		camera.z-= (camera.z-(tmpCreator.z+40))/10;*/
	
	
	//gl.depthFunc(gl.ALWAYS);
	
	/*for (var i=0; i<players.length; i++) {
		var p = players[i];
		var t = level[p.tile.x][p.tile.y];
	}*/
	
	for (var i=0; i<players.length; i++) {
		var p = players[i];
		var t = level[p.tile.x][p.tile.y];
		var hauteurSol = (t.h + t.o.length) * 2;
		
		for (var j=0; j<t.p.length; j++) {
			if (t.p[j]==players[i]) {
				break;
			} else {
				hauteurSol+=2;
			}
		}
		
		if (!t.h) { hauteurSol = -1000; }
		if (p.z > hauteurSol) {
			if (p.inMoveZ==0) {
				p.inMoveZ = 0.1;
			}
			p.z -= p.inMoveZ;
			p.inMoveZ *= 1.1;
			
			if (p.z==0) {
				gameOver();
			}			
			if (p.z <= hauteurSol) { //Je suis descendu un peu trop
				p.z = hauteurSol;
				p.inMoveZ = 0;
			}
		} else {
			if (hauteurSol==-1000) {
				gameOver();
			}
			if (hauteurSol>p.z) {
				p.z = hauteurSol + (t.inMoveZ/vitesseRotation);
			} else {
				p.inMoveZ = 0;
				p.z = hauteurSol;
			}
		}
		drawCube({
			x:players[i].x,
			y:players[i].y,
			z:players[i].z,
			h:1,
			type:"player",
			player:p,
			selectedPlayer:i==selectedPlayer
		});
	}
	for (var x=0; x<levels[levelEnCours].width; x++) {
		for (var y=0; y<levels[levelEnCours].height; y++) {
			var t = level[x][y];
			var h = t.h + t.o.length;
			if (!t.h) { h=-10; }
			if (t.o.length) {
				for (var i=0; i<t.o.length; i++) {
					var o = t.o[i];
					//var decalX = decalY = 0;
					var decal = {x:0, y:0, z:0};
					if (o.inMoveX>0) {
						decal.x = -(--o.inMoveX)/vitesseRotation*2;
					}
					if (o.inMoveX<0) {
						decal.x = -(++o.inMoveX)/vitesseRotation*2;
					}
					if (o.inMoveY>0) {
						decal.y = (--o.inMoveY)/vitesseRotation*2;
					}
					if (o.inMoveY<0) {
						decal.y = (++o.inMoveY)/vitesseRotation*2;
					}
					
					if (h < o.z + o.inMoveZ) { //Il doit tomber
						if (o.speedZ==0) {
							o.speedZ = 0.1;
							o.inMoveZ = (o.z - h)*2;
						}
						if (o.speedZ>0) {
							o.speedZ*=1.1;
						} else if (o.speedZ<-0.04) {
							o.speedZ*=0.90;
						} else {
							o.speedZ=0.05;
						}

						o.inMoveZ -= o.speedZ;
						decal.z = o.inMoveZ;
						if (h > o.z + o.inMoveZ) {
							if (o.inMoveZ>-0.1) {
								decal.z = 0;
							} else {
								if (!t.h) {
									t.o = [];
									continue;
								} else {
									o.speedZ = (o.inMoveZ*0.2);
									o.inMoveZ = -o.inMoveZ;
									decal.z = o.inMoveZ;
								}
							}
						}
						o.z = t.h + i + 1;
					} else {
						if (h > o.z && t.inMoveZ<0) {
							decal.z = (t.inMoveZ/vitesseRotation);
							o.z = t.h + i;
						} else {
							o.z = t.h + i + 1;
						}
						o.inMoveZ = 0;
						o.speedZ = 0;
						
					}
					drawCube({
						x:x*2,
						y:-y*2,
						z:(h-t.o.length+(i))*2,
						h:1,
						type:"block"+(t.o[i].type==2 ? "2" : ""),
						decal:decal
					})
				}
			}
			var h = t.h;
			if (!h) { continue; }
			
			var decal = {x:0, y:0, z:0};
			var rotation = {x:0, y:0, z:0};
			if (levelExplode) {
				if (levelExplodeSince==0) {
					nextLevel();
					return;
				}
				blocksInMove = true;
				t.inMoveZ += t.speedZ;
				decal.z = t.inMoveZ/vitesseRotation;
				t.speedZ-=0.2;

				t.decalX+=t.speedX;
				t.decalY+=t.speedY;

				decal.x = t.decalX;
				decal.y = t.decalY;

				t.speedX*=0.9999;
				t.speedY*=0.9999;

				t.rotation.x+=t.rotationSpeed.x;
				t.rotation.y+=t.rotationSpeed.y;
				t.rotation.z+=t.rotationSpeed.z;
				rotation = t.rotation;
			} else {
				if (t.inMoveZ) {
					blocksInMove = true;
					if (t.inMoveZ>0) {
						decal.z = (--t.inMoveZ)/vitesseRotation;
					}
					if (t.inMoveZ<0) {
						decal.z = (++t.inMoveZ)/vitesseRotation;
					}
				}
			}
			
			//Si il y a une tuile à gauche d'au moins la même hauteur, je n'affiche pas la gauche
			/*face = [1,1,1,1];
			if (x>0) {
				var tL = level[x-1][y];
				if (tL.h>=t.h+1) {
					face[3]=0;
				}
			}
			if (x<level.length) {
				var tL = level[x+1][y];
				if (tL.h>=t.h) {
					face[1]=0;
				}
			}
			if (y<level[0].length-1) {
				var tL = level[x][y+1];
				if (tL.h>=t.h) {
					face[2]=0;
				}
			}*/
			drawCube({
				x:x*2,
				y:-y*2,
				z:0,
				h:h-0.2,
				type:"normal",
				trigger:t.t,
				decal:decal,
				rotation:rotation,
				triggered:t.triggered,
			//	face:face
			})
			//face = [1,1,1,1];
			drawCube({
				x:x*2,
				y:-y*2,
				z:(h*2)-0.4,
				h:0.2,
				type:"normal2",
				trigger:t.t,
				decal:decal,
				rotation:rotation,
				//triggered:t.triggered,
				//face:face
			})
			if (t.t && !t.finish) {
				drawCube({
					x:x*2,
					y:-y*2,
					z:h*2,
					h:1,
					type:"trigger",
					trigger:t.t,
					decal:decal
				})
			}
		}
	}
	
	if (levelDrawing && !blocksInMove) {
		levelDrawing = false;
		startTuto();
		vitesseRotation = 10;
	}
	
	lightsDisplayed = [];
	for (i=0; i<lights.length; i+=4) {
		var distance = Math.abs(camera.x - lights[i]/2);
		distance += Math.abs(camera.y + lights[i+1]/2);
		if (distance<100) {
			lightsDisplayed.push(lights[i]);
			lightsDisplayed.push(lights[i+1]);
			lightsDisplayed.push(lights[i+2]);
			lightsDisplayed.push(lights[i+3]);
		}
	}
	
	var l = levels[levelEnCours];
	drawCube({
		x:l.end.x*2,
		y:-l.end.y*2,
		z:level[l.end.x][l.end.y].h*2,
		h:0.1,
		type:"ball",
		decal:{
			x:0,
			y:0,
			z:level[l.end.x][l.end.y].inMoveZ/vitesseRotation
		}
	})
	
	/*gl.disable(gl.DEPTH_TEST);
	drawCube({
		x:tmpCreator.x*2,
		y:-tmpCreator.y*2,
		z:level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y] ? (level[tmpCreator.x][tmpCreator.y].h)*2 : 0,
		h:0.1,
		type:"block",
		decal:{
			x:0,
			y:0,
			z:0
		}
	})
	gl.enable(gl.DEPTH_TEST);*/
	
}
gameOver = function() {
	initGame();
}
/*tmpCreator = {
	x:0,
	y:0,
	z:0
}*/
nextLevel = function() {
	nbMovesAtStart = nbMoves;
	levelExplode = false;
	if (++levelEnCours==18) {
		cancelAnimationFrame(tick);
		drawHUDEnd();
	} else {
		initGame();
	}
}
explodeLevel = function() {
	players = [];
	
	vitesseRotation = 10;
	levelExplode = true;
	levelExplodeSince = 200;
	var l = levels[levelEnCours];
	
	for (var x=0; x<l.width; x++) {
		for (var y=0; y<l.height; y++) {
			level[x][y].speedZ = Math.random()*3;
			level[x][y].o = [];
			
			f = x > l.width/2 ? 1 : (x < l.width/2 ? -1 : 0);
			level[x][y].speedX = Math.random() * f;
			
			f = y > l.height/2 ? -1 : (y < l.height/2 ? 1 : 0);
			level[x][y].speedY = Math.random() * f;
			
			level[x][y].decalX = 0;
			level[x][y].decalY = 0;
			level[x][y].rotation = {x:0, y:0, z:0}
			level[x][y].rotationSpeed = {x:Math.random()*0.1, y:Math.random()*0.1, z:Math.random()*0.1}
		}
	}
}
rafTick = null;
rafHUD = null;
waitingKeyStart = true;
function drawHUDEnd() {
	frame++;
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	
	//gl.clearColor(0.5, 0.25, 0.85, 1.0);
	ctx.fillStyle = '#7F40D9';
	ctx.fillRect(0, 0,  canvasHUD.width, canvasHUD.height);
	t = "1024 MOVES"; drawText((window.innerWidth/2)-(12*15/2)*(t.length/2), 100, t, 15);
	t = "     CONGRATULATIONS !&YOU MADE IT IN "+nbMoves+" MOVES !&  (BEST POSSIBLE IS 1024)"; 
	drawText((window.innerWidth/2)-(12*7/2)*(27/2), 500+Math.sin(frame/64)*10, t, 7);
	
	rafHUD = requestAnimationFrame(drawHUDEnd);
}
function drawHUDHome() {
	frame++;
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	ctx.fillStyle = '#7F40D9';
	ctx.fillRect(0, 0,  canvasHUD.width, canvasHUD.height);
	t = "1024 MOVES"; drawText((window.innerWidth/2)-90*(t.length/2), 100, t, 15);
	t = "PRESS A KEY TO START"; drawText((window.innerWidth/2)-42*(t.length/2), 500+Math.sin(frame/64)*10, t, 7);
	rafHUD = requestAnimationFrame(drawHUDHome);
}
function drawHUD() {
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	if (tutoText) {
		drawText((window.innerWidth/2)-(12*3/2)*(tutoText.length/2), (window.innerHeight/2) + 144, tutoText.toUpperCase(), 3);
	} else {
		drawText(10, 10, nbMoves+" MOVE"+(nbMoves>1 ? "S" : "" ),3); //+ " - "+tmpCreator.x+"."+tmpCreator.y, 3);
		var t = "STAGE "+levelEnCours;
		drawText((window.innerWidth/2)-27*(t.length/2), 20, t, 4.5);
		drawText(10, 100, "M - MUTE&R - RETRY", 3);
	}
}

function tick() {
	frame++;
	drawScene();
	drawHUD();
	rafTick = requestAnimationFrame(tick);
}

initGame = function() { 
	nbMoves = nbMovesAtStart;
	
	camera = {
		x:-8,
		y:16,
		z:23,
		rotation:{
			x:-1.3,
			y:0,
			z:63
		}
	};
	
	var l = levels[levelEnCours];
	l.triggers.push({
		x:l.end.x,
		y:l.end.y,
		action:function() {
			explodeLevel();
		},
		type:"finish"
	});
	
	selectedPlayer = 0;
	level = [];
	vitesseRotation = 1;
	levelDrawing = true;
	levelTmp = l.data.join("");
	for (var x=0; x<l.width; x++) {
		level[x] = [];
		for (var y=0; y<l.height; y++) {
			level[x][y] = {
				h:levelTmp[x+(y*l.width)] ? parseInt(levelTmp[x+(y*l.width)]) : false,
				o:[],
				p:[],
				t:false,
				z:0,
				inMoveZ:-Math.round(Math.random()*50),
				nb:0
			};
		}
	}
	for (var i=0; i<l.starts.length; i++) {
		players[i] = {
			x:l.starts[i].x*2, 
			y:-l.starts[i].y*2, 
			z:22, 
			rotation:{x:0, y:0, z:0, xD:0}, 
			tile:{x:l.starts[i].x, y:l.starts[i].y}, 
			inMoveY:0, 
			inMoveX:0,
			inMoveZ:0,
			haveControl:false
		};
		level[l.starts[i].x][l.starts[i].y].p = [players[i]];
	}
	for (var i=0; i<l.objects.length; i++) {
		x = l.objects[i][0];
		y = l.objects[i][1];
		type = l.objects[i][2] ? l.objects[i][2] : 0;
		level[x][y].o = [{
			x:x,
			y:y,
			z:level[x][y].h,
			type:type
		}];
	}
	for (var i=0; i<l.triggers.length; i++) {
		x = l.triggers[i].x;
		y = l.triggers[i].y;
		level[x][y].t = {
			type:l.triggers[i].type,
			on:l.triggers[i].on,
			action:l.triggers[i].action,
			color:l.triggers[i].type==2 ? red : blue
		}
		if (l.triggers[i].on) {
			for (var j=0; j<l.triggers[i].on.length; j++) {
				level[l.triggers[i].on[j][0]][l.triggers[i].on[j][1]].triggered = true;
			}
		}
	}
	level[l.end.x][l.end.y].finish = true;
}
addPlayerControl = function() {
	if (tutoNumber!==false) { return; }
	for (var i=0; i<players.length; i++) {
		players[i].haveControl = true;
	}
}
var tutoNumber = false;
var tutoText = false;
startTuto = function() {
	if (tuto[levelEnCours]) {
		tutoNumber = -1;
		nextTuto();
	} else {
		addPlayerControl()
	}
}

nextTuto = function() {
	tutoNumber++;
	if (tuto[levelEnCours][tutoNumber]) {
		var t = tuto[levelEnCours][tutoNumber];
		zoomOn = t[0];
		tutoText = t[1];
		setTimeout(nextTuto, t[2]);
	} else {
		zoomOn = false;
		tutoNumber = false;
		tutoText = false;
		addPlayerControl();
	}
}

switchTileHeight = function(x, y, levelOff, levelOn, state) {
	if (levelOn==null) {
		levelOn = state ? level[x][y].h + levelOff : level[x][y].h;
		levelOff = state ? level[x][y].h : level[x][y].h + levelOff;
	}
	if (state) {
		if (level[x][y].h==levelOff) {
			level[x][y].inMoveZ = vitesseRotation * (levelOff>levelOn ? 2 : -2);
			//playSound([1,,0.0922,,0.5,0.19,,0.02,-0.14,,,,,,,,,,1,,,0.2611,,0.5]);
			playSound([2,0.1,0.20875772806897386,0.4,0.3995907182891785,0.6,0.20781957085118677,-0.15,0,0,0,0,0,0.8997235718602934,-0.19289283657523948,0,0,0,1,0,0,0.0583846933342502,0,0.55]);
		}
	} else {
		if (level[x][y].h==levelOn) {
			level[x][y].inMoveZ = vitesseRotation * (levelOff>levelOn ? -2 : 2);
			//playSound([1,,0.0922,,0.5,0.19,,0.02,0.1599,,,,,,,,,,1,,,0.2611,,0.5]);
			playSound([2,0.1,0.20875772806897386,0.4,0.3995907182891785,0.6,0.20781957085118677,0.15,0,0,0,0,0,0.8997235718602934,-0.19289283657523948,0,0,0,1,0,0,0.0583846933342502,0,0.6]);
		}
	}
	level[x][y].h = state ? levelOn : levelOff;
}
function resize() {
	var canvas = document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl = canvas.getContext("webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	
	canvasHUD.width = canvas.width;
	canvasHUD.height = canvas.height;
}
function webGLStart() {
	//init HUD
	canvasHUD = document.getElementById("HUD");
	ctx = canvasHUD.getContext("2d");

	//init canvas && webgl
	resize();
	
	if (!gl) {
		alert("Could not load WebGL sorry");
	}
	initShaders();
	initTexture();

	gl.clearColor(0.5, 0.25, 0.85, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	//Create textures
	var canvas2 = document.createElement("canvas");
	canvas2.width=512;
	canvas2.height=512;
	var ctx2 = canvas2.getContext("2d");
	var iD = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
	ctx2.clearRect(0,0,512,512);

	//Create wall texture
	for (var i = 0; i < iD.data.length; i += 4) {
		var c = Math.floor(Math.random()*255);
		iD.data[i]=(255-((255-c)/1200)) * 193/255;
		iD.data[i+1]=(255-((255-c)/1200)) * 171/255;
		iD.data[i+2]=(255-((255-c)/1200)) * 146/255;
		iD.data[i+3]=255;
	}
	ctx2.putImageData(iD, 0, 0);
	handleLoadedTextureFromCanvas("mur", canvas2);
	
	//Create trigger texture
	var tailleBordures = 50;
	ctx2.clearRect(0,0,512,512);
	for (var i = 0; i < iD.data.length; i += 4) {
		var x = (i/4)%512;
		var y = Math.floor(i/2048);
		var isBordure = (y<tailleBordures || y>512-tailleBordures || x<tailleBordures || x>512-tailleBordures);
		if (Math.hypot(256-x, 256-y) < 150) {
			isBordure = true;
		}
		
		iD.data[i+0]=isBordure ? 196 : 54;
		iD.data[i+1]=isBordure ? 221 : 64;
		iD.data[i+2]= isBordure ? 55 : 216;
		iD.data[i+3]=255;
	}
	ctx2.putImageData(iD, 0, 0);
	handleLoadedTextureFromCanvas("red", canvas2);

	//Create trigger2 texture
	ctx2.clearRect(0,0,512,512);	
	for (var i = 0; i < iD.data.length; i += 4) {
		var x = (i/4)%512;
		var y = Math.floor(i/(512*4));
		var isBordure = (y<tailleBordures || y>512-tailleBordures || x<tailleBordures || x>512-tailleBordures);
		if (x>=206 && x<=306 && y>=206 && y<=306) {
			isBordure = true;
		}
		iD.data[i+0]=isBordure ? 255 : 54;
		iD.data[i+1]=isBordure ? 121 : 64;
		iD.data[i+2]= isBordure ? 0 : 216;
		iD.data[i+3]=255;
	}
	ctx2.putImageData(iD, 0, 0);
	handleLoadedTextureFromCanvas("blue", canvas2);
	
	//Create multiple texture for tiles
	for (var j=0; j<23; j++) {
		var taille = 10 + Math.random() * 3;
		var c = Math.random();
		var color = {
			r:27 - c*60,
			g:165 - c*10,
			b:211 - c*7.5
		}
		delta = {r:0, g:0, b:0};
		ctx2.clearRect(0,0,512,512);
		for (var i = 0; i < iD.data.length; i += 4) {
			var x = (i/4)%512;
			var y = Math.floor(i/2048);
			tailleBordures = j==21 ? 30 : taille;
			if (j==22) {
				tailleBordures = 30;
				var isBordure = (y<tailleBordures || y>512-tailleBordures || x<tailleBordures || x>512-tailleBordures) ;
				
				x2 = Math.abs(x-256);
				y2 = Math.abs(y-256);
				if (Math.hypot(x2, y2) < 128 || Math.hypot(128-x2, 128-y2) < 64 || Math.hypot(192-x2, 192-y2) < 32) {
					isBordure = true
				}
				
				if (isBordure) {
					delta.r = delta.g = delta.b = Math.hypot(256-x,256-y) > 32 ? Math.hypot(256-x,256-y) : 255;
				} else {
					delta = {r:0, g:0, b:0}
				}
				
			} else {
				var isBordure = (y<tailleBordures || y>512-tailleBordures || x<tailleBordures || x>512-tailleBordures) ;
			}
			
			iD.data[i+0] = isBordure ? color.r / 2 + delta.r : color.r;
			iD.data[i+1] = isBordure ? color.g / 2 + delta.g : color.g;
			iD.data[i+2] = isBordure ? color.b / 2 + delta.b : color.b;
			iD.data[i+3]=255;
		}
		ctx2.putImageData(iD, 0, 0);
		handleLoadedTextureFromCanvasTiles(j, canvas2);
	}
	
	//Create noise texture for the finish sphere
	s = 256;
	canvas2.width=s;
	canvas2.height=s;

	var ctx2 = canvas2.getContext("2d");
	var iD = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
	ctx2.clearRect(0,0,s,s);
	
	for (var i = 0; i < iD.data.length; i += 4) {
		var c = Math.floor(Math.random()*255);
		iD.data[i]=Math.floor(Math.random()*255);
		iD.data[i+1]=Math.floor(Math.random()*255);
		iD.data[i+2]=Math.floor(Math.random()*255);
		iD.data[i+3]=Math.floor(Math.random()*255);
	}
	ctx2.putImageData(iD, 0, 0);
	handleLoadedTextureFromCanvas("sphereTexture", canvas2);
	
	initLevels();
	initGame();
	drawHUDHome();
}
document.onkeydown = function(e) {
	if (waitingKeyStart) {
		waitingKeyStart = false;
		tick();
		cancelAnimationFrame(rafHUD);
	}
	switch(e.keyCode) {
		case 90:
		case 87:
		case 38: // up
			moveB = true;
			break;
		case 81:
		case 65:
		case 37: // left
			moveL = true; 
			break;
		case 40: // down
		case 83:
			moveF = true;
			break;
		case 68:
		case 39: // right
			moveR = true;
			break;
		case 17:
		case 32: //space
			break;
	}
}
document.onkeyup = function(e) {
	switch(e.keyCode) {
		case 90:
		case 87:
		case 38: // up
			moveB = false;
			break;
		case 81:
		case 65:
		case 37: // left
			moveL = false;
			break;
		case 40: // down
		case 83:
		
			moveF = false;
			break;
		case 68:
		case 39: // right
			moveR = false;
			break;
		case 82:
			gameOver();
			break;
		case 77:
			sound = 1-sound;
			break;
		case 32:
			selectedPlayer = (selectedPlayer + 1)%levels[levelEnCours].starts.length
			break;
		/*case 102:
			tmpCreator.x++;
			tmpCreator.z = level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y] ? (level[tmpCreator.x][tmpCreator.y].h)*2 : 0;
			break;
		case 100:
			tmpCreator.x--;
			tmpCreator.z = level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y] ? (level[tmpCreator.x][tmpCreator.y].h)*2 : 0;
			break;
		case 104:
			tmpCreator.y--;
			tmpCreator.z = level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y] ? (level[tmpCreator.x][tmpCreator.y].h)*2 : 0;
			break;
		case 98:
			tmpCreator.y++;
			tmpCreator.z = level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y] ? (level[tmpCreator.x][tmpCreator.y].h)*2 : 0;
			break;
		case 107: //+
			if (level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y]) {
				level[tmpCreator.x][tmpCreator.y].h++;
			}
			break;
		case 109: //-
			if (level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y]) {
				level[tmpCreator.x][tmpCreator.y].h--;
			}
			break;
		case 13:
			if (level[tmpCreator.x] && level[tmpCreator.x][tmpCreator.y]) {
				var o = level[tmpCreator.x][tmpCreator.y].o;
				if (o.length==0) {
					o.push({
						x:tmpCreator.x,
						y:tmpCreator.y,
						z:level[tmpCreator.x][tmpCreator.y].h
					});
				} else {
					level[tmpCreator.x][tmpCreator.y].o = [];
				}
			}
			break;*/
		default:
			break;
	}
}

var tuto = {
	1:[
		[{x:2,y:2, z:-8}, "this is you. Move with arrow keys", 4000],
		[{x:14, y:2, z:-8}, "Watch out for holes", 3000],
		[{x:22, y:2, z:-8}, "this is your goal, get the orb", 4000]
	],
	2:[
		[{x:12, y:2, z:0}, "You can push the crates", 3000]
	],
	5:[
		[{x:2, y:-2, z:-6}, "this is a switch, which modifies something in the stage", 3000]
	],
	6:[
		[{x:2, y:-2, z:-6}, "this is another sort of trigger, have to keep it pressed", 3000]
	],
	7:[
		[{x:8, y:6, z:0}, "this is another player. Switch between players with space key", 4000]
	],
	12:[
		[{x: 8, y: -2, z: -8}, "this block cannot be moved, but it is climbable", 4000]
	]
};

initLevels = function() {
	levels = {
		1:{"width":14,"height":8,"starts":[{"x":1,"y":4}],"end":{"x":11,"y":4},"data":["00000000000000","33333333333300","32222222222300","32222220222300","32222200222200","32222220222300","32222222222300","33333333333300"],"objects":[],"triggers":[]}, //Simple juste un trou
		2:{"width":9,"height":6,"starts":[{"x":1,"y":1}],"end":{"x":6,"y":5},"data":["333333333","322222223","333333233","000003230","000003230","000003230"],"objects":[[6,1]],"triggers":[]}, //Juste pousser une caisse
		3:{"width":14,"height":8,"starts":[{"x":1,"y":4}],"end":{"x":11,"y":4},"data":["00000000000000","33333333333300","33333333333300","33322222333300","32223322221200","33322222333300","33333333333300","33333333333300"],"objects":[[7,4]],"triggers":[]},
		4:{"width":14,"height":8,"starts":[{"x":1,"y":4}],"end":{"x":11,"y":4},"data":["00000000000000","33333333333300","33333333333300","33322222333300","32222222211200","33322232333300","33333333333300","33333333333300"],"objects":[[4,4],[6,4],[7,4]], triggers:[]},
		5:{"width":14,"height":8,"starts":[{"x":1,"y":4}],"end":{"x":11,"y":4},"data":["00000000000000","33333333333300","32222233333300","33333222333300","32223222221200","32223333233300","33322222233300","33333333333300"],"objects":[],"triggers":[
				{
					x:1,
					y:2,
					type:1,
					on:[[10,4,1,2]]
				}]},
		6:{"width":14,"height":8,"starts":[{"x":1,"y":4}],"end":{"x":11,"y":4},"data":["00000000000000","33333333333300","32222222233300","33323232333300","32222232322200","32223232333300","33322233333300","33333333333300"],"objects":[[2,5],[5,5]],"triggers":[{
					x:1,
					y:2,
					type:2,
					on:[[8,4,3,2]]
				}]},
		7:{
			width:9,
			height:7,
			starts:[{x:1, y:1},{x:4, y:3}],
			end:{x:1, y:5},
			data:[
				"222222222",
				"211111122",
				"222222122",
				"211112122",
				"222222122",
				"211111112",
				"222222222"
			],
			triggers:[
				{
					x:1,
					y:3,
					type:2,
					on:[[7,1,2,1]]
				}
			],
			objects:[
				[6,1]
			]},
		8:{"width":14,"height":8,"starts":[{"x":1,"y":3}],"end":{"x":9,"y":4},"data":["00000000000000","55544044433300","55504043333300","55504043333300","54444133333300","54444043333300","55544043333300","55554044433300"],"objects":[[4,2],[1,6]],"triggers":[]},
		9:{"width":14,"height":8,"starts":[{"x":1,"y":1},{"x":1,"y":3}],"end":{"x":8,"y":2},"data":["33333333333300","33333333333300","33333435533300","33333333333300","33333333333300","00000000000000","00000000000000","00000000000000"],"objects":[[1,2]],triggers:[
				{
					x:4,
					y:2,
					type:2,
					on:[[6,2,3,4]]
				}
			]},
		10:{"width":14,"height":8,"starts":[{"x":2,"y":6},{"x":10,"y":2}],"end":{"x":5,"y":4},"data":["00000000000000","33323332333000","33323332333000","33323332333000","33323532333000","33323332333000","33323332333000","33323332333000"],"objects":[[1,4],[9,4]],"triggers":[
				{
					x:1,
					y:6,
					type:2,
					on:[[3,4,2,3],[7,4,2,3]]
				},{
					x:9,
					y:6,
					type:2,
					on:[[3,4,2,3],[7,4,2,3]]
				},{
					x:4,
					y:6,
					type:3,
					on:[[5,3,1]]
				},{
					x:6,
					y:6,
					type:3,
					on:[[5,3,1]]
				}
			]},

		11:{"width":17,"height":12,"best":204,"starts":[{"x":4,"y":6}],"end":{"x":16,"y":6},"data":["41111111111133333","33333333333332223","22222222222222323","22222333333322223","33333344444322233","00000345554332220","55555555554332225","00000055554322220","33333344444323233","32222333333322223","32322222222222223","33333333333333333"],"objects":[[9,5],[9,6],[9,7]],"triggers":[
				{
					x:15,
					y:10,
					type:3,
					on:[[16,6,-1]]
				},{
					x:15,
					y:9,
					type:3,
					on:[[16,6,-1]]
				},{
					x:14,
					y:9,
					type:3,
					on:[[16,6,-1]]
				}
			]},
		12:{"width":9,"height":7,"starts":[{"x":5,"y":3}],"end":{"x":7,"y":3},"data":["111111111","111111112","111111012","111111020","111111012","111111112","111111111"],"objects":[[4,1,2],[1,2],[1,3],[1,4],[4,5,2]],"triggers":[{
					x:5,
					y:5,
					type:2,
					on:[[5,5,1,2]]
				},{
					x:5,
					y:1,
					type:2,
					on:[[5,1,1,2]]
				}]},
		13:{"width":8,"height":7,"starts":[{"x":3,"y":4}],"end":{"x":7,"y":2},"data":["12222200","22221100","21111102","12222101","21111101","22222122","12222222"],"objects":[[2,2],[2,4]],"triggers":[{
					x:5,
					y:5,
					type:2,
					on:[[5,5,1,2]]
				},{
					x:4,
					y:1,
					type:2,
					on:[[4,1,1,2]]
				},{
					x:1,
					y:4,
					type:2,
					on:[[1,4,1,2]]
				}]},
		14:{"width":16,"height":7,"starts":[{"x":1,"y":3}],"end":{"x":13,"y":3},"data":["022222220000200","0021111122202220","0221222111222222","0211111111222212","0211121112222222","0221121112002220","0022222222000200"],"objects":[[2,2],[4,3],[7,3],[6,4]],"triggers":[{
					x:2,
					y:5,
					type:2,
					on:[[9,3,2,1]]
				},{
					x:3,
					y:5,
					type:2,
					on:[[10,3,2,1]]
				},{
					x:2,
					y:4,
					type:2,
					on:[[11,3,2,1]]
				},{
					x:3,
					y:4,
					type:2,
					on:[[12,3,2,1]]
				}]},
		15:{"width":15,"height":15,"starts":[{"x":0,"y":3}],"end":{"x":7,"y":10},"data":["222222000000000","222222222022230","332333222322230","222222222022230","333333222000100","222222223000200","333332223000200","000000000002200","000000333302200","000000322333230","000000322222230","000000322333330","000000333300000","000000000000000","000000000000000"],"objects":[[2,2,2],[5,3,2],[6,3],[7,3],[12,6]],"triggers":[
				{
					x:2,
					y:5,
					type:2,
					on:[[2,2,2,1]]
				},{
					x:0,
					y:2,
					type:2,
					on:[[9,2,3,2]]
				}]},
		16:{"width":16,"height":16,"starts":[{"x":8,"y":7}],"end":{"x":7,"y":10},"data":["0000000000000000","0004444444000000","0004323334444400","0004222223333400","0004222222223400","0004222222223400","0004222333222400","0004222323323400","0004222322333400","0004222222444400","0004444344400000","0000000000000000","0000000000000000","0000000000000000","2222222222222222","2222222222222222"],"objects":[[5,3,2],[5,4],[6,4],[7,3],[8,4]],"triggers":[]},
		17:{"width":10,"height":10,"starts":[{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7}],"end":{"x":7,"y":8},"data":["0000000000","0000000000","0000000000","3333233300","2111111300","2111111100","2111111300","2111133330","2111113330","2222133330"],"objects":[[4,8]],"triggers":[
				{
					x:6,
					y:5,
					type:2,
					on:[[6,5,1,2]]
				},{
					x:4,
					y:3,
					type:2,
					on:[[4,3,2,3]]
				}]}
	}
}
