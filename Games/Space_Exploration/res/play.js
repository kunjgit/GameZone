/*global play: true*/
/*global storage, music, draw, update, unlock*/
/*global playerPlanet: true, record: true, gold: true*/
/*global Event*/
play =
(function () {
"use strict";

var rAF, playing, recordName;

rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function play (type) {
	var time;
	function showResult (rawY, displayY) {
		var newRecord = false, unlocked = false;
		music.stop();
		playing = false;
		if (rawY > record && displayY !== '0ly') {
			storage.set(recordName, [rawY, displayY]);
			document.getElementById(recordName).textContent = displayY;
			newRecord = record !== -1; //if you played the first time, it's not a _new_ record
			record = rawY;
			gold += 3;
		}
		if (displayY !== '0ly') {
			gold += 1;
		}
		gold += Math.round(rawY / 1000);
		storage.set('gold', gold);
		document.getElementById('gold').textContent = gold;
		unlocked = unlock();
		document.getElementById('result').innerHTML =
			(displayY === '0ly' ?
				'You didn’t reach another planet.' :
				'The farthest planet you reached was <b>' + displayY + '</b> away.'
			) +
			(newRecord ? '<br>That’s a <b>new record</b>!' : '') +
			'<br>You currently have <b>' + gold + ' coins</b>.' +
			(unlocked ? '<br>You just unlocked a <b>new spacecraft</b>!' : '');
		document.getElementById('overlay').hidden = false;
	}

	function loop (t) {
		var dt, end;
		draw(t);
		if (time) {
			dt = t - time;
			while (dt > 10 && !end) {
				end = update(10); //10 * moveSpeed === 1
				dt -= 10;
			}
			if (!end) {
				end = update(dt);
			}
		}
		time = t;
		if (!end) {
			music.play();
			rAF(loop);
		} else {
			showResult(end[0], end[1]);
		}
	}

	if (type !== -1) {
		recordName = 'record' + type;
		record = storage.get(recordName)[0];

		music.setMelody(type);
	}
	update.init();
	draw.init(type);
	playing = true;
	rAF(loop);
}

window.addEventListener('mousedown', function () {
	if (!playing) {
		return;
	}
	playerPlanet = -1;
});

window.addEventListener('touchstart', function () {
	if (!playing) {
		return;
	}
	playerPlanet = -1;
});

window.addEventListener('keydown', function (e) {
	var toggle;
	if (!playing) {
		return;
	}
	if (e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32) {
		playerPlanet = -1;
		e.preventDefault();
	} else if (e.key === 'f' || e.keyCode === 70) {
		toggle = document.getElementById('fullscreen');
	} else if (e.key === 'm' || e.keyCode === 77) {
		toggle = document.getElementById('sound');
	}
	if (toggle) {
		e.preventDefault();
		toggle.checked = !toggle.checked;
		toggle.dispatchEvent(new Event('change'));
	}
});

gold = storage.get('gold');

return play;
})();