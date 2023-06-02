class World
{
	static HextoRGB(hex)
	{
		let rgb = [];
		let frac = 0xff
		rgb[0] = ((hex & 0xff0000) >> 16) / frac;
		rgb[1] = ((hex & 0xff00) >> 8) / frac;
		rgb[2] = (hex & 0xff) / frac;
		return rgb;
	}
	constructor()
	{
		this.events =
		{
			onKeyUp:null,
			onKeyDown:null
		};
		document.addEventListener('keydown', (event) =>
		{
			if(this.events.onKeyDown)
			{
				this.events.onKeyDown(event);
			}
		});
		document.addEventListener('keyup', (event) =>
		{
			if(this.events.onKeyUp)
			{
				this.events.onKeyUp(event);
			}
		});
		let vertexShaderSource = 
		`attribute vec4 aVertexPosition;
		attribute vec3 aVertexNormal;
		
		uniform mat4 uProjectionMatrix;
		uniform mat4 uNormalMatrix;
		
		varying vec3 aVertexColor;

		varying highp vec3 vLighting;

		void main()
		{
			gl_Position=uProjectionMatrix * aVertexPosition;

			// Apply lighting effect

			highp vec3 ambientLight = vec3(0.4, 0.4, 0.4);
			highp vec3 directionalLightColor = vec3(1, 1, 1);
			highp vec3 directionalVector = normalize(vec3(0.85, 1, 0.75));

			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);

			aVertexColor=mat3(uNormalMatrix)* aVertexNormal;
		}`;
		let fragmentShaderSource = 
		`precision mediump float;
		varying highp vec3 vLighting;
		varying vec3 aVertexColor;
		uniform vec4 e;
		void main()
		{
			vec3 f=normalize(aVertexColor);
			gl_FragColor=e;
			gl_FragColor.rgb *= vLighting;
		}`;

		this.glCanvas = document.getElementById('glcanvas');
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.glCanvas.style.background = "#00bfff";
		this.ctx.font = "32px Comic Sans MS";
		this.ctx.fillStyle = "red";
		this.ctx.textAlign = "left";
		this.gl = this.glCanvas.getContext("webgl");
		this.webglUtils = new WebGLUtils(this.gl);
		this.m4 = new M4();
		this.program = this.webglUtils.createProgramFromSources([vertexShaderSource, fragmentShaderSource]);
		
		this.hudItems = [];
		// Tell WebGL how to convert from clip space to pixels

		// look up where the vertex data needs to go.
		this.positionLocation = this.gl.getAttribLocation(this.program, "aVertexPosition");
		this.normalLocation = this.gl.getAttribLocation(this.program, "aVertexNormal");

		// lookup uniforms
		this.worldViewProjectionLocation = this.gl.getUniformLocation(this.program, "uProjectionMatrix");
		this.worldInverseTransposeLocation = this.gl.getUniformLocation(this.program, "uNormalMatrix");
		this.colorLocation = this.gl.getUniformLocation(this.program, "e");
		this.zMin = 0;
		this.zMax = 50;
		this.timers = [];
		this.children = [] //children spatials
		this.renderSpatials = [];
		this.aspect = this.gl.canvas.width / this.gl.canvas.height;
		this.fieldOfView = Math.PI / 3;
		this.projSize = 10
		this.xScreen = this.projSize * this.aspect * 2;
		this.yScreen = this.projSize * 2;
		
		this.projectionMatrix = this.orthographicProjection();
		
		this.camera = new Camera(this, [0, 0, 0], [0, 0, 0]);

		// Turn on the position attribute
		this.gl.enableVertexAttribArray(this.positionLocation);

		// Turn on the normal attribute
		this.gl.enableVertexAttribArray(this.normalLocation);

		this.cubeNormalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeNormalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Cube.VertexNormals,
			this.gl.STATIC_DRAW);

		// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		let size = 3;          // 3 components per iteration
		let type = this.gl.FLOAT;   // the data is 32bit floats
		let normalize = false; // don't normalize the data
		let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		let offset = 0;        // start at the beginning of the buffer

		this.gl.vertexAttribPointer(
			this.normalLocation, size, type, normalize, stride, offset);

		this.cubeIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer);
		
		// Now send the element array to GL

		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(Cube.Indices), this.gl.STATIC_DRAW);

		this.webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);

		// Tell WebGL how to convert from clip space to pixels
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		this.gl.enable(this.gl.CULL_FACE);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.useProgram(this.program);

		this.timeRef = 0;
		this.collisionGrid = null;
		this.timers = [];
		this.renderActivated = true;
		this.reStarted = true;
		this.maxFrameTime = 0.2;
		this.requestID = requestAnimationFrame(this.render.bind(this));
		this.calcRenderSpatialsFlag = false;
		this.collisionSpatials= []; //array of spatials that will be tested for collisions every frame
	}
	perspectiveProjection()
	{
		return this.m4.perspective(this.fieldOfView, this.aspect, 0.1, 999);
	}
	orthographicProjection()
	{
		return this.m4.orthographic(-this.projSize * this.aspect, this.projSize * this.aspect, -this.projSize, this.projSize, this.zMin, this.zMax)
	}
	render(time)
	{
		if(this.calcRenderSpatialsFlag)
		{
			//this.calcRenderSpatials();
			this.renderSpatials = this.calcRenderSpatialsRecursively();
			this.renderSpatials.forEach((spatial) =>
			{
				this.calcWorldPos(spatial);
				this.calcMatrix(spatial);
			});
			this.calcRenderSpatialsFlag = false;
		}
		let deltaTimeSec = (time - this.timeRef) / 1000;
		this.timeRef = time;
		if(deltaTimeSec > this.maxFrameTime)
		{
		  deltaTimeSec = this.maxFrameTime;
		}

		// Tell WebGL how to convert from clip space to pixels

		// Clear the canvas AND the depth buffer.
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		let viewProjectionMatrix = this.m4.multiply(this.projectionMatrix, this.camera.viewMatrix);

		this.renderSpatials.forEach((spatial) =>
		{

			spatial.position[0] += spatial.speed[0] * deltaTimeSec;
			spatial.position[2] += spatial.speed[1] * deltaTimeSec;
			this.calcWorldPos(spatial);
			spatial.yRotation += spatial.yAngularVelocity * deltaTimeSec;
			spatial.zRotation += spatial.zAngularVelocity * deltaTimeSec;
			this.calcMatrix(spatial);
			
			if(spatial.cube)
			{
				// Turn on the position attribute

				// Bind the position buffer.
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, spatial.cube.positionBuffer);

				// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
				let size = 3;          // 3 components per iteration
				let type = this.gl.FLOAT;   // the data is 32bit floats
				let normalize = false; // don't normalize the data
				let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
				let offset = 0;        // start at the beginning of the buffer
				this.gl.vertexAttribPointer(
					this.positionLocation, size, type, normalize, stride, offset);

				// Multiply the matrices.
				let worldViewProjectionMatrix = this.m4.multiply(viewProjectionMatrix, spatial.matrix);
				let worldInverseMatrix = this.m4.inverse(spatial.matrix);
				let worldInverseTransposeMatrix = this.m4.transpose(worldInverseMatrix);

				// Set the matrices
				this.gl.uniformMatrix4fv(this.worldViewProjectionLocation, false, worldViewProjectionMatrix);
				this.gl.uniformMatrix4fv(this.worldInverseTransposeLocation, false, worldInverseTransposeMatrix);

				// Set the color to use
				this.gl.uniform4fv(this.colorLocation, [...spatial.cube.color, 1]);

				// Draw the geometry.

				let vertexCount = 36;
				type = this.gl.UNSIGNED_SHORT;
				this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
			}

			
			
		});

		this.doCollisionSpatials();

		this.timers.forEach((timer) =>
		{
			timer.update(deltaTimeSec);
		});
		this.update(deltaTimeSec);
		this.renderSpatials.forEach((spatial) =>
		{
			if(spatial.active)
			{
				spatial.update(deltaTimeSec);
			}
		});

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		let hudText = "";
		this.hudItems.forEach((item) =>
		{
			hudText += item;
		})
		this.ctx.fillText(hudText, 0, this.canvas.height/2);
		this.requestID = requestAnimationFrame(this.render.bind(this));
	}
	doCollisionSpatials()
	{
		let collisions = [];
		this.collisionSpatials.forEach((spatial) =>
		{
			this.collisionSpatials.forEach((testSpatial) =>
			{
				if(spatial !== testSpatial)
				{
					let halfWidth = spatial.size[0] / 2;
					let halfWidthTest = testSpatial.size[0] / 2;
					let halfHeight = spatial.size[1] / 2;
					let halfHeightTest = testSpatial.size[1] / 2;
					let gapX = halfWidth + halfWidthTest;
					let gapZ = halfHeight + halfHeightTest;
					if((spatial.collisionGroup & testSpatial.constructor.CollisionID) &&
						Math.abs(testSpatial.worldPosition[0] - spatial.worldPosition[0]) < gapX &&
						Math.abs(testSpatial.worldPosition[2] - spatial.worldPosition[2]) < gapZ)
					{
						if(!collisions.find((item) =>
						{
							return item.some((collidedSpatial) =>
							{
								return collidedSpatial === spatial || collidedSpatial === testSpatial;
							});
						}))
						{
							collisions.push([spatial, testSpatial]);
						}
					}
				}
			});
		});
		collisions.forEach((collision) =>
		{
			collision[0].onCollide.dispatch(collision[0], collision[1]);
			collision[1].onCollide.dispatch(collision[1], collision[0]);
		});
	}
	addCollisionSpatial(spatial)
	{
		if(!this.collisionSpatials.includes(spatial))
		{
			this.collisionSpatials.push(spatial);
		}
		return spatial;
	}
	removeCollisionSpatial(spatial)
	{
		let index = this.collisionSpatials.findIndex((item) =>
		{
			return item === spatial;
		});
		if(index >= 0)
		{
			this.collisionSpatials.splice(index, 1);
		}
		return spatial;
	}
	removeCollisionSpatials(spatials)
	{
		spatials.forEach((spatial) =>
		{
			this.removeCollisionSpatial(spatial);
		});
	}

	addChild(spatial, parent = this)
	{
		if(spatial.parent)
		{
			this.removeChild(spatial);
		}
		parent.children.push(spatial);
		spatial.parent = parent;
		
		this.calcRenderSpatialsFlag = true;
		
		return spatial;
	}
	addChildren(children, parent)
	{
		children.forEach((child) =>
		{
			this.addChild(child, parent);
		});
		this.calcRenderSpatialsFlag = true;
	}
	removeChild(spatial)
	{
		// remove spatial from world
		spatial.parent.children.splice(spatial.parent.children.findIndex((refSpatial) =>
		{
			return refSpatial === spatial;
		}), 1);
		spatial.parent = null;
		this.calcRenderSpatialsFlag = true;
	}
	removeChildren(children)
	{
		children.forEach((child) =>
		{
			this.removeChild(child);
		});
		this.calcRenderSpatialsFlag = true;
	}
	removeAllChildren(parent = this)
	{
		while(parent.children.length > 0)
		{
			this.removeChild(parent.children[0]);
		}

		this.calcRenderSpatialsFlag = true;
	}
	calcWorldPos(spatial)
	{
		spatial.worldPosition = [...spatial.position];
		let currentParent = spatial.parent;
		if(currentParent === this)
		{
			spatial.worldPosition = [...spatial.position];
		}
		while(currentParent !== this)
		{
			if(!currentParent)
			{
				spatial.worldPosition = [0, 0, 0];
				break;
			}
			spatial.worldPosition[0] += currentParent.position[0];
			spatial.worldPosition[1] += currentParent.position[1];
			spatial.worldPosition[2] += currentParent.position[2];
			currentParent = currentParent.parent;
		}
	}
	calcMatrix(spatial)
	{
		if(spatial.parent !== this)
		{
			spatial.matrix = spatial.parent.matrix;
			spatial.matrix = this.m4.translate(spatial.matrix,
				spatial.position[0],
				spatial.position[1],
				spatial.position[2]);
			spatial.matrix = this.m4.zRotate(spatial.matrix, spatial.zRotation);
			spatial.matrix = this.m4.yRotate(spatial.matrix, spatial.yRotation);
		}
		else
		{
			spatial.matrix = this.m4.identity();
			spatial.matrix = this.m4.translate(spatial.matrix,
				spatial.worldPosition[0],
				spatial.worldPosition[1],
				spatial.worldPosition[2]);    
			spatial.matrix = this.m4.zRotate(spatial.matrix, spatial.zRotation);
			spatial.matrix = this.m4.yRotate(spatial.matrix, spatial.yRotation);
		}
	}
	calcRenderSpatialsRecursively(parent = this, children = [])
	{
		let subChildren = parent.children;
		if(parent !== this)
		{
			children.push(parent);
		}
		subChildren.forEach((spatial) =>
		{	
			if(spatial.visible)
			{
				children = this.calcRenderSpatialsRecursively(spatial, children);
			}
		});
		return children;
		
	}
	update(deltaTimeSec)
	{

	}
	stop()
	{
		this.renderActivated = false;
	}
	start()
	{
		this.renderActivated = true;
		this.reStarted = true;
	}
	isoCoordToScreen(x3d, y3d, z3d)
    {
        let x2d = (x3d - z3d) / Math.sqrt(2);
        let y2d = (x3d - (2 * y3d) + z3d) / Math.sqrt(6);
        return[x2d, y2d];
    }
    screenToIsoCoord(x2d, y2d, y3d)
    {
        let z3d = (Math.sqrt(6) * y2d - Math.sqrt(2) * x2d + 2 * y3d) / 2;
        let x3d = Math.sqrt(2) * x2d + z3d;
        return [x3d, y3d, z3d];
    }
}

