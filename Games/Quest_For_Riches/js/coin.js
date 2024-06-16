class Coin {
  constructor(x, y, player) {
    this.position = { x, y };
    this.width = 32; // Width of the coin sprite
    this.height = 32; // Height of the coin sprite
    this.scale = 2; // Scale factor
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.collected = false;
    this.player = player; // Reference to the player to increase the coin count

    // Load the coin sprite
    this.image = new Image();
    this.image.src = "assets/images/sprites/gold_coin.png";
  }

  // Draw the coin on the canvas if it has not been collected
  draw(cameraOffsetX) {
    if (this.collected) return;

    c.drawImage(
      this.image,
      this.position.x - cameraOffsetX,
      this.position.y,
      this.scaledWidth,
      this.scaledHeight
    );
  }

  // Update the coin state and check for collision with the player
  update(cameraOffsetX, player) {
    if (
      !this.collected &&
      player.position.x < this.position.x + this.scaledWidth &&
      player.position.x + player.width > this.position.x &&
      player.position.y < this.position.y + this.scaledHeight &&
      player.height + player.position.y > this.position.y
    ) {
      this.collected = true; // Mark the coin as collected
      audioManager.playSound("coin"); // Play coin collection sound
      player.coins += 1; // Increase player's coin count
    }

    this.draw(cameraOffsetX); // Draw the coin
  }
}
