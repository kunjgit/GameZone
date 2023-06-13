/**
 * @constructor
 */
function AIPlayer(id)
{
	this.playerId = id;
	this.moveTargetX = 0;
	this.moveTargetZ = 0;
	
	this.shootTarget = (id+1)%4;
}

AIPlayer.prototype = {
	
	/**
	 * Control for AI player : accelerate, brake, reverse, turn or shoot
	 * Oh, and also define a strategy
	 *
	 * Equivalent to processControls() for the human player(s)
	 */
	playOneFrame : function(world) {
	
		var ownData = world.playerData[this.playerId];
		var distanceToTarget = Math.sqrt(Math.pow(this.moveTargetZ - ownData.z, 2) + Math.pow(this.moveTargetX - ownData.x, 2));
		
		// reassess the target every 2 seconds, if we are out of a target, or if the target is reached
		if (!this.moveTargetX || (world.timer%50)==0 || distanceToTarget < 2) {
			this.defineTarget(world);
		}
		
		
		var angleFwd = Math.atan2(this.moveTargetZ - ownData.z , this.moveTargetX - ownData.x) - ownData.dir;
		while (angleFwd < -Math.PI) {
			angleFwd += 2*Math.PI;
		}
		while (angleFwd > Math.PI) {
			angleFwd -= 2*Math.PI;
		}
		var angleBwd = Math.atan2(-this.moveTargetZ + ownData.z , -this.moveTargetX + ownData.x) - ownData.dir;
		while (angleBwd < -Math.PI) {
			angleBwd += 2*Math.PI;
		}
		while (angleBwd > Math.PI) {
			angleBwd -= 2*Math.PI;
		}
		
		var angle = Math.abs(angleFwd) < Math.abs(angleBwd) ? angleFwd : angleBwd;
		if (angle > 0) {
			ownData.dir += Math.min(.1, angle);
		} else {
			ownData.dir += Math.max(-.1, angle);
		}
		
		var targetSpeed = (Math.abs(angle) > .1 ? 0.0 : (Math.abs(angleFwd) < Math.abs(angleBwd) ? 1.0 : -1.0)) ;
		if (targetSpeed > ownData.speed) {
			ownData.speed = Math.min(1.0, targetSpeed, ownData.speed + 0.1);
		} else {
			ownData.speed = Math.max(-1.0, targetSpeed, ownData.speed - 0.1);
		}
		
		var shootTargetX = world.playerData[this.shootTarget].x;
		var shootTargetZ = world.playerData[this.shootTarget].z;
		var shootingAngle = Math.atan2(shootTargetZ - ownData.z , shootTargetX - ownData.x);
		if (shootingAngle > ownData.aimY) {
			ownData.aimY = Math.min(ownData.aimY+.1, shootingAngle);
		} else {
			ownData.aimY = Math.max(ownData.aimY-.1, shootingAngle);
		}
		
		var distanceToTarget = Math.sqrt(Math.pow(shootTargetZ - ownData.z, 2) + Math.pow(shootTargetX - ownData.x, 2));
		var aimH =  distanceToTarget / 500;
		
		if (ownData.reload < 1 && distanceToTarget < 500) { // ready to shoot and within range
			for (var i=0; i<4; ++i) { // choose the most powerful weapon we have
				if (ownData.weapons[i] > 0) {
					ownData.currentWeapon = i;
				}
			}
			world.playerShoots(this.playerId);
		}
		
	},
	
	
	
	/**
	 * Assess time to get to a target
	 * includes frames spent turning to the right direction
	 */
	timeToTarget : function(world, targetX, targetZ) {
		var dx = targetX - world.playerData[this.playerId].x;
		var dz = targetZ - world.playerData[this.playerId].z;
		var timeToRotate = 10 * Math.min (Math.abs(Math.atan2 (dz, dx)), Math.abs(Math.atan2(-dz, -dx)));
		var distance = Math.sqrt(dx*dx+dz*dz);
		var timeToMove = 1.1 * distance;
		return timeToRotate + timeToMove;
	},
	
	/**
	 * Returns the distance between the target and the nearest opponent tank
	 * not accounting for motion
	 */
	distanceFromNearestOpponent : function(world, targetX, targetZ) {
		var distance = 9999;
		for (var i=0; i<4; ++i) if (i!= this.playerId) {
			var dx = targetX - world.playerData[i].x;
			var dz = targetZ - world.playerData[i].z;
			distance = Math.min (distance, Math.sqrt(dx*dx+dz*dz));
		}
		return distance;
	},
	
	/**
	 * Define where to go
	 */
	defineTarget : function(world) {
	
		var nearest = 9999;
		// find nearest beacon not owned by current player
		for (var i=0; i<16; ++i) {
			var beaconX = 32 + 64 * (i&3);
			var beaconZ = 32 + 64 * (i>>2);
			if (world.beacons[i] != this.playerId) {
				var eta = this.timeToTarget(world, beaconX, beaconZ);
				var opponent = this.distanceFromNearestOpponent(world, beaconX, beaconZ);
				var opponentWeight = (1+1/opponent)*opponent; // weighted function, *2 at 0 distance , *1 at infinity
				var value = eta - .5*opponentWeight;
				if (value < nearest) {
					this.moveTargetX = beaconX;
					this.moveTargetZ = beaconZ;
					nearest = value;
				}
			}
		}
		// any extra weapons nearby ?
		for (var i=0; i<world.crates.length; ++i) {
			var eta = this.timeToTarget(world, world.crates[i].x, world.crates[i].z);
			var opponent = this.distanceFromNearestOpponent(world, world.crates[i].x, world.crates[i].z);
			var opponentWeight = (1+1/opponent)*opponent; // weighted function, *2 at 0 distance , *1 at infinity
			var value = eta - .5*opponentWeight;
			if (value < nearest) {
				this.moveTargetX = world.crates[i].x;
				this.moveTargetZ = world.crates[i].z;
				nearest = value;
			}
		}
	
		// Green player targets the weakest opponent, purple and orange the strongest one
		var maxHp = 0;
		var targetWeakest = (this.playerId == 1);
		for (var i=1; i<4; ++i) {
			var targetPlayer = (this.playerId + i)%4;
			var targetHp = world.playerData[targetPlayer].hp;
			if (targetWeakest) {
				targetHp = 120 - targetHp;
			}
			if (targetHp > maxHp && targetHp < 101) { // limit to 101 = avoid shooting already destroyed tanks (worth 120)
				this.shootTarget=targetPlayer;
				maxHp = targetHp;
			}
		}
		
		// if another player is twice closer, shoot at him/her instead
		var sqDistanceToTarget = Math.pow(world.playerData[targetPlayer].x - world.playerData[this.playerId].x, 2)
								+Math.pow(world.playerData[targetPlayer].z - world.playerData[this.playerId].z, 2);
								
		var closestPlayer = this.shootTarget, closestSqDistance = sqDistanceToTarget;
		for (var i=1; i<4; ++i) {
			var targetPlayer = (this.playerId + i)%4;
			var sqDistanceToPlayer = Math.pow(world.playerData[targetPlayer].x - world.playerData[this.playerId].x, 2)
									+Math.pow(world.playerData[targetPlayer].z - world.playerData[this.playerId].z, 2);
			if (sqDistanceToPlayer < closestSqDistance) {
				closestSqDistance = sqDistanceToPlayer;
				closestPlayer = targetPlayer;
			}
		}
		if (closestSqDistance*4 < sqDistanceToTarget) {
			this.shootTarget = closestPlayer;
		}

	
	}
	
}