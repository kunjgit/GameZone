import { game } from '../core/Game.js';
import { gameType } from '../aa.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { collisionTest } from '../core/logic.js';
import { rad2Deg, plusMinus, rnd, rndInt, worldHeight, TYPES, getTypes } from '../core/global.js';
import { playSound, sounds } from '../core/sound.js';
import { Smoke } from '../elements/Smoke.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';

const Bomb = (options = {}) => {

  let css, data, dom, collision, radarItem, exports;

  function moveTo(x, y, rotateAngle) {

    let deltaX, deltaY, rad;
    
    deltaX = 0;
    deltaY = 0;

    if (x !== undefined) {
      deltaX = x - data.x;
    }

    if (y !== undefined) {
      deltaY = y - data.y;
    }

    rad = Math.atan2(deltaY, deltaX);

    if (deltaX || deltaY) {
      data.lastAngle = rad * rad2Deg;
    }

    data.extraTransforms = `rotate3d(0, 0, 1, ${rotateAngle !== undefined ? rotateAngle : data.lastAngle}deg)` + (data.scale ?  ` scale3d(${data.scale}, ${data.scale}, 1)` : '');

    sprites.moveTo(exports, x, y);

  }

  function die(dieOptions = {}) {

    // aieee!
    let className;
    
    if (data.dead || data.groundCollisionTest) return;

    if (dieOptions.attacker) {
      data.attacker = dieOptions.attacker;
    }

    // possible hit, blowing something up.
    // special case: don't play "generic boom" if we hit a balloon
    if (!dieOptions.omitSound && !dieOptions.hidden && sounds.bombExplosion && dieOptions?.type !== TYPES.balloon) {
      playSound(sounds.bombExplosion, exports);
    }

    if (dieOptions.spark) {
      data.extraTransforms = `rotate3d(0, 0, 1, ${rnd(15) * plusMinus()}deg)`;
    } else {
      // hackish: offset rotation so explosion points upward.
      data.lastAngle -= 90;
      // limit rotation, as well.
      data.lastAngle *= 0.5;
      data.scale = 0.65;
    }

    // bombs blow up big on the ground, and "spark" on other things.
    if (dieOptions.hidden) {
      dom.o.style.visibility = 'hidden';
    } else {
      className = (!dieOptions.spark ? css.explosionLarge : css.spark);
    }

    if (dieOptions.bottomAlign) {

      // bombs explode, and dimensions change when they hit the ground.

      // adjust for larger explosion, "expanding" on both sides
      data.x -= ((data.explosionWidth - data.width) / 2);

      // assign new dimensions for explosion
      data.width = data.explosionWidth;
      data.halfWidth = data.explosionWidth / 2;

      data.height = data.explosionHeight;
      data.halfHeight = data.explosionheight / 2;

      // bottom-align
      // TODO: review why 17, still. :P
      data.y = worldHeight - 17;

      // stop moving
      data.vY = 0;
      data.gravity = 0;

      // reposition immediately
      moveTo(data.x, data.y);

      // hackish: do one more collision check, since coords have changed, before this element is dead.
      // this will cause another call, which can be ignored.
      if (!data.groundCollisionTest) {
        data.groundCollisionTest = true;
        collisionTest(collision, exports);
      }

    } else {

      // align to whatever we hit

      // hacks: if scaling down, subtract full width.
      // "this is in need of techical review." ;)
      if (data.scale) {
        data.x -= data.width;
      }

      if (dieOptions.type && common.ricochetBoundaries[dieOptions.type]) {

        let halfHeight = dieOptions.attacker?.data?.halfHeight || 3;

        // ensure that the bomb stays at or above the height of its target - e.g., bunker or tank.
        data.y = Math.min(worldHeight - common.ricochetBoundaries[dieOptions.type], data.y) - (dieOptions.spark ? - (3 + rnd(halfHeight)) : (data.height * (data.scale || 1)));

        // go there immediately
        moveTo(data.x, data.y);

      } else {

        if (dieOptions.target?.data?.type === TYPES.turret) {
          // special case: align to turret, and randomize a bit.
          const halfWidth = dieOptions.target.data.halfWidth || 3;
          data.x = dieOptions.target.data.x + halfWidth + plusMinus(rnd(halfWidth));
          data.y = dieOptions.target.data.y + rnd(dieOptions.target.data.height);
          dieOptions.extraY = 0;
        }

        // extraY: move bomb spark a few pixels down so it's in the body of the target. applies mostly to tanks.
        moveTo(data.x, data.y + (dieOptions.extraY || 0));

      }

      // "embed", so this object moves relative to the target it hit
      sprites.attachToTarget(exports, dieOptions.target);

    }

    if (dom.o) {

      utils.css.add(dom.o, className);

      data.deadTimer = common.setFrameTimeout(() => {
        sprites.removeNodesAndUnlink(exports);
        data.deadTimer = null;
      }, 1000);

    }

    // TODO: move into something common?
    if (data.isOnScreen) {
      for (let i=0; i<3; i++) {
        game.objects.smoke.push(Smoke({
          x: data.x + (data.width / 2) + (rndInt((data.width / 2)) * 0.33 * plusMinus()),
          y: data.y + 12,
          vX: (rnd(4) * plusMinus()),
          vY: rnd(-4),
          spriteFrame: rndInt(5)
        }));
      }
    }

    effects.domFetti(exports, dieOptions.target);

    data.dead = true;

    if (radarItem) {
      radarItem.die({
        silent: true
      });
    }

    common.onDie(exports, dieOptions);

  }

  function bombHitTarget(target) {

    let spark, bottomAlign, damagePoints, hidden;

    // assume default
    damagePoints = data.damagePoints;

    // some special cases, here

    if (target.data.type === 'smart-missile') {

      die({
        attacker: target,
        type: target.data.type,
        omitSound: true,
        spark: true,
        target
      });

    } else if (target.data.type === 'infantry') {

      /**
       * bomb -> infantry special case: don't let bomb die; keep on truckin'.
       * continue to ground, where larger explosion may take out a group of infantry.
       * only do damage once we're on the ground. this means infantry will play the
       * hit / "smack" sound, but don't die + scream until the bomb hits the ground.
       */
      if (!data.hasHitGround) {
        damagePoints = 0;
      }

    } else {

      // certain targets should get a spark vs. a large explosion
      spark = target.data.type?.match(/tank|parachute-infantry|turret|smart-missile|gunfire/i);

      // hide bomb sprite entirely on collision with these items...
      hidden = data.hidden || target.data.type.match(/balloon|helicopter/i);

      bottomAlign = (!spark && !hidden && target.data.type !== TYPES.superBunker && target.data.type !== TYPES.balloon && target.data.type !== TYPES.gunfire && target.data.type !== TYPES.bunker) || target.data.type === TYPES.infantry;

      data.bottomAlign = bottomAlign;

      die({
        attacker: target,
        type: target.data.type,
        spark,
        hidden,
        bottomAlign,
        // and a few extra pixels down, for tanks (visual correction vs. boxy collision math)
        extraY: (target.data.type?.match(/tank/i) ? 3 + rndInt(3) : 0),
        target
      });

    }

    // if specified, take exact damage.
    if (options.damagePoints) {

      damagePoints = options.damagePoints;

    } else if (target.data.type) {
 
      // special cases for bomb -> target interactions
 
      if (target.data.type === TYPES.helicopter) {

        // one bomb kills a helicopter.
        damagePoints = target.data.energyMax;

      } else if (target.data.type === TYPES.turret) {

        // bombs do more damage on turrets if a direct hit; less, if from a nearby explosion.
        damagePoints = (data.hasHitGround ? 3 : 10);

      } else if (data.hasHitGround) {

        // no specific target match: take 33% cut on bomb damage
        damagePoints = data.damagePointsOnGround;

      }

      // bonus "hit" sounds for certain targets
      if (!data.isMuted) {

        if (target.data.type === TYPES.tank || target.data.type === TYPES.turret) {
          playSound(sounds.metalHit, exports);
        } else if (target.data.type === TYPES.bunker) {
          playSound(sounds.concreteHit, exports);
          data.isMuted = true;
        } else if (target.data.type === TYPES.bomb || target.data.type === TYPES.gunfire) {
          playSound(sounds.ricochet, exports);
        } else if (target.data.type === TYPES.van || target.data.type === TYPES.missileLauncher) {
          playSound(sounds.metalHit, exports);
          playSound(sounds.metalClang, exports);
          data.isMuted = true;
        }

      }

    }

    common.hit(target, damagePoints, exports);

  }

  function animate() {

    if (data.dead) {

      if (dom.o) {
        sprites.moveWithScrollOffset(exports);
      }

      return (!data.deadTimer && !dom.o);

    }

    data.gravity *= 1.1;

    moveTo(data.x + data.vX, data.y + Math.min(data.vY + data.gravity, data.vYMax));

    // hit bottom?
    if (data.y - data.height > game.objects.view.data.battleField.height) {
      data.hasHitGround = true;
      die({
        hidden: data.hidden,
        bottomAlign: true
      });
    }

    collisionTest(collision, exports);

    // bombs are animated by their parent - e.g., helicopters,
    // and not the main game loop. so, on-screen status is checked manually here.
    sprites.updateIsOnScreen(exports);

    // notify caller if dead, and node has been removed.
    return (data.dead && !data.deadTimer && !dom.o);

  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className
    });

    // parent gets transform position, subsprite gets rotation animation
    dom.o.appendChild(sprites.makeSubSprite());

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);
    
  }

  function initBomb() {

    initDOM();

    if (data.hidden) return;

    // TODO: don't create radar items for bombs from enemy helicopter when cloaked
    radarItem = game.objects.radar.addItem(exports, dom.o.className);

    if (data.isEnemy) {
      utils.css.add(radarItem.dom.o, css.enemy);
    }

  }

  css = common.inheritCSS({
    className: 'bomb',
    explosionLarge: 'explosion-large',
    spark: 'spark'
  });

  data = common.inheritData({
    type: 'bomb',
    parent: options.parent || null,
    parentType: options.parentType || null,
    deadTimer: null,
    extraTransforms: null,
    hasHitGround: false,
    hidden: !!options.hidden,
    isMuted: false,
    groundCollisionTest: false,
    width: 14,
    height: 12,
    halfWidth: 7,
    halfHeight: 6,
    explosionWidth: 51,
    explosionHeight: 22,
    gravity: 1,
    energy: 3,
    damagePoints: 3,
    damagePointsOnGround: 2,
    target: null,
    vX: (options.vX || 0),
    vYMax: 32,
    bottomAlign: false,
    lastAngle: 0,
    scale: null,
    domFetti: {
      colorType: 'bomb',
      elementCount: 3 + rndInt(3),
      startVelocity: 5 + rndInt(5)
    }
  }, options);

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    die,
    dom,
    init: initBomb
  };

  collision = {
    options: {
      source: exports,
      targets: undefined,
      checkTweens: true,
      hit(target) {
        // special case: bomb being hit, eventually shot down by gunfire
        if (target.data.type === TYPES.gunfire && data.energy) {
          data.energy = Math.max(0, data.energy - target.data.damagePoints);
          playSound(sounds.metalHit, exports);
          if (!data.hidden) {
            effects.inertGunfireExplosion({ exports, count: 1 + rndInt(2) });
          }
          return;
        }
        bombHitTarget(target);
      }
    },
    items: !game.objects.editor && getTypes('superBunker, bunker, tank, helicopter, balloon, van, missileLauncher, infantry, parachuteInfantry, engineer, turret, smartMissile', { exports }).concat(gameType === 'extreme' ? getTypes('gunfire', { exports }) : [])
  };

  return exports;

};

export { Bomb };