window.finalScene = (() => {
  const g = [[[8,52,11,72,16,36],"","black",1],[[75,36,86,53,80,72],"","black",1],[[39,35,56,35,67,72,26,72],"","rgba(255, 255, 255, .1)",1],[[51,0,0,36,97,37],"","black",1],[[36,17,15,30,33,29],"","red",1],[[65,17,82,31,67,29],"","red",1]];
  let anim;
  let isStarted = false;
  let startedTime;
  let position = new V(1000, 147);
  let velocity = new V();
  let angle = 0;
  let scale = 3;

  return {
    i: () => {
      isStarted = true;
      startedTime = +new Date();
      anim = new Anim(g, [[0,0,[39,35,56,35,56,35,38,35],0,0,0],[[33,32,47,16,16,35],[76,36,56,34,46,16],[39,35,56,35,57,35,38,35],0,0,0]], 2000, true);
    },
    n: () => {
      if (isStarted && +new Date() - startedTime > 2500) {
        angle += .01;
        if (angle > Math.PI / 4) {
          angle = Math.PI / 4;
        }
        scale -= .01;
        const acc = velocity.get().normalize().mult(-0.017);
        acc.add(new V(-.2, .1));
        velocity.add(acc);
        position.add(velocity);
      }
    },
    r: () => {
      c.save();
      c.translate(100, 550);
      c.scale(1, -1);
      c.font = '120px Courier New';
      c.textAlign = 'left';
      c.fillStyle = "white";
      c.fillText('THE END', 0, 0);
      c.translate(0, 100);
      c.font = '60px Courier New';
      c.fillText('Thanks for playing!', 10, 0);
      c.restore();

      c.save();
      c.translate(position.x, position.y);
      c.scale(scale, -scale);
      c.rotate(angle);
      draw.r(isStarted ? anim.n() : g, [97, 72]);
      c.restore();
    },
    rBackground: () => {
      let bg = c.createLinearGradient(0, 0, 0, gc.res.y);
      bg.addColorStop(0, 'hsl(238, 10%, 30%)');
      bg.addColorStop(1, 'hsl(238, 10%, 10%)');
      c.save();
      c.fillStyle = bg;
      // c.fillStyle = '#000000';
      c.fillRect(0, 0, gc.res.x, gc.res.y);
      c.restore();
    }
  };
})();
