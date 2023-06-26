/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Avatar {
  constructor(props) {
    this.image = new Image();
    this.image.src = "./assets/images/rtts_sprites.png";
    this.pos = props.pos;
    this.vel = [0, 0];
    this.jumping = false;
    this.onLand = false;
    this.falling = false;
    this.height = 52;
    this.width = 30;
    this.gravity = 600;
    // SPRITE ANIMATION
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 5;
    this.jumpSound = new Audio("./assets/sounds/jump.wav");
  }

  accelerate(dir) {
    // debugger
    switch (dir) {
      case "L":
        if (this.vel[0] > 0) { this.vel[0] -= 10 }
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] -= 15; }
        if (Math.abs(this.vel[0]) > Avatar.MAX_SPEED ) { this.vel[0] =  -Avatar.MAX_SPEED; }
        break;
      case "R":
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] += 15; }
        if (this.vel[0] < 0) { this.vel[0] += 10 }
        if (Math.abs(this.vel[0]) > Avatar.MAX_SPEED ) { this.vel[0] = Avatar.MAX_SPEED; }
        break;
      default:
        return;
    }
  }

  correctPositions() {
    if ( this.pos[0] < 0 ) { this.pos[0] = 0; this.vel[0] = -this.vel[0]; }
    if ( this.pos[0] > 570 ) { this.pos[0] = 570; this.vel[0] = -this.vel[0];}
    // if ( this.pos[1] > 11685 ) { this.pos[1] = 11685; this.vel[1] = 0; this.jumping = false; }
  }

  decelerate(timeDelta) {
    if (this.vel[0] > 0) { this.vel[0] -= 2; }
    if (this.vel[0] < 0) { this.vel[0] += 2; }
    // SIMULATED GRAVITY
    // this.gravity = (this.onLand) ? 0 : 600;
    this.vel[1] += this.gravity * timeDelta;
  }

  draw(ctx) {
    const { sourceX, sourceY, sourceWidth, sourceHeight } = this.sprite();
    ctx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], sourceWidth, sourceHeight);
  }

  jump() {
    if (!this.jumping) {
      this.onLand = false;
      this.jumping = true;
      if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .25) {
        this.vel[1] -= 350;
      }
      else if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .5) {
        this.vel[1] -= 430;
      }
      else if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .75) {
        this.vel[1] -= 480;
      }
      else {
        this.vel[1] -= 530;
      }
      this.jumpSound.play();
    }
  }

  landed(platform) {
    this.jumping = false;
    this.falling = false;
    this.onLand = true;
    // debugger
    this.vel[1] = 0;
    this.pos[1] = platform.pos[1]-this.height-.001;
  }

  landedOn(platform, timeDelta) {
    if (this.falling) {
      if (this.pos[1]+this.height < platform.pos[1]+2
        && this.pos[1]+this.height > platform.pos[1]-10
        && this.pos[0]+this.width > platform.pos[0]
        && this.pos[0] < platform.pos[0] + platform.width) {
          this.landed(platform);
        }
        else {
          return;
        }
    }
    return;
  }

  move(timeDelta) {
    // console.log(this.vel[1]);
    (this.vel[1] > 0) ? this.falling = true : this.falling = false;
    const scaledOffset = [this.vel[0] * timeDelta, this.vel[1] * timeDelta];
    this.pos = [this.pos[0] + scaledOffset[0], this.pos[1] + scaledOffset[1]];
    this.correctPositions();

    // SPRITE HANDLING
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame){
      this.tickCount = 0;
      this.frameIndex += 1;
    }
    if (this.frameIndex > 3) {
      this.frameIndex = 0;
    }

    // DECELERATE EVERY TICK
    this.decelerate(timeDelta);
  }

  sprite() {
    // HANDLES LOGIC FOR WHAT SPRITE TO USE, PLACEHOLDER
    if (this.vel == [0,0] && !this.falling) {
      return Avatar.spriteList.idle.walk;
    } else if (this.vel[0] == 0 && this.jumping) {
      return Avatar.spriteList.idle.jump;
    }
    if (this.vel[0] < 0) {
      if (this.vel[1] === 0 && !this.jumping) return Avatar.spriteList.left.walk[this.frameIndex];
      if (this.vel[1] === 0 && this.jumping) return Avatar.spriteList.left.jump[1];
      if (this.vel[1] !== 0 && this.falling) return Avatar.spriteList.left.jump[2];
      if (this.vel[1] !== 0 && this.jumping) return Avatar.spriteList.left.jump[0];
    } else if (this.vel[0] > 0) {
      if (this.vel[1] === 0 && !this.jumping) return Avatar.spriteList.right.walk[this.frameIndex];
      if (this.vel[1] === 0 && this.jumping) return Avatar.spriteList.right.jump[1];
      if (this.vel[1] !== 0 && this.falling) return Avatar.spriteList.right.jump[2];
      if (this.vel[1] !== 0 && this.jumping) return Avatar.spriteList.right.jump[0];
    }
    return {
      sourceHeight: 52,
      sourceWidth: 30,
      sourceX: 1,
      sourceY: 4
    };
  }
}

