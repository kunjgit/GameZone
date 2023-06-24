import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { gameType } from '../aa.js';
import { rndInt, worldWidth, TYPES, rngInt, rngPlusMinus } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { zones } from '../core/zones.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';
import { gamePrefs } from '../UI/preferences.js';

const Balloon = (options = {}) => {

  let css, data, dom, height, objects, radarItem, reset, exports;

  function checkRespawn() {

    // odd edge case - data not always defined if destroyed at the right time?
    if (data?.canRespawn && data?.dead && !objects.bunker?.data?.dead) {
      reset();
    }

  }

  function setEnemy(isEnemy) {

    if (data.isEnemy === isEnemy) return;

    data.isEnemy = isEnemy;

    zones.changeOwnership(exports);

    if (isEnemy) {
      utils.css.remove(dom.o, css.friendly);
      utils.css.add(dom.o, css.enemy);
    } else {
      utils.css.remove(dom.o, css.enemy);
      utils.css.add(dom.o, css.friendly);
    }

    // apply CSS animation effect, and stop/remove in one second.
    // this prevents the animation from replaying when switching
    // between on / off-screen.
    utils.css.add(dom.o, css.animating);

    data.frameTimeout = common.setFrameTimeout(() => {
      if (!dom.o) return;
      utils.css.remove(dom.o, css.animating);
      data.frameTimeout = null;
    }, 1200);

  }

  function attachChain(chain = null) {

    // a "circular" loop that's actually a chain. ;)
    objects.chain = chain;
    objects.chain?.attachBalloon(exports);

  }

  function detachFromBunker() {

    if (data.detached) return;

    data.detached = true;

    // and become hostile.

    if (!data.hostile) {
      data.hostile = true;
      zones.changeOwnership(exports);
    }

    // disconnect bunker <-> balloon references
    if (objects.bunker) {
      // the balloon will now "own" the chain.
      objects.bunker.nullifyBalloon();
      objects.bunker = null;
    } else {
      // if no bunker to detach, there should be no chain, either.
      attachChain();
    }

  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    // pop!
    utils.css.add(dom.o, css.exploding);

    if (sounds.balloonExplosion) {
      playSound(sounds.balloonExplosion, exports);
      if (gamePrefs.bnb && data.isOnScreen) {
        playSound(sounds.bnb.beavisPoop, exports);
      }
    }

    effects.inertGunfireExplosion({ exports });

    effects.domFetti(exports, dieOptions.attacker);

    effects.smokeRing(exports, { parentVX: data.vX, parentVY: data.vY });

    if (gameType === 'hard' || gameType === 'extreme') {
      effects.shrapnelExplosion(data, {
        count: 3 + rngInt(3, TYPES.shrapnel),
        velocity: rngInt(4, TYPES.shrapnel)
      });
    }

    // sanity check: balloon may be almost immediately restored
    // if shot while a group of infantry are passing by the bunker,
    // so only "finish" dying if still dead.

    // radar die -> hide has its own timeout, it will check
    // the parent (i.e., this) balloon's `data.dead` before hiding.
    radarItem.die();

    data.deadTimer = common.setFrameTimeout(() => {
      data.deadTimer = null;

      // sanity check: don't hide if already respawned
      if (!data.dead) return;

      if (dom.o) {
        // hide the balloon
        utils.css.swap(dom.o, css.exploding, css.dead);
      }
    }, 550);

    zones.leaveAllZones(exports);

    data.dead = true;

    common.onDie(exports, dieOptions);

  }

  function applyAnimatingTransition() {

    // balloons might be off-screen, then return on-screen
    // and will not animate unless explicitly enabled.
    // this adds the animation class temporarily.
    if (!dom?.o) return;

    // enable transition (balloon turning left or right, or dying.)
    utils.css.add(dom.o, css.animating);

    // reset, if previously queued.
    if (data.animationFrameTimeout) {
      data.animationFrameTimeout.reset();
    }

    data.animationFrameTimeout = common.setFrameTimeout(() => {
      data.animationFrameTimeout = null;
      // balloon might have been destroyed.
      if (!dom?.o) return;
      utils.css.remove(dom.o, css.animating);
      data.frameTimeout = null;
    }, 1200);

  }

  function isOnScreenChange(/*isOnScreen*/) {

    // ignore if still tethered
    if (!data.detached) return;

    // chains don't get `isOnScreenChange()`, typically connected to bunkers or balloons
    objects.chain?.isJerking(data.isOnScreen);

  }

  function animate() {

    if (data.dead) {

      checkRespawn();

      // explosion underway: move, accounting for scroll
      if (data.deadTimer) {
        sprites.moveWithScrollOffset(exports);
        return;
      }

      // allow balloon to be "GCed" only when free-floating, separated from bunker
      return data.dead && !data.deadTimer && (!objects.bunker || objects.bunker?.data?.dead);

    }

    // not dead...

    effects.smokeRelativeToDamage(exports);

    if (!data.detached) {

      // move relative to bunker

      if ((data.y >= data.maxY && data.verticalDirection > 0) || (data.y <= data.minY && data.verticalDirection < 0)) {
        data.verticalDirection *= -1;
      }

      data.y += data.verticalDirection;

    } else {

      // free-floating balloon

      data.frameCount++;

      if (data.frameCount % data.windModulus === 0) {

        data.windOffsetX += (rngPlusMinus(1, data.type) * 0.25);

        data.windOffsetX = Math.max(-3, Math.min(3, data.windOffsetX));

        if (data.windOffsetX > 0 && data.direction !== 1) {

          // heading right
          utils.css.remove(dom.o, css.facingLeft);
          utils.css.add(dom.o, css.facingRight);

          applyAnimatingTransition();

          data.direction = 1;

        } else if (data.windOffsetX < 0 && data.direction !== -1) {

          // heading left
          utils.css.remove(dom.o, css.facingRight);
          utils.css.add(dom.o, css.facingLeft);

          applyAnimatingTransition();

          data.direction = -1;

        }

        data.windOffsetY += (rngPlusMinus(1, data.type) * 0.05);

        data.windOffsetY = Math.max(-0.5, Math.min(0.5, data.windOffsetY));

        // and randomize
        if (!net.active) {
          data.windModulus = 32 + rndInt(32);
        }

      }

      // if at end of world, change the wind and prevent randomization until within world limits
      // this allows balloons to drift a little over, but they will return.
      if (data.x + data.windOffsetX >= data.maxX) {
        data.frameCount = 0;
        data.windOffsetX -= 0.1;
      } else if (data.x + data.windOffsetX <= data.minX) {
        data.frameCount = 0;
        data.windOffsetX += 0.1;
      }

      // limit to screen, too
      if (data.y + data.windOffsetY >= data.maxY) {
        data.frameCount = 0;
        data.windOffsetY -= 0.1;
      } else if (data.y + data.windOffsetY <= data.minY) {
        data.frameCount = 0;
        data.windOffsetY += 0.1;
      }

      data.x += data.windOffsetX;
      data.y += data.windOffsetY;

      zones.refreshZone(exports);

    }

    sprites.moveWithScrollOffset(exports);

  }

  reset = () => {

    // respawn can actually happen now

    data.energy = data.energyMax;

    // restore default vertical
    data.verticalDirection = data.verticalDirectionDefault;

    // look ma, no longer dead!
    data.dead = false;

    // reset position, too
    data.y = common.bottomAlignedY(-data.height);

    radarItem.reset();

    data.canRespawn = false;

    if (data.deadTimer) {
      data.deadTimer.reset();
      data.deadTimer = null;
    }

    zones.refreshZone(exports);

    // update UI, right away?
    animate();

    utils.css.remove(dom.o, css.exploding);
    utils.css.remove(dom.o, css.dead);

    sprites.updateEnergy(exports);

    // presumably, triggered by an infantry.
    if (sounds.chainRepair) {
      playSound(sounds.chainRepair, exports);
    }

  };

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    // TODO: remove?
    dom.o._style.setProperty('margin-left', `${data.leftMargin}px`);

    sprites.moveTo(exports);

  }

  function initBalloon() {

    initDOM();

    if (!objects.bunker) {
      // ensure we're free of chain + bunker
      attachChain();
      detachFromBunker();
    }

    // TODO: review hacky "can respawn" parameter
    radarItem = game.objects.radar.addItem(exports, dom.o.className, true);

  }

  height = 16;

  objects = {
    bunker: options.bunker || null,
    chain: null
  };

  css = common.inheritCSS({
    className: TYPES.balloon,
    friendly: 'facing-right',
    enemy: 'facing-left',
    facingLeft: 'facing-left',
    facingRight: 'facing-right'
  });

  data = common.inheritData({
    type: TYPES.balloon,
    canRespawn: false,
    frameCount: 0,
    windModulus: 16,
    windOffsetX: 0,
    windOffsetY: 0,
    energy: 3,
    energyMax: 3,
    direction: 0,
    detached: false,
    hostile: !objects.bunker, // dangerous when detached
    verticalDirection: rngPlusMinus(1, TYPES.balloon),
    verticalDirectionDefault: 1,
    leftMargin: options.leftMargin || 0,
    width: 38,
    height,
    halfWidth: 19,
    halfHeight: height / 2,
    deadTimer: null,
    minX: 0,
    maxX: worldWidth,
    minY: 48,
    // don't allow balloons to fly into ground units, generally speaking
    maxY: game.objects.view.data.world.height - height - 32,
    domFetti: {
      colorType: 'yellow',
      elementCount: 20 + rndInt(40),
      startVelocity: 10 + rndInt(15),
      spread: 360
    }
  }, options);

  // random Y start position, unless specified
  data.y = data.y || rngInt(data.maxY, data.type);

  dom = {
    o: null
  };

  exports = {
    animate,
    attachChain,
    data,
    detachFromBunker,
    die,
    dom,
    init: initBalloon,
    isOnScreenChange,
    objects,
    reset,
    setEnemy
  };

  return exports;

};

export { Balloon };