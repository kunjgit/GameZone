import { rndInt, worldWidth, worldHeight, rng, TYPES, rngInt } from '../core/global.js';
import { common } from '../core/common.js';
import { zones } from '../core/zones.js';
import { sprites } from '../core/sprites.js';
import { net } from '../core/network.js';
import { game } from '../core/Game.js';

const cloudTypes = [
  {
    className: 'cloud1',
    width: 102,
    height: 29
  }, {
    className: 'cloud2',
    width: 116,
    height: 28
  }, {
    className: 'cloud3',
    width: 125,
    height: 34
  }
];

const Cloud = (options = {}) => {

  const cloudData = cloudTypes[rngInt(cloudTypes.length, TYPES.cloud)];

  const { className, width, height } = cloudData;

  let css, dom, data, exports;
  let type = TYPES.cloud;

  function animate() {

    data.frameCount++;

    if (data.frameCount % data.windModulus === 0) {

      // TODO: improve, limit on axes

      data.windOffsetX += (data.x < 0 || rng(1, type) > 0.5 ? 0.25 : -0.25);

      data.windOffsetX = Math.max(-3, Math.min(3, data.windOffsetX));

      data.windOffsetY += (data.y < 72 || rng(1, type) > 0.5 ? 0.1 : -0.1);

      data.windOffsetY = Math.max(-0.5, Math.min(0.5, data.windOffsetY));

      // and randomize
      if (!net.active) {
        data.windModulus = 16 + rndInt(16);
      }

    }

    // prevent clouds drifting out of the world, by shifting the wind
    // (previously: hard bounce / reverse, didn't look right.)
    if (data.x + data.width > worldWidth) {
      data.windOffsetX = Math.max(data.windOffsetX - 0.05, -3);
    } else if (data.x < 0) {
      data.windOffsetX = Math.min(data.windOffsetX + 0.05, 3);
    }

    if ((data.windOffsetY > 0 && worldHeight - data.y - 32 < 64) || (data.windOffsetY < 0 && data.y < 64)) {
      // reverse gears
      data.windOffsetY *= -1;
    }

    data.x += data.windOffsetX;
    data.y += data.windOffsetY;

    zones.refreshZone(exports);

    sprites.moveWithScrollOffset(exports);

  }

  function initDOM() {

    dom.o = sprites.create({
      className: css.className,
      id: data.id
    });

  }

  function initCloud() {

    initDOM();

    sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`);

    // cloud debugging mode
    if (window.location.href.match(/debugClouds/i)) {
      game.objects.radar.addItem(exports, dom.o.className);
    }

  }

  css = common.inheritCSS({ className });

  data = common.inheritData({
    type,
    isNeutral: true,
    frameCount: 0,
    windModulus: 16,
    windOffsetX: 0,
    windOffsetY: 0,
    verticalDirection: 0.33,
    verticalDirectionDefault: 0.33,
    y: options.y || (96 + parseInt((worldHeight - 96 - 128) * rng(1, type), 10)),
    width,
    halfWidth: width / 2,
    height,
    halfHeight: height / 2,
    noEnergyStatus: true
  }, options);

  dom = {
    o: null
  };

  exports = {
    animate,
    data,
    dom,
    init: initCloud
  };

  return exports;

};

export { Cloud };