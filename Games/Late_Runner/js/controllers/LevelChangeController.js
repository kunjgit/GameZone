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