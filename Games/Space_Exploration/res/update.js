/*global update: true*/
/*global WIDTH, HEIGHT, SHIPSIZE, PLANET_R,
	circleSpeed, moveSpeed, planets: true,
	playerX: true, playerY: true, playerAngle: true,
	playerPlanet: true, circleDir: true,
	startY: true, lastPlanet: true, gold: true*/
update =
(function () {
"use strict";

var addedExtraGold;

function init () {
	planets = [{
		x: 210, //WIDTH / 2
		y: 75, //25 + SHIPSIZE + PLANET_R
		r: 40, //PLANET_R
		t: 0
	}, {
		x: 150,
		y: 210,
		r: 40,
		t: 0
	}];
	playerX = 175; //planets[0].x - planets[0].r
	playerY = 60; //planets[0].y
	playerAngle = 0.5 * Math.PI;
	playerPlanet = 0;
	circleDir = -1;
	lastPlanet = 0;
	startY = 0;

	addedExtraGold = false;

	addPlanets();
}

function addPlanets () {
	while (planets[planets.length - 1].y < startY + 2 * HEIGHT) {
		addPlanet();
	}
}

function getRandomType (probs) {
	var r = Math.random(), i;
	for (i = 0; i < probs.length; i++) {
		if (r <= probs[i]) {
			return i;
		}
		r -= probs[i];
	}
	return 0;
}

function addPlanet () {
	var last = planets[planets.length - 1],
		type = getRandomType([0.33, 0.2, 0.15, 0.01, 0.05, 0.16, 0.1]);
	if (type === 0 && !addedExtraGold && planets.length > 5 && gold < 10) {
		type = Math.random() < 0.1 ? 3 : 4;
		addedExtraGold = true;
	}
	planets.push({
		x: 2 * SHIPSIZE + PLANET_R + Math.round((WIDTH - 4 * SHIPSIZE - 2 * PLANET_R) * Math.random()),
		y: last.y + 2 * SHIPSIZE + 2 * PLANET_R +
			Math.round(HEIGHT / 4 * Math.random() * (1 + Math.atan(Math.log(planets.length / 20)) / Math.PI)),
		r: Math.max(Math.min(last.r, PLANET_R - Math.round(planets.length * Math.random() / 5)), 5),
		t: type
	});
}

function update (dt) {
	var i, dx, dy, angle, factor;
	if (playerPlanet === -1) {
		dy = Math.sin(playerAngle) * dt * moveSpeed;
		playerX += Math.cos(playerAngle) * dt * moveSpeed;
		playerY += dy;
		if (dy > 0) {
			startY += dy / 3;
		}
		if (playerX < 0 || playerX > WIDTH || playerY < startY || playerY > startY + HEIGHT) {
			if (planets[lastPlanet].t === 6 && !planets[lastPlanet].saved) {
				planets[lastPlanet].saved = true;
				playerPlanet = lastPlanet;
				angle = playerAngle - 0.5 * circleDir * Math.PI;
				playerX = planets[playerPlanet].x + Math.cos(angle) * planets[playerPlanet].r;
				playerY = planets[playerPlanet].y + Math.sin(angle) * planets[playerPlanet].r;
			} else {
				return [planets[lastPlanet].y, (Math.round((planets[lastPlanet].y - planets[0].y) / 10) / 100) + 'ly'];
			}
		}
		for (i = lastPlanet + 1; i < planets.length; i++) {
			dy = playerY - planets[i].y;
			if (
				dy < -planets[i].r || //too far away
				(planets[i].y - planets[i].r + (planets[i].t === 1 ? 0 : 5 + SHIPSIZE) - startY >= HEIGHT) //not yet visible
			) {
				break;
			}
			dx = playerX - planets[i].x;
			if (dx * dx + dy * dy <= planets[i].r * planets[i].r) {
				playerPlanet = i;
				lastPlanet = i;
				angle = Math.atan2(dy, dx);
				circleDir = (playerAngle + Math.PI - angle) % (2 * Math.PI) > Math.PI ? 1 : -1;
				playerAngle = (angle + 0.5 * circleDir * Math.PI + 2 * Math.PI) % (2 * Math.PI);
				addPlanets();
				if (planets[i].t === 3) {
					gold += 10;
				} else if (planets[i].t === 4) {
					gold += 5;
				}
				break;
			}
		}
	} else {
		if (planets[playerPlanet].t === 2) {
			factor = planets[playerPlanet].factor || 1;
			planets[playerPlanet].factor = factor + dt / 2000;
		} else {
			factor = 1;
		}
		angle = playerAngle - 0.5 * circleDir * Math.PI + dt * circleDir * circleSpeed * factor;
		playerX = planets[playerPlanet].x + Math.cos(angle) * planets[playerPlanet].r;
		playerY = planets[playerPlanet].y + Math.sin(angle) * planets[playerPlanet].r;
		playerAngle = (angle + 0.5 * circleDir * Math.PI + 2 * Math.PI) % (2 * Math.PI);
		dy = planets[playerPlanet].y - planets[playerPlanet].r - SHIPSIZE - 25;
		if (dy !== startY) {
			startY = Math.round((2 * dy + startY) / 3);
		}
	}
}

update.init = init;

return update;
})();