class Platform {
  constructor(props) {
    this.pos = props.pos;
    this.width = props.width;
    this.color = props.color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.pos[0], this.pos[1], this.width, 10);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(this.pos[0], this.pos[1], this.width, 10);
    ctx.fill();
    ctx.closePath();
  }
}

module.exports = Platform;
