import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { rndInt, worldHeight, tutorialMode, TYPES, rng, rngInt } from '../core/global.js';
import { skipSound, playSound, sounds } from '../core/sound.js';
import { gamePrefs } from '../UI/preferences.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';

const ParachuteInfantry = (options = {}) => {

  let css, dom, data, radarItem, exports;

  function openParachute() {

    if (data.parachuteOpen) return;

    // undo manual assignment from free-fall animation
    dom.oTransformSprite.style.backgroundPosition = '';

    utils.css.add(dom.o, css.parachuteOpen);

    // update model with open height
    data.height - 19;
    data.halfHeight = data.height / 2;

    // randomize the animation a little
    dom.oTransformSprite._style.setProperty('animation-duration', `${0.75 + rng(0.75, data.type)}s`);

    // and parachute speed, too.
    data.vY = 0.3 + rng(0.3, data.type);

    // make the noise
    if (sounds.parachuteOpen) {
      playSound(sounds.parachuteOpen, exports);
    }

    data.parachuteOpen = true;

  }

  function die(dieOptions = {}) {

    if (data.dead) return;

    if (!dieOptions?.silent) {

      effects.inertGunfireExplosion({ exports });

      if (gamePrefs.bnb) {

        if (data.isEnemy) {
          playSound(sounds.bnb.dvdPrincipalScream, exports);
        } else {
          playSound(sounds.bnb.screamShort, exports);
        }

      } else {

        playSound(sounds.scream, exports);

      }

      common.addGravestone(exports);

    }
    
    sprites.removeNodesAndUnlink(exports);

    data.energy = 0;

    data.dead = true;

    radarItem.die(dieOptions);

    common.onDie(exports, dieOptions);

  }

  function hit(hitPoints, target) {

    // special case: helicopter explosion resulting in a parachute infantry - make parachute invincible to shrapnel.
    if (target?.data?.type === 'shrapnel' && data.ignoreShrapnel) {
      return false;
    }

    return common.hit(exports, hitPoints, target);

  }

  function animate() {

    let randomWind, bgY;

    if (data.dead) return !dom.o;

    // falling?

    sprites.moveTo(exports, data.x + data.vX, data.y + data.vY);

    if (!data.parachuteOpen) {

      if (data.y >= data.parachuteOpensAtY) {

        openParachute();

      } else if (data.frameCount % data.panicModulus === 0) {
        // like Tom Petty, free fallin'.

        if (data.isOnScreen) {
          dom.oTransformSprite._style.setProperty('background-position', `0px ${-(60 + (data.frameHeight * data.panicFrame))}px`);
        }

        // alternate between 0/1
        data.panicFrame = !data.panicFrame;

      }

    } else {

      // (potentially) gone with the wind.

      if (data.frameCount % data.windModulus === 0) {

        // choose a random direction?
        if (rng(1, data.type) > 0.5) {

          // -1, 0, 1
          randomWind = rngInt(3, data.type) - 1;

          data.vX = randomWind * 0.25;

          if (randomWind === -1) {

            // moving left
            bgY = -20;

          } else if (randomWind === 1) {

            // moving right
            bgY = -40;

          } else {

            // not moving!
            bgY = 0;

          }

          if (data.isOnScreen) {
            dom.oTransformSprite._style.setProperty('background-position', (`0px ${bgY}px`));
          }

          // choose a new wind modulus, too.
          data.windModulus = 64 + rndInt(64);

        } else {

          // reset wind effect

          data.vX = 0;

          if (data.isOnScreen) {
            dom.oTransformSprite._style.setProperty('background-position', '0px 0px');
          }

        }

      }

    }

    if (data.parachuteOpen && data.y >= data.maxYParachute) {

      data.landed = true;

      // touchdown! die "quietly", and transition into new infantry.
      // in the network case, this will kill the remote.
      die({ silent: true });

      const params = {
        x: data.x,
        isEnemy: data.isEnemy,
        // exclude from recycle "refund" / reward case
        unassisted: false
      };

      game.addObject(TYPES.infantry, params);

    } else if (!data.parachuteOpen) {

      if (data.y > (data.maxYPanic / 2) && !data.didScream) {

        if (gamePrefs.bnb) {

          if (data.isEnemy) {
            playSound(sounds.bnb.dvdPrincipalScream, exports);
          } else {
            playSound(sounds.bnb.screamPlusSit, exports, {
              onplay: (sound) => {
                // too late if off-screen, parachute open, dead, or landed (in which case, died silently)
                if (!data.isOnScreen || data.parachuteOpen || data.landed || data.dead) {
                  skipSound(sound);
                }
              }
            });
          }
  
        } else {
  
          playSound(sounds.scream, exports);
  
        }
  
        data.didScream = true;

      }

      if (data.y >= data.maxY) {

        // hit ground, and no parachute. gravity is a cruel mistress.

        // special case: mark the "occasion."
        data.didHitGround = true;

        // reposition, first
        sprites.moveTo(exports, data.x, data.maxY);

        // balloon-on-skin "splat" sound
        if (sounds.splat) {
          playSound(sounds.splat, exports);
        }

        die();

      }

    }

    data.frameCount++;

  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id,
      isEnemy: (data.isEnemy ? css.enemy : false)
    });

    // CSS animation (rotation) gets applied to this element
    dom.oTransformSprite = sprites.makeTransformSprite();
    dom.o.appendChild(dom.oTransformSprite);

    sprites.moveTo(exports);

  }

  function checkSmartMissileDecoy() {
  
    // given the current helicopter, find missiles targeting it and possibly distract them.

    game.objects[TYPES.smartMissile].forEach((missile) => missile.maybeTargetDecoy(exports));
  
  }

  function initParachuteInfantry() {

    initDOM();

    radarItem = game.objects.radar.addItem(exports, dom.o.className);

    checkSmartMissileDecoy();

  }

  css = common.inheritCSS({
    className: 'parachute-infantry',
    parachuteOpen: 'parachute-open'
  });

  let type = TYPES.parachuteInfantry;

  data = common.inheritData({
    type,
    frameCount: rngInt(3, type),
    panicModulus: 3,
    windModulus: options.windModulus || 32 + rngInt(32, type),
    panicFrame: rngInt(3, type),
    energy: 2,
    energyMax: 2,
    parachuteOpen: false,
    // "most of the time", a parachute will open. no idea what the original game did. 10% failure rate.
    parachuteOpensAtY: options.parachugeOpensAtY || (options.y + (rng(370 - options.y, type)) + (!tutorialMode && rng(1, type) > 0.9 ? 999 : 0)),
    direction: 0,
    width: 10,
    halfWidth: 5,
    height: 11, // 19 when parachute opens
    halfHeight: 5.5,
    frameHeight: 20, // each sprite frame
    ignoreShrapnel: options.ignoreShrapnel || false,
    didScream: false,
    didHitGround: false,
    landed: false,
    vX: 0, // wind
    vY: options.vY || 2 + rng(1, type) + rng(1, type),
    maxY: worldHeight + 3,
    maxYPanic: 300,
    maxYParachute: worldHeight - 13,
  }, options);

  dom = {
    o: null,
    oTransformSprite: null
  };

  exports = {
    animate,
    data,
    dom,
    die,
    hit,
    init: initParachuteInfantry,
    radarItem
  };

  return exports;

};

export { ParachuteInfantry };