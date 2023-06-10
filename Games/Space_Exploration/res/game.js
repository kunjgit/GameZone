/*global storage, fullscreen, music, play*/
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

})();