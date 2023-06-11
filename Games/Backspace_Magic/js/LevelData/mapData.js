var dataModule = (function(module) {
    "use strict";
    
    // Map Data ====================
    let mapData = {};
    mapData.plain = {
        isEnd: false,
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        playerData: {
            i: 1, j: 0
        },
        itemData: [
            {i: 5, j: 5, type: 1, spell: "HEAL"},
            {i: 3, j: 11, type: 1, spell: "ROCK"},
        ],
        enemyData: [
            {i: 4, j: 3, id: "monA", canMove: false},
            {i: 3, j: 9, id: "monA", canMove: true},
            {i: 3, j: 8, id: "monA", canMove: false}
        ],
        bgColor: "#C6DB80", // Medium Spring Bud "#00CC00",
        wallTileSprite: mapModule.MapBushTile
    };

    mapData.shore = {
        isEnd: false,
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
            [1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        playerData: {
            i: 5, j: 3
        },
        itemData: [
            {i: 5, j: 9, type: 1, spell: "WIND"},
        ],
        enemyData: [
            {i: 3, j: 4, id: "monA", canMove: true},
            {i: 5, j: 5, id: "monA", canMove: false},
            {i: 2, j: 8, id: "monB", canMove: true},
            {i: 6, j: 8, id: "monB", canMove: false}
        ],
        bgColor: "#20B2AA",
        wallTileSprite: mapModule.MapStoneTile
    };

    mapData.sky = {
        isEnd: true,
        map: [
            [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        ],
        playerData: {
            i: 7, j: 5
        },
        itemData: [
            {i: 4, j: 3, type: 1, spell: "SNOW"},
            {i: 2, j: 7, type: 1, spell: "SPARK"},
        ],
        enemyData: [
            {i: 1, j: 5, id: "boss", canMove: false},
            {i: 4, j: 5, id: "monB", canMove: false},
            {i: 6, j: 5, id: "monA", canMove: false}
        ],
        bgColor: "#87CEEB",// Sky blue
        wallTileSprite: mapModule.MapCloudTile
    };

    // Expose Public Classes ====================
    module.mapData = mapData;

    return module;
    
})(dataModule || {});