class Cube
{
	static get VertexNormals()
	{
		return new Float32Array(
		[
			// Front
			0,  0,  1,
			0,  0,  1,
			0,  0,  1,
			0,  0,  1,

			// Back
			0,  0, -1,
			0,  0, -1,
			0,  0, -1,
			0,  0, -1,

			// Top
			0,  1,  0,
			0,  1,  0,
			0,  1,  0,
			0,  1,  0,

			// Bottom
			0, -1,  0,
			0, -1,  0,
			0, -1,  0,
			0, -1,  0,

			// Right
			1,  0,  0,
			1,  0,  0,
			1,  0,  0,
			1,  0,  0,

			// Left
			-1,  0,  0,
			-1,  0,  0,
			-1,  0,  0,
			-1,  0,  0
		]);
	} 
	static get Indices()
	{
		return(
		[
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23,   // left
		]);
	}
	constructor(gl, size = [1, 1, 1], color = [0, 1, 0])
	{
		this.doPositions = () =>
		{
			this.positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

			let halfSize = [this.size[0] / 2, this.size[1] / 2, this.size[2] / 2];

			let positions = 
			new Float32Array
			([
				-halfSize[0], -halfSize[1],  halfSize[2],
				halfSize[0], -halfSize[1],  halfSize[2],
				halfSize[0],  halfSize[1],  halfSize[2],
				-halfSize[0],  halfSize[1],  halfSize[2],
			
				// Back face
				-halfSize[0], -halfSize[1], -halfSize[2],
				-halfSize[0],  halfSize[1], -halfSize[2],
				halfSize[0],  halfSize[1], -halfSize[2],
				halfSize[0], -halfSize[1], -halfSize[2],
			
				// Top face
				-halfSize[0],  halfSize[1], -halfSize[2],
				-halfSize[0],  halfSize[1],  halfSize[2],
				halfSize[0],  halfSize[1],  halfSize[2],
				halfSize[0],  halfSize[1], -halfSize[2],
			
				// Bottom face
				-halfSize[0], -halfSize[1], -halfSize[2],
				halfSize[0], -halfSize[1], -halfSize[2],
				halfSize[0], -halfSize[1],  halfSize[2],
				-halfSize[0], -halfSize[1],  halfSize[2],
			
				// Right face
				halfSize[0], -halfSize[1], -halfSize[2],
				halfSize[0],  halfSize[1], -halfSize[2],
				halfSize[0],  halfSize[1],  halfSize[2],
				halfSize[0], -halfSize[1],  halfSize[2],
			
				// Left face
				-halfSize[0], -halfSize[1], -halfSize[2],
				-halfSize[0], -halfSize[1],  halfSize[2],
				-halfSize[0],  halfSize[1],  halfSize[2],
				-halfSize[0],  halfSize[1], -halfSize[2],
			]);

			// Now pass the list of positions into WebGL to build the
			// shape. We do this by creating a Float32Array from the
			// JavaScript array, then use it to fill the current buffer.

			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
		}
		this._sizeAlias = []
		this.color = color;
		this.positionBuffer = null;
		this.size = size;
	}
	set size(size)
	{
		this._sizeAlias = size;
		this.doPositions();
	}
	get size()
	{
		return this._sizeAlias;
	}
}

