var NORMAL_SPEED = 1;

var currentScore = 0;
var highScore = 0;

var State = {MENU: 0, GAMEPLAY: 1, GAMEOVER: 2};
var currentState = State.MENU;

function addPoints(amount){
	currentScore += amount;
	if(currentScore > highScore){
		highScore = currentScore;
	}
	document.getElementById("score").setAttribute("text", {
		value: "Score: " + currentScore + "\nHigh Score: " + highScore
	});
}

//[min, max)
function randRange(min, max){
    return Math.random() * (max - min + 1) + min;
}

function startGame(){
	currentState = State.GAMEPLAY
	//Change text to score
	currentScore = 0;
	addPoints(0);
	
	for(var i = 0; i < 16; i++){
		var fishX = randRange(-6, 6);
		var fishY = randRange(0.5, 4);
		var fishZ = randRange(-6, -3);
		spawnFishAt(fishX, fishY, fishZ);
	}
	
	var timerEl = document.getElementById("time");
	timerEl.emit("startTimer");
	document.getElementById("title").setAttribute("visible", false);
}

function endGame(){
	currentState = State.GAMEOVER;
	gameOverSound.play();
	var startingFish = document.getElementById("starting-fish");
	startingFish.setAttribute("visible", true);
	startingFish.emit("reappear");
	
	document.getElementById("right-controller").emit("resetHook");
	document.getElementById("left-controller").emit("resetHook");
	
	var fishEls = document.getElementById("fish-spawn-root").querySelectorAll("*");
	for(var i = 0; i < fishEls.length; i++){
		if(fishEls[i].caught){
			fishEls[i].parentNode.removeChild(fishEls[i]);
		}
		fishEls[i].emit("swimAway");
	}
	document.getElementById("title").setAttribute("visible", true);
}

AFRAME.registerShader("sky-gradient", {
	schema: {
		topColor: {type: "vec3", default: {x: 0, y: 195, z: 255}, is: "uniform"},
		bottomColor: {type: "vec3", default: {x: 255, y: 255, z: 255}, is: "uniform"}
	},
	
	vertexShader: [
		'varying vec3 vWorldPosition;',
		'void main(){',
		'  vec4 worldPosition = modelMatrix * vec4(position, 1.0);',
		'  vWorldPosition = worldPosition.xyz;',
		'  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'
	].join("\n"),
	
	fragmentShader: [
		'uniform vec3 topColor;',
		'uniform vec3 bottomColor;',
		'varying vec3 vWorldPosition;',
		'void main(){',
		'  float h = normalize(vWorldPosition).y;',
		'  vec3 bCol = vec3(bottomColor.x/255.0, bottomColor.y/255.0, bottomColor.z/255.0);',
		'  vec3 tCol = vec3(topColor.x/255.0, topColor.y/255.0, topColor.z/255.0);',
		'  gl_FragColor = vec4(mix(bCol, tCol, max(pow(max(h , 0.0), 0.6), 0.0)), 1.0);',
		'}'
	].join("\n")
});

AFRAME.registerComponent("timer", {
	schema: {
		duration: {type: "number", default: 60}
	},
	
	init: function(){
		var el = this.el;
		el.duration = this.data.duration;
		el.timeLeft = el.duration;
		el.prevTime = el.timeLeft;
		el.isActive = false;
		el.spawnedRareFish = false;
		el.addEventListener("startTimer", function(e){
			el.spawnedRareFish = false;
			el.timeLeft = el.duration;
			el.prevTime = el.duration;
			if(document.monetization && document.monetization.state === 'started'){
				//Subscribers get 30 seconds extra
				el.timeLeft += 30;
				el.prevTime += 30;
			}
			el.setAttribute("text", {
				value: "Time left: " + el.duration
			});
			el.isActive = true;
		});
	},
	
	tick: function(time, deltaTime){
		var el = this.el;
		if(el.isActive){
			el.timeLeft -= deltaTime / 1000;
			var newTime = Math.floor(el.timeLeft);
			if(newTime < el.prevTime){
				el.prevTime = newTime;
				el.setAttribute("text", {
					value: "Time left: " + newTime
				});
			}
			if(newTime <= 0){
				el.isActive = false;
				endGame();
			}
			if(!el.spawnedRareFish && newTime <= 10){
				rareSound.play();
				//Spawn rare fish in the last 10 seconds
				el.spawnedRareFish = true;
				for(var i = 0; i < 3; i++){
					var fishX = randRange(-6, 6);
					var fishY = randRange(0.5, 4);
					var fishZ = randRange(-6, -3);
					spawnFishAt(fishX, fishY, fishZ, true);
				}
			}
		}
	}
});

