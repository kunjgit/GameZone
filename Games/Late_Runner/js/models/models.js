function Vector(x, y) {
    this.x = x; 
    this.y = y;
};

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
};

function DoorModel(data) {
    this.id = -1;
    this.originalState = this.state = data.state;
    this.originalPosition = data.originalPosition;
};

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
};

function LevelModel(index, data) {
    this.id = index;
    this.switches = data.switches;
    this.doors = data.doors;
    if(data.boss) {
        this.boss = data.boss;
    } else {
        this.stairs = new StairsModel();
    }
    this.position = new Vector(0, 0);
    this.backgroundColour = {r:17, g:17, b:17};
};

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
};

function StairsModel() {
    this.position = new Vector(0, 0);
    this.numberOfSteps = 6;
};

function SwitchModel(index, data) {
    this.id = index;
    this.connectedDoors = data.connectedDoors;
    this.doorPosition = data.doorPosition;
    this.originalPosition = data.originalPosition;
    this.radius = 2;
};

function TimerModel() {
    this.minutes = 5;
    this.seconds = 0;
    this.timing = true;
};