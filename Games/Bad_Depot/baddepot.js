// https://twitter.com/msvaljek

// standard shim
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

//helper functions
function lightenColor(color, percent) {
	var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
	return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}
function randomMax(max) {
	return ~~(Math.random() * max);
}
function distance(a, b) {
	return ~~Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

var canvas = document.getElementById('mainCanvas'),
	ctx = canvas.getContext('2d'),
	twoPI = 2 * Math.PI;

var Boss = function (x, y) {
	this.headSize = 10;
	this.bodySize = 30;
	this.limbWidth = 15;
	this.sayTimePerLetter = 5;
	this.messages = [];

	this.x = x;
	this.y = y;
	this.necky = this.y + this.headSize;
	this.sayCounter = 0;
	this.sayCounterStart = 0;
	this.message = '';
};
Boss.prototype.draw = function () {
	ctx.fillStyle = ctx.strokeStyle = '#696969';
	ctx.lineWidth = 2;
	//head
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.headSize, 0, twoPI);
	ctx.fill();
	//body
	ctx.beginPath();
	ctx.moveTo(this.x, this.necky);
	ctx.lineTo(this.x, this.necky + this.bodySize);
	ctx.stroke();
	//right arm
	ctx.beginPath();
	ctx.moveTo(this.x, this.necky);
	ctx.lineTo(this.x + this.limbWidth, this.necky + this.limbWidth);
	ctx.stroke();
	//left arm
	ctx.beginPath();
	ctx.moveTo(this.x, this.necky);
	ctx.lineTo(this.x - this.limbWidth, this.necky + this.limbWidth);
	ctx.stroke();
	//right leg
	ctx.beginPath();
	ctx.moveTo(this.x, this.necky + this.bodySize);
	ctx.lineTo(this.x + this.limbWidth, this.necky + this.limbWidth + this.bodySize);
	ctx.stroke();
	//left leg
	ctx.beginPath();
	ctx.moveTo(this.x, this.necky + this.bodySize);
	ctx.lineTo(this.x - this.limbWidth, this.necky + this.limbWidth + this.bodySize);
	ctx.stroke();

	//boss says
	if (this.sayCounter > 0) {
		this.sayCounter--;
		var lightFactor = - 100 * ((this.sayCounterStart - this.sayCounter) / this.sayCounterStart);
		ctx.fillStyle = lightenColor('#7FFF00', lightFactor);
		ctx.font = '20px arial';
		var metrics = ctx.measureText(this.message);
		ctx.fillText(this.message, this.x - 20, this.y - 20);

		if (this.sayCounter === 0) {
			this.messages.splice(0, 1);
		}

	} else {
		if (this.messages.length > 0) {
			this.message = this.messages[0];
			this.sayCounterStart = this.sayTimePerLetter * this.message.length;
			this.sayCounter = this.sayCounterStart;
		}
	}
};
Boss.prototype.say = function (message) {
	var addmessage = false;

	if (this.messages.length > 0) {
		if (this.messages[this.messages.length - 1] !== message) {
			addmessage = true;
		}
	} else {
		addmessage = true;
	}

	if (addmessage) {
		this.messages.push(message);
	}
};

var Player = function (x, y) {
	this.x = x;
	this.y = y;
	this.playerColor = '#7B68EE';
	this.ordinaryLight = '#FFA500';
	this.carryLight = '#FF4500';
	this.ligthMaxContrast = 20;
	this.speed = 5;
	this.playerSize = 15;
	this.lightSize = 5;
	this.lightCounterMax = 40;
	this.lightCounter = 0;
	this.state = 'free';
	this.lastActionKeyState = false;
	this.carryColor = undefined;
};
Player.prototype.draw = function (game) {
	if (game.activeKeys.left) {
		this.x -= this.speed;
	}
	if (game.activeKeys.right) {
		this.x += this.speed;
	}
	if (game.activeKeys.up) {
		this.y -= this.speed;
	}
	if (game.activeKeys.down) {
		this.y += this.speed;
	}
	if (game.activeKeys.action !== this.lastActionKeyState && game.activeKeys.action) {
		if (this.state === 'free') {
			var container = game.attach(this);
			if (container !== undefined) {
				this.state = 'carry';
				this.carryColor = container;

				if (Math.random() < game.containerExplodeOnLiftRate) {
					game.explosion = new Explosion(this.x, this.y, this.carryColor);
					this.state = 'free';
					game.boss.say('Bad luck man!');
				}

			}
		} else if (this.state === 'carry') {
			if (game.drop(this)) {
				this.state = 'free';
			}
		}
	}
	this.lastActionKeyState = game.activeKeys.action;

	if (this.x - this.playerSize < 0) {
		this.x = this.playerSize;
	}
	if (this.y - this.playerSize < 0) {
		this.y = this.playerSize;
	}
	if (this.x + this.playerSize > game.border) {
		this.x = game.border - this.playerSize;
	}
	if (this.y + this.playerSize > canvas.height) {
		this.y = canvas.height - this.playerSize;
	}

	if (this.state === 'carry') {
		ctx.fillStyle = this.carryColor;
		ctx.beginPath();
		ctx.arc(this.x, this.y, ~~(game.containerSize / 2), 0, twoPI);
		ctx.fill();
	}

	ctx.fillStyle = this.playerColor;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.playerSize, 0, twoPI);
	ctx.fill();

	var baseLightColor;
	if (this.state === 'free') {
		baseLightColor = this.ordinaryLight;
	} else if (this.state === 'carry') {
		baseLightColor = this.carryLight;
	}
	this.lightCounter = (this.lightCounter + 1) % this.lightCounterMax;
	var lightPercent = this.ligthMaxContrast * (this.lightCounterMax - this.lightCounter) / this.lightCounterMax;

	ctx.fillStyle = lightenColor(baseLightColor, lightPercent);
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.lightSize, 0, twoPI);
	ctx.fill();
};

