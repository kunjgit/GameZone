function StairsView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
    LateRunner.events.on('destroyViews', this.destroy, this);
}

StairsView.prototype = {
    render: function() {
        for (i = 0; i < this.model.numberOfSteps; i++) {
            var backgroundColourObject = hexColourStringToRgbObj(LateRunner.backgroundColour);
            var stairColour = rgbObjToHexColourString({
                    r: Math.ceil(mapValue(i, 0, this.model.numberOfSteps - 1, backgroundColourObject.r, 255)),
                    g: Math.ceil(mapValue(i, 0, this.model.numberOfSteps - 1, backgroundColourObject.g, 255)),
                    b: Math.ceil(mapValue(i, 0, this.model.numberOfSteps - 1, backgroundColourObject.b, 255))
                });
            this.context.fillStyle = stairColour;
            this.context.fillRect(LateRunner.gameOffset.x + this.model.position.x, LateRunner.gameOffset.y + this.model.height - ((i+1) * this.model.stepHeight), this.model.width, this.model.stepHeight);
        };
        this.context.fillStyle = LateRunner.backgroundColour;
        
        this.context.fillRect(LateRunner.gameOffset.x + this.model.position.x - this.model.pixelSize, LateRunner.gameOffset.y + this.model.position.y, this.model.pixelSize, this.model.height);
    },
    
    destroy: function(params) {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};