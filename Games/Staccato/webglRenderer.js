/**
 * @constructor
 */
function WebGLRenderer(canvas, game)
{
	gl=canvas.getContext('experimental-webgl');
	this.canvas=canvas;
	this.game=game;
	this.views=2;
	this.time=0;
	this.cameraType=[0, 0];	// attached to car
	this.resize();
}

WebGLRenderer.prototype = {

	initialize : function() {
		gl.clearColor(.6, .8, 1., 1.);                      // Set clear color to sky, fully opaque
		gl.clearDepth(1.0);                 				// Clear everything
		gl.enable(gl.DEPTH_TEST);                           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);                            // Near things obscure far things


		// init shaders
		gl.shaderSource(v=gl.createShader(gl.VERTEX_SHADER), "attribute vec3 a;attribute vec2 t;attribute vec3 n;uniform mat4 mX,mP;varying vec2 vT;varying vec4 vP;varying vec3 vN;void main(){vN=(mX*vec4(n,0.)).rgb,vP=mX*vec4(a,1.),gl_Position=mP*vP,vT=t;}");
		gl.compileShader(v);  
		// water shader derived from http://glsl.heroku.com/e#1758.0
		gl.shaderSource(f= gl.createShader(gl.FRAGMENT_SHADER), "\
			#ifdef GL_ES \n\
			precision lowp float; \n\
			#endif	\n\
			\
			varying lowp vec2 vT; \
			varying lowp vec3 vN; \
			varying lowp vec4 vP; \
			uniform sampler2D uSampler; \
			uniform vec4 uE;  \
			uniform vec4 uC; 	\
			void main(void) { \
				lowp vec3 n = normalize(vN); \
				if (uC.a==.5) { \
					vec2 p = 3000. * (vT.st-vec2(.625,.875)); \
					float c = 0.;\
					for (float phi=0.; phi < 6.28; phi+=.7){\
						c+=cos(sin(phi*2.3)*2.7+cos(phi)*p.x+sin(phi)*p.y+uE.a*.1-length(p));\
					}\
					n=normalize(vec3(.3+.1*c,0.,1.-c));\
				}\
				lowp vec4 tC = texture2D(uSampler, vec2(vT.s, vT.t)); \
				tC = mix(vec4(uC.rgb, 1.0), tC, tC.a); \
				lowp vec3 lightDir = vec3(1.0, 0.0, 0.0); \
				lowp vec3 halfDir = normalize(lightDir+normalize(uE.xyz-vP.xyz)); \
				float diffuse = 0.7+dot(n, lightDir);  \
				float specular = pow(max(0.0, dot(halfDir, n)), 2.0); \
				gl_FragColor = vec4 (uC.a*specular+diffuse*tC.rgb, tC.a);\
			}\
		");

		gl.compileShader(f);  
		
/*
		var s1 = gl.getShaderParameter(v, gl.COMPILE_STATUS);
		alert(gl.getShaderInfoLog(v));
		var s2 = gl.getShaderParameter(f, gl.COMPILE_STATUS);
		alert(gl.getShaderInfoLog(f));
*/
		
		   
		gl.attachShader(this.shaderProgram = gl.createProgram(), v);
		gl.attachShader(this.shaderProgram, f);
		gl.linkProgram(this.shaderProgram);
		
		//var s3 = gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS);
		gl.useProgram(this.shaderProgram);
		gl.enableVertexAttribArray(p = gl.getAttribLocation(this.shaderProgram, "a"));	// vertex position
		gl.enableVertexAttribArray(gl.getAttribLocation(this.shaderProgram, "t"));	// vertex texture coordinate
		gl.enableVertexAttribArray(gl.getAttribLocation(this.shaderProgram, "n"));	// vertex normal
		this.createCarGeometry();  

		var defaultNormalTempBuffer = new Float32Array(60000);
		for (var i=0; i<20000; ++i) {
			defaultNormalTempBuffer[i*3]=0;
			defaultNormalTempBuffer[i*3+1]=0;
			defaultNormalTempBuffer[i*3+2]=1;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.defaultNormalGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, defaultNormalTempBuffer, gl.STATIC_DRAW);

		
	},
	
	/**
	 * Draw the contents of the secondary canvas that will be used as a texture
	 */
	initializeTexture : function()
	{
		var texture = document.createElement('canvas');
		texture.width = texture.height = 512;
		var context2D = texture.getContext('2d');

		for (var j=0;j<8;++j) for (var i=0; i<3; ++i) {
			context2D.fillStyle = ((i+j)&1?"#FFF":"#000");
			context2D.fillRect(25+16*i, 256+16*j, 16, 16);
		}
		
		// car windows
		context2D.fillStyle = "#666"; 
		context2D.fillRect(16, 51, 80, 13);
		context2D.fillRect(16, 77, 80, 12);
		context2D.fillRect(16, 51, 16, 38);
		context2D.fillRect(80, 51, 16, 38);
		context2D.fillRect(16, 24, 32, 9);
		context2D.fillRect(64, 24, 32, 9);
		context2D.fillStyle = "#300";
		context2D.beginPath();
		context2D.fillRect(25, 92, 9, 9);
		context2D.fillRect(36, 92, 7, 9);
		context2D.fillRect(69, 92, 7, 9);
		context2D.fillRect(78, 92, 9, 9);
		context2D.fill();
		
		
		var grass = context2D.createLinearGradient(128, 384, 128, 511);
		grass.addColorStop(0, "#753");
		grass.addColorStop(0.08, "#531");
		grass.addColorStop(0.16, "#040");
		grass.addColorStop(1, "#564");
		context2D.fillStyle = grass;
		context2D.fillRect(128, 384, 128, 127);
	
	
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture); 
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		
	},

	resize : function() {
		var width = window.innerWidth, height=window.innerHeight;
		this.canvas.height=gl.height=height;
		this.canvas.width=gl.width=width;
		if (this.views==1) {
			this.panelWidth = width;
		} else {
			this.panelWidth = (width>>1) - 1;
		}
		this.panelHeight = height;
	},
	
	toggleCameraType : function(player) {
		this.cameraType[player] = (this.cameraType[player]+1)%6;
		return this.cameraType[player];
	},
	
	/**
	 * Create the geometry and texture for the car
	 */ 
	createCarGeometry : function()
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.carGeometryGLBuffer = gl.createBuffer());
		var packedGeometry = "77s5CsLCsLSs5Ss7_sH7sc;Vc[VH_s\\#V\\sVp%@s4@r1*re*sb@pq@n%*nq*l'Rp4SpbSloR5#V5sV.#V.sV##*''9'#*'s*'o9#s*k%9kq9i#Dc#DcsDisD`'5`#*3#*3s*`s*`o53'53o5l#*ls*0#D0sD#&V#pV#;V#[V*#D*sD#'@#o@#;@#[@s1#n%#nq#se#"; 
		var carGeometryTempBuffer = new Float32Array(198); 
		for (var i=0; i<198; ++i) { 
			carGeometryTempBuffer[i] = [-2,-1,0.1][i%3]+[4,2,1.1][i%3]*(packedGeometry.charCodeAt(i)-35)/80; 
		}
		gl.bufferData(gl.ARRAY_BUFFER, carGeometryTempBuffer, gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.carTextureCoordGLBuffer = gl.createBuffer());
		var packedTexCoords="UVNOWXMFGPDI46./793:<>?ATY\\amckrjp;B;CJBCCSZJJSZ;B[b\\a^_[behfg&3:'"; 
		var carTexCoordTempBuffer = []; 
		for (var i=0; i<66; ++i) { 
			var s=packedTexCoords.charCodeAt(i)-35;
			carTexCoordTempBuffer.push((s&7)/32, (s>>3)/40) ; 
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(carTexCoordTempBuffer), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.carNormalGLBuffer = gl.createBuffer());
		var packedNormals = "j5m%pGoNmrjaj;mGnOj[Z8Z^N?PHPHLNSNNWN?NWY<gHhOYZT8T^U6U`Q*N6X7X_N`SiN9N]S:O7O_S\\P6\\7\\7\\_\\_P`J8J^N;N[I8I^X0XfZ#T#I5IaL*LlK#K#UFM?MWWO"; 
		var carNormalTempBuffer = []; 
		for (var i=0; i<132; ++i) { 
			var theta=(packedNormals.charCodeAt(i*2)-35)*Math.PI/80;
			var phi=-Math.PI+(packedNormals.charCodeAt(i*2+1)-35)*Math.PI/40;
			carNormalTempBuffer.push(Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta));
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(carNormalTempBuffer), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.carElementsGLBuffer = gl.createBuffer());
		var packedElements = "#$%&'()%*+&,)*-.+,/012345/12467809:3)-;<.,#);<,(#%),&(=#;<(>?@ABCD5E/4F6-879.:GH7:IJ-7HI:.KLMNOP-Q;<R.-*8+.9-HKPI.-KQRP.KMQRNP5SEFT670/3:47/E4:F7EGJF:QU;<VR#W$'X(WY$'ZX#=WX>(U=;<>V[=UV>\\W]YZ^X?]@C^D]W@CX^]?_`D^]_YZ`^W=[\\>XW[@C\\X5abcd651ad265bSTc6'&%$'%*%&*&+8+98*+89383003202112d1daY'$YZ'Y_ZZ_`?`_?D`"; 
		var carElementsTempBuffer = []; 
		for (var i=0; i<300; ++i) { 
			carElementsTempBuffer.push(packedElements.charCodeAt(i)-35);
		}
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(carElementsTempBuffer), gl.STATIC_DRAW);
			
		var tireTreadGeometryTempBuffer = new Float32Array(78);
		for (var i=0; i<26; ++i) {
			tireTreadGeometryTempBuffer[i*3]=.3*Math.cos(Math.PI*i/6);
			tireTreadGeometryTempBuffer[i*3+1]=(i&1?-.1:.1);
			tireTreadGeometryTempBuffer[i*3+2]=.3+.3*Math.sin(Math.PI*i/6);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireTreadGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, tireTreadGeometryTempBuffer, gl.STATIC_DRAW);
		
		var tireSideGeometryTempBuffer = new Float32Array(42);
		tireSideGeometryTempBuffer[0]=0;
		tireSideGeometryTempBuffer[1]=.1;
		tireSideGeometryTempBuffer[2]=.3;
		for (var i=0; i<13; ++i) {
			tireSideGeometryTempBuffer[i*3+3]=.3*Math.cos(Math.PI*i/6);
			tireSideGeometryTempBuffer[i*3+4]=.1;
			tireSideGeometryTempBuffer[i*3+5]=.3+.3*Math.sin(Math.PI*i/6);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireSideGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, tireSideGeometryTempBuffer, gl.STATIC_DRAW);
		
		var tireTreadTextureCoordTempBuffer = new Float32Array(52);
		for (var i=0; i<26; ++i) {
			tireTreadTextureCoordTempBuffer[i*2]=.8;
			tireTreadTextureCoordTempBuffer[i*2+1]=.6;
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireTreadTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, tireTreadTextureCoordTempBuffer, gl.STATIC_DRAW);
		
		// reusing same GL buffer for tire side
