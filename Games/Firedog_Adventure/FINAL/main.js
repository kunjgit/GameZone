import { Player } from "./player.js";
import { Inputhandler } from "./input.js";
import { Background } from "./background.js";
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./ui.js";
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1400;
  canvas.height = 650;
  class Game {
    constructor(width, height) {
      this.restart=false;
      this.width = width;
      //console.log("d",this.width);
      this.height = height;
      this.groundmargin = 90;
      this.speed = 0;
      this.maxspeed = 3;
      this.background = new Background(this);
      console.log(this.background);

      this.player = new Player(this);
      console.log(this.player);
      this.input = new Inputhandler(this);
      this.ui = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.maxparticles = 50;
      this.enemytimer = 0;
      this.enemyinterval = 2500;
      this.debug = 0;
      this.score = 0;
      this.fontcolor = "red";
      this.time = 0;
      this.gameover = false;
      this.maxtime = 100000;

      this.player.currentstate = this.player.states[0];

      this.player.currentstate.enter();
    }
    update(deltatime) {
      this.time += deltatime;
      if (this.time > this.maxtime)
      {
       
         this.gameover = true;
         startNewGame();
          window.location.href='https://jayeshyadav99.github.io/Endless-Running-Game---Beginner-Project/';
         
    
      console.log(this.gameover);}
      this.background.update();
      this.player.update(this.input.keys, deltatime);
      //handleenemies
      if (this.enemytimer > this.enemyinterval) {
        this.addEnemy();
        this.enemytimer = 0;
      } else {
        this.enemytimer += deltatime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltatime);
        if (enemy.markfordeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });
      //handle particles
      this.particles.forEach((particles, index) => {
        particles.update();
        if (particles.markfordeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxparticles) {
        this.particles = this.particles.splice(0, this.maxparticles);
      }
      //
      this.collisions.forEach((collision, index) => {
        collision.update(deltatime);
        if (collision.markfordeletion) this.collisions.splice(index, 1);
      });
    }
    
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });

      this.ui.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }
  let game=null;
  function startNewGame() {
    // Create a new game instance
    game = new Game(canvas.width, canvas.height);
    requestAnimationFrame(animate);
  }
    
  
  game = new Game(canvas.width, canvas.height);
  let lasttime = 0;
  function animate(timeStamp) {
    const deltatime = timeStamp - lasttime;
    lasttime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltatime);
    game.draw(ctx);
    

    if (!game.gameOver) {
      requestAnimationFrame(animate);
    } else {
      // Game over, start a new game
      startNewGame();
    }
    
  }
  animate(0);
});
