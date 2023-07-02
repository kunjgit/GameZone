function PowerBlock(type, x, y) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.active = true;
  this.collisionRadius = 35;

  let startBeingInactive = 0;
  let opacity = 1;

  const anim = new Anim([[[18,0,18,37,0,17],'','power',1]], [[[18,4,18,42,36,21]]], 500);

  this.center = () => new V(this.x + 15, this.y + 15);

  this.destroy = () => {
    this.active = false;
    opacity = 0;
    startBeingInactive = +new Date();
    particles.takePower(new V(this.x, this.y));
    sfx.takePower();
  };

  this.n = () => {
    if (!this.active && +new Date() - startBeingInactive >= 4000) {
      this.active = true;
    }

    if (this.active) {
      opacity += .03;
      if (opacity > 1) {
        opacity = 1;
      }
    }
  };

  this.r = () => {
    if (this.active) {
      c.save();
      c.globalAlpha = opacity;
      c.translate(this.x, this.y);
      c.scale(1, -1);
      draw.r(anim.n(), [36, 37]);
      c.globalAlpha = 1;
      c.restore();
    }
  };
}

function FanBlock(type, x, y) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.active = true;
  let fanLast = +new Date();

  const anim = new Anim(
    [[[1,56,118,55,109,44,9,45],'black','black',1],[[0,50,0,81,120,81,120,50],'black','black',1],[[8,60,7,66,11,69,15,68,15,62],'','mechanics',1],[[103,59,108,62,107,68,100,69,99,62],'','mechanics',1],[[18,45,14,34,14,27,12,18,15,11,18,1,19,1,17,11,14,17,17,26,18,34,20,44],'black','black',1],[[30,46,27,37,29,30,25,15,29,6,29,0,32,0,31,6,27,15,31,29,30,37,33,45],'black','black',1],[[62,45,64,44,63,30,61,21,64,12,65,1,62,1,60,11,58,21,61,30],'black','black',1],[[90,45,92,45,91,37,92,26,95,17,94,8,94,2,91,2,92,9,92,16,88,25,88,37],'black','black',1]],
    [[0,0,0,0,[18,45,23,34,24,26,23,20,13,19,10,13,13,8,16,16,26,17,27,26,25,35,20,44],[30,46,37,37,39,30,41,16,44,9,36,1,41,1,47,8,44,17,42,29,41,37,33,45],[62,45,64,44,58,30,67,26,73,21,63,10,62,17,69,20,64,24,56,31],[90,45,92,45,95,37,101,24,99,16,92,10,85,5,82,6,88,13,96,17,99,25,92,37]],[0,0,0,0,[17,45,9,35,4,29,2,19,3,12,18,13,19,16,7,14,6,20,9,28,14,35,19,44],[30,46,24,38,21,31,12,20,7,14,1,10,4,8,12,14,17,20,25,30,27,38,33,45],[62,45,64,44,70,31,65,18,56,13,44,10,42,13,52,15,62,20,67,32],[90,45,92,45,88,36,83,28,83,21,86,13,94,14,93,9,84,12,79,20,79,28,84,36]]],
    rInt(100, 200)
  );

  this.n = () => {
    if (+new Date() - fanLast < 100) {
      return false;
    }
    particles.addFan(new V(this.x, this.y));
    fanLast = +new Date();
  };

  this.r = () => {
    c.save();
    c.translate(this.x + 60, this.y + 41);
    c.scale(1, -1);
    draw.r(anim.n(), [120, 81]);
    c.restore();
  };
}

function SawBlock(type, x, y, w, h, d) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.d = d;
  this.active = true;
  this.collisionRadius = 35;

  const func = [
    () => {
      velocity += acc;
      angle += velocity;

      if (velocity <= -.5) nextFunc();
    },
    () => {
      velocity *= .97;
      angle += velocity;
      const current = original.get().add(this.d.get().mult(shift));
      this.x = current.x;
      this.y = current.y;
      if (shift > 1 || shift < 0) {
        direction *= -1;
        nextFunc();
      }
      shift += (step * direction);
    }
  ];
  const g = [[[19,0,28,11,27,21,13,17,0,28,12,26,20,34,10,39,7,56,16,45,24,46,22,56,36,68,32,56,39,48,48,58,65,56,53,50,49,40,63,43,76,30,62,33,52,27,64,16,54,0,54,12,41,19,33,4],'black','black',1]];
  const gHolder = [[[6,6,0,22,7,37,23,41,36,35,40,22,36,7,21,0],'','black',1],[[20,17,17,21,20,24,24,23,26,18],'','mechanics',1]];
  const speed = 6;
  let angle = 0;
  let acc = -.015;
  let velocity = 0;
  let currentFunc = -1;

  let original = new V(x, y);
  let shift = 0;
  let step = 1 / Math.floor(d.mag() / speed);
  let direction = 1;

  function nextFunc() {
    currentFunc++;
    if (currentFunc === func.length) {
      currentFunc = 0;
    }
  }

  nextFunc();

  this.n = () => {
    func[currentFunc]();
  };

  this.center = () => new V(this.x + 15, this.y + 15);

  this.r = () => {
    c.save();
    c.translate(this.x + 18, this.y + 18);
    c.scale(1, -1);
    c.rotate(angle);
    draw.r(g, [76, 68]);
    c.restore();

    // Holder 1
    c.save();
    c.translate(original.x + 18, original.y + 18);
    draw.r(gHolder, [40, 40]);
    c.restore();

    // Holder 2
    c.save();
    c.translate(original.x + d.x + 18, original.y + d.y + 18);
    draw.r(gHolder, [40, 40]);
    c.restore();
  };
}