/*
		var tireSideTextureCoordTempBuffer = new Float32Array(28);
		tireSideTextureCoordTempBuffer[0]=.93;
		tireSideTextureCoordTempBuffer[1]=.6;
		for (var i=0; i<13; ++i) {
			tireSideTextureCoordTempBuffer[i*2+2]=.93+.08*Math.cos(Math.PI*i/6);
			tireSideTextureCoordTempBuffer[i*2+3]=.6+.08*Math.sin(Math.PI*i/6);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireSideTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, tireSideTextureCoordTempBuffer, gl.STATIC_DRAW);
		*/
	},
	
	/**
	 * Create the geometry (vertices) representing the landscape (ground)
	 *
	 * Generation is performed using the provided seed for randomization
	 * and the diamond-square algorithm.
	 * (the same seed will always generate the same geometry, meaning that
	 * the landscape can be compressed to the seed value in the track definition)
	 *
	 * Nearby the road, altitude is modified to match that of the road,
	 * so that it looks like it is built on the ground, as opposed to 
	 * floating in mid-air or buried underground.
	 */
	createLandscapeGeometry : function(track)
	{
		this.landscape = [];
		this.landscapeSize = 256;
		this.seed = track.landscapeSeed;
		// Create a 256x256 height map. The diamond-square algorithm usually requires a 2^n+1 side,
		// here the coordinates are taken with modulus 256, thus the last column/row is identical to the first one
		// meaning that the map tiles perfectly.
		for (var j=0; j<this.landscapeSize*this.landscapeSize ; ++j) 
		{
			this.landscape.push(j ? 99 : 0);
		}
		for (var step=0; step<track.totalSteps; ++step) {
			var section = track.sections[step];
			var stepBelow = track.getStepAt(section.x, section.y)&255;	// always get the altitude below the bridge
			for (var j=0; j<11; ++j)
				for (var i=0; i<11; ++i)
				{
					var dx = i/10, dy = j/10;
					if (!track.testOffRoad(track.sections[stepBelow].tile, dx, dy).offRoad) {
						var x=48+10*section.x+i;
						var y=48+10*section.y+j;
						var altitude = track.getRealAltitudeAt(section.x+dx, section.y+dy, stepBelow);
						this.setLandscapeHeightAt(x,y,altitude);
					}
				}
			
		}
		var dilate = [];
		for (var j=0; j<=this.landscapeSize ; ++j) 
			for (var i=0; i<=this.landscapeSize; ++i) 
			{
				if (this.landscapeHeightAt(i,j)==99) {
					dilate.push([i, j, Math.min(
						this.landscapeHeightAt(i-1,j), this.landscapeHeightAt(i+1,j), 
						this.landscapeHeightAt(i,j-1), this.landscapeHeightAt(i,j+1))]);
				}
			}
		for (var i=0; i<dilate.length; ++i) {
			this.setLandscapeHeightAt(dilate[i][0], dilate[i][1], dilate[i][2]);
		}
		this.performDiamondSquareStep(0, 0, this.landscapeSize, 12);
		
		// create the geometry buffer from the height map
		this.landGeometryRawBuffer = [];
		this.landTextureCoordRawBuffer = [];
		this.landNormalRawBuffer = [];
		for (var i=0; i<=this.landscapeSize; ++i) 
			for (var j=0; j<=this.landscapeSize ; ++j) 
			{
				var z = this.landscapeHeightAt(i,j);
				this.landGeometryRawBuffer.push((i-48)*1.6, (j-48)*1.6, z);
				this.landTextureCoordRawBuffer.push(.3, Math.min(6.5, Math.max(-.5,z))*.03+.77);
				z = this.landscapeHeightAt(i+1,j);
				this.landGeometryRawBuffer.push((i-47)*1.6, (j-48)*1.6, z);
				this.landTextureCoordRawBuffer.push(.4, Math.min(6.5, Math.max(-.5,z))*.03+.77);
				var nx = .3*(this.landscapeHeightAt(i-1,j)-this.landscapeHeightAt(i+1,j));
				var ny = .3*(this.landscapeHeightAt(i,j-1)-this.landscapeHeightAt(i,j+1));
				var nz = Math.sqrt(1-nx*nx-ny*ny);
				this.landNormalRawBuffer.push(nx, ny, nz);
				nx = .3*(this.landscapeHeightAt(i,j)-this.landscapeHeightAt(i+2,j));
				ny = .3*(this.landscapeHeightAt(i+1,j-1)-this.landscapeHeightAt(i+1,j+1));
				nz = Math.sqrt(1-nx*nx-ny*ny);
				this.landNormalRawBuffer.push(nx, ny, nz);
			}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.landGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.landGeometryRawBuffer), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.landTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.landTextureCoordRawBuffer), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.landNormalGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.landNormalRawBuffer), gl.STATIC_DRAW);		
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.waterGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-76.8, -76.8, -.5,
			332.8, -76.8, -.5, 
			-76.8, 332.8, -.5,
			332.8, 332.8, -.5
		]), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.waterTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			 .5 , .75,
			 .75, .75,
			 .5 ,   1,
			 .75,   1
		 ]), gl.STATIC_DRAW);		
		
	},
	
	landscapeHeightAt : function (x,y)
	{
		x= x&255;	// hardcoded for 256
		y= y&255;
		return this.landscape[y*this.landscapeSize+x];
	},
	
	setLandscapeHeightAt : function(x,y,h) {
		x= x&255;	// hardcoded for 256
		y= y&255;
		this.landscape[y*this.landscapeSize+x] = h;
	},

	controlledRandom : function()
	{
		this.seed = 3.9*this.seed*(1-this.seed);	// chaotic function
		return this.seed;
	},
	
	/**
	 * Landscape generation : perform one step
	 */
	performDiamondSquareStep : function(x, y, size, scale)
	{
		var zTL = this.landscapeHeightAt(x     , y     );
		var zTR = this.landscapeHeightAt(x+size, y     );
		var zBL = this.landscapeHeightAt(x     , y+size);
		var zBR = this.landscapeHeightAt(x+size, y+size);
		size = size>>1;
		var zT  = this.landscapeHeightAt(x+size  , y       );
		if (zT==99) {
			this.setLandscapeHeightAt(x+size,y,zT = .5*(zTL+zTR)+scale*(this.controlledRandom()-.5));
		}
		var zL  = this.landscapeHeightAt(x       , y+size  );
		if (zL==99) {
			this.setLandscapeHeightAt(x, y+size, zL=.5*(zTL+zBL)+scale*(this.controlledRandom()-.5));
		}
		var zR  = this.landscapeHeightAt(x+2*size, y+size  );
		if (zR==99) {
			this.setLandscapeHeightAt(x+2*size, y+size, zR=.5*(zTR+zBR)+scale*(this.controlledRandom()-.5));
		}
		var zB  = this.landscapeHeightAt(x+size  , y+2*size);
		if (zB==99) {
			this.setLandscapeHeightAt(x+size, y+2*size, zB=.5*(zBL+zBR)+scale*(this.controlledRandom()-.5));
		}
		var zC  = this.landscapeHeightAt(x+size  , y+size  );
		if (zC==99) {
			this.setLandscapeHeightAt(x+size, y+size, .25*(zT+zL+zR+zB)+scale*(this.controlledRandom()-.5));
		}
		if (size>1) {
			scale = .6 * scale;
			this.performDiamondSquareStep(x, y, size, scale);
			this.performDiamondSquareStep(x+size, y, size, scale);
			this.performDiamondSquareStep(x, y+size, size, scale);
			this.performDiamondSquareStep(x+size, y+size, size, scale);
		}
		
	},
	
	/**
	 * Add one (transformed) vertex to the track geometry
	 */
	addTrackVertex : function(xt, yt, x, y, c, s, h)
	{
		var i = sz*(xt+.5+c*(x-.5)-s*(y-.5));
		var j = sz*(yt+.5+s*(x-.5)+c*(y-.5));
		this.trackGeometryRawBuffer.push(i, j, h);
	},
	
	/**
	 * Add one vertical pole to the track railing
	 */
	addPole : function(xt, yt, x, y, z, c, s, height, radius)
	{
		this.addRail(xt,yt,x,y,z,x,y,z+height,c,s,radius);
		var i = sz*(xt+.5+c*(x-.5)-s*(y-.5));
		var j = sz*(yt+.5+s*(x-.5)+c*(y-.5));
		for (var a=0; a<8; ++a) {
			var a0 = Math.PI*2*a/8, a1 = a0+Math.PI/4;
			this.railingGeometryRawBuffer.push (i+radius*Math.cos(a0), j+radius*Math.sin(a0), z+height,
												i+radius*Math.cos(a1), j+radius*Math.sin(a1), z+height,
												i, j, z+height+.1
												);
											
			this.railingTextureCoordRawBuffer.push (.01, .74, 
													.03, .74,
													.01, .54
													);
			this.railingNormalRawBuffer.push(	.7*Math.cos(a0)	,	.7*Math.sin(a0)	, .7,
												.7*Math.cos(a1)	,	.7*Math.sin(a1)	, .7,
												.7*Math.cos(a0)	,	.7*Math.sin(a0)	, .7
											);
		}
	},
	
	/**
	 * Add one length of rail between two poles of the track railing
	 */
	addRail : function (xt, yt, x0, y0, z0, x1, y1, z1, c, s, radius)
	{
		var i0 = sz*(xt+.5+c*(x0-.5)-s*(y0-.5));
		var j0 = sz*(yt+.5+s*(x0-.5)+c*(y0-.5));
		var i1 = sz*(xt+.5+c*(x1-.5)-s*(y1-.5));
		var j1 = sz*(yt+.5+s*(x1-.5)+c*(y1-.5));
		
		var dy = j1-j0, dx=i1-i0, vx=(dx?-dy:1), vy=dx;
		var vl = vx*vx+vy*vy, wx = -vy*(z1-z0), wy=vx*(z1-z0), wz=vx*dy-vy*dx;
		vx/=Math.sqrt(vl); 
		vy/=Math.sqrt(vl);
		var nw = Math.sqrt(wx*wx+wy*wy+wz*wz);
		wx/=nw; wy/=nw; wz/=nw;
		for (var a=0; a<8; ++a) {
			var a0 = Math.PI*2*a/8, a1 = a0+Math.PI/4;
			this.railingGeometryRawBuffer.push (i0+radius*(vx*Math.cos(a0)+wx*Math.sin(a0)), j0+radius*(vy*Math.cos(a0)+wy*Math.sin(a0)), z0+radius*wz*Math.sin(a0),
												i0+radius*(vx*Math.cos(a1)+wx*Math.sin(a1)), j0+radius*(vy*Math.cos(a1)+wy*Math.sin(a1)), z0+radius*wz*Math.sin(a1),
												i1+radius*(vx*Math.cos(a0)+wx*Math.sin(a0)), j1+radius*(vy*Math.cos(a0)+wy*Math.sin(a0)), z1+radius*wz*Math.sin(a0),
												i1+radius*(vx*Math.cos(a0)+wx*Math.sin(a0)), j1+radius*(vy*Math.cos(a0)+wy*Math.sin(a0)), z1+radius*wz*Math.sin(a0),
												i0+radius*(vx*Math.cos(a1)+wx*Math.sin(a1)), j0+radius*(vy*Math.cos(a1)+wy*Math.sin(a1)), z0+radius*wz*Math.sin(a1),
												i1+radius*(vx*Math.cos(a1)+wx*Math.sin(a1)), j1+radius*(vy*Math.cos(a1)+wy*Math.sin(a1)), z1+radius*wz*Math.sin(a1)
												);
											
			this.railingTextureCoordRawBuffer.push (.01, .74, 
													.03, .74,
													.01, .54,
													.01, .74, 
													.03, .74,
													.01, .54
													);
			this.railingNormalRawBuffer.push(	vx*Math.cos(a0)+wx*Math.sin(a0), vy*Math.cos(a0)+wy*Math.sin(a0), wz*Math.sin(a0),
												vx*Math.cos(a1)+wx*Math.sin(a1), vy*Math.cos(a1)+wy*Math.sin(a1), wz*Math.sin(a1),
												vx*Math.cos(a0)+wx*Math.sin(a0), vy*Math.cos(a0)+wy*Math.sin(a0), wz*Math.sin(a0),
												vx*Math.cos(a0)+wx*Math.sin(a0), vy*Math.cos(a0)+wy*Math.sin(a0), wz*Math.sin(a0),
												vx*Math.cos(a1)+wx*Math.sin(a1), vy*Math.cos(a1)+wy*Math.sin(a1), wz*Math.sin(a1),
												vx*Math.cos(a1)+wx*Math.sin(a1), vy*Math.cos(a1)+wy*Math.sin(a1), wz*Math.sin(a1)
											);
		}
											
	},
	
	/**
	 * Create the geometry (vertices) representing the track
	 * From the track description
	 */
	createTrackGeometry : function(track) 
	{
		this.trackGeometryRawBuffer = [];
		this.trackTextureCoordRawBuffer = [];
		this.trackNormalRawBuffer = [];
		
		this.railingGeometryRawBuffer = [];
		this.railingTextureCoordRawBuffer = [];
		this.railingNormalRawBuffer = [];
		var textureSquare = [0, .8, .25, .95]; // road texture square in the canvas
		var margin=.1, poleMargin=.09;
		
		for (var index=0; index<track.sections.length; ++index)
		{
			var section = track.sections[index];
			var i=section.x, j=section.y;
			
			var tile = section.tile;
			var angle = Math.PI*(tile&3)/2;
			var c = Math.cos(angle);
			var s = Math.sin(angle);
			var steepness = section.steepness;
			var altitude = .1+section.z;

			// checkered flag
			if (index==0)
			{
				this.railingGeometryRawBuffer.push(	(i+margin+.05)*sz, j*sz, 4+altitude,
													(i+.95-margin)*sz, j*sz, 4+altitude,
													(i+margin+.05)*sz, j*sz, 6+altitude,
													(i+margin+.05)*sz, j*sz, 6+altitude,
													(i+.95-margin)*sz, j*sz, 4+altitude,
													(i+.95-margin)*sz, j*sz, 6+altitude);
				this.railingTextureCoordRawBuffer.push(.05, .5, .05, .749, .143, .5, .143, .5, .05, .749, .143, .749);
				for (var k=0; k<6; ++k) {
					this.railingNormalRawBuffer.push (0, .7, .7);
				}
				this.addPole (i, j, 0, poleMargin, altitude, c, s, 6, .3);
				this.addPole (i, j, 0, 1-poleMargin, altitude, c, s, 6, .3);
			}
		
			switch (tile>>2) {
				case 0 : 
					this.addTrackVertex(i, j, 0, margin, c, s, altitude);
					this.addTrackVertex(i, j, 1, margin, c, s, altitude+steepness);
					this.addTrackVertex(i, j, 0, 1-margin, c, s, altitude);
					this.addTrackVertex(i, j, 0, 1-margin, c, s, altitude);
					this.addTrackVertex(i, j, 1, margin, c, s, altitude+steepness);
					this.addTrackVertex(i, j, 1, 1-margin, c, s, altitude+steepness);
					this.trackTextureCoordRawBuffer.push(textureSquare[0], textureSquare[3],			  
														 textureSquare[0], textureSquare[1],
														 textureSquare[2], textureSquare[3],
														 textureSquare[2], textureSquare[3],
														 textureSquare[0], textureSquare[1],
														 textureSquare[2], textureSquare[1]
														);
					var nx = c*Math.sin(steepness/8);
					var ny = s*Math.sin(steepness/8);
					var nz = Math.sqrt(1-nx*nx-ny*ny);
					for (var k=0; k<6; ++k) {
						this.trackNormalRawBuffer.push (nx ,ny, nz);
					}
					for (var k=0; k<4; ++k) {
						this.addPole (i, j, k/4, poleMargin, altitude+steepness*k/4, c, s, 1, .3);
						this.addPole (i, j, k/4, 1-poleMargin, altitude+steepness*k/4, c, s, 1, .3);
						this.addRail (i, j, k/4, poleMargin, .5+altitude+steepness*k/4, (k+1)/4, poleMargin, .5+altitude+steepness*(k+1)/4, c, s, .2);
						this.addRail (i, j, k/4, 1-poleMargin, .5+altitude+steepness*k/4, (k+1)/4, 1-poleMargin, .5+altitude+steepness*(k+1)/4, c, s, .2);
					}
					break;
				case 1 :
					var step = 10;
					var textureStep=(textureSquare[3]-textureSquare[1])/step;

					for (var k=0; k<step; ++k) {
						var a0=k*Math.PI/step/2;
						var a1=(k+1)*Math.PI/step/2;
						this.addTrackVertex(i, j, (1-margin)*Math.cos(a0), (1-margin)*Math.sin(a0), c, s, altitude);
						this.addTrackVertex(i, j, margin*Math.cos(a0), margin*Math.sin(a0), c, s, altitude);
						this.addTrackVertex(i, j, (1-margin)*Math.cos(a1), (1-margin)*Math.sin(a1), c, s, altitude);
						this.addTrackVertex(i, j, (1-margin)*Math.cos(a1), (1-margin)*Math.sin(a1), c, s, altitude);
						this.addTrackVertex(i, j, margin*Math.cos(a0), margin*Math.sin(a0), c, s, altitude);
						this.addTrackVertex(i, j, margin*Math.cos(a1), margin*Math.sin(a1), c, s, altitude);
						this.trackTextureCoordRawBuffer.push(textureSquare[2], textureSquare[1]+k*textureStep,			  
															 textureSquare[0], textureSquare[1]+k*textureStep,
															 textureSquare[2], textureSquare[1]+(k+1)*textureStep,
															 textureSquare[2], textureSquare[1]+(k+1)*textureStep,
															 textureSquare[0], textureSquare[1]+k*textureStep,
															 textureSquare[0], textureSquare[1]+(k+1)*textureStep
															);	
						this.trackNormalRawBuffer.push (0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
						
					}
					this.addPole (i, j, poleMargin, 0, altitude, c, s, 1, .4);
					this.addRail (i, j, poleMargin, 0, .5+altitude, 0, poleMargin, .5+altitude, c, s, .2);
					for (var k=0; k<6; ++k) {
						this.addPole (i, j, (1-poleMargin)*Math.cos(Math.PI*k/12), (1-poleMargin)*Math.sin(Math.PI*k/12), altitude, c, s, 1, .3);
						this.addRail (i, j, (1-poleMargin)*Math.cos(Math.PI*k/12), (1-poleMargin)*Math.sin(Math.PI*k/12), .5+altitude, (1-poleMargin)*Math.cos(Math.PI*(k+1)/12), (1-poleMargin)*Math.sin(Math.PI*(k+1)/12), .5+altitude, c, s, .2);
					}
					break;
				default :
			}
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.trackGeometryRawBuffer), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.trackTextureCoordRawBuffer), gl.STATIC_DRAW);		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackNormalGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.trackNormalRawBuffer), gl.STATIC_DRAW);		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingGeometryGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.railingGeometryRawBuffer), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingTextureCoordGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.railingTextureCoordRawBuffer), gl.STATIC_DRAW);		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingNormalGLBuffer = gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.railingNormalRawBuffer), gl.STATIC_DRAW);		
		
	},
	
	
	drawMain : function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Player 1 view (fullscreen if 1 up)
		gl.viewport(0, 0, this.panelWidth, this.panelHeight);
		this.drawPlayerView(0);

		// Player 2 view
		if (this.views>1) {
			gl.viewport(this.panelWidth+2, 0, this.panelWidth, this.panelHeight);
			this.drawPlayerView(1);
		}
	},
	
	/** 
	 * Draw one tire. Factored from drawPlayerView()
	 */
	drawTire : function(carX, carY, carZ, carAngle, tireX, tireY, a1, a2, tireAngle)
	{
		var cK = Math.cos(carAngle);
		var sK = Math.sin(carAngle);
		var xT = carX+cK*tireX+sK*tireY, yT = carY+sK*tireX-cK*tireY;
		cK = Math.cos(carAngle+tireAngle);
		sK = -Math.sin(carAngle+tireAngle);
		var c1 = Math.cos(a1);
		var s1 = Math.sin(a1);
		var c2 = Math.cos(a2);
		var s2 = Math.sin(a2);
	
		gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "mX"), false, new Float32Array(
		   [ cK*c2-sK*s1*s2, -sK*c1, cK*s2+sK*s1*c2, 0.0,
			 sK*c2+cK*s1*s2,  cK*c1, sK*s2-cK*s1*c2, 0.0, 
			 -c1*s2        ,  s1   , c1*c2         , 0.0,
			xT, yT, carZ, 1.0]));
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireTreadGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireTreadTextureCoordGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 26);  
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tireSideGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 14);  
		
	},
	
	
	drawPlayerView : function(playerIndex) {
		
		var xT=128, yT=128, zT=-20;
		var worldRenderAngle = ++this.time/100;
		var tilt = .6, w=-150, far=400;
		
		if (this.game.state != 1) 
		{	// in all states but track menu, follow the car
			var car = this.game.race.cars[playerIndex];
			var camera = this.cameraType[playerIndex];
			
			var zC = [40, 40, 3, 7, 7, 2][camera];
			tilt = [0, 0, 1.35, 1.05, .85, 1.45][camera];
			w = [0, 0, -9, -11, -40, 0][camera];
			worldRenderAngle = (camera ==1 ? 0 : car.heading-Math.PI/2);
			
			// camera coordinates
			xT= car.carX;
			yT= car.carY;
			zT= zC+this.game.race.track.getRealAltitudeAt(xT/16, yT/16, car.currentStep);
			far = 200;
		}
		
		gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "mP"), false, new Float32Array(this.makePerspective(-xT, -yT, -zT, w, 60, this.panelWidth/this.panelHeight, 2, far, tilt, worldRenderAngle)));				
		
		// draw ground		
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uZ"), 0);
		gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uE"), xT+w*Math.sin(tilt)*Math.sin(worldRenderAngle), yT+w*Math.sin(tilt)*Math.cos(worldRenderAngle), zT-w*Math.cos(tilt), this.time);
		
		gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "mX"), false, new Float32Array(
		   [1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0, 
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0]));

		// draw track
		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackNormalGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.trackTextureCoordGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);

		gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), .1, .2, .2, .4); // asphalt color & specular

		// texture and view matrix are unchanged 
		gl.drawArrays(gl.TRIANGLES, 0, this.trackGeometryRawBuffer.length/3);  

		// draw railing
		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingNormalGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.railingTextureCoordGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);

		gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), .7, .7, .7, .6); // railing color and specular

		gl.drawArrays(gl.TRIANGLES, 0, this.railingGeometryRawBuffer.length/3);  
		
		// draw ground (landscape)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.landGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.landTextureCoordGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.landNormalGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);

		gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), 0, 0, 0, 0); // specular for land
	
		// texture and view matrix are unchanged 
		for (var i=0; i<256; ++i) {
			gl.drawArrays(gl.TRIANGLE_STRIP, i*514, 514);
		}

		
		// draw water surface
		gl.bindBuffer(gl.ARRAY_BUFFER, this.waterGeometryGLBuffer);
		gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.waterTextureCoordGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.defaultNormalGLBuffer);
		gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);

		gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), 0, .06, .2, .5); // specular for water
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);  
		
		// draw cars
		if (this.game.state != 1) for (var carIndex=0; carIndex<this.game.race.carCount; ++carIndex) 
		{
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.carElementsGLBuffer);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.carGeometryGLBuffer);
			gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
			
			// car body color is transparent in the texture
			// and blended by the fragment shader
			// P1 : rgb 128,0,0
			// P2 : rgb 0,0,255
			// CPU : rgb 255,255,0
			var carColor = Math.min(carIndex, 2);
			gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), [.5,0.0,1.0][carColor], [0.0,0.0,1.0][carColor], [0.0,1.0,0.0][carColor], .55); // car color and specular
			gl.bindBuffer(gl.ARRAY_BUFFER, this.carTextureCoordGLBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "t"), 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.carNormalGLBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);			
			
			var xK = this.game.race.cars[carIndex].carX;
			var yK = this.game.race.cars[carIndex].carY;
			var tileX = xK / sz;
			var tileY = yK / sz;
			var zK = .1+this.game.race.track.getRealAltitudeAt(tileX, tileY, this.game.race.cars[carIndex].currentStep);
			var aK = -this.game.race.cars[carIndex].heading;
			var cK = Math.cos(aK);
			var sK = Math.sin(aK);
			
			// tilt car on an incline
			var step = this.game.race.track.getStepAt(Math.floor(tileX), Math.floor(tileY))&255;
			if (step == 255) {
				step = 0; // debug point needed here
			}
			var section = this.game.race.track.sections[step];
			var steepness = Math.atan(section.steepness/16);
			var roadAngle = .25*Math.PI*section.dir;
			var a1 = -Math.sin(roadAngle)*steepness;
			var a2 = Math.cos(roadAngle)*steepness;
			var c1 = Math.cos(a1);
			var s1 = Math.sin(a1);
			var c2 = Math.cos(a2);
			var s2 = Math.sin(a2);
			
			gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "mX"), false, new Float32Array(

			   [ cK*c2-sK*s1*s2, -sK*c1, cK*s2+sK*s1*c2, 0.0,
				 sK*c2+cK*s1*s2,  cK*c1, sK*s2-cK*s1*c2, 0.0, 
				 -c1*s2        ,  s1   , c1*c2         , 0.0,
				 xK, yK, zK, 1.0]));
			gl.drawElements(gl.TRIANGLES, 300, gl.UNSIGNED_SHORT, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.defaultNormalGLBuffer);
			gl.vertexAttribPointer(gl.getAttribLocation(this.shaderProgram, "n"), 3, gl.FLOAT, false, 0, 0);
			
			gl.uniform4f(gl.getUniformLocation(this.shaderProgram, "uC"), 0, 0, 0, 0);			
			this.drawTire(xK, yK, zK, -aK,  1.4,  .95, a1, a2, Math.PI+this.game.race.cars[carIndex].steeringAngle);
			this.drawTire(xK, yK, zK, -aK,  1.4, -.95, a1, a2, this.game.race.cars[carIndex].steeringAngle);
			this.drawTire(xK, yK, zK, -aK, -1.4,  .95, a1, a2, Math.PI);
			this.drawTire(xK, yK, zK, -aK, -1.4, -.95, a1, a2, 0);
			
		}
		
	},
  
	/**
	 * Create the perspective matrix from the coordinates of the camera
	 * Parameters fovy, aspect, znear and zfar define the first projection
	 * the same way gluMakePerspective() does. The camera is then, in that order :
	 *  - translated by (xT, yT, zT)
	 *  - rotated by rotZ around the Z axis (used as twist to follow the car heading)
	 *  - rotated by rotX around the new X axis (follow the car from behind)
	 *  - translated by (0, 0, w) in the new coordinate system
	 *
	 * @param xT : x-target coordinate of the camera
	 * @param yT : y-target coordinate of the camera
	 * @param zT : z-target coordinate of the camera
	 * @param w : distance from camera to target
	 * @param fovy : field of view in Y, in degrees
	 * @param aspect : aspect ratio X/Y
	 * @param znear : near cutting plane in Z
	 * @param zfar : far cutting plane in Z
	 * @param rotX : rotation around X-axis, in radian
	 * @param rotZ : rotation around Z-axis, in radian
	 */
	 
  	makePerspective : function(xT, yT, zT, w, fovy, aspect, znear, zfar, rotX, rotZ)
	{
		var halfheight = znear * Math.tan(fovy * Math.PI / 360.0)  
		var ymax = halfheight;
		var ymin = -halfheight;
		var xmin = - halfheight * aspect;
		var xmax = halfheight * aspect;
		var cZ = Math.cos(rotZ), sZ = Math.sin(rotZ);
		var cX = Math.cos(rotX), sX = Math.sin(rotX);

		var X = 2*znear/(xmax-xmin);
		var Y = 2*znear/(ymax-ymin);
		var C = -(zfar+znear)/(zfar-znear);
		var D = -2*zfar*znear/(zfar-znear);

		return [  X*cZ, -cX*Y*sZ, sX*sZ*C, -sX*sZ,
				  X*sZ,  Y*cZ*cX, -C*sX*cZ, sX*cZ,
				  0,  sX*Y, C*cX, -cX,
				  xT*X*cZ+yT*X*sZ, -xT*cX*Y*sZ+yT*Y*cZ*cX+zT*sX*Y, 
				  xT*sX*sZ*C-yT*C*sX*cZ+zT*C*cX+w*C+D, -xT*sX*sZ+yT*sX*cZ-zT*cX-w];
		
	}
	
}
