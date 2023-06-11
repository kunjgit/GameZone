function BossController(model) {
    this.model = model.boss;
    LateRunner.events.on('update', this.update, this);
    LateRunner.events.on('seenByBoss', this.startTalking, this);
    this.setupAnimationFrames();
}

BossController.prototype = {
    update: function() {
        if(!!this.model.talking) {
            this.model.animIndex = (this.model.animIndex + 1) % 2;
            if(Math.random() > 0.85 && this.model.animIndex == 0) {
                this.model.currentFrameIndex = (this.model.currentFrameIndex + 1) % 2;
                this.model.currentFrame = this.model.talkFrames[this.model.currentFrameIndex];
            }
        }
    }, 
    setupAnimationFrames: function() {
        this.model.imageObject.src = LateRunner.AnimData.boss.filename;
        this.model.standFrames = LateRunner.AnimData.boss.stand.frames;
        this.model.talkFrames = LateRunner.AnimData.boss.talk.frames;
        this.model.currentFrameIndex = 0;
        this.model.currentFrame = this.model.standFrames[0];
    },
    startTalking: function() {
        this.model.currentFrame = this.model.talkFrames[0];
        this.model.talking = true;
    }
};

function DoorAndSwitchController(gameModel) {
    this.model = gameModel;
    LateRunner.events.on('switchActivated', this.onSwitchActivated, this);
}

DoorAndSwitchController.prototype = {
    onSwitchActivated: function(activatedSwitch) {
        var i;
        for(i = 0; i < activatedSwitch.connectedDoors.length; i++) {
            this.toggleDoorState(activatedSwitch.connectedDoors[i]);
        }
        if(this.model.currentLevel.boss) LateRunner.events.emit('seenByBoss');
    },

    toggleDoorState: function(door) {
        if(door.state == "closed") door.state = "open";
        else door.state = "closed";
    },
    
    doorIsClosedBetween: function(position1, position2) {
        var i, currentDoor, doorsBetween = [], doors = this.model.currentLevel.doors;
        for(i = 0; i < doors.length; i ++) {
            if(position1.x < position2.x) {
                if(doors[i].position.x >= position1.x && doors[i].position.x < position2.x) {
                    doorsBetween.push(doors[i]);
                }
            }else if(position1.x > position2.x) {
                if(doors[i].position.x < position1.x && doors[i].position.x >= position2.x) {
                    doorsBetween.push(doors[i]);
                }
            }
        }
        
        for(i = 0; i < doorsBetween.length; i++) {
            if(doorsBetween[i].state == "closed") return true;
        }
        return false;
    },
    
    resetDoors: function() {
        var i, doors = this.model.currentLevel.doors;
        for(i = 0; i < doors.length; i++) {
            doors[i].state = doors[i].originalState;
        }
    }
};

function GameController(gameModel) {
    this.initialise(gameModel);
}

