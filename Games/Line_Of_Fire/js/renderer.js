/**
 * Graphics renderer, in charge of displaying all game gfx to the page canvases
 * Handles all ingame modes and planes. 
 * @constructor
 * @param sceneryCanvas HTML5 canvas in the background, showing a top view of the current floor(s)
 * @param overlayCanvas HTML5 canvas in the foreground (or transparent), showing the PCB puzzle of the current door
 * @param game instance of the Game to render - mostly used to access World data
 */
 
function Renderer(sceneryCanvas, overlayCanvas, game)
{
	this.game = game;
	this.world = game.world;
	this.sceneryCanvas = sceneryCanvas;
	this.overlayCanvas = overlayCanvas;
	this.overlayContext = overlayCanvas.getContext("2d");
	this.babylonScene = 0;
	this.windowLayout = {
		playArea : []
	};
	
		
	this.initBabylon();
	
	this.resizeWindow(); // define the appropriate pixel zoom for the play area
	
	this.frameCount = 0;
	
	this.weaponOffset = [0, 0, 0, 0, 0];
	this.mainMenuText = ["Start new game", "Load game", "Save game" ];
	this.weaponName = ["Armor piercing", "Explosive", "Splitter", "Delay-action"];
	this.messageLine1 = ["Line of Fire", "", "Game over", "Game over", "Game over", "Pause", "You win", "You win", "You win"];
	this.messageLine2 = ["A WebXR game, built with Babylon.js. Press Enter or click to start",
						 "",
						 "Tank destroyed",
						 "Another player seized control of the arena",
						 "Time's out",
						 "Press P or Enter to resume",
						 "You are the only one left in the arena",
						 "You gained control of eight beacons" ];
	
	this.playerColor = ["#0ff", "#4f4", "#f0f", "#f72"];
	
	
}