AFRAME.registerComponent("hookshot", {	
	schema: {
		hand: {default: ""}
	},
	
	init: function(){
		var data = this.data;
		var el = this.el;
		var config = {
			hand: this.data.hand,
			model: false
		};
		el.setAttribute("vive-controls", config);
		el.setAttribute("oculus-touch-controls", config);
		
		if(this.data.hand === "right"){
			el.shot = document.getElementById("projectile");
		}
		else{
			el.shot = document.getElementById("projectile-left");
		}
		
		el.addEventListener("buttondown", function(){
			//Hook projectile, which is separate from the controller-tracked model
			var shot = el.shot;
			
			if(shot.isExtended){
				shot.isReturning = true;
				var p1 = shot.object3D.position;
				var p2 = el.object3D.position;
				shot.homePos = p2;
				var globalDir = new THREE.Vector3();
				globalDir.subVectors(p2, p1).normalize().multiplyScalar(9);
				shot.emit("updateVelocity", {x: globalDir.x, y: globalDir.y, z: globalDir.z}, false);
				shot.emit("updateGravity", {gravity: 0});
			}
			else{
				shot.isExtended = true;
				shot.setAttribute("visible", true);
				el.querySelector(".hook").setAttribute("visible", false);
				shot.setAttribute("position", el.object3D.position);
				shot.object3D.rotation.x = el.object3D.rotation.x;
				shot.object3D.rotation.y = el.object3D.rotation.y;
				shot.object3D.rotation.z = el.object3D.rotation.z;
				
				//Get the forward direction of this controller
				//Note: y and z are flipped in this operation, so the forward vector is in the y-axis
				var point = new THREE.Vector3(0, -1, 0);
				el.object3D.localToWorld(point);
				var globalDir = point.sub(el.object3D.position);
				var resultVel = globalDir.multiplyScalar(8);
				//Need to emit this event in order for the velocity to actually update
				//otherwise the element's properties (vel) carry over from before
				shot.emit("updateVelocity", {x: resultVel.x, y: resultVel.y, z: resultVel.z}, false);
				shot.emit("updateGravity", {gravity: -5});
			}
		});
		
		el.addEventListener("resetHook", function(e){
			el.shot.setAttribute("position", "0 0 0");
			el.shot.isReturning = false;
			el.shot.isExtended = false;
			el.shot.setAttribute("visible", false);
			el.querySelector(".hook").setAttribute("visible", true);
			el.shot.emit("updateVelocity", {x: 0, y: 0, z: 0}, false);
		});
	},
	
	tick: function(time, deltaTime){
		var el = this.el;
		if(el.shot.isReturning){
			var pos = el.shot.object3D.position;
			//If within 0.5m of the home position
			if(pos.distanceTo(el.shot.homePos) <= 0.5){
				this.resetHookshot();
			}
		}
		else{
			//Stop moving if hit the floor
			if(el.shot.object3D.position.y <= 0){
				el.shot.object3D.position.y = 0;
				el.shot.emit("updateVelocity", {x: 0, y: 0, z: 0}, false);
				el.shot.emit("updateGravity", {gravity: 0});
			}
		}
	},
	
	resetHookshot: function(){
		var el = this.el;
		el.shot.setAttribute("position", "0 0 0");
		el.shot.isReturning = false;
		el.shot.isExtended = false;
		el.shot.setAttribute("visible", false);
		el.querySelector(".hook").setAttribute("visible", true);
		el.shot.emit("updateVelocity", {x: 0, y: 0, z: 0}, false);
	}
});

