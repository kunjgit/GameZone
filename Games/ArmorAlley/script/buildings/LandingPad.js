import { getTypes, rndInt, worldHeight } from '../core/global.js';
import { collisionTest } from '../core/logic.js';
import { common } from '../core/common.js';
import { sprites } from '../core/sprites.js';

const LandingPad = (options = {}) => {

  let css, dom, data, collision, exports;

  function animate() {

    sprites.moveWithScrollOffset(exports);

    collisionTest(collision, exports);

  }

  function isOnScreenChange(isOnScreen) {

    if (!isOnScreen) return;

    setWelcomeMessage();

  }

  function setWelcomeMessage() {

    let eat, drink;

    eat = data.edible[rndInt(data.edible.length)];
    drink = data.drinkable[rndInt(data.drinkable.length)];

    data.welcomeMessage = `-* 🚁 Welcome to ${data.name}${' ⛽🛠️ *-<br />Today\'s feature: %s1 %s2 &middot; Enjoy your stay.'.replace('%s1', drink).replace('%s2', eat)}`;

  }

  function initLandingPad() {

    dom.o = sprites.create({
      id: data.id,
      className: css.className
    });

    dom.o.appendChild(sprites.makeTransformSprite());

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

    setWelcomeMessage();
  }

  css = common.inheritCSS({
    className: 'landing-pad'
  });

  data = common.inheritData({
    type: 'landing-pad',
    name: options.name,
    isKennyLoggins: options.isKennyLoggins,
    isMidway: options.isMidway,
    isNeutral: true,
    energy: 2,
    width: 81,
    height: 4,
    y: worldHeight - 3,
    edible: ['🍔', '🍑', '🍒', '🍆', '🥑', '🍄', '🍖', '🍟', '🌭', '🌮', '🌯', '🍲', '🍿', '🍣', '🐟', '🥡'],
    drinkable: ['🍺', '🍻', '🍹', '☕', '🍾', '🍷', '🍸', '🥂', '🥃']
  }, options);

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    dom,
    init: initLandingPad,
    isOnScreenChange
  };

  collision = {
    options: {
      source: exports,
      targets: undefined,
      hit(target) {
        if (!target.onLandingPad) return;
        /**
         * slightly hackish: landing pad shape doesn't take full height of bounding box.
         * once a "hit", measure so that helicopter aligns with bottom of world.
         * 
         * additionally: only consider a "hit" IF the helicopter is moving down, e.g., data.vY > 0.
         * otherwise, ignore this event and allow helicopter to leave.
         */
        if (target.data.vY >= 0 && !target.data.dead) {
          // "friendly landing pad HIT"
          if (target.data.y + target.data.height >= worldHeight) {
            // provide the "active" landing pad
            target.onLandingPad(exports);
          }
        } else {
          // "friendly landing pad MISS"
          target.onLandingPad(false);
        }
      },
    },
    items: getTypes('helicopter:all', { exports })
  };

  return exports;

};

export { LandingPad };