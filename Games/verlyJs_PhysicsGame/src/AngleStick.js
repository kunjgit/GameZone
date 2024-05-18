class AngleStick {
  /**
   * 
   * @param {Point} a 
   * @param {Point} b 
   * @param {Point} c 
   * @param {number} stiffness 
   */
  constructor(a, b, c, stiffness) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    this.stiffness = stiffness;
  }
  
  /**
   * 
   */
  update() {
    var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    // get the angle difference
    var diff = angle - this.angle;
    if (diff <= -Math.PI)
      diff += 2 * Math.PI;
    else if (diff >= Math.PI)
      diff -= 2 * Math.PI;
    diff *= 0.1 * this.stiffness;

    this.a.pos = this.a.pos.rotateBy(this.b.pos, diff);
    this.c.pos = this.c.pos.rotateBy(this.b.pos, -diff);
    this.b.pos = this.b.pos.rotateBy(this.a.pos, diff);
    this.b.pos = this.b.pos.rotateBy(this.c.pos, -diff);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.lineTo(this.c.pos.x, this.c.pos.y);
    var tmp = ctx.lineWidth;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.lineWidth = tmp;
  }
}

export default AngleStick;