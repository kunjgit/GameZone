import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { oneOf, TYPES } from '../core/global.js';
import { common } from '../core/common.js';
import { sprites } from '../core/sprites.js';

const Cornholio = (options = {}) => {

  let css, data, dom, exports, height;

  function setVisible(visible) {

    if (data.visible === visible) return;

    data.visible = visible;

    utils.css.addOrRemove(dom.o, data.visible, css.visible);

  }

  function setActiveSound(sound, turretFiring = null) {

    // if sound provided, we are speaking.
    // otherwise, rely on provided "turret firing" state.
    setSpeaking(sound ? true : !!turretFiring);

  }

  function setSpeaking(speaking) {

    if (data.speaking === speaking) return;

    data.speaking = speaking;

    if (data.speaking) {
      data.lastSpeaking = oneOf(css.speaking);
    }

    utils.css.addOrRemove(dom.o, speaking, data.lastSpeaking);

  }

  function animate() {

    if (!data.visible) return;

    sprites.moveWithScrollOffset(exports);

  }

  function initDOM() {

    const isEnemy = (data.isEnemy ? css.enemy : false);

    dom.o = sprites.create({
      className: css.className,
      isEnemy
    });

    dom.oSubSprite = sprites.makeSubSprite();
    dom.o.appendChild(dom.oSubSprite);

  }

  height = 33.6;

  css = common.inheritCSS({
    className: TYPES.cornholio,
    cornholio: 'cornholio',
    visible: 'visible',
    speaking: ['threatening', 'bow-down']
  });

  data = common.inheritData({
    type: TYPES.cornholio,
    bottomAligned: true,
    width: 12,
    height,
    visible: null,
    lastSpeaking: null,
    lastSound: null,
    x: options.x || 0,
    y: game.objects.view.data.world.height - height - 2,
    xOffset: 0,
    yOffset: 2
  }, options);

  dom = {
    o: null,
    oSubSprite: null
  };

  exports = {
    animate,
    data,
    dom,
    hide: () => setVisible(false),
    init: initDOM,
    show: () => setVisible(true),
    setActiveSound,
    setSpeaking
  };

  return exports;

};

export { Cornholio };