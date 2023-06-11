function PlayerModel() {
    this.position = new Vector(0, 0);
    this.targetPosition = new Vector(0, 0);
    this.moveDirection = 0;
    this.originalMoveSpeed = 7;
    this.lastMoveDirection = 1;
    
    this.imageObject = new Image();
    this.currentFrame = {
        x:0,
        y:0,
        w:0,
        h:0
    };
}