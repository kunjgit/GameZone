/**
 * @class Bullet
 */
class Bullet {
  /**
   * 
   * @param {number} spos 
   * @param {number} angle 
   */
  constructor(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);
    this.angle = angle;
  }

  update() {
    this.pos.add(this.vel);
  };
  
  render() {
    push();
    stroke(255);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    pop();
  };

  hits(target) {
    var d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    if (d < target.radius) {
      return true;
    }
    return false;
  };

  offscreen() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  };
}
