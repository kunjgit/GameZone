window.sfx = (() => {
  let lastFX = +new Date();

  function playShort(frequency, time, volume) {
    if (gc.muted) return false;
    const o = gc.ac.createOscillator();
    const g = gc.ac.createGain();
    o.type = 'triangle';
    o.connect(g);
    g.connect(gc.ac.destination);
    o.frequency.value = frequency;
    o.start(0);
    g.gain.value = volume || 1;
    g.gain.exponentialRampToValueAtTime(0.00001, gc.ac.currentTime + (time || .5));
  }

  return {
    fall: () => {
      playShort(43.65);
    },
    jump: () => {
      playShort(82.41, .2);
    },
    run: () => {
      if (+new Date() - lastFX < 200) return;
      playShort(146.83, .05, .4);
      lastFX = +new Date();
    },
    wall: () => {
      if (+new Date() - lastFX < 100) return;
      playShort(41.20, .2);
      lastFX = +new Date();
    },
    die: () => {
      playShort(61.74, 3);
    },
    fallingBlock: () => {
      playShort(51.91, 5);
    },
    takePower: () => {
      playShort(220.00, .5);
    },
    flying: () => {
      if (+new Date() - lastFX < 30) return;
      playShort(27.50, .5);
      lastFX = +new Date();
    }
  };
})();