AFRAME.registerComponent("fish", {
	schema: {
		radius: {type: "number", default: 0.4},
		color: {default: "#fcc201"}
	},
	
	init: function(){
		var vertices = [
			-1, 0, 0,    1, 0, 0,    0, 1, 0,    0, -1, 0,
			0, 0, 1,    0, 0, -1
		];
		//Order of vertices matters, needs to be counter-clockwise order when facing camera
		var indices = [
			0, 4, 2,    4, 1, 2,    4, 0, 3,   4, 3, 1,
			5, 0, 2,    5, 2, 1,   0, 5, 3,    5, 1, 3,
		];
		var geometry = new THREE.PolyhedronBufferGeometry( vertices, indices, this.data.radius, 0);
		var material = new THREE.MeshPhongMaterial( { color: this.data.color} );
		
		var bodyMesh = new THREE.Mesh(geometry, material);
		bodyMesh.scale.set(1.2, 1, 0.4);
		this.el.object3D.add(bodyMesh);
		
		var tailMesh = new THREE.Mesh(geometry, material);
		tailMesh.position.set(0.6, 0, 0);
		tailMesh.scale.set(0.4, 0.5, 0.2);
		this.el.object3D.add(tailMesh);
	}
});

AFRAME.registerComponent("hook-target", {
	schema: {
		startGame: {type: "boolean", default: false},
		isRare: {type: "boolean", default: false}
	},
	
	init: function(){
		var data = this.data;
		var el = this.el;
		el.deathTimer = 1 + Math.random();
		el.gameOverDelayTimer = 2;
		el.isReappearing = false;
		el.caught = false; //Whether it's caught by the hookshot or not
		el.isActive = true;
		el.hookshotLeft = document.getElementById("projectile-left");
		el.hookshotRight = document.getElementById("projectile");
		el.hookshot = null;
		el.firstElementChild.setAttribute("animation", "property: rotation; from: 0 -20 0; to: 0 20; dur: 250; loop: true; dir: alternate; startEvents: struggle; pauseEvents: relax");
		el.firstElementChild.setAttribute("animation__2", "property: rotation; from: 0 -20 0; to: 0 20; dur: 800; loop: true; dir: alternate; startEvents: swim; pauseEvents: struggle");
		el.addEventListener("hit", function(e){
			if(el.isActive && !el.caught){
				if((data.startGame && currentState === State.MENU) || currentState === State.GAMEPLAY){
					//Hacky way of getting the correct hookshot
					var distLeft = el.hookshotLeft.object3D.position.distanceTo(el.object3D.position);
					var distRight = el.hookshotRight.object3D.position.distanceTo(el.object3D.position);
					if(distRight < distLeft){
						el.hookshot = el.hookshotRight;
					}
					else{
						el.hookshot = el.hookshotLeft;
					}
					
					//Hack: for some reason this hit event triggers for all fish on game start if both hookshots are at origin,
					//need to manually check distance
					if(el.hookshot.object3D.position.distanceTo(el.object3D.position) <= 0.8){
						el.caught = true;
						fishSounds[fishNoteIndex++].play();
						if(fishNoteIndex > 4){
							fishNoteIndex = 4;
						}
						el.emit("updateVelocity", {x: 0, y: 0, z: 0}, false);
						el.firstElementChild.emit("struggle");
					}
				}
			}
		});
		//Scatter in a random direction and fade away
		el.addEventListener("swimAway", function(e){
			var theta = THREE.Math.degToRad(randRange(0, 360));
			var vx = 9 * Math.cos(theta);
			var vz = 9 * Math.sin(theta);
			el.emit("updateVelocity", {x: vx, y: 0, z: vz}, false);
			el.object3D.rotation.y = -theta + Math.PI;
			el.firstElementChild.emit("struggle");
		});
		el.addEventListener("reappear", function(e){
			el.isReappearing = true;
		});
		el.addEventListener("relax", function(e){
			el.firstElementChild.object3D.rotation.y = 0;
		});
		if(!data.startGame){
			el.firstElementChild.emit("swim");
		}
	},
	
	tick: function(time, deltaTime){
		var el = this.el;
		var data = this.data;
		
		if(el.caught){
			el.object3D.position.x = el.hookshot.object3D.position.x;
			el.object3D.position.y = el.hookshot.object3D.position.y;
			el.object3D.position.z = el.hookshot.object3D.position.z;
			
			var pos = el.object3D.position;
			//If within 1.7m of the origin
			if(pos.length() < 1.7){
				el.caught = false;
				fishNoteIndex = 0;
				collectSound.play();
				if(data.startGame){
					//Special fish starts the game when hooked in
					el.setAttribute("visible", false);
					el.setAttribute("position", "0 1.7 -4");
					el.isActive = false;
					el.firstElementChild.emit("relax");
					startGame();
				}
				else{
					//Get points for catching this fish
					if(data.isRare){
						//Rare fish give more points but don't respawn
						addPoints(50);
						el.object3D.position.y = -50; //Hacky
					}
					else{
						addPoints(10);
						this.respawn();
					}
				}
			}
		}
		else{
			if(currentState === State.GAMEOVER){
				if(data.startGame){
					if(el.isReappearing){
						el.gameOverDelayTimer -= deltaTime / 1000;
						if(el.gameOverDelayTimer <= 0){
							el.gameOverDelayTimer = 2;
							//Reactivate the special starting fish and go to menu state
							el.isReappearing = false;
							el.isActive = true;
							currentState = State.MENU;
						}
					}
				}
				else{
					if(el.deathTimer > 0){
						el.deathTimer -= deltaTime / 1000;
						if(el.deathTimer <= 0){
							el.parentNode.removeChild(el);
						}
					}
				}
			}
			else if(currentState === State.GAMEPLAY){
				if(el.object3D.position.x < -8){
					el.emit("updateVelocity", {x: NORMAL_SPEED, y: 0, z: 0}, false);
					el.object3D.rotation.y = Math.PI;
				}
				if(el.object3D.position.x > 8){
					el.emit("updateVelocity", {x: -NORMAL_SPEED, y: 0, z: 0}, false);
					el.object3D.rotation.y = 0;
				}
			}
		}
	},
	
	respawn: function(){
		var el = this.el;
		el.object3D.position.y = randRange(1, 4);
		el.object3D.position.z = randRange(-5, -3);
		
		var newX = 0;
		var newVelX = 0;
		var choice = Math.random();
		var velOffset = Math.random() - 0.5;
		if(choice < 0.5){
			//Right to left
			newX = 6;
			newVelX = -NORMAL_SPEED + velOffset;
			el.object3D.rotation.y = 0;
		}
		else{
			//Left to right
			newX = -6;
			newVelX = NORMAL_SPEED + velOffset;
			el.object3D.rotation.y = Math.PI;
		}
		el.object3D.position.x = newX;
		el.emit("updateVelocity", {x: newVelX, y: 0, z: 0}, false);
		el.firstElementChild.emit("swim");
	}
});

