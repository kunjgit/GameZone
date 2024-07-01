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
        if (this.vel[0] > 0) { this.vel[0] -= 6 }
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] -= 9; }
        if (Math.abs(this.vel[0]) > Avatar.MAX_SPEED ) { this.vel[0] =  -Avatar.MAX_SPEED; }
        break;
      case "R":
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] += 9; }
        if (this.vel[0] < 0) { this.vel[0] += 6 }
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
      else if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .6) {
        this.vel[1] -= 375;
      }
      else if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .8) {
        this.vel[1] -= 400;
      }
      else {
        this.vel[1] -= 450;
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
