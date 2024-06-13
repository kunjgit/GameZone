class Enemy {
  constructor(x, y, patrolDistance = 100) {
    this.position = { x, y };
    this.initialPosition = { x, y };
    this.patrolDistance = patrolDistance;
    this.velocity = { x: 1, y: 0 };
    this.width = 128; // Original frame width
    this.height = 128; // Original frame height
    this.scale = 2; // Scale factor to make the enemy larger
    this.scaledWidth = this.width * this.scale; // Scaled width
    this.scaledHeight = this.height * this.scale; // Scaled height
    this.health = 3; // Health
    this.gravity = 0.3;
    this.direction = "left"; // Initial direction
    this.isAttacking = false;
    this.attackCooldown = 0; // Cooldown for attacking
    this.patrolDirection = Math.random() > 0.5 ? 1 : -1; // Random initial direction
    this.isDead = false; // Flag to indicate if enemy is dead

    // Load sprite sheets
    this.sprites = {
      idle: {
        src: "assets/images/sprites/enemies/wizard/Idle.png",
        frames: 6,
        speed: 5,
      },
      run: {
        src: "assets/images/sprites/enemies/wizard/Run.png",
        frames: 8,
        speed: 5,
      },
      attack1: {
        src: "assets/images/sprites/enemies/wizard/Attack_1.png",
        frames: 10,
        speed: 10,
      },
      dead: {
        src: "assets/images/sprites/enemies/wizard/Dead.png",
        frames: 4,
        speed: 10,
      },
      hurt: {
        src: "assets/images/sprites/enemies/wizard/Hurt.png",
        frames: 4,
        speed: 10,
      },
      walk: {
        src: "assets/images/sprites/enemies/wizard/Walk.png",
        frames: 7,
        speed: 5,
      },
    };

    this.loaded = false; // Flag to check if images are loaded

    // Load images
    let loadedImagesCount = 0;
    const totalImages = Object.keys(this.sprites).length;
    for (let key in this.sprites) {
      const img = new Image();
      img.src = this.sprites[key].src;
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === totalImages) {
          this.loaded = true;
        }
      };
      this.sprites[key].img = img;
    }

    // Initialize current animation
    this.currentSprite = "idle";
    this.frameIndex = 0;
    this.frameSpeed = this.sprites[this.currentSprite].speed;
    this.frameTick = 0;
  }

  setAnimation(animation) {
    if (this.currentSprite !== animation) {
      this.currentSprite = animation;
      this.frameIndex = 0; // Reset frame index
      this.frameSpeed = this.sprites[animation].speed; // Update frame speed
    }
  }

  draw(cameraOffsetX) {
    if (!this.loaded) return; // Only draw if images are loaded

    const sprite = this.sprites[this.currentSprite];
    const sx = this.frameIndex * this.width;
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
        this.width,
        this.height,
        -(this.position.x - cameraOffsetX + this.scaledWidth),
        this.position.y,
        this.scaledWidth,
        this.scaledHeight
      );
    } else {
      // Draw the image normally
      c.drawImage(
        sprite.img,
        sx,
        sy,
        this.width,
        this.height,
        this.position.x - cameraOffsetX,
        this.position.y,
        this.scaledWidth,
        this.scaledHeight
      );
    }

    // Restore the context state
    c.restore();

    // Draw the health bar
    this.drawHealthBar(cameraOffsetX);
  }

  drawHealthBar(cameraOffsetX) {
    const healthBarWidth = this.scaledWidth * 0.6; // 60% of the scaled width
    const healthBarHeight = 10;
    const healthBarX =
      this.position.x - cameraOffsetX + (this.scaledWidth - healthBarWidth) / 2; // Centered above the enemy
    const healthBarY = this.position.y - 20; // Position above the enemy

    c.fillStyle = "red";
    c.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    c.fillStyle = "green";
    c.fillRect(
      healthBarX,
      healthBarY,
      (healthBarWidth * this.health) / 3,
      healthBarHeight
    );

    c.strokeStyle = "black";
    c.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
  }

  update(cameraOffsetX, player) {
    if (this.isDead) {
      this.setAnimation("dead");
      if (this.frameIndex === this.sprites.dead.frames - 1) {
        setTimeout(() => {
          const index = enemies.indexOf(this);
          if (index > -1) {
            enemies.splice(index, 1);
          }
        }, (this.sprites.dead.frames * this.frameSpeed * 1000) / 60);
      }
      return;
    }

    // Patrol logic
    if (!this.isAttacking && this.attackCooldown <= 0) {
      if (this.position.x <= this.initialPosition.x - this.patrolDistance) {
        this.patrolDirection = 1;
        this.direction = "right";
      } else if (
        this.position.x >=
        this.initialPosition.x + this.patrolDistance
      ) {
        this.patrolDirection = -1;
        this.direction = "left";
      }
      this.velocity.x = this.patrolDirection;
      this.setAnimation("walk");
    }

    // Attack logic
    if (
      Math.abs(this.position.x - player.position.x) < 150 &&
      Math.abs(this.position.y - player.position.y) < 50
    ) {
      this.isAttacking = true;
      this.velocity.x = 0;
      this.setAnimation("attack1"); // Example attack animation
      // Implement attack mechanics here
      if (this.frameIndex === 5 && this.attackCooldown <= 0) {
        // Last frame of attack
        player.takeDamage(); // Decrease player's health
        this.attackCooldown = 60; // Cooldown for 1 second assuming 60 FPS
      }
    } else {
      this.isAttacking = false;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }

    if (
      !this.isAttacking &&
      Math.abs(this.position.x - player.position.x) < 300 &&
      this.attackCooldown <= 0
    ) {
      if (this.position.x < player.position.x) {
        this.direction = "right";
        this.velocity.x = 1;
      } else {
        this.direction = "left";
        this.velocity.x = -1;
      }
      this.setAnimation("run");
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if (this.position.y + this.scaledHeight + this.velocity.y < canvas.height) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }

    // Ensure the enemy stays within the game world bounds
    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + this.scaledWidth > GAME_WORLD_WIDTH) {
      this.position.x = GAME_WORLD_WIDTH - this.scaledWidth;
    }

    // Update the frame index for animation
    this.frameTick++;
    if (this.frameTick >= this.frameSpeed) {
      this.frameTick = 0;
      const sprite = this.sprites[this.currentSprite];
      this.frameIndex = (this.frameIndex + 1) % sprite.frames;
    }

    this.draw(cameraOffsetX);
  }

  takeDamage() {
    if (this.isDead) return;
    this.health -= 1;
    if (this.health <= 0) {
      this.isDead = true;
      this.setAnimation("dead");
    } else {
      this.setAnimation("hurt");
      setTimeout(() => {
        this.setAnimation("idle");
      }, (this.sprites.hurt.frames * this.frameSpeed * 1000) / 60); // Duration of the hurt animation
    }
  }
}
