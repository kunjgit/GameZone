(() => {
  window.rInt = (from, to) => Math.floor(from + (Math.random() * (to - from)));
  window.rFloat = (from, to) => from + (Math.random() * (to - from));

  window.gc = {
    res: {x: 1280, y: 720},
    start: +new Date(),
    last: +new Date(),
    paused: false,
    splashScreen: true,
    graphicsQuality: 1,
    muted: false,
    changeQuality: (value) => {
      gc.graphicsQuality = value;
      changeCanvasSize();
    }
  };

  function initOutput(element) {
    gc.canvas = element;

    window.c = gc.canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    window.l = c.lineTo.bind(c);
    window.m = c.moveTo.bind(c);
    window.bp = c.beginPath.bind(c);
    window.cp = c.closePath.bind(c);
  }

  function init() {
    initOutput(document.getElementById('app'));
    gc.gravity = new V(0, -.8);

    resize();

    control.i();

    scene.i();

    live();

    gc.canvas.addEventListener('click', (e) => {
      if (gc.splashScreen) gc.splashScreen = false;
      gc.ac = window.AudioContext ? new AudioContext() : new window.webkitAudioContext();
    });
  }

  function resize() {
    gc.size = {x: window.innerWidth, y: window.innerHeight};
    gc.originalRatio = Math.min(gc.size.x / gc.res.x, gc.size.y / gc.res.y);
    gc.canvas.style.width = Math.round(gc.res.x * gc.originalRatio) + 'px';
    gc.canvas.style.height = Math.round(gc.res.y * gc.originalRatio) + 'px';
    gc.ratio = gc.originalRatio * (window.devicePixelRatio || 1);

    changeCanvasSize();
  }

  function changeCanvasSize() {
    gc.canvas.width = Math.round(gc.res.x * gc.ratio * gc.graphicsQuality);
    gc.canvas.height = Math.round(gc.res.y * gc.ratio * gc.graphicsQuality);
  }

  function live() {
    gc.last = +new Date();

    n();
    r();
    requestAnimationFrame(live);
  }

  function reset() {
    scene.reset();

    gc.paused = false;
  }

  function nextLevel(direction) {
    setTimeout(() => {
      map.nextLevel(direction);
      reset();
    }, 30);
  }

  function n() {
    if (gc.paused) return;
    scene.n();

    if (character.isGoingBack()) {
      gc.paused = true;
      nextLevel(-1);
    } else if (character.levelIsCompleted()) {
      gc.paused = true;
      nextLevel(1);
    } else if (character.isDead()) {
      gc.paused = true;
      reset();
    }
  }

  function r() {
    c.save();
    c.scale(gc.ratio * gc.graphicsQuality, gc.ratio * gc.graphicsQuality);
    scene.r();
    c.restore();
  }

  window.onload = init;
  window.onresize = resize;
})();