class Spatial
{
	static get CollisionID()
	{
		return 0;
	}
	constructor(world, position = [0, 0, 0], cube = null)
	{
		this.world = world;
		this.position = position;
		this.parent = null;
		this.cube = cube;
		this.worldPosition = [0, 0, 0];
		this.visible = true;
		this.children = [];
		this.yRotation = 0;
		this.zRotation = 0;
		this.yAngularVelocity = 0;
		this.zAngularVelocity = 0;
		this.matrix = [];
		this.speed = [0, 0];
		this.collisionGroup = null;
		this.onCollide = new Signal();
		this.active = true;
		this.size = [1, 1];
		this.health = 1;
	}
	poolReset()
	{
		//reset object when put into pool
		this.position = [0,0,0]
		this.speed = [0,0]
		this.zRotation = 0;
		this.yRotation = 0;
		this.health = 1;
	}
	poolSet(objectArgs)
	{
		//set obtained objects
		this.position = objectArgs.position || [0, 0, 0];
		this.active = true;
	}
	setVisible(visible)
	{
		this.visible = visible;
		this.world.calcRenderSpatialsFlag = true;
	}
	update(deltaTimeSec)
	{

	}
	destroy()
	{

	}
}

class Camera
{
	constructor(world, position, target, up = [0, 1, 0])
	{
		this.world = world;
		this.target = target;
		this.position = position;
		this.up = up;
		this.cameraMatrix = null
		this.viewMatrix = null; 
		this._calcMatrixes();
	}    
	_calcMatrixes()
	{
		this.cameraMatrix = this.world.m4.lookAt(this.position, this.target, this.up);
		this.viewMatrix = this.world.m4.inverse(this.cameraMatrix);
	}
	setProperties(position = this.position, target = this.target, up = this.up, orthographic = true)
	{
		this.target = target;
		this.position = position;
		this.up = up;
		this._calcMatrixes();
	}
}

