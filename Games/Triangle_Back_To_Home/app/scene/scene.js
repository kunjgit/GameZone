window.scene = (() => {
  let bg;

  return {
    i: () => {
      bg = c.createLinearGradient(0, 0, 0, gc.res.y);
      bg.addColorStop(0, 'hsl(37, 30%, 45%)');
      bg.addColorStop(1, 'hsl(37, 30%, 10%)');

      background.i();
      map.i();
      character.i();
    },
    reset: () => {
      background.reset();
      map.reset();
      character.reset();
      particles.reset();
      camera.reset();
    },
    n: () => {
      if (gc.splashScreen) {
        splashScreen.n();
      } else {
        background.n();
        map.n();
        if (map.isLast()) {
          character.nFinal();
          finalScene.n();
        } else {
          character.n();
        }
        particles.n();
        camera.n();
      }
    },
    r: () => {
      c.save();
      c.fillStyle = bg;
      c.fillRect(0, 0, gc.res.x, gc.res.y);
      c.restore();

      if (gc.splashScreen) {
        splashScreen.r();
      } else {
        if (map.isLast()) {
          finalScene.rBackground();
        } else {
          background.r();
        }

        c.save();
        camera.r();
        map.r();
        if (map.isLast()) {
          character.rFinal();
          finalScene.r();
        } else {
          character.r();
        }
        particles.r();
        c.restore();
      }

      c.save();
      c.translate(1250, 690);
      c.scale(.3, .3);
      if (gc.muted) {
        draw.r([[[0,23,0,59,30,59,55,75,55,0,30,24],'','white',1]], [55, 75]);
      } else {
        draw.r([[[0,27,0,64,30,63,55,80,55,4,30,28],'','white',1],[[59,28,60,57,65,57,64,28],'','white',1],[[66,18,67,64,71,64,71,19],'','white',1],[[73,8,75,72,80,72,79,8],'','white',1],[[83,0,84,81,89,81,87,0],'','white',1]], [89, 81]);
      }
      c.restore();
    }
  };
})();
