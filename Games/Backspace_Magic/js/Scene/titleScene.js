var sceneModule = (function(module) {
    "use strict";
    
    // Settings that are applicable to all games
    let config = {
        
        // Canvas
        canvasBGColor1: "#FF9999",

        titleLabel: {
            x: 50,
            y: 50,
            width: 600,
            height: 150,
            textColor: "#000000",//"#666699",
            fontSize: 60,
            text: ["Backspace", "Magic"],
        },

        choiceBox: {
            x: 230,
            y: 280,
            choicesMain: ["Go!", "Status"],
            choicesGo: ["1. Bushy Green", "2. Rocky Shore", "3. Fluffy Blue"],
            choicesGoValue: ["plain", "shore", "sky"],
            backChoice: "Back",
            transitionTime: 800,
        },

        character: {
            x: 70, 
            y: 280,
        },

        statusBox: {
            margin: 10
        }
    };

    // Event Listeners ====================

    let commandSet = {};
    commandSet.commandChoiceUp = function() {
        this.currentChoiceBox.choiceUp();
    };

    commandSet.commandChoiceDown = function() {
        this.currentChoiceBox.choiceDown();
    };
    
    commandSet.commandStart = function() {
        let choice = this.currentChoiceBox.getChoice();
        let choiceValue = this.currentChoiceBox.getChoiceValue();

        if (this.currentChoiceBox === this.mainChoiceBox) {
            switch (choice) {
                case config.choiceBox.choicesMain[0]:
                    this.switchChoiceBox(this.goChoiceBox);
                    break;
                case config.choiceBox.choicesMain[1]:
                    this.switchChoiceBox(this.statusChoiceBox);
                    this.showStatus(true);
                    break;
                default:
                    break;
            }
        }
        else if (this.currentChoiceBox === this.goChoiceBox) {
            if (choice === config.choiceBox.backChoice) {
                this.switchChoiceBox(this.mainChoiceBox, true);
            }
            else {
                this.pushScene(new module.MapScene(this.parentGame, choiceValue));
            }
        }
        else if (this.currentChoiceBox === this.statusChoiceBox) {
            this.switchChoiceBox(this.mainChoiceBox, true);
            this.showStatus(false);
        }
    };

    let mainMenuKeyListener = function (event) {
        // Prevent from moving when pressing arrow keys 
        event.preventDefault();
        this.hasUserInput = true;

        if (!this.isAllowInput)  return;

        switch(event.code) {
            case "ArrowUp":
                commandSet.commandChoiceUp.call(this);
                this.pauseInput(100);
                break;
            case "ArrowDown":
                commandSet.commandChoiceDown.call(this);
                this.pauseInput(100);
                break;
            case "Space":
            case "Enter":
                commandSet.commandStart.call(this);
                this.pauseInput(config.choiceBox.transitionTime);
                break;
            default:
                break;
        }
    };

    // TitleScene Constructor ====================
    class TitleScene extends sceneModule.Scene {
        constructor(game) {
            super(game);

            this.setBg(config.canvasBGColor1);

            let whiteRect = new spriteModule.Rect(50, -20, this.canvas.width, this.canvas.height, "rgba(255, 255, 255, 0.2)");
            whiteRect.rotateAngle = 30;
            this.addSpriteToLayer(this.layerData.layerBackground, whiteRect);

            // Title Label
            let titleLabel = new uiModule.TextBlock(config.titleLabel.x,
                config.titleLabel.y,
                config.titleLabel.width,
                config.titleLabel.height);
                //.forEach(text => titleLabel.setAllText());
            titleLabel.setAllText(config.titleLabel.text[0], config.titleLabel.text[1]);
            titleLabel.setTextColor(config.titleLabel.textColor);
            titleLabel.setFontSize(config.titleLabel.fontSize);
            //titleLabel.setTextCenter();
            this.addSpriteToLayer(this.layerData.layerUI, titleLabel);

            // Choice Box
            let mainChoiceBox = new uiModule.ChoiceBox(config.choiceBox.x, config.choiceBox.y);
            config.choiceBox.choicesMain.forEach(element => {
                mainChoiceBox.addChoice(element);
            });
            this.addSpriteToLayer(this.layerData.layerUI, mainChoiceBox);
            this.mainChoiceBox = mainChoiceBox;

            let goChoiceBox = new uiModule.ChoiceBox(config.choiceBox.x, config.choiceBox.y);
            goChoiceBox.width = 300;
            for (let i = 0; i < config.choiceBox.choicesGo.length; i++) {
                goChoiceBox.addChoice(config.choiceBox.choicesGo[i], config.choiceBox.choicesGoValue[i]);
            }
            // config.choiceBox.choicesGo.forEach(element => {
            //     goChoiceBox.addChoice(element);
            // });
            goChoiceBox.addChoice(config.choiceBox.backChoice);
            this.addSpriteToLayer(this.layerData.layerUI, goChoiceBox);
            this.goChoiceBox = goChoiceBox;

            let statusChoiceBox = new uiModule.ChoiceBox(config.choiceBox.x, config.choiceBox.y);
            statusChoiceBox.addChoice(config.choiceBox.backChoice);
            this.addSpriteToLayer(this.layerData.layerUI, statusChoiceBox);
            this.statusChoiceBox = statusChoiceBox;

            this.currentChoiceBox = mainChoiceBox;//goChoiceBox;//mainChoiceBox;

            this.choiceBoxList = [];
            this.choiceBoxList.push(mainChoiceBox);
            this.choiceBoxList.push(goChoiceBox);
            this.choiceBoxList.push(statusChoiceBox);
            for (let i = 1; i < this.choiceBoxList.length; i++) {
                this.choiceBoxList[i].setVisible(false);
            }
            this.currentChoiceIndex = 0;

            // Status Start =============================================
            //let playerInfo = this.gameDataManager.playerInfo;

            this.statBox = new uiModule.StyleBox(0, 40, 0, 110, false);
            // statBox.setText(" HP: " + playerInfo.hp, 0);
            // statBox.setText("ATK: 10", 1);
            // statBox.setText("DEF: 10", 2);

            this.learntSpellBox = new uiModule.StyleBox(0, 170, 0, 290, false);
            // learntSpellBox.setText("Spell:", 0);
            // for (let i = 0; i < playerInfo.moveList.length; i++) {
            //     const spell = playerInfo.moveList[i];
            //     learntSpellBox.setText(spell, i+1);
            // }

            this.updateStatusBox();

            let statusBoxList = [];
            statusBoxList.push(this.statBox);
            statusBoxList.push(this.learntSpellBox);

            for (let i = 0; i < statusBoxList.length; i++) {
                const box = statusBoxList[i];
                box.maxLength = 7;
                box.fitMax();
                box.x = this.width - box.width - config.statusBox.margin;
                box.setVisible(false);
                this.addSpriteToLayer(this.layerData.layerUI, box);
            }
            this.statusBoxList = statusBoxList;
            // Status End =============================================

            // Character
            let character = new battleModule.MainCharacter(config.character.x, config.character.y);
            this.addSpriteToLayer(this.layerData.layerMain1, character);

            titleLabel.opacity = 0;
            titleLabel.setFadeIn(0, 0, 1000, 200, 0);

            //this.switchChoiceBox(mainChoiceBox);
            // mainChoiceBox.opacity = 0;
            // mainChoiceBox.setFadeIn(0, 1000, 1000, -200, 0);

            character.opacity = 0;
            character.setFadeIn(0, 500, 1000, 0, -200);

            this.setEventListener("keydown", mainMenuKeyListener);
        }
        resume() {
            super.resume();

            this.gameDataManager.playerInfo.recover();

            this.updateStatusBox();
            this.switchChoiceBox(this.mainChoiceBox);
        }
        updateStatusBox() {
            let playerInfo = this.gameDataManager.playerInfo;

            this.statBox.setText(" HP: " + playerInfo.hp, 0);
            this.statBox.setText("ATK: " + playerInfo.atk, 1);
            this.statBox.setText("DEF: " + playerInfo.def, 2);

            this.learntSpellBox.setText("Spell:", 0);
            for (let i = 0; i < playerInfo.moveList.length; i++) {
                const spell = playerInfo.moveList[i];
                this.learntSpellBox.setText(spell, i+1);
            }
        }
        switchChoiceBox(target) {
            this.currentChoiceBox.setVisible(false);

            target.setVisible(true);
            target.opacity = 0;
            target.setFadeIn(0, 0, config.choiceBox.transitionTime, -100, 0);
            
            this.currentChoiceBox = target;
        }
        showStatus(isShow) {
            
            for (let i = 0; i < this.statusBoxList.length; i++) {
                const box = this.statusBoxList[i];
                
                box.setVisible(isShow);

                if (isShow) {
                    box.opacity = 0;
                    box.setFadeIn(0, 0, config.choiceBox.transitionTime, -100, 0);
                }
            }
        }
    }

    // Expose Public Functions and Classes ====================
    module.TitleScene = TitleScene;
    return module;
})(sceneModule || {});