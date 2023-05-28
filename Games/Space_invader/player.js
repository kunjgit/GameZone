export default class Player {
    Rpressed = false;
    Lpressed = false;
    shootPress = false;
    currentPlayer = 1;
  
    constructor(canvas, velocity,bulletControl,changePlayer) {
      this.canvas = canvas;
      this.velocity = velocity;
      this.changePlayer = changePlayer;
      this.bulletControl = bulletControl;
      this.x = this.canvas.width / 2;
      this.y = this.canvas.height - 75;
      this.width = 48;
      this.height = 51;

     
    
        this.image = new Image();
      this.image.src = "images/player1.webp";

      
      document.addEventListener("keydown",this.keydown);
      document.addEventListener("keyup",this.keyup);
    }
  
    draw(ctx) {
        if(this.shootPress) {
            this.bulletControl.shoot(this.x+this.width/2, this.y,4,10);
        }
        
        this.move();
        this.collideWithWalls();
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    
    collideWithWalls(){
        //left wall
        if(this.x < 0){
            this.x=0;
    }
    //right wall
    if (this.x > this.canvas.width-this.width)
    {
        this.x = this.canvas.width-this.width;
    }
}



    move() {
        if (this.Rpressed){
            this.x += this.velocity;
        }
        else if (this.Lpressed)
        {
            this.x += -this.velocity;
        }
    }
  
    keydown = event => {
        if (event.code === "ArrowRight"){
            this.Rpressed = true;
        }
        if (event.code === "ArrowLeft"){
            this.Lpressed = true;
    }
    if(event.code === "Space")
    {
        this.shootPress = true;
    }
  }
  keyup = event => {
    if (event.code === "ArrowRight"){
        this.Rpressed = false;
    }
    if (event.code === "ArrowLeft"){
        this.Lpressed = false;
}
    if(event.code === "Space")
    {
        this.shootPress = false;
    }
}
}
  