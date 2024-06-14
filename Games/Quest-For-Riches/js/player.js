class Player {
  constructor() {
    this.position = {
      x: 50,
      y: 50,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.originalWidth = 128; // Original frame width
    this.originalHeight = 128; // Original frame height
    this.scale = 2; // Scale factor to make the character larger
    this.width = this.originalWidth * this.scale; // Scaled width
    this.height = this.originalHeight * this.scale; // Scaled height
    this.sides = {
      bottom: this.position.y + this.height,
    };
    this.gravity = 0.3;
    this.direction = "right"; // Initial direction
    this.health = 20; // Player health
    this.attackCooldown = 0; // Cooldown for attacking
    this.isAttacking = false; // Flag to indicate if the player is attacking
    this.coins = 0; // Player coin count
    this.hasKey = false; // Flag to indicate if the player has the key
    this.hasCollectedTreasure = false; // Flag to indicate if the player has collected the treasure

    // Load sprite sheets
    this.sprites = {
      idle: {
        src: "assets/images/sprites/player/Idle.png",
        frames: 8,
        speed: 5,
      },
      run: {
        src: "assets/images/sprites/player/Run.png",
        frames: 8,
        speed: 5,
      },
      jump: {
        src: "assets/images/sprites/player/Jump.png",
        frames: 8,
        speed: 5,
      },
      walk: {
        src: "assets/images/sprites/player/Walk.png",
        frames: 8,
        speed: 5,
      },
      attack: {
        src: "assets/images/sprites/player/Attack_3.png",
        frames: 4,
        speed: 10,
      },
      hurt: {
        src: "assets/images/sprites/player/Hurt.png",
        frames: 4,
        speed: 10,
      },
      dead: {
        src: "assets/images/sprites/player/Dead.png",
        frames: 4,
        speed: 10,
      },
    };

    // Initialize current animation
    this.currentSprite = "idle";
    this.frameIndex = 0;
    this.frameSpeed = this.sprites[this.currentSprite].speed;
    this.frameTick = 0;

    // Load images
    for (let key in this.sprites) {
      const img = new Image();
      img.src = this.sprites[key].src;
      this.sprites[key].img = img;
    }
  }

  setAnimation(animation) {
    if (this.currentSprite !== animation) {
      this.currentSprite = animation;
      this.frameIndex = 0; // Reset frame index
      this.frameSpeed = this.sprites[animation].speed; // Update frame speed
    }
  }

  draw(cameraOffsetX) {
    const sprite = this.sprites[this.currentSprite];
    const sx = this.frameIndex * this.originalWidth;
    const sy = 0;

    // Save the current context state
    c.save();

    if (this.direction === "left") {
      // Flip the context horizontally
      c.scale(-1, 1);
      // Draw the image flipped
      c.drawImage(
        sprite.img,
        sx,
        sy,
        this.originalWidth,
        this.originalHeight,
        -this.position.x - this.width + cameraOffsetX,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      // Draw the image normally
      c.drawImage(
        sprite.img,
        sx,
        sy,
        this.originalWidth,
        this.originalHeight,
        this.position.x - cameraOffsetX,
        this.position.y,
        this.width,
        this.height
      );
    }

    // Restore the context state
    c.restore();
  }

  drawHealthBar() {
    c.fillStyle = "red";
    c.fillRect(10, 10, this.health * 10, 20);
    c.strokeStyle = "black";
    c.strokeRect(10, 10, 200, 20);
  }

  drawCoinCount() {
    // Draw coin icon
    const coinImg = new Image();
    coinImg.src = "assets/images/sprites/gold_coin.png";
    c.drawImage(coinImg, 220, 10, 30, 30);

    // Draw coin count
    c.fillStyle = "white";
    c.font = "24px Arial";
    c.fillText(`x ${this.coins}`, 250, 30);
  }

  drawKeyIndicator() {
    if (this.hasKey) {
      // Draw key icon
      const keyImg = new Image();
      keyImg.src = "assets/images/sprites/gold_key.png";
      c.drawImage(keyImg, 320, 10, 20, 20);
    }
  }

  takeDamage() {
    if (this.currentSprite !== "dead") {
      this.health -= 1;
      if (this.health <= 0) {
        this.setAnimation("dead");
        setTimeout(() => {
          // Restart the game or show game over screen
          window.location.reload();
        }, (this.sprites.dead.frames * this.frameSpeed * 1000) / 60); // Duration of the dead animation
      } else {
        this.setAnimation("hurt");
        setTimeout(() => {
          this.setAnimation("idle");
        }, (this.sprites.hurt.frames * this.frameSpeed * 1000) / 60); // Duration of the hurt animation
      }
    }
  }

  attack() {
    if (this.attackCooldown <= 0) {
      this.setAnimation("attack");
      this.attackCooldown = 60; // Cooldown for 1 second assuming 60 FPS
      this.isAttacking = true; // Set the attacking flag to true
    }
  }

  update(cameraOffsetX) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.sides.bottom = this.position.y + this.height;

    // Gravity
    if (this.sides.bottom + this.velocity.y < canvas.height) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
      if (this.currentSprite === "jump") {
        // Reset to run if moving horizontally, otherwise idle
        if (keys.a.pressed || keys.d.pressed) {
          this.setAnimation("run");
        } else {
          this.setAnimation("idle");
        }
      }
    }

    // Ensure the player stays within the game world bounds
    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width > GAME_WORLD_WIDTH) {
      this.position.x = GAME_WORLD_WIDTH - this.width;
    }

    // Update the frame index for animation
    this.frameTick++;
    if (this.frameTick >= this.frameSpeed) {
      this.frameTick = 0;
      const sprite = this.sprites[this.currentSprite];
      this.frameIndex = (this.frameIndex + 1) % sprite.frames;

      // If the current animation is attack and it reaches the last frame, revert to idle or run
      if (this.currentSprite === "attack" && this.frameIndex === 0) {
        this.isAttacking = false; // Reset attacking flag
        if (keys.a.pressed || keys.d.pressed) {
          this.setAnimation("run");
        } else {
          this.setAnimation("idle");
        }
      }
    }

    // Handle attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }

    this.draw(cameraOffsetX);
    this.drawHealthBar();
    this.drawCoinCount(); // Draw the coin count on the screen
    this.drawKeyIndicator(); // Draw the key indicator on the screen
  }
}
