/**@type {HTMLCanvasElement} */

class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.background = new Background(this);
    this.ratio = this.height / this.baseHeight;
    this.player = new Player(this);
    this.sound = new AudioControl();
    this.obstacles = [];
    this.numberOfObstacles = 50;
    this.gravity;
    this.debug;
    this.speed;
    this.minSpeed;
    this.maxSpeed;
    this.score;
    this.gameOver;
    this.timer;
    this.message1;
    this.message2;
    this.barSize;
    this.smallFont;
    this.largeFont;
    //this is used for optimisation since refresh rates are different for different screens and devices
    this.eventTimer = 0;
    this.eventUpdate = false;
    this.eventInterval = 150;
    this.touchStartX;
    this.swipeDistance = 50;
    this.bottomMargin;
    this.isfullScreen = false;

    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });

    //mouse controls
    this.canvas.addEventListener("mousedown", (e) => {
      this.player.wingsDown();
      this.player.flap();
    });
    this.canvas.addEventListener("mouseup", (e) => {
      setTimeout(() => {
        this.player.wingsUp();
      }, 50);
      // this.player.wingsUp();
    });
    //button controls
    rbtn.addEventListener("click", () => {
      this.resize(window.innerWidth, window.innerHeight);
    });
    dbtn.addEventListener("click", () => {
      this.debug = !this.debug;
    });
    startbtn.addEventListener("click", () => {
      document.querySelector(".intro").style.display = "none";
      document.getElementById("canvas1").style.display = "block"; 
        this.resize(window.innerWidth, window.innerHeight);

    });
    //keyboard controls
    window.addEventListener("keydown", (e) => {
      if (e.key == "Enter" || e.key == " ") {
        this.player.wingsDown();
        this.player.flap();
      }
      // -------------------boost ----------------
      if (e.key == "Control" || e.key.toLowerCase() == "c") {
        this.player.startCharge();
      }
      if (e.key.toLowerCase() == "r")
        this.resize(window.innerWidth, window.innerHeight);

      if (e.key.toLowerCase() == "f") fullscreen();

      if (e.key.toLowerCase() == "d") this.debug = !this.debug;
    });
    window.addEventListener("keyup", (e) => {
      this.player.wingsUp();

      if (e.key == "Control" || e.key == "c" || e.key == "C") {
        this.player.stopCharge();
      }
    });
    //touch events

    this.canvas.addEventListener("touchstart", (e) => {
      this.player.wingsDown();

      this.player.flap();
      this.touchStartX = e.changedTouches[0].pageX;
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });
    this.canvas.addEventListener("touchend", (e) => {
      if (e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
        this.player.startCharge();
      }
      // this.player.stopCharge();
    });
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    // states get reset when the canvas is resized so its better to change state only when resized for performance reasons
    // this.ctx.fillStyle = "blue";
    this.ctx.font = "15px Bungee";
    this.ctx.textAlign = "right";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    // ------------ratio---------
    this.ratio = this.height / this.baseHeight;
    this.speed = 2 * this.ratio;
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 5;
    this.gravity = 0.15 * this.ratio;
    this.bottomMargin = Math.floor(50 * this.ratio);
    this.smallFont = Math.floor(35 * this.ratio);
    this.largeFont = Math.floor(45 * this.ratio);

    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacles.forEach((obstacle) => {
      obstacle.resize();
    });

    this.score = 0;
    this.gameOver = false;
    this.timer = 0;
    this.barSize = 10 * this.ratio;

    this.debug = false;
  }
  render(deltaTime) {
    if (deltaTime) {
      this.handlePeriodicEvents(deltaTime);
      if (!this.gameOver) {
        this.timer += deltaTime;
      }
    }
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();
    });
  }
  createObstacles() {
    this.obstacles = [];
    //deletes all the previous obstacles
    const firstX = 600;
    const obstacleSpacing = 600 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  }
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance < sumOfRadii;
  }
  formatTimer() {
    return (this.timer * 0.001).toFixed(2);
  }
  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer %= this.eventInterval;
      this.eventUpdate = true;
    }
  }
  triggerGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
      if (this.obstacles.length <= 0) {
        this.sound.play(this.sound.win);
        this.message1 = "A Job Well Done";
        this.message2 =
          "Can you do it faster than " + this.formatTimer() + " seconds?";
      } else {
        this.sound.play(this.sound.lose);
        this.message1 = "Getting Rusty Are We";
        this.message2 = "Collision Timer: " + this.formatTimer() + " seconds!";
      }
    }
  }

  drawStatusText() {
    this.ctx.save();
    this.ctx.fillText("Score: " + this.score, this.width - 10, this.largeFont);
    this.ctx.textAlign = "left";
    this.ctx.fillText("Time: " + this.formatTimer(), 10, this.largeFont);
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = this.largeFont + "px Bungee";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - this.largeFont,
        this.width - 20
      );
      this.ctx.font = this.smallFont + "px Bungee";

      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5,
        this.width - 20
      );
      this.ctx.fillText(
        'Press "R" to try agian',
        this.width * 0.5,
        this.height * 0.5 + this.largeFont,
        this.width - 20
      );
    }

    if (this.player.energy <= this.player.minEnergy) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "green";
    }
    // -----------------bar size---------
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(
        10 + this.barSize * i,
        this.largeFont + 10,
        this.barSize + 0.5,
        15
      );
    }
    this.ctx.restore();
  }
  toggleFullScreen() {}
}

window.addEventListener("load", function () {
  let startbtn = document.getElementById("start");
  
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.height = 720;
  canvas.width = 720;
  let game = new Game(canvas, ctx);  
  game.render();
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