GameController.prototype = {
        
    initialise: function(gameModel) {
        console.log("GameController::initialise");
        
        LateRunner.directions = {
            RIGHT: 1,
            STILL: 0,
            LEFT: -1
        };
        
        LateRunner.touchRadius = 42;
        
        LateRunner.gameOffset = new Vector(0, 0);
        
        var canvas = document.getElementById("gameCanvas");
        this.context = canvas.getContext('2d');
        this.setupGameModel(gameModel);
        this.setupGameViews();
        
        LateRunner.resizeController = new ResizeController(gameModel);
        LateRunner.resizeController.resizeGame();
        
        LateRunner.playerController = new PlayerController(gameModel);
        LateRunner.userInputController = new UserInputController(gameModel);
        LateRunner.doorAndSwitchController = new DoorAndSwitchController(gameModel);
        LateRunner.levelChangeController = new LevelChangeController(gameModel);
        LateRunner.bossController = new BossController(gameModel);
        LateRunner.subtitleController = new SubtitleController(gameModel);
        
        LateRunner.timerController = new TimerController(new TimerModel());
        
        this.gameLoop();
        
    },
    
    setupGameModel: function(gameModel) {
        console.log("GameController::setupGameModel");
        gameModel.touchRadius = 42;
        gameModel.levels = ModelFactory.createLevels(LateRunner.LevelData);
        gameModel.currentLevelIndex = 0;
        gameModel.currentLevel = gameModel.levels[gameModel.currentLevelIndex];
        gameModel.player = new PlayerModel();
        gameModel.boss = new BossModel();
        this.gameModel = gameModel;
    },
    
    setupGameViews: function() {
        LateRunner.backgroundColour = rgbObjToHexColourString(this.gameModel.backgroundColour);
        new LevelView(this.gameModel.currentLevel, this.context);
        this.setupSwitchViews();
        console.log(this.gameModel.currentLevel);
        if(this.gameModel.currentLevel.boss) {
            new BossView(this.gameModel.boss, this.context);
        } else {
            new StairsView(this.gameModel.currentLevel.stairs, this.context);
        }
        new PlayerView(this.gameModel.player, this.context);
        this.setupDoorViews();
        new SubtitleView(this.gameModel);
    },
    
    setupDoorViews: function() {
        for(var i = 0; i < this.gameModel.currentLevel.doors.length; i++) {
            new DoorView(this.gameModel.currentLevel.doors[i], this.context);
        }
    },
    
    setupSwitchViews: function() {
        for(var i = 0; i < this.gameModel.currentLevel.switches.length; i++) {
            new SwitchView(this.gameModel.currentLevel.switches[i], this.context);
        }
    },
    
    gameLoop: function() { 
        this.context.clearRect(0, 0, this.gameModel.width, this.gameModel.height);
        if(this.gameModel.levelTransitioningOut) {
            LateRunner.levelChangeController.transitionGameOut();
        } else if (this.gameModel.levelTransitioningIn) {
            LateRunner.levelChangeController.transitionGameIn();
        }
        LateRunner.events.emit('update');
        LateRunner.events.emit('render');
        window.requestAnimFrame((this.gameLoop).bind(this), this);
    }
};

function LevelChangeController(model) {
    this.model = model;
    LateRunner.events.on('stairsReached', this.startLevelTransitionOut, this);
}
LevelChangeController.prototype = {
    startLevel: function(newLevelIndex) {
        this.model.currentLevelIndex = newLevelIndex;
        this.model.currentLevel = this.model.levels[this.model.currentLevelIndex];
        LateRunner.events.emit('destroyViews');
        LateRunner.game.setupGameViews();
        LateRunner.resizeController.resizeGame()
        LateRunner.playerController.resetPosition();
        LateRunner.doorAndSwitchController.resetDoors();
        console.log(!!this.model.currentLevel.boss);
        if(this.model.currentLevel.boss) {
            this.model.currentSubtitle = "";
        } else {
            this.model.currentSubtitle = LateRunner.subtitleController.getNewSubtitle();
        }
    },
    
    startLevelTransitionOut: function() {
        this.model.levelTransitioningOut = true;
    },
    
    startLevelTransitionIn: function() {
        LateRunner.gameOffset.y = -this.model.height;
        this.model.levelTransitioningIn = true;
        this.model.levelTransitioningOut = false;
    },
    
    transitionGameOut: function() {
        if(this.model.currentLevelIndex + 1 < this.model.levels.length) {
            if(LateRunner.gameOffset.y < this.model.height) {
                LateRunner.gameOffset.y += this.model.levelTransitionSpeed;
            } else {
                this.startLevel(this.model.currentLevelIndex+1);
                this.startLevelTransitionIn();
            }
        }
    },
    
    transitionGameIn: function() {
        if(LateRunner.gameOffset.y < 0) {
            LateRunner.gameOffset.y += this.model.levelTransitionSpeed;
        } else {
            LateRunner.gameOffset.y = 0;
            LateRunner.events.emit('levelStarted');
        }
    }
};

var ModelFactory = {};

ModelFactory.createLevels = function(levelData) {
    console.log("ModelFactory::generateLevelModels");
    var i, levels = [], newLevelModel;
    for(i = 0; i < levelData.levels.length; i++) {
        levelData.levels[i].doors = ModelFactory.createDoorModels(i, levelData);
        levelData.levels[i].switches = ModelFactory.createSwitchModels(i, levelData);
        newLevelModel = new LevelModel(i, levelData.levels[i]);
        levels.push(newLevelModel);
    };
    return levels;
}

ModelFactory.createDoorModels = function(levelIndex, levelData) {
    var i, doorModels = [], newDoor;
    for(i = 0; i < levelData.levels[levelIndex].doors.length; i++) {
        newDoor = this.createDoorModel(levelData.levels[levelIndex].doors[i]);
        newDoor.id = i;
        doorModels.push(newDoor);
    }
    return doorModels;
}

