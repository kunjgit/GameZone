class Enemy {
  constructor(x, y, spriteData, patrolDistance = 100, type = "wizard") {
    if (!spriteData) {
      throw new Error("spriteData is required");
    }
    this.position = { x, y };
    this.initialPosition = { x, y };
    this.patrolDistance = patrolDistance;
    this.velocity = { x: 1, y: 0 };
    this.width = spriteData.width; // Use sprite width from data
    this.height = spriteData.height; // Use sprite height from data
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
    this.state = "idle"; // Initial state
    this.type = type; // Type of enemy (wizard or monster)

    // Load sprite sheets from the provided data
    this.sprites = spriteData.sprites;

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
          console.log(`${key} image loaded successfully`);
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
      console.log(`Changing animation to: ${animation}`);
      this.currentSprite = animation;
      this.frameIndex = 0; // Reset frame index
      this.frameSpeed = this.sprites[animation].speed; // Update frame speed
    }
  }

  updateState(player) {
    if (this.isDead) {
      this.setAnimation("dead");
      return;
    }

    const distanceToPlayer = Math.abs(this.position.x - player.position.x);
    const yDistanceToPlayer = Math.abs(this.position.y - player.position.y);

    console.log(
      `Distance to player: ${distanceToPlayer}, Y Distance: ${yDistanceToPlayer}`
    );

    if (distanceToPlayer < 50 && yDistanceToPlayer < 80) {
      console.log("Switching to attack state");
      this.state = "attack";
    } else if (distanceToPlayer < 300) {
      console.log("Switching to run state");
      this.state = "run";
    } else {
      console.log("Switching to walk state");
      this.state = "walk";
    }

    console.log(`Current state: ${this.state}`);

    if (this.state === "attack") {
      this.isAttacking = true;
      this.velocity.x = 0;
      this.setAnimation("attack1");
      console.log(
        `Attack frame index: ${this.frameIndex}, attackCooldown: ${this.attackCooldown}`
      );
      if (
        this.frameIndex === this.sprites.attack1.frames - 1 &&
        this.attackCooldown <= 0
      ) {
        console.log("Attacking player");
        player.takeDamage();
        this.attackCooldown = 60;
      }
    } else {
      this.isAttacking = false;
      if (this.state === "run") {
        if (this.position.x < player.position.x) {
          this.direction = "right";
          this.velocity.x = 1.5;
        } else {
          this.direction = "left";
          this.velocity.x = -1.5;
        }
        this.setAnimation("run");
      } else if (this.state === "walk") {
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
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  draw(cameraOffsetX) {
    if (!this.loaded) return; // Only draw if images are loaded

    const sprite = this.sprites[this.currentSprite];
    const frameWidth = this.width; // Use the frame width defined in spriteData
    const frameHeight = this.height;
    const sx = this.frameIndex * frameWidth;
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
        frameWidth,
        frameHeight,
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
        frameWidth,
        frameHeight,
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
    this.updateState(player);

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
      console.log(
        `Current frame index for ${this.currentSprite}: ${this.frameIndex}`
      );
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