function BrokenBlock(type, x, y, w, h, d) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.d = d;

  this.active = true;
  this.isMovable = d.mag() > 0;

  this.falling = {
    active: false,
    falling: false,
    dead: false,
    position: new V(),
    velocity: new V(),
    opacity: 1,
    start: 0
  };

  const g = [[[0,0,40,0,39,33,33,29,26,37,16,31,9,29,7,38,0,34],'','black',1]];
  const gHolder = [[[12,0,0,22,11,40,40,36,40,4],'','black',1],[[19,16,16,20,19,24,24,23,26,17],"",'mechanics',1]];
  const speed = 2;

  let original = new V(x, y);
  let shift = 0;
  let step = this.isMovable ? 1 / Math.floor(d.mag() / speed) : 0;
  let direction = 1;

  this.startFalling = () => {
    if (this.falling.active) return;
    sfx.fallingBlock();
    this.falling.active = true;
    this.falling.start = +new Date();
  };

  this.getVelocity = () => new V();

  this.n = () => {
    if (this.isMovable && !this.falling.falling) {
      const current = original.get().add(this.d.get().mult(shift));
      this.x = current.x;
      this.y = current.y;
      if (shift > 1 || shift < 0) {
        direction *= -1;
      }
      shift += (step * direction);
    }

    if (this.falling.active && !this.falling.falling) {
      if (+new Date() - this.falling.start < 1000) return;
      this.falling.falling = true;
      this.active = false;
      this.falling.position = new V(this.x, this.y);
    } else if (this.falling.falling && !this.falling.dead) {
      const acc = this.falling.velocity.get().normalize().mult(-0.017);
      acc.add(gc.gravity.get().mult(.3));
      this.falling.velocity.add(acc);
      this.falling.position.add(this.falling.velocity);
      this.x = this.falling.position.x;
      this.y = this.falling.position.y;
      this.falling.opacity -= .04;
      if (this.falling.opacity < 0) {
        this.falling.dead = true;
        this.falling.opacity = 0;
        setTimeout(() => {
          this.falling.active = false;
          this.falling.falling = false;
          this.falling.velocity = new V();
          this.falling.dead = false;
          this.active = true;
          this.x = x;
          this.y = y;
        }, 2000)
      }
    }

    if (!this.falling.active) {
      this.falling.opacity += .05;
      if (this.falling.opacity > 1) this.falling.opacity = 1;
    }
  };

  this.r = () => {
    if (this.isMovable) {
      // Holder 1
      c.save();
      c.translate(original.x + (w / 2), original.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Holder 2
      c.save();
      c.translate(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Line
      c.save();
      c.strokeStyle = color.mechanics;
      c.moveTo(original.x + (w / 2), original.y + (h / 2));
      c.lineTo(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      c.stroke();
      c.restore();
    }

    c.save();
    c.translate(this.x + 20, this.y + 20);
    c.globalAlpha = this.falling.opacity;
    c.scale(1, -1);
    for (let i = 0; i < Math.floor(this.w / 40); i++) {
      c.save();
      if (this.falling.active) {
        c.translate(i * 40 + rInt(-1, 1), rInt(-1, 1));
      } else {
        c.translate(i * 40, 0);
      }
      draw.r(g, [40, 38]);
      c.restore();
    }
    c.globalAlpha = 1;
    c.restore();
  };
}

function Block(type, x, y, w, h, d) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.d = d;
  this.isMovable = d.mag() > 0;
  this.active = true;

  const colors = [color.black, color.black, color.ice, color.black];
  const nails = [[[0,8,40,8,35,0,34,6,23,1,21,5,15,7,11,1,8,6,3,1],'black','black',1]];
  const gHolder = [[[12,0,0,22,11,40,40,36,40,4],'','black',1],[[19,16,16,20,19,24,24,23,26,17],'','mechanics',1]];
  const speed = 2;

  let original = new V(x, y);
  let shift = 0;
  let step = this.isMovable ? 1 / Math.floor(d.mag() / speed) : 0;
  let direction = 1;

  this.n = () => {
    if (this.isMovable) {
      const current = original.get().add(this.d.get().mult(shift));
      this.x = current.x;
      this.y = current.y;
      if (shift > 1 || shift < 0) {
        direction *= -1;
      }
      shift += (step * direction);
    }
  };

  this.getVelocity = () => d.get().normalize().mult(speed * direction);

  this.r = () => {
    if (this.isMovable) {
      // Holder 1
      c.save();
      c.translate(original.x + (w / 2), original.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Holder 2
      c.save();
      c.translate(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Line
      c.save();
      c.strokeStyle = color.mechanics;
      c.moveTo(original.x + (w / 2), original.y + (h / 2));
      c.lineTo(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      c.stroke();
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y);
    if (this.type === 1) {
      // TOP
      c.save();
      c.scale(1, -1);
      c.translate(-20, -this.h - 4);
      for (let i = 0; i < Math.floor(this.w / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();
      // BOTTOM
      c.save();
      c.translate(-20, -4);
      for (let i = 0; i < Math.floor(this.w / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();
      // RIGHT
      c.save();
      c.rotate(Math.PI / 2);
      c.translate(-20, -this.w - 4);
      for (let i = 0; i < Math.floor(this.h / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();
      // LEFT
      c.save();
      c.rotate(-Math.PI / 2);
      c.translate(-this.h - 20, -4);
      for (let i = 0; i < Math.floor(this.h / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();
      c.fillStyle = color.black;
      c.fillRect(0, 0, this.w, this.h);
    } else {
      c.fillStyle = colors[this.type];
      c.fillRect(0, 0, this.w, this.h);
    }
    c.restore();
  }
}
