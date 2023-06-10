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
})();