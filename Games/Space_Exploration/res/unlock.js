/*global unlock: true*/
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
})();