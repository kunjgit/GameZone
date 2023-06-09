/**
 * @constructor
 */
function Race(controls)
{
	this.carCount = 6;
	this.controls = controls;
	this.track=new Track();
}

Race.prototype = {

	/**
	 * Reset the member variables to their default values 
	 * at the beginning of a race
	 */
	initialize : function(players, trackIndex) {
		this.players = players;			// 0, 1 or 2
		this.track.createTrack(trackIndex);
		this.finalLap = 4;
		this.cars = [];
		var section = this.track.sections[this.track.totalSteps-1];
		for (var i=0; i<this.carCount; ++i) {
			this.cars.push ( {	carX : sz*(section.x+(i&1?.7:.3)),		// m, world coordinates
								carY : sz*(section.y+.8-.25*(this.carCount-i-1)),		// m, world coordinates
								speed : 0,						// m/s, absolute value
								speedX : 0,						// m/s, world coordinates
								speedY : 0,						// m/s, world coordinates
								steeringAngle : 0,				// radian (delta)
								heading : Math.PI/2,			// radian, world coordinates
								yawRate : 0,					// radian/s
								linearAcceleration : 0,			// m/s²
								driveTrain : 0,					// 0 for RWD, 1 for 4WD, 2 for FWD
								halfWidth : 1.0,				// m, distance between car side and center of gravity
								frontHalfLength : 1.8,			// m, distance between front bumper and center of gravity
								rearHalfLength : 1.8,			// m, distance between rear bumper and center of gravity
								frontAxleToCG : 1.4,			// m, distance between front axle and center of gravity
								rearAxleToCG : 1.4,				// m, distance between rear axle and center of gravity
								cgHeight : 1,					// m, distance between ground and center of gravity
								rpm : 0,
								mass : 1500,					// kg
								inertia : 1500,					// kg.m
								currentStep : Math.floor(this.track.totalSteps-1+.8-.25*(this.carCount-i-1)),	// step (section) at current position
								lap : -1,						// current lap index
								lapCompleted : false,			// true when a lap was just completed (for display only)
								maxStep : this.track.totalSteps-1,		// maximum step reached
								lapTimes : [ ],
								bestLap : 0,
								totalTime : 0,
								preferredX : i&1?.3:.7,			// preferred lateral position on track, for CPU-controlled cars
								targetX : 0,					// target coordinates, for CPU-controlled cars
								targetY : 0,					// target coordinates, for CPU-controlled cars
								targetSpeed : 0,				// speed at target coordinates
								targetStep : -1,				// track step at target coordinates
								backingUp : 0,					// frames during which to back up, for CPU-controlled cars
								collisionStrength : 0,			// nonzero if involved in a collision at the most recent test
								collisionSpeed : 0,				// nonzero if involved in a collision at the most recent test
								accelerating : false,			// true if accelerating (for sfx)
								inTunnel : i				// true if inside a tunnel (for sfx)
							} );
		}
		this.time=(players>0?-350:0);	// start at minus 7 seconds for a real race, immediately for a demo
	},

	
	won : function() {
		var finished = (this.cars[0].lap>=this.finalLap);
		if (this.players>1) {
			finished = finished&&(this.cars[1].lap>=this.finalLap);
		}
		return finished;
	},
	
	/**
	 * Perform one step of model animation (players and CPU cars)
	 */
	animateItems : function(useControls) {
		if (++this.time>=0) {
			for (var i=0;i<this.players;++i) {
				this.animatePlayerCar(i);
			}
			this.animateCPUCars();
			this.processCollisions();
		}
	},
	
	/**
	 * Translate the player controls (accelerate, brake, steer) to car parameters usable by the simulation
	 * Then call it to perform one step of motion
	 * @param player 0 for P1, 1 for P2
	 */
	animatePlayerCar : function(player) {
	
		var car = this.cars[player];
		car.steeringAngle=-(.2+.6/(1+.4*car.speed))*this.controls.getSteeringDirection(player);
		
		// speed in car coordinates
		var velocityX =  Math.cos(car.heading) * car.speedX + Math.sin(car.heading) * car.speedY;
		
		var accelerateForward = velocityX>=0 && this.controls.customControlPressed[player][0];
		var accelerateBackward = velocityX<0 && this.controls.customControlPressed[player][1];
		var brake = (velocityX>=0 && this.controls.customControlPressed[player][1])
					|| (velocityX<0 && this.controls.customControlPressed[player][0]);
		
		if (car.bestLap > 0) {	// race completed
			accelerate = false;
			brake = true;
		}
		
		this.simulateCarPhysics(player, accelerateForward?20000:(accelerateBackward?-8000:0), brake?20000:0);
	},
	
	/**
	 * Apply physics model to move any car, with controls (player or CPU) as input
	 * Performs one step of motion
	 * @param carIndex 0-based index of the car, can be player or CPU-controlled
	 * @param throttle, acceleration, from -5000 (back up) to 0 (none) to 10000 (max)
	 * @param brake brake, from 0 (none) to 10000 (max)
	 */
	simulateCarPhysics : function(carIndex, throttle, brake) 
	{
		var car = this.cars[carIndex];
		car.accelerating = (throttle > 0);
	
		// http://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
		var gravity = 9.81;
		var wheelbase = car.frontAxleToCG + car.rearAxleToCG; // distance between front and rear axle (m)
		var frontAxleWeightRatio = car.rearAxleToCG/wheelbase; // ratio of the car weight on the front axle, at rest. Equal to c/(b+c)
		var rearAxleWeightRatio = car.frontAxleToCG/wheelbase; // ratio of the car weight on the rear axle, at rest. Equal to b/(b+c)
		var frontAxleWeight = car.mass*(frontAxleWeightRatio*gravity-car.linearAcceleration*car.cgHeight/wheelbase);
		var rearAxleWeight = car.mass*(rearAxleWeightRatio*gravity+car.linearAcceleration*car.cgHeight/wheelbase);
		var dt = 1/50; // time delta for numerical integration

		
		
		var sn = Math.sin(car.heading);
		var cs = Math.cos(car.heading);
		// speed in car coordinates
		var velocityX =  cs * car.speedX + sn * car.speedY;
		var velocityY = -sn * car.speedX + cs * car.speedY;
	
		var yawspeedFront = car.frontAxleToCG  * car.yawRate;
		var yawspeedRear = -car.rearAxleToCG * car.yawRate;
		
		// Calculate slip angles for front and rear wheels (a.k.a. alpha)
		var slipAngleFront = Math.atan2( velocityY + yawspeedFront, Math.abs(velocityX)) - (velocityX<0?-1:1)*car.steeringAngle;
		var slipAngleRear  = Math.atan2( velocityY + yawspeedRear,  Math.abs(velocityX));

		// traction force application factor, depending on drive train
		var frontCoef = .5*car.driveTrain;	// 0 for RWD, .5 for 4WD, 1 for FWD
		var rearCoef = 1-frontCoef; 		// 1 for RWD, .5 for 4WD, 0 for FWD

		// lateral force on wheels 
		var MAX_GRIP = 2.0;
		var frictionForceYFront = Math.min(MAX_GRIP, Math.max(-MAX_GRIP, -5.0*slipAngleFront))*frontAxleWeight;
		var frictionForceYRear = Math.min(MAX_GRIP, Math.max(-MAX_GRIP, -5.2*slipAngleRear))*rearAxleWeight;
		
		// gravity on slopes
		var tileX = car.carX / sz;
		var tileY = car.carY / sz;
		// no slope on a bridge, so getting the wrong floor does not matter
		var step = this.track.getStepAt(Math.floor(tileX), Math.floor(tileY))&255;
		if (step == 255) {
			step = 0; // debug point needed here
		}
		var section = this.track.sections[step];
		var steepness = -.3*section.steepness;
		var roadAngle = .25*Math.PI*section.dir;
		var gravityX = car.mass*gravity*steepness*Math.cos(roadAngle-car.heading);
		var gravityY = car.mass*gravity*steepness*Math.sin(roadAngle-car.heading);

		
		var tractionForceX = gravityX + throttle * (rearCoef + frontCoef*Math.cos(car.steeringAngle)) - brake*(velocityX>0?1:-1);
		var tractionForceY = gravityY + throttle * frontCoef * Math.sin(car.steeringAngle);
		
		var dragForceX = -30*velocityX - 5*velocityX*Math.abs(velocityX);
		var dragForceY = -30*velocityY - 5*velocityY*Math.abs(velocityY);
			
		var totalForceX = dragForceX + tractionForceX;
		var totalForceY = dragForceY + tractionForceY + Math.cos(car.steeringAngle) * frictionForceYFront + frictionForceYRear;

		var angularTorque = (frictionForceYFront+tractionForceY)*car.frontAxleToCG-frictionForceYRear*car.rearAxleToCG;
	
		var aX = totalForceX/car.mass;
		var aY = totalForceY/car.mass;
		
		// acceleration in world coordinates
		var wcaX =  cs * aX - sn * aY;
		var wcaY =  sn * aX + cs * aY;

		car.speedX += dt*wcaX;
		car.speedY += dt*wcaY;
		
		car.speed = Math.sqrt(car.speedX*car.speedX+car.speedY*car.speedY);
		car.rpm = Math.abs(velocityX*150);
		// ensure stability
		if (Math.abs(car.speed)<1&&!throttle&&!gravityX&&!gravityY) {
			car.speedX/=2;
			car.speedY/=2;
			angularTorque=0;
			car.yawRate/=2;
		}

		var angularAcceleration = angularTorque/car.inertia;
		
		car.yawRate += dt*angularAcceleration;
		car.heading += dt*car.yawRate;			
		
		car.carX+=dt*car.speedX;
		car.carY+=dt*car.speedY;	
		
	},
	
	/**
	 * Apply simplified physics model and intelligence
	 * to drive CPU cars, then calls the simulation to perform one step of motion
	 */
	animateCPUCars : function()
	{
		for (var i=this.players; i<this.carCount; ++i) {
			var car = this.cars[i];
			{ 	// define new target
				car.targetStep = car.currentStep;
				var targetFound = false;
				while (!targetFound) {
					car.targetStep = (car.targetStep+1)%this.track.totalSteps;
					targetFound = this.track.sections[car.targetStep].landmark;
				}
				var stepAfter = (car.targetStep+1)%this.track.totalSteps;
				
				var targetAngle = .25*Math.PI*this.track.sections[stepAfter].dir;
				var sX = .5+.4*Math.cos(targetAngle)-(car.preferredX-.5)*Math.sin(targetAngle);
				var sY = .5+.4*Math.sin(targetAngle)+(car.preferredX-.5)*Math.cos(targetAngle);
				car.targetX = (this.track.sections[car.targetStep].x+sX)*sz;
				car.targetY = (this.track.sections[car.targetStep].y+sY)*sz;
				var curve = this.track.sections[stepAfter].angle;
				car.targetSpeed = 40 - 12*Math.abs(curve);	// flat out when entering a straight, slower for a bend
			}
			
			var accelerate = 20000;
			var brake = 0;
			var dx = car.targetX-car.carX;
			var dy = car.targetY-car.carY;
			var bearing = Math.atan2(dy, dx)-car.heading;
			var maxAngle = (.2+.6/(1+.4*car.speed));
			var angle = Math.min(maxAngle, Math.abs(Math.sin(bearing)));
			car.steeringAngle = angle*(Math.sin(bearing)>0?1:-1);
			var velocityX =  Math.cos(car.heading) * car.speedX + Math.sin(car.heading) * car.speedY;
			if (velocityX < 0) {	// when backing up, turn the wheel in the opposite direction
				car.steeringAngle = - car.steeringAngle;
			}
				
			
			if (car.collisionStrength > 0 && car.speed < 5) {
				car.backingUp = (car.backingUp>0 ? 0 : 40);
			}
			if (car.backingUp) {
				// back up to escape an obstacle (other car or wall)
				--car.backingUp;
				accelerate = -8000;
			} else {
				// speed up towards the target
				var distanceToTarget = Math.sqrt(dx*dx+dy*dy)/sz;
				if (car.speed > car.targetSpeed && distanceToTarget<2) {
					// slow down when approaching the target if there is a curve behind
					accelerate = 0;
					brake = Math.min(20000, 1000*(car.speed-car.targetSpeed)/(distanceToTarget+.1));
				}
			}
			
			if (car.bestLap > 0) {	// race completed
				accelerate = 0;
				brake = 20000;
			}
			this.simulateCarPhysics(i, accelerate, brake);
		}
	},
	
	/**
	 * Detect and apply collisions
	 */
	processCollisions : function()
	{
		var collisions = [];
		for (var carIndex = 0; carIndex<this.carCount; ++carIndex) {
			collisions.push([[],[],[],[],[],[],[]]);
		}
		// detect collisions
		for (var carIndex = 0; carIndex<this.carCount; ++carIndex) {
			// collisions with roadside
			var car = this.cars[carIndex];
			car.collisionStrength = car.collisionSpeed = 0;
			var c = Math.cos(car.heading), s=Math.sin(car.heading);
			var carCorners = [	{x: car.frontHalfLength, y:  car.halfWidth},
								{x: -car.rearHalfLength, y:  car.halfWidth},
								{x: -car.rearHalfLength, y: -car.halfWidth},
								{x: car.frontHalfLength, y: -car.halfWidth}
							 ];
			for (var i=0; i<4; ++i) {
				var cornerX = (car.carX+carCorners[i].x*c-carCorners[i].y*s)/sz;
				var cornerY = (car.carY+carCorners[i].x*s+carCorners[i].y*c)/sz;
				
				var step=this.track.getStepAt(Math.floor(cornerX), Math.floor(cornerY));
				if (step>255) {
					if (Math.abs((step&255)-car.currentStep)<=1 || Math.abs((step&255)-car.currentStep)==(this.track.totalSteps-1)) {
						step = step&255;
					} else {
						step = step>>8;
					}
				}
				var tile = (step>=0 ? this.track.sections[step].tile : -1); // -1 should never happen, unless a car gets ejected to outer space
				var collided = this.track.testOffRoad(tile, cornerX-Math.floor(cornerX), cornerY-Math.floor(cornerY));
				if (collided.offRoad) {
					var force = 75000*car.speed*Math.abs(Math.cos(collided.angle-car.heading));
					collisions[carIndex][6].push([carIndex, carCorners[i].x, carCorners[i].y, collided.angle, force]);
				}
			}
			
			// collisions with other cars
			for (var otherCarIndex = 0; otherCarIndex<this.carCount; ++otherCarIndex) if (otherCarIndex != carIndex) {
				var otherCar = this.cars[otherCarIndex];
				if (Math.abs(car.currentStep-otherCar.currentStep)<=1 || Math.abs(car.currentStep-otherCar.currentStep)==(this.track.totalSteps-1))
				{	// speed optimisation + avoid collisions between cars that are one above and one below a bridge
					for (var i=0; i<4; ++i) {
						var oc = Math.cos(otherCar.heading), os=Math.sin(otherCar.heading);
						
						var cornerX = car.carX-otherCar.carX+carCorners[i].x*c-carCorners[i].y*s;
						var cornerY = car.carY-otherCar.carY+carCorners[i].x*s+carCorners[i].y*c;
						
						// corner of car A in coordinate system of car B
						var bpX = cornerX*oc + cornerY*os;
						var bpY = -cornerX*os + cornerY*oc;
						
						if ( bpX>-otherCar.rearHalfLength
						   &&bpX<otherCar.frontHalfLength
						   &&bpY>-otherCar.halfWidth
						   &&bpY<otherCar.halfWidth) {
						   /*
							// collision : solving for impulse
							// http://www.myphysicslab.com/collision.html
							var dX1 = otherCar.rearHalfLength+bpX;
							var dX2 = otherCar.frontHalfLength-bpX;
							var dY1 = otherCar.halfWidth+bpY;
							var dY2 = otherCar.halfWidth-bpY;
							var normalAngle = 0;
							if (dY2<=Math.min(dX1, dX2, dY1)) {
								normalAngle = .5*Math.PI;
							}
							if (dX1<=Math.min(dX2, dY1, dY2)) {
								normalAngle = Math.PI;
							}
							if (dY1<=Math.min(dX1, dX2, dY2)) {
								normalAngle = 1.5*Math.PI;
							}
							normalAngle += otherCar.heading;
							   
							// vap1r : world coordinate speed of collision point P for car A (car)
							var vap1rx = car.speedX + car.yawRate*(-carCorners[i].x*Math.sin(car.heading)-carCorners[i].y*Math.cos(car.heading));
							var vap1ry = car.speedY + car.yawRate*(-carCorners[i].x*Math.sin(car.heading)+carCorners[i].y*Math.cos(car.heading));
							 
							// vbp1 : world coordinate speed of collision point P for car B (otherCar)
							var vbp1x = otherCar.speedX + otherCar.yawRate*(-bpX*Math.sin(otherCar.heading)-bpY*Math.cos(otherCar.heading));
							var vbp1y = otherCar.speedY + otherCar.yawRate*(-bpX*Math.sin(otherCar.heading)+bpY*Math.cos(otherCar.heading));
						   
							var elasticity = .8;

							// world coordinate vector between CG of car A and collision point P
							var vapx = carCorners[i].x*c-carCorners[i].y*s;
							var vapy = carCorners[i].x*s+carCorners[i].y*c;

							// world coordinate vector between CG of car B and collision point P
							var vbpx = bpX*oc-bpY*os;
							var vbpy = bpX*os+bpY*oc;
							
							var nx = Math.cos(normalAngle);
							var ny = Math.sin(normalAngle);

							
							var impulse = -(1+elasticity)*(vap1rx*nx-vap1ry*ny)
										/ (1/car.mass + 1/otherCar.mass + (vapx*ny-vapy*nx)/car.inertia + (vbpx*ny-vbpy*nx)/otherCar.inertia);
							
						  */
							var deltaSpeedX = car.speedX - otherCar.speedX;
							var deltaSpeedY = car.speedY - otherCar.speedY;
							var deltaSpeed = 10*Math.sqrt(deltaSpeedX*deltaSpeedX+deltaSpeedY*deltaSpeedY);
							var forceAngle = Math.atan2(deltaSpeedY, deltaSpeedX);
							collisions[carIndex][otherCarIndex].push([carIndex, carCorners[i].x, carCorners[i].y, otherCar.heading+Math.atan2(bpY, bpX), deltaSpeed*otherCar.mass]);
							collisions[otherCarIndex][carIndex].push([otherCarIndex, bpX, bpY, otherCar.heading+forceAngle, deltaSpeed*car.mass]);
						   /*
							collisions.push([carIndex, carCorners[i].x, carCorners[i].y, normalAngle, impulse*50]);
							collisions.push([otherCarIndex, bpX, bpY, Math.PI+normalAngle, impulse*50]);
							*/
						}
					}
				}
			}
		}
		
		// apply forces & torque to colliding cars
		var dt=1/50;
		for (var carIndex = 0; carIndex<this.carCount; ++carIndex) {
			var car = this.cars[carIndex];
			var totalForceX = 0, totalForceY=0, totalTorque=0;
			for (var otherCarIndex=0; otherCarIndex<=this.carCount; ++otherCarIndex) {
				var collisionCount = collisions[carIndex][otherCarIndex].length;
				for (k=0; k<collisionCount; ++k) {
					var c=collisions[carIndex][otherCarIndex][k];
					car.collisionSpeed = car.speed;
					car.collisionStrength = c[4]/2e6/collisionCount;
					totalForceX += c[4]*Math.cos(c[3]-car.heading);
					totalForceY += c[4]*Math.sin(c[3]-car.heading);
					var torque = c[1]*totalForceY-c[2]*totalForceX;
					totalTorque += .1*torque;
				}
			}
			
			// apply collision-induced force and torque to car
			var aX = totalForceX/car.mass;
			var aY = totalForceY/car.mass;
			var c = Math.cos(car.heading), s=Math.sin(car.heading);
			var wcaX =  c * aX - s * aY;
			var wcaY =  s * aX + c * aY;

			var oldSpeed = car.speed;
			car.speedX += dt*wcaX;
			car.speedY += dt*wcaY;
			car.speed = Math.sqrt(car.speedX*car.speedX+car.speedY*car.speedY);
			/*
			if (car.speed > oldSpeed) {
				var ratio = oldSpeed/car.speed;
				car.speedX *= ratio;
				car.speedY *= ratio;
				car.speed = oldSpeed;
			}
			*/
			car.carX+=dt*dt*wcaX;
			car.carY+=dt*dt*wcaY;	
			
			var angularAcceleration = totalTorque/car.inertia;
			car.yawRate += dt*angularAcceleration;
			car.heading += dt*dt*angularAcceleration;

			// count steps and laps
			var tileX=car.carX/sz;
			var tileY=car.carY/sz;
			var tileStep = this.track.getStepAt(Math.floor(tileX), Math.floor(tileY));
			var step = tileStep&255;
			if (Math.abs(step-car.currentStep)==1 || Math.abs(step-car.currentStep)==this.track.totalSteps-1) {
				car.currentStep = step;
			}
			if (tileStep > 255) {
				// car above a bridge
				step = tileStep>>8;
				if (Math.abs(step-car.currentStep)==1 || Math.abs(step-car.currentStep)==this.track.totalSteps-1) {
					car.currentStep = step;
				}
			}	
			car.inTunnel = false;
			if (tileStep>255 && car.currentStep == (tileStep&255)) {
				car.inTunnel = !this.track.testOffRoad(this.track.sections[tileStep>>8].tile, tileX-Math.floor(tileX), tileY-Math.floor(tileY)).offRoad;
			}
			
			var nextStep = (car.maxStep+1)%this.track.totalSteps;
			step = tileStep&255;
			if (step != nextStep && tileStep>255) {
				step = tileStep>>8;
			}
			car.lapCompleted = false;
			if (step == nextStep) {	// step completed
				car.maxStep = step;
				if (step == 0) {	// lap completed
					++car.lap;
					car.lapCompleted = true;
					car.lapTimes.push(this.time);
					if (car.lap >= this.finalLap) {	// race completed
						for (var i=1; i<car.lapTimes.length; ++i) {
							car.bestLap = Math.min(car.lapTimes[i]-car.lapTimes[i-1], car.bestLap==0?9999:car.bestLap);
						}
					}
				}
			}
		} // for carIndex
	}

}
