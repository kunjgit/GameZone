import { gamePrefs } from '../UI/preferences.js';
import { game } from '../core/Game.js';
import { common } from '../core/common.js';
import { searchParams, TYPES } from '../core/global.js';
import { net } from '../core/network.js';

// Default "world": Tutorial, level 1 or level 9 (roughly)

let originalLevels;

let level = searchParams.get('level');
let levelName;

function setCustomLevel(levelData) {

  originalLevels['Custom Level'] = levelData;

  setLevel('Custom Level', 'Custom Level');
  
}

function setLevel(levelLabel, newLevelName) {

  level = levelLabel;
  levelName = newLevelName;

}

function previewLevel(levelName, excludeVehicles) {

  // given level data, filter down and render at scale.

  if (!levelName) return;

  let data = originalLevels[levelName];

  if (!data) return;

  // if nothing is > 4096, then it's original game data; double all values.
  let multiplier = 2;

  data.forEach((item) => {
    if (item[item.length - 1] >= 4096) {
      multiplier = 1;
    }
  });

  game.objects.radar.reset();

  if (excludeVehicles) {
    // buildings only
    data = data.filter((item) => item?.[0]?.match(/base|bunker|super-bunker|chain|balloon|turret/i));
  } else {
    // buildings + units
    data = data.filter((item) => item?.[0]?.match(/base|bunker|super-bunker|chain|balloon|turret|tank|launcher|van|infantry|engineer/i));
  }

  const initMethods = {
    base: {
      transformSprite: true
    },
    balloon: {
      data: {
        y: 32
      }
    }
  };

  const oPreview = document.createElement('div');

  data.forEach((item) => {

    const exports = {
      data: common.inheritData({
        type: item[0],
        bottomAligned: item[0] !== 'balloon',
        isOnScreen: true,
        isEnemy: (item[1] === 'right'),
        ...item[0].data,
      }, {
        x: item[2] * multiplier,
        y: initMethods[item[0]]?.data?.y
      }),
    };

    const radarItem = game.objects.radar.addItem(exports, `sprite ${item[0]}${(item[1] === 'right') ? ' enemy' : ''}`);

    // pull vehicles behind bunkers, super-bunkers etc.
    if (item[0].match(/tank|launcher|van|infantry|engineer/i)) {
      radarItem.dom.o.style.zIndex = -1;
    }

    // if a bunker, also tweak opacity so overlapping units can be seen.
    if (item[0].match(/base|bunker/i)) {
      radarItem.dom.o.style.opacity = 0.9;
    }

    // if a bunker, also make a matching balloon.
    if (item[0] === 'bunker') {
      const balloonExports = {
        data: common.inheritData({
          type: 'balloon',
          isOnScreen: true,
          isEnemy: exports.data.isEnemy
        }, {
          x: exports.data.x,
          y: initMethods.balloon.data.y
        })
      };
      game.objects.radar.addItem(balloonExports, `sprite balloon${(item[1] === 'right') ? ' enemy' : ''}`);
    }

  });

  const levelPreview = document.getElementById('level-preview');
  levelPreview.innerHTML = '';
  levelPreview.appendChild(oPreview);

}

function addWorldObjects() {

  const { addItem } = game;

  function addObject(type, options) {
    game.addObject(type, {
      ...options,
      staticID: true
    });
  }

  // prototype, maybe shows only around Thanksgiving
  // when The Great Pumpkin is anticipated!
  /*
  addObject(TYPES.flyingAce, {
    x: -192
  });
  */

  // const env = !!(window.location.href.match(/schillmania|original/i));
  
  const defaultLevel = 'Cake Walk';

  /*
  if ((env && !level) || tutorialMode) {
    
    let i, x;

    // player's landing pad

    addObject(TYPES.landingPad, {
      name: 'THE LANDING PAD',
      x: 300
    });

    addItem('right-arrow-sign', -48);

    addObject(TYPES.base, {
      x: 160
    });

    addObject(TYPES.base, {
      x: 8000,
      isEnemy: true
    });

    // local, and enemy base end bunkers

    addObject(TYPES.endBunker);

    addObject(TYPES.endBunker, {
      isEnemy: true
    });

    if (gameType === 'hard' || gameType === 'extreme') {

      // "level 9"

      // mid and end-level landing pad. create up-front, since vans rely on it for xGameOver.

      addObject(TYPES.landingPad, {
        name: 'THE MIDWAY',
        isMidway: true,
        x: 3944
      });

      addObject(TYPES.landingPad, {
        name: 'THE DANGER ZONE',
        x: 7800
      });

      // twin enemy turrets, mid-field - good luck. 😅
      if (gameType === 'extreme') {
        addObject(TYPES.turret, {
          x: 3800,
          isEnemy: true
        });
        addObject(TYPES.turret, {
          x: 4145,
          isEnemy: true
        });
      }

      addItem('tree', 505);

      addItem('right-arrow-sign', 550);

      x = 630;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 230;

      addItem('grave-cross', x);

      x += 12;

      addItem('cactus2', x);

      x += 92;

      addObject(TYPES.turret, {
        x,
        isEnemy: true,
        DOA: false
      });

      x += 175;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 100;

      addObject(TYPES.tank, {
        x,
        isEnemy: true
      });

      addItem('grave-cross', x);

      x += 40;

      addItem('cactus', x);

      x += 250;

      addObject(TYPES.tank, {
        x,
        isEnemy: true
      });

      x += 50;

      addObject(TYPES.tank, {
        x,
        isEnemy: true
      });

      x += 80;

      for (i = 0; i < 10; i++) {

        addObject(TYPES.infantry, {
          x: x + (i * 11),
          isEnemy: true
        });

      }

      addObject(TYPES.van, {
        x: x + 210,
        isEnemy: true
      });

      addItem('gravestone', x);

      x += 110;

      addObject(TYPES.superBunker, {
        x,
        isEnemy: true,
        energy: 5
      });

      x += 120;

      addObject(TYPES.turret, {
        x,
        isEnemy: true,
        DOA: false
      });

      x += 640;

      addItem('gravestone', x);

      addObject(TYPES.van, {
        x,
        isEnemy: true
      });

      for (i = 0; i < 5; i++) {

        addObject(TYPES.infantry, {
          x: (x + 50) + (i * 11),
          isEnemy: true
        });

      }

      x += 80;

      addItem('sand-dunes', x);

      addObject(TYPES.tank, {
        x: x + 75,
        isEnemy: true
      });

      for (i = 0; i < 5; i++) {

        addObject(TYPES.infantry, {
          x: (x + 75) + (i * 11),
          isEnemy: true
        });

      }

      addObject(TYPES.tank, {
        x: x + 240,
        isEnemy: true
      });

      x += 540;

      addObject(TYPES.tank, {
        x,
        isEnemy: true
      });

      addObject(TYPES.tank, {
        x: x + 240,
        isEnemy: true
      });

      for (i = 0; i < 5; i++) {

        addObject(TYPES.infantry, {
          x: (x + 240 + 75) + (i * 11),
          isEnemy: true
        });

      }

      addObject(TYPES.van, {
        x: x + 240 + 215,
        isEnemy: true
      });

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 135;

      addItem('gravestone', x);

      x += 25;

      addItem('cactus2', x);

      x += 260;

      addItem('sand-dune', x);

      x -= 40;

      addItem('grave-cross', x);

      x += 150;

      addItem('sand-dunes', x);

      x += 150;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 115;

      // landing pad is logically added here.

      x += 88;

      // gravestone sits behind...

      x += 10;

      addItem('gravestone', x);

      x -= 10;

      // now, stack on top

      addItem('sand-dune', x);

      addItem('grave-cross', x);

      x += 54;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x -= 6;

      addItem('checkmark-grass', x);

      x += 90;

      addItem('cactus', x);

      x += 305;

      addItem('gravestone', x);

      x += 32;

      addItem('grave-cross', x);

      x += 80;

      addItem('sand-dune', x);

      x += 115;

      addItem('grave-cross', x);

      x += 175;

      addItem('gravestone', x);

      x += 55;

      addItem('cactus2', x);

      x += 85;

      addItem('gravestone', x);

      x += 25;

      addItem('grave-cross', x);

      x += 70;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 5;

      addItem('gravestone', x);

      x += 85;

      addItem('gravestone', x);

      x += 192;

      addItem('gravestone', x);

      x += 96;

      addItem('gravestone', x);

      x += 150;

      addItem('grave-cross', x);

      x += 50;

      addItem('gravestone', x);

      x += 260;

      addItem('gravestone', x);

      x += 45;

      addItem('sand-dunes', x);

      x += 215;

      addItem('cactus2', x);

      x += 60;

      addObject(TYPES.superBunker, {
        x,
        isEnemy: true,
        energy: 5
      });

      x += 125;

      addObject(TYPES.turret, {
        x,
        isEnemy: true,
        DOA: false
      });

      x += 145;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 128;

      addObject(TYPES.bunker, {
        x,
        isEnemy: true
      });

      x += 20;

      addItem('grave-cross', x);

      x += 64;

      addItem('cactus2', x);

      x += 50;

      addItem('gravestone', x);

      x += 200;

      addItem('gravestone', x);

      x += 115;

      addItem('cactus', x);

      x += 42;

      addItem('grave-cross', x);

      x += 140;

      addItem('cactus2', x);

      x += 12;

      addItem('cactus2', x);

      x += 100;

      addItem('gravestone', x);

      x += 145;

      // ideally, this should be between the right post sign now.

      addItem('grave-cross', x);

    } else {

      // level 1

      // mid and end-level landing pads (affects van objects' xGameOver property, so create this ahead of vans.)

      addObject(TYPES.landingPad, {
        name: 'THE MIDWAY',
        isMidway: true,
        x: 4096 - 290
      });

      addObject(TYPES.landingPad, {
        name: 'THE DANGER ZONE',
        isKennyLoggins: true,
        x: 7800
      });

      // this turret is used in the tutorial, rebuilt by engineers - and a handy defense in the real games. ;)
      addObject(TYPES.turret, {
        x: 475,
        DOA: true
      });

      addObject(TYPES.bunker, {
        x: 1024,
        isEnemy: true
      });

      addItem('tree', 660);

      addItem('palm-tree', 860);

      addItem('barb-wire', 918);

      addItem('palm-tree', 1120);

      addItem('rock2', 1280);

      addItem('palm-tree', 1390);

      addObject(TYPES.bunker, {
        x: 1536
      });

      addItem('palm-tree', 1565);

      addItem('flower', 1850);

      addObject(TYPES.bunker, {
        x: 2048
      });

      addItem('tree', 2110);

      addItem('gravestone', 2150);

      addItem('palm-tree', 2260);

      addItem('tree', 2460);

      addObject(TYPES.bunker, {
        x: 2560
      });

      addItem('tree', 2700);

      addObject(TYPES.bunker, {
        x: 3072
      });

      addItem('palm-tree', 3400);

      addItem('palm-tree', 3490);

      addItem('checkmark-grass', 4120);

      addItem('palm-tree', 4550);

      addObject(TYPES.bunker, {
        x: 4608,
        isEnemy: true
      });

      addItem('tree', 4608);

      addItem('tree', 4820);

      addItem('palm-tree', 4850);

      addItem('grave-cross', 4970);

      addObject(TYPES.bunker, {
        x: 5120,
        isEnemy: true
      });

      addItem('tree', 5110);

      addItem('barb-wire', 5200);

      addItem('grave-cross', 5275);

      addObject(TYPES.bunker, {
        x: 5632,
        isEnemy: true
      });

      // near-end / enemy territory

      addItem('palm-tree', 3932 + 32);

      addItem('tree', 3932 + 85);

      addItem('palm-tree', 3932 + 85 + 230);

      addItem('tree', 3932 + 85 + 230 + 90);

      addObject(TYPES.bunker, {
        x: 6656,
        isEnemy: true
      });

      addItem('tree', 6736);

      addItem('tree', 6800);

      addItem('palm-tree', 6888);

      addItem('gravestone', 7038);

      addItem('tree', 7070);

      addItem('gravestone', 7160);

      addItem('palm-tree', 7310);

      addItem('tree', 7325);

      addItem('flower', 7500);

      // more mid-level stuff

      addObject(TYPES.superBunker, {
        x: 4096 - 640 - 128,
        isEnemy: true,
        energy: 5
      });

      addObject(TYPES.turret, {
        x: 4096 - 640, // width of landing pad
        isEnemy: true,
        DOA: !!tutorialMode
      });

      addObject(TYPES.turret, {
        x: 4096 + 120, // width of landing pad
        isEnemy: true,
        DOA: !!tutorialMode
      });

      // vehicles!

      if (!winloc.match(/novehicles/i) && !tutorialMode) {

        // friendly units

        addObject(TYPES.van, {
          x: 192
        });

        for (i = 0; i < 5; i++) {

          addObject(TYPES.infantry, {
            x: 600 + (i * 20)
          });

        }

        addObject(TYPES.van, {
          x: 716
        });

        addObject(TYPES.tank, {
          x: 780
        });

        addObject(TYPES.tank, {
          x: 845
        });

        // first enemy convoy

        addObject(TYPES.tank, {
          x: 1536,
          isEnemy: true
        });

        addObject(TYPES.tank, {
          x: 1536 + 70,
          isEnemy: true
        });

        addObject(TYPES.tank, {
          x: 1536 + 140,
          isEnemy: true
        });

        addObject(TYPES.van, {
          x: 1536 + 210,
          isEnemy: true
        });

        addObject(TYPES.tank, {
          x: 2048 + 256,
          isEnemy: true
        });

        addObject(TYPES.tank, {
          x: 4608 + 256,
          isEnemy: true
        });

        for (i = 0; i < 5; i++) {

          // enemy infantry, way out there
          addObject(TYPES.infantry, {
            x: 5120 + (i * 20),
            isEnemy: true
          });

        }

      }

    }

    // happy little clouds!

    addObject(TYPES.cloud, {
      x: 512
    });

    addObject(TYPES.cloud, {
      x: 4096 - 256
    });

    addObject(TYPES.cloud, {
      x: 4096 + 256
    });

    addObject(TYPES.cloud, {
      x: 4096 + 512
    });

    addObject(TYPES.cloud, {
      x: 4096 + 768
    });

    // a few rogue balloons

    addObject(TYPES.balloon, {
      x: 4096 - 256,
      y: rng(worldHeight)
    });

    addObject(TYPES.balloon, {
      x: 4096 + 256,
      y: rng(worldHeight)
    });

    addObject(TYPES.balloon, {
      x: 4096 + 512,
      y: rng(worldHeight)
    });

    addObject(TYPES.balloon, {
      x: 4096 + 768,
      y: rng(worldHeight)
    });

    // enemy base signs (flipped via `extraTransform`)

    addItem('left-arrow-sign', 7700, 'scaleX(-1)');

    addItem('left-arrow-sign', 8192 + 16, 'scaleX(-1)');

    return;

  }
  */

  /**
   * Original game levels
   */

  if (levelName !== 'Custom Level' && !game.objects.editor) {

    if (levelName === 'Tutorial') {

      // happy little clouds!
      // all other default levels should have a bunch.
      for (var i = 0; i < 8; i++) {
        addObject(TYPES.cloud, {
          x: 2048 + (4096 * (i / 7))
        });
      }

    } else {

      // left base area...
      addItem('right-arrow-sign', -16);
      addItem('tree', 505);
      addItem('right-arrow-sign', 550);

      // right base area...
      addItem('left-arrow-sign', 7700, 'scaleX(-1)');
      addItem('left-arrow-sign', 8192 + 16, 'scaleX(-1)');

    }

  }

  function addOriginalLevel(data) {

    // if nothing is > 4096, then it's original game data; double all values.
    let multiplier = 2;

    data.forEach((item) => {
      if (item[item.length - 1] >= 4096) {
        multiplier = 1;
      }
    });

    const landingPadNames = {
      left: 'THE LANDING PAD',
      neutral: 'THE MIDWAY',
      right: 'THE DANGER ZONE'
    };

    const excludeVehicles = net.active && !gamePrefs.net_game_style.match(/coop/i);

    data.forEach((item) => {

      // terrain items only have two params.
      if (item.length === 2) {

        addItem(item[0], item[1]);

      } else {

        const args = {
          isEnemy: item[1] === 'right',
          hostile: item[1] === 'neutral',
          x: item[2] * multiplier
        };

        // special cases
        if (item[0] === TYPES.landingPad) {
          args.name = landingPadNames[item[1]];
          if (item[1] === 'neutral') {
            delete args.hostile;
            args.isMidway = true;
          }
        } else if (item[0] === TYPES.turret && item[1] === 'neutral') {
          // neutral turret = dead, DOA
          delete args.hostile;
          args.DOA = true;
        }

        // if a network game, only include CPU vehicles if playing co-op - i.e., vs. a CPU.
        if (excludeVehicles && item[0].match(/missile|tank|van|infantry|engineer/i)) return;

        addObject(item[0], args);

      }

    });
    
  }

  addOriginalLevel(originalLevels[level] || originalLevels[defaultLevel]);

}

