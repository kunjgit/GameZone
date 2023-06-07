var tones = [130,138,146,155,165,175,185,196,208,221,234,248,263,279,295,313,332,352,373,395,419,444,471,499,529,123];
var song=[];
var A = new window.AudioContext;
copy=D=>{
	for (var d = 0; d<D.length; d++){
		song[song.length] = D[d];
	}
}
n=(e,x,s)=>{
	for(V = x,
		    b = (e, t, a, i) => Math.sin(e / t * 6.28 * a + i),
		    w=(e,t)=>Math.sin(e / 44100 * t * 6.28 + b(e, 44100, t, 0) ** 2 + .75 * b(e, 44100, t, .25) + .1 * b(e, 44100, t, .5)),
		    D = [],
		    i = 0;
	    i < 44100 * V;
	    i++
	){
		D[i] =
			i < 88
				? i / 88.2 * w(i, e)
				: e ? (1 - (i - 88.2) / (44100 * (V * s))) ** ((.5 * Math.log(1e4 * e / 44100)) ** 2) * w(i, e) : 0;
	}
	copy(D);
};
clearSong=e=>{
	song = [];
};
playSong=notes=>{
	if (sound){
		A.resume();
		buildSong(notes);
		m = A.createBuffer(1, 1e6, 44100),
		m.getChannelData(0).set(song),
		s = A.createBufferSource(),
		s.buffer = m,
		s.connect(A.destination),
		s.onended=clearSong(),
		s.start();
	}
};
buildSong=notes=>{
	for(var i=0; i<notes.length; i++){
		if(notes[i]) {
			note = notes[i].split('-');
			var s = note[2] ? note[2] : 2;
			n(tones[note[0]],note[1]/5,s);
		} else {
			n(0,.1);
		}
	}
};