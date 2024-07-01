import { rnd, rndInt, plusMinus } from '../core/global.js';
import { common } from '../core/common.js';
import { poolBoy } from '../core/poolboy.js';
import { sprites } from '../core/sprites.js';

const Smoke = (options = {}) => {

  let css, dom, data, exports;

  function die() {

    if (data.dead) return;

    data?.domPool?.release();
    data.domPool = null;

    sprites.nullify(dom);

    data.dead = true;

  }

  function animate() {

    let scale = null;

    // move?
    if (data.vX !== null && data.vY !== null) {

      data.x += (data.vX * (options.fixedSpeed ? 1 : Math.max(0.9, Math.random())));
      data.y += (data.vY * (options.fixedSpeed ? 1 : Math.max(0.9, Math.random()))) + data.gravity;

      if (options.deceleration) {
        data.vX *= options.deceleration;
        data.vY *= options.deceleration;
        if (options.increaseDeceleration !== undefined) {
          options.deceleration *= options.increaseDeceleration;
        }
      }

      // scale applied if also fading out
      if (data.isFading) {
        scale = 1 - (data.fadeFrame / data.fadeFrames);
      } else {
        scale = data.baseScale;
        if (data.rotation) {
          data.rotation += data.rotationAmount;
        }
      }

      if (scale) {
        scale = `scale3d(${[scale, scale, 1].join(', ')})`;
      }

      if (data.isOnScreen) {
        sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`, (data.rotation ? `rotate3d(0, 0, 1, ${data.rotation}deg) ` : '') + (scale ? ` ${scale}` : ''));
      }

    }

    // animate and fade
    if (data.frameCount % data.spriteFrameModulus === 0) {

      // first, animate through sprite. then, fade opacity.
      if (data.spriteFrame < data.spriteFrames) {
        // advance smoke sprite, 0% -> -100% (top-to-bottom)
        if (data.isOnScreen) {
          sprites.setTransformXY(exports, dom.oTransformSprite, `0%`, `${-data.spriteFrame * data.spriteOffsetPerFrame}px`);
        }
        data.spriteFrame++;
      } else {
        data.isFading = true;
      }

    }

    // if fading, animate every frame.
    if (data.isFading) {
      data.fadeFrame++;

      if (data.fadeFrame < data.fadeFrames && data.isOnScreen) {
        dom.o._style.setProperty('opacity', 1 - (data.fadeFrame / data.fadeFrames));
      }

      if (data.fadeFrame > data.fadeFrames) {
        // animation finished
        die();
      }
    }

    data.frameCount++;

    return (data.dead && !dom.o && !data.domPool);

  }

  function initSmoke() {

    data.domPool = poolBoy.request({ className: css.className }, { transformSprite: true });

    // merge domPool dom o + transform nodes
    Object.assign(dom, data.domPool.dom);

    // realistically, some smoke should be behind objects
    dom.o.style.zIndex = (Math.random() >= 0.5) ? 0 : 4;

    // keep things centered when scaling
    dom.o._style.setProperty('transform-origin', '50% 50%');

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y-100}px`);

  }

  css = common.inheritCSS({
    className: 'smoke'
  });

  data = common.inheritData({
    type: 'smoke',
    frameCount: 0,
    animateModulus: 1,
    spriteFrameModulus: (options.spriteFrameModulus || 2),
    spriteFrame: (options.spriteFrame !== undefined ? options.spriteFrame : rndInt(6)),
    spriteFrames: 12,
    spritePixelHeight: 108, // real sprite is 216, but we render half-size.
    spriteOffsetPerFrame: 108 / 12,
    isFading: false,
    fadeFrame: 0,
    fadeFrames: 8,
    direction: 0,
    width: 9,
    height: 9,
    gravity: options.gravity !== undefined ? options.gravity : 0.5,
    rotation: rnd(360),
    rotationAmount: plusMinus(rnd(5)),
    // by default, allow some randomness
    baseScale: options.baseScale || (0.65 + rnd(0.35)),
    // hackish: use provided, or default values.
    vX: options.vX !== undefined ? options.vX : plusMinus(rnd(3)),
    vY: options.vY !== undefined ? options.vY : -rnd(3),
    domPool: null
  }, options);

  dom = {
    o: null,
    oTransformSprite: null
  };

  exports = {
    animate,
    data,
    dom,
    die
  };

  initSmoke();

  return exports;

};

export { Smoke };