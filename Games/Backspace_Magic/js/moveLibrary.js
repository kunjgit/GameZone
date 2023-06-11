var battleModule = (function(module) {
    "use strict";

    let moveSourceList = {};
    let moveLibrary = {};

    moveSourceList.pulse = {
        name: "pulse",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 2,
        moveSprite: spriteModule.Pulse
    };

    moveSourceList.ice = {
        name: "ice",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 5,
        moveSprite: spriteModule.Ice
    };

    moveSourceList.leaf = {
        name: "leaf",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 8,
        moveSprite: spriteModule.Leaf
    };

    moveSourceList.fire = {
        name: "fire",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 10,
        moveSprite: spriteModule.Fire
    };

    // moveSourceList.claw = {
    //     name: "claw",
    //     moveType: battleModule.MOVE_TYPE.ATTACK,
    //     power: 12,
    //     moveSprite: spriteModule.Fire
    // };

    moveSourceList.rock = {
        name: "rock",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 15,
        moveSprite: spriteModule.Rock
    };

    moveSourceList.wind = {
        name: "wind",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 15,
        moveSprite: spriteModule.Wind
    };

    moveSourceList.snow = {
        name: "snow",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 18,
        moveSprite: spriteModule.Snow
    };

    moveSourceList.spark = {
        name: "spark",
        moveType: battleModule.MOVE_TYPE.ATTACK,
        power: 25,
        moveSprite: spriteModule.Spark
    };

    // moveSourceList.lava = {
    //     name: "lava",
    //     moveType: battleModule.MOVE_TYPE.ATTACK,
    //     power: 12
    // };

    // moveSourceList.thunder = {
    //     name: "leaf",
    //     moveType: battleModule.MOVE_TYPE.ATTACK,
    //     power: 28
    // };

    // moveSourceList.shield = {
    //     name: "shield",
    //     moveType: battleModule.MOVE_TYPE.DEFENSE,
    //     defenceAmount: 10,
    // };

    moveSourceList.heal = {
        name: "heal",
        moveType: battleModule.MOVE_TYPE.HEAL,
        healAmount: 10,
        moveSprite: spriteModule.Ice
    };

    for (const key in moveSourceList) {
        if (moveSourceList.hasOwnProperty(key)) {
            const moveSource = moveSourceList[key];
            let move = new battleModule.Move(moveSource.name);
            move.moveType = moveSource.moveType;
            move.power = moveSource.power;
            move.healAmount = moveSource.healAmount;
            move.moveSprite = moveSource.moveSprite;
            moveLibrary[moveSource.name] = move;
        }
    }

    // Expose Public Classes ====================
    module.moveLibrary = moveLibrary;
    
    return module;

})(battleModule || {});