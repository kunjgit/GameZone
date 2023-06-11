function GameModel() {
    this.position = new Vector(0,0);
    this.levels = [];
    this.player;
    this.levelTransitioningIn = false;
    this.levelTransitioningOut = false;
    this.originalLevelTransitionSpeed = 5;
    this.backgroundColour = {r:17, g:17, b:17};
    this.pixelSize = 4;
    this.sizeMultiple = 1;
}