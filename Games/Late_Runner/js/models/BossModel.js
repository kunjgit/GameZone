function BossModel() {
    this.position = new Vector(500, 0);    
    this.imageObject = new Image();
    this.currentFrame = {
        x:0,
        y:0,
        w:0,
        h:0
    };
    this.animIndex = 0;
}