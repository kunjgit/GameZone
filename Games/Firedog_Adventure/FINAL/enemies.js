class Enemy {
  constructor() {
    this.framex = 0;
    this.framey = 0;
    this.fps = 20;
    this.frameinterval = 1000 / this.fps;
    this.frametimer = 0;
    this.markfordeletion = false;
  }
  update(deltatime) {
    this.x -= this.speedx + this.game.speed;
    this.y += this.speedy;
    if (this.frametimer > this.frameinterval) {
      this.frametimer = 0;
      if (this.framex < this.maxframe) this.framex++;
      else this.framex = 0;
    } else {
      this.frametimer += deltatime;
    }
    if (this.x + this.width < 0) this.markfordeletion = true;
  }
  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.framex * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedx = Math.random() + 1;
    this.speedy = 0;
    this.maxframe = 5;
    this.image = document.getElementById("enemy_fly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltatime) {
    super.update(deltatime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}
export class GroundEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundmargin;
    this.image = document.getElementById("enemy_plant");
    this.speedx = 0;
    this.speedy = 0;
    this.maxframe = 1;
  }
}
export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.image = document.getElementById("enemy_spider_big");
    this.speedx = 0;
    this.speedy = Math.random() > 0.5 ? 1 : -1;
    this.maxframe = 5;
  }
  update(deltatime) {
    super.update(deltatime);
    if (this.y > this.game.height - this.height - this.groundmargin)
      this.speedy *= -1;
    if (this.y < -this.height) this.markfordeletion = true;
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}