class Pool
{
	//object pool class
	constructor()
	{
		this._pool = new Array();
	}
	free(object)
	{
		object.poolReset();
		this._pool.push(object);
	}
	freeAll(objects)
	{
		for(let i = 0; i < objects.length; i++)
		{
			this.free(objects[i]);
		}
	}
	obtain(objectArgs)
	{
		let returnObj = null;
		if(this._pool.length > 0)
		{
			returnObj = this._pool.pop()
			returnObj.poolSet(objectArgs);
		}
		else
		{
			//create new object
			returnObj = this.newObject(objectArgs);
		}
		return returnObj;
	}
	newObject(objectArgs)
	{
		//override me
		return {};
	}
}

class Timer
{
	constructor(world, minTime, maxTime = minTime, addToWorld = true)
	{
		this.world = world;
		this.minTime = minTime;
		this.maxTime = maxTime;
		this.endTime = 0;
		this.timer = 0;
		this.complete = false;
		this.onComplete = null;
		this.active = false;
		this.reset(this.active);
		if(addToWorld)
		{
			world.timers.push(this);
		}
	}
	update(deltaTimeSec)
	{
		if(!this.complete && this.active)
		{
			this.timer += deltaTimeSec;
			if(this.timer > this.endTime)
			{
				this.complete = true;
				if(this.onComplete)
				{
					this.onComplete(this);
				}
			}
		}
	}
	removeFromWorld()
	{
		this.world.timers.splice(this.world.timers.findIndex((item) => {return item === this}), 1);
	}
	
