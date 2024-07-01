import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { gamePrefs } from '../UI/preferences.js';
import { enemyHelicopterNearby, isGameOver, nearbyTest } from '../core/logic.js';
import { TYPES, winloc, FPS, tutorialMode, rndInt, getTypes, rngInt } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { EVENTS, gameEvents } from '../core/GameEvents.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';

const Van = (options = {}) => {

  let css, dom, data, friendlyNearby, height, pads, radarItem, exports;

  // for testing end sequence
  const theyWin = winloc.match(/theyWin/i);
  const youWin = winloc.match(/youWin/i);

  function stop() {

    data.stopped = true;

  }

  function resume() {

    data.stopped = false;

  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    data.energy = 0;

    data.jamming = false;

    data.dead = true;

    utils.css.add(dom.o, css.exploding);

    // stop moving while exploding
    data.vX = 0;

    // revert to CSS rules, prevent first frame of explosion from sticking
    dom.o._style.setProperty('background-position', '0px -384px');

    effects.shrapnelExplosion(data, { centerX: true, velocity: 3 + rngInt(3, TYPES.shrapnel) });

    effects.domFetti(exports, dieOptions.attacker);

    effects.inertGunfireExplosion({ exports });

    effects.damageExplosion(exports);

    data.deadTimer = common.setFrameTimeout(() => {
      sprites.removeNodesAndUnlink(exports);
      data.deadTimer = null;
    }, 1000);

    if (radarItem) {
      radarItem.die();
    } else {
      game.objects.stats.destroy(exports);
    }

    if (sounds.genericExplosion) {
      playSound(sounds.genericExplosion, exports);
    }

    common.onDie(exports, dieOptions);

    common.addGravestone(exports);

  }

  function animate() {

    // hackish: defer this until all objects are created, and the game has started etc.
    if (!data.xGameOver && pads?.length) {
      data.xGameOver = (data.isEnemy ? pads[0].data.x + 88 : pads[pads.length - 1].data.x - 44);
    }

    let enemyHelicopter;

    if (!data.stopped) {
      sprites.moveTo(exports, data.x + data.vX, data.y);
    } else {
      // if stopped, just take scroll into effect
      sprites.moveWithScrollOffset(exports);
    }

    if (data.dead) return !data.deadTimer;

    effects.smokeRelativeToDamage(exports);

    // just in case: prevent any multiple "game over" actions via animation
    if (isGameOver()) return;

    if (theyWin || (data.isEnemy && data.x <= data.xGameOver)) {

      stop();

      // Game over, man, game over! (Enemy wins.)

      // hack: clear any existing.
      game.objects.view.setAnnouncement();

      game.objects.view.setAnnouncement('The enemy has won the battle.\nBetter luck next time.', -1);

      gameOver(false);

    } else if (youWin || (!data.isEnemy && data.x >= data.xGameOver)) {

      stop();

      // player wins

      // hack: clear any existing.
      game.objects.view.setAnnouncement();

      game.objects.view.setAnnouncement('Congratulations! You have won the battle.', -1);

      gameOver(true);

    } else {

      // bounce wheels after the first few seconds

      if (data.frameCount > FPS * 2) {

        if (data.frameCount % data.stateModulus === 0) {

          data.state++;

          if (data.state > data.stateMax) {
            data.state = 0;
          }

          if (data.isOnScreen) {
            dom.o._style.setProperty('background-position', `0px ${data.height * data.state * -1}px`);
          }

        } else if (data.frameCount % data.stateModulus === 2) {

          // next frame - reset.
          if (data.isOnScreen) {
            dom.o._style.setProperty('background-position', '0px 0px');
          }

        }

      }

      if (data.frameCount % data.radarJammerModulus === 0) {

        // look for nearby bad guys
        enemyHelicopter = enemyHelicopterNearby(data, game.objects.view.data.browser.twoThirdsWidth);

        if (!data.jamming && enemyHelicopter) {

          data.jamming = true;

        } else if (data.jamming && !enemyHelicopter) {

          data.jamming = false;

        }

      }

    }

    if (gamePrefs.ground_unit_traffic_control) {
      nearbyTest(friendlyNearby, exports);
    }

    data.frameCount++;

    // is van within 1/X of the battlefield away from a landing / base?
    const distance = data.isEnemy ? data.x - pads[0].data.x : pads[pads.length - 1].data.x - data.x;
    
    if (distance < data.approachingBase) {
      gameEvents.fire(EVENTS.vanApproaching, 'isEnemy', data.isEnemy);
    }

    return (data.dead && !data.deadTimer);

  }

  function gameOver(youWon) {

    // somebody's base is about to get blown up.
  
    let yourBase, enemyBase;
  
    // just in case
    if (isGameOver()) return;
  
    const bases = game.objects[TYPES.base];

    yourBase = bases[0];
    enemyBase = bases[1];
  
    if (!youWon) {
  
      // sorry, better luck next time.
      yourBase.die();
  
    } else {

      enemyBase.die();

    }
  
    game.data.battleOver = true;
  
    utils.css.add(document.body, 'game-over');
  
    game.objects.stats.displayEndGameStats();
  
  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

  }

  function initVan() {

    initDOM();

    common.initNearby(friendlyNearby, exports);

    /**
     * Enemy vans are so sneaky, they don't even appear on the radar.
     * Only show if you're on the same team, or in tutorial mode.
     */
    if (tutorialMode || !!options.isEnemy === game.players.local?.data?.isEnemy) {
      radarItem = game.objects.radar.addItem(exports, dom.o.className);
    } else {
      game.objects.stats.create(exports);
    }

    pads = game.objects[TYPES.landingPad];

  }

  height = 16;

  css = common.inheritCSS({
    className: TYPES.van
  });

  data = common.inheritData({
    type: TYPES.van,
    bottomAligned: true,
    deadTimer: null,
    frameCount: 0,
    radarJammerModulus: 30,
    jamming: false,
    energy: 2,
    energyMax: 2,
    direction: 0,
    approachingBase: 768,
    vX: (options.isEnemy ? -1 : 1),
    width: 38,
    halfWidth: 19,
    height,
    halfHeight: height / 2,
    state: 0,
    stateMax: 2,
    stateModulus: 30,
    stopped: false,
    inventory: {
      frameCount: 15,
      cost: 2
    },
    // if the van reaches the enemy base (near the landing pad), it's game over.
    xGameOver: 0, // set at init
    x: options.x || 0,
    y: game.objects.view.data.world.height - height - 2,
    domFetti: {
      colorType: options.isEnemy ? 'grey' : 'green',
      elementCount: 5 + rndInt(5),
      startVelocity: 8 + rndInt(8)
    }
  }, options);

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    dom,
    die,
    init: initVan,
    radarItem
  };

  friendlyNearby = {
    options: {
      source: exports,
      targets: undefined,
      useLookAhead: true,
      // stop moving if we roll up behind a friendly vehicle
      friendlyOnly: true,
      hit: stop,
      miss: resume
    },
    // who are we looking for nearby?
    items: getTypes('tank, missileLauncher, van', { group: 'friendly', exports }),
    targets: []
  };

  return exports;

};

export { Van };