ModelFactory.createDoorModel = function(doorData) {
    return new DoorModel(doorData);
}

ModelFactory.createSwitchModels = function(levelIndex, levelData) {
    var i, switchModels = [], dataConnectedDoors, connectedDoors = [];
    for(i = 0; i < levelData.levels[levelIndex].switches.length; i++) {
        dataConnectedDoors = levelData.levels[levelIndex].switches[i].connectedDoors;
        connectedDoors = [];
        for(j = 0; j < dataConnectedDoors.length; j++) {
            connectedDoors.push(levelData.levels[levelIndex].doors[dataConnectedDoors[j]]);
        }
        levelData.levels[levelIndex].switches[i].connectedDoors = connectedDoors;
        switchModels.push(new SwitchModel(i, levelData.levels[levelIndex].switches[i]));
    }
    return switchModels;
}

function PlayerController(model) {
    this.model = model;
    this.player = model.player;
    this.resetPosition();
    this.setupAnimationFrames();
    LateRunner.events.on('update', this.update, this);
    LateRunner.events.on('moveToObject', this.onMoveToObject, this);
}

PlayerController.prototype = {
    resetPosition: function () {
        this.player.position = new Vector(this.model.width/14 * LateRunner.sizeMultiple, this.model.height);
    },

    setupAnimationFrames: function() {
        this.player.imageObject.src = LateRunner.AnimData.player.filename;
        this.player.runFrames = {
            right: LateRunner.AnimData.player.run.right.frames,
            left: LateRunner.AnimData.player.run.left.frames,
        }
        this.player.currentFrameIndex = 0;
    },
    
    update: function() {
        if(this.player.moveDirection == LateRunner.directions.RIGHT) {
            if(this.player.position.x < this.player.targetX) {
                this.player.position.x += this.player.moveSpeed;
                this.player.currentFrame = this.player.runFrames.right[Math.ceil(this.player.currentFrameIndex)];
                this.player.currentFrameIndex = (this.player.currentFrameIndex + 0.5) % (this.player.runFrames.left.length - 1);
            } else {
                this.player.position.x = this.player.targetX;
                this.player.lastMoveDirection = LateRunner.directions.RIGHT;
                this.player.moveDirection = LateRunner.directions.STILL;
                this.onTargetObjectReached();
            }
        } else if (this.player.moveDirection == LateRunner.directions.LEFT) {
            if(this.player.position.x > this.player.targetX) {
                this.player.position.x -= this.player.moveSpeed;
                this.player.currentFrame = this.player.runFrames.left[Math.ceil(this.player.currentFrameIndex)];
                this.player.currentFrameIndex = (this.player.currentFrameIndex + 0.5) % (this.player.runFrames.left.length - 1);
            } else {
                this.player.position.x = this.player.targetX;
                this.player.lastMoveDirection = LateRunner.directions.LEFT;
                this.player.moveDirection = LateRunner.directions.STILL;
                this.onTargetObjectReached();
            }
        } else {
            if(this.player.lastMoveDirection == LateRunner.directions.RIGHT) {
                this.player.currentFrame = this.player.runFrames.right[3];
            } else if (this.player.lastMoveDirection == LateRunner.directions.LEFT) {
                this.player.currentFrame = this.player.runFrames.left[3];
            }
        }
    },
    
    onMoveToObject: function(targetObject) {
        if(LateRunner.doorAndSwitchController.doorIsClosedBetween(this.player.position, targetObject.position)) return;
        this.player.targetX = (targetObject.numberOfSteps) ? targetObject.position.x + targetObject.width/2 : targetObject.position.x;
        this.player.targetObject = targetObject;
        this.player.targetX -= this.player.currentFrame.w * LateRunner.sizeMultiple;
        if(this.player.targetX > this.player.position.x) {
            this.player.moveDirection = LateRunner.directions.RIGHT;
        } else if(this.player.targetX < this.player.position.x) {
            this.player.moveDirection = LateRunner.directions.LEFT;
        } else {
            this.onTargetObjectReached();
        }
    },
    
    onTargetObjectReached: function() {
            if(this.player.targetObject.numberOfSteps) {
            LateRunner.events.emit('stairsReached');
        } else {
            this.player.lastMoveDirection = LateRunner.directions.RIGHT;
            LateRunner.events.emit('switchActivated', this.player.targetObject);
        }
        this.player.targetObject = null;
    }
};

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

