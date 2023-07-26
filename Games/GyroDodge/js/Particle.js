class Particle extends Bullet {
  constructor(spos, angle) {
    super(spos, angle);

    this.vel = p5.Vector.random2D();
    this.life = 1;
  }

  render() {
    this.vel.y += random(-0.2, 0.2);
    push();
    stroke(255, this.life * 255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
    pop();
  };
  die() {
    this.life -= 0.03;
  }
}