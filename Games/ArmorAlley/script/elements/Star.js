import { game } from '../core/Game.js';
import { common } from '../core/common.js';
import { oneOf, rnd } from '../core/global.js';
import { sprites } from '../core/sprites.js';

const Star = (options = {}) => {

  let css, dom, data, exports;

  function animate() {

    data.hasAnimated = true;

    const { scrollLeft } = game.objects.view.data.battleField;

    // note: "tracked" value is not the same as rendered x value.
    if (data.lastScrollLeft !== scrollLeft) {

      data.scrollDelta = scrollLeft - data.lastScrollLeft;
      data.direction = (scrollLeft >= data.lastScrollLeft ? 1 : -1);
      data.lastScrollLeft = scrollLeft;
      
      // only adjust the new position for parallax effect if we're on-screen
      if (data.isOnScreen) {

        // fake the new "X" position
        data.x += (data.scrollDelta * data.parallax);
        
        var circleY = (game.objects.view.data.browser.isPortrait ? -5 : -16) * Math.sin(((scrollLeft - data.x) / game.objects.view.data.browser.width) * Math.PI);

        const chopperOffset = ((game.players.local.data.y / game.players.local.data.yMax) * 4);

        const scale = 1 + ((data.y / game.players.local.data.yMax) * 0.1);

        data.extraTransforms = `scale3d(${scale}, ${scale}, 1)`;

        sprites.setTransformXY(exports, exports.dom.o, `${exports.data.x}px`, `${exports.data.y + circleY - chopperOffset}px`, exports.data.extraTransforms);

      }

    }

    // stars should never die.
    return (data.dead && !dom.o);

  }

  function isOnScreenChange(onScreen) {

    if (!onScreen) {

      // if going off-screen, then move to "the next screen" - 
      // defined as the current viewport width, in the current direction.
      const buffer = rnd(game.objects.view.data.browser.width * 0.1);

      data.originalX = parseInt(game.objects.view.data.battleField.scrollLeft, 10) + (data.direction === 1 ? game.objects.view.data.browser.width + buffer : -buffer);

    }

    // either way, "reset."
    data.x = data.originalX;

  }

  function initStar() {

    dom.o = sprites.create({
      className: css.className
    });

    dom.o.style.transformOrigin = '50% 50%';

    // rather than assign opacity (maybe $$$, more compositing work?), set colors with baked-in "brightness" values.
    dom.o.style.backgroundColor = `rgb(${data.color.map((value) => value * data.opacity).join(',')})`;

    data.originalX = data.x;
    data.originaY = data.y;

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

  }

  function reset() {

    data.lastScrollLeft = 0;
    data.x = rnd(game.objects.view.data.browser.width);
    data.originalX = data.x;

  }

  css = common.inheritCSS({
    className: 'star'
  });

  data = common.inheritData({
    type: 'star',
    width: 1,
    height: 1,
    color: oneOf([
      [255, 0, 0], // red
      [255, 165, 0], // orange
      [255, 255, 0], // yellow
      [0, 255, 0], // green
      [255, 255, 255], // white
      [0, 0, 255] // blue
    ]),
    direction: 1,
    parallax: 0.65 + rnd(0.3),
    opacity: 0.15 + rnd(0.65),
    lastScrollLeft: 0
  }, options);

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    dom,
    isOnScreenChange,
    reset
  };

  initStar();

  return exports;

};

export { Star };