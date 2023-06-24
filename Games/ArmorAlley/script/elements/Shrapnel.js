import { utils } from '../core/utils.js';
import { game } from '../core/Game.js';
import { common } from '../core/common.js';
import { collisionTest } from '../core/logic.js';
import { getTypes, plusMinus, rnd, rndInt, rng, rngInt, TYPES, worldHeight } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { Smoke } from './Smoke.js';
import { sprites } from '../core/sprites.js';

const Shrapnel = (options = {}) => {

  let css, dom, data, collision, radarItem, scale, exports, type = TYPES.shrapnel;

  function moveTo(x, y) {

    let relativeScale;

    // shrapnel is magnified somewhat when higher on the screen, "vaguely" 3D
    relativeScale = Math.min(1, y / (worldHeight * 0.95));

    // allow slightly larger, and a fair bit smaller
    relativeScale = 1.05 - (relativeScale * data.scaleRange);

    data.relativeScale = relativeScale;

    // scale, 3d rotate, and spin
    data.extraTransforms = `scale3d(${[relativeScale, relativeScale, 1].join(',')}) rotate3d(1, 1, 1, ${data.rotate3DAngle}deg) rotate3d(0, 0, 1, ${data.spinAngle}deg)`;

    // move, and retain 3d scaling (via extraTransforms)
    sprites.moveTo(exports, x, y);

  }

  function shrapnelNoise() {

    if (!data.hasSound) return;

    const i = `hit${sounds.shrapnel.counter}`;

    sounds.shrapnel.counter += (sounds.shrapnel.counter === 0 && Math.random() > 0.5 ? 2 : 1);

    if (sounds.shrapnel.counter >= sounds.shrapnel.counterMax) {
      sounds.shrapnel.counter = 0;
    }

    if (sounds.shrapnel[i]) {
      playSound(sounds.shrapnel[i], exports);
    }

  }

  function die() {

    if (data.dead) return;

    data.energy = 0;

    data.dead = true;

    shrapnelNoise();

    // random fade duration
    const delay = 1000 + rnd(1500);

    // this shouldn't be needed, but CSS seems to be applying "all" or ignoring the property.
    dom.o.style.setProperty('transition-property', 'opacity');

    dom.o.style.setProperty('transition-duration', delay + 'ms');

    utils.css.add(dom.o, css.stopped);

    data.deadTimer = common.setFrameTimeout(() => {
      sprites.removeNodes(dom);
      data.deadTimer = null;
    }, delay + 50);

    if (radarItem) {
      radarItem.die({
        silent: true
      });
    }

    common.onDie(exports);

  }

  function hitAndDie(target) {

    let targetType, damageTarget = true;

    if (!target) {
      die();
      return;
    }

    // hackish: there was a collision, but "pass-thru" if the target says to ignore shrapnel.
    // e.g., parachute infantry dropped from a helicopter while it's exploding mid-air,
    // so the infantry doesn't die and the shrapnel isn't taken out in the process.
    if (target.data.ignoreShrapnel) return;

    // shrapnel hit something; what should it sound like, if anything?
    targetType = target.data.type;

    if (targetType === TYPES.helicopter) {

      playSound(sounds.boloTank, exports);

      // extra special case: BnB + enemy turret / chopper / infantry etc. firing at player.
      if (data.isEnemy && target === game.players.local && target.data.isOnScreen) {
        target.reactToDamage(exports);
      }

    } else if (targetType === TYPES.tank || targetType === TYPES.superBunker) {
      // shrapnel -> [tank | superbunker]: no damage.
      damageTarget = false;

      // ricochet if shrapnel is connected to "sky" units (helicopter, balloon etc.)
      // otherwise, die silently. this helps prevent ground units' shrapnel from causing mayhem with neighbouring tanks etc.
      if (data.ricochetTypes.includes(data.parentType)) {
        ricochet(targetType);
        // bail early, don't die
        return;
      }
    } else if (sounds.types.metalHit.includes(targetType)) {
      playSound(sounds.metalHit, exports);
    } else if (sounds.types.genericSplat.includes(targetType)) {
      playSound(sounds.genericSplat, exports);
    }

    if (damageTarget) {
      common.hit(target, data.damagePoints, exports);
    }

    // "embed", so this object moves relative to the target it hit
    sprites.attachToTarget(exports, target);

    die();

  }

  function ricochet(targetType) {

    // bounce upward if ultimately heading down
    if ((data.vY + data.gravity) <= 0) return;

    // at least...
    data.vY = Math.max(data.vY, data.maxVY / 6);

    // but no more than...
    data.vY = Math.min(data.vY, data.maxVY / 3);

    // ensure we end negative, and lose (or gain) a bit of velocity
    data.vY = Math.abs(data.vY) * -data.rndRicochetAmount;

    // sanity check: don't get stuck "inside" tank or super bunker sprites.
    // ensure that the shrapnel stays at or above the height of both.
    data.y = Math.min(worldHeight - ((common.ricochetBoundaries[targetType]) || 16), data.y);

    // randomize vX strength, and randomly reverse direction.
    data.vX += Math.random();
    data.vX *= (Math.random() > 0.75 ? -1 : 1);

    // and, throttle
    if (data.vX > 0) {
      data.vX = Math.min(data.vX, data.maxVX);
    } else {
      data.vX = Math.max(data.vX, data.maxVX * -1);
    }

    // reset "gravity" effect, too.
    data.gravity = data.gravityRate;

    // data.y may have been "corrected" - move again, just to be safe.
    moveTo(data.x + data.vX, data.y + (Math.min(data.maxVY, data.vY + data.gravity)));

    playSound(sounds.ricochet, exports);

  }

  function animate() {

    if (data.dead) {

      // keep moving with scroll, while visible
      sprites.moveWithScrollOffset(exports);

      return (!data.deadTimer && !dom.o);

    }

    data.rotate3DAngle += data.rotate3DAngleIncrement;
    data.spinAngle += data.spinAngleIncrement;

    moveTo(data.x + data.vX, data.y + (Math.min(data.maxVY, data.vY + data.gravity)));

    // random: smoke while moving?
    if (data.isOnScreen && Math.random() >= 0.99) {
      makeSmoke();
    }

    // did we hit the ground?
    if (data.y - data.height >= worldHeight) {
      // align w/ground, slightly lower
      moveTo(data.x, worldHeight - (12 * data.relativeScale) + 3);
      die();
    }

    // collision check
    collisionTest(collision, exports);

    data.gravity *= data.gravityRate;

    return (data.dead && !data.deadTimer && !dom.o);

  }

  function makeSmoke() {

    game.objects.smoke.push(Smoke({
      x: data.x + 6 + rnd(6) * 0.33 * plusMinus(),
      y: data.y + 6 + rnd(6) * 0.33 * plusMinus(),
      vX: rnd(6) * plusMinus(),
      vY: rnd(-5),
      spriteFrame: rndInt(5)
    }));

  }

  function initShrapnel() {

    dom.o = sprites.create({
      className: css.className
    });

    dom.oTransformSprite = sprites.makeTransformSprite();
    dom.o.appendChild(dom.oTransformSprite);

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

    // apply the type of shrapnel, reversing any scaling (so we get the original pixel dimensions)
    dom.oTransformSprite._style.setProperty('background-position', `${data.spriteType * -data.width * 1 / data.scale}px 0px`);

    radarItem = game.objects.radar.addItem(exports, dom.o.className);

    if (data.isEnemy) {
      utils.css.add(radarItem.dom.o, css.enemy);
    }

    // special case for end game (base) explosion: don't create identical "clouds" of smoke *at* base.
    if (data.isOnScreen && !options.noInitialSmoke) {
      makeSmoke();
    }

    shrapnelNoise();

  }

  function rndAngle() {
    return plusMinus(rnd(35));
  }

  // default
  scale = options.scale || (0.8 + rng(0.15, type));

  css = common.inheritCSS({
    className: 'shrapnel',
    stopped: 'stopped'
  });

  data = common.inheritData({
    type,
    parentType: (options.type || null),
    spriteType: rngInt(4, type),
    direction: 0,
    // sometimes zero / non-moving?
    vX: options.vX || 0,
    vY: options.vY || 0,
    maxVX: 36,
    maxVY: 32,
    gravity: 1,
    // randomize fall rate
    gravityRate: 1.05 + rng(.065, type),
    width: 12 * scale,
    height: 12 * scale,
    scale,
    scaleRange: 0.4 + rng(0.25, type),
    rotate3DAngle: rndAngle(),
    rotate3DAngleIncrement: rndAngle(),
    spinAngle: rndAngle(),
    spinAngleIncrement: rndAngle(),
    extraTransforms: '',
    hostile: true,
    damagePoints: 0.5,
    hasSound: !!options.hasSound,
    rndRicochetAmount: 0.5 + rng(1, type),
    // let shrapnel that originates "higher up in the sky" from the following types, bounce off tanks and super bunkers
    ricochetTypes: [TYPES.balloon, TYPES.helicopter, TYPES.smartMissile],
  }, options);

  dom = {
    o: null,
    oTransformSprite: null,
  };

  exports = {
    animate,
    data,
    dom,
    die,
    init: initShrapnel
  };

  collision = {
    options: {
      source: exports,
      targets: undefined,
      hit(target) {
        hitAndDie(target);
      }
    },
    items: !game.objects.editor && getTypes('superBunker, bunker, helicopter, balloon, tank, van, missileLauncher, infantry, parachuteInfantry, engineer, smartMissile, turret', { group: 'all' })
  };

  return exports;

};

export { Shrapnel };