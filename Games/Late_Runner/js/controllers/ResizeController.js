function ResizeController(gameModel) {
    this.gameModel = gameModel;
    window.onresize = this.resizeGame.bind(this);
}
ResizeController.prototype = {
    resizeGame: function() {
        var canvas = document.getElementById("gameCanvas"),
            container = document.getElementById("canvasContainer"),
            subtitle = document.getElementById("subtitles");
        canvas.width = container.clientWidth;
        canvas.height = canvas.width / 3.85;
        container.style.marginTop = -canvas.height / 2;
        container.style.marginLeft = -canvas.width / 2;
        subtitle.style.width = canvas.width;
    
        this.gameModel.prevWidth = this.gameModel.width || 0;
        this.gameModel.prevHeight = this.gameModel.height || 0;
        this.gameModel.height = this.gameModel.currentLevel.height = canvas.height;
        this.gameModel.width = this.gameModel.currentLevel.width = canvas.width;
        LateRunner.pixelSize = canvas.height * 0.02;
        LateRunner.sizeMultiple = mapValue(LateRunner.pixelSize, 0, 4, 0, 1);
        LateRunner.touchRadius = 42 * LateRunner.sizeMultiple;
        this.resizeLevel(this.gameModel.width, this.gameModel.height);
        this.resizePlayer(this.gameModel.width, this.gameModel.height);
        this.resizeBoss(this.gameModel.width, this.gameModel.height);
    },
    
    resizeLevel: function(newGameWidth, newGameHeight) {
        var level = this.gameModel.currentLevel;
        level.width = newGameWidth;
        level.height = newGameHeight;
        
        this.resizeStairs(newGameWidth, newGameHeight);
        this.resizeDoors(newGameWidth, newGameHeight);
        this.resizeSwitches(newGameWidth, newGameHeight);
        
        this.gameModel.levelTransitionSpeed = this.gameModel.originalLevelTransitionSpeed * LateRunner.sizeMultiple;
    },
    
    resizeDoors: function(newGameWidth, newGameHeight) {
        var level = this.gameModel.currentLevel,
            i, 
            currentDoor;
        
        for (i = 0; i < level.doors.length; i++) {
            currentDoor = level.doors[i];
            currentDoor.height = newGameHeight;
            currentDoor.width = currentDoor.openSegmentHeight = LateRunner.pixelSize * 4;
            if(currentDoor.originalPosition) {
                currentDoor.position = new Vector(mapValue(currentDoor.originalPosition.x, 0, 770, newGameWidth/10, newGameWidth - newGameWidth/10), 0);
            } else {
                currentDoor.position = new Vector(mapValue(i+1, 0, level.doors.length+1, newGameWidth/10, newGameWidth - newGameWidth/10), 0);
            }
        };
    },
    
    resizeSwitches: function(newGameWidth, newGameHeight) {
        var level = this.gameModel.currentLevel,
            i, 
            j,
            switchesAtDoor,
            currentSwitch, 
            switchesAt = new Array(level.doors.length),
            newSwitchY;
        
        for(i = 0; i < level.doors.length; i++) {
            switchesAtDoor = [];
            for(j = 0; j < level.switches.length; j++) {
                if(level.switches[j].doorPosition == i) {
                    switchesAtDoor.push(level.switches[j]);
                }
            }
            switchesAt[i] = switchesAtDoor;
        };
        
        for (i = 0; i < level.doors.length; i++) {
            for(j = 0; j < switchesAt[i].length; j++) {
                currentSwitch = switchesAt[i][j];
                newSwitchY = mapValue(j+1, 0, switchesAt[i].length+1, newGameHeight/10, newGameHeight - (newGameHeight/10));
                currentSwitch.radius = LateRunner.pixelSize * 2;
                currentSwitch.position = new Vector(level.doors[i].position.x - LateRunner.touchRadius, newSwitchY);
            }
        };
    },
    
    resizeStairs: function(newGameWidth, newGameHeight) {
        var level = this.gameModel.currentLevel,
            stairs = level.stairs;
        if(!!level.stairs) {
            stairs.stepHeight = newGameHeight / stairs.numberOfSteps;
            stairs.width = LateRunner.pixelSize * 24;
            stairs.height = newGameHeight;
            stairs.position.x = newGameWidth - stairs.width;
        }
    },
    
    resizePlayer: function(newGameWidth, newGameHeight) {
        var player = this.gameModel.player;
        player.position = new Vector(mapValue(player.position.x, 0, this.gameModel.prevWidth, 0, newGameWidth), newGameHeight);
        player.moveSpeed = player.originalMoveSpeed * LateRunner.sizeMultiple;
    },
    
    resizeBoss: function(newGameWidth, newGameHeight) {
        var boss = this.gameModel.boss;
        boss.position = new Vector(mapValue(600, 0, 770, 0, newGameWidth), newGameHeight);
    }
};