(function () {
    "use strict";

    game.fx = {
        'click': {
            count: 4,
            params: [
                [2, , 0.06, , 0.61, 0.58, , 0.0092, -0.0248, 0.0059, 0.9077, -1, -0.855, , -1, , -0.24, -0.4599, 0.9991, -0.647, -0.5371, , -1, 0.33]
            ]
        },
        'hover': {
            count: 4,
            params: [
                [2, 0.46, 0.01, 0.0058, , 0.29, , -0.06, -0.02, , , -0.7, 0.5, , -1, , -0.5125, -0.2453, 0.4399, -0.7, , 0.0058, -1, 0.51]
            ]
        },
        'select': {
            count: 4,
            params: [
                [2, , 0.0138, , 0.86, 0.52, , 0.04, -0.04, , , -1, , , -1, , -1, -0.56, 0.63, -0.4, 0.35, , -1, 0.16]
            ]
        },
        'move': {
            count: 4,
            params: [
                [2, 0.18, 0.01, , 0.3702, 0.14, , -0.0799, 0.26, 0.41, 0.67, -1, , , -1, , -0.1999, -0.3199, 0.46, -0.0799, , , -1, 0.4]
            ]
        },
        'hit': {
            count: 18,
            params: [
                [2, 0.16, 0.18, , , 0.4, , -0.3199, -0.4399, , , -1, , , -1, , -1, -1, 0.74, -1, , 0.54, -1, 0.55]
            ]
        },
        'explosion': {
            count: 4,
            params: [
                [3, , 0.11, 0.81, 0.4543, 0.11, , -1, -1, , , 0.36, 0.21, 0.45, -0.6599, , -0.04, 0.72, 0.26, -0.4399, , , -0.64, 0.34]

            ]
        },
        'explosionBig': {
            count: 4,
            params: [
                [3, , 0.87, , , 0.22, , , -0.14, , , -1, , , -1, , 0.08, -0.28, 0.44, -0.3399, , , -1, 0.17]
            ]
        },
        'levelup': {
            count: 1,
            params: [
                [3, 0.0061, 0.1462, 0.0048, 0.9138, 0.5027, , 0.065, , , 0.6737, 0.1527, , , -0.9567, , 0.081, -0.0307, 0.071, 0.0945, , 0.0002, , 0.26]
            ]
        },
        'death': {
            count: 1,
            params: [
                [0, 0.0001, 0.7618, 0.1376, 0.81, 0.1, , 0.3358, 0.0003, , , 0.3006, , , 0.048, 0.6803, -1, -0.76, 0.9985, 0.6463, 0.3453, , -1, 0.27]
            ]
        }
    };

    game.audio = {
        sounds: {},
        references: [],
        mute: false,
        play: function (sound) {
            if (!game.audio.mute) {
                var audio = game.audio.sounds[sound];
                if (audio.length > 1) {
                    audio = game.audio.sounds[sound][game.rand.range(0, audio.length)];
                } else {
                    audio = game.audio.sounds[sound][0];
                }
                audio.pool[audio.tick].play();
                if (audio.tick < audio.count - 1) {
                    audio.tick++;
                } else {
                    audio.tick = 0;
                }
            }
        }
    };

    for (var k in game.fx) {
        if (game.fx.hasOwnProperty(k)) {
            game.audio.sounds[k] = [];

            game.fx[k].params.forEach(function (elem, index) {
                game.audio.sounds[k].push({
                    tick: 0,
                    count: game.fx[k].count,
                    pool: []
                });

                for (var i = 0; i < game.fx[k].count; i++) {
                    var audio = new Audio();
                    if (typeof jsfxr !== "undefined") {
                        audio.src = jsfxr(elem);
                    }
                    game.audio.references.push(audio);
                    game.audio.sounds[k][index].pool.push(audio);
                }

            });
        }
    }
})();
