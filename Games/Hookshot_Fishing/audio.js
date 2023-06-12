var ac = new AudioContext();

var fishSounds = [];
var fishNotes = ["C", "D", "E", "F", "G"]
var fishNoteIndex = 0;

for(var i = 0; i < 5; i++){
	var note = fishNotes[i];
	//Add note and its octave above
	var hitSound = new TinyMusic.Sequence(ac, 125, [note + "3 s", note + "4 s"]);
	hitSound.staccato = 0.5;
	hitSound.gain.gain.value = 0.1;
	hitSound.loop = false;
	fishSounds[i] = hitSound;
}

var collectSound = new TinyMusic.Sequence(ac, 140, ["C5 s", "F5 s"]);
collectSound.staccato = 0.5;
collectSound.gain.gain.value = 0.1;
collectSound.loop = false;

var gameOverSound = new TinyMusic.Sequence(ac, 140, ["G4 s", "F4 s", "E4 s", "D4 s", "C4 s"]);
gameOverSound.staccato = 0.6;
gameOverSound.gain.gain.value = 0.2;
gameOverSound.loop = false;

var rareSound = new TinyMusic.Sequence(ac, 135, ["A5 s", "E5 s", "A5 s", "E5 s", "A5 s", "E5 s"]);
rareSound.staccato = 0.5;
rareSound.gain.gain.value = 0.2;
rareSound.loop = false;