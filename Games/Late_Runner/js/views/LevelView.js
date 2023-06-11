function LevelView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
    LateRunner.events.on('destroyViews', this.destroy, this);
}

LevelView.prototype = {
    render: function() {
        this.context.fillStyle = "#FFFFFF";
        var levelX = LateRunner.gameOffset.x + this.model.position.x,
            levelY = LateRunner.gameOffset.y + this.model.position.y;
        this.context.fillRect(levelX, levelY, this.model.width, 3 * this.model.height / 5);
        this.context.fillStyle = "#EEEEEE";
        this.context.fillRect(levelX, levelY + 3 * this.model.height / 5, this.model.width, 2 * this.model.height / 5);
    },
    
    destroy: function(params) {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};