const n = 'neutral',
l = 'left',
r = 'right';

originalLevels = {

  'Tutorial': [
    [ 'end-bunker', l, 8 ],
    [ 'base', l, 160 ],
    [ 'landing-pad', l, 300 ],
    [ 'cloud', 512 ],
    [ 'bunker', r, 1024 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 2048 ],
    [ 'bunker', l, 2560 ],
    [ 'bunker', l, 3072 ],
    [ 'super-bunker', r, 3328 ],
    [ 'landing-pad', l, 3806 ],
    [ 'balloon', l, 3840 ],
    [ 'cloud', 3840 ],
    [ 'balloon', l, 4352 ],
    [ 'cloud', 4352 ],
    [ 'balloon', l, 4608 ],
    [ 'bunker', r, 4608 ],
    [ 'cloud', 4608 ],
    [ 'balloon', l, 4864 ],
    [ 'cloud', 4864 ],
    [ 'bunker', r, 5120 ],
    [ 'bunker', r, 5632 ],
    [ 'bunker', r, 6656 ],
    [ 'landing-pad', l, 7800 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8144 ],
    [ 'right-arrow-sign', -48 ],
    [ 'tree', 660 ],
    [ 'tree', 2110 ],
    [ 'tree', 2460 ],
    [ 'tree', 2700 ],
    [ 'tree', 4608 ],
    [ 'tree', 4820 ],
    [ 'tree', 5110 ],
    [ 'tree', 4017 ],
    [ 'tree', 4337 ],
    [ 'tree', 6736 ],
    [ 'tree', 6800 ],
    [ 'tree', 7070 ],
    [ 'tree', 7325 ],
    [ 'palm-tree', 860 ],
    [ 'palm-tree', 1120 ],
    [ 'palm-tree', 1390 ],
    [ 'palm-tree', 1565 ],
    [ 'palm-tree', 2260 ],
    [ 'palm-tree', 3400 ],
    [ 'palm-tree', 3490 ],
    [ 'palm-tree', 4550 ],
    [ 'palm-tree', 4850 ],
    [ 'palm-tree', 3964 ],
    [ 'palm-tree', 4247 ],
    [ 'palm-tree', 6888 ],
    [ 'palm-tree', 7310 ],
    [ 'barb-wire', 918 ],
    [ 'barb-wire', 5200 ],
    [ 'rock2', 1280 ],
    [ 'flower', 1850 ],
    [ 'flower', 7500 ],
    [ 'gravestone', 2150 ],
    [ 'gravestone', 7038 ],
    [ 'gravestone', 7160 ],
    [ 'checkmark-grass', 4120 ],
    [ 'grave-cross', 4970 ],
    [ 'grave-cross', 5275 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    [ 'turret', n, 475 ],
    [ 'turret', n, 3456 ],
    [ 'turret', n, 4216 ]
  ],

  'demo 1': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 4000 ],
    [ 'base', r, 4084 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'turret', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'super-bunker', r, 2048 ],
    [ 'bunker', r, 2240 ],
    [ 'turret', r, 2560 ],
    [ 'bunker', r, 2816 ],
    [ 'bunker', r, 3072 ],
    [ 'turret', r, 3328 ]
  ],

  'demo 2': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'landing-pad', n, 2048 ],
    [ 'bunker', r, 994 ],
    [ 'super-bunker', r, 1024 ],
    [ 'bunker', r, 1054 ],
    [ 'turret', r, 984 ],
    [ 'turret', r, 1084 ],
    [ 'turret', l, 1536 ],
    [ 'turret', l, 1792 ],
    [ 'bunker', l, 1984 ],
    [ 'bunker', l, 1856 ],
    [ 'bunker', r, 2112 ],
    [ 'bunker', r, 2176 ],
    [ 'turret', r, 2304 ],
    [ 'turret', r, 2560 ],
    [ 'bunker', r, 3042 ],
    [ 'super-bunker', r, 3072 ],
    [ 'bunker', r, 3102 ],
    [ 'turret', r, 3032 ],
    [ 'turret', r, 3132 ]
  ],

  'demo 3': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'turret', l, 256 ],
    [ 'turret', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'super-bunker', l, 1024 ],
    [ 'turret', l, 1104 ],
    [ 'turret', l, 1136 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1792 ],
    [ 'turret', l, 2048 ],
    [ 'turret', l, 2016 ],
    [ 'turret', r, 2048 ],
    [ 'turret', r, 2080 ],
    [ 'super-bunker', r, 2304 ],
    [ 'super-bunker', r, 2384 ],
    [ 'bunker', r, 2560 ],
    [ 'bunker', r, 2816 ],
    [ 'super-bunker', r, 3072 ],
    [ 'turret', r, 2992 ],
    [ 'turret', r, 2960 ],
    [ 'turret', r, 3328 ],
    [ 'turret', r, 3584 ],
    [ 'turret', r, 3840 ]
  ],

  'demo 4': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 576 ],
    [ 'bunker', l, 640 ],
    [ 'turret', l, 1024 ],
    [ 'turret', l, 1040 ],
    [ 'bunker', l, 1280 ],
    [ 'turret', l, 1344 ],
    [ 'bunker', l, 1408 ],
    [ 'turret', l, 1536 ],
    [ 'turret', l, 1552 ],
    [ 'bunker', l, 1760 ],
    [ 'bunker', l, 1792 ],
    [ 'bunker', r, 2304 ],
    [ 'bunker', r, 2336 ],
    [ 'turret', r, 2544 ],
    [ 'turret', r, 2560 ],
    [ 'bunker', r, 2688 ],
    [ 'turret', r, 2752 ],
    [ 'bunker', r, 2816 ],
    [ 'turret', r, 3312 ],
    [ 'turret', r, 3328 ],
    [ 'bunker', r, 3456 ],
    [ 'turret', r, 3520 ],
    [ 'bunker', r, 3584 ]
  ],

  // Practice Battle #1
  /*
  'Cake Walk': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r , 4084 ],
    [ 'van', l, 80 ],
    [ 'infantry', l, 224 ],
    [ 'van', l, 256 ],
    [ 'tank', l, 288 ],
    [ 'tank', l, 320 ],
    [ 'tank', r, 768 ],
    [ 'tank', r, 800 ],
    [ 'tank', r, 832 ],
    [ 'van', r, 864 ],
    [ 'tank', r, 1344 ],
    [ 'tank', r, 2368 ],
    [ 'infantry', r, 2560 ],
    [ 'bunker', r, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1792 ],
    [ 'bunker', r, 2304 ],
    [ 'bunker', l, 2560 ],
    [ 'bunker', l, 2816 ],
    [ 'bunker', l, 3328 ]
  ],
  */

  // Based on PB #1: Boot Camp, Level 1 - Cake Walk
  'Cake Walk': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'infantry', l, 448 ],
    [ 'tank', l, 576 ],
    [ 'tank', l, 640 ],
    [ 'bunker', r, 1536 ],
    [ 'tank', r, 1536 ],
    [ 'tank', r, 1600 ],
    [ 'tank', r, 1664 ],
    [ 'bunker', l, 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'bunker', l, 2560 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'tank', r, 2688 ],
    [ 'bunker', l, 3072 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'bunker', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'balloon', l, 4096 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'bunker', r, 4608 ],
    [ 'tank', r, 4736 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', l, 5120 ],
    [ 'infantry', r, 5120 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'bunker', l, 5632 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'bunker', l, 6656 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    // [ 'right-arrow-sign', -16 ],
    // [ 'right-arrow-sign', 550 ],
    // [ 'tree', 505 ],
    [ 'tree', 2624 ],
    [ 'tree', 2976 ],
    [ 'tree', 4271 ],
    [ 'tree', 4607 ],
    [ 'tree', 4813 ],
    [ 'tree', 5110 ],
    [ 'tree', 6015 ],
    [ 'tree', 6332 ],
    [ 'tree', 6734 ],
    [ 'tree', 6796 ],
    [ 'tree', 7060 ],
    [ 'tree', 7348 ],
    // [ 'left-arrow-sign', 7700 ],
    // [ 'left-arrow-sign', 8208 ],
    [ 'palm-tree', 705 ],
    [ 'palm-tree', 1634 ],
    [ 'palm-tree', 1883 ],
    [ 'palm-tree', 2076 ],
    [ 'palm-tree', 2084 ],
    [ 'palm-tree', 2792 ],
    [ 'palm-tree', 3219 ],
    [ 'palm-tree', 3879 ],
    [ 'palm-tree', 3929 ],
    [ 'palm-tree', 4375 ],
    [ 'palm-tree', 4482 ],
    [ 'palm-tree', 4851 ],
    [ 'palm-tree', 5931 ],
    [ 'palm-tree', 6246 ],
    [ 'palm-tree', 6884 ],
    [ 'palm-tree', 7335 ],
    [ 'checkmark-grass', 1200 ],
    [ 'checkmark-grass', 4205 ],
    [ 'flowers', 1426 ],
    [ 'rock2', 1774 ],
    [ 'flower', 2361 ],
    [ 'gravestone', 2663 ],
    [ 'gravestone', 7029 ],
    [ 'gravestone', 7150 ],
    [ 'grave-cross', 4971 ],
    [ 'grave-cross', 5282 ],
    [ 'barb-wire', 5208 ],
    [ 'van', l, 160 ],
    [ 'van', l, 512 ],
    [ 'van', r, 1728 ]
  ],

  /*
  // Practice Battle #2
  'One-Gun': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'tank', l, 256 ],
    [ 'tank', l, 320 ],
    [ 'infantry', l, 128 ],
    [ 'van', l, 64 ],
    [ 'missile-launcher', l, 32 ],
    [ 'bunker', l, 384 ],
    [ 'bunker', l, 512 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1792 ],
    [ 'bunker', l, 1856 ],
    [ 'turret', r, 2048 ],
    [ 'bunker', r, 2240 ],
    [ 'bunker', r, 2304 ],
    [ 'bunker', r, 2560 ],
    [ 'bunker', r, 2816 ],
    [ 'bunker', r, 3072 ],
    [ 'bunker', r, 3584 ],
    [ 'bunker', r, 3712 ],
  ],
  */

  // Based On PB #2: Boot Camp, Level 2 - "One Gun"
  'One Gun': [
    [ 'end-bunker', l, 24 ],
    [ 'missile-launcher', l, 64 ],
    [ 'base', l, 192 ],
    [ 'infantry', l, 256 ],
    [ 'landing-pad', l, 320 ],
    [ 'tank', l, 512 ],
    [ 'tank', l, 640 ],
    [ 'bunker', l, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'bunker', l, 2560 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'bunker', l, 3072 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'bunker', l, 3584 ],
    [ 'bunker', l, 3712 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'balloon', l, 4096 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'bunker', r, 4480 ],
    [ 'balloon', l, 4608 ],
    [ 'bunker', r, 4608 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5120 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 5632 ],
    [ 'bunker', r, 6144 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'bunker', r, 7168 ],
    [ 'bunker', r, 7424 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'tree', 3493 ],
    [ 'tree', 3550 ],
    [ 'tree', 3643 ],
    [ 'tree', 3705 ],
    [ 'tree', 3710 ],
    [ 'tree', 3729 ],
    [ 'tree', 3873 ],
    [ 'tree', 4395 ],
    [ 'tree', 4614 ],
    [ 'tree', 4655 ],
    [ 'tree', 4739 ],
    [ 'tree', 4797 ],
    [ 'tree', 5189 ],
    [ 'tree', 5264 ],
    [ 'tree', 5771 ],
    [ 'tree', 6522 ],
    [ 'tree', 6722 ],
    [ 'palm-tree', 490 ],
    [ 'palm-tree', 1918 ],
    [ 'palm-tree', 2960 ],
    [ 'palm-tree', 3015 ],
    [ 'palm-tree', 3139 ],
    [ 'palm-tree', 3187 ],
    [ 'palm-tree', 3194 ],
    [ 'palm-tree', 3789 ],
    [ 'palm-tree', 3965 ],
    [ 'palm-tree', 4135 ],
    [ 'palm-tree', 4149 ],
    [ 'palm-tree', 4211 ],
    [ 'palm-tree', 4328 ],
    [ 'palm-tree', 4387 ],
    [ 'palm-tree', 4872 ],
    [ 'palm-tree', 4918 ],
    [ 'palm-tree', 5106 ],
    [ 'palm-tree', 5190 ],
    [ 'palm-tree', 5231 ],
    [ 'palm-tree', 5264 ],
    [ 'barb-wire', 1129 ],
    [ 'barb-wire', 4824 ],
    [ 'checkmark-grass', 2537 ],
    [ 'sand-dunes', 2924 ],
    [ 'sand-dune', 2961 ],
    [ 'cactus', 4454 ],
    [ 'cactus2', 6793 ],
    [ 'van', l, 128 ],
    [ 'turret', r, 4096 ]
  ],

  /*
  // Practice Battle #3
  'Sucker Punch': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'turret', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1920 ],
    [ 'bunker', r, 2176 ],
    [ 'turret', r, 2560 ],
    [ 'turret', r, 2816 ],
    [ 'bunker', r, 3072 ],
    [ 'turret', r, 3328 ],
    [ 'bunker', r, 3584 ]
  ],
  */

  // Based On PB #3: Boot Camp, Level 3 - "Sucker Punch"
  'Sucker Punch': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'bunker', l, 3072 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'bunker', l, 3840 ],
    [ 'balloon', l, 4096 ],
    [ 'bunker', r, 4352 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5120 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 6144 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'bunker', r, 7168 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    */
    // [ 'tree', 505 ],
    /*
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'sand-dunes', 601 ],
    [ 'sand-dunes', 816 ],
    [ 'sand-dunes', 1048 ],
    [ 'sand-dunes', 3789 ],
    [ 'sand-dunes', 4267 ],
    [ 'sand-dunes', 4533 ],
    [ 'sand-dunes', 4690 ],
    [ 'sand-dunes', 4906 ],
    [ 'sand-dunes', 5160 ],
    [ 'sand-dunes', 5754 ],
    [ 'cactus2', 636 ],
    [ 'cactus2', 1892 ],
    [ 'cactus2', 1951 ],
    [ 'cactus2', 2286 ],
    [ 'cactus2', 2481 ],
    [ 'cactus2', 6187 ],
    [ 'cactus2', 6670 ],
    [ 'sand-dune', 1413 ],
    [ 'sand-dune', 2243 ],
    [ 'sand-dune', 4236 ],
    [ 'sand-dune', 4423 ],
    [ 'sand-dune', 5002 ],
    [ 'sand-dune', 5476 ],
    [ 'sand-dune', 6487 ],
    [ 'sand-dune', 6596 ],
    [ 'sand-dune', 6985 ],
    [ 'sand-dune', 7054 ],
    [ 'cactus', 1750 ],
    [ 'cactus', 6063 ],
    [ 'cactus', 6457 ],
    [ 'gravestone', 3761 ],
    [ 'gravestone', 3905 ],
    [ 'gravestone', 4062 ],
    [ 'gravestone', 4139 ],
    [ 'gravestone', 4197 ],
    [ 'grave-cross', 4043 ],
    [ 'grave-cross', 4088 ],
    [ 'grave-cross', 4354 ],
    [ 'grave-cross', 4395 ],
    [ 'grave-cross', 4487 ],
    [ 'barb-wire', 6066 ],
    [ 'turret', l, 1536 ],
    [ 'turret', l, 2560 ],
    [ 'turret', r, 5632 ],
    [ 'turret', r, 6678 ]
  ],

  /*
  // Practice Battle #4
  'Airborne': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'bunker', l, 960 ],
    [ 'bunker', l, 1280 ],
    [ 'turret', l, 1344 ],
    [ 'bunker', l, 1408 ],
    [ 'super-bunker', n, 2048 ],
    [ 'bunker', r, 2688 ],
    [ 'turret', r, 2752 ],
    [ 'bunker', r, 2816 ],
    [ 'bunker', r, 3136 ],
    [ 'turret', r, 3328 ],
    [ 'bunker', r, 3584 ]
  ],
  */

  // Based On PB #4: Boot Camp, Level 4 - "Airborne"
  'Airborne': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 1920 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'bunker', l, 2560 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'bunker', l, 2816 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'balloon', l, 4096 ],
    [ 'super-bunker', l, 4096 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5376 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 5632 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'bunker', r, 6272 ],
    [ 'bunker', r, 7168 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    */
    // [ 'tree', 505 ],
    [ 'tree', 561 ],
    [ 'tree', 1265 ],
    [ 'tree', 2260 ],
    [ 'tree', 3199 ],
    [ 'tree', 3288 ],
    [ 'tree', 4144 ],
    [ 'tree', 5074 ],
    [ 'tree', 6550 ],
    [ 'tree', 7732 ],
    /*
    [ 'left-arrow-sign', 7661 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'palm-tree', 744 ],
    [ 'palm-tree', 853 ],
    [ 'palm-tree', 1658 ],
    [ 'palm-tree', 1673 ],
    [ 'palm-tree', 2018 ],
    [ 'palm-tree', 2700 ],
    [ 'palm-tree', 2823 ],
    [ 'palm-tree', 2992 ],
    [ 'palm-tree', 4003 ],
    [ 'palm-tree', 4530 ],
    [ 'palm-tree', 5082 ],
    [ 'palm-tree', 5238 ],
    [ 'palm-tree', 6307 ],
    [ 'palm-tree', 6496 ],
    [ 'palm-tree', 6590 ],
    [ 'palm-tree', 7420 ],
    [ 'palm-tree', 7432 ],
    [ 'palm-tree', 7604 ],
    [ 'palm-tree', 7625 ],
    [ 'palm-tree', 6967 ],
    [ 'palm-tree', 7046 ],
    [ 'flower', 1117 ],
    [ 'flower-bush', 1869 ],
    [ 'flower-bush', 2517 ],
    [ 'grave-cross', 2672 ],
    [ 'grave-cross', 3480 ],
    [ 'grave-cross', 6195 ],
    [ 'checkmark-grass', 4335 ],
    [ 'barb-wire', 4405 ],
    [ 'barb-wire', 5814 ],
    [ 'gravestone', 5828 ],
    [ 'gravestone', 7159 ],
    [ 'grass', 1918 ],
    [ 'grass', 2884 ],
    [ 'turret', l, 1536 ],
    [ 'turret', l, 2688 ],
    [ 'turret', r, 5517 ]
  ],

  /*
  'Two-Gun': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'turret', l, 256 ],
    [ 'bunker', l, 320 ],
    [ 'bunker', l, 576 ],
    [ 'bunker', l, 640 ],
    [ 'super-bunker', r, 872 ],
    [ 'turret', r, 920 ],
    [ 'turret', r, 952 ],
    [ 'bunker', r, 1984 ],
    [ 'bunker', r, 2016 ],
    [ 'turret', r, 2048 ],
    [ 'turret', r, 2064 ],
    [ 'bunker', r, 2112 ],
    [ 'bunker', r, 3072 ],
    [ 'bunker', r, 3104 ],
    [ 'super-bunker', r, 3176 ],
    [ 'turret', r, 3224 ],
    [ 'turret', r, 3256 ],
    [ 'bunker', r, 3520 ],
    [ 'tank', r, 2368 ],
    [ 'infantry', r, 2408 ],
    [ 'tank', r, 2488 ],
    [ 'infantry', r, 2528 ],
    [ 'tank', r, 2568 ],
    [ 'tank', r, 2608 ],
    [ 'tank', r, 3392 ],
    [ 'infantry', r, 3432 ],
    [ 'tank', r, 3512 ],
    [ 'infantry', r, 3552 ],
    [ 'missile-launcher', r, 3592 ],
    [ 'van', r, 3617 ],
    [ 'van', r, 3840 ],
    [ 'van', r, 3872 ]
  ],
  */

  // "Two-Gun"
  'Two-Gun': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'bunker', l, 640 ],
    [ 'bunker', l, 1152 ],
    [ 'bunker', l, 1280 ],
    [ 'super-bunker', r, 1744 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'bunker', r, 3968 ],
    [ 'bunker', r, 4032 ],
    [ 'balloon', l, 4096 ],
    [ 'bunker', r, 4224 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'tank', r, 4736 ],
    [ 'infantry', r, 4816 ],
    [ 'cloud', 4973 ],
    [ 'tank', r, 4976 ],
    [ 'infantry', r, 5056 ],
    [ 'tank', r, 5136 ],
    [ 'tank', r, 5216 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 6144 ],
    [ 'cloud', 6144 ],
    [ 'bunker', r, 6208 ],
    [ 'super-bunker', r, 6352 ],
    [ 'tank', r, 6784 ],
    [ 'infantry', r, 6864 ],
    [ 'tank', r, 7024 ],
    [ 'bunker', r, 7040 ],
    [ 'infantry', r, 7104 ],
    [ 'missile-launcher', r, 7184 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 568 ],
    [ 'left-arrow-sign', 7669 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'palm-tree', 751 ],
    [ 'palm-tree', 3799 ],
    [ 'palm-tree', 3827 ],
    [ 'palm-tree', 5295 ],
    [ 'cactus2', 776 ],
    [ 'cactus2', 2614 ],
    [ 'cactus2', 6617 ],
    [ 'cactus2', 7304 ],
    [ 'cactus2', 7512 ],
    [ 'checkmark-grass', 749 ],
    [ 'checkmark-grass', 1934 ],
    [ 'checkmark-grass', 4555 ],
    [ 'cactus', 989 ],
    [ 'cactus', 1698 ],
    [ 'cactus', 2143 ],
    [ 'cactus', 3876 ],
    [ 'cactus', 3984 ],
    [ 'cactus', 4478 ],
    [ 'flower-bush', 1314 ],
    [ 'tree', 1456 ],
    [ 'tree', 4107 ],
    [ 'tree', 4776 ],
    [ 'tree', 5459 ],
    [ 'tree', 6108 ],
    [ 'tree', 7170 ],
    [ 'tree', 7669 ],
    [ 'grave-cross', 1526 ],
    [ 'grave-cross', 5776 ],
    [ 'grave-cross', 6120 ],
    [ 'grave-cross', 6568 ],
    [ 'sand-dunes', 1745 ],
    [ 'sand-dunes', 4555 ],
    [ 'sand-dunes', 6273 ],
    [ 'sand-dune', 2343 ],
    [ 'sand-dune', 4776 ],
    [ 'sand-dune', 5447 ],
    [ 'sand-dune', 6323 ],
    [ 'sand-dune', 6347 ],
    [ 'gravestone', 2680 ],
    [ 'barb-wire', 4892 ],
    [ 'grass', 6041 ],
    [ 'flowers', 6162 ],
    [ 'flower', 7049 ],
    [ 'turret', l, 534 ],
    [ 'turret', r, 1857 ],
    [ 'turret', r, 4108 ],
    [ 'turret', r, 6466 ],
    [ 'van', r, 7234 ],
    [ 'van', r, 7680 ],
    [ 'van', r, 7744 ]
  ],

  /*
  'Super Bunker': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', r, 512 ],
    [ 'turret', r, 824 ],
    [ 'turret', r, 840 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1984 ],
    [ 'turret', r, 2023 ],
    [ 'super-bunker', r, 2048 ],
    [ 'turret', r, 2091 ],
    [ 'bunker', r, 2112 ],
    [ 'turret', r, 3128 ],
    [ 'turret', r, 3144 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3280 ],
    [ 'infantry', r, 3328 ],
    [ 'bunker', r, 3584 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 808 ],
    [ 'tank', r, 888 ],
    [ 'infantry', r, 928 ],
    [ 'missile-launcher', r, 968 ],
    [ 'van', r, 993 ],
    [ 'tank', r, 2048 ],
    [ 'infantry', r, 2088 ],
    [ 'tank', r, 2168 ],
    [ 'infantry', r, 2208 ],
    [ 'tank', r, 2248 ],
    [ 'tank', r, 2288 ],
    // [ ??? (241), r, 2112 ],
    [ 'infantry', r, 3328 ],
    // [ ??? (241), r, 3408 ],
    [ 'missile-launcher', r, 3488 ],
    [ 'tank', r, 2560 ],
    [ 'infantry', r, 2600 ],
    [ 'infantry', r, 2680 ],
    [ 'missile-launcher', r, 2760 ],
    // [ ??? (241), r, 2785 ],
    [ 'van', r, 2865 ],
    [ 'missile-launcher', r, 1648 ],
    [ 'missile-launcher', r, 2048 ]
  ],
  */

  // "Super Bunker"
  'Super Bunker': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'bunker', r, 1024 ],
    [ 'tank', r, 1536 ],
    [ 'infantry', r, 1616 ],
    [ 'tank', r, 1776 ],
    [ 'super-bunker', r, 1792 ],
    [ 'infantry', r, 1856 ],
    [ 'missile-launcher', r, 1936 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 3218 ],
    [ 'missile-launcher', r, 3296 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'bunker', r, 3968 ],
    [ 'balloon', l, 4096 ],
    [ 'missile-launcher', r, 4096 ],
    [ 'super-bunker', r, 4096 ],
    [ 'tank', r, 4096 ],
    [ 'infantry', r, 4176 ],
    [ 'bunker', r, 4224 ],
    [ 'tank', r, 4336 ],
    [ 'cloud', 4388 ],
    [ 'infantry', r, 4416 ],
    [ 'tank', r, 4496 ],
    [ 'tank', r, 4576 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'tank', r, 5120 ],
    [ 'infantry', r, 5200 ],
    [ 'infantry', r, 5360 ],
    [ 'missile-launcher', r, 5520 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 6144 ],
    [ 'super-bunker', r, 6400 ],
    [ 'infantry', r, 6656 ],
    [ 'infantry', r, 6656 ],
    [ 'missile-launcher', r, 6976 ],
    [ 'bunker', r, 7168 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 566 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'palm-tree', 1760 ],
    [ 'palm-tree', 3862 ],
    [ 'palm-tree', 3892 ],
    [ 'palm-tree', 3961 ],
    [ 'palm-tree', 4356 ],
    [ 'palm-tree', 4531 ],
    [ 'palm-tree', 4551 ],
    [ 'palm-tree', 3453 ],
    [ 'palm-tree', 3398 ],
    [ 'palm-tree', 3327 ],
    [ 'palm-tree', 3405 ],
    [ 'palm-tree', 3073 ],
    [ 'palm-tree', 4820 ],
    [ 'palm-tree', 4825 ],
    [ 'palm-tree', 4855 ],
    [ 'palm-tree', 4900 ],
    [ 'palm-tree', 4927 ],
    [ 'palm-tree', 5074 ],
    [ 'palm-tree', 5232 ],
    [ 'palm-tree', 5303 ],
    [ 'cactus', 2074 ],
    [ 'cactus', 2995 ],
    [ 'cactus', 7066 ],
    [ 'grass', 2205 ],
    [ 'tree', 4074 ],
    [ 'tree', 4650 ],
    [ 'tree', 4657 ],
    [ 'tree', 3681 ],
    [ 'tree', 3391 ],
    [ 'tree', 3379 ],
    [ 'tree', 3336 ],
    [ 'tree', 3268 ],
    [ 'tree', 3227 ],
    [ 'tree', 3237 ],
    [ 'tree', 3116 ],
    [ 'tree', 4695 ],
    [ 'tree', 4733 ],
    [ 'tree', 4776 ],
    [ 'tree', 4871 ],
    [ 'tree', 4958 ],
    [ 'tree', 5023 ],
    [ 'tree', 5224 ],
    [ 'tree', 5260 ],
    [ 'tree', 5974 ],
    [ 'tree', 6782 ],
    [ 'gravestone', 4783 ],
    [ 'checkmark-grass', 5982 ],
    [ 'turret', r, 1667 ],
    [ 'turret', r, 1897 ],
    [ 'van', r, 1986 ],
    [ 'turret', r, 4165 ],
    [ 'van', r, 5730 ],
    [ 'turret', r, 6288 ],
    [ 'turret', r, 6513 ]
  ],

  /*
  'Scrapyard': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', r, 512 ],
    [ 'bunker', r, 768 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1024 ],
    [ 'bunker', r, 1536 ],
    [ 'turret', r, 1600 ],
    [ 'turret', r, 1616 ],
    [ 'turret', r, 1632 ],
    [ 'bunker', r, 2016 ],
    [ 'bunker', r, 2080 ],
    [ 'bunker', r, 2560 ],
    [ 'turret', r, 2896 ],
    [ 'turret', r, 2912 ],
    [ 'turret', r, 2928 ],
    [ 'bunker', r, 3072 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3280 ],
    [ 'bunker', r, 3584 ],
    [ 'tank', r, 384 ],
    [ 'infantry', r, 424 ],
    [ 'tank', r, 504 ],
    [ 'infantry', r, 544 ],
    [ 'tank', r, 584 ],
    [ 'tank', r, 624 ],
    [ 'infantry', r, 1280 ],
    // [ ??? (241), r, 1360 ],
    [ 'missile-launcher', r, 1440 ],
    [ 'tank', r, 3072 ],
    [ 'infantry', r, 3112 ],
    [ 'tank', r, 3192 ],
    [ 'infantry', r, 3232 ],
    [ 'van', r, 3297 ],
    [ 'van', r, 504 ],
    [ 'van', r, 584 ],
    [ 'missile-launcher', r, 512 ],
    [ 'missile-launcher', r, 768],
    [ 'missile-launcher', r, 1024 ],
    [ 'missile-launcher', r, 1280 ],
    [ 'missile-launcher', r, 2048 ]
  ],
  */

  // "Scrapyard"
  'Scrapyard': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 848 ],
    [ 'tank', r, 1008 ],
    [ 'bunker', r, 1024 ],
    [ 'missile-launcher', r, 1024 ],
    [ 'infantry', r, 1088 ],
    [ 'tank', r, 1168 ],
    [ 'tank', r, 1248 ],
    [ 'bunker', r, 1536 ],
    [ 'missile-launcher', r, 1536 ],
    [ 'super-bunker', r, 1792 ],
    [ 'bunker', r, 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'missile-launcher', r, 2048 ],
    [ 'infantry', r, 2560 ],
    [ 'missile-launcher', r, 2560 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'missile-launcher', r, 2880 ],
    [ 'bunker', r, 3072 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'bunker', r, 4032 ],
    [ 'balloon', l, 4096 ],
    [ 'missile-launcher', r, 4096 ],
    [ 'bunker', r, 4160 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5120 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 6144 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'tank', r, 6144 ],
    [ 'infantry', r, 6224 ],
    [ 'tank', r, 6384 ],
    [ 'super-bunker', r, 6400 ],
    [ 'infantry', r, 6464 ],
    [ 'bunker', r, 7168 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', 550 ],
    [ 'right-arrow-sign', -16 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    [ 'left-arrow-sign', 7637 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'tree', 3518 ],
    [ 'sand-dunes', 1063 ],
    [ 'sand-dunes', 1643 ],
    [ 'sand-dunes', 1686 ],
    [ 'sand-dunes', 1615 ],
    [ 'sand-dunes', 2108 ],
    [ 'sand-dunes', 2913 ],
    [ 'sand-dunes', 3960 ],
    [ 'sand-dunes', 5379 ],
    [ 'sand-dunes', 5672 ],
    [ 'sand-dunes', 6508 ],
    [ 'sand-dunes', 7526 ],
    [ 'sand-dunes', 3796 ],
    [ 'cactus2', 1678 ],
    [ 'cactus2', 2530 ],
    [ 'cactus2', 6334 ],
    [ 'cactus2', 6612 ],
    [ 'cactus2', 6699 ],
    [ 'cactus', 1945 ],
    [ 'cactus', 2457 ],
    [ 'cactus', 5793 ],
    [ 'cactus', 6415 ],
    [ 'cactus', 7023 ],
    [ 'sand-dune', 2810 ],
    [ 'sand-dune', 4747 ],
    [ 'sand-dune', 5297 ],
    [ 'sand-dune', 5582 ],
    [ 'sand-dune', 7504 ],
    [ 'sand-dune', 7518 ],
    [ 'sand-dune', 2087 ],
    [ 'gravestone', 4022 ],
    [ 'gravestone', 4175 ],
    [ 'gravestone', 4294 ],
    [ 'gravestone', 4321 ],
    [ 'gravestone', 3858 ],
    [ 'grave-cross', 3909 ],
    [ 'grave-cross', 4289 ],
    [ 'grave-cross', 4508 ],
    [ 'grave-cross', 3829 ],
    [ 'grave-cross', 3958 ],
    [ 'van', r, 1008 ],
    [ 'van', r, 1168 ],
    [ 'turret', r, 1913 ],
    [ 'turret', r, 3210 ],
    [ 'turret', r, 5802 ],
    [ 'van', r, 6594 ]
  ],

  /*
  'Blind Spot': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1760 ],
    [ 'turret', r, 1792 ],
    [ 'turret', r, 1808 ],
    [ 'bunker', r, 2176 ],
    [ 'bunker', r, 2656 ],
    [ 'turret', r, 2688 ],
    [ 'turret', r, 2704 ],
    [ 'bunker', r, 2816 ],
    [ 'bunker', r, 2848 ],
    [ 'bunker', r, 3328 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3304 ],
    [ 'infantry', r, 3328 ],
    [ 'bunker', r, 3264 ],
    [ 'turret', r, 3584 ],
    [ 'turret', r, 3600 ],
    [ 'tank', r, 512 ],
    [ 'infantry', r, 552 ],
    [ 'infantry', r, 632 ],
    [ 'missile-launcher', r, 712 ],
    // [ ??? (241), r, 737 ],
    [ 'van', r, 817 ],
    [ 'infantry', r, 1280 ],
    // [ ??? (241), r, 1360 ],
    [ 'missile-launcher', r, 1440 ],
    [ 'tank', r, 3584 ],
    [ 'infantry', r, 3624 ],
    [ 'tank', r, 3704 ],
    [ 'infantry', r, 3744 ],
    [ 'tank', r, 3784 ],
    [ 'tank', r, 3824 ],
    [ 'tank', r, 3072 ],
    [ 'infantry', r, 3112 ],
    [ 'tank', r, 3192 ],
    [ 'infantry', r, 3232 ],
    [ 'missile-launcher', r, 3272 ],
    [ 'van', r, 3297 ],
    [ 'missile-launcher', r, 512 ]
  ],
  */

  // "Blind Spot"
  'Blind Spot': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'missile-launcher', r, 1024 ],
    [ 'tank', r, 1024 ],
    [ 'infantry', r, 1104 ],
    [ 'infantry', r, 1264 ],
    [ 'missile-launcher', r, 1424 ],
    [ 'super-bunker', r, 1792 ],
    [ 'cloud', 2048 ],
    [ 'infantry', r, 2560 ],
    [ 'cloud', 2633 ],
    [ 'missile-launcher', r, 2880 ],
    [ 'cloud', 3218 ],
    [ 'bunker', r, 3520 ],
    [ 'balloon', l, 3584 ],
    [ 'cloud', 3803 ],
    [ 'balloon', l, 4096 ],
    [ 'bunker', r, 4352 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5312 ],
    [ 'cloud', 5558 ],
    [ 'bunker', r, 5632 ],
    [ 'bunker', r, 5696 ],
    [ 'cloud', 6144 ],
    [ 'tank', r, 6144 ],
    [ 'infantry', r, 6224 ],
    [ 'tank', r, 6384 ],
    [ 'super-bunker', r, 6400 ],
    [ 'infantry', r, 6464 ],
    [ 'bunker', r, 6528 ],
    [ 'missile-launcher', r, 6544 ],
    [ 'bunker', r, 6656 ],
    [ 'infantry', r, 6656 ],
    [ 'tank', r, 7171 ],
    [ 'infantry', r, 7248 ],
    [ 'tank', r, 7408 ],
    [ 'infantry', r, 7488 ],
    [ 'tank', r, 7568 ],
    [ 'tank', r, 7648 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    [ 'left-arrow-sign', 7651 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'palm-tree', 734 ],
    [ 'palm-tree', 976 ],
    [ 'palm-tree', 2452 ],
    [ 'palm-tree', 3016 ],
    [ 'palm-tree', 3106 ],
    [ 'palm-tree', 3504 ],
    [ 'palm-tree', 4072 ],
    [ 'palm-tree', 4106 ],
    [ 'palm-tree', 4842 ],
    [ 'palm-tree', 5506 ],
    [ 'palm-tree', 5697 ],
    [ 'palm-tree', 6182 ],
    [ 'palm-tree', 6413 ],
    [ 'palm-tree', 6872 ],
    [ 'palm-tree', 7308 ],
    [ 'palm-tree', 7599 ],
    [ 'flower-bush', 1031 ],
    [ 'flower-bush', 1828 ],
    [ 'flower-bush', 3921 ],
    [ 'grave-cross', 1235 ],
    [ 'grave-cross', 6191 ],
    [ 'grave-cross', 6462 ],
    [ 'grave-cross', 6574 ],
    [ 'tree', 1606 ],
    [ 'tree', 1590 ],
    [ 'tree', 2060 ],
    [ 'tree', 2733 ],
    [ 'tree', 3301 ],
    [ 'tree', 3689 ],
    [ 'tree', 4073 ],
    [ 'tree', 4729 ],
    [ 'tree', 4846 ],
    [ 'tree', 5029 ],
    [ 'tree', 5075 ],
    [ 'tree', 5443 ],
    [ 'tree', 6111 ],
    [ 'flower', 3604 ],
    [ 'barb-wire', 3697 ],
    [ 'barb-wire', 6518 ],
    [ 'checkmark-grass', 3788 ],
    [ 'gravestone', 4976 ],
    [ 'rock', 6933 ],
    [ 'van', r, 1634 ],
    [ 'turret', r, 1908 ],
    [ 'turret', r, 3600 ],
    [ 'turret', r, 5392 ],
    [ 'turret', r, 6510 ],
    [ 'van', r, 6594 ],
    [ 'turret', r, 6608 ],
    [ 'turret', r, 7175 ]
  ],

  /*
  'Wasteland': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', n, 2048 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', r, 320 ],
    [ 'turret', 4, 480 ],
    [ 'turret', 4, 496 ],
    [ 'bunker', r, 576 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1600 ],
    [ 'bunker', r, 1984 ],
    [ 'bunker', r, 2112 ],
    [ 'bunker', r, 2624 ],
    [ 'bunker', r, 3008 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3280 ],
    [ 'bunker', r, 3328 ],
    [ 'bunker', r, 3392 ],
    [ 'turret', r, 3648 ],
    [ 'tank', r, 640 ],
    [ 'infantry', r, 680 ],
    [ 'tank', r, 760 ],
    [ 'infantry', r, 800 ],
    [ 'missile-launcher', r, 840 ],
    [ 'van', r, 865 ],
    [ 'infantry', r, 1280 ],
    // [ ??? (241), r, 1360 ],
    [ 'missile-launcher', r, 1440 ],
    [ 'tank', r, 1360 ],
    [ 'infantry', r, 1400 ],
    [ 'tank', r, 1480 ],
    [ 'infantry', r, 1520 ],
    [ 'tank', r, 1560 ],
    [ 'tank', r, 1600 ],
    [ 'tank', r, 1792 ],
    [ 'infantry', r, 1832 ],
    [ 'tank', r, 1912 ],
    [ 'infantry', r, 1952 ],
    [ 'missile-launcher', r, 1992 ],
    [ 'van', r, 2017 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 808 ],
    [ 'infantry', r, 888 ],
    [ 'missile-launcher', r, 968 ],
    // [ ??? (241), r, 993 ],
    [ 'van', r, 1073 ]
  ],
  */

  // "Wasteland"
  'Wasteland': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'bunker', r, 640 ],
    [ 'bunker', r, 1152 ],
    [ 'tank', r, 1280 ],
    [ 'infantry', r, 1360 ],
    [ 'tank', r, 1520 ],
    [ 'tank', r, 1536 ],
    [ 'infantry', r, 1600 ],
    [ 'infantry', r, 1616 ],
    [ 'missile-launcher', r, 1680 ],
    [ 'infantry', r, 1776 ],
    [ 'super-bunker', r, 1792 ],
    [ 'missile-launcher', r, 1936 ],
    [ 'cloud', 2048 ],
    [ 'cloud', 2048 ],
    [ 'infantry', r, 2560 ],
    [ 'cloud', 2633 ],
    [ 'cloud', 2633 ],
    [ 'tank', r, 2720 ],
    [ 'infantry', r, 2800 ],
    [ 'missile-launcher', r, 2880 ],
    [ 'tank', r, 2960 ],
    [ 'infantry', r, 3040 ],
    [ 'tank', r, 3120 ],
    [ 'bunker', r, 3200 ],
    [ 'tank', r, 3200 ],
    [ 'cloud', 3218 ],
    [ 'cloud', 3218 ],
    [ 'balloon', l, 3584 ],
    [ 'tank', r, 3584 ],
    [ 'infantry', r, 3663 ],
    [ 'cloud', 3803 ],
    [ 'cloud', 3803 ],
    [ 'tank', r, 3824 ],
    [ 'infantry', r, 3904 ],
    [ 'bunker', r, 3968 ],
    [ 'missile-launcher', r, 3984 ],
    [ 'landing-pad', n, 4092 ],
    [ 'balloon', l, 4096 ],
    [ 'bunker', r, 4224 ],
    [ 'cloud', 4388 ],
    [ 'cloud', 4388 ],
    [ 'balloon', l, 4608 ],
    [ 'cloud', 4973 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5248 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 6144 ],
    [ 'cloud', 6144 ],
    [ 'super-bunker', r, 6400 ],
    [ 'bunker', r, 6656 ],
    [ 'bunker', r, 6784 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 550 ],
    [ 'tree', 505 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    [ 'left-arrow-sign', 7654 ],
    [ 'left-arrow-sign', 8208 ],
    */
    [ 'sand-dunes', 2618 ],
    [ 'sand-dunes', 3814 ],
    [ 'sand-dunes', 6126 ],
    [ 'gravestone', 2542 ],
    [ 'gravestone', 1676 ],
    [ 'gravestone', 3345 ],
    [ 'gravestone', 4191 ],
    [ 'gravestone', 4611 ],
    [ 'gravestone', 5011 ],
    [ 'gravestone', 5150 ],
    [ 'gravestone', 5250 ],
    [ 'gravestone', 5335 ],
    [ 'gravestone', 5530 ],
    [ 'gravestone', 5620 ],
    [ 'gravestone', 5819 ],
    [ 'gravestone', 6085 ],
    [ 'gravestone', 6915 ],
    [ 'gravestone', 7115 ],
    [ 'gravestone', 7524 ],
    [ 'cactus2', 3371 ],
    [ 'cactus2', 5068 ],
    [ 'cactus2', 6338 ],
    [ 'cactus2', 6862 ],
    [ 'cactus2', 7416 ],
    [ 'cactus2', 7427 ],
    [ 'cactus2', 883 ],
    [ 'grave-cross', 3662 ],
    [ 'grave-cross', 4178 ],
    [ 'grave-cross', 4643 ],
    [ 'grave-cross', 4836 ],
    [ 'grave-cross', 5172 ],
    [ 'grave-cross', 5763 ],
    [ 'grave-cross', 6803 ],
    [ 'grave-cross', 7270 ],
    [ 'grave-cross', 7663 ],
    [ 'grave-cross', 871 ],
    [ 'grave-cross', 1254 ],
    [ 'sand-dune', 3629 ],
    [ 'sand-dune', 4178 ],
    [ 'sand-dune', 4715 ],
    [ 'checkmark-grass', 4219 ],
    [ 'cactus', 4308 ],
    [ 'cactus', 7227 ],
    [ 'cactus', 1294 ],
    [ 'turret', l, 967 ],
    [ 'van', r, 1730 ],
    [ 'turret', r, 1897 ],
    [ 'turret', r, 1952 ],
    [ 'van', r, 2146 ],
    [ 'van', r, 4034 ],
    [ 'turret', r, 6518 ]
  ],

  /*
  'Midnight Oasis': [
    // this seems like a bug.
    // [ 'infantry', r, 21 ],
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', n, 2048 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 960 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1344 ],
    [ 'bunker', r, 1664 ],
    [ 'bunker', r, 2000 ],
    [ 'turret', r, 2112 ],
    [ 'turret', r, 2128 ],
    [ 'turret', r, 2144 ],
    [ 'super-bunker', r, 2304 ],
    [ 'super-bunker', r, 2456 ],
    [ 'turret', r, 2352 ],
    [ 'turret', r, 2368 ],
    [ 'turret', r, 2384 ],
    [ 'bunker', r, 2560 ],
    [ 'turret', r, 2624 ],
    [ 'turret', r, 2640 ],
    [ 'turret', r, 2656 ],
    [ 'bunker', r, 2752 ],
    [ 'turret', r, 2816 ],
    [ 'turret', r, 2832 ],
    [ 'turret', r, 2848 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3264 ],
    [ 'turret', r, 3280 ],
    [ 'tank', r, 384 ],
    [ 'infantry', r, 424 ],
    [ 'tank', r, 504 ],
    [ 'infantry', r, 544 ],
    [ 'missile-launcher', r, 584 ],
    [ 'van', r, 609 ],
    [ 'tank', r, 352 ],
    [ 'infantry', r, 392 ],
    [ 'tank', r, 472 ],
    [ 'infantry', r, 512 ],
    [ 'tank', r, 552 ],
    [ 'tank', r, 592 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 808 ],
    [ 'infantry', r, 888 ],
    [ 'missile-launcher', r, 968 ],
    // [ ??? (241), 4, 993 ]
    [ 'van', r, 1073 ],
    [ 'infantry', r, 1280 ],
    // [ ??? (241), r, 1360 ],
    [ 'tank', r, 1360 ],
    [ 'infantry', r, 1400 ],
    [ 'tank', r, 1480 ],
    [ 'infantry', r, 1520 ],
    [ 'tank', r, 1560 ],
    [ 'tank', r, 1600 ],
    [ 'tank', r, 1792 ],
    [ 'tank', r, 1832 ],
    [ 'infantry', r, 1952 ],
    [ 'missile-launcher', r, 1992 ],
    [ 'van', r, 2017 ],
    [ 'infantry', r, 2048 ],
    // [ '??? (241)', r, 2128 ],
    [ 'missile-launcher', r, 2208 ]
  ],
  */

  // "Midnight Oasis"
  'Midnight Oasis': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', l, 320 ],
    [ 'tank', r, 704 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 784 ],
    [ 'infantry', r, 848 ],
    [ 'tank', r, 944 ],
    [ 'tank', r, 1008 ],
    [ 'infantry', r, 1024 ],
    [ 'infantry', r, 1088 ],
    [ 'tank', r, 1104 ],
    [ 'missile-launcher', r, 1168 ],
    [ 'tank', r, 1184 ],
    [ 'tank', r, 1536 ],
    [ 'infantry', r, 1616 ],
    [ 'infantry', r, 1776 ],
    [ 'super-bunker', r, 1792 ],
    [ 'missile-launcher', r, 1936 ],
    [ 'cloud', 2048 ],
    [ 'infantry', r, 2560 ],
    [ 'cloud', 2633 ],
    [ 'bunker', r, 2688 ],
    [ 'tank', r, 2720 ],
    [ 'infantry', r, 2800 ],
    [ 'tank', r, 2960 ],
    [ 'infantry', r, 3040 ],
    [ 'tank', r, 3120 ],
    [ 'tank', r, 3200 ],
    [ 'cloud', 3218 ],
    [ 'bunker', r, 3328 ],
    [ 'balloon', l, 3584 ],
    [ 'tank', r, 3584 ],
    [ 'tank', r, 3664 ],
    [ 'cloud', 3803 ],
    [ 'infantry', r, 3904 ],
    [ 'missile-launcher', r, 3984 ],
    [ 'bunker', r, 4000 ],
    [ 'balloon', l, 4096 ],
    [ 'infantry', r, 4096 ],
    [ 'landing-pad', n, 4096 ],
    [ 'cloud', 4388 ],
    [ 'missile-launcher', r, 4416 ],
    [ 'balloon', l, 4608 ],
    [ 'super-bunker', r, 4608 ],
    [ 'cloud', 4973 ],
    [ 'bunker', r, 5120 ],
    [ 'bunker', r, 5504 ],
    [ 'cloud', 5558 ],
    [ 'cloud', 6144 ],
    [ 'super-bunker', r, 6400 ],
    // [ 'turret', r, 6512 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    /*
    [ 'right-arrow-sign', -16 ],
    [ 'right-arrow-sign', 570 ],
    [ 'left-arrow-sign', 7700 ],
    [ 'left-arrow-sign', 8208 ],
    */
   /*
    [ 'turret', 3280 ],
    [ 'turret', r, 1908 ],
    [ 'turret', r, 4256 ],
    [ 'turret', r, 4736 ],
    [ 'turret', r, 5269 ],
    [ 'turret', r, 5642 ],
    */

    // TODO: break these up for easy vs. hard vs. extreme.
    // 1 for easy, 2 for hard, 3 for extreme.

    // original coordinates
    /*
    [ 'turret', r, 944 ],
    [ 'turret', r, 960 ],
    [ 'turret', r, 976 ],

    [ 'turret', r, 2112 ],
    [ 'turret', r, 2128 ],
    [ 'turret', r, 2144 ],

    [ 'turret', r, 2352 ],
    [ 'turret', r, 2368 ],
    [ 'turret', r, 2384 ],

    [ 'turret', r, 2624 ],
    [ 'turret', r, 2640 ],
    [ 'turret', r, 2656 ],

    [ 'turrrt', r, 2816 ],
    [ 'turret', r, 2832 ],
    [ 'turret', r, 2848 ],

    [ 'turret', r, 3248 ],
    [ 'turret', r, 3264 ],
    [ 'turret', r, 3280 ],
    */

    // 2x-scaled coordinates
    ['turret', r, 1888],
    ['turret', r, 1920],
    ['turret', r, 1952],

    ['turret', r, 4224],
    ['turret', r, 4256],
    ['turret', r, 4288],

    ['turret', r, 4704],
    ['turret', r, 4736],
    ['turret', r, 4768],

    ['turret', r, 5248],
    ['turret', r, 5280],
    ['turret', r, 5312],

    ['turret', r, 5632],
    ['turret', r, 5664],
    ['turret', r, 5696],

    ['turret', r, 6496],
    ['turret', r, 6528],
    ['turret', r, 6560],

    [ 'rock', 996 ],
    [ 'rock', 4182 ],
    [ 'rock', 4161 ],
    [ 'flower', 2984 ],
    [ 'flower-bush', 4082 ],
    [ 'flower-bush', 4128 ],
    [ 'flower-bush', 6608 ],
    [ 'grass', 4103 ],
    [ 'tree', 4206 ],
    [ 'tree', 5144 ],
    [ 'rock2', 4153 ],
    [ 'flowers', 4095 ],
    [ 'grave-cross', 5219 ],
    [ 'palm-tree', 6702 ],
    [ 'palm-tree', 7695 ],
    [ 'sand-dunes', 7635 ],
    [ 'van', r, 1218 ],
    [ 'van', r, 2146 ],
    [ 'van', r, 4034 ]
  ],

  'Balloon Fun': [
    [ 'end-bunker', n, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    ...(() => {
      /* 36 - not 99 - more balloons needed; distribute evenly across middle 3/4 of battlefield. */
      let luftBalloons = new Array(39);
      for (let i = 0, j = luftBalloons.length; i < j; i++) {
        luftBalloons[i] = ([ 'balloon', n, 1024 + parseInt(2048 * i / j) ]);
      }
      return luftBalloons;
    })(),
    [ 'super-bunker', l, 1984 ],
    [ 'turret', l, 512 ],
    [ 'turret', l, 544 ],
    [ 'turret', l, 576 ],
    [ 'turret', l, 1024 ],
    [ 'turret', l, 1056 ],
    [ 'turret', l, 1088 ],
    [ 'turret', r, 3072 ],
    [ 'turret', r, 3040 ],
    [ 'turret', r, 3008 ],
    [ 'turret', r, 3584 ],
    [ 'turret', r, 3552 ],
    [ 'turret', r, 3520 ],
    [ 'super-bunker', r, 2112 ]
  ],

  'Cavern Cobra': [
    [ 'end-bunker', l, 24 ],
    [ 'base', l, 192 ],
    [ 'landing-pad', n, 320 ],
    [ 'bunker', l, 1024 ],
    [ 'bunker', l, 1280 ],
    [ 'bunker', l, 2560 ],
    [ 'bunker', l, 2816 ],
    [ 'bunker', l, 3520 ],
    [ 'balloon', l, 3584 ],
    [ 'bunker', l, 3584 ],
    [ 'balloon', l, 4096 ],
    [ 'balloon', l, 4608 ],
    [ 'bunker', r, 4608 ],
    [ 'bunker', r, 4672 ],
    [ 'bunker', r, 5376 ],
    [ 'bunker', r, 5632 ],
    [ 'bunker', r, 6912 ],
    [ 'bunker', r, 7168 ],
    [ 'landing-pad', r, 7872 ],
    [ 'base', r, 8000 ],
    [ 'end-bunker', r, 8168 ],
    [ 'palm-tree', 1238 ],
    [ 'grass', 1535 ],
    [ 'sand-dunes', 2631 ],
    [ 'tree', 2931 ],
    [ 'tree', 2972 ],
    [ 'palm-tree', 3121 ],
    [ 'palm-tree', 3192 ],
    [ 'palm-tree', 3507 ],
    [ 'tree', 3591 ],
    [ 'palm-tree', 3708 ],
    [ 'palm-tree', 3833 ],
    [ 'palm-tree', 3868 ],
    [ 'palm-tree', 3889 ],
    [ 'tree', 3931 ],
    [ 'sand-dune', 3940 ],
    [ 'palm-tree', 3950 ],
    [ 'palm-tree', 4061 ],
    [ 'tree', 4185 ],
    [ 'tree', 4201 ],
    [ 'tree', 4269 ],
    [ 'palm-tree', 4305 ],
    [ 'tree', 4312 ],
    [ 'palm-tree', 4369 ],
    [ 'tree', 4375 ],
    [ 'palm-tree', 4454 ],
    [ 'palm-tree', 4470 ],
    [ 'palm-tree', 4490 ],
    [ 'palm-tree', 4497 ],
    [ 'tree', 4604 ],
    [ 'sand-dunes', 4607 ],
    [ 'tree', 4769 ],
    [ 'tree', 4810 ],
    [ 'palm-tree', 4845 ],
    [ 'grass', 4875 ],
    [ 'sand-dunes', 4901 ],
    [ 'palm-tree', 4902 ],
    [ 'tree', 4917 ],
    [ 'tree', 5018 ],
    [ 'tree', 5077 ],
    [ 'tree', 5083 ],
    [ 'tree', 5125 ],
    [ 'palm-tree', 5189 ],
    [ 'checkmark-grass', 5771 ],
    [ 'cactus2', 6291 ],
    [ 'grave-cross', 6415 ],
    [ 'palm-tree', 6814 ],
    [ 'gravestone', 7155 ],
    [ 'turret', l, 1152 ],
    [ 'turret', l, 2048 ],
    [ 'turret', l, 2080 ],
    [ 'turret', l, 2688 ],
    [ 'turret', l, 3072 ],
    [ 'turret', l, 3104 ],
    [ 'turret', r, 5088 ],
    [ 'turret', r, 5120 ],
    [ 'turret', r, 5504 ],
    [ 'turret', r, 6624 ],
    [ 'turret', r, 6656 ],
    [ 'turret', r, 7040 ]
  ],

  'Desert Sortie': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'turret', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'super-bunker', r, 2048 ],
    [ 'bunker', r, 2240 ],
    [ 'turret', r, 2560 ],
    [ 'bunker', r, 2816 ],
    [ 'bunker', r, 3072 ],
    [ 'turret', r, 3328 ]
  ],

  'First Blood': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'turret', l, 256 ],
    [ 'bunker', l, 320 ],
    [ 'bunker', l, 576 ],
    [ 'bunker', l, 640 ],
    [ 'super-bunker', r, 872 ],
    [ 'turret', r, 920 ],
    [ 'turret', r, 952 ],
    [ 'bunker', r, 1984 ],
    [ 'bunker', r, 2016 ],
    [ 'turret', r, 2048 ],
    [ 'turret', r, 2064 ],
    [ 'bunker', r, 2112 ],
    [ 'bunker', r, 3072 ],
    [ 'bunker', r, 3104 ],
    [ 'super-bunker', r, 3176 ],
    [ 'turret', r, 3224 ],
    [ 'turret', r, 3256 ],
    [ 'bunker', r, 3520 ],
    [ 'tank', r, 2368 ],
    [ 'infantry', r, 2408 ],
    [ 'tank', r, 2488 ],
    [ 'infantry', r, 2528 ],
    [ 'tank', r, 2568 ],
    [ 'tank', r, 2608 ],
    [ 'tank', r, 3392 ],
    [ 'infantry', r, 3432 ],
    [ 'tank', r, 3512 ],
    [ 'infantry', r, 3552 ],
    [ 'missile-launcher', r, 3592 ],
    [ 'van', r, 3617 ],
    [ 'van', r, 3840 ],
    [ 'van', r, 3872 ]
  ],

