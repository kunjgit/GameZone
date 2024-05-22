class Player {
  constructor(game) {
    this.game = game;
    this.x = 20;
    this.y;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.height;
    this.width;
    this.speedY;
    this.flapSpeed;
    this.collisionX = this.x ;
    this.collisionY;
    this.collisionRadius;
    this.collided;
    this.energy = 30;
    this.maxEnergy = this.energy * 2;
    this.minEnergy = 15;
    this.charging;
    this.image=document.getElementById("fish")
    this.imgHeight=this.image.height
    this.imgWidth=this.image.width
    this.frameY
  }
  draw() {
    // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.game.ctx.beginPath();
    if(this.game.debug){
      this.game.ctx.arc(
        this.collisionX ,
        this.collisionY,
        this.collisionRadius,
        0,
        2 * Math.PI
        );
        this.game.ctx.stroke();
    }
      this.game.ctx.drawImage(this.image,0,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x, this.y,this.width, this.height)
    }
  update() {
    this.handleEnergy();
    if(this.speedY>0){
      this.wingsUp()
    }
    this.y += this.speedY;

    this.collisionY = this.y  + this.height * 0.5;
    if (!this.isTouchingBottom() && !this.charging) {
      this.speedY += this.game.gravity;
    }else{
      this.speedY=0;

    }
    if (this.isTouchingBottom()) {
      console.log(this.speedY);
      this.y = this.game.height - this.height -this.game.bottomMargin;
      this.wingsIdle()
    }
    if (this.isTouchingTop()){
      this.y=0
    }
  }
  resize() {
    //resizing based on height of the canvas
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    // this.collisionX = this.collisionX + this.width * 0.5 ;
    // this.collisionY=this.collisionY + this.height * 0.5;
    this.collisionX=this.x+ this.width * 0.68;
    this.speedY = -5 * this.game.ratio;
    this.flapSpeed = 5 * this.game.ratio;
    this.collisionRadius = this.width * 0.3;
    this.collided = false;
    this.charging=false
    this.frameY=0
  }
  startCharge() {
    if(this.energy>= this.minEnergy){
      this.game.sound.play(this.game.sound.charge)
      this.charging = true;
      this.game.speed = this.game.maxSpeed;
      this.wingsCharge()
    }else{
      this.stopCharge()
    }
  }
  stopCharge() {
    this.charging = false;
    this.game.speed = this.game.minSpeed;
    // this.wingsIdle()
  }
  wingsDown(){
    if(!this.charging)

this.frameY=1
  }
  wingsIdle(){
this.frameY=0
  }
  wingsUp(){
    if(!this.charging)
    this.frameY=2

  }
  wingsCharge(){
    this.frameY=3

  }
  isTouchingTop() {
    return this.y < 0;
  }
  isTouchingBottom() {
    return this.y > this.game.height - this.height-this.game.bottomMargin;
  }
  handleEnergy() {
    if (this.game.eventUpdate) {
      if (this.energy < this.maxEnergy) {
        this.energy += 1;
      }
      if (this.charging) {
        this.energy -= 10;
        if (this.energy <= 0) {
          this.energy = 0;
          this.stopCharge();
        }
      }
    }
  }
  flap() {
    this.stopCharge()
    if (!this.isTouchingTop()) {
      this.game.sound.play(this.game.sound.flapSounds[Math.floor(Math.random()*5)])
      this.speedY = -this.flapSpeed;
      this.wingsDown()
    }
  }
}
