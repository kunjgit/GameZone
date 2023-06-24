import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { gamePrefs } from '../UI/preferences.js';
import { collisionTest, nearbyTest, recycleTest } from '../core/logic.js';
import { getTypes, TYPES } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { zones } from '../core/zones.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';

const Infantry = (options = {}) => {

  let css, dom, data, defaultLookAhead, defaultItems, height, radarItem, nearby, collision, exports;

  function fire() {

    if (data.noFire) return;

    // walking is synced with animation, but bullets fire less often
    // always do positioning work, and maybe fire

    // only infantry: move back and forth a bit, and flip animation, while firing - like original game
    const offset = data.vX * data.vXFrames[data.vXFrameOffset] * 4;

    moveTo(data.x + offset, data.y);

    // hackish: undo the change `moveTo()` just applied to `data.x` so we don't actually change collision / position logic.
    data.x += (offset * -1);

    data.vXFrameOffset++;

    if (data.vXFrameOffset >= data.vXFrames.length) {
      // reverse direction!
      data.vXFrameOffset = 0;
      // and visually flip the sprite
      data.extraTransforms = !data.extraTransforms ? 'scaleX(-1)' : null;
    }
    
    // only fire every so often
    if (data.frameCount % data.fireModulus !== 0) return;

    game.addObject(TYPES.gunfire, {
      parent: exports,
      parentType: data.type,
      isEnemy: data.isEnemy,
      // like tanks, allow infantry + engineer gunfire to hit bunkers unless "miss bunkers" is enabled in prefs.
      collisionItems: (gamePrefs.tank_gunfire_miss_bunkers ? defaultItems : nearby.items),
      x: data.x + ((data.width + 1) * (data.isEnemy ? 0 : 1)),
      y: data.y + data.halfHeight,
      vX: data.vX, // same velocity
      vY: 0
    });

    if (sounds.infantryGunFire) {
      playSound(sounds.infantryGunFire, exports);
    }

  }

  function moveTo(x = data.x, y = data.y) {

      data.x = x;
      data.y = y;

      zones.refreshZone(exports);

      sprites.setTransformXY(exports, dom.o, `${x}px`, `${data.y - data.yOffset}px`);

  }

  function stop(noFire) {

    if (data.stopped) return;

    data.stopped = true;
    data.noFire = !!noFire;

    // engineers always stop, e.g., to repair and/or capture turrets.
    // infantry keep animation, but will appear to walk back and forth while firing.
    if (data.noFire) {
      utils.css.add(dom.o, css.stopped);
    } else {
      // infantry: reset "walking" offset, so initial movement is reduced
      data.vXFrameOffset = 0;
    }

  }

  function resume() {

    if (!data.stopped) return;

    utils.css.remove(dom.o, css.stopped);
    data.extraTransforms = null;
    data.stopped = false;
    data.noFire = false;

  }

  function setRole(role, force) {

    // TODO: minimize CSS thrashing, track lastClass etc.
    if (data.role !== role || force) {
      utils.css.remove(dom.o, css[data.roles[0]]);
      utils.css.remove(dom.o, css[data.roles[1]]);
      // role
      data.role = role;
      css.className = css[data.roles[data.role]];
      if (dom.o) {
        utils.css.add(dom.o, css.className);
      }
    }

  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    if (!dieOptions?.silent) {

      playSound(sounds.genericSplat, exports);

      if (gamePrefs.bnb) {

        if (data.isEnemy) {
          playSound(sounds.bnb.dvdPrincipalScream, exports);
        } else if (data.role) {
          // engineer case
          if (data.isBeavis) {
            playSound(sounds.bnb.beavisScreamShort, exports);  
          } else {
            playSound(sounds.bnb.buttheadScreamShort, exports);  
          }
        } else {
          // friendly infantry
          playSound(sounds.bnb.screamShort, exports);
        }

      } else {

        playSound(sounds.scream, exports);

      }

      effects.inertGunfireExplosion({ exports });

      common.addGravestone(exports);

    }

    sprites.removeNodesAndUnlink(exports);

    data.energy = 0;

    // stop moving while exploding
    data.vX = 0;

    data.dead = true;

    radarItem?.die({ silent: dieOptions?.silent });

    if (dieOptions.attacker) {
      data.attacker = dieOptions.attacker;
    }

    common.onDie(exports, dieOptions);

  }

  function animate() {

    if (data.dead) {

      // keep in sync with battlefield
      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);

      return !dom.o;

    }

    if (!data.stopped) {

      if (data.roles[data.role] === TYPES.infantry) {

        // infantry walking "pace" varies slightly, similar to original game
        moveTo(data.x + (data.vX * data.vXFrames[data.vXFrameOffset]), data.y);

        data.vXFrameOffset++;
        if (data.vXFrameOffset >= data.vXFrames.length) data.vXFrameOffset = 0;

      } else {

        // engineers always move one pixel at a time; let's say it's because of the backpacks.
        moveTo(data.x + data.vX, data.y);

      }

    } else {

      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);

      if (!data.noFire) {

        // firing, or reclaiming/repairing?
        // only fire (i.e., GunFire objects) when stopped
        fire();

      }

    }

    collisionTest(collision, exports);

    // start, or stop firing?
    nearbyTest(nearby, exports);

    recycleTest(exports);

    data.frameCount++;

    return (data.dead && !dom.o);

  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    // BNB
    if (!data.isEnemy && data.role) {
      utils.css.add(dom.o, data.isBeavis ? css.beavis : css.butthead);
    }

    dom.o.appendChild(sprites.makeTransformSprite());

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y - data.yOffset}px`);

  }

  function initInfantry() {

    if (options.noInit) return;

    // infantry, or engineer?
    setRole(data.role, true);

    initDOM();

    radarItem = game.objects.radar.addItem(exports, dom.o.className);

    common.initNearby(nearby, exports);

    moveTo(data.x, data.y);

  }

  function refreshMeasurements() {

    // hackish: make butthead stop to the left, and beavis stop to the right of (e.g.) a turret.
    if (gamePrefs.bnb && !data.isEnemy) {
      data.xLookAhead = options.isButthead ? -28 : 8;
    } else {
      data.xLookAhead = options.xLookAhead || defaultLookAhead;
    }

    data.halfHeight = data.height / 2;
    data.y = game.objects.view.data.world.height - data.height - 1;

  }

  function refreshHeight() {

    // special case: BnB pref change / init logic
    if (options.isEnemy || !gamePrefs.bnb) {
      data.height = 11;
    } else {
      // if role (engineer), then BnB now
      data.height = options.role ? 30.66 : 11;
    }

    refreshMeasurements();
    
  }

  defaultLookAhead = 16;

  css = common.inheritCSS({
    className: null,
    beavis: 'beavis',
    butthead: 'butthead',
    infantry: TYPES.infantry,
    engineer: TYPES.engineer,
    stopped: 'stopped'
  });

  data = common.inheritData({
    type: TYPES.infantry,
    frameCount: Math.random() > 0.5 ? 5 : 0,
    bottomAligned: true,
    energy: 2,
    energyMax: 2,
    role: options.role || 0,
    roles: [TYPES.infantry, TYPES.engineer],
    isBeavis: !options.isEnemy && !!options.isBeavis,
    isButthead: !options.isEnemy && !!options.isButthead,
    stopped: false,
    noFire: false,
    direction: 0,
    width: 10,
    halfWidth: 5,
    height,
    halfHeight: height / 2,
    fireModulus: 10,
    vX: (options.isEnemy ? -1 : 1),
    // how fast the infantry "walk", taking relative paces / steps so they still move 10 pixels in 10 frames
    vXFrames: [0.5, 0.75, 1, 1.25, 1.5, 1.5, 1.25, 1, 0.75, 0.5],
    vXFrameOffset: 0,
    xLookAhead: (options.xLookAhead !== undefined ? options.xLookAhead : defaultLookAhead),
    xLookAheadBunker: options.xLookAheadBunker || null,
    unassisted: (options.unassisted !== undefined ? options.unassisted : true),
    inventory: {
      frameCount: 12,
      cost: 5,
      orderCompleteDelay: 5 // last-item-in-order delay (decrements every frameCount animation loop), so tank doesn't overlap if ordered immediately afterward.
    },
    extraTransforms: null,
    x: options.x || 0,
    // one more pixel, making a "headshot" look more accurate
    y: game.objects.view.data.world.height - height - 1,
    // slight offset for sprite vs. logical position
    yOffset: 1
  }, options);

  refreshHeight();

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    dom,
    die,
    init: initInfantry,
    moveTo,
    refreshHeight,
    resume,
    stop
  };

  defaultItems = getTypes('tank, van, missileLauncher, infantry, engineer, helicopter, turret', { exports });

  nearby = {
    options: {
      source: exports,
      targets: undefined,
      useLookAhead: true,
      hit(target) {
        // engineer + turret case? reclaim or repair.
        if (data.role && target.data.type === TYPES.turret) {

          // is there work to do?
          if (target.engineerCanInteract(data.isEnemy)) {
            stop(true);
            target.engineerHit(exports);
          } else {
            // nothing to see here.
            resume();
          }

        } else if (gamePrefs.engineers_repair_bunkers && data.role && target.data.type === TYPES.bunker && data.isEnemy === target.data.isEnemy && target.engineerHit) {

          // engineer + friendly bunker: repair, as needed
          target.engineerHit(exports);

        } else if (target.data.isEnemy !== data.isEnemy) {

          // stop moving, start firing if not a friendly unit

          // BUT, ignore if it's an infantry/engineer -> enemy bunker case.
          // we don't want either types firing at bunkers.
          if (target.data.type === TYPES.bunker) {
            // ensure we're moving, in case we were stopped
            resume();
            return;
          }

          // fire at a non-friendly unit, IF it's actually in front of us.
          // nearby also includes a certain lookAhead amount behind.
          if ((data.isEnemy && target.data.x < data.x) || (!data.isEnemy && data.x < target.data.x)) {

            stop();

          } else {

            // infantry has already passed the nearby unit.
            resume();

          }

        } else {

          // failsafe: infantry may have stopped to fire at an engineer repairing a bunker.
          // ensure the infantry stop firing, by resuming "walking."
          resume();

        }
      },
      miss() {
        // resume moving, stop firing.
        resume();
      }
    },
    // who gets fired at (or interacted with)?
    // infantry can also claim enemy bunkers, or repair the balloons on friendly ones.
    items: options.nearbyItems || defaultItems.concat(getTypes('bunker:all', { exports })),
    targets: []
  };

  collision = {
    options: {
      source: exports,
      targets: undefined,
      hit(target) {
        /**
         * bunkers and other objects infantry can interact with have an infantryHit() method.
         * if no infantryHit(), just die.
         * this is sort of an edge case, to prevent parachuting infantry landing in the middle of a tank.
         * this would normally cause both objects to stop and fire, but unable to hit one another due to the overlap.
         */
        if (!data.role && target.infantryHit) {
          // infantry hit bunker or other object
          target.infantryHit(exports);
        } else if (data.role && target.engineerHit) {
          // engineer hit bunker or other object
          target.engineerHit(exports);
        } else if (target.data.type !== TYPES.bunker && target.data.type !== TYPES.endBunker) {
          // probably a tank.
          data.attacker = target;
          die();
        }
      }
    },
    items: getTypes('bunker:all, tank:enemy', { exports })
  };

  return exports;

};

export { Infantry };