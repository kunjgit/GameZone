class Enemy {
  constructor(x, y, spriteData, patrolDistance = 100, type = "wizard") {
    if (!spriteData) {
      throw new Error("spriteData is required");
    }
    this.position = { x, y };
    this.initialPosition = { x, y };
    this.patrolDistance = patrolDistance;
    this.velocity = { x: 1, y: 0 };
    this.width = spriteData.width;
    this.height = spriteData.height;
    this.scale = 2;
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.health = 3;
    this.gravity = 0.3;
    this.direction = "left";
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.patrolDirection = Math.random() > 0.5 ? 1 : -1;
    this.isDead = false;
    this.state = "idle";
    this.type = type;

    this.sprites = spriteData.sprites;
    this.loaded = false;

    // Load all sprite images
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

    this.currentSprite = "idle";
    this.frameIndex = 0;
    this.frameSpeed = this.sprites[this.currentSprite].speed;
    this.frameTick = 0;
  }

  // Set the current animation
  setAnimation(animation) {
    if (this.currentSprite !== animation) {
      this.currentSprite = animation;
      this.frameIndex = 0;
      this.frameSpeed = this.sprites[animation].speed;
    }
  }

  // Update the state of the enemy based on player position
  updateState(player) {
    if (this.isDead) {
      this.setAnimation("dead");
      return;
    }

    const distanceToPlayer = Math.abs(this.position.x - player.position.x);
    const yDistanceToPlayer = Math.abs(this.position.y - player.position.y);

    if (distanceToPlayer < 50 && yDistanceToPlayer < 80) {
      this.state = "attack";
    } else if (distanceToPlayer < 300) {
      this.state = "run";
    } else {
      this.state = "walk";
    }

    if (this.state === "attack") {
      this.isAttacking = true;
      this.velocity.x = 0;
      this.setAnimation("attack1");
      if (
        this.frameIndex === this.sprites.attack1.frames - 1 &&
        this.attackCooldown <= 0
      ) {
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

  // Draw the enemy on the canvas
  draw(cameraOffsetX) {
    if (!this.loaded) return;

    const sprite = this.sprites[this.currentSprite];
    const frameWidth = this.width;
    const frameHeight = this.height;
    const sx = this.frameIndex * frameWidth;
    const sy = 0;

    c.save();

    if (this.direction === "left") {
      c.scale(-1, 1);
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

    c.restore();

    this.drawHealthBar(cameraOffsetX);
  }

  // Draw the health bar above the enemy
  drawHealthBar(cameraOffsetX) {
    const healthBarWidth = this.scaledWidth * 0.6;
    const healthBarHeight = 10;
    const healthBarX =
      this.position.x - cameraOffsetX + (this.scaledWidth - healthBarWidth) / 2;
    const healthBarY = this.position.y - 20;

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

  // Update the enemy's position and state
  update(cameraOffsetX, player) {
    this.updateState(player);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Apply gravity
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

  // Handle taking damage
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
      }, (this.sprites.hurt.frames * this.frameSpeed * 1000) / 60);
    }
  }
}
