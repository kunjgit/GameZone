/**
 * @class Player
 */
class Player {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.radius = 8;

    this.tiltLR = 0;
    this.tiltFB = 0;

    this.isUsingKeyboard = false;

    if (!window.DeviceOrientationEvent) {
      alert("Sorry, your browser doesn't support Device Orientation")
    }

    if (!('ontouchstart' in window)) {
      this.isUsingKeyboard = true;
      this.keys = {};
      // window.addEventListener("keydown", (e) => {
      //   this.keys[e.keyCode] = true;
      // });
      // window.addEventListener("keyup", (e) => {
      //   delete this.keys[e.keyCode];
      // });
      // window.addEventListener('keydown', () => {
      //   if (65 in this.keys)
      //     this.acc.x -= 1;
      //   if (68 in this.keys)
      //     this.acc.x += 1;
      //   if (87 in this.keys)
      //     this.acc.y -= 1;
      //   if (83 in this.keys)
      //     this.acc.y += 1;
      // });
      window.addEventListener('mousemove', (e) => {
        let pos = p5.Vector.sub(this.pos, createVector(e.offsetX, e.offsetY))
        this.applyForce(pos)
      })
    } else {
      window.addEventListener('deviceorientation', (e) => {
        this.tiltLR = e.gamma;
        this.tiltFB = e.beta;
        let gyro = createVector(this.tiltLR, this.tiltFB);
        this.applyForce(gyro);
      });
    }
  }


  reset() {
    this.pos = createVector(width / 2, height / 2);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.tiltLR = 0;
    this.tiltFB = 0;
  }


  applyForce(f) { this.acc.add(f) }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  shoot() {
    if (!game.gameover) {
      game.bullets.push(new Bullet(this.pos, this.vel.heading()));
      game.sounds.pew.amp(0.3);
      game.sounds.pew.play();
    };
  }

  collidePointPoly(px, py, target, vertices) {
    var collision = false;
    // go through each of the vertices, plus the next vertex in the list
    var next = 0;
    for (var current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1;
      if (next == vertices.length) next = 0;
      // get the PVectors at our current position this makes our if statement a little cleaner
      var vc = vertices[current];
      var vn = vertices[next];
      let vcy = target.pos.y + vc.y;
      let vny = target.pos.y + vn.y;
      let vcx = target.pos.x + vc.x;
      let vnx = target.pos.x + vn.x;
      if (((vcy > py && vny < py) || (vcy < py && vny > py)) &&
        (px < (vnx - vcx) * (py - vcy) / (vny - vcy) + vcx)) {
        collision = !collision;
      }
    }
    return collision;
  }
  hit(target) {
    return this.collidePointPoly(this.pos.x, this.pos.y, target, target.vertices);
  }

  hitWall() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    // text(this.tailDots.length, 100, 100)
    fill(255);

    ellipse(0, 0, this.radius, this.radius);
    // triangle(-this.radius, this.radius, this.radius, this.radius,0, -this.radius);
    pop();
  }
}