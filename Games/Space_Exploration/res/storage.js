/*global storage: true*/
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
