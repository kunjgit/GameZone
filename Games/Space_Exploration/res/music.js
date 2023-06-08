/*global music: true*/
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
