
class Ship extends Point {
  constructor(x, y, vx, vy, radius, canvas) {
    super(x, y, vx, vy, radius);
    this.canvas = canvas;
    this.pos = new Vector(100, this.canvas.height / 2);
    this.r = 10;
    this.heading = 0;
    this.rotation = 0;
    this.vel = new Vector(0, 0);
    this.gravity = new Vector(0, 2);
    this.isBoosting = false;
    this.mass = 6;
    this.isDead = false;
    this.color = 'rgb(65, 35, 155)';

    // this.entity = new Entity(16);
    // this.point = new Point(this.pos.x, this.pos.y);
    // this.pin();
    this.setRadius(1);
    // this.entity.addPoint(this.point)
  }
  boosting(b) {
    this.isBoosting = b;
  };

  updateShip() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.pos.x = this.pos.x;
    this.pos.y = this.pos.y;
    this.resetVelocity()
  };
  boost() {
    var force = Vector.fromAngle(this.heading);
    force.mult(0.15);
    this.vel.add(force);
  };
  renderShip(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.heading);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.r, 0);
    ctx.lineTo(this.r, 0);
    ctx.lineTo(-this.r, -this.r + 2);
    ctx.lineTo(-this.r, this.r - 2)
    ctx.fill()
    ctx.closePath()
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    if (this.isBoosting) {
      ctx.moveTo(-10, 0)
      ctx.lineTo(-20, 0)
    }
    ctx.stroke()
    ctx.closePath()
    ctx.restore();
  };
  edges() {
    if (this.pos.x > this.canvas.width + this.r) {
      this.pos.x = -this.r;
    }
    else if (this.pos.x < -this.r) {
      this.pos.x = this.canvas.width + this.r;
    }
    if (this.pos.y > this.canvas.height + this.r) {
      this.pos.y = -this.r;
    }
    else if (this.pos.y < -this.r) {
      this.pos.y = this.canvas.height + this.r;
    }
  };
  setRotation(a) {
    this.rotation = a;
  };
  turn() {
    this.heading += this.rotation;
  };
}
