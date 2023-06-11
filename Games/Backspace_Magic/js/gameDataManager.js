var dataModule = (function(module) {
    "use strict";
    
    // GameDataManager ====================
    class GameDataManager {
        constructor() {
            this.playerInfo = null;
            this.levelPassed = [];
            this.firstInit();
        }
        firstInit() {
            let firstPlayerInfo = new dataModule.PlayerInfo();
            firstPlayerInfo.name = "You";
            firstPlayerInfo.maxhp = 30;
            firstPlayerInfo.hp = 30;
            firstPlayerInfo.atk = 10;
            firstPlayerInfo.learnSpell("ice");
            firstPlayerInfo.learnSpell("fire");
            firstPlayerInfo.learnSpell("leaf");

            this.loadPlayerInfo(firstPlayerInfo);
        }
        // passLevel(level) {
        //     if (!this.levelPassed.includes(level)) {
        //         this.levelPassed.push(level);
        //     }
        // }
        // levelPassedCount() {
        //     return this.levelPassed.length;
        // }
        // save() {
        //     // TODO
        // }
        loadPlayerInfo(playerInfo) {
            this.playerInfo = playerInfo;
        }
    }

    // Expose Public Classes ====================
    module.GameDataManager = GameDataManager;

    return module;
    
})(dataModule || {});

