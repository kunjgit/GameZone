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
        this.direction = 'right'; // Initial direction

        // Load sprite sheets
        this.sprites = {
            idle: { src: 'assets/images/Idle.png', frames: 8 },
            run: { src: 'assets/images/Run.png', frames: 8 },
            jump: { src: 'assets/images/Jump.png', frames: 8 },
            walk: { src: 'assets/images/Walk.png', frames: 8 },
            attack: { src: 'assets/images/Attack_1.png', frames: 6 },
            // Add other animations here if needed
        };

        // Initialize current animation
        this.currentSprite = 'idle';
        this.frameIndex = 0;
        this.frameSpeed = 5;
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
        }
    }

    draw(cameraOffsetX) {
        const sprite = this.sprites[this.currentSprite];
        const sx = this.frameIndex * this.originalWidth;
        const sy = 0;

        // Save the current context state
        c.save();

        if (this.direction === 'left') {
            // Flip the context horizontally
            c.scale(-1, 1);
            // Draw the image flipped
            c.drawImage(
                sprite.img,
                sx, sy,
                this.originalWidth, this.originalHeight,
                -(this.position.x - cameraOffsetX + this.width), this.position.y,
                this.width, this.height
            );
        } else {
            // Draw the image normally
            c.drawImage(
                sprite.img,
                sx, sy,
                this.originalWidth, this.originalHeight,
                this.position.x - cameraOffsetX, this.position.y,
                this.width, this.height
            );
        }

        // Restore the context state
        c.restore();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.sides.bottom = this.position.y + this.height;

        // Gravity
        if (this.sides.bottom + this.velocity.y < canvas.height) {
            this.velocity.y += this.gravity;
        } else {
            this.velocity.y = 0;
            if (this.currentSprite === 'jump') {
                // Reset to run if moving horizontally, otherwise idle
                if (keys.a.pressed || keys.d.pressed) {
                    this.setAnimation('run');
                } else {
                    this.setAnimation('idle');
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
        }
    }
}
