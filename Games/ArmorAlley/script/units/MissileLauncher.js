import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { bananaMode, FPS, getTypes, rndInt, rubberChickenMode, TYPES } from '../core/global.js';
import { gamePrefs } from '../UI/preferences.js';
import { enemyHelicopterNearby, nearbyTest, objectInView, recycleTest } from '../core/logic.js';
import { playSound, sounds } from '../core/sound.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';

const MissileLauncher = (options = {}) => {

  let css, data, dom, friendlyNearby, height, radarItem, exports;

  function stop() {

    data.stopped = true;

  }

  function resume() {

    data.stopped = false;

  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    if (!dieOptions?.silent) {

      utils.css.add(dom.o, css.exploding);

      if (sounds.genericExplosion) {
        playSound(sounds.genericExplosion, exports);
      }

      effects.inertGunfireExplosion({ exports });

      effects.domFetti(exports, dieOptions.attacker);

      // only cause damage if there was an attacker.
      // otherwise, regular self-destruct case will also stop the missile. ;)
      if (dieOptions.attacker) {
        effects.damageExplosion(exports);
      }

      common.setFrameTimeout(() => {
        sprites.removeNodesAndUnlink(exports);
      }, 1000);

      if (!dieOptions.firingMissile) {
        common.addGravestone(exports);
      }

    } else {

      sprites.removeNodesAndUnlink(exports);

    }

    // stop moving while exploding
    data.vX = 0;

    data.energy = 0;

    data.dead = true;

    radarItem.die({ silent: !!dieOptions.silent });

    common.onDie(exports, dieOptions);

  }

  function fire() {

    let i, j, similarMissileCount, targetHelicopter;

    if (data.frameCount % data.fireModulus !== 0) return;

    // is an enemy helicopter nearby?
    targetHelicopter = enemyHelicopterNearby(data, 256);

    if (!targetHelicopter) return;

    // we have a possible target. any missiles already chasing it?
    similarMissileCount = 0;

    for (i = 0, j = game.objects[TYPES.smartMissile].length; i < j; i++) {
      if (game.objects[TYPES.smartMissile][i].objects.target === targetHelicopter) {
        similarMissileCount++;
      }
    }

    if (similarMissileCount) return;

    /**
     * player's missile launchers: fire and target enemy chopper only when "unattended."
     * e.g., don't fire if a friendly turret or helicopter is nearby; they can handle it.
     * CPU makes missile launchers routinely, whereas they're strategic for human player.
     * in the enemy case, fire at player regardless of who's nearby. makes game tougher.
     */

    if (!data.isEnemy) {

      // friendly turret
      if (objectInView(data, {
        items: TYPES.turret,
        friendlyOnly: true
      })) {
        return;
      }

      // friendly helicopter, and armed with at least one missile
      if (objectInView(data, {
        items: TYPES.helicopter,
        friendlyOnly: true
      }) && game.players.local.data.smartMissiles > 0) {
        return;
      }

    }

    // self-destruct, FIRE ZE MISSILE
    die({ firingMissile: true });

    const params = {
      id: `${data.id}_missile`,
      staticID: true,
      parent: exports,
      parentType: data.type,
      isEnemy: data.isEnemy,
      isBanana: gamePrefs.alt_smart_missiles && game.objects.view.data.missileMode === bananaMode,
      isRubberChicken: gamePrefs.alt_smart_missiles && game.objects.view.data.missileMode === rubberChickenMode,
      x: data.x + (data.width / 2),
      y: data.y,
      target: targetHelicopter
    };

    const missile = game.addObject(TYPES.smartMissile, params);

    /**
     * For consistency, ensure a missile exists on both sides.
     * 
     * It's possible, given lag(?), that one missile launcher may have been blown up
     * on the other side by something else before it had a chance to launch.
     * 
     * This is bad as it could mean your helicopter mysteriously gets hit, when
     * the active missile on the other side hits it.
     */
    if (net.active) {

      net.sendMessage({
        type: 'ADD_OBJECT',
        objectType: missile.data.type,
        params: {
          ...params,
          id: params.id,
          isBanana: params.isBanana,
          isRubberChicken: params.isRubberChicken
        }
      });
        
    }

  }

  function animate() {

    data.frameCount++;

    if (data.dead) return !dom.o;

    if (!data.stopped) {
      sprites.moveTo(exports, data.x + data.vX, data.y);
    } else {
      // if stopped, just take scroll into effect
      sprites.moveWithScrollOffset(exports);
    }

    effects.smokeRelativeToDamage(exports);

    if (data.orderComplete && !data.stopped) {

      // regular timer or back wheel bump
      if (data.frameCount % data.stateModulus === 0) {

        data.state++;

        if (data.state > data.stateMax) {
          data.state = 0;
        }

        // reset frameCount (timer)
        data.frameCount = 0;

        // first wheel, delay, then a few frames until we animate the next two.
        if (data.state === 1 || data.state === 3) {
          data.stateModulus = 36;
        } else {
          data.stateModulus = 4;
        }

        data.frameCount = 0;

        if (data.isOnScreen) {
          dom.o._style.setProperty('background-position', `0px ${data.height * data.state * -1}px`);
        }

      } else if (data.frameCount % data.stateModulus === 2 && data.isOnScreen) {

        // next frame - reset.
        dom.o._style.setProperty('background-position', '0px 0px');

      }

    }

    recycleTest(exports);

    // (maybe) fire?
    fire();

    if (gamePrefs.ground_unit_traffic_control) {
      nearbyTest(friendlyNearby, exports);
    }

    return (data.dead && !dom.o);

  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

  }

  function initMissileLauncher() {
    
    if (options.noInit) return;

    initDOM();

    common.initNearby(friendlyNearby, exports);

    data.frameTimeout = common.setFrameTimeout(() => {
      data.orderComplete = true;
      data.frameTimeout = null;
    }, 2000);

    radarItem = game.objects.radar.addItem(exports, dom.o.className);

  }

  height = 18;

  css = common.inheritCSS({
    className: 'missile-launcher'
  });

  data = common.inheritData({
    type: 'missile-launcher',
    bottomAligned: true,
    energy: 3,
    energyMax: 3,
    direction: 0,
    vX: (options.isEnemy ? -1 : 1),
    frameCount: 0,
    frameTimeout: null,
    fireModulus: FPS, // check every second or so
    width: 54,
    halfWidth: 27,
    height,
    halfHeight: height / 2,
    orderComplete: false,
    state: 0,
    stateMax: 3,
    stateModulus: 38,
    inventory: {
      frameCount: 60,
      cost: 3
    },
    x: options.x || 0,
    y: game.objects.view.data.world.height - height - 2,
    domFetti: {
      colorType: options.isEnemy ? 'grey' : 'green',
      elementCount: 7 + rndInt(7),
      startVelocity: 10 + rndInt(10)
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
    init: initMissileLauncher
  };

  friendlyNearby = {
    options: {
      source: exports,
      targets: undefined,
      useLookAhead: true,
      // stop moving if we roll up behind a friendly vehicle
      friendlyOnly: true,
      hit: (target) => common.friendlyNearbyHit(target, exports, { resume, stop }),
      miss: resume
    },
    // who are we looking for nearby?
    items: getTypes('tank, van, missileLauncher', { group: 'friendly', exports }),
    targets: []
  };

  return exports;

};

export { MissileLauncher };