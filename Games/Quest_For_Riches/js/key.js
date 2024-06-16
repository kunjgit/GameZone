class Key {
  constructor(x, y) {
    this.position = { x, y };
    this.image = new Image();
    this.image.src = "assets/images/sprites/gold_key.png";
    this.width = 16; // Width of the key image
    this.height = 16; // Height of the key image
    this.scale = 4; // Scale factor to fit the game
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.collected = false;
  }

  // Draw the key on the canvas
  draw(cameraOffsetX) {
    if (!this.collected) {
      c.drawImage(
        this.image,
        this.position.x - cameraOffsetX,
        this.position.y,
        this.scaledWidth,
        this.scaledHeight
      );
    }
  }

  // Update the key state and check for collision with the player
  update(cameraOffsetX, player) {
    if (
      !this.collected &&
      player.position.x < this.position.x + this.scaledWidth &&
      player.position.x + player.width > this.position.x &&
      player.position.y < this.position.y + this.scaledHeight &&
      player.height + player.position.y > this.position.y
    ) {
      this.collected = true;
      player.hasKey = true;
    }

    this.draw(cameraOffsetX);
  }
}