function SubtitleController(model) {
    this.model = model;
    this.setupSubtitles();
    LateRunner.events.on('timeTick', this.onTimeTick, this);
    LateRunner.events.on('seenByBoss', this.onSeenByBoss, this);
}

SubtitleController.prototype = {
    setupSubtitles: function() {
        this.model.playerSubtitles = LateRunner.SubtitleData.playerThoughts;
        this.model.bossSpeech = LateRunner.SubtitleData.bossSpeech;
        this.model.currentSubtitle = this.model.playerSubtitles[0];
    },
    onTimeTick: function() {
        if(this.model.currentLevelIndex != 0 && !this.model.currentLevel.boss) {
            if(Math.random() > 0.8) {
                this.model.currentSubtitle = this.getNewSubtitle();
                console.log(this.model.currentSubtitle);
            }
        }
    },
    getNewSubtitle: function() {
        return this.model.playerSubtitles[randomInt(0,this.model.playerSubtitles.length-1)];
    },
    getBossSubtitle: function() {
        console.log(this.model.bossSpeech)
        console.log(this.model.timeUp)
        return this.model.bossSpeech[this.model.timeUp ? 1 : 0];
    },
    onSeenByBoss: function() {
        this.model.currentSubtitle = this.getBossSubtitle();
    }
};

function TimerController(model) {
    this.model = model;
    this.model.startTime = new Date().getTime() / 1000;
    new TimerView(this.model);
    LateRunner.events.on('update', this.update, this);
}
TimerController.prototype = {
    update: function() {
        var timeNow = new Date().getTime() / 1000,
            elapsedTime = (timeNow - this.model.startTime) ;
        if(Math.floor(elapsedTime) > 0 && this.model.timing) {
            this.model.startTime = timeNow;
            this.updateTime();
        }
    },
    
    updateTime: function() {
        LateRunner.events.emit('timeTick');
        this.model.seconds = (this.model.seconds + 60 - 1) % 60;
        if(this.model.seconds == 59) 
        {
            this.model.minutes--;
            if(this.model.minutes < 0) {
                LateRunner.events.emit('timeup');
                this.onTimeUp();
                this.model.timing = false;
            }
        }
    },
    
    onTimeUp: function() {
        this.model.timeUp = true;
    },
    
    getTimeLeftAsString: function() {
        return this.model.timing ? padNumber(this.model.minutes, 2) + ":" + padNumber(this.model.seconds, 2) : "YOU'RE LATE"; 
    }
};

function UserInputController(gameModel) {
    this.model = gameModel;
    document.getElementById('gameCanvas').onclick = this.onCanvasClicked.bind(this);
    document.onkeypress = this.onKeyPressed.bind(this);
}

UserInputController.prototype = {
    onCanvasClicked: function(event){
        var canvasBounds = event.target.getBoundingClientRect(),
            clickedObject = this.getClickedObject(event.clientX - canvasBounds.left, event.clientY - canvasBounds.top);
        if(clickedObject) {
            LateRunner.events.emit('moveToObject', clickedObject);
        }
    },
    
    getClickedObject: function(x, y) {
        var i, currentSwitch;
        for(var i = 0; i < this.model.currentLevel.switches.length; i++) {
            currentSwitch = this.model.currentLevel.switches[i];
            if (coordinateWasTouched(currentSwitch.position.x, currentSwitch.position.y, x, y)) {
                return currentSwitch;
            };
        };
        if (this.model.currentLevel.stairs && x > this.model.width - this.model.currentLevel.stairs.width) return this.model.currentLevel.stairs;
        return null;
    },
    
    onKeyPressed: function(event) {
        var keyCode = window.event ? event.keyCode : event.which ? event.which : null;
        if(keyCode) keyCode = String.fromCharCode(keyCode);
        switch (keyCode) {
            case "u":
                if(this.model.currentLevelIndex + 1 < this.model.levels.length) {
                    LateRunner.levelChangeController.startLevel(this.model.currentLevelIndex + 1);
                }
            break;
            case "d":
                if(this.model.currentLevelIndex - 1 >= 0) {
                    LateRunner.levelChangeController.startLevel(this.model.currentLevelIndex - 1);
                }
            break;
        }
    }
};