Avatar.MAX_SPEED = 550;
Avatar.spriteList = {
  idle: {
    walk: {sourceHeight: 52, sourceWidth: 30, sourceX: 1, sourceY: 4},
    jump: {sourceHeight: 58, sourceWidth: 30, sourceX: 271, sourceY: 4}
  },
  right: {
    walk: {
      0: {sourceHeight: 52, sourceWidth: 29, sourceX: 34, sourceY: 4},
      1: {sourceHeight: 52, sourceWidth: 30, sourceX: 67, sourceY: 4},
      2: {sourceHeight: 52, sourceWidth: 30, sourceX: 101, sourceY: 4},
      3: {sourceHeight: 52, sourceWidth: 30, sourceX: 135, sourceY: 4}
    },
    jump: {
      0: {sourceHeight: 56, sourceWidth: 29, sourceX: 169, sourceY: 4},
      1: {sourceHeight: 54, sourceWidth: 29, sourceX: 203, sourceY: 4},
      2: {sourceHeight: 55, sourceWidth: 30, sourceX: 237, sourceY: 4}
    }
  },
  left: {
    walk: {
      0: {sourceHeight: 52, sourceWidth: 29, sourceX: 509, sourceY: 4},
      1: {sourceHeight: 52, sourceWidth: 30, sourceX: 475, sourceY: 4},
      2: {sourceHeight: 52, sourceWidth: 30, sourceX: 441, sourceY: 4},
      3: {sourceHeight: 52, sourceWidth: 30, sourceX: 407, sourceY: 4}
    },
    jump: {
      0: {sourceHeight: 56, sourceWidth: 29, sourceX: 374, sourceY: 4},
      1: {sourceHeight: 54, sourceWidth: 29, sourceX: 340, sourceY: 4},
      2: {sourceHeight: 55, sourceWidth: 30, sourceX: 305, sourceY: 4}
    }
  },
};

module.exports = Avatar;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class ModalManager {
  openModal() {
    let modal = document.getElementById('lose-modal');
    modal.classList.remove('is-hidden');
    let background = document.getElementById('canvas-wrapper');
    background.classList.add('lost');
  }

  closeModal() {
    let modal = document.getElementById('lose-modal');
    modal.classList.add('is-hidden');
    let background = document.getElementById('canvas-wrapper');
    background.classList.remove('lost');
  }
}


module.exports = ModalManager;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(3);
const GameView = __webpack_require__(5);
const Avatar = __webpack_require__(0);
const ModalManager = __webpack_require__(1);

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("game-canvas");
  const game = new Game();

  const muteButton = document.getElementById("sound-button");
  muteButton.addEventListener("click", function() {
    muteButton.innerHTML = (muteButton.innerHTML == '<i class="material-icons">volume_up</i>') ?
    '<i class="material-icons">volume_off</i>' : '<i class="material-icons">volume_up</i>'
    game.toggleSound();
  });

  const infoButton = document.getElementById("info-button");
  const instructions = document.getElementById("instructions");
  infoButton.addEventListener("click", function() {
    (instructions.classList.contains("shown")) ?
    instructions.classList.replace("shown", "is-hidden") :
    instructions.classList.replace("is-hidden", "shown")
  });

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const gv = new GameView({ game, ctx })
  gv.start();
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Avatar = __webpack_require__(0);
const Platform = __webpack_require__(4);
const ModalManager = __webpack_require__(1);

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
        width: this.randomWidth() * (i)/Game.DIM_Y*.995,
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

    // event.preventDefault();
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
      this.ticksPerRemoval = 180;
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

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


/***/ }),
/* 5 */
/***/ (function(module, exports) {

class GameView {
  constructor(props) {
    this.ctx = props.ctx;
    this.game = props.game;
    this.avatar = this.game.addAvatar();
    this.fps = 60;
    this.framesThisSecond = 0,
    this.lastFPSCalc = 0;
    this.timeDelta = 0;
    this.timeStep = 1000/60;
  }

  start() {
    this.lastTimestamp = 0;
    requestAnimationFrame(this.animate.bind(this));
    this.game.music.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    this.game.music.play();
  }

  animate(timestamp) {
    // UPDATE FPS

    // CONVERT TIMEDELTA FROM MS TO S

    this.timeDelta += timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    while (this.timeDelta >= this.timeStep) {
      this.game.tick(this.timeStep/1000, this.fps);
      this.timeDelta -= this.timeStep;
    }
    this.game.draw(this.ctx);
    this.game.requestId = requestAnimationFrame(this.animate.bind(this));

    if (timestamp > this.lastFPSCalc + 1000) {
      this.fps = .33 * this.framesThisSecond + (1 - .33) * this.fps;

      this.lastFPSCalc = timestamp;
      this.framesThisSecond = 0;
    }
    this.framesThisSecond++;
  }
}

module.exports = GameView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map