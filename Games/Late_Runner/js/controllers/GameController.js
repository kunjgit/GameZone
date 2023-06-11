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