class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.gearImg = document.getElementById("gears");
    this.gearWidth=this.gearImg.width/4
    this.gearHeight=this.gearImg.height
    this.spriteHeight = 120;
    this.spriteWidth = 120;
    this.scaledWidth = this.spriteHeight * this.game.ratio;
    this.scaledHeight = this.spriteWidth * this.game.ratio;
    this.x = x;
    this.y = Math.random() * (this.game.height - this.scaledHeight);
    this.collisionX;
    this.collisionY;
    this.collisionRadius = this.scaledWidth *0.4;
    this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.game.ratio;
    this.markedForDeletion = false;
    this.gearType=Math.floor(Math.random()*4)
  }
  update() {
    this.x -= this.game.speed;
    this.y += this.speedY;
    //the collision circle moves along with the obstacle
    this.collisionX = this.x + this.scaledWidth*0.5;
    this.collisionY = this.y + this.scaledHeight*0.5;
    //for bounce at edges
    if(!this.game.gameOver){
      if (this.y < 0 || this.y > this.game.height - this.scaledHeight) {
        this.speedY *= -1;
      }
    }
    else{
      this.speedY += 0.1;
      
    }
    
    if (this.isOffScreen() && !this.game.gameOver) {
      this.markedForDeletion = true;
      this.game.obstacles = this.game.obstacles.filter(
        (obstacles) => !obstacles.markedForDeletion
      );
      this.game.score += 1;
      // console.log(this.game.obstacles.length);
      if (this.game.obstacles.length == 0) {
        this.game.triggerGameOver()
    }
    }
    if(this.game.checkCollision(this,this.game.player)){
        this.game.player.collided=true 
        this.game.triggerGameOver()
    }
    
  }
  draw() {
    // this.game.ctx.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);
    // this.game.ctx.beginPath();
    // this.game.ctx.arc(this.collisionX,this.collisionY,this.collisionRadius,0, 2 * Math.PI);
    // this.game.ctx.stroke()
    this.game.ctx.drawImage(this.gearImg,this.gearWidth *this.gearType,0,this.gearWidth,this.gearHeight,this.x, this.y, this.scaledWidth, this.scaledHeight)
  }

  resize() {
    this.scaledWidth = this.spriteHeight * this.game.ratio;
    this.scaledHeight = this.spriteWidth * this.game.ratio;
  }
  isOffScreen() {
    return this.x < -this.scaledWidth 
  }
}
