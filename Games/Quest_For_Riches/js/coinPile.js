class CoinPile {
  constructor(x, y) {
    this.position = { x, y };
    this.image = new Image();
    this.image.src = "assets/images/sprites/gold_coins_pile.png";
    this.width = 32; // Width of the coin pile image
    this.height = 32; // Height of the coin pile image
    this.scale = 3; // Increase the scale factor to fit the game
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;
    this.velocityY = -1; // Velocity for moving upwards
    this.alpha = 1; // Transparency for fade out
    this.fadeSpeed = 0.01; // Speed of fading out
  }

  // Draw the coin pile on the canvas with transparency
  draw(cameraOffsetX) {
    c.save();
    c.globalAlpha = this.alpha; // Set the transparency
    c.drawImage(
      this.image,
      this.position.x - cameraOffsetX,
      this.position.y,
      this.scaledWidth,
      this.scaledHeight
    );
    c.restore();
  }

  // Update the position and transparency of the coin pile
  update(cameraOffsetX) {
    this.position.y += this.velocityY; // Move the coin pile upwards
    this.alpha -= this.fadeSpeed; // Reduce the transparency
    if (this.alpha <= 0) {
      this.alpha = 0; // Ensure alpha does not go below 0
    }
    this.draw(cameraOffsetX); // Draw the coin pile
  }
}
