function SwitchView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
    LateRunner.events.on('destroyViews', this.destroy, this);
}

SwitchView.prototype = {
    render: function() {
        this.context.fillStyle = LateRunner.backgroundColour;
        this.context.fillRect(
            LateRunner.gameOffset.x + this.model.position.x - this.model.radius,
            LateRunner.gameOffset.y + this.model.position.y - (this.model.radius / 2),
            this.model.radius * 2, 
            this.model.radius
        );
        this.context.fillRect(
            LateRunner.gameOffset.x + this.model.position.x - (this.model.radius / 2),
            LateRunner.gameOffset.y + this.model.position.y - this.model.radius,
            this.model.radius, 
            this.model.radius * 2
        );
    },
    
    destroy: function() {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};