import { common } from '../core/common.js';
import { collisionTest } from '../core/logic.js';
import { TYPES, getTypes } from '../core/global.js';
import { sprites } from '../core/sprites.js';

const Flame = (options = {}) => {

    let css, data, dom, collision, exports;

    function die(force) {

      // aieee!

      if (data.dead && !force) return;

      data.dead = true;

      sprites.removeNodesAndUnlink(exports);

      common.onDie(exports);

    }

    function animate() {

      sprites.moveWithScrollOffset(exports);

      if (data.dead) return true;

      if (!data.expired && data.frameCount > data.expireFrameCount) {
        die();
      }

      data.frameCount++;

      if (!data.isInert) {
        collisionTest(collision, exports);
      }

      // notify caller if now dead and can be removed.
      return (data.dead && !dom.o);

    }

    function initDOM() {

      dom.o = sprites.create({
        className: css.className
      });
      
    }
  
    function initFlame() {

      initDOM();

      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`, data.extraTransforms);

    }

    css = common.inheritCSS({
      className: 'flame'
    });

    data = common.inheritData({
      type: 'flame',
      parent: options.parent || null,
      parentType: options.parentType || null,
      isEnemy: options.isEnemy,
      frameCount: 0,
      extraTransforms: (options.isEnemy ? 'scaleX(-1)' : ''),
      expireFrameCount: options.expireFrameCount || 2,
      width: 32,
      height: 18,
      damagePoints: options.damagePoints || 1,
      target: null,
    }, options);

    // offset left 100% if parent tank is an enemy, so we line up with the tank
    if (options.isEnemy) {
      data.x -= data.width;
    }

    dom = {
      o: null
    };

    exports = {
      animate,
      data,
      dom,
      die,
      init: initFlame
    };

    collision = {
      options: {
        source: exports,
        targets: undefined,
        hit(target) {
          if (data.damagePoints) {
            // hit once, then remain until the object animation has completed.
            common.hit(target, data.damagePoints, exports);
            // nullify this object unless infantry / engineers, so we don't hit e.g., a super-bunker repeatedly.
            if (target.data.type !== TYPES.infantry) {
              data.damagePoints = 0;
            }
          }
        }
      },
      // if unspecified, use default list of items which flames can hit.
      items: options.collisionItems || getTypes('infantry, parachuteInfantry, engineer, helicopter, endBunker, superBunker, turret', { exports })
    };

    return exports;

  };

  export { Flame }