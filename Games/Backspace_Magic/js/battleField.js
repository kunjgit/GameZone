var battleModule = (function(module) {
    "use strict";

    let config = {
        groundY: 250,
        turnInterval: 1000,
    };

    // BattleField ====================
    class BattleField {
        constructor(width) {
            this.fieldWidth = width;
            this.mainCharacter = null;
            this.opponentSide = [];
            this.opponentSideInfo = [];

            this.startPlayerTurn = null;
            this.startOpponentTurn = null;
        }
        addPlayer(actor) {            
            actor.setPos(this.fieldWidth / 4, config.groundY - actor.height);
            actor.showHpBar(true);
            this.mainCharacter = actor;
        }
        loadOpponentData(data) {

        }
        addOpponent(actor, actorInfo) {
            actor.setPos(this.fieldWidth / 4 * 3, config.groundY - actor.height);
            actor.showHpBar(true); // TODO: cancel
            this.opponentSide.push(actor);
            this.opponentSideInfo.push(actorInfo);
        }
        registerTurnCallback(bindScene, playerTurn, opponentTurn) {
            this.startPlayerTurn = playerTurn.bind(bindScene);
            this.startOpponentTurn = opponentTurn.bind(bindScene);
        }
        playerCastSpell(spellUsed) {
            if (spellUsed !== null) {
                let moveToUse = battleModule.moveLibrary[spellUsed.toLowerCase()];
                if (moveToUse !== undefined) {
                    let target = this.opponentSide[0];
                    this.mainCharacter.useMove(moveToUse, target);
                }
            }

            setTimeout(() => {
                this.startOpponentTurn();
                this.opponentMove();
            }, config.turnInterval);
        }
        opponentMove() {
            let target = this.mainCharacter;

            for (let i = 0; i < this.opponentSide.length; i++) {
                const opponent = this.opponentSide[i];
                const opponentInfo = this.opponentSideInfo[i];

                let randIndex = Math.floor(Math.random() * opponentInfo.moveList.length);
                let move = battleModule.moveLibrary[opponentInfo.moveList[randIndex]];

                if (!opponent.isDefeated()) {
                    setTimeout(() => {
                        opponent.useMove(move, target);
                    }, config.turnInterval * i);
                }
            }

            setTimeout(() => {
                this.startPlayerTurn();
            }, config.turnInterval * this.opponentSide.length);           
        }
        isOpponentDefeated() {
            return this.opponentSide.every(o => o.isDefeated());
        }
        isPlayerDefeated() {
            return this.mainCharacter.isDefeated();
        }
    }

    // Expose Public Classes ====================
    module.BattleField = BattleField;
    return module;

})(battleModule || {});