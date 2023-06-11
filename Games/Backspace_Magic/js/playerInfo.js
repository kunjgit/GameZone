var dataModule = (function(module) {
    "use strict";

    class ActorInfo {
        constructor() {
            this.name = "";
            this.maxhp = 1;
            this.hp = 1;
            this.def = 0;
            this.atk = 1;
            this.status = battleModule.CHARACTER_STATUS.NORMAL;
            this.moveList = [];
        }
        updateHp(source) {
            this.hp = source.hp;
        }
        recover() {
            this.hp = this.maxhp;
        }
        loadData(data) {
            this.name = data.name;
            this.maxhp = data.hp;
            this.hp = data.hp;
            this.def = data.def;
            this.atk = data.atk;
            this.status = battleModule.CHARACTER_STATUS.NORMAL;
            this.moveList = data.moveList;
        }
    }

    class PlayerInfo extends ActorInfo {
        constructor() {
            super();
        }
        learnSpell(spell) {
            spell = spell.toUpperCase();

            if (!this.moveList.includes(spell)) {
                this.moveList.push(spell);
                return true;
            }

            return false;
        }
        statIncrease() {
            let rand = Math.floor(Math.random() * 3);
            switch(rand) {
                case 0:
                    this.maxhp += 2;
                break;
                case 1:
                    this.atk += 2;
                break;
                case 2:
                    this.def += 2;
                break;
            }
        }
    }

    // Expose Public Classes ====================
    module.ActorInfo = ActorInfo;
    module.PlayerInfo = PlayerInfo;

    return module;

})(dataModule || {});