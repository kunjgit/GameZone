import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { poolBoy } from '../core/poolboy.js';
import { collisionTest } from '../core/logic.js';
import { rndInt, plusMinus, TYPES, getTypes, rnd } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';

const GunFire = (options = {}) => {

    let css, data, dom, collision, exports, frameTimeout, radarItem;

    function randomDistance() {
      return `${rndInt(10) * plusMinus()}px`;
    }

    function spark() {

      if (!dom.o) return;

      utils.css.add(dom.o, css.spark);

      // randomize a little

      if (Math.random() > 0.5) {
        dom.o._style.setProperty('margin-left', randomDistance());
      }

      if (Math.random() > 0.5) {
        dom.o._style.setProperty('margin-top', randomDistance());
      }

      if (data.isOnScreen) {
        sprites.applyRandomRotation(dom.o);
      }

    }

    function die(force) {

      // aieee!

      if (data.dead && !force) return;

      data.dead = true;

      sprites.removeNodesAndUnlink(exports);

      if (radarItem) {
        radarItem.die({
          silent: true
        });
      }

      common.onDie(exports);

    }

    function sparkAndDie(target) {

      // hackish: bail if spark -> die already scheduled.
      if (frameTimeout) return;

      let now;
      let canSpark = true;
      let canDie = true;

      if (target) {

        // special case: tanks hit turrets for a lot of damage.
        if (data.parentType === TYPES.tank && target.data.type === TYPES.turret) {
          data.damagePoints = 8;
        }

        // special case: tanks are impervious to infantry gunfire, end-bunkers and super-bunkers are impervious to helicopter gunfire.
        if (
          !(data.parentType === TYPES.infantry && target.data.type === TYPES.tank)
          && !(data.parentType === TYPES.helicopter && (target.data.type === TYPES.endBunker || target.data.type === TYPES.superBunker))
        ) {
          common.hit(target, data.damagePoints, exports);
        }

        // play a sound for certain targets and source -> target combinations

        if (target.data.type === TYPES.helicopter) {

          playSound(sounds.boloTank, exports);

          data.domFetti.startVelocity = (Math.abs(data.vX) + Math.abs(data.vY));

          effects.domFetti(exports, target);

        } else if (

          target.data.type === TYPES.tank
          || target.data.type === TYPES.helicopter
          || target.data.type === TYPES.van
          || target.data.type === TYPES.bunker
          || target.data.type === TYPES.endBunker
          || target.data.type === TYPES.superBunker
          // helicopter -> turret
          || (data.parentType === TYPES.helicopter && target.data.type === TYPES.turret)

        ) {

          // impervious to gunfire?
          if (
            // infantry -> tank = ricochet.
            data.parentType === TYPES.infantry && target.data.type === TYPES.tank

            // nothing can hit end or super bunkers, except tanks.
            || ((target.data.type === TYPES.endBunker || target.data.type === TYPES.superBunker) && data.parentType !== TYPES.tank)
          ) {

            // up to five infantry may be firing at the tank.
            // prevent the sounds from piling up.
            now = performance.now();

            if (now - common.lastInfantryRicochet > data.ricochetSoundThrottle) {
              playSound(sounds.ricochet, exports);
              common.lastInfantryRicochet = now;
            }
            
            canSpark = false;
            canDie = false;

            // bounce! reverse, and maybe flip on vertical.
            // hackish: if gunfire *originated* "above", consider this a vertical bounce.
            if (options.y < 358) {
              data.vY *= -1;
            } else if (net.active) {
              data.vX *= -1;
            } else {
              data.vX *= -rnd(1);
              data.vY *= rnd(1) * plusMinus();
            }

            // hackish: move immediately away, reduce likelihood of getting "stuck" in a bounce.
            data.x += data.vX;
            data.y += data.vY;
          } else {
            // otherwise, it "sounds" like a hit.
            if (target.data.type === TYPES.bunker) {
              playSound(sounds.concreteHit, exports);
            } else {
              playSound(sounds.metalHit, exports);
            }
          }

        } else if (target.data.type === TYPES.balloon && sounds.balloonHit) {

          playSound(sounds.balloonHit, exports);

        } else if (target.data.type === TYPES.turret) {

          playSound(sounds.metalHit, exports);

        } else if (target.data.type === TYPES.gunfire) {

          // gunfire hit gunfire!
          playSound(sounds.ricochet, exports);
          playSound(sounds.metalHit, exports);

        }

      }

      // steal node from pool, not to be recycled because we're changing dimensions and mutating it.
      if (data.domPool && (canSpark || canDie)) {
        dom = Object.assign(dom, data.domPool.steal().dom);
        data.domPool = null;
      }

      if (canSpark) spark();

      if (canDie) {

        // "embed", so this object moves relative to the target it hit
        sprites.attachToTarget(exports, target);

        utils.css.add(dom.o, css.dead);

        // immediately mark as dead, prevent any more collisions.
        data.dead = true;

        // and cleanup shortly.
        frameTimeout = common.setFrameTimeout(() => {
          // use the force, indeed.
          const force = true;
          die(force);
          frameTimeout = null;
        }, 250);

        if (target.data.type !== TYPES.infantry) {

          // hackish: override for special case
          data.domFetti = {
            colorType: 'grey',
            elementCount: 1 + rndInt(1),
            startVelocity: (Math.abs(data.vX) + Math.abs(data.vY)),
            angle: 0
          };

          effects.domFetti(exports, target);

        }

      }

    }

    function animate() {

      // pending die()
      if (frameTimeout) {
        // keep moving with scroll, while visible
        sprites.moveWithScrollOffset(exports);
        return false;
      }

      if (data.dead) return true;

      // disappear if created on-screen, but has become off-screen.
      if (data.isInert && !data.isOnScreen) {
        die();
        return;
      }

      if (!data.isInert && !data.expired && data.frameCount > data.expireFrameCount) {
        utils.css.add(dom.o, css.expired);
        if (radarItem) utils.css.add(radarItem.dom.o, css.expired);
        data.expired = true;
      }

      if (data.isInert || data.expired) {
        data.gravity *= data.gravityRate;
      }

      sprites.moveTo(exports, data.x + data.vX, data.y + data.vY + (data.isInert || data.expired ? data.gravity : 0));

      data.frameCount++;

      // inert "gunfire" animates until it hits the ground.
      if (!data.isInert && data.frameCount >= data.dieFrameCount) {
        die();
      }

      // bottom?
      if (data.y > game.objects.view.data.battleField.height) {
        if (!data.isInert) {
          playSound(sounds.bulletGroundHit, exports);
        }
        die();
      }

      if (!data.isInert) {
        collisionTest(collision, exports);
      }

      // notify caller if now dead and can be removed.
      return (data.dead && !dom.o && !dom.domPool);

    }

    function initDOM() {

      data.domPool = poolBoy.request({ className: css.className });

      // merge domPool dom o + transform nodes
      Object.assign(dom, data.domPool.dom);
      
    }

    function initGunFire() {

      initDOM();

      // randomize a little: ±1 pixel.
      if (!net.active) {
        data.x += plusMinus();
        data.y += plusMinus();
      }

      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

      if (!data.isInert) {

        radarItem = game.objects.radar.addItem(exports, dom.o.className);

        if (data.isEnemy) {
          utils.css.add(radarItem.dom.o, css.enemy);
        }

      }

    }

    css = common.inheritCSS({
      className: 'gunfire',
      expired: 'expired',
      spark: 'spark'
    });

    data = common.inheritData({
      type: 'gunfire',
      parent: options.parent || null,
      parentType: options.parentType || null,
      isInert: !!options.isInert,
      isEnemy: options.isEnemy,
      expired: false,
      frameCount: 0,
      expireFrameCount: options.expireFrameCount || 25,
      dieFrameCount: options.dieFrameCount || 75, // live up to N frames, then die?
      width: 2,
      height: 1,
      gravity: (options.isInert ? 0.25 : 1),
      gravityRate: (options.isInert ? 1.09 : 1.1) + (Math.random() * 0.025),
      damagePoints: options.damagePoints || 1,
      ricochetSoundThrottle: (options?.parentType === TYPES.infantry ? 250 : 100),
      target: null,
      vyMax: 32,
      domFetti: {
        elementCount: 1 + rndInt(1),
        startVelocity: 2 + rndInt(10),
        spread: 360,
        decay: 0.935
      },
      domPool: null
    }, options);

    // hackish
    data.domFetti.startVelocity = data.vX;

    dom = {
      o: null
    };

    exports = {
      animate,
      data,
      dom,
      die,
      init: initGunFire
    };

    collision = {
      options: {
        source: exports,
        targets: undefined,
        checkTweens: !data.isInert,
        hit(target) {
          // special case: ignore inert gunfire. let tank gunfire pass thru if 0 energy, or friendly.
          if (!data.isInert && !(data.parentType === TYPES.tank && target.data.type === TYPES.endBunker && (target.data.energy === 0 || target.data.isEnemy === data.isEnemy))) {
            sparkAndDie(target);
          }
          // extra special case: BnB + enemy turret / chopper / infantry etc. firing at player.
          if (data.isEnemy && target === game.players.local && target.data.isOnScreen) {
            target.reactToDamage(data.parent);
          }
        }
      },
      // if unspecified, use default list of items which bullets can hit.
      items: options.collisionItems || getTypes('tank, van, bunker, missileLauncher, infantry, parachuteInfantry, engineer, helicopter, balloon, smartMissile, endBunker, superBunker, turret, gunfire', { exports })
    };

    return exports;

  };

  export { GunFire }