function spawnFishAt(x, y, z, isRare = false){
	var parentEl = document.getElementById("fish-spawn-root");
	
	var boxEl = document.createElement("a-box");
	boxEl.className = "collider";
	boxEl.setAttribute("width", 1);
	boxEl.setAttribute("height", 0.5);
	boxEl.setAttribute("depth", 0.1);
	boxEl.setAttribute("opacity", 0);
	boxEl.setAttribute("position", x + " " + y + " " + z);
	
	var dirChoice = Math.random();
	var velX = randRange(0.5, NORMAL_SPEED);
	if(dirChoice < 0.5){
		boxEl.object3D.rotation.y = Math.PI;
	}
	else{
		velX *= -1;
	}
	boxEl.setAttribute("velocity", {
		vel: {x: velX, y: 0, z: 0}
	});
	
	
	boxEl.setAttribute("hook-target", isRare ? "isRare: true" : "");
	
	var fishEl = document.createElement("a-entity");
	fishEl.setAttribute("fish", isRare ? "color: #8836c2" : "");
	
	parentEl.appendChild(boxEl);
	boxEl.appendChild(fishEl);
}

AFRAME.registerComponent("velocity", {
	schema: {
		vel: {type: "vec3", default: {x: 0, y: 0, z: 0}},
		gravity: {type: "number", default: 0}
	},
	
	init: function(){
		var el = this.el;
		var data = this.data;
		//Assign variables to el so that they're editable from other components/entities
		el.vel = {x: data.vel.x, y: data.vel.y, z: data.vel.z};
		el.gravity = data.gravity;
		
		el.addEventListener("updateVelocity", function(e){
			el.vel = {x: e.detail.x, y: e.detail.y, z: e.detail.z};
		});
		el.addEventListener("updateGravity", function(e){
			el.gravity = e.detail.gravity;
		});
	},
	
	tick: function(time, deltaTime){
		var data = this.data;
		var el = this.el;
		var dt = deltaTime / 1000;
		el.object3D.position.x += el.vel.x * dt;
		el.object3D.position.y += el.vel.y * dt;
		el.object3D.position.z += el.vel.z * dt;
		
		el.vel.y += el.gravity * dt;
		if(el.vel.y < -10){ //Limit falling speed
			el.vel.y = -10;
		}
	}
});