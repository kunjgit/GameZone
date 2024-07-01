/*global draw: true*/
/*global fullscreen*/
/*global WIDTH, HEIGHT, SHIPSIZE, planets, playerX, playerY, playerAngle, startY, playerPlanet, lastPlanet, record*/
draw =
(function () {
"use strict";

var canvas = document.getElementById('canvas'),
	header = document.getElementById('header'),
	ctx = canvas.getContext('2d'),
	spaceship = document.createElement('canvas'),
	gradientLeft, gradientRight,
	random;

function init (shiptype) {
	random = Math.floor(Math.random() * 1000);
	if (shiptype !== -1) {
		[initSpaceship0, initSpaceship1, initSpaceship2, initSpaceship3, initSpaceship4][shiptype](spaceship, SHIPSIZE);
	}
}

function drawCircle (x, y, r, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
}

function initSpaceship0 (canvas, size, rot) {
	var ctx = canvas.getContext('2d');
	canvas.width = size * 2;
	canvas.height = size * 2;
	if (rot) {
		ctx.translate(size, size);
		ctx.rotate(-rot);
		ctx.translate(-size, -size);
	}
	if (size !== 10) {
		ctx.scale(size / 10, size / 10);
	}
	ctx.fillStyle = 'silver';
	ctx.fillRect(1, 8, 2, 4);
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'silver';
	ctx.beginPath();
	ctx.moveTo(20, 10);
	ctx.bezierCurveTo(19, 8, 18, 7, 16, 7);
	ctx.lineTo(2, 7);
	ctx.lineTo(2, 13);
	ctx.lineTo(16, 13);
	ctx.bezierCurveTo(18, 13, 19, 12, 20, 10);
	ctx.moveTo(13, 7);
	ctx.bezierCurveTo(10, 4, 8, 2, 5, 2);
	ctx.lineTo(5, 7);
	ctx.moveTo(13, 13);
	ctx.bezierCurveTo(10, 16, 8, 18, 5, 18);
	ctx.lineTo(5, 13);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = '#88f';
	ctx.beginPath();
	ctx.moveTo(15, 8);
	ctx.bezierCurveTo(19, 8, 19, 12, 15, 12);
	ctx.fill();
}

function initSpaceship1 (canvas, size, rot) {
	var ctx = canvas.getContext('2d');
	canvas.width = size * 2;
	canvas.height = size * 2;
	if (rot) {
		ctx.translate(size, size);
		ctx.rotate(-rot);
		ctx.translate(-size, -size);
	}
	if (size !== 10) {
		ctx.scale(size / 10, size / 10);
	}
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(10, 10);
	ctx.bezierCurveTo(8, 8, 4, 5, 2, 5);
	ctx.bezierCurveTo(5, 10, 5, 10, 2, 15);
	ctx.bezierCurveTo(4, 15, 8, 12, 10, 10);
	ctx.fill();

	ctx.fillStyle = 'silver';
	ctx.beginPath();
	ctx.moveTo(20, 10);
	ctx.bezierCurveTo(19, 6, 3, 5, 3, 10);
	ctx.bezierCurveTo(3, 15, 19, 14, 20, 10);
	ctx.fill();

	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(18, 8);
	ctx.bezierCurveTo(21, 10, 21, 10, 18, 12);
	ctx.fill();

	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.arc(13, 10, 1.5, 0, 2 * Math.PI);
	ctx.fill();

	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(1, 10);
	ctx.lineTo(7, 10);
	ctx.stroke();
}

function initSpaceship2 (canvas, size, rot) {
	var ctx = canvas.getContext('2d');
	canvas.width = size * 2;
	canvas.height = size * 2;
	if (rot) {
		ctx.translate(size, size);
		ctx.rotate(-rot);
		ctx.translate(-size, -size);
	}
	if (size !== 10) {
		ctx.scale(size / 10, size / 10);
	}
	ctx.fillStyle = '#808';
	ctx.fillRect(9, 4, 6, 2);
	ctx.fillRect(9, 14, 6, 2);

	ctx.fillStyle = '#c4c';
	ctx.beginPath();
	ctx.moveTo(20, 10);
	ctx.lineTo(5, 2);
	ctx.lineTo(5, 18);
	ctx.lineTo(20, 10);
	ctx.fill();

	ctx.fillStyle = '#f8f';
	ctx.beginPath();
	ctx.moveTo(18, 10);
	ctx.lineTo(10, 6);
	ctx.lineTo(10, 14);
	ctx.lineTo(18, 10);
	ctx.fill();

	ctx.fillStyle = '#808';
	ctx.fillRect(1, 4.5, 6, 3);
	ctx.fillRect(1, 8.5, 6, 3);
	ctx.fillRect(1, 12.5, 6, 3);
}

function initSpaceship3 (canvas, size, rot) {
	var ctx = canvas.getContext('2d');
	canvas.width = size * 2;
	canvas.height = size * 2;
	if (rot) {
		ctx.translate(size, size);
		ctx.rotate(-rot);
		ctx.translate(-size, -size);
	}
	if (size !== 10) {
		ctx.scale(size / 10, size / 10);
	}
	ctx.fillStyle = '#080';
	ctx.beginPath();
	ctx.moveTo(2, 5);
	ctx.bezierCurveTo(15, 5, 15, 15, 2, 15);
	ctx.bezierCurveTo(10, 5, 10, 15, 2, 5);
	ctx.fill();

	ctx.fillStyle = '#8f8';
	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(20, 10);
	ctx.bezierCurveTo(15, 5, 8, 5, 5, 8);
	ctx.lineTo(5, 12);
	ctx.bezierCurveTo(8, 15, 15, 15, 20, 10);
	ctx.fill();
	ctx.stroke();

	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(13, 8);
	ctx.bezierCurveTo(16, 8, 16, 12, 13, 12);
	ctx.stroke();

	ctx.strokeStyle = '#080';
	ctx.beginPath();
	ctx.moveTo(0, 10);
	ctx.lineTo(7, 10);
	ctx.stroke();
}

function initSpaceship4 (canvas, size, rot) {
	var ctx = canvas.getContext('2d');
	canvas.width = size * 2;
	canvas.height = size * 2;
	if (rot) {
		ctx.translate(size, size);
		ctx.rotate(-rot);
		ctx.translate(-size, -size);
	}
	if (size !== 10) {
		ctx.scale(size / 10, size / 10);
	}
	ctx.fillStyle = 'blue';
	ctx.fillRect(1.5, 2, 8, 1.5);
	ctx.fillRect(1.5, 4.5, 8, 1.5);
	ctx.fillRect(10.5, 2, 8, 1.5);
	ctx.fillRect(10.5, 4.5, 8, 1.5);
	ctx.fillRect(1.5, 16.5, 8, 1.5);
	ctx.fillRect(1.5, 14, 8, 1.5);
	ctx.fillRect(10.5, 16.5, 8, 1.5);
	ctx.fillRect(10.5, 14, 8, 1.5);
	ctx.fillRect(12, 7, 6, 6);
	ctx.fillStyle = 'silver';
	ctx.fillRect(5, 8, 5, 4);
	ctx.fillRect(9.5, 3, 1, 14);
	ctx.fillRect(10, 9.5, 8, 1);
}

//NOTE all numbers here and following that _look_ random actually _are_ random, just to avoid any visible periods
function drawBackground () {
	var x, y, roundStartY = Math.round(startY);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	for (y = roundStartY; y < HEIGHT + roundStartY; y++) {
		if (Math.sin(7.32 * y) > 0.97) {
			drawCircle(
				(Math.sin(y * 101.451 + random) + 1) / 2 * WIDTH,
				HEIGHT - y + startY,
				Math.random() > 0.995 ? 1 : 0.75, 'white'
			);
		}
		if (y === record) {
			for (x = 25; x < WIDTH; x += 75) {
				drawCircle(x, HEIGHT - y + startY, 1, 'gold');
			}
		}
	}
}

function willHitPlanet () {
	var i, x, y, a;
	for (i = lastPlanet + 1; i < planets.length; i++) {
		if (planets[i].y - startY > HEIGHT + 10) {
			return false;
		}
		x = planets[i].x - playerX;
		y = planets[i].y - playerY;
		a = Math.abs(playerAngle - Math.atan2(y, x));
		if (a < Math.PI / 2 && Math.sin(a) * Math.sqrt(x * x + y * y) < planets[i].r) {
			return true;
		}
	}
	return false;
}

function cloudPath (x, y, r, t) {
	var i, n = 7;
	ctx.beginPath();
	ctx.arc(x, y, r - 3, 0, 2 * Math.PI);
	for (i = 0; i < n; i++) {
		ctx.arc(
			x + (r / 2 + 2 * Math.sin(t / 500 + i) + 2) * Math.cos(2 * Math.PI / n * i + Math.sin(t / 450 + i * 2) / 5),
			y + (r / 2 + 2 * Math.sin(t / 600 + i * 3) + 2) * Math.sin(2 * Math.PI / n * i + Math.sin(t / 550 + i) / 5),
			r / 2 + 2 * Math.sin(t / 400 + i * 4) + 2,
			0, 2 * Math.PI
		);
	}
}

function drawCloud (x, y, r, t) {
	ctx.fillStyle = 'hsla(' +
		(25 + 1.5 * Math.sin(t / 5100)) + ',' +
		(90 + Math.sin(t / 520)) + '%,' +
		(50 + 3 * Math.sin(t / 490)) + '%,' +
		(0.98 + Math.sin(t / 480) / 100) + ')';
	cloudPath(x, y, r, t);
	ctx.fill();
	ctx.fillStyle = 'rgba(255,255,255,0.05)';
	cloudPath(x, y, r * 0.7, t);
	ctx.fill();
	cloudPath(x, y, r * 0.4, t);
	ctx.fill();
}

function drawPlanet (x, y, r, type, time, currentPlanet, dt) {
	var i, c, lastY, h;
	switch (type) {
	case 0:
		c = ['hsl(240,100%,50%)', 'hsl(230,100%,50%)'];
		break;
	case 1:
		c = ['hsl(25,100%,50%)', 'hsl(25,100%,60%)'];
		break;
	case 2:
		c = ['hsl(0,100%,50%)', 'hsl(0,100%,60%)'];
		break;
	case 3:
		c = ['hsl(45,85%,40%)', 'hsl(50,90%,45%)'];
		break;
	case 4:
		c = ['#888', '#aaa'];
		break;
	case 5:
		if (currentPlanet && willHitPlanet()) {
			c = ['hsl(90,100%,50%)', 'hsl(90,90%,55%)'];
		} else {
			c = ['hsl(90,100%,20%)', 'hsl(90,90%,25%)'];
		}
		break;
	case 6:
		c = ['hsl(300,80%,30%)', 'hsl(300,90%,35%)'];
	}

	ctx.beginPath();
	ctx.arc(x, HEIGHT - y + startY, r - SHIPSIZE - 5, 0, 2 * Math.PI);
	ctx.fillStyle = c[0];
	ctx.fill();
	ctx.save();
	ctx.clip();
	lastY = HEIGHT - y + startY - r + SHIPSIZE + 5;
	i = 0;
	while (lastY < HEIGHT - y + startY + r - SHIPSIZE - 5) {
		h = (5 + 2 * Math.sin(5 * i + time / 2000 + x + type) - 2 * (i % 2)) * r / 30;
		ctx.fillStyle = c[i % c.length];
		ctx.fillRect(0, lastY, WIDTH, h);
		lastY += h;
		i += 1;
	}
	ctx.fillStyle = 'rgba(0,0,0,0.2)';
	ctx.beginPath();
	ctx.moveTo(x, HEIGHT - y + startY - r + SHIPSIZE + 5);
	ctx.bezierCurveTo(
		x + r / 2, HEIGHT - y + startY - r + SHIPSIZE + 5,
		x + r / 2, HEIGHT - y + startY + r - SHIPSIZE - 5,
		x, HEIGHT - y + startY + r - SHIPSIZE - 5);
	ctx.lineTo(WIDTH, HEIGHT - y + startY + r - SHIPSIZE - 5);
	ctx.lineTo(WIDTH, HEIGHT - y + startY - r + SHIPSIZE + 5);
	ctx.fill();
	ctx.restore();
	if (type === 1 && time !== -1) {
		for (i = 0; i < 5; i++) {
			drawCloud(
				x + r * Math.cos(time / 1500 + i * 17 + x),
				HEIGHT - y + startY + r * Math.sin(time / 1500 + i * 17 + x),
				SHIPSIZE + 10,
				time + 14252.2 * i
			);
		}
	}
	if ((type === 3 || type === 4) && currentPlanet && dt <= 1000) {
		ctx.fillStyle = type === 3 ? 'hsla(45,85%,40%,' + (1 - dt / 1000) + ')' : 'rgba(136,136,136,' + (1 - dt / 1000) + ')';
		ctx.fillText(type === 3 ? '+10' : '+5', x, HEIGHT - y + startY - r);
	}
}

function drawPlanets (time) {
	var i, x, y, r;
	for (i = lastPlanet; i < planets.length; i++) { //TODO or i = 0 or something more sophisticated?
		x = planets[i].x;
		y = planets[i].y;
		r = planets[i].r;
		if (y - r > startY + HEIGHT) {
			break;
		}
		if (y + r > startY) {
			if (i === lastPlanet && !planets[i].start) {
				planets[i].start = time;
			}
			drawPlanet(x, y, r, planets[i].t, time, i === lastPlanet, time - planets[i].start);
		}
	}
}

function drawSpaceship () {
	ctx.save();
	ctx.translate(playerX, HEIGHT - playerY + startY);
	ctx.rotate(-playerAngle);
	ctx.drawImage(spaceship, -SHIPSIZE, -SHIPSIZE);
	ctx.restore();
}

function drawWormhole () {
	var p = Math.min(playerX, WIDTH - playerX, playerY - startY, startY + HEIGHT - playerY) / SHIPSIZE;
	drawCircle(
		playerX, HEIGHT - playerY + startY,
		Math.min(8 * SHIPSIZE / p, HEIGHT),
		'rgba(127,0,127,' + Math.max(Math.pow(0.5, p), 0.1) + ')'
	);
}

function draw (time) {
	drawBackground();
	drawSpaceship();
	drawPlanets(time);
	if (
		playerPlanet === -1 &&
		planets[lastPlanet].t === 6 &&
		!planets[lastPlanet].saved &&
		!willHitPlanet()
	) {
		drawWormhole();
	}
	//fade out left and right
	ctx.fillStyle = gradientLeft;
	ctx.fillRect(0, 0, 2 * SHIPSIZE, HEIGHT);
	ctx.fillStyle = gradientRight;
	ctx.fillRect(WIDTH - 2 * SHIPSIZE, 0, 2 * SHIPSIZE, HEIGHT);
}

function drawExamplePlanet (canvas, type) {
	var backupCtx = ctx;
	canvas.width = 60;
	canvas.height = 60;
	ctx = canvas.getContext('2d');
	drawPlanet(30, HEIGHT - 30, 25 + SHIPSIZE, type, -1);
	ctx = backupCtx;
}

function resize () {
	var docEl = document.documentElement, width;
	width = Math.floor(
		Math.min(
			fullscreen.is() ? 2 : 1,
			docEl.clientWidth / WIDTH,
			docEl.clientHeight / HEIGHT
		) * WIDTH
	) + 'px';
	canvas.style.width = width;
	header.style.width = width;
}

canvas.width = WIDTH;
canvas.height = HEIGHT;
resize();
window.addEventListener('resize', resize);

gradientLeft = ctx.createLinearGradient(0, 0, 2 * SHIPSIZE, 0);
gradientLeft.addColorStop(0, 'black');
gradientLeft.addColorStop(1, 'rgba(0,0,0,0)');
gradientRight = ctx.createLinearGradient(WIDTH, 0, WIDTH - 2 * SHIPSIZE, 0);
gradientRight.addColorStop(0, 'black');
gradientRight.addColorStop(1, 'rgba(0,0,0,0)');

ctx.textAlign = 'center';
ctx.font = '40px sans-serif';

initSpaceship0(document.getElementById('spaceship0'), 20, Math.PI / 4);
initSpaceship1(document.getElementById('spaceship1'), 20, Math.PI / 4);
initSpaceship2(document.getElementById('spaceship2'), 20, Math.PI / 4);
initSpaceship3(document.getElementById('spaceship3'), 20, Math.PI / 4);
initSpaceship4(document.getElementById('spaceship4'), 20, Math.PI / 8);

drawExamplePlanet(document.getElementById('planet0'), 0);
drawExamplePlanet(document.getElementById('planet1'), 1);
drawExamplePlanet(document.getElementById('planet2'), 2);
drawExamplePlanet(document.getElementById('planet3'), 3);
drawExamplePlanet(document.getElementById('planet4'), 4);
drawExamplePlanet(document.getElementById('planet5'), 5);
drawExamplePlanet(document.getElementById('planet6'), 6);

draw.init = init;

return draw;
})();