	reset(active, minTime = this.minTime, maxTime = this.maxTime)
	{
		this.endTime = MathsFunctions.RandomFloat(minTime, maxTime)
		this.active = active;
		this.complete = false;
		this.timer = 0;
	}
}

class Signal
{
	constructor()
	{
		this.listeners = [];
	}
	dispatch(...args)
	{
		this.listeners.forEach((listener) =>
		{
			listener.callback(...args);
		});
	}
	addListener(callback, terminate = false)
	{
		let listener = new Listener(callback, terminate);
		this.listeners.push(listener);
		return listener;
	}
	removeListener(listener)
	{
		this.listeners.splice(this.listeners.findIndex((item) =>
		{
			return item === listener;
		}), 1);
	}
	clearListeners()
	{
		this.listeners.length = 0;
	}
}

class Listener
{
	constructor(callback,  terminate = false)
	{
		this.callback = callback;
		this.terminate = terminate;
	}
}

class MathsFunctions
{
	static RandomInt(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
	static RandomIntInclusive(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
	}
	static RandomFloat(min, max)
	{
		return Math.random() * (max - min) + min;
	}
	static RandomPick(array)
	{
		return array[MathsFunctions.RandomPickIndex(array)];
	}
	static RandomPickIndex(array)
	{
		return MathsFunctions.RandomInt(0, array.length);
	}
	static DisSq(pos1, pos2)
	{
		//distance squared on x,z axis
		return Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2);
	}
	static Dis(pos1, pos2)
	{
		//distance
		return Math.sqrt(MathsFunctions.DisSq(pos1, pos2));
	}
	static NormalizeAngle(ang)
	{
		if(ang < 0)
		{
			ang = (ang % (Math.PI * 2)) + Math.PI * 2;
		}
		else if(ang > Math.PI * 2)
		{
			ang = (ang % (Math.PI * 2));
		} 
		return ang;
	}
	static ArrayMaxIndex(array, callback)
	{
		let currentMax = Number.MIN_SAFE_INTEGER;
		let maxIndex = 0;
		array.forEach((element, index) =>
		{
			let val = callback(element);
			if(val < currentMax)
			{
				currentMax = val;
				maxIndex = index;
			}
		});
		return maxIndex;
	}
}

class CubicBezier
{
	constructor(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y)
	{
		this.p1x = p1x;
		this.p1y = p1y;
		this.p2x = p2x;
		this.p2y = p2y;
		this.p3x = p3x;
		this.p3y = p3y;
		this.p4x = p4x;
		this.p4y = p4y;
	}
	pos(t)
	{
		return(
		[
			(1-t)**3*this.p1x + 3*(1-t)**2*t*this.p2x + 3*(1-t)*t**2*this.p3x + t**3*this.p4x,
			(1-t)**3*this.p1y + 3*(1-t)**2*t*this.p2y + 3*(1-t)*t**2*this.p3y + t**3*this.p4y
		]);
	}
}