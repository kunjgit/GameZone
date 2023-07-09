(function(){var storage, fullscreen, music, draw, update, play, unlock;
/*jshint unused: false*/
var WIDTH = 420, HEIGHT = 700,
	SHIPSIZE = 10, PLANET_R = 40,
	circleSpeed = 0.0015, moveSpeed = 0.1,
	planets, playerX, playerY,
	playerAngle, playerPlanet, circleDir,
	lastPlanet, startY = 0, record, gold;
//the code to show the planets in the description is a bit messy
//so startY = 0 is required before the game starts/*global storage: true*/
/*global WIDTH, HEIGHT*/
storage =
(function () {
"use strict";

var data = {
	record0: [-1, '—'],
	record1: [-1, '—'],
	record2: [-1, '—'],
	record3: [-1, '—'],
	record4: [-1, '—'],
	gold: 0,
	sound: true,
	fullscreen: screen.width <= WIDTH || screen.height <= HEIGHT
}, storageKey = 'schnark-js13k-2021';

try {
	data = JSON.parse(localStorage.getItem(storageKey) || 'x');
} catch (e) {
}

function get (key) {
	return data[key];
}

function set (key, value) {
	data[key] = value;
	try {
		localStorage.setItem(storageKey, JSON.stringify(data));
	} catch (e) {
	}
}

return {
	get: get,
	set: set
};
})();
/*global fullscreen: true*/
fullscreen =
(function () {
"use strict";

var updateHandler;

function isFullscreen () {
	return document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement ||
		document.webkitIsFullScreen;
}

function enterFullscreen () {
	var el;
	if (isFullscreen()) {
		return;
	}
	el = document.documentElement;
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	}
}

function exitFullscreen () {
	if (!isFullscreen()) {
		return;
	}
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}

function onUpdate () {
	if (updateHandler) {
		updateHandler(isFullscreen());
	}
}

function setUpdateHandler (handler) {
	updateHandler = handler;
}

document.addEventListener('fullscreenchange', onUpdate);
document.addEventListener('webkitfullscreenchange', onUpdate);
document.addEventListener('mozfullscreenchange', onUpdate);
document.addEventListener('msfullscreenchange', onUpdate);
document.addEventListener('fullscreenerror', onUpdate);
document.addEventListener('webkitfullscreenerror', onUpdate);
document.addEventListener('mozfullscreenerror', onUpdate);
document.addEventListener('msfullscreenerror', onUpdate);

return {
	is: isFullscreen,
	enter: enterFullscreen,
	exit: exitFullscreen,
	setUpdateHandler: setUpdateHandler
};
})();/*global music: true*/
music =
(function () {
"use strict";

var AC, audioContext, nodes = [], staffs, defs;

function getFreq (note, key, octave) {
	return key[note] * octave;
}

function getNode (time) {
	var i, osc, gain;
	for (i = 0; i < nodes.length; i++) {
		if (nodes[i].t < time) {
			return i;
		}
	}
	osc = audioContext.createOscillator();
	gain = audioContext.createGain();
	gain.gain.value = 0;
	osc.connect(gain);
	gain.connect(audioContext.destination);
	osc.start();
	nodes.push({osc: osc, gain: gain});
	return nodes.length - 1;
}

function playNote (start, end, freq, volume) {
	var i = getNode(start);
	nodes[i].osc.frequency.setValueAtTime(freq, start);
	nodes[i].gain.gain.setValueAtTime(0.001, start);
	nodes[i].gain.gain.exponentialRampToValueAtTime(volume, start + 0.05);
	nodes[i].gain.gain.linearRampToValueAtTime(volume, end - 0.05);
	nodes[i].gain.gain.exponentialRampToValueAtTime(0.001, end);
	nodes[i].gain.gain.setValueAtTime(0, end + 0.01);
	nodes[i].t = end + 0.01;
}

function playNotes (notes, dur, start, key, octave, volume) {
	var i, end = start + dur;
	for (i = 0; i < notes.length; i++) {
		playNote(start, end, getFreq(notes[i], key, octave), volume);
	}
	return end;
}

function playStaff (staff) {
	var notes;
	while (staff.time - audioContext.currentTime < 1) {
		notes = staff.notes[staff.pos];
		if (notes[0][0] === 'x') {
			staff.defNumber = notes[1];
		} else if (notes[0][0] === 'z') {
			staff.time += notes[1] * defs[staff.defNumber].baseDur;
		} else {
			staff.time = playNotes(
				notes[0], notes[1] * defs[staff.defNumber].baseDur,
				staff.time,
				defs[staff.defNumber].key, staff.octave,
				defs[staff.defNumber].volume
			);
		}
		staff.pos = (staff.pos + 1) % staff.notes.length;
	}
}

function playStaffs () {
	var i, time;
	if (!audioContext) {
		audioContext = new AC();
	}
	for (i = 0; i < staffs.length; i++) {
		if (staffs[i].time === -1) {
			if (!time) {
				time = audioContext.currentTime + 0.1;
			}
			staffs[i].time = time;
		}
		playStaff(staffs[i]);
	}
}

function stop () {
	var i, time;
	if (!audioContext) {
		return;
	}
	time = audioContext.currentTime + 0.1;
	for (i = 0; i < nodes.length; i++) {
		nodes[i].osc.frequency.cancelScheduledValues(time);
		nodes[i].gain.gain.cancelScheduledValues(time);
		nodes[i].gain.gain.setValueAtTime(0, time);
		nodes[i].t = time;
	}
	for (i = 0; i < staffs.length; i++) {
		staffs[i].time = -1;
		staffs[i].pos = 0;
	}
}

function initStaff (notes, octave) {
	staffs.push({
		time: -1,
		pos: 0,
		notes: notes,
		octave: octave
	});
}

function parseNotes (notes) {
	return notes.split(' ').map(function (n) {
		var l;
		n = n.split(/([\^_]?[a-zA-Z][',]*)/);
		l = Number(n.pop() || 1);
		return [
			n.filter(function (a) {
				return a;
			}),
			l
		];
	});
}

function init (data) {
	var i;
	defs = data.defs;
	staffs = [];
	for (i = 0; i < data.staffs.length; i++) {
		initStaff(parseNotes(data.staffs[i][0]), data.staffs[i][1] || 1);
	}
}

AC = window.AudioContext || window.webkitAudioContext;

return {
	init: init,
	stop: stop,
	tick: AC ? playStaffs : function () {}
};

})();
/*global music*/
(function () {
"use strict";

var cMajor, eFlatMajor,
	jupiter11, jupiter12, jupiter21, jupiter22, jupiter, jupiterVariant,
	neptune1, neptune2, neptune;

/*jshint quotmark: false*/
//jscs:disable validateQuoteMarks
cMajor = {
	'D,': Math.pow(2, -19 / 12) * 440,
	'E,': Math.pow(2, -17 / 12) * 440,
	'F,': Math.pow(2, -16 / 12) * 440,
	'G,': Math.pow(2, -14 / 12) * 440,
	'A,': 0.5 * 440,
	'B,': Math.pow(2, -10 / 12) * 440,
	C: Math.pow(2, -9 / 12) * 440,
	D: Math.pow(2, -7 / 12) * 440,
	'^D': Math.pow(2, -6 / 12) * 440,
	E: Math.pow(2, -5 / 12) * 440,
	F: Math.pow(2, -4 / 12) * 440,
	G: Math.pow(2, -2 / 12) * 440,
	'^G': Math.pow(2, -1 / 12) * 440,
	A: 440,
	'_B': Math.pow(2, 1 / 12) * 440,
	B: Math.pow(2, 2 / 12) * 440,
	c: Math.pow(2, 3 / 12) * 440,
	'^c':  Math.pow(2, 4 / 12) * 440,
	d: Math.pow(2, 5 / 12) * 440,
	'^d': Math.pow(2, 6 / 12) * 440,
	'_e': Math.pow(2, 6 / 12) * 440,
	e: Math.pow(2, 7 / 12) * 440,
	f: Math.pow(2, 8 / 12) * 440,
	'_g':  Math.pow(2, 9 / 12) * 440,
	g: Math.pow(2, 10 / 12) * 440,
	'^g': Math.pow(2, 11 / 12) * 440,
	a: 2 * 440,
	'_b': Math.pow(2, 13 / 12) * 440,
	b: Math.pow(2, 14 / 12) * 440,
	"c'": Math.pow(2, 15 / 12) * 440,
	"d'": Math.pow(2, 17 / 12) * 440,
	"^d'": Math.pow(2, 18 / 12) * 440,
	"_e'": Math.pow(2, 18 / 12) * 440,
	"e'": Math.pow(2, 19 / 12) * 440,
	"f'": Math.pow(2, 20 / 12) * 440,
	"g'": Math.pow(2, 22 / 12) * 440
};
eFlatMajor = { //NOTE one octave lower than usual
	E: Math.pow(2, -6 / 12) * 220,
	F: Math.pow(2, -4 / 12) * 220,
	G: Math.pow(2, -2 / 12) * 220,
	A: Math.pow(2, -1 / 12) * 220,
	B: Math.pow(2, 1 / 12) * 220,
	c: Math.pow(2, 3 / 12) * 220,
	d: Math.pow(2, 5 / 12) * 220,
	e: Math.pow(2, 6 / 12) * 220,
	f: Math.pow(2, 8 / 12) * 220,
	g: Math.pow(2, 10 / 12) * 220,
	a: Math.pow(2, 11 / 12) * 220,
	b: Math.pow(2, 13 / 12) * 220,
	"c'": Math.pow(2, 15 / 12) * 220,
	"d'": Math.pow(2, 17 / 12) * 220,
	"e'": Math.pow(2, 18 / 12) * 220,
	"f'": Math.pow(2, 20 / 12) * 220,
	"g'": Math.pow(2, 22 / 12) * 220
};

/*
The format is based on ABC. To convert into real ABC, do the following:
* Replace all fractional numbers by fractions.
* Where notes are separated by spaces, add the lenght after each note and enclose them in square brackets.
* Move the correct octave.
* Add the metadata (especially the key, here denoted by "x").
*/

//jscs:disable maximumLineLength
jupiter11 = "x0 z A0.25 c0.25 d0.25 A0.25 e0.25 g0.25 a0.25 e0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 z ebe'3 Acg0.5 Acf FAc FAe0.5 FAd DFc0.5 DFB0.5 DFA0.5 DFG0.5 Gg cd Gg cd Gg cd Gg cd Ff _Bc Ff _Bc Ff _Bc Ff _Bc z2";
jupiter12 = "x2 G0.5 B0.5 c c0.5 e0.5 d0.75 B0.25 e0.5 f0.5 e Bd c0.5 d0.5 c B G2 G0.5 B0.5 c c0.5 e0.5 d0.75 B0.25 e0.5 f0.5 g Bg cg0.5 f0.5 e cf e2 b0.5 g0.5 f f e0.5 g0.5 f B b0.5 g0.5 f f g0.5 b0.5 c'2 c'0.5 d'0.5 c'e' bd' ac' gb ee' eg f0.5 e0.5 f g fb2 eg0.5 b0.5 ec' c'0.5 e'0.5 fd'0.75 b0.25 be'0.5 f'0.5 e' bd' c'0.5 d'0.5 c' db eg2 g0.5 b0.5 c' c'0.5 e'0.5 d'0.75 b0.25 e'0.5 f'0.5 g' gg' g'0.5 f'0.5 e' af' ge'2 b0.5 g0.5 f f e0.5 g0.5 f B b0.5 g0.5 f f g0.5 b0.5 c'2 c'0.5 d'0.5 c'e' bd' ac' gb ee' eg f0.5 e0.5 f g fb2 eg0.5 b0.5 ec' c'0.5 e'0.5 fd'0.75 b0.25 be'0.5 f'0.5 e' bd' c'0.5 d'0.5 c' db eg2 g0.5 b0.5 c' c'0.5 e'0.5 d'0.75 b0.25 e'0.5 f'0.5 g' gg' g'0.5 f'0.5 e' af'3";
jupiter21 = "x1 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 A0.5 B G B0.5 A B0.25 c0.25 A0.25 B0.25 c0.75 G1.25 B0.5 A0.5 G0.25 A0.25 c0.25 e0.25 g0.75 g0.25 a0.5 b g z0.5 CGc e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 A,A0.5 B,B G,G B,B0.5 A,A B,B0.25 Cc0.25 A,A0.25 B,B0.25 Cc0.75 G,G1.25 B,B0.5 A,A0.5 G,G0.25 A,A0.25 Cc0.25 Ee0.25 Gg0.75 Gg0.25 Aa0.5 Bb Gg0.5 z ^GBe^g3 D,D0.5 E,E F,F A,A0.5 B,B Dd0.5 Ee0.5 Ff0.5 Gg0.5 G0.5 c0.5 f G0.5 c0.5 f G0.5 c0.5 f0.5 g0.5 d2 F0.5 _B0.5 _e F0.5 _B0.5 _e F0.5 _B0.5 _e0.5 f0.5 c2 G0.5 _B0.5 c";
jupiter22 = "x2 z Ae z Bf Ge z Ge Ae z Bd ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca z eg Ge Bf z cg db z Ge Bf z eb a g fa cg Bg Ae Ge Fe Ee Af fa eb d c B Ae z Bf Ge z Ge Ae z Bf ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca Eg2 Ge Bf z cg db z Ge Bf z eb a g fa cg Bg Ae Ge Fe Ee Af fa eb d c B Ae z Bf Ge z Ge Ae z Bf ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca3";

neptune1 = "x0 G E G0.5 E0.5 ^D0.5 ^G0.5 B0.5 ^G0.5 G E G0.5 E0.5 ^D0.5 ^G0.5 B0.5 ^c0.5 B^d0.5 ^d^g0.5 ^gb^d'4 ac'e' fac' ac'e' ^gb^d'2 z10 B^d0.5 ^d^g0.5 ^gb^d'4 gc'e' egc' gc'e' _g_bc'_e'2";
neptune2 = "x0 B G B0.5 G0.5 ^G0.5 B0.5 ^d0.5 ^c0.5 B G B0.5 G0.5 ^G0.5 B0.5 ^d0.5 ^g0.5 z3 A,Ec5 z2 Bg Ge Bg0.5 Ge0.5 ^G^d0.5 B^g0.5 db0.5 ^c^g0.5 B^g Ge Bg0.5 Ge0.5 ^G^d0.5 B^G0.5 db0.5 g^c0.5 z3 CGce4 z3";
//jscs:enable maximumLineLength

jupiter = {
	defs: [
		{
			key: cMajor,
			volume: 0.02,
			baseDur: 60 / 100
		},
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 60 / 100
		},
		{
			key: eFlatMajor,
			volume: 0.2,
			baseDur: 60 / 80
		}
	],
	staffs: [
		[jupiter11 + ' ' + jupiter12],
		[jupiter21 + ' ' + jupiter22, 0.5]
	]
};

jupiterVariant = {
	defs: [
		{
			key: cMajor,
			volume: 0.02,
			baseDur: 60 / 100
		},
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 60 / 100
		},
		{
			key: eFlatMajor,
			volume: 0.2,
			baseDur: 60 / 80
		}
	],
	staffs: [
		[jupiter12 + ' ' + jupiter11],
		[jupiter22 + ' ' + jupiter21, 0.5]
	]
};

neptune = {
	defs: [
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 1
		}
	],
	staffs: [
		[neptune1, 0.5],
		[neptune2, 0.25]
	]
};

music.setMelody = function (n) {
	switch (n) {
	case 0:
	case 3:
		music.init(jupiterVariant);
		break;
	case 1:
	case 4:
		music.init(neptune);
		break;
	case 2:
		music.init(jupiter);
	}
};

})();/*global draw: true*/
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
})();/*global update: true*/
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
})();/*global play: true*/
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
})();/*global unlock: true*/
/*global gold*/
unlock =
(function () {
"use strict";

function unlock () {
	var unlocked = false, button;
	if (gold >= 10) {
		button = document.getElementById('button1');
		if (button.disabled) {
			button.disabled = false;
			unlocked = true;
		}
	}
	if (gold >= 25) {
		button = document.getElementById('button2');
		if (button.disabled) {
			button.disabled = false;
			unlocked = true;
		}
	}
	if (gold >= 50) {
		button = document.getElementById('button3');
		if (button.disabled) {
			button.disabled = false;
			unlocked = true;
		}
	}
	if (gold >= 5000) {
		button = document.getElementById('button4');
		if (button.disabled) {
			button.disabled = false;
			unlocked = true;
		}
	}
	return unlocked;
}

if (location.search === '?monetization-cheater') {
	document.getElementById('button4').disabled = false;
} else if (document.monetization) {
	if (document.monetization.state === 'started') {
		document.getElementById('button4').disabled = false;
	} else {
		document.monetization.addEventListener('monetizationstart', function () {
			document.getElementById('button4').disabled = false;
		});
	}
}

unlock();

return unlock;
})();/*global storage, fullscreen, music, play*/
(function () {
"use strict";

var fullscreenToggle, soundToggle, wasFullscreen, isMenu = true;

function start (type) {
	document.getElementById('menu').hidden = true;
	document.getElementById('game').hidden = false;
	document.getElementById('overlay').hidden = true;
	isMenu = false;
	if (type !== -1) {
		wasFullscreen = fullscreen.is();
	}
	if (fullscreenToggle.checked) {
		fullscreen.enter();
	}
	play(type);
}

document.getElementById('record0').textContent = storage.get('record0')[1];
document.getElementById('record1').textContent = storage.get('record1')[1];
document.getElementById('record2').textContent = storage.get('record2')[1];
document.getElementById('record3').textContent = storage.get('record3')[1];
document.getElementById('record4').textContent = storage.get('record4')[1];

document.getElementById('gold').textContent = storage.get('gold');

document.getElementById('button0').addEventListener('click', function () {
	start(0);
});
document.getElementById('button1').addEventListener('click', function () {
	start(1);
});
document.getElementById('button2').addEventListener('click', function () {
	start(2);
});
document.getElementById('button3').addEventListener('click', function () {
	start(3);
});
document.getElementById('button4').addEventListener('click', function () {
	start(4);
});
document.getElementById('button-retry').addEventListener('click', function () {
	start(-1);
});
document.getElementById('button-menu').addEventListener('click', function () {
	document.getElementById('menu').hidden = false;
	document.getElementById('game').hidden = true;
	isMenu = true;
	if (!wasFullscreen) {
		fullscreen.exit();
	}
});

fullscreenToggle = document.getElementById('fullscreen');
soundToggle = document.getElementById('sound');

fullscreenToggle.checked = storage.get('fullscreen');
fullscreenToggle.parentElement.addEventListener('mousedown', function (e) {
	e.stopPropagation();
});
fullscreenToggle.parentElement.addEventListener('touchstart', function (e) {
	e.stopPropagation();
});
fullscreenToggle.addEventListener('change', function () {
	storage.set('fullscreen', fullscreenToggle.checked);
	if (fullscreenToggle.checked) {
		fullscreen.enter();
	} else {
		fullscreen.exit();
	}
});
fullscreen.setUpdateHandler(function (isFullscreen) {
	if (!isMenu) {
		fullscreenToggle.checked = isFullscreen;
		storage.set('fullscreen', isFullscreen);
	}
});

soundToggle.checked = storage.get('sound');
soundToggle.parentElement.addEventListener('mousedown', function (e) {
	e.stopPropagation();
});
soundToggle.parentElement.addEventListener('touchstart', function (e) {
	e.stopPropagation();
});
soundToggle.addEventListener('change', function () {
	if (!soundToggle.checked) {
		music.stop();
	}
	storage.set('sound', soundToggle.checked);
});

music.play = function () {
	if (soundToggle.checked) {
		music.tick();
	}
};

})();})()
