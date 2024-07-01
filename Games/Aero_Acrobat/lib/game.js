const Avatar = require('./avatar');
const Platform = require('./platforms');
const ModalManager = require('./modal');

class Game {
  constructor() {
    this.avatar = [];
    this.platforms = [new Platform({
      pos: [0, Game.DIM_Y-10],
      width: Game.DIM_X,
      color: this.randomColor()
    })];
    this.scoreBoard = document.getElementById('score');
    this.background = new Image();
    this.background.src = "./assets/images/background.png"
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.keysPressed = {};
    this.canvasWrapper = document.getElementById('canvas-wrapper');
    this.addPlatforms();
    this.score = 0;
    this.gameOver = false;
    this.time = 0;
    this.tickCount = 0;
    this.music = new Audio("./assets/sounds/background2.mp3");
    this.music.volume = .5;
    this.muted = false;
    this.requestId = undefined;
  }

  addAvatar( ) {
    const avatar = new Avatar({
      pos: [250, Game.DIM_Y - 80]
    })
    this.avatar.push(avatar);
    return avatar;
  }

  addPlatforms() {
    for (let i = Game.DIM_Y-100; i > 0; i -= 100) {
      const platform = new Platform({
        pos: [this.randomPosition(), i],
        // PLATFORMS GET NARROWER WITH HEIGHT
        width: this.randomWidth() * (i)/Game.DIM_Y*.99,
        color: this.randomColor()
      });
      this.platforms.push(platform);
    }
  }

  allObjects() {
    return this.avatar.concat(this.platforms).reverse();
  }

  checkGameOver() {
    if (this.avatar[0].pos[1] > 11785) {
      this.gameOver = true;
      new ModalManager().openModal();
    }
  }

  checkLandings(timeDelta) {
    this.platforms.forEach(platform => this.avatar[0].landedOn(platform, timeDelta))
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(this.background, 0, 0);
    this.scrollBackground(ctx);

    // const sY = this.avatar[0].pos[1]-300;
    // ctx.drawImage(this.background, 0, sY, 600, 700, 0, 0, 600, 700);
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  handleKeyDown(event) {
    this.keysPressed[event.key] = true;
    if (event.key == "Enter") { this.reset(); }

    event.preventDefault();
  }

  handleKeyUp(event) {
    this.keysPressed[event.key] = false;
  }

  randomPosition() {
    return Math.floor(Math.random() * (Game.DIM_X - 150))
  }

  randomColor() {
    const colorCodes = "0123456789ABCDEF"
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += colorCodes[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  randomWidth() {
    return Math.floor(Game.DIM_X * .25 + Game.DIM_X * Math.random() * .15);
  }

  removeObject(object) {
    if (object instanceof Avatar ) {
      this.avatar = [];
    }
    if (object instanceof Platform ) {
      this.platforms.splice(this.platforms.indexOf(object), 1);
    }
  }

  reset() {
    const instructions = document.getElementById("instructions");
    if (instructions.classList.contains("shown")) {
      instructions.classList.replace("shown", "is-hidden");
    }
    new ModalManager().closeModal();
    this.score = 0;
    this.time = 0;
    this.platforms = [new Platform({
      pos: [0, Game.DIM_Y-10],
      width: Game.DIM_X,
      color: this.randomColor()
    })];
    this.gameOver = false;
    this.addPlatforms();
    this.resetAvatar();
    this.music.currentTime = 0;
  }

  removePlatform() {
    this.platforms.shift();
  }

  resetAvatar() {
    this.avatar[0].pos = [250, Game.DIM_Y - 80];
    this.avatar[0].vel = [0,0];
  }

  scrollBackground() {
    this.canvasWrapper.scrollTop = this.avatar[0].pos[1]-300;
  }

  setTickRate() {
    this.ticksPerRemoval = 500000;
    if (this.time < 40 && this.score > 500) {
      this.ticksPerRemoval = 135;
    }
    else if (this.time < 80 && this.score > 500) {
      this.ticksPerRemoval = 90;
    }
    else if (this.time < 120 && this.score > 500) {
      this.ticksPerRemoval = 60;
    }
  }

  tick(timeDelta, fps) {
    this.time += timeDelta;

    this.setTickRate();
    this.updateAvatar(timeDelta);
    this.checkLandings(timeDelta);
    this.updateScore(fps);
    this.checkGameOver();

    this.tickCount += 1;
    if (this.tickCount > this.ticksPerRemoval) {
      this.tickCount = 0;
      this.removePlatform();
    }
  }

  toggleSound() {
    this.muted = !this.muted;
    this.music.volume = (this.muted === true) ? 0 : .5;
    this.avatar[0].jumpSound.volume = (this.muted === true) ? 0 : 1;
  }

  updateAvatar(timeDelta) {
    if (this.keysPressed["ArrowLeft"]) { this.avatar[0].accelerate("L"); }
    if (this.keysPressed["ArrowRight"]) { this.avatar[0].accelerate("R"); }
    if (this.keysPressed[" "]) { this.avatar[0].jump(); }
    this.avatar[0].move(timeDelta);
  }

  updateScore(fps) {
    let currScore = Math.floor(Game.DIM_Y - this.avatar[0].pos[1] - 80);
    if ( currScore > this.score) {
      this.score = currScore;
    }
    this.scoreBoard.innerHTML = `Score: ${this.score}` + "<br />" + `Time: ${this.time.toFixed(2)}` + "<br />" + `FPS:    ${Math.floor(fps)}`;
  }
}

Game.DIM_X = 600;
Game.DIM_Y = 11745;

module.exports = Game;
