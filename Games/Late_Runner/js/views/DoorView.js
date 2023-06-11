function DoorView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
    LateRunner.events.on('destroyViews', this.destroy, this);
}

DoorView.prototype = {
    render: function() {
        this.context.fillStyle = LateRunner.backgroundColour;
        if(this.model.state == "closed"){
            this.context.fillRect(LateRunner.gameOffset.x + this.model.position.x, LateRunner.gameOffset.y + this.model.position.y, this.model.width, this.model.height);
        } else {
            this.context.fillRect(LateRunner.gameOffset.x + this.model.position.x, LateRunner.gameOffset.y + this.model.position.y, this.model.width, this.model.openSegmentHeight);
            this.context.fillRect(LateRunner.gameOffset.x + this.model.position.x, LateRunner.gameOffset.y + this.model.position.y + this.model.height - this.model.openSegmentHeight, this.model.width, this.model.openSegmentHeight);
        };
    },
    
    destroy: function() {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};