var battleModule = (function(module) {
    "use strict";

    const MOVE_TYPE = {
        UNKNOWN: 0,
        ATTACK: 1,
        //DEFENCE: 2,
        HEAL: 3,
        //SPECIAL: 4,
    };
    
    const CHARACTER_STATUS = {
        NORMAL: 0,
        DEFEATED: 1,
        // POISONED: 2,
        // BLESSED: 3,
    };

    // Move ====================
    class Move {
        constructor(name) {
            this.name = name;
            this.moveType = MOVE_TYPE.UNKNOWN;
            this.power = 0;

            this.moveSprite = null;
        }
    }

    // Stat Change ====================
    class StatChange {
        constructor(character, variable, amount, duration) {
            this.character = character;
            this.variable = variable;
            this.amount = amount;
            this.duration = duration;
            this.stopwatch = 0;
        }
        effect() {
            this.character[this.variable] += this.amount;
        }
        countdown() {
            this.stopwatch++;

            if (this.stopwatch === this.duration) {
                // TODO: potential bug here
                this.character[this.variable] -= this.amount;
            }
        }
    }
    
    // HpBar ====================
    let hpBarConfig = {
        // minWidth: 30,
        //maxWidth: 100,
        height: 10,
        emptyColor: "#00B000",
        filledColor: "#00FF00",
        borderColor: "#333333",
        timePerPixel: 10,
    }

    class HpBar extends spriteModule.Sprite {
        constructor(x, y, width, maxHp, currentHp) {
            super(x, y, width, hpBarConfig.height);

            this.wholeBar = new spriteModule.Rect(0, 0, this.width, this.height,
                hpBarConfig.emptyColor,
                hpBarConfig.borderColor);
            this.addSubSprite(this.wholeBar);

            this.remainBar = new spriteModule.Rect(0, 0, this.width, this.height, hpBarConfig.filledColor);
            this.wholeBar.addSubSprite(this.remainBar);

            this.hpText = new uiModule.TextBlock(0, -15, this.width, 15);
            this.hpText.setTextColor("#000000");
            this.hpText.setFontSize(12);
            this.hpText.setTextCenter();
            this.addSubSprite(this.hpText);

            this.setMaxHp(maxHp);
            this.setHp(currentHp, false);
        }
        setHp(hp, anim = true) {
            this.currentHp = hp;

            let oldWidth = this.remainBar.width;
            let newWidth = this.width * hp / this.maxHp;
            let widthDiff = newWidth - oldWidth;

            if (anim) {
                this.remainBar.addBehaviorWithDelay(spriteModule.EaseInOutBehavior, "width", widthDiff, Math.abs(widthDiff) * hpBarConfig.timePerPixel, 0);
            }
            else {
                this.remainBar.width = newWidth;
            }

            this.updateHpUI();
        }
        setMaxHp(maxHp) {
            this.maxHp = maxHp;
            this.currentHp = maxHp;

            this.updateHpUI();
        }
        updateHpUI() {
            this.hpText.setText(this.currentHp + " / " + this.maxHp);
        }
    }

    // Actor ====================
    let characterConfig = {
        width: 50,
        height: 100,
        headHeight: 50,
        eyeFromY: 15,
        eyeMiddleY: 18,
        eyeToY: 20,
        eyeCrossDx: 2,

        monHeight: 50,
        bossHeight: 80,

        monsterEye: {
            middleY: 18,
            halfLength: 5,
        },
        
        //hairY: 9
    }
            
    class BattleActor extends spriteModule.Sprite {
        constructor(x, y, actorSprite, name = "") {
            super(x, y, 0, 0);
            this.name = name;
            this.hp = 0;
            this.maxhp = 0;
            this.def = 0;
            this.atk = 1;
            this.status = CHARACTER_STATUS.NORMAL;
            this.learntSpell = [];

            this.addSubSprite(actorSprite);
            this.moveStartPosition = actorSprite.moveStartPosition;

            // Name Label
            this.nameLabel = new uiModule.TextBlock(0, this.height, this.width, 30, this.name);
            this.nameLabel.setTextCenter();
            //this.nameLabel.setBorder(1);
            this.addSubSprite(this.nameLabel);

            // HP Bar
            this.hpBar = new HpBar(0, -20, this.width, this.hp, this.hp);
            this.addSubSprite(this.hpBar, false);
            this.hpBar.setVisible(false);
        }
        setConfig(initMap) {
            for (const key in initMap) {
                if (initMap.hasOwnProperty(key)) {
                    const value = initMap[key];
                    
                    if (key === "hp") {
                        this.hpBar.setMaxHp(value.full);
                        this.hpBar.setHp(value.now, false);
                        this.hp = value.now;
                        this.maxhp = value.full;
                    }
                    else if (key === "name") {
                        this.nameLabel.setText(value);
                    }
                    else {
                        this[key] = value;
                    }
                }
            }
        }
        loadInfo(actorInfo) {
            let initMap = {
                name: actorInfo.name,
                hp: {
                    full: actorInfo.maxhp,
                    now: actorInfo.hp
                },
                atk: actorInfo.atk,
                def: actorInfo.def,
                //status: actorInfo.status
            }

            this.setConfig(initMap);
        }
        showHpBar(isVisible) {
            this.hpBar.setVisible(isVisible);
        }
        checkHp() {
            if (this.hpBar.currentHp !== this.hp) {
                this.hpBar.setHp(this.hp);
            }            

            if (this.hp <= 0) {
                this.status = CHARACTER_STATUS.DEFEATED;

                this.addBehaviorWithDelay(spriteModule.EaseInOutBehavior,
                    "opacity",
                    -1,
                    500,
                    100);
                console.log(this.name + ": defeated");
            }
        }
        isDefeated() {
            return (this.status === CHARACTER_STATUS.DEFEATED);
        }
        receiveMove(move, amount = 0) {
            switch (move.moveType) {
                case MOVE_TYPE.ATTACK:
                    this.hp -= amount;//(attackAmount - this.def);
                    this.hp = Math.max(0, this.hp);
                    break;
                // case MOVE_TYPE.DEFENCE:
                //     this.def += move.defenceAmount;
                //     break;
                case MOVE_TYPE.HEAL:
                    this.hp += amount;
                    break;
                default:
                    break;
            }
            console.log(this.name + ": " + this.hp);
            this.checkHp();
        }
        useMove(move, opponent) {
            let receiver = null;
            let amount = null;
            let isDamage = true;

            switch (move.moveType) {
                // case MOVE_TYPE.DEFENCE:
                case MOVE_TYPE.HEAL:
                    receiver = this;
                    amount = Math.min(receiver.maxhp - receiver.hp, move.healAmount);
                    isDamage = false;
                    break;
                case MOVE_TYPE.ATTACK:
                    receiver = opponent;
                    amount = calculateDamage(move.power, this.atk, receiver.def);
                    //Math.max(move.power - receiver.def, 1);
                    break;
                default:
                    receiver = opponent;
                    break;
            }

            let callback = function() {
                receiver.receiveMove(move, amount);
            }

            if (move.moveSprite !== null && move.moveSprite !== undefined) {
                let moveSprite = new move.moveSprite(this.x + this.moveStartPosition.x, this.y + this.moveStartPosition.y);
                moveSprite.setDestinationSprite(receiver);
                if (amount !== null) {
                    moveSprite.setAmount(amount, isDamage);
                }
                moveSprite.startAnimation(callback);
                this.parentSprite.addSubSprite(moveSprite);
            }
        }
    }

    class Actor extends spriteModule.Sprite {
        constructor(x, y, width, height) {
            super(x, y, width, height);
            
            this.status = CHARACTER_STATUS.NORMAL;

            // Draw
            //this.color = "#990000";
            this.borderWidth = 5;
            this.lineJoin = "round";
        }
        setStatus(status) {
            this.status = status;
        }
    }

    class MainCharacter extends Actor {
        constructor(x, y, name = "") {
            super(x, y, characterConfig.width, characterConfig.height, name);

            this.moveStartPosition = {
                x: this.width + 5, 
                y: this.height / 3,
            };
        }
        drawItself(ctx) {
    
            // Head
            ctx.lineWidth = this.borderWidth;
            ctx.lineJoin = this.lineJoin;
            
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";//"#00000066";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.strokeStyle = "#990000";
            ctx.strokeRect(0, 0, this.width, characterConfig.headHeight);

            ctx.fillStyle = "#EEEEFF";
            ctx.fillRect(0, 0, this.width, characterConfig.headHeight);

            // Body
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(this.width / 4, characterConfig.headHeight);
            ctx.lineTo(0, characterConfig.height);
            ctx.lineTo(this.width, characterConfig.height);
            ctx.lineTo(this.width / 4 * 3, characterConfig.headHeight);
            //ctx.lineTo(this.width / 4, characterConfig.headHeight);
            ctx.stroke();
            ctx.fill();

            // Eyes
            ctx.lineCap = this.lineJoin;
            ctx.beginPath();

            //DEFEATED

            switch (this.status) {
                case CHARACTER_STATUS.NORMAL:
                    ctx.moveTo(this.width / 4, characterConfig.eyeFromY);
                    ctx.lineTo(this.width / 4, characterConfig.eyeToY);
                    ctx.moveTo(this.width / 4 * 3, characterConfig.eyeFromY);
                    ctx.lineTo(this.width / 4 * 3, characterConfig.eyeToY);
                    break;
                case CHARACTER_STATUS.DEFEATED:
                    ctx.moveTo(this.width / 4 - characterConfig.eyeCrossDx, characterConfig.eyeFromY);
                    ctx.lineTo(this.width / 4 + characterConfig.eyeCrossDx, characterConfig.eyeToY);
                    ctx.moveTo(this.width / 4 - characterConfig.eyeCrossDx, characterConfig.eyeToY);
                    ctx.lineTo(this.width / 4 + characterConfig.eyeCrossDx, characterConfig.eyeFromY);
                    
                    ctx.moveTo(this.width / 4 * 3 - characterConfig.eyeCrossDx, characterConfig.eyeFromY);
                    ctx.lineTo(this.width / 4 * 3 + characterConfig.eyeCrossDx, characterConfig.eyeToY);
                    ctx.moveTo(this.width / 4 * 3 - characterConfig.eyeCrossDx, characterConfig.eyeToY);
                    ctx.lineTo(this.width / 4 * 3 + characterConfig.eyeCrossDx, characterConfig.eyeFromY);

                    break;
            }

            ctx.stroke();

            // Hair?
            // ctx.fillStyle = "#000000";
            // ctx.beginPath();
            // ctx.moveTo(this.width / 4, 0);
            // ctx.lineTo(this.width / 2, characterConfig.hairY / 3 * 2);
            // ctx.lineTo(this.width / 2, characterConfig.hairY / 3 * 1);
            // ctx.lineTo(this.width / 8 * 7, characterConfig.hairY);
            // ctx.lineTo(this.width / 8 * 5, 0);
            // ctx.stroke();
            // ctx.fill();

            super.drawItself(ctx);
        }
    }

    class Monster extends Actor {
        constructor(x, y, name = "", fillColor = "#FF8000", strokeStyle = "#990000") {
            super(x, y, characterConfig.width, characterConfig.monHeight, name);

            this.moveStartPosition = {
                x: -30,
                y: this.height / 3,
            };

            this.strokeColor = strokeStyle;
            this.fillColor = fillColor;
        }
        drawItself(ctx) {
    
            // Head
            if (this.borderWidth > 0) {
                ctx.lineWidth = this.borderWidth;
                ctx.lineJoin = this.lineJoin;
                
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
    
                ctx.strokeStyle = this.strokeColor;
                ctx.strokeRect(0, 0, this.width, this.height);

                ctx.fillStyle = this.fillColor;
                ctx.fillRect(0, 0, this.width, this.height);
            }

            // Eyes
            ctx.lineCap = this.lineJoin;
            ctx.beginPath();

            ctx.moveTo(this.width / 4, characterConfig.monsterEye.middleY - characterConfig.monsterEye.halfLength);
            ctx.lineTo(this.width / 4, characterConfig.monsterEye.middleY + characterConfig.monsterEye.halfLength);
            ctx.moveTo(this.width / 4 * 3, characterConfig.monsterEye.middleY - characterConfig.monsterEye.halfLength);
            ctx.lineTo(this.width / 4 * 3, characterConfig.monsterEye.middleY + characterConfig.monsterEye.halfLength);

            ctx.moveTo(this.width / 4 - characterConfig.monsterEye.halfLength, characterConfig.monsterEye.middleY);
            ctx.lineTo(this.width / 4 + characterConfig.monsterEye.halfLength, characterConfig.monsterEye.middleY);
            ctx.moveTo(this.width / 4 * 3 - characterConfig.monsterEye.halfLength, characterConfig.monsterEye.middleY);
            ctx.lineTo(this.width / 4 * 3 + characterConfig.monsterEye.halfLength, characterConfig.monsterEye.middleY);

            ctx.stroke();

            super.drawItself(ctx);
        }
    }

    class MonsterA extends Monster {
        constructor(x, y, name = "") {
            super(x, y, name, "#FF8000");
        }
    }

    class MonsterB extends Monster {
        constructor(x, y, name = "") {
            super(x, y, name, "#0080FF");
        }
    }

    class MonsterBoss extends Monster {
        constructor(x, y, name = "") {
            super(x, y, name, "#336633");
        }
    }

    let calculateDamage = function(movePower, userAtk, targetDef) {
        let damage = Math.floor((userAtk * movePower - targetDef) / 10);
        return Math.max(damage, 1);
    }

    // Expose Public Classes ====================
    module.Move = Move;
    module.BattleActor = BattleActor;

    module.Actor = Actor;
    module.MainCharacter = MainCharacter;
    //module.Enemy = Enemy;
    module.MonsterA = MonsterA;
    module.MonsterB = MonsterB;
    module.MonsterBoss = MonsterBoss;

    module.MOVE_TYPE = MOVE_TYPE;
    module.CHARACTER_STATUS = CHARACTER_STATUS;
    

    return module;

})(battleModule || {});