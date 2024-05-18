class Point {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number=} vx 
   * @param {number=} vy 
   * @param {number=} radius 
   */
  constructor(x, y, vx, vy, radius) {
    this.pos = new Vector(x, y);
    this.oldpos = new Vector(x + (vx || 0), y + (vy || 0));
    this.bounce = 0.99;
    this.friction = 0.97;
    this.groundFriction = 0.7;
    this.gravity = new Vector(0, 1);
    this.pinned = false;
    this.radius = radius || 5;
    this.color = '#e62a4f';
    this.mass = 1;
    this.sticks = [];
    // this.behaviors = [];
    this.forceAcc = 1;
    this.uid = ''
  }

  /**
   * 
   * @param {Vector} g 
   */
  setGravity(g) {
    this.gravity = g;
    return this;
  }
  /**
   * 
   * @param {number} f 
   */
  setFriction(f) {
    this.friction = f;
    return this;
  }
  /**
   * 
   * @param {number} f 
   */
  setGroundFriction(f) {
    this.groundFriction = f;
    return this;
  }
  /**
   * 
   * @param {number} b
   */
  setBounce(b) {
    this.bounce = b;
    return this;
  }
  /**
   * 
   * @param {number} f 
   * @returns {Point}
   */
  setForceAcc(f) {
    this.forceAcc = f;
    return this;
  }
  /**
   * 
   * @param {number} m 
   * @returns {Point}
   */
  setMass(m) {
    this.mass = m;
    return this;
  }
  /**
   * 
   * @param {number} radius 
   * @returns {Point}
   */
  setRadius(radius) {
    this.radius = radius;
    return this;
  }

  /**
   * @param {string} color 
   * @returns {Point}
   */
  setColor(color) {
    this.color = color;
    return this;
  }

  /**
   * @param {Vector} vel 
   * @returns {Point}
   */
  setVelocity(vel) {
    this.oldpos.setXY(vel.x, vel.y);
    return this;
  }

  /**
   * @returns {Point}
   */
  pin() {
    this.pinned = true;
    return this;
  }
  /**
   * @returns {Point}
   */
  unpin() {
    this.pinned = false;
    return this;
  }

  resetVelocity() {
    this.oldpos.setXY(this.pos.x, this.pos.y);
  }

  /**
   * 
   * @param {number} angle 
   * @param {number} offset 
   */
  rotate(angle, offset) {
    let x = offset.x + (this.pos.x - offset.x) * Math.cos(angle) - (this.pos.y - offset.y) * Math.sin(angle);
    let y = offset.y + (this.pos.x - offset.x) * Math.sin(angle) + (this.pos.y - offset.y) * Math.cos(angle);
    this.pos.setXY(x, y);
  }

  /**
   * 
   * @param {Point} p 
   * @param {number} radius 
   * @param {number} strength 
   */
  resolveBehaviors(p, radius = this.radius, strength = this.forceAcc) {
    var delta = Vector.sub(this.pos, p.pos);
    var dist = delta.magSq();

    let magR = radius * radius;
    if (dist < magR) {
      var f = delta.normalizeTo(1 - (dist / magR)).mult(strength);
      this.applyForce(f);
    }
  }

  /**
   * 
   * @param {number|Vector} f 
   */
  applyForce(f) {
    this.pos.add(f);
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} time 
   * @param {number} radius 
   * @param {number} speed 
   */
  addMotor(x, y, time, radius, speed) {
    this.pos.x = x + radius * Math.cos(time * speed);
    this.pos.y = y + radius * Math.sin(time * speed);
  }

  /**
   * @param {Verly} verlyInstance 
   */
  constrain(verlyInstance) {
    // if (this.pos.y > HEIGHT - 1) {
    //   this.pos.y = HEIGHT - 1;
    // }
    // if (this.pos.x < 0) {
    //   this.pos.x = 0;
    // }
    // if (this.pos.x > WIDTH - 1) {
    //   this.pos.x = WIDTH - 1;
    // }
    // let vel = Vector.sub(this.pos, this.oldpos);
    if (this.pos.x > verlyInstance.WIDTH - this.radius) {
      this.pos.x = verlyInstance.WIDTH - this.radius;
      // this.oldpos.x = (this.pos.x + vel.x) * this.bounce;
    }
    if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      // this.oldpos.x = (this.pos.x + vel.x) * this.bounce;
    }
    if (this.pos.y > verlyInstance.HEIGHT - this.radius) {
      this.pos.y = verlyInstance.HEIGHT - this.radius;
      // this.oldpos.y = (this.pos.y + vel.y) * this.bounce;
    }
    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      // this.oldpos.y = (this.pos.y + vel.y) * this.bounce;
    }
  };


  /**
   * @param {Verly} verlyInstance 
   */
  update(verlyInstance) {
    if (this.pinned) return;
    let vel = Vector.sub(this.pos, this.oldpos);
    vel.mult(this.friction);
    // if the point touches the ground set groundFriction
    if (this.pos.y >= verlyInstance.HEIGHT - this.radius && vel.magSq() > 0.000001) {
      var m = vel.mag();
      vel.x /= m;
      vel.y /= m;
      vel.mult(m * this.groundFriction);
    }
    this.oldpos.setXY(this.pos.x, this.pos.y);
    this.pos.add(vel);
    this.pos.add(this.gravity);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}


export default Point;