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