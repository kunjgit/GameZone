function PlayerView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
}

PlayerView.prototype = {
    render: function() {
        this.context.drawImage(this.model.imageObject,
                               this.model.currentFrame.x, 
                               this.model.currentFrame.y, 
                               this.model.currentFrame.w, 
                               this.model.currentFrame.h, 
                               LateRunner.gameOffset.x + this.model.position.x - this.model.currentFrame.w/2 * LateRunner.sizeMultiple,
                               LateRunner.gameOffset.y + this.model.position.y - this.model.currentFrame.h * LateRunner.sizeMultiple,
                               this.model.currentFrame.w * LateRunner.sizeMultiple,
                               this.model.currentFrame.h * LateRunner.sizeMultiple);
        this.context.fillStyle = "#FF0000";
    },
    
    destroy: function(params) {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};