var sceneModule = (function(module) {
    "use strict";
    
    // Settings that are applicable to all games
    let config = {
        //TODO

        // Canvas
        canvasBGColor1: "#FFFFAA",

        creditLabel: {
            width: 300,
            textColor: "#333333",
            fontSize: 30,
            scrollTime: 3000,
            message: [
                "Congratulations!",
                "You have completed all levels.",
                "",
                "Thank you for playing!",
                "",
                " - End - ",
            ]
        },

        toastMessage: "Press any key to return.",
    };

    // Event Listeners ====================
    let commandSet = {};
    commandSet.commandBackToTitle = function() {
        this.backSceneTillOne();
    };

    let mainKeyListener = function (event) {
        // Prevent from moving when pressing arrow keys 
        event.preventDefault();
        this.hasUserInput = true;

        if (!this.isAllowInput)  return;

        switch(event.code) {
            case "Space":
            case "Enter":
                commandSet.commandBackToTitle.call(this);
                break;
            default:
                break;
        }
    };

    // EndScene Constructor ====================
    class EndScene extends sceneModule.Scene {
        constructor(game) {
            super(game);
            this.setBg(config.canvasBGColor1);

            let labelX = (this.width - config.creditLabel.width) / 2;
            let creditLabel = new uiModule.TextBlock(labelX,
                this.height * 1.5,
                config.creditLabel.width,
                0);

            for (let i = 0; i < config.creditLabel.message.length; i++) {
                creditLabel.setText(config.creditLabel.message[i], i);
            }
            //creditLabel.setAllText(config.creditLabel.message);
            //creditLabel.setTextColor(config.creditLabel.textColor);
            creditLabel.setFontSize(config.creditLabel.fontSize);
            creditLabel.setTextCenter();

            this.addSpriteToLayer(this.layerData.layerUI, creditLabel);

            creditLabel.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "y",
                - this.height,
                config.creditLabel.scrollTime);

            creditLabel.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                "y",
                - this.height,
                config.creditLabel.scrollTime,
                config.creditLabel.scrollTime * 1.5);

            setTimeout((() => {
                this.toast(config.toastMessage);
                this.setEventListener("keydown", mainKeyListener);
            }).bind(this), config.creditLabel.scrollTime * 3);
        }
    }

    // Expose Public Functions and Classes ====================
    module.EndScene = EndScene;
    return module;

})(sceneModule || {});