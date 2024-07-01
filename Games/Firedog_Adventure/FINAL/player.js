import { Sitting } from "./playerstate.js";
import { Jumping } from "./playerstate.js";
import { Running } from "./playerstate.js";
import { Falling } from "./playerstate.js";
import { Rolling } from "./playerstate.js";
import { Diving } from "./playerstate.js";
import { HIT } from "./playerstate.js";
import { CollisionAnimation } from "./collisionanimation.js";
export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100.5;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundmargin;
    this.vy = 0;
    this.framex = 0;
    this.framey = 0;
    this.maxframe;
    this.fps = 20;
    this.frameinterval = 1000 / this.fps;
    this.frametimer = 0;
    this.speed = 0;
    this.weight = 1;
    this.maxspeed = 10; //speed
    this.image = document.getElementById("player");
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),      
      new HIT(this.game),      

    ];
    
  }
  update(input, deltatime) {
    this.checkcollision();
    this.currentstate.handleinput(input);

    this.x += this.speed;
    if (input.indexOf("ArrowRight") > -1 && this.currentstate!=this.states[6]) {
      this.speed = this.maxspeed;
    } else if (input.indexOf("ArrowLeft") > -1 &&this.currentstate!=this.states[6]) {
      this.speed -= this.maxspeed;
    } else this.speed = 0;
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;
    //vertical movement

    // if (input.indexOf("ArrowUp") > -1 && this.onground()) {
    //   this.vy -= 30;
    // }
    this.y += this.vy;
    
    if (!this.onground()) this.vy += this.weight;
    else this.vy = 0;
    //sprite animations
//vertical boundaries
if(this.y>this.game.height-this.height-this.game.groundmargin)
this.y=this.game.height-this.height-this.game.groundmargin;
    if (this.frametimer > this.frameinterval) {
      this.frametimer = 0;
      if (this.framex < this.maxframe) this.framex++;
      else this.framex = 0;
    } else this.frametimer += deltatime;
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.framex * this.width + 3, //3hr search
      this.framey * this.height,
      this.height,
      this.width,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  onground() {
    return this.y >= this.game.height - this.height - this.game.groundmargin;
  }
  setState(state, speed) {
    this.currentstate = this.states[state];
    this.game.speed = this.game.maxspeed * speed;
   // console.log(this.currentstate);
    this.currentstate.enter();
  }
  checkcollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markfordeletion = true;
        this.game.collisions.push(new CollisionAnimation(this.game,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
        if(this.currentstate===this.states[4]||this.currentstate===this.states[5])
        {
        this.game.score++;
      }
      else{
        this.setState(6,0);
      
      }}
    });
  }
}