'Network Mania': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', r, 512 ],
    [ 'turret', r, 824 ],
    [ 'turret', r, 840 ],
    [ 'super-bunker', r, 896 ],
    [ 'turret', r, 944 ],
    [ 'turret', r, 976 ],
    [ 'bunker', r, 1984 ],
    [ 'turret', r, 2023 ],
    [ 'super-bunker', r, 2048 ],
    [ 'turret', r, 2091 ],
    [ 'bunker', r, 2112 ],
    [ 'turret', r, 3128 ],
    [ 'turret', r, 3144 ],
    [ 'super-bunker', r, 3200 ],
    [ 'turret', r, 3248 ],
    [ 'turret', r, 3280 ],
    [ 'infantry', r, 3328 ],
    [ 'bunker', r, 3584 ],
    [ 'tank', r, 768 ],
    [ 'infantry', r, 808 ],
    [ 'tank', r, 888 ],
    [ 'infantry', r, 928 ],
    [ 'missile-launcher', r, 968 ],
    [ 'van', r, 993 ],
    [ 'tank', r, 2048 ],
    [ 'infantry', r, 2088 ],
    [ 'tank', r, 2168 ],
    [ 'infantry', r, 2208 ],
    [ 'tank', r, 2248 ],
    [ 'tank', r, 2288 ],
    // [ ??? (241), r, 2112 ],
    [ 'infantry', r, 3328 ],
    // [ ??? (241), r, 3408 ],
    [ 'missile-launcher', r, 3488 ],
    [ 'tank', r, 2560 ],
    [ 'infantry', r, 2600 ],
    [ 'infantry', r, 2680 ],
    [ 'missile-launcher', r, 2760 ],
    // [ ??? (241), r, 2785 ],
    [ 'van', r, 2865 ],
    [ 'missile-launcher', r, 1648 ],
    [ 'missile-launcher', r, 2048 ]
  ],

  'Rescue Raiders': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'turret', l, 256 ],
    [ 'turret', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'super-bunker', l, 1024 ],
    [ 'turret', l, 1104 ],
    [ 'turret', l, 1136 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1792 ],
    [ 'turret', l, 2016 ],
    [ 'turret', l, 2032 ],
    [ 'turret', r, 2060 ],
    [ 'turret', r, 2080 ],
    [ 'super-bunker', r, 2304 ],
    [ 'super-bunker', r, 2384 ],
    [ 'bunker', r, 2560 ],
    [ 'bunker', r, 2816 ],
    [ 'super-bunker', r, 3072 ],
    [ 'turret', r, 2992 ],
    [ 'turret', r, 2960 ],
    [ 'turret', r, 3328 ],
    [ 'turret', r, 3584 ],
    [ 'turret', r, 3840 ]
  ],

  'Midpoint': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', n, 2048 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'turret', l, 256 ],
    [ 'turret', l, 288 ],
    [ 'super-bunker', r, 1280 ],
    [ 'bunker', l, 1360 ],
    [ 'turret', r, 1536 ],
    [ 'turret', r, 1568 ],
    [ 'turret', r, 2000 ],
    [ 'turret', r, 2016 ],
    [ 'turret', l, 2080 ],
    [ 'turret', l, 2096 ],
    [ 'turret', r, 2560 ],
    [ 'turret', r, 2528 ],
    [ 'bunker', l, 2736 ],
    [ 'super-bunker', r, 2816 ],
    [ 'turret', r, 3808 ],
    [ 'turret', r, 3840 ]
  ],

  'Slithy Toves': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', l, 512 ],
    [ 'turret', l, 768 ],
    [ 'bunker', l, 1024 ],
    [ 'turret', l, 1280 ],
    [ 'bunker', l, 1536 ],
    [ 'bunker', l, 1920 ],
    [ 'bunker', r, 2176 ],
    [ 'bunker', r, 2560 ],
    [ 'turret', r, 2816 ],
    [ 'bunker', r, 3072 ],
    [ 'turret', r, 3328 ],
    [ 'bunker', r, 3584 ]
  ],

  'Tanker\'s Demise': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'super-bunker', l, 256 ],
    [ 'turret', l, 286 ],
    // two of these, per original list? bug?
    // [ 'turret', l, 275 ],
    [ 'super-bunker', l, 294 ],
    [ 'turret', l, 1024 ],
    [ 'turret', l, 1040 ],
    [ 'turret', l, 1056 ],
    [ 'super-bunker', l, 1280 ],
    [ 'turret', l, 1314 ],
    [ 'turret', l, 1266 ],
    [ 'bunker', l, 1792 ],
    [ 'bunker', l, 1856 ],
    [ 'super-bunker', l, 2000 ],
    [ 'turret', r, 2040 ],
    [ 'turret', r, 2056 ],
    [ 'turret', r, 2072 ],
    [ 'turret', l, 2050 ],
    [ 'turret', l, 2066 ],
    [ 'turret', l, 2082 ],
    [ 'super-bunker', r, 2100 ],
    [ 'bunker', r, 2272 ],
    [ 'bunker', r, 2304 ],
    [ 'turret', r, 3072 ],
    [ 'turret', r, 3088 ],
    [ 'turret', r, 3104 ],
    [ 'super-bunker', r, 2816 ],
    [ 'turret', r, 2848 ],
    [ 'turret', r, 2802 ],
    [ 'super-bunker', r, 3517 ],
    [ 'turret', r, 3548 ],
    [ 'super-bunker', r, 3557 ],
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ]
  ],

  'WindStalker': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', n, 2048 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ],
    [ 'bunker', r, 996 ],
    [ 'super-bunker', r, 1024 ],
    [ 'bunker', r, 1059],
    [ 'turret', r, 984 ],
    [ 'turret', r, 1084 ],
    [ 'turret', l, 1536 ],
    [ 'turret', l, 1792 ],
    [ 'bunker', l, 1984 ],
    [ 'bunker', l, 1916 ],
    [ 'bunker', r, 2112 ],
    [ 'bunker', r, 2176 ],
    [ 'turret', r, 2304 ],
    [ 'turret', r, 2560 ],
    [ 'bunker', r, 3045 ],
    [ 'super-bunker', r, 3072 ],
    [ 'bunker', r, 3106 ],
    [ 'turret', r, 3032 ],
    [ 'turret', r, 3132 ]
  ],

  'Sandstorm': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ]
  ],

  'Rainstorm': [
    [ 'balloon', n, 1792 ],
    [ 'balloon', n, 2048 ],
    [ 'balloon', n, 2304 ],
    [ 'end-bunker', l, 12 ],
    [ 'base', l, 96 ],
    [ 'landing-pad', l, 160 ],
    [ 'landing-pad', r, 3936 ],
    [ 'base', r, 4000 ],
    [ 'end-bunker', r, 4084 ]
  ]

};

export {
  addWorldObjects,
  levelName,
  previewLevel,
  setCustomLevel,
  setLevel
};