Renderer.prototype = {
	

	initBabylon : function() {


		this.engine = new BABYLON.Engine(this.sceneryCanvas, true);

		// create a basic BJS Scene object
		this.scene = new BABYLON.Scene(this.engine);

		// create a VR camera if any VR device is available, fallback on browser rendering otherwise
		this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(128, 300, 128), this.scene);
		this.camera.attachControl(this.sceneryCanvas, false);
		
		this.vrHelper = this.scene.createDefaultVRExperience( {createDeviceOrientationCamera : false });
		
		// Plug controllers events into game handlers
		this.vrHelper.onControllerMeshLoaded.add(function(controller) { registerControllerEvents(controller); });

		// create a basic light, aiming 0,1,0 - meaning, to the sky
		var sunlight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(1, -5, 0), this.scene);
		//new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);

		// keep a reserve light for explosions
		this.expLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -5, 0), this.scene);
		this.expLight.setEnabled(false);
		
		// create a built-in "ground" shape;
		var ribbonData = [];
		for (var z=0; z<257; ++z) {
			var path = [];
			for (var x=256; x>-1; --x) {
				path.push(new BABYLON.Vector3(x, this.world.landscapeHeightAt(x, z), z));
			}
			ribbonData.push(path);
		}
		var ground = BABYLON.MeshBuilder.CreateRibbon('ground', { pathArray : ribbonData }, this.scene);
		
		var groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
		this.groundTexture = new BABYLON.DynamicTexture('groundTex', 1024, this.scene);
		this.groundTextureContext = this.groundTexture.getContext();

		this.groundTextureContext.fillStyle="#c94";
		this.groundTextureContext.fillRect(0,0,1024,1024);
		var textureData = this.groundTextureContext.getImageData(0,0,1024,1024);
		var textureBuffer = textureData.data;
		
		for (var i=0; i<1e6; ++i) {
			var x = Math.floor(1022*Math.random());
			var y = Math.floor(1022*Math.random());
			var factor = Math.min(x, y, 1023-x, 1023-y, 32)/32;
			var colorR = Math.floor(factor*(150 + 60*Math.random()));
			var colorG = Math.floor(factor*(95 + 60*Math.random()));
			var colorB = Math.floor(factor*(30 + 60*Math.random()));
			textureBuffer[1024*4*y+4*i] = colorR;
			textureBuffer[1024*4*y+4*i+1] = colorG;
			textureBuffer[1024*4*y+4*i+2] = colorB;
			
		}
		this.groundTextureContext.putImageData(textureData, 0, 0);
		
		//this.groundTextureContext.fillStyle="#C94";
		//this.groundTextureContext.fillRect(80,80,864,864);
		
		groundMaterial.diffuseTexture = this.groundTexture;
		groundMaterial.specularColor = new BABYLON.Color3(.3, .3, .3);
		ground.material = groundMaterial;
		this.groundTexture.update();

		var tankRoot = new BABYLON.TransformNode("tankRoot");
		var tankChassis = new BABYLON.TransformNode("tankChassis");
		tankChassis.parent = tankRoot;
		var wheel = BABYLON.MeshBuilder.CreateCylinder("wheel", { height : 1.2 , diameter : 1.3, tesselation : 16 } , this.scene);
		wheel.position.x = -4.5;
		wheel.position.y = 2.4;
		wheel.position.z = -1;
		wheel.parent = tankChassis;
		for (var i=1; i<7; ++i) {
			var newWheel = wheel.clone();
			newWheel.position.x = -4.5+1.5*i;
			newWheel.position.y = 2.4;
			newWheel.position.z = (i==6 ? -1 : 0);
			newWheel.parent = tankChassis;
		}
		for (var i=0; i<7; ++i) {
			var newWheel = wheel.clone();
			newWheel.position.x = -4.5+1.5*i;
			newWheel.position.y = -2.4;
			newWheel.position.z =( i==0 || i==6 ? -1 : 0);
			newWheel.parent = tankChassis;
		}
		
		var wallData = [[-4.5, 1.9, -3, 1.9, 3, 1.9, 4.5, 1.75],
						[-4.5, .6, -3, -.5, 3, -.5, 4.5, .6]];
		var leftWallArray = [], rightWallArray = [];
		for (var j=0; j<wallData.length; ++j) {
			var leftWallPath = [];
			var rightWallPath = [];
			for (var i=0; i<wallData[0].length; i+=2) {
				leftWallPath.push(new BABYLON.Vector3(wallData[j][i], wallData[j][i+1], -2.7));
				rightWallPath.push(new BABYLON.Vector3(wallData[j][i], wallData[j][i+1], 2.7));
			}
			leftWallArray.push(leftWallPath);
			rightWallArray.push(rightWallPath);
		}
		var leftWall = BABYLON.MeshBuilder.CreateRibbon("leftWall", { pathArray : leftWallArray, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene);
		var rightWall = BABYLON.MeshBuilder.CreateRibbon("rightWall", { pathArray : rightWallArray, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene);
		leftWall.parent = tankRoot;
		rightWall.parent = tankRoot;
						
		
		 // tank body
		var bodyData = [5.2, 1, 5.2, 1.5, 5, 1.7, 3, 2, -4.7, 2, -5.2, 1.5, -5.2, 1, -4.7, .5, 3.5, .5, 5.2, 1];
		var bodyShape = [];
		for (var i=0; i<bodyData.length; i+=2) {
			bodyShape.push(new BABYLON.Vector3(bodyData[i], bodyData[i+1], 0));
		}
		var bodyPath = [ new BABYLON.Vector3(0, 0, -1.8), new BABYLON.Vector3(0, 0, 1.8) ];
		var bodyMesh = BABYLON.MeshBuilder.ExtrudeShape("body", {shape: bodyShape, path: bodyPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.scene);
		bodyMesh.parent = tankRoot;
		
		// tank sides
		var sideData = [	[5.2, 1.5, 5, 1.7, 3, 2, -4.7, 2, -5.2, 1.5],
							[5.5, 1.4, 5, 1.9, 3, 2, -4.7, 2, -5.3, 1.4],
							[5.5, 1.4, 5, 1.9, 3, 2, -4.7, 2, -5.3, 1.4],
							[5.5, 1.2, 5, 1, 3, 1, -4.7, 1, -5.3, 1.2] ];

		var leftSideArray = [], rightSideArray = [];
		for (var j=0; j<sideData.length; ++j) {
			var leftSidePath = [];
			var rightSidePath = [];
			var leftZ = [-1.8, -1.8, -3.1, -3.1][j];
			var rightZ = [1.8, 1.8, 3.1, 3.1][j];
			for (var i=0; i<sideData[0].length; i+=2) {
				leftSidePath.push(new BABYLON.Vector3(sideData[j][i], sideData[j][i+1], leftZ));
				rightSidePath.push(new BABYLON.Vector3(sideData[j][i], sideData[j][i+1], rightZ));
			}
			leftSideArray.push(leftSidePath);
			rightSideArray.push(rightSidePath);
		}
		var leftSide = BABYLON.MeshBuilder.CreateRibbon("leftCover", { pathArray : leftSideArray, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene);
		var rightSide = BABYLON.MeshBuilder.CreateRibbon("rightCover", { pathArray : rightSideArray, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene);
		leftSide.parent = tankRoot;
		rightSide.parent = tankRoot;
				
		tankChassis.rotation.x = Math.PI/2;
		
		// turret and cannon
		var turretSection = [ 1.5, 2.1, 2.4, 2.5, 2.5, 2, 1.2];

		var turretArray = [];
		var turretPathBegin = [];
		for (var j=0; j<7; ++j) { 
			turretPathBegin.push(new BABYLON.Vector3(-3, 2.5, 0));
		}
		turretArray.push(turretPathBegin);
		for (var j=0; j<turretSection.length; ++j) {
			var turretPath = [];
			turretPath.push(new BABYLON.Vector3(j-3, 2.1, -turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 3, -turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 3.2, -.5*turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 3.2, .5*turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 3, turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 2.1, turretSection[j]));
			turretPath.push(new BABYLON.Vector3(j-3, 2.1, -turretSection[j]));
			turretArray.push(turretPath);
		}
		var turretPathEnd = [];
		for (var j=0; j<7; ++j) { 
			turretPathEnd.push(new BABYLON.Vector3(3, 2.5, 0));
		}
		turretArray.push(turretPathEnd);
		this.turret = [];
		this.turret.push(BABYLON.MeshBuilder.CreateRibbon("turret", { pathArray : turretArray, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene));
		
		this.cannon = [];
		var cannonArray = [];
		var cannonSection = [.2, .2, .2, .4, .4, .3, .3, .3, .3, .3];
		var cannonX = [0, 1, 2, 2, 3, 3, 4, 5, 6, 7];
		for (var a=0; a<16; ++a) {
			var path = [];
			for (var x=0; x<10; ++x) {
				path.push(new BABYLON.Vector3(cannonX[x], cannonSection[x]*Math.sin(a*Math.PI/8), cannonSection[x]*Math.cos(a*Math.PI/8)));
			}
			cannonArray.push(path);
		}
		this.cannon.push(BABYLON.MeshBuilder.CreateRibbon("cannon"+i, { pathArray : cannonArray, closeArray : true, sideOrientation : BABYLON.Mesh.DOUBLESIDE }, this.scene));
		
		
		this.tank = [];
		this.tankParent = [];
		this.cannonParent = [];
		for (var i=0; i<4; ++i) {
			this.tankParent[i] = new BABYLON.TransformNode("tankNode"+i); 
			if (i) {
				this.tank[i] = tankRoot.clone();
			} else {
				this.tank[i] = tankRoot;
			}
			this.tank[i].parent = this.tankParent[i];

			if (i) {
				this.turret.push(this.turret[0].clone());
				this.cannon.push(this.turret[i]._children[0]._children[0]);
			}
			this.turret[i].parent = this.tankParent[i];
			this.cannonParent[i] = new BABYLON.TransformNode("cannonNode"+i); 
			this.cannonParent[i].parent = this.turret[i];
			this.cannonParent[i].position.y = 2.5;
			this.cannon[i].parent = this.cannonParent[i];
			
			var camoTexture = new BABYLON.DynamicTexture('tankTexture'+i, 256, this.scene);
			var camoContext = camoTexture.getContext();
			this.createCamouflagePattern(camoContext, [ ["#133", "#277", "#699", "#5cc"],
														["#242", "#472", "#5b6", "#3d3"],
														["#424", "#726", "#969", "#d6d"],
														["#432", "#762", "#986", "#e93"] ][i]);
														
			var camoMaterial = new BABYLON.StandardMaterial("tankMaterial"+i, this.scene);
			camoMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			camoMaterial.diffuseTexture = camoTexture;
			camoTexture.update();
			this.setTreeMaterial(this.tankParent[i], camoMaterial);
			
			
		}		
		
		
		this.beacon = [];
		this.beaconBeam = [];
		for (var i=0; i<16; ++i) {
		
			this.beacon[i] = BABYLON.MeshBuilder.CreateCylinder("beacon"+i, { height : 2 , diameter : 5, tesselation : 16 } , this.scene);
			this.beacon[i].position.x = 32 + 64 * (i&3);
			this.beacon[i].position.z = 32 + 64 * (i>>2);
			this.beacon[i].position.y = this.world.landscapeHeightAt(this.beacon[i].position.x, this.beacon[i].position.z);
			
			var beaconMaterial = new BABYLON.StandardMaterial('beaconMat'+i, this.scene);
			beaconMaterial.diffuseColor =  new BABYLON.Color3(.25, .25, .25);
			this.beacon[i].material = beaconMaterial;
			this.beacon[i].receiveShadows = true;
			
			var beams = [];
			for (var j=0; j<5; ++j) {
				var beam = BABYLON.MeshBuilder.CreateTorus("beacon"+i+"beam"+j, {thickness: .1}, this.scene);
				beam.scaling = new BABYLON.Vector3 (5+3*j, 5+3*j ,5+3*j);
				beam.position.y = 5*j;
				beam.parent = this.beacon[i];
				var beamMaterial  = new BABYLON.StandardMaterial('beamMat'+i+"."+j, this.scene);
				beam.material = beamMaterial;
				beam.setEnabled(false);
				beams.push(beam);

			}
			this.beaconBeam.push(beams);
			
			
		}	
		
		this.shells = [];
		this.crates = [];
		this.crateMaterial = new BABYLON.StandardMaterial('crateMat', this.scene);
		this.crateMaterial.diffuseTexture = new BABYLON.Texture("images/crate16.png", this.scene);

		
		this.explosions = [];
			
		this.playerColors = [ 	new BABYLON.Color3(0, 1, 1),
								new BABYLON.Color3(.25, 1, .25),
								new BABYLON.Color3(1, .0, 1),
								new BABYLON.Color3(1, .5, .15) ];
								
		// shadows
		var shadowGenerator = new BABYLON.ShadowGenerator(1024, sunlight);
		//shadowGenerator.getShadowMap().renderList.push(torus);
		for (var i=0; i<4; ++i) {
			var allMeshes = [];
			this.getAllMeshesInTree(this.tankParent[i], allMeshes);
			for (var j=0; j<allMeshes.length; ++j) {
				shadowGenerator.addShadowCaster(allMeshes[j], true);
			}
		}
		ground.receiveShadows = true;
		
	},

	
	
	/**
	 * Draws a camouflage pattern on a canvas, based on a pseudo-random walk with threshold (always the same)
	 * Used to generate tank texture
	 */
	createCamouflagePattern : function(textureContext, colorArray) {
		textureContext.fillStyle="#000";
		textureContext.fillRect(0,0,256,256);
		var textureData = textureContext.getImageData(0,0,256,256); 
		var textureBuffer = textureData.data;
		
		var x=0, y=0, t=0, r=.5;
		for (var n=0;++n-4e5;t=13*t+r+9*Math.cos(t)&-1) {			
			x+=[0,1,0,-1][t&3];									// red
			y+=[0,1,0,-1][3-t&3];
			for (var i=0;++i-6;) for(var j=0;++j-6;)						
				++textureBuffer[256*4*(y+j&255)+4*(x+i&255)];							
		} 
		
		for (var n=0;++n-4e5;t=13*t+1+r+10*Math.cos(t)&-1) {			// green
			x+=[0,1,0,-1][t&3];												
			y+=[0,1,0,-1][3-t&3];
			for (var i=0;++i-6;) for(var j=0;++j-6;)						
				++textureBuffer[256*4*(y+j&255)+4*(x+i&255)+1];							
		}
		
		for (var j=0; j<256; ++j) {
			for (var i=0; i<256; ++i) {
				var colorIndex = (textureBuffer[256*4*j+4*i]>128 ? 1 : 0) + (textureBuffer[256*4*j+4*i+1]>128 ? 2 : 0);
				textureContext.fillStyle=colorArray[colorIndex];
				textureContext.fillRect(i,j,1,1);
			}
		}
	},

	/**
	 * Assign the given material to all meshes in the given tree
	 */
	setTreeMaterial : function(rootNode, material) {
		rootNode.material = material;
		if (rootNode.hasOwnProperty("_children")) {
			for (var i=0; i<rootNode._children.length; ++i) {
				this.setTreeMaterial(rootNode._children[i], material);
			}
		}
	},
	
	/**
	 * Return an array containing all meshes (but not TransformNodes or other) in the given tree
	 */
	getAllMeshesInTree : function(rootNode, meshArray) {
		if (rootNode.hasOwnProperty("_children")) {
			for (var i=0; i<rootNode._children.length; ++i) {
				this.getAllMeshesInTree(rootNode._children[i], meshArray);
			}
		}
		if (rootNode.hasOwnProperty("_geometry")) {
			meshArray.push(rootNode);
		}
		
	},
	
	/**
	 * Reinit the scene graph for a new game : hide explosions, crates, shells
	 * Revert beacons to gray and hide beams
	 */
	resetSceneGraph : function() {
		for (var i=0; i<this.beacon.length; ++i) {
			this.beacon[i].material.emissiveColor = new BABYLON.Color3(0, 0, 0);
		}
		for (var i=0; i<this.beaconBeam.length; ++i) {
			for (var j=0; j<this.beaconBeam[i].length; ++j) {
				this.beaconBeam[i][j].setEnabled(false);
			}
		}
		
		for (var i=0; i<this.shells.length; ++i) {
			this.shells[i].setEnabled(false);
		}
		for (var i=0; i<this.crates.length; ++i) {
			this.crates[i].setEnabled(false);
		}
		for (var i=0; i<this.explosions.length; ++i) {
			this.explosions[i].setEnabled(false);
		}

	},
	
	
	/** 
	 * Handler for global window resize event, also called once at init time
	 * Defines the zoom factor for the canvas contents and (re)aligns everything
	 * Zoom level is defined so that the number of tiles shown on screen is pretty much constant
	 */
	resizeWindow : function() {
			
		// Set both canvases to full window size
		this.overlayCanvas.width = this.sceneryCanvas.width = window.innerWidth;
		this.overlayCanvas.height = this.sceneryCanvas.height = window.innerHeight;
		this.overlayCanvas.style.width = this.sceneryCanvas.style.width = window.innerWidth+"px";
		this.overlayCanvas.style.height = this.sceneryCanvas.style.height = window.innerHeight+"px";

		this.windowLayout.playArea = [window.innerWidth, window.innerHeight];		
		this.game.layoutChanged(this.windowLayout);
		
		// propagate the information to Babylon
		this.engine.resize();
	},
	
	
	/**
	 * Draw text on the text canvas, with shadow
	 * @param text The text to write
	 * @param x X-coordinate of the text, left/center/right depending on the textAlign property of the canvas
	 * @param y Y-coordinate of the text
	 */
	drawShadedText : function(text, x, y)
	{
		this.overlayContext.shadowOffsetX = -1;
		this.overlayContext.shadowOffsetY = -1;
		this.overlayContext.fillText(text, x, y);
		this.overlayContext.shadowOffsetX = 2;
		this.overlayContext.shadowOffsetY = 2;
		this.overlayContext.fillText(text, x, y);
	},

	/**
	 * Draw text on the overlay canvas, with an outline (stroke and fill)
	 * Context rendering parameters must be defined beforehand : strokeStyle, fillStyle, lineWidth, textAlign ...
	 * @param text The text to write
	 * @param x X-coordinate of the text, left/center/right depending on the textAlign property of the canvas
	 * @param y Y-coordinate of the text
	 * @param size Text size in px
	 */	
	outlineText : function(text,x,y,size) {
		this.overlayContext.font = Math.ceil(size)+"px cursive";
		this.overlayContext.strokeText(text, x, y);
		this.overlayContext.fillText(text, x, y);
	},

	/**
	 * Entry point - Show the current message - if any - on top of the playing area
	 */
	drawMessage : function() {
	
		
		this.overlayContext.save();
	
		var gray = Math.round(50+50*Math.cos(this.frameCount/20));
		var hue = [240,240,0,0,0,240,120,120,120][1+this.world.gameCondition];
		this.overlayContext.fillStyle="hsl("+hue+","+gray+"%,50%)";			
		this.overlayContext.strokeStyle="#aaa";
			
		this.overlayContext.lineWidth = 6;
		this.overlayContext.textAlign="center";
		this.outlineText(this.messageLine1[1+this.world.gameCondition], 
						 this.overlayCanvas.width>>1, this.overlayCanvas.height*.45, this.overlayCanvas.height*.06);
		
		this.overlayContext.lineWidth = 2;
		this.overlayContext.fillStyle="#ccc";
		this.overlayContext.strokeStyle="#666";
		var extraMessage = "";
		if (this.world.gameCondition > 4) { // player wins
			extraMessage = " after "+Math.floor(this.world.timer/25)+" seconds";
		}
		this.outlineText(this.messageLine2[1+this.world.gameCondition]+extraMessage, 
						 this.overlayCanvas.width>>1, this.overlayCanvas.height*.55, this.overlayCanvas.height*.03);
		
		
		this.overlayContext.restore();
	},

	
	/**
	 * Entry point, draw both scenery (floor) and overlay (PCB, hacking view) canvases
	 */
	drawMain : function() {
	
		if (this.scene) {
			this.updateSceneGraph();
			this.scene.render();
		}
		
		this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
		//this.drawPlayfield();
		this.drawStatus();
		
		
		++this.frameCount;
	},

	
	/**
	 * Draw the play area
	 * Private method called by drawMain()
	 */
	drawPlayfield : function() {
		
		
		this.overlayContext.save();
		this.overlayContext.translate(-64, -64);
		this.overlayContext.scale(.5,.5);

		this.overlayContext.fillStyle = "#040";
		this.overlayContext.fillRect(128, 128, 512, 512);
		this.overlayContext.lineWidth="1px";
		
		
		// beacons
		for (var i=0; i<this.world.beacons.length; ++i) {
			var bx = i&3, bz = i>>2;
			this.overlayContext.fillStyle = ["#888", "#0ff", "#4f4", "#f0f", "#fa2"][1+this.world.beacons[i]];
			this.overlayContext.fillRect(128+64+128*bx-6, 640-64-128*bz-6, 12, 12);
		}
		
		
		// players 
		for (var i=0; i<this.world.playerData.length; ++i) {
			var currentPlayer = this.world.playerData[i];
			
			this.overlayContext.save();
			this.overlayContext.translate(128 + 2*currentPlayer.x, 640 - 2*currentPlayer.z);
			this.overlayContext.rotate(-currentPlayer.dir);
			this.overlayContext.strokeStyle=this.playerColor[i];
			this.overlayContext.strokeRect(-20, -15, 40, 30);
			this.overlayContext.rotate(-currentPlayer.aimY + currentPlayer.dir);
			this.overlayContext.beginPath();
			this.overlayContext.moveTo(0, 0);
			this.overlayContext.lineTo(25, 0);
			this.overlayContext.stroke();
			this.overlayContext.restore();
		}
		
		// shells
		for (var i=0; i<this.world.shells.length ; ++i) {
			var oneShell = this.world.shells[i];
			this.overlayContext.fillStyle = "#ff7";
			var halfSize = 1+oneShell.y/10;
			this.overlayContext.fillRect(128+2*oneShell.x-halfSize, 640-2*oneShell.z-halfSize, 2*halfSize, 2*halfSize);
		}
		
		// crates
		for (var i=0; i<this.world.crates.length ; ++i) {
			var oneCrate = this.world.crates[i];
			this.overlayContext.fillStyle = "#a52";
			var halfSize = 2+oneCrate.y/10;
			this.overlayContext.fillRect(128+2*oneCrate.x-halfSize, 640-2*oneCrate.z-halfSize, 2*halfSize, 2*halfSize);
		}
		
		// explosions
		for (var i=0; i<this.world.explosions.length ; ++i) {
			var oneExplosion = this.world.explosions[i];
			var time = this.world.timer - oneExplosion.t0;
			this.explosions[i].material.diffuseColor =  new BABYLON.Color3(1, time<13 ? 1 : 2-time/13, 1-time/25);
			this.overlayContext.fillStyle = "rgb(255,"+(time<25 ? 255 : 500-time*20)+","+(255-time*10)+")";
			this.overlayContext.beginPath();
			this.overlayContext.arc(128+2*oneExplosion.x, 640-2*oneExplosion.z, oneExplosion.range*(time/25), 0, 2*Math.PI);
			this.overlayContext.fill();
		}
	
		this.overlayContext.restore();
	},

	
	/**
	 * Update contents and position of items in the 3D scene graph
	 * (move tanks, bullets, ...)
	 * Call this before triggering Babylon refresh
	 */
	updateSceneGraph : function() {
			
		for (var i=0; i<this.world.playerData.length; ++i) {
		
			var currentPlayer = this.world.playerData[i];
			this.tankParent[i].position.x = currentPlayer.x;
			this.tankParent[i].position.y = currentPlayer.y	+ .5;
			this.tankParent[i].position.z = currentPlayer.z;
			this.tank[i].rotation.y = -currentPlayer.dir;
			
			this.turret[i].rotation.y = -currentPlayer.aimY;
			this.cannon[i].rotation.z =  currentPlayer.aimH;
		}
		
		for (var i=0; i<this.world.beacons.length; ++i) {
			var currentBeacon = this.world.beacons[i];
			if (currentBeacon > -1) {
				this.beacon[i].material.emissiveColor = this.playerColors[currentBeacon];
				for (var j=0; j<5; ++j) {
					var t = (j+(this.world.timer%80)/16)%5;
					this.beaconBeam[i][j].setEnabled(true);
					this.beaconBeam[i][j].position.y = 5*t;
					this.beaconBeam[i][j].scaling = new BABYLON.Vector3 (5+3*t, 5+3*t ,5+3*t);
					this.beaconBeam[i][j].material.diffuseColor = this.playerColors[currentBeacon];
					this.beaconBeam[i][j].material.alpha = 1-t/5;
				}
			}
		}
		
		// shells
		for (var i=0; i<this.world.shells.length; ++i) {
			var currentShell = this.world.shells[i];
			if (i>=this.shells.length) {
				this.shells.push(BABYLON.MeshBuilder.CreateSphere("shell"+i, {diameter: 1}, this.scene));
				var shellMaterial = new BABYLON.StandardMaterial('shellMat', this.scene);
				this.shells[i].material = shellMaterial;
			} else {
				this.shells[i].setEnabled(true);
			}
			if (currentShell.timer & 16) {	// delayed shells blink red, others stay a dull gray
				this.shells[i].material.diffuseColor =  new BABYLON.Color3(1, 0, 0);
			} else {
				this.shells[i].material.diffuseColor =  new BABYLON.Color3(.2, .2, .2);
			}
			this.shells[i].position.x = currentShell.x;
			this.shells[i].position.y = currentShell.y;
			this.shells[i].position.z = currentShell.z;
		}
		for (var i=this.world.shells.length ; i<this.shells.length; ++i) {
			// remove one shell
			this.shells[i].setEnabled(false);
		}
		
		// crates
		for (var i=0; i<this.world.crates.length; ++i) {
			var currentCrate = this.world.crates[i];
			if (i>=this.crates.length) {
				this.crates.push(BABYLON.MeshBuilder.CreateBox("crate"+i, {size: 4}, this.scene));
				this.crates[i].material = this.crateMaterial;
			} else {
				this.crates[i].setEnabled(true);
			}
			this.crates[i].position.x = currentCrate.x;
			this.crates[i].position.y = currentCrate.y;
			this.crates[i].position.z = currentCrate.z;
		}
		for (var i=this.world.crates.length ; i<this.crates.length; ++i) {
			// remove one crate
			this.crates[i].setEnabled(false);
		}
		
		// explosions
		var groundScarred = false;
		for (var i=0; i<this.world.explosions.length; ++i) {
			var currentExplosion = this.world.explosions[i];
			if (i>=this.explosions.length) {
				this.explosions.push(BABYLON.MeshBuilder.CreateSphere("explosion"+i, {diameter: 1 }, this.scene));
				var explosionMaterial = new BABYLON.StandardMaterial('explosionMat', this.scene);
				this.explosions[i].material = explosionMaterial;
			} else {
				this.explosions[i].setEnabled(true);
			}
			this.explosions[i].position.x = currentExplosion.x;
			this.explosions[i].position.y = currentExplosion.y;
			this.explosions[i].position.z = currentExplosion.z;
			
			var time = this.world.timer - currentExplosion.t0;
			var radius = currentExplosion.range*(.15+Math.sqrt(time/25));
			this.explosions[i].scaling = new BABYLON.Vector3(radius, radius, radius);
			this.explosions[i].material.diffuseColor =  new BABYLON.Color3(1, time<13 ? 1 : 2-time/13, 1-time/25);
			this.explosions[i].material.alpha=time<13 ? 1 : 2-time/13;
			
			// darken the ground below the explosion
			var distanceToGround = currentExplosion.y - this.world.landscapeHeightAtFloat(currentExplosion.x, currentExplosion.z);
			if (distanceToGround < radius) {
				var groundRadius = Math.sqrt(radius*radius-distanceToGround*distanceToGround);
				this.groundTextureContext.fillStyle="rgba(0,0,0,.05)";
				this.groundTextureContext.beginPath();
				this.groundTextureContext.arc(currentExplosion.x*4, 1024-currentExplosion.z*4, groundRadius*4, 0, 2*Math.PI);
				this.groundTextureContext.fill();
				groundScarred = true;
			}
			
			// put a point light at the explosion
			this.expLight.setEnabled(true);
			this.expLight.position.x = currentExplosion.x;
			this.expLight.position.y = currentExplosion.y+radius+10;
			this.expLight.position.z = currentExplosion.z;
			this.expLight.intensity = .5 * Math.sqrt(currentExplosion.range) * (1 - Math.sqrt(time/25));
		}
		for (var i=this.world.explosions.length ; i<this.explosions.length; ++i) {
			this.explosions[i].setEnabled(false);
		}
		if (groundScarred) {
			this.groundTexture.update();
		}
		if (this.world.explosions.length < 1) {
			this.expLight.setEnabled(false);
		}
		
		// camera
		var currentPlayer = this.world.playerData[this.world.playerId];
		if (this.world.useDroneView) {
			this.camera.position.x = currentPlayer.droneX;
			this.camera.position.y = currentPlayer.droneY;
			this.camera.position.z = currentPlayer.droneZ;
			this.camera.setTarget(new BABYLON.Vector3(this.camera.position.x,0,this.camera.position.z));
			this.vrHelper.currentVRCamera.position.x = currentPlayer.droneX;
			this.vrHelper.currentVRCamera.position.y = currentPlayer.droneY;
			this.vrHelper.currentVRCamera.position.z = currentPlayer.droneZ;
			this.vrHelper.currentVRCamera.setTarget(new BABYLON.Vector3(this.camera.position.x,0,this.camera.position.z));
			
		} else {
			var showDir = Math.PI/2 - currentPlayer.aimY;
			this.camera.position.x = currentPlayer.x - 20 * Math.sin(showDir);
			this.camera.position.y = currentPlayer.y + 12;
			this.camera.position.z = currentPlayer.z - 20 * Math.cos(showDir);
			this.camera.rotation.x = .2;
			this.camera.rotation.y = showDir;
			this.camera.rotation.z = 0;
			this.vrHelper.currentVRCamera.position.x = currentPlayer.x - 20 * Math.sin(showDir);
			this.vrHelper.currentVRCamera.position.y = currentPlayer.y + 12;
			this.vrHelper.currentVRCamera.position.z = currentPlayer.z - 20 * Math.cos(showDir);
		}
		
	},
	
	
	/**
	 * Draw the status information (weapons, charge, health)
	 * Private method called by drawMain()
	 */
	drawStatus : function() {
		var left = this.windowLayout.playArea[0]-220;
		this.overlayContext.fillStyle="rgba(0,0,0,.25)";
		this.overlayContext.fillRect(left-20, 0, 240, 240);
		var player = this.world.playerData[this.world.playerId];

		this.overlayContext.strokeStyle="#fff";
		this.overlayContext.strokeRect(left, 20, 200, 16);
		this.overlayContext.fillStyle="#08c";
		this.overlayContext.fillRect(left, 20, 2*this.world.playerData[this.world.playerId].hp, 16);
		this.overlayContext.fillStyle="#fff";
		this.overlayContext.fillText("A r m o r", left+40, 32);

		this.overlayContext.strokeRect(left, 40, 200, 16);
		if (player.reload) {
			this.overlayContext.fillStyle="#fc0";
			this.overlayContext.fillRect(left, 40, 4*this.world.playerData[this.world.playerId].reload, 16);
			this.overlayContext.fillStyle="#fff";
			this.overlayContext.fillText("Reloading", left+40, 52);
			
		}
		
		this.overlayContext.fillText("Q/D : Turn left/right", left, 72);
		this.overlayContext.fillText("Z/S : Accelerate fwd/back", left, 92);
		
		if (player.droneY < -1) {
			this.overlayContext.fillStyle="#777";
			this.overlayContext.fillText("Space : drone expended", left, 112);
			this.overlayContext.fillStyle="#fff";
		} else {
			this.overlayContext.fillText("Space : "+(player.droneX==0 ? "Launch drone" : (this.world.useDroneView?"Main view":"Drone view")), left, 112);
		}
		this.overlayContext.fillText("RMB : Change ordnance : ", left, 132);
		var y = 152;
		for (var i=0; i<player.weapons.length; ++i) {
			if (player.weapons[i]) {
				this.overlayContext.fillText(this.weaponName[i]+" : "+player.weapons[i], left+20, y);
				if (player.currentWeapon == i) {
					this.overlayContext.strokeRect(left, y-12, 200, 16);
				}
				y+=20;
			}
		}
		
		this.overlayContext.fillText("Beacons", left, 212);
		this.overlayContext.strokeStyle="#fff";
		this.overlayContext.strokeRect(left+56, 200, 144, 16);
		var x=left+56;
		for (var i=0 ;i<this.world.playerData.length; ++i) {
			if (this.world.playerData[i].beacons) {
				this.overlayContext.fillStyle=this.playerColor[i];
				this.overlayContext.fillRect(x, 200, this.world.playerData[i].beacons*9, 16);
				this.overlayContext.fillStyle="#000";
				this.overlayContext.textAlign="center";
				this.overlayContext.fillText(this.world.playerData[i].beacons, x+this.world.playerData[i].beacons*4.5, 212);
				x+=this.world.playerData[i].beacons*9;
			}
		}
		this.overlayContext.textAlign="left";

		
		this.overlayContext.save();
		// time
		this.overlayContext.fillStyle="#aaa";
		this.overlayContext.strokeStyle="#558";
		this.overlayContext.textAlign="center";
		var text = "";
		if (this.world.timer <= -50) {
			text = "";
		} else if (this.world.timer < 0) {
			text = "Get ready !";
		} else if (this.world.timer < 25) {
			text = "Go !";
		} else {
			var minutes = Math.floor((3000-this.world.timer)/1500);
			var seconds = Math.floor((3000-this.world.timer)/25)%60;
			text = minutes+":"+(seconds<10?"0":"")+seconds
		}
		this.outlineText(text, this.overlayCanvas.width/2, 40, 32);

		var messageTimer = this.world.timer - this.world.messageTimer;
		if (messageTimer<50) {
			this.overlayContext.fillStyle="rgba(205, 128, 52, "+(1-messageTimer/50)+")";
			this.overlayContext.strokeStyle="rgba(41, 25, 10, "+(1-messageTimer/50)+")";
			this.outlineText(this.world.message, this.overlayCanvas.width/2, this.overlayCanvas.height/2-50-messageTimer, 32);
		}
		this.overlayContext.fillStyle="#aaa";
		this.overlayContext.strokeStyle="#558";

		this.overlayContext.restore();
	}
	

}