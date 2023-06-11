var dataModule = (function(module) {
    "use strict";
    
    // Enemy Data ====================
    let enemyData = {};
    enemyData.monA = {
        name: "Monster A",
        hp: 15,
        def: 0,
        atk: 10,
        moveList: ["pulse"],
        sprite: battleModule.MonsterA,
    };

    enemyData.monB = {
        name: "Monster B",
        hp: 20,
        def: 10,
        atk: 10,
        moveList: ["pulse"],
        sprite: battleModule.MonsterB,
    };

    enemyData.boss = {
        name: "Boss",
        hp: 50,
        def: 10,
        atk: 12,
        moveList: ["pulse", "ice"],
        sprite: battleModule.MonsterBoss,
    };

    // Expose Public Classes ====================
    module.enemyData = enemyData;

    return module;
    
})(dataModule || {});

