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