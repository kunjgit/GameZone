class Layer {
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;

    else this.x -= this.game.speed * this.speedModifier;
   
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
    //console.log(this.x,this.y);
  }
}
var audio = new Audio('Bones.mp3');
export class Background {
  constructor(game) {
    this.game = game;
    this.width = game.width;
    this.height = game.height;
    this.layer6image = document.getElementById("layer6");
    this.layer5image = document.getElementById("layer5");
    this.layer4image = document.getElementById("layer4");
    this.layer3image = document.getElementById("layer3");
    this.layer2image = document.getElementById("layer2");
    this.layer1image = document.getElementById("layer1");
    this.layer6 = new Layer(
      this.game,
      this.width,
      this.height,
      1.4,
      this.layer6image //
    );

    
    this.layer1 = new Layer(
      this.game,
      this.width,
      this.height,
      2,
      this.layer1image //
    );
    this.layer2 = new Layer(
      this.game,
      this.width,
      this.height+100,
      0.2,
      this.layer2image //
    );
    this.layer3 = new Layer(
      this.game,
      this.width,
      this.height,
      0.4,
      this.layer3image //
    );
    this.layer4 = new Layer(
      this.game,
      this.width,
      this.height,
      0.8,
      this.layer4image //
    );
    this.layer5 = new Layer(
      this.game,
      this.width,
      this.height,
      1,
      this.layer5image //
    );
    console.log(this.layer1);
    this.backgroundLayers = [
   
       this.layer1,
      this.layer2,
      
      this.layer4,
      this.layer5,
      // this.layer3,
       this.layer6
      
    
      
      // this.layer5

    ];
  }
  update() {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }
  draw(context) {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(context);
      
      audio.play();
    });
  }
}
