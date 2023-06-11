var sceneModule = (function(module) {
    "use strict";
    
    // Settings that are applicable to all games
    let config = {

        statusBar: {
            margin: 10
        }
        
    };

    // Event Listeners ====================

    let commandSet = {};
    commandSet.commandPlayerMove = function(deltaI, deltaJ) {
        this.pauseInput();
        this.mapBoard.startTurn(deltaI, deltaJ);
    };

    commandSet.commandEncounter = function(mapEnemy) {
        setTimeout(() => {
            this.pushScene(new module.BattleScene(this.parentGame, mapEnemy));
        }, 200);
    };

    commandSet.commandLeave = function() {

        
        setTimeout(() => {
            if (this.mapData.isEnd) {
                this.pushScene(new module.EndScene(this.parentGame));
            }
            else
            {
                this.backScene();
            }
        }, 500);
    };
    
    let mainMenuKeyListener = function (event) {
        // Prevent from moving when pressing arrow keys 
        event.preventDefault();
        this.hasUserInput = true;

        if (!this.isAllowInput)  return;

        switch(event.code) {
            case "ArrowLeft":
                commandSet.commandPlayerMove.call(this, 0, -1);
                break;
            case "ArrowRight":
                commandSet.commandPlayerMove.call(this, 0, 1);
                break;
            case "ArrowUp":
                commandSet.commandPlayerMove.call(this, -1, 0);
                break;
            case "ArrowDown":
                commandSet.commandPlayerMove.call(this, 1, 0);
                break;
            default:
                break;
        }
    };

    // MapScene Constructor ====================
    class MapScene extends sceneModule.Scene{
        constructor(game, mapDataKey) {
            super(game);

            let mapData = dataModule.mapData[mapDataKey];
            this.mapData = mapData;
            this.setBg(mapData.bgColor);
            
            let margin = config.statusBar.margin;
            this.statusBar = new uiModule.StyleBox(margin, margin, this.width - margin * 2);
            this.addSpriteToLayer(this.layerData.layerBackground, this.statusBar);

            let bottomPane = new spriteModule.Sprite(0, this.statusBar.height);
            let mapBoard = new MapBoard(0, 0, mapData);
            mapBoard.centerItself(this.width, this.height - this.statusBar.height);
            bottomPane.addSubSprite(mapBoard.mapSprite);
            this.addSpriteToLayer(this.layerData.layerBackground, bottomPane);

            mapBoard.encounterCallback = commandSet.commandEncounter.bind(this);
            mapBoard.completeCallback = commandSet.commandLeave.bind(this);
            mapBoard.startTurnCallback = this.resumeInput.bind(this);
            mapBoard.pickUpCallback = this.pickup.bind(this);

            this.mapBoard = mapBoard;
            this.setEventListener("keydown", mainMenuKeyListener);
        }
        resume() {
            super.resume();

            this.updateInfoBar();
        }
        updateInfoBar() {
            let playerInfo = this.gameDataManager.playerInfo;
            this.statusBar.setText(utils.sprintf("HP: %d/%d | ATK: %d | DEF: %d",
                playerInfo.hp,
                playerInfo.maxhp,
                playerInfo.atk,
                playerInfo.def));
        }
        removeEnemy(mapEnemy) {
            this.mapBoard.removeEnemy(mapEnemy);
        }
        pickup(mapItem) {
            if (mapItem.type === 1) {
                let learnNew = this.gameDataManager.playerInfo.learnSpell(mapItem.spell);

                this.toast(learnNew ? utils.sprintf("Found the \"%s\" scroll.", mapItem.spell) :  "Learnt already.");
            }
        }
    }

    class MapBoard {
        constructor(x, y, mapData) {

            this.mapSprite = new spriteModule.Sprite(x, y);
            this.map = mapData.map;

            // this.map = [
            //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            //     [0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
            //     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            //     [1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
            //     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            //     [1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
            //     [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //     [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
            //     [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
            //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            // ];
            this.rowCount = this.map.length;
            this.colCount = this.map[0].length;

            for (let i = 0; i < this.map.length; i++) {
                const row = this.map[i];

                for (let j = 0; j < row.length; j++) {
                    const tileValue = row[j];
                    let mapEntity;

                    switch (tileValue) {
                        case 0:
                            //mapEntity = new spriteModule.Rect(0, 0, 40, 40, "#FFFF00");
                        break;
                        case 1:
                            mapEntity = new mapData.wallTileSprite(i, j);
                            //mapEntity = new mapModule.MapTile(i, j);
                        break;
                        case 2:
                            mapEntity = new mapModule.MapGoalTile(i, j);
                        break;
                        // case 3:
                        // case 4:
                        // case 5:
                        // case 6:
                        //     mapEntity = new mapModule.MapArrowTile(i, j, tileValue - 3);
                        default:
                        break;
                    }

                    if (mapEntity !== undefined) {
                        this.mapSprite.addSubSprite(mapEntity);
                    }
                }
            }
            this.mapItemList = [];
            //this.mapActorList = [];
            this.mapEnemyList = [];
            //this.mapEnemyList.push(new mapModule.MapEnemy(2, 2));
            //this.mapEnemyList.push(new mapModule.MapEnemy(3, 3));

            for (let i = 0; i < mapData.itemData.length; i++) {
                const mapItemBox = new mapModule.MapItemBox(mapData.itemData[i]);//this.mapEnemyList[i];
                this.mapItemList.push(mapItemBox);
                this.mapSprite.addSubSprite(mapItemBox);
            }
            
            for (let i = 0; i < mapData.enemyData.length; i++) {
                const mapEnemy = new mapModule.MapEnemy(mapData.enemyData[i]);//this.mapEnemyList[i];
                this.mapEnemyList.push(mapEnemy);
                //this.mapActorList.push(mapEnemy);
                this.mapSprite.addSubSprite(mapEnemy);
            }

            this.mapPlayer = new mapModule.MapPlayer(mapData.playerData);//(1, 1);
            //this.mapActorList.push(this.mapPlayer);
            this.mapSprite.addSubSprite(this.mapPlayer);

            this.encounterCallback = null;
            this.completeCallback = null;
            this.startTurnCallback = null;
            this.pickUpCallback = null;
            // setInterval(() => {
            //     this.enemyTurnMove();
            // }, 1000);
        }
        centerItself(canvasWidth, canvasHeight) {
            let width = this.mapSprite.width;
            let height = this.mapSprite.height;

            this.mapSprite.x = (canvasWidth - width) / 2;
            this.mapSprite.y = (canvasHeight - height) / 2;
        }
        startTurn(deltaI , deltaJ) {
            let isEncounter = false;
            let isAtGoal = false;

            if (this.canMapActorMove(this.mapPlayer, deltaI, deltaJ)) {
                this.mapPlayer.moveBy(deltaI, deltaJ);

                isAtGoal = this.isAtGoal(this.mapPlayer);
                if (isAtGoal) {
                    this.completeCallback();
                    return;
                }

                // TODO: check effect
                isEncounter = this.tryEncounter();
                if (isEncounter) {
                    return;
                }

                let itemPicked = this.tryPickUp();
                if (itemPicked) {
                    this.pickUpCallback(itemPicked);
                    this.removeItem(itemPicked);
                }

                // Enemy's turn
                this.enemyTurnMove();

                this.tryEncounter();

                // setTimeout(() => {
                //     this.tileAction();
                // }, 200);
            }

            this.startTurnCallback();
        }
        isAtGoal(mapActor) {
            return (this.map[mapActor.i][mapActor.j] === 2);
        }
        tryEncounter() {

            let encounterMapEnemy = null;

            for (let i = 0; i < this.mapEnemyList.length; i++) {
                const mapEnemy = this.mapEnemyList[i];
            
                if (mapEnemy.i === this.mapPlayer.i && 
                    mapEnemy.j === this.mapPlayer.j) {
                    encounterMapEnemy = mapEnemy;
                    break;
                }
            }

            if (encounterMapEnemy !== null && this.encounterCallback !== null) {
                this.encounterCallback(encounterMapEnemy);
                return true;
            }

            return false;
        }
        tryPickUp() {
            let itemPicked = null;
            for (let i = 0; i < this.mapItemList.length; i++) {
                const mapItem = this.mapItemList[i];
            
                if (mapItem.i === this.mapPlayer.i && 
                    mapItem.j === this.mapPlayer.j) {
                    itemPicked = mapItem;
                    break;
                }
            }

            return itemPicked;
        }
        registerCallback() {
            //TODO
        }
        removeEnemy(mapEnemy) {
            mapEnemy.setVisible(false);
            let index = this.mapEnemyList.indexOf(mapEnemy);
            this.mapEnemyList.splice(index, 1);
        }
        removeItem(mapItem) {
            mapItem.setVisible(false);
            let index = this.mapItemList.indexOf(mapItem);
            this.mapItemList.splice(index, 1);
        }
        enemyTurnMove() {
            for (let i = 0; i < this.mapEnemyList.length; i++) {
                const mapEnemy = this.mapEnemyList[i];
                if (mapEnemy.canMove) {

                    let randDir = Math.floor(Math.random() * 4);
                    let deltaI, deltaJ;

                    switch (randDir) {
                        case 0:
                            [deltaI, deltaJ] = [1, 0];
                            break;
                        case 1:
                            [deltaI, deltaJ] = [-1, 0];
                            break;
                        case 2:
                            [deltaI, deltaJ] = [0, 1];
                            break;
                        case 3:
                            [deltaI, deltaJ] = [0, -1];
                            break;
                    }
                    
                    if (this.canMapActorMove(mapEnemy, deltaI, deltaJ)) {
                        mapEnemy.moveBy(deltaI, deltaJ);
                    }
                }
            }
        }
        // tileAction() {
        //     //this.mapEnemyList = [];
            
        //     this.mapActorList.forEach((mapActor) => {
        //         let deltaI, deltaJ;

        //         switch(this.map[mapActor.i][mapActor.j]) {
        //             case 3:
        //                 [deltaI, deltaJ] = [0, 1];
        //                 break;
        //             case 4:
        //                 [deltaI, deltaJ] = [1, 0];
        //                 break;
        //             case 5:
        //                 [deltaI, deltaJ] = [0, -1];
        //                 break;
        //             case 6:
        //                 [deltaI, deltaJ] = [-1, 0];
        //                 break;
        //         }

        //         if (deltaI !== undefined && this.canMapActorMove(mapActor, deltaI, deltaJ)) {
        //             mapActor.moveBy(deltaI, deltaJ);
        //         }
        //     });
            
        // }
        canMapActorMove(mapActor, deltaI, deltaJ) {
            let newI = mapActor.i + deltaI;
            let newJ = mapActor.j + deltaJ;

            if (newI < 0 || newI >= this.rowCount) {
                return false;
            }
            
            if (newJ < 0 || newJ >= this.colCount) {
                return false;
            }
            
            // TODO: check amongst actors

            return (this.map[newI][newJ] !== 1);
        }
    }
    // Expose Public Functions and Classes ====================
    module.MapScene = MapScene;
    return module;
})(sceneModule || {});