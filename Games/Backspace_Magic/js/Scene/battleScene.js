var sceneModule = (function(module) {
    "use strict";
    
    // Settings that are applicable to all games
    let config = {

        // Canvas
        canvasBGColor1: "#FFFF99",//"#333333",//"#FFFFFF",

        spellBox: {
            marginX: 10,
            marginY: 10,
            height: 50,
        },

        comingLetterBox:{
            width: 100
        },

        choiceBox: {
            x: 10,
            y: 295,
            choice1: "Spell",
            choice2: "Shuffle",
            choice3: "Book",
        },

        usedSpell: {
            //width: 150,
            time: 1000,
            dy: -200,
        },

        message: {
            yourTurnMsg: "Your Turn.",
            defeatMsg: "Opponent is defeated.",
            defeatedMsg: "You are defeated. Press Enter to return."
        }
        
        
    };

    // Event Listeners ====================

    let commandSet = {};
    commandSet.commandTextCursorLeft = function() {
        this.spellBox.indicatorToLeft();
    };

    commandSet.commandTextCursorRight = function() {
        this.spellBox.indicatorToRight();
    };

    commandSet.commandBackspace = function() {
        this.spellBox.backspace();
    };

    commandSet.commandSpell = function() {
        // let spellUsed = this.spellBox.castSpell();
        // if (spellUsed !== null) {
        //     let moveToUse = battleModule.moveLibrary[spellUsed];
        //     if (moveToUse !== undefined) {
        //         this.battleField.playerUseMove(moveToUse);
        //     }
        // }

        let spellUsed = this.spellBox.castSpell();
        this.battleField.playerCastSpell(spellUsed);

        if (spellUsed !== null) {
            this.usedSpellBox.setAndFitContent(spellUsed);
            this.usedSpellBox.x = this.width - config.spellBox.marginX - this.usedSpellBox.width;
            this.usedSpellBox.setVisible(true);

            this.usedSpellBox.opacity = 0;
            this.usedSpellBox.setFadeIn(0, 0,
                config.usedSpell.time / 2,
                0,
                config.usedSpell.dy);

            setTimeout(() => { this.usedSpellBox.setVisible(false) }, 
                config.usedSpell.time); 
        }
        

        this.inactiveWhenPlayerMove();
    };

    commandSet.commandBack = function() {
        // Defeat

        this.gameDataManager.playerInfo.updateHp(this.player);
        this.gameDataManager.playerInfo.statIncrease();

        this.backScene();

        this.parentGame.currentScene.removeEnemy(this.mapEnemy);
    };

    commandSet.commandBackToTitle = function() {
        this.backSceneTillOne();
    };

    let mainMenuKeyListener = function (event) {
        // Prevent from moving when pressing arrow keys 
        event.preventDefault();
        this.hasUserInput = true;

        if (!this.isAllowInput)  return;

        switch(event.code) {
            case "ArrowUp":
                this.textChoiceBox.choiceUp();
                break;
            case "ArrowDown":
                this.textChoiceBox.choiceDown();
                break;
            case "Space":
            case "Enter":
                let choice = this.textChoiceBox.getChoice();
                
                switch (choice) {
                    case config.choiceBox.choice1:
                        this.optionSpell();
                        break;
                    case config.choiceBox.choice2:
                        this.optionShuffle();
                        break;
                    case config.choiceBox.choice3:
                        this.optionBook();
                        break;
                    default:
                        break;
                }

                break;
            default:
                break;
        }

        //this.pauseInput(100);
    };

    let spellKeyListener = function (event) {
        // Prevent from moving when pressing arrow keys 
        event.preventDefault();
        
        this.hasUserInput = true;

        if (!this.isAllowInput)  return;

        switch(event.code) {
            case "ArrowLeft":
                commandSet.commandTextCursorLeft.call(this);
                this.pauseInput(100);
                break;
            case "ArrowRight":
                commandSet.commandTextCursorRight.call(this);
                this.pauseInput(100);
                break;
            case "Backspace":
            case "KeyZ":
                commandSet.commandBackspace.call(this);
                this.pauseInput(100);
                break;
            case "Space":
            case "Enter":
                commandSet.commandSpell.call(this);
                this.pauseInput();
                break;
            default:
                break;
        }
    };

    let defeatedKeyListener = function (event) {
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

    // BattleScene Constructor ====================
    class BattleScene extends sceneModule.Scene {
        constructor(game, mapEnemy) {
            super(game);
            this.setBg(config.canvasBGColor1);

            this.mapEnemy = mapEnemy;
            
            let playerInfo = this.gameDataManager.playerInfo;

            this.spellBox = new uiModule.SpellBox(config.spellBox.marginX,
                this.canvas.height - config.spellBox.height - config.spellBox.marginY,
                this.canvas.width - config.spellBox.marginX * 4 - config.comingLetterBox.width,
                config.spellBox.height);
            this.spellBox.setSpell(playerInfo.moveList);
            this.spellBox.initText();
            this.spellBox.fitMax();
            this.addSpriteToLayer(this.layerData.layerUI, this.spellBox);

            this.comingLetterBox = new uiModule.ComingLetterBox(this.canvas.width - config.comingLetterBox.width - config.spellBox.marginX * 1,
                this.spellBox.y,
                config.comingLetterBox.width,
                this.spellBox.height);
            this.comingLetterBox.setSpell(playerInfo.moveList);
            this.comingLetterBox.shuffle();
            this.addSpriteToLayer(this.layerData.layerUI, this.comingLetterBox);
            
            this.usedSpellBox = new uiModule.StyleBox(100,
                this.canvas.height - 2 * config.spellBox.height - 3 * config.spellBox.marginY,
                0,
                this.spellBox.height);
            this.addSpriteToLayer(this.layerData.layerUI, this.usedSpellBox);


            let playerSprite = new battleModule.MainCharacter(0, 0);
            this.player = new battleModule.BattleActor(0, 0, playerSprite);
            this.player.loadInfo(this.gameDataManager.playerInfo);

            let enemyData = dataModule.enemyData[mapEnemy.enemyId];
            let enemySprite = new enemyData.sprite(0, 0);
            let enemyInfo = new dataModule.ActorInfo();
            enemyInfo.loadData(enemyData);

            this.monster = new battleModule.BattleActor(0, 0, enemySprite);
            this.monster.loadInfo(enemyInfo);

            this.addSpriteToLayer(this.layerData.layerMain1, this.player);
            this.addSpriteToLayer(this.layerData.layerMain1, this.monster);

            let battleField = new battleModule.BattleField(this.width);
            battleField.addPlayer(this.player);
            battleField.addOpponent(this.monster, enemyInfo);
            battleField.registerTurnCallback(this, this.startPlayerTurn, this.startEnemyTurn);
            
            this.battleField = battleField;

            this.textChoiceBox = new uiModule.ChoiceBox(config.choiceBox.x, config.choiceBox.y);
            this.textChoiceBox.addChoice(config.choiceBox.choice1);
            this.textChoiceBox.addChoice(config.choiceBox.choice2);
            this.textChoiceBox.addChoice(config.choiceBox.choice3);
            this.addSpriteToLayer(this.layerData.layerUI, this.textChoiceBox);

            this.setEventListener("keydown", mainMenuKeyListener);
        }
        optionSpell() {
            this.setEventListener("keydown", spellKeyListener);

            this.spellBox.appendContent(this.comingLetterBox.content);
            this.comingLetterBox.setText("");
            
            this.textChoiceBox.setLookDisabled(true);
            this.spellBox.setLookDisabled(false);
        }
        optionShuffle() {
            this.comingLetterBox.shuffle();
        }
        optionBook() {
            // List the spell
            this.toast(this.gameDataManager.playerInfo.moveList.join(", "));
        }
        inactiveWhenPlayerMove() {
            this.textChoiceBox.setLookDisabled(true);
            this.spellBox.setLookDisabled(true);

            this.pauseInput();
        }
        startEnemyTurn() {
            //this.battleField.opponentMove();
        }
        startPlayerTurn() {
            if (this.battleField.isOpponentDefeated()) {
                commandSet.commandBack.bind(this)();
            }
            else if (this.battleField.isPlayerDefeated()) {
                this.toast(config.message.defeatedMsg);

                this.allowInput();
                this.setEventListener("keydown", defeatedKeyListener);
            }
            else {
                this.toast(config.message.yourTurnMsg);
                this.textChoiceBox.setLookDisabled(false);
                this.spellBox.setLookDisabled(true);
    
                this.comingLetterBox.shuffle();
    
                this.allowInput();
                this.setEventListener("keydown", mainMenuKeyListener);
            }
        }
    }

    // Expose Public Functions and Classes ====================
    module.BattleScene = BattleScene;
    return module;
})(sceneModule || {});