$.SOUNDS = {
  jump: {
    src: [0,,0.1312,,0.264,0.3,,0.2094,0.02,,,-0.02,,0.39,,,0.02,,1,,,,,0.5],
    volume: 0.1,
    audio: null
  },
  hit: {
    src: [0,,0.0436,,0.1363,0.3791,,-0.3996,,,,,,0.0972,,,,,1,,,,,0.5],
    volume: 0.7,
    audio: null
  },
  die: {
    src: [3,0.0206,0.0727,0.0043,0.3537,0.2433,,-0.6639,0.0056,,,-0.0232,0.0432,,0.0159,0.0447,-0.0287,-0.0176,1,0.0257,,0.0442,0.0393,0.29],
    volume: 1,
    audio: null
  }
};

$.SOUND_MANAGER = {};
$.SOUND_MANAGER.init = function() {
  Object.keys($.SOUNDS).forEach(function(sound_key) {
    $.SOUNDS[sound_key].audio = new Audio();
    $.SOUNDS[sound_key].audio.src = jsfxr($.SOUNDS[sound_key].src);
    $.SOUNDS[sound_key].audio.volume = $.SOUNDS[sound_key].volume;
  });
};