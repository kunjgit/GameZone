var Audio = (function () {
  var C4 = 261.626,
      E4 = 329.628,
      A3 = 220,
      A4 = 440,
      D4 = 293.665,
      F4 = 349.228,
      G3 = 195.998,
      G4 = 391.995,
      B3 = 246.942,
      SONG  = [C4,C4,E4,E4,A3,A3,C4,C4,D4,D4,F4,F4,G3,G3,B3,B3];

  function play (noteIndex, type, volume) {
    var oscNode = audioCtx.createOscillator(),
        gainNode = audioCtx.createGain();

    oscNode.type = type;
    oscNode.frequency.value = SONG[noteIndex % SONG.length];
    oscNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = volume;
    oscNode.start(0);

    setTimeout(function () {
      oscNode.stop(0);
    },600);
  }

  return {
    playNote: function (noteIndex, useAccent) {
      var type = useAccent ? 'triangle' : 'sine',
          volume = useAccent ? 0.7 : 0.5;

      play(noteIndex, type, volume);
    }
  };
})();