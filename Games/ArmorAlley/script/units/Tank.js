import { game } from '../core/Game.js';
import { gameType } from '../aa.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { gamePrefs } from '../UI/preferences.js';
import { nearbyTest, recycleTest } from '../core/logic.js';
import { TYPES, FPS, rndInt, oneOf, getTypes, rngInt } from '../core/global.js';
import { addSequence, playSound, playSoundWithDelay, skipSound, sounds } from '../core/sound.js';
import { zones } from '../core/zones.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';

const Tank = (options = {}) => {

  let css, data, dom, radarItem, nearby, friendlyNearby, exports, tankHeight, fireRates;

  function fire() {

    let collisionItems;

    if (data.frameCount % data.fireModulus !== 0) return;

    /**
     * Special case: tanks don't stop to shoot bunkers, but allow gunfire to hit and damage bunkers
     * ONLY IF the tank is targeting a helicopter (i.e., defense) or another tank.
     * 
     * Otherwise, let bullets pass through bunkers and kill whatever "lesser" units the tank is firing at.
     * 
     * This should be an improvement from the original game, where tanks could get "stuck" shooting into
     * a bunker and eventually destroying it while trying to take out an infantry.
     */

    if (
      data.lastNearbyTarget && data.lastNearbyTarget.data.type
      && (data.lastNearbyTarget.data.type === TYPES.helicopter || data.lastNearbyTarget.data.type === TYPES.tank)
    ) {

      // allow bullets to hit bunkers when firing at a helicopter or tank
      collisionItems = nearby.items.concat(getTypes('bunker', { exports }));

    } else if (gamePrefs.tank_gunfire_miss_bunkers) {

      // bullets "pass through" bunkers when targeting infantry, engineers, missile launchers, and vans.
      collisionItems = nearby.items;

    }

    if (data.lastNearbyTarget?.data.type.match(/infantry|engineer|super-bunker|end-bunker/i)) {
      
      game.addObject(TYPES.flame, {
        parent: exports,
        parentType: data.type,
        isEnemy: data.isEnemy,
        damagePoints: 2, // tanks fire at half-rate, so double damage.
        collisionItems,
        x: data.x + ((data.width) * (data.isEnemy ? 0 : 1)),
        // data.y + 3 is visually correct, but halfHeight gets the bullets so they hit infantry
        y: data.y - 2,
        vX: 0,
        vY: 0
      });

      if (sounds.tankGunFire) {
        playSound(sounds.tankGunFire, exports);
      }

      return;

    }

    game.addObject(TYPES.gunfire, {
      parent: exports,
      parentType: data.type,
      isEnemy: data.isEnemy,
      damagePoints: 2, // tanks fire at half-rate, so double damage.
      collisionItems,
      x: data.x + ((data.width + 1) * (data.isEnemy ? 0 : 1)),
      // data.y + 3 is visually correct, but halfHeight gets the bullets so they hit infantry
      y: data.y + data.halfHeight,
      vX: data.vX * 2,
      vY: 0
    });

    if (sounds.tankGunFire) {
      playSound(sounds.tankGunFire, exports);
    }

  }

  function moveTo(x, y) {

    data.x = x;
    data.y = y;

    zones.refreshZone(exports);

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);

  }

  function updateHealth() {

    sprites.updateEnergy(exports);

  }

  function repair() {

    if (data.frameCount % data.repairModulus === 0) {
      if (data.energy < data.energyMax) {
        data.energy += 0.6;
        updateHealth();
      }
    }

  }

  function isAttackerValid() {

    // special die() case: check if attacker is still alive, and on-screen.
    const attacker = data?.attacker?.data;

    // attacker may be not only dead, but nulled out; if so, ignore.
    if (!attacker) return;

    // normalize object to check: gunfire -> tank (for example), vs. helicopter crashing into a tank
    const actor = attacker.parentType ? attacker.parent.data : attacker.data;

    // just in case
    if (!actor) return;

    // enemy (tank/helicopter etc.) directly killed your tank, and is dead or off-screen.
    if (actor.dead || !actor.isOnScreen) return;

    return true;
    
  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    data.dead = true;

    const attackerType = data?.attacker?.data.type;

    if (!dieOptions.silent) {

      playSound(sounds.genericExplosion, exports);

      utils.css.add(dom.o, css.exploding);

      effects.damageExplosion(exports);

      effects.shrapnelExplosion(data, { velocity: 4 + rngInt(4, TYPES.shrapnel) });

      effects.inertGunfireExplosion({ exports });

      effects.domFetti(exports, dieOptions.attacker);

      effects.smokeRing(exports, { isGroundUnit: true });

      data.deadTimer = common.setFrameTimeout(() => {
        sprites.removeNodesAndUnlink(exports);
        data.deadTimer = null;
      }, 1500);

      // special case: you destroyed a tank, and didn't crash into one.
      if (data.isEnemy && attackerType !== TYPES.helicopter) {

        // helicopter bombed / shot / missiled tank
        if (data.isOnScreen && data?.attacker?.data?.parentType === TYPES.helicopter && Math.random() > 0.75) {

          if (game.data.isBeavis) {
            playSound(addSequence(sounds.bnb.buttheadDirectHitBeavis, sounds.bnb.beavisThanks), exports);
          } else {
            playSound(sounds.bnb.beavisBattleship, exports);
          }

        } else {

          // generic
          playSoundWithDelay(oneOf([sounds.bnb.beavisYes, sounds.bnb.buttheadWhoaCool]), 250);

        }

      }

      // other special case: beavis saw an on-screen tank get taken out while butt-head is playing.
      if (!data.isEnemy) {
        
        if (game.data.isButthead && sounds.bnb.beavisCmonButthead && isAttackerValid()) {

          // basically, just long enough for three tanks to duke it out.
          // your first one gets shot, then your second takes the enemy one out.
          // if the enemy lives through this common sequence, then have Beavis comment.
          const delay = 1500;

          playSoundWithDelay(sounds.bnb.beavisCmonButthead, exports, { onplay: (sound) => { if (!isAttackerValid()) skipSound(sound); }}, delay);

        } else {

          // generic commentary for failure
          playSoundWithDelay(sounds.bnb[game.isBeavis ? 'beavisLostUnit' : 'buttheadLostUnit']);

          // generic notification
          if (!net.connected && !data.isOnScreen && attackerType !== TYPES.smartMissile) {
            game.objects.notifications.add('You lost a tank 💥');
          }
          
        }

      }

      common.addGravestone(exports);

    } else {

      sprites.removeNodesAndUnlink(exports);

    }

    // stop moving while exploding
    data.vX = 0;

    data.energy = 0;

    radarItem.die();

    common.onDie(exports, dieOptions);

  }

  function shouldFireAtTarget(target) {

    if (!target?.data) return false;

    // TODO: ensure the target is "in front of" the tank.

    // fire at "bad guys" that have energy left. this includes end-bunkers and super-bunkers which haven't yet been neutralized.
    if (target.data.isEnemy !== data.isEnemy && target.data.energy !== 0) return true;

  }

  function stop() {

    if (data.stopped) return;

    utils.css.add(dom.o, css.stopped);
    data.stopped = true;

  }

  function resume() {

    if (!data.stopped) return;

    if (data.lastNearbyTarget) return;

    utils.css.remove(dom.o, css.stopped);
    data.stopped = false;

  }

  function animate() {

    data.frameCount++;

    // exit early if dead
    if (data.dead) return (!data.deadTimer && !dom.o);

    repair();

    effects.smokeRelativeToDamage(exports);

    if (!data.stopped) {

      moveTo(data.x + data.vX, data.y);

    } else {
      
      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);
      
      if (shouldFireAtTarget(data.lastNearbyTarget)) {

        // move one pixel every so often, to prevent edge case where tank can get "stuck" - e.g., shooting an enemy that is overlapping a bunker or super bunker.
        // the original game had something like this, too.
        if (data.frameCount % FPS === 0) {

          // run "moving" animation for a few frames
          utils.css.remove(dom.o, css.stopped);

          moveTo(data.x + (data.isEnemy ? -1 : 1), data.y);

          // and then stop again if we haven't resumed for real by that time.
          common.setFrameTimeout(() => {
            if (data.stopped) {
              utils.css.add(dom.o, css.stopped);
            }
          }, 150);
        }

        // only fire (i.e., GunFire objects) when stopped
        fire();

      }

    }

    // start, or stop firing?
    nearbyTest(nearby, exports);

    // stop moving, if we approach another friendly tank
    if (gamePrefs.ground_unit_traffic_control) {
      nearbyTest(friendlyNearby, exports);
    }

    recycleTest(exports);

    return (data.dead && !data.deadTimer && !dom.o);

  }

  function initDOM() {

    if (options.noInit) return;

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    dom.o.appendChild(sprites.makeTransformSprite());

    // for testing
    if (options.extraClass) {
      utils.css.add(dom.o, options.extraClass);
    }

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);

    radarItem = game.objects.radar.addItem(exports, dom.o.className);
    
    common.initNearby(nearby, exports);
    common.initNearby(friendlyNearby, exports);

  }

  tankHeight = 18;

  // gunfire every N frames, based on game type.
  // lower number = faster firing rate.
  fireRates = {
    'default': 12,
    'tutorial': 12,
    'easy': 12,
    'hard': 11,
    'extreme': 10
  };

  css = common.inheritCSS({
    className: TYPES.tank,
    stopped: 'stopped'
  });

  const width = 58;

  data = common.inheritData({
    type: TYPES.tank,
    bottomAligned: true,
    deadTimer: null,
    energy: 8,
    energyMax: 8,
    energyLineScale: 0.8,
    frameCount: 0,
    repairModulus: 30,
    // enemy tanks shoot a little faster, depending on the game difficulty
    fireModulus: fireRates[(options.isEnemy && game.players.cpu.length ? gameType : 'default')],
    vX: (options.isEnemy ? -1 : 1),
    vXDefault: (options.isEnemy ? -1 : 1),
    width,
    height: tankHeight,
    halfWidth: 28,
    halfHeight: tankHeight / 2,
    stopped: false,
    inventory: {
      frameCount: 30,
      cost: 4
    },
    lastNearbyTarget: null,
    x: options.x || 0,
    y: game.objects.view.data.world.height - tankHeight,
    // hackish: logical vs. sprite alignment offset
    yOffset: 2,
    xLookAhead: width / 3,
    domFetti: {
      colorType: options.isEnemy ? 'grey' : 'green',
      elementCount: 20 + rndInt(20),
      startVelocity: 5 + rndInt(10),
      spread: 90
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
    init: initDOM,
    radarItem,
    resume,
    stop,
    updateHealth
  };

  friendlyNearby = {
    options: {
      source: exports,
      targets: undefined,
      useLookAhead: true,
      // stop moving if we roll up behind a friendly tank
      friendlyOnly: true,
      hit: (target) => common.friendlyNearbyHit(target, exports, { resume, stop }),
      // resume, if tank is not also firing
      miss: resume
    },
    // who are we looking for nearby?
    items: getTypes('tank:friendly', { exports }),
    targets: []
  };

  nearby = {
    options: {
      source: exports,
      targets: undefined,
      useLookAhead: true,
      hit(target) {
        // determine whether to fire, or resume (if no friendly tank nearby)
        if (shouldFireAtTarget(target)) {
          data.lastNearbyTarget = target;
          stop();
        } else {
          // resume, if not also stopped for a nearby friendly tank
          data.lastNearbyTarget = null;
          resume();
        }
      },
      miss() {
        // resume moving, stop firing.
        data.lastNearbyTarget = null;
        resume();
      }
    },
    // who gets fired at?
    items: getTypes('tank, van, missileLauncher, infantry, engineer, turret, helicopter, endBunker, superBunker', { exports }),
    targets: []
  };

  return exports;

};

export { Tank };