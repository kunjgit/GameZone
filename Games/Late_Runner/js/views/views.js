function BossView(model, context) {
    this.model = model;
    this.context = context;
    LateRunner.events.on('render', this.render, this);
    LateRunner.events.on('destroyViews', this.destroy, this);
}
BossView.prototype = {
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
    },
    
    destroy: function(params) {
        LateRunner.events.off('render', this.render)
        delete this;
    }
};

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

function SubtitleView(model) {
    this.model = model;
    LateRunner.events.on('render', this.render, this);
    this.element = document.getElementById('subtitles');
}

SubtitleView.prototype = {
    render: function() {
        this.element.innerHTML = this.model.currentSubtitle;
    }
};

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

function TimerView(model) {
    this.model = model;
    LateRunner.events.on('render', this.render, this);
    this.element = document.getElementById('timer');
}

TimerView.prototype = {
    render: function() {
        this.element.innerHTML = LateRunner.timerController.getTimeLeftAsString();
    }
}