var ContainerSystem = function (game) {
	this.containers = [];
	this.freeContainerNum = game.containerNum;
};
ContainerSystem.prototype.addContainers = function(game, count) {
	var pickColor,
		filled = false,
		startRow, startColumn,
		startInd;
	if (this.freeContainerNum >= count) {
		startRow = randomMax(game.containerwcount);
		startColumn = randomMax(game.containerhcount);
		startInd = startRow * game.containerhcount + startColumn;
		for (var i = 0; i < count; i++) {
			pickColor = game.containerColors[randomMax(game.containerColors.length)];
			while (!this.isFree(startInd)) {
				startInd = (startInd + 1) % game.containerNum;
			}
			game.containerSystem.fill(startInd, pickColor);
		}
		filled = true;
	}
	return filled;
};
ContainerSystem.prototype.getIndex = function (game, x, y) {
	var ix = ~~(x / game.containerSize);
	var iy = ~~(y / game.containerSize);

	var retrind = iy * game.containerhcount + ix;

	if (ix >= game.containerhcount) {
		retrind = undefined;
	}

	return retrind;
};
ContainerSystem.prototype.releaseInd = function (ind) {
	var retrCont = this.containers[ind];

	if (this.containers[ind] !== undefined) {
		this.containers[ind] = undefined;
		this.freeContainerNum++;
	}

	return retrCont;
};
ContainerSystem.prototype.isFree = function (ind) {
	return this.containers[ind] === undefined;
};
ContainerSystem.prototype.fill = function (ind, color) {
	this.containers[ind] = color;
	this.freeContainerNum--;
};
ContainerSystem.prototype.draw = function (game) {
	var containerHalf = ~~(game.containerSize / 2);
	for (var i = 0; i < this.containers.length; i++) {
		if (this.containers[i] !== undefined) {
			ctx.fillStyle = this.containers[i];
			var x = i % game.containerhcount;
			var y = ~~(i / game.containerhcount);
			ctx.beginPath();
			ctx.arc(containerHalf + x * game.containerSize, containerHalf + y * game.containerSize, containerHalf, 0, twoPI);
			ctx.fill();
		}
	}
};

var DropPoint = function (game) {
	this.x = game.border - game.dropSize;
	this.y = ~~(canvas.height / 2);
	this.dy = game.dropPointSpeed;
	this.dropSize = game.dropSize;
	this.timePerDigit = 60;
	this.timeCounter = 0;

	this.pickColor(game);
};
DropPoint.prototype.pickColor = function (game) {
	this.acceptingColor = game.containerColors[randomMax(game.containerColors.length)];
	this.dropCountDown = game.dropCountDown;
};
DropPoint.prototype.draw = function (game) {
	this.timeCounter = (this.timeCounter + 1) % 60;

	if (this.timeCounter === 0) {
		this.dropCountDown--;
	}

	if (this.dropCountDown === 0) {
		this.pickColor(game);
	}

	this.y += this.dy;

	if (this.y + this.dropSize >= canvas.height) {
		this.y = canvas.height - this.dropSize;
		this.dy *= -1;
	}
	if (this.y - this.dropSize <= 0) {
		this.y = this.dropSize;
		this.dy *= -1;
	}

	ctx.strokeStyle = ctx.fillStyle = this.acceptingColor;
	ctx.lineWidth = 3;

	ctx.font = '16px arial';
	var metrics = ctx.measureText(this.dropCountDown);
	ctx.fillText(this.dropCountDown, this.x - (metrics.width / 2), this.y + 5);

	ctx.beginPath();
	ctx.arc(this.x, this.y, this.dropSize - ctx.lineWidth, 0, twoPI);
	ctx.stroke();
};

var ScoreBoard = function (x, y) {
	this.x = x;
	this.y = y;
	this.rowSpacing = 20;
};
ScoreBoard.prototype.draw = function (game) {
	ctx.font = '16px arial';

	ctx.fillStyle = 'Cyan';
	ctx.fillText('Points', this.x, this.y);
	ctx.font = '30px arial';
	ctx.fillText(game.points, this.x, this.y + 1.5 * this.rowSpacing);

	ctx.font = '16px arial';
	ctx.fillStyle = '#FF8C00';
	ctx.fillText('Delivery Size', this.x, this.y + 3 * this.rowSpacing);
	ctx.fillText(game.nextDeliveryCount, this.x, this.y + 4 * this.rowSpacing);

	ctx.fillStyle = '#FF1493';
	ctx.fillText('Delivery Countdown', this.x, this.y + 5.5 * this.rowSpacing);
	ctx.fillText(game.deliveryCountDown, this.x, this.y + 6.5 * this.rowSpacing);
};

var InstructionBoard = function (x, y) {
	this.x = x;
	this.y = y;
	this.rowSpacing = 20;
};
InstructionBoard.prototype.draw = function (game) {
	ctx.font = '16px arial';
	ctx.fillStyle = 'yellow';

	ctx.fillText('space - attach / drop container', this.x, this.y);
	ctx.fillText('arrow keys - move carrier', this.x, this.y - this.rowSpacing);
	ctx.fillText('Drop containers to counter', this.x, this.y - 2 * this.rowSpacing);
};

var Particle = function (color, x, y, maxSpeed) {
	var particleMinSpeed = 5;

	this.color = color;
	this.x = x;
	this.y = y;

	this.dx = (Math.random() > 0.5 ? -1 : 1) * particleMinSpeed + randomMax(maxSpeed);
	this.dy = (Math.random() > 0.5 ? -1 : 1) * particleMinSpeed + randomMax(maxSpeed);
};
Particle.prototype.draw = function () {
	this.x += this.dx;
	this.y += this.dy;

	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, 2, 0, twoPI);
	ctx.fill();

	if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
		return true;
	}
};
var Explosion = function (x, y, color) {
	this.particles = [];
	var particleSpeedDeltaMax = 5;
	for (var i = 0; i < 30; i++) {
		this.particles.push(new Particle(color, x, y, particleSpeedDeltaMax));
	}
};
Explosion.prototype.draw = function () {
	var countOut = 0;
	for (var i = 0; i < this.particles.length; i++) {
		if (this.particles[i].draw()) {
			countOut++;
		}
	}
	if (countOut === this.particles.length) {
		return true;
	}
};

var Game = function () {
	this.activeKeys = [];
	this.over = false;

	this.points = 0;
	this.nextDeliveryCount = 5;
	this.lastDeliveryCountDown = 30;
	this.deliveryCountDown = 30;
	this.deliveryCountCycle = 60;
	this.deliveryCounter = 0;

	this.border = 550;
	this.borderColor = '#DEB887';

	this.boss = new Boss(620, ~~(canvas.height / 2));

	this.containerColors = [
		'#6495ED',
		'#DC143C',
		'#808080',
		'#8B4513',
		'#FFFF00'
	];
	this.containerSize = 40;
	this.containerhcount = ~~(this.border / this.containerSize) - 1;
	this.containerwcount = ~~(canvas.height / this.containerSize);
	this.containerNum = this.containerwcount * this.containerhcount;
	this.containerSystem = new ContainerSystem(this);

	this.dropSize = 30;
	this.dropCountDown = 10;
	this.dropPointSpeed = 2;
	this.dropPoint = new DropPoint(this);

	this.player = new Player(this.border - this.dropSize, ~~(canvas.height / 2) - 2 * this.dropSize);

	this.scoreBoard = new ScoreBoard(this.border + 20, 20);
	this.instructionBoard = new InstructionBoard(this.border + 20, canvas.height - 20);

	this.containerSystem.addContainers(this, 10);
	this.containerExplodeOnLiftRate = 0.1;
	this.explosion = undefined;

	this.animatedStuff = [
		this.containerSystem,
		this.boss,
		this.dropPoint,
		this.player,
		this.scoreBoard,
		this.instructionBoard
	];
};
Game.prototype.attach = function (player) {
	var ind = this.containerSystem.getIndex(this, this.player.x, this.player.y);

	if (ind !== undefined) {
		var retr = this.containerSystem.releaseInd(ind);
		if (retr !== undefined) {
			return retr;
		} else {
			this.boss.say("can't pick up empty!");
		}

	} else {
		this.boss.say('Nothing there!');
	}
};
Game.prototype.drop = function (player) {
	var ind = this.containerSystem.getIndex(this, this.player.x, this.player.y);
	
	var actionsuccess = false;

	if (ind !== undefined) {
		if (this.containerSystem.isFree(ind)) {
			this.containerSystem.fill(ind, player.carryColor);
			actionsuccess = true;
		} else {
			this.boss.say('watch it!');
		}
	} else {
		if (distance(player, this.dropPoint) <= this.dropSize) {
			if (this.dropPoint.acceptingColor === player.carryColor) {
				actionsuccess = true;
				this.points += 10;
			} else {
				this.boss.say('Wrong color!');
			}
		} else {
			this.boss.say('Drop at counter!');
		}
	}

	return actionsuccess;
};
Game.prototype.draw = function () {
	ctx.strokeStyle = this.borderColor;

	ctx.beginPath();
	ctx.moveTo(this.border, 0);
	ctx.lineTo(this.border, canvas.height);
	ctx.stroke();

	if (this.over) {
		this.scoreBoard.draw(this);
		this.boss.draw(this);
		this.instructionBoard.draw(this);
		ctx.font = '30px arial';
		ctx.fillStyle = 'red';
		ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
		ctx.font = '15px arial';
		ctx.fillText('Click with mouse to restart...', canvas.width / 4, 2 * canvas.height / 3);
	} else {
		this.deliveryCounter = (this.deliveryCounter + 1 ) % this.deliveryCountCycle;
		if (this.deliveryCounter === 0) {
			this.deliveryCountDown--;
		}
		if (this.deliveryCountDown === 0) {
			if (game.containerSystem.addContainers(game, this.nextDeliveryCount)) {
				this.deliveryCountDown = this.lastDeliveryCountDown;
				this.nextDeliveryCount++;
				if (this.nextDeliveryCount % 10 === 0) {
					this.lastDeliveryCountDown--;
				}
			} else {
				this.boss.say('The storage is full!');
				this.boss.say('Aw man ...');
				this.boss.say('The Game is over!');
				this.nextDeliveryCount = 0;
				this.over = true;
			}
		}
		for (var i = 0; i < this.animatedStuff.length; i++) {
			this.animatedStuff[i].draw(this);
		}
		if (this.explosion) {
			if (this.explosion.draw()) {
				this.explosion = undefined;
			}
		}
	}
};
Game.prototype.setKeyTo = function (key, state) {
	this.activeKeys[key] = state;
};

var game;

function setKeysTo(e, game, state) {
	if(e.keyCode === 37) {
		game.setKeyTo('left', state);
	} else if(e.keyCode === 39) {
		game.setKeyTo('right', state);
	}  else if(e.keyCode === 38) {
		game.setKeyTo('up', state);
	} else if(e.keyCode === 40) {
		game.setKeyTo('down', state);
	} else if (e.keyCode === 32) {
		game.setKeyTo('action', state);
	}

	return false;
}
document.onkeydown = function(e) {
	return setKeysTo(e, game, true);
};
document.onkeyup = function(e) {
	return setKeysTo(e, game, false);
};
document.onclick = function() {
	if (game) {
		if (game.over) {
			game = new Game();
		}
	} else {
		game = new Game();
	}
};

function drawWelcome() {
	var alignLine = ~~(canvas.width / 4);
	var textH = ~~(canvas.height / 3);

	ctx.fillStyle = '#00BFFF';
	ctx.font = '30px arial';
	ctx.fillText('Bad Depot', alignLine, textH);

	textH += 30;
	ctx.fillStyle = '#7CFC00';
	ctx.font = '20px arial';
	ctx.fillText('- arrow keys move the carrier around (blinking)', alignLine, textH);
	textH += 30;
	ctx.fillText('- space key lifts / drops containers', alignLine, textH);
	textH += 30;
	ctx.fillText('- drop containers to countdown zone (moving)', alignLine, textH);
	textH += 30;
	ctx.fillText('- container color and zone color must match', alignLine, textH);
	textH += 30;
	ctx.fillText('- sometimes crates explode when picked up', alignLine, textH);

	ctx.fillStyle = '#00BFFF';
	textH += 60;
	ctx.fillText('Click with mouse to start ...', alignLine, textH);
}

(function animloop() {
	requestAnimFrame(animloop);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (game) {
		game.draw();
	} else {
		drawWelcome